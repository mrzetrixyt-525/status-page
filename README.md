# How to Start Status-Page

A lightweight 24/7 status monitor for Minecraft hosting services, websites, APIs, Wings, Nodes, Panel and VPS health endpoints.

## 🧵 Features

- Real server-side HTTP/HTTPS checks
- Automatic monitoring loop
- Uptime percentage
- Response time
- Up/down transitions and incidents
- Add, edit, pause/resume and delete monitors
- Premium responsive public status page
- Responsive admin dashboard
- Background customization
- JSON data persistence
- Export and history clearing
- PM2 configuration for 24/7 operation
- No public login system

## ☢️ Requirements

- Node.js 18+ recommended
- npm
- PM2 for production 24/7 operation

## ⤵️ Install

```bash
npm install
npm start
```

📂 Open:

- Status: `http://YOUR_SERVER:3000/`
- Admin: `http://YOUR_SERVER:3000/admin`

## 🌈 24/7 with PM2

```bash
npm install
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup`, then:

```bash
pm2 save
```

Closing SSH/terminal will not stop the process.

## 🧰 Production security

The admin API in this starter is intentionally simple and has **no login system**, matching the requested design. Do not expose `/admin` or `/api/settings`, `/api/monitors`, `/api/check-all`, `/api/history`, and `/api/export` to the public Internet without adding authentication or restricting them at Nginx/firewall level.

For a real public deployment, put Nginx in front and protect `/admin` and write APIs with authentication.

## 📏 Real monitor behavior

The server performs real GET requests from the VPS. A URL returning HTTP 200–499 is treated as reachable; network errors/timeouts and HTTP 500+ are treated as down.

For Wings/Node/P VPS monitoring, use a reachable HTTP/HTTPS health endpoint. A raw TCP Minecraft port is not checked by this version.

## 🎊 Configuration

You can add monitor types such as:

- website
- api
- server
- node
- wings
- panel
- vps

The type is a label; the actual check is HTTP/HTTPS.

## 🔅 Important

Replace the sample `https://example.com` monitor with your real service URLs.

Made By MrZetrix
