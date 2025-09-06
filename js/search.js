import { posts } from './data.js';

const qEl = document.getElementById('q');
const typeEl = document.getElementById('type');
const scopeEl = document.getElementById('scope');
const form = document.getElementById('searchForm');
const out = document.getElementById('results');
const count = document.getElementById('count');

const params = new URLSearchParams(location.search);
qEl.value = params.get('q') || '';
if (params.get('type')) typeEl.value = params.get('type');
if (params.get('scope')) scopeEl.value = params.get('scope');

function formatDate(iso) { const d = new Date(iso); return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }

function run() {
  const q = qEl.value.trim().toLowerCase();
  const type = typeEl.value;
  const scope = scopeEl.value;
  let results = posts;
  if (type) results = results.filter(p => p.type === type);
  if (scope) results = results.filter(p => p.category === scope);
  if (q) results = results.filter(p => [p.title,p.exam,p.sub,p.type].join(' ').toLowerCase().includes(q));
  results = results.sort((a,b)=> new Date(b.date)-new Date(a.date));

  count.textContent = `${results.length} results`;
  out.innerHTML = results.map(p => `
    <li class="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60">
      <a href="post.html?slug=${p.slug}" class="block">
        <div class="font-medium">${p.title}</div>
        <div class="text-xs text-slate-500">${p.sub} • ${p.type.toUpperCase()} • ${formatDate(p.date)}</div>
      </a>
    </li>
  `).join('') || `<li class="p-4 text-slate-500 text-sm">No results</li>`;
}
form.addEventListener('submit', (e)=>{ e.preventDefault(); run(); history.replaceState({},'',`?q=${encodeURIComponent(qEl.value)}&type=${typeEl.value}&scope=${scopeEl.value}`); });
run();