<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title id="pageTitle">MrZetrix Status Admin</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
body{font-family:Inter,system-ui,sans-serif}.glass{background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.5)}
.nav{display:flex;align-items:center;padding:12px 16px;margin:5px 12px;border-radius:12px;color:#6b7280;transition:.2s;text-decoration:none}.nav:hover{background:#f3f4f6;color:#111827}.nav.active{background:#3b82f6;color:#fff}.nav i{width:22px;margin-right:10px}
.card{transition:.2s}.card:hover{transform:translateY(-2px)}.grad{color:#fff;background:linear-gradient(135deg,#667eea,#764ba2)}.green{background:linear-gradient(135deg,#4facfe,#00f2fe)}.orange{background:linear-gradient(135deg,#fa709a,#fee140)}.red{background:linear-gradient(135deg,#ff6b6b,#ffa726)}
@media(max-width:800px){#sidebar{width:72px!important}#sidebar .label,#sidebar .brandtext{display:none}#main{margin-left:72px!important}.nav{justify-content:center}.nav i{margin:0}}
</style>
</head>
<body class="bg-gray-50 min-h-screen">
<aside id="sidebar" class="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-lg z-40">
<div class="p-5 border-b flex items-center gap-3"><div class="bg-blue-500 text-white p-2 rounded-lg"><i class="fas fa-heartbeat"></i></div><b class="brandtext text-xl" id="adminTitle">MrZetrix Status</b></div>
<nav class="mt-5">
<a href="#" class="nav active" data-page="dashboard"><i class="fas fa-chart-pie"></i><span class="label">Dashboard</span></a>
<a href="#" class="nav" data-page="monitors"><i class="fas fa-server"></i><span class="label">Monitors</span></a>
<a href="#" class="nav" data-page="settings"><i class="fas fa-cog"></i><span class="label">Settings</span></a>
<a href="/" target="_blank" class="nav"><i class="fas fa-external-link-alt"></i><span class="label">Live Status</span></a>
</nav>
</aside>
<main id="main" class="ml-72 min-h-screen">
<header class="glass sticky top-0 z-30 px-6 py-4 flex justify-between items-center"><div><h1 id="pageHeader" class="text-2xl font-bold">Dashboard</h1><p id="pageDesc" class="text-gray-500">Monitor your services and systems</p></div><div class="text-right"><div class="text-xs text-gray-500">Last check</div><b id="lastCheck">—</b></div></header>
<div class="p-5 md:p-7">
<section id="dashboardPage">
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
<div class="grad rounded-2xl p-5 card"><div class="text-3xl font-bold" id="total">0</div>Total Monitors</div>
<div class="green rounded-2xl p-5 card text-white"><div class="text-3xl font-bold" id="active">0</div>Active Monitors</div>
<div class="orange rounded-2xl p-5 card text-white"><div class="text-3xl font-bold" id="up">0</div>Services Up</div>
<div class="red rounded-2xl p-5 card text-white"><div class="text-3xl font-bold" id="down">0</div>Services Down</div>
</div>
<div class="grid lg:grid-cols-2 gap-6">
<div class="glass rounded-2xl p-6"><h2 class="text-xl font-bold mb-4">Quick Add Monitor</h2><form id="quick" class="space-y-3">
<input id="qname" required placeholder="Service Name" class="w-full border rounded-lg p-3">
<input id="qurl" required type="url" placeholder="https://example.com" class="w-full border rounded-lg p-3">
<select id="qtype" class="w-full border rounded-lg p-3"><option>website</option><option>api</option><option>server</option><option>node</option><option>wings</option><option>panel</option><option>vps</option></select>
<button class="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold">Add Monitor</button></form></div>
<div class="glass rounded-2xl p-6"><h2 class="text-xl font-bold mb-4">System Status</h2><div class="space-y-3 text-sm"><div class="flex justify-between"><span>Monitoring engine</span><b class="text-green-600">Running</b></div><div class="flex justify-between"><span>Next automatic check</span><b id="nextCheck">—</b></div><div class="flex justify-between"><span>Database</span><b class="text-green-600">Local JSON</b></div></div></div>
</div>
</section>
<section id="monitorsPage" class="hidden"><div class="flex flex-wrap justify-between gap-3 mb-5"><div><h2 class="text-2xl font-bold">Service Monitors</h2><p class="text-gray-500">Manage live HTTP monitors.</p></div><button id="checkAll" class="bg-green-600 text-white px-5 py-3 rounded-lg"><i class="fas fa-sync mr-2"></i>Check All Now</button></div>
<div class="glass rounded-2xl p-4 mb-5 flex flex-wrap gap-3"><input id="search" placeholder="Search..." class="border rounded-lg p-2 flex-1 min-w-40"><select id="filter" class="border rounded-lg p-2"><option value="all">All</option><option value="up">Up</option><option value="down">Down</option><option value="paused">Paused</option></select></div>
<div id="grid" class="grid md:grid-cols-2 xl:grid-cols-3 gap-5"></div></section>
<section id="settingsPage" class="hidden"><h2 class="text-2xl font-bold mb-5">Settings</h2>
<div class="grid lg:grid-cols-2 gap-6"><div class="glass rounded-2xl p-6"><h3 class="text-xl font-bold mb-4">General</h3><form id="settings" class="space-y-3">
<input id="website_name" placeholder="Website Name" class="w-full border rounded-lg p-3"><input id="company_name" placeholder="Company Name" class="w-full border rounded-lg p-3"><input id="admin_title" placeholder="Admin Title" class="w-full border rounded-lg p-3"><input id="refresh_interval" type="number" min="10000" placeholder="Refresh interval (ms)" class="w-full border rounded-lg p-3">
<select id="background_type" class="w-full border rounded-lg p-3"><option value="solid">Solid</option><option value="gradient">Gradient</option><option value="image">Image</option></select>
<div class="grid grid-cols-2 gap-3"><input id="background_color_1" type="color" class="w-full h-12"><input id="background_color_2" type="color" class="w-full h-12"></div>
<input id="background_image_url" placeholder="Background image URL" class="w-full border rounded-lg p-3"><select id="background_blur" class="w-full border rounded-lg p-3"><option>none</option><option>sm</option><option>md</option><option>lg</option></select>
<button class="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold">Save Settings</button></form></div>
<div class="glass rounded-2xl p-6"><h3 class="text-xl font-bold mb-4">Actions</h3><div class="space-y-3"><button id="export" class="w-full bg-slate-800 text-white p-3 rounded-lg text-left"><i class="fas fa-download mr-2"></i>Export Full Data</button><button id="clear" class="w-full bg-red-600 text-white p-3 rounded-lg text-left"><i class="fas fa-trash mr-2"></i>Clear Check History</button><a href="/" target="_blank" class="block w-full bg-purple-600 text-white p-3 rounded-lg text-left"><i class="fas fa-eye mr-2"></i>Open Live Status Page</a></div></div></div></section>
</div></main>
<script>
let monitors=[],settings={};
const $=id=>document.getElementById(id);
async function api(url,opt){const r=await fetch(url,opt);if(!r.ok)throw Error((await r.json().catch(()=>({}))).error||'Request failed');return r.json()}
async function load(){
 [settings,monitors]=await Promise.all([api('/api/settings'),api('/api/monitors')]);
 $('adminTitle').textContent=settings.admin_title||'MrZetrix Status';
 $('website_name').value=settings.website_name||'';$('company_name').value=settings.company_name||'';$('admin_title').value=settings.admin_title||'';
 $('refresh_interval').value=settings.refresh_interval||30000;$('background_type').value=settings.background_type||'gradient';
 $('background_color_1').value=settings.background_color_1||'#0f172a';$('background_color_2').value=settings.background_color_2||'#1e293b';
 $('background_image_url').value=settings.background_image_url||'';$('background_blur').value=settings.background_blur||'none';
 renderDash();renderMonitors();$('lastCheck').textContent=new Date().toLocaleTimeString();$('nextCheck').textContent=new Date(Date.now()+Number(settings.refresh_interval||30000)).toLocaleTimeString();
}
function renderDash(){$('total').textContent=monitors.length;$('active').textContent=monitors.filter(x=>x.is_active).length;$('up').textContent=monitors.filter(x=>x.current_status==='up').length;$('down').textContent=monitors.filter(x=>x.current_status==='down').length}
function renderMonitors(){
 const q=$('search').value.toLowerCase(),f=$('filter').value;
 const list=monitors.filter(m=>(!q||m.name.toLowerCase().includes(q)||m.url.toLowerCase().includes(q))&&(f==='all'||(f==='paused'?!m.is_active:m.current_status===f)));
 $('grid').innerHTML=list.map(m=>`<div class="glass rounded-2xl p-5 card"><div class="flex justify-between gap-3"><div><b class="text-lg">${esc(m.name)}</b><div class="text-xs text-gray-500 break-all mt-1">${esc(m.url)}</div><span class="inline-block mt-2 bg-gray-100 rounded px-2 py-1 text-xs">${esc(m.type)}</span></div><div class="${m.current_status==='up'?'text-green-600':m.current_status==='down'?'text-red-600':'text-yellow-600'} font-bold">${m.current_status.toUpperCase()}</div></div>
<div class="mt-4 space-y-2 text-sm"><div class="flex justify-between"><span>Uptime</span><b>${m.uptime_percentage}%</b></div><div class="flex justify-between"><span>Response</span><b>${m.last_response_time==null?'—':m.last_response_time+' ms'}</b></div><div class="flex justify-between"><span>Last check</span><span>${m.last_checked?new Date(m.last_checked).toLocaleString():'Never'}</span></div></div>
<div class="mt-4 flex gap-2"><button onclick="editM(${m.id})" class="flex-1 bg-blue-50 text-blue-700 p-2 rounded">Edit</button><button onclick="toggleM(${m.id},${!m.is_active})" class="flex-1 bg-yellow-50 text-yellow-700 p-2 rounded">${m.is_active?'Pause':'Resume'}</button><button onclick="deleteM(${m.id})" class="bg-red-50 text-red-700 p-2 rounded"><i class="fas fa-trash"></i></button></div></div>`).join('')||'<div class="col-span-full text-center text-gray-500 py-10">No monitors found.</div>';
}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function editM(id){const m=monitors.find(x=>x.id===id);if(!m)return;const n=prompt('Service name:',m.name);if(n===null)return;const u=prompt('URL:',m.url);if(u===null)return;await api('/api/monitors/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:n,url:u,type:m.type,is_active:m.is_active})});await load()}
async function toggleM(id,on){await api('/api/monitors/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({is_active:on})});await load()}
async function deleteM(id){if(confirm('Delete this monitor and its history?')){await api('/api/monitors/'+id,{method:'DELETE'});await load()}}
document.querySelectorAll('.nav[data-page]').forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelectorAll('section[id$="Page"]').forEach(x=>x.classList.add('hidden'));$(a.dataset.page+'Page').classList.remove('hidden');document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));a.classList.add('active');$('pageHeader').textContent=a.dataset.page[0].toUpperCase()+a.dataset.page.slice(1);$('pageDesc').textContent=a.dataset.page==='dashboard'?'Monitor your services and systems':a.dataset.page==='monitors'?'Manage live HTTP monitors.':'Configure your status page.'});
$('quick').onsubmit=async e=>{e.preventDefault();await api('/api/monitors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:$('qname').value,url:$('qurl').value,type:$('qtype').value})});e.target.reset();await load()};
$('checkAll').onclick=async()=>{await api('/api/check-all',{method:'POST'});await load()};
$('search').oninput=renderMonitors;$('filter').onchange=renderMonitors;
$('settings').onsubmit=async e=>{e.preventDefault();const x={};['website_name','company_name','admin_title','refresh_interval','background_type','background_color_1','background_color_2','background_image_url','background_blur'].forEach(k=>x[k]=$(k).value);await api('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(x)});await load();alert('Settings saved.')};
$('export').onclick=()=>location.href='/api/export';
$('clear').onclick=async()=>{if(confirm('Clear all check history?')){await api('/api/history',{method:'DELETE'});await load()}};
load().catch(e=>alert(e.message));setInterval(load,15000);
</script>
</body></html>
