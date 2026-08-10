const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { URL } = require("url");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");
const PUBLIC_DIR = path.join(ROOT, "public");
const ADMIN_DIR = path.join(ROOT, "admin");

fs.mkdirSync(DATA_DIR, { recursive: true });

const defaultDB = {
  settings: {
    website_name: "MrZetrix Status",
    company_name: "Minecraft Hosting",
    admin_title: "MrZetrix Status Admin",
    refresh_interval: 30000,
    background_type: "gradient",
    background_color_1: "#0f172a",
    background_color_2: "#1e293b",
    background_image_url: "",
    background_blur: "none"
  },
  monitors: [
    { id: 1, name: "Main Website", url: "https://example.com", type: "website", is_active: true,
      current_status: "unknown", uptime_percentage: 100, last_checked: null, last_response_time: null,
      total_checks: 0, successful_checks: 0, incidents: [] }
  ],
  checks: []
};

function loadDB() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultDB, null, 2));
      return structuredClone(defaultDB);
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return structuredClone(defaultDB);
  }
}
let db = loadDB();

function saveDB() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Static pages
app.get("/", (_, res) => res.sendFile(path.join(PUBLIC_DIR, "index.html")));
app.get("/admin", (_, res) => res.sendFile(path.join(ADMIN_DIR, "index.html")));
app.use("/assets", express.static(path.join(PUBLIC_DIR, "assets")));

function publicMonitor(m) {
  return {
    id: m.id, name: m.name, url: m.url, type: m.type, is_active: m.is_active,
    current_status: m.current_status, uptime_percentage: uptime(m),
    last_checked: m.last_checked, last_response_time: m.last_response_time
  };
}
function uptime(m) {
  if (!m.total_checks) return 100;
  return Number(((m.successful_checks / m.total_checks) * 100).toFixed(2));
}
function safeUrl(raw) {
  try {
    const u = new URL(raw);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u;
  } catch { return null; }
}

function checkUrl(rawUrl, timeoutMs = 10000) {
  return new Promise(resolve => {
    const u = safeUrl(rawUrl);
    if (!u) return resolve({ ok: false, status: 0, ms: null, error: "Invalid HTTP(S) URL" });
    const lib = u.protocol === "https:" ? https : http;
    const started = Date.now();
    const req = lib.request(u, {
      method: "GET",
      timeout: timeoutMs,
      headers: { "User-Agent": "MrZetrix-Status-Monitor/1.0", "Accept": "*/*" }
    }, res => {
      const ms = Date.now() - started;
      res.resume();
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 500, status: res.statusCode, ms });
    });
    req.on("timeout", () => req.destroy(new Error("Timeout")));
    req.on("error", e => resolve({ ok: false, status: 0, ms: Date.now() - started, error: e.message }));
    req.end();
  });
}

async function checkMonitor(m) {
  const result = await checkUrl(m.url);
  const now = new Date().toISOString();
  const previous = m.current_status;
  m.current_status = result.ok ? "up" : "down";
  m.last_checked = now;
  m.last_response_time = result.ms;
  m.total_checks = (m.total_checks || 0) + 1;
  if (result.ok) m.successful_checks = (m.successful_checks || 0) + 1;

  if (previous && previous !== "unknown" && previous !== m.current_status) {
    m.incidents = m.incidents || [];
    m.incidents.unshift({
      at: now, from: previous, to: m.current_status,
      message: result.ok ? "Service recovered" : "Service is down"
    });
    m.incidents = m.incidents.slice(0, 100);
  }
  db.checks.unshift({
    monitor_id: m.id, at: now, ok: result.ok, status: result.status,
    response_time: result.ms, error: result.error || null
  });
  db.checks = db.checks.slice(0, 5000);
  saveDB();
  return result;
}

let checking = false;
async function checkAll() {
  if (checking) return;
  checking = true;
  try {
    for (const m of db.monitors.filter(x => x.is_active)) await checkMonitor(m);
  } finally {
    checking = false;
  }
}
setTimeout(checkAll, 1000);
setInterval(checkAll, Math.max(10000, Number(db.settings.refresh_interval) || 30000));

// Public API
app.get("/api/status", (_, res) => {
  const monitors = db.monitors.filter(m => m.is_active).map(publicMonitor);
  const up = monitors.filter(m => m.current_status === "up").length;
  const down = monitors.filter(m => m.current_status === "down").length;
  res.json({
    settings: db.settings,
    monitors,
    summary: { total: monitors.length, up, down, operational: down === 0 }
  });
});

app.get("/api/incidents", (_, res) => {
  const incidents = db.monitors.flatMap(m => (m.incidents || []).map(i => ({...i, monitor: m.name, monitor_id: m.id})))
    .sort((a,b) => new Date(b.at) - new Date(a.at)).slice(0, 50);
  res.json(incidents);
});

// Admin APIs — protect /admin at the reverse proxy or add auth middleware before production use.
app.get("/api/settings", (_, res) => res.json(db.settings));
app.post("/api/settings", (req, res) => {
  const allowed = [
    "website_name","company_name","admin_title","refresh_interval",
    "background_type","background_color_1","background_color_2",
    "background_image_url","background_blur"
  ];
  for (const k of allowed) if (req.body[k] !== undefined) db.settings[k] = req.body[k];
  db.settings.refresh_interval = Math.max(10000, Number(db.settings.refresh_interval) || 30000);
  saveDB();
  res.json(db.settings);
});

app.get("/api/monitors", (_, res) => res.json(db.monitors.map(m => ({...m, uptime_percentage: uptime(m)}))));
app.post("/api/monitors", async (req, res) => {
  const { name, url, type = "website" } = req.body;
  if (!name || !safeUrl(url)) return res.status(400).json({ error: "Name and valid HTTP(S) URL are required" });
  const id = db.monitors.length ? Math.max(...db.monitors.map(m => m.id)) + 1 : 1;
  const m = { id, name: String(name).slice(0,100), url, type, is_active: true,
    current_status: "unknown", uptime_percentage: 100, last_checked: null, last_response_time: null,
    total_checks: 0, successful_checks: 0, incidents: [] };
  db.monitors.push(m); saveDB();
  await checkMonitor(m);
  res.status(201).json({...m, uptime_percentage: uptime(m)});
});
app.put("/api/monitors/:id", (req, res) => {
  const m = db.monitors.find(x => x.id === Number(req.params.id));
  if (!m) return res.status(404).json({error:"Monitor not found"});
  if (req.body.url !== undefined && !safeUrl(req.body.url)) return res.status(400).json({error:"Invalid URL"});
  if (req.body.name !== undefined) m.name = String(req.body.name).slice(0,100);
  if (req.body.url !== undefined) m.url = req.body.url;
  if (req.body.type !== undefined) m.type = req.body.type;
  if (req.body.is_active !== undefined) m.is_active = Boolean(req.body.is_active);
  saveDB(); res.json({...m, uptime_percentage: uptime(m)});
});
app.delete("/api/monitors/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = db.monitors.length;
  db.monitors = db.monitors.filter(m => m.id !== id);
  db.checks = db.checks.filter(c => c.monitor_id !== id);
  saveDB();
  res.json({ ok: db.monitors.length !== before });
});
app.post("/api/check-all", async (_, res) => { await checkAll(); res.json({ok:true}); });
app.get("/api/export", (_, res) => {
  res.setHeader("Content-Disposition", 'attachment; filename="mrzetrix-status-export.json"');
  res.json(db);
});
app.delete("/api/history", (_, res) => { db.checks = []; db.monitors.forEach(m => {m.incidents=[]}); saveDB(); res.json({ok:true}); });

app.listen(PORT, "0.0.0.0", () => console.log(`MrZetrix Status running on http://0.0.0.0:${PORT}`));