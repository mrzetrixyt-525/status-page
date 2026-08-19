<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MrZetrix Status</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:#e5e7eb;min-height:100vh;background:#0f172a}
.bg{position:fixed;inset:0;z-index:-2;background:linear-gradient(135deg,#0f172a,#1e293b);background-size:cover;background-position:center}
.overlay{position:fixed;inset:0;z-index:-1;background:rgba(2,6,23,.58);backdrop-filter:blur(8px)}
.wrap{max-width:1050px;margin:auto;padding:28px 18px 60px}.top{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:28px}
.brand{font-size:28px;font-weight:800}.muted{color:#94a3b8}.pill{padding:9px 13px;border:1px solid #334155;border-radius:999px;background:#0f172a99}
.hero{padding:34px;border:1px solid #334155;border-radius:24px;background:#0f172acc;box-shadow:0 20px 60px #0005;margin-bottom:22px}
.hero h1{font-size:clamp(30px,6vw,52px);margin:0 0 10px}.hero p{margin:0;color:#94a3b8}
.banner{margin-top:24px;padding:16px;border-radius:15px;background:#052e1a;border:1px solid #166534;color:#bbf7d0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.card{padding:20px;border:1px solid #334155;border-radius:18px;background:#0f172acc}.name{font-weight:700;font-size:18px}.row{display:flex;justify-content:space-between;gap:15px;margin:12px 0}.status{font-weight:800}.up{color:#34d399}.down{color:#fb7185}.unknown{color:#fbbf24}
.dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:7px;background:currentColor}.footer{text-align:center;color:#64748b;margin-top:35px;font-size:13px}
@media(max-width:600px){.top{align-items:flex-start;flex-direction:column}.hero{padding:24px}.wrap{padding:18px 12px 45px}}
</style>
</head>
<body>
<div class="bg" id="bg"></div><div class="overlay"></div>
<main class="wrap">
<div class="top"><div><div class="brand" id="brand">MrZetrix Status</div><div class="muted" id="company">Minecraft Hosting</div></div><div class="pill" id="checked">Checking…</div></div>
<section class="hero"><h1 id="headline">All Systems Operational</h1><p>Live service status and uptime information.</p><div class="banner" id="banner">Monitoring is active.</div></section>
<section class="grid" id="services"></section>
<div class="footer">Made By MrZetrix</div>
</main>
<script>
async function load(){
 try{
  const r=await fetch('/api/status',{cache:'no-store'}),d=await r.json(),s=d.settings;
  document.getElementById('brand').textContent=s.website_name||'MrZetrix Status';
  document.getElementById('company').textContent=s.company_name||'Minecraft Hosting';
  document.getElementById('headline').textContent=d.summary.down?'Some Systems Are Experiencing Issues':'All Systems Operational';
  document.getElementById('banner').textContent=d.summary.down?`${d.summary.down} service(s) currently down.`:`${d.summary.up}/${d.summary.total} monitored service(s) operational.`;
  document.getElementById('checked').textContent='Updated '+new Date().toLocaleTimeString();
  const bg=document.getElementById('bg');
  if(s.background_type==='image'&&s.background_image_url) bg.style.backgroundImage=`url("${s.background_image_url}")`;
  else if(s.background_type==='solid') bg.style.background=s.background_color_1;
  else bg.style.background=`linear-gradient(135deg,${s.background_color_1},${s.background_color_2})`;
  document.getElementById('services').innerHTML=d.monitors.map(m=>{
    const c=m.current_status==='up'?'up':m.current_status==='down'?'down':'unknown';
    return `<article class="card"><div class="name">${esc(m.name)}</div>
    <div class="row"><span class="muted">Status</span><span class="status ${c}"><span class="dot"></span>${c.toUpperCase()}</span></div>
    <div class="row"><span class="muted">Uptime</span><b>${m.uptime_percentage}%</b></div>
    <div class="row"><span class="muted">Response</span><b>${m.last_response_time==null?'—':m.last_response_time+' ms'}</b></div>
    <div class="muted" style="font-size:13px">${m.last_checked?'Last checked '+new Date(m.last_checked).toLocaleString():'Not checked yet'}</div></article>`
  }).join('');
 }catch(e){document.getElementById('headline').textContent='Status Temporarily Unavailable';document.getElementById('banner').textContent='The monitoring service could not be reached.'}
}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
load();setInterval(load,15000);
</script>
</body></html>
