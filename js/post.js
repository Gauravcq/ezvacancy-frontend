import { posts } from './data.js';
import { formatDate, qs, toggleBookmark, isBookmarked, toast, share, copyToClipboard } from './ui.js';

const slug = qs('slug');
const post = posts.find(p => p.slug === slug);

const themeToggle = document.getElementById('themeToggle');
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme:dark)').matches)) document.documentElement.classList.add('dark');
if (themeToggle) themeToggle.addEventListener('click', ()=>{ document.documentElement.classList.toggle('dark'); localStorage.theme = document.documentElement.classList.contains('dark')?'dark':'light'; themeToggle.textContent = document.documentElement.classList.contains('dark') ? '🌞' : '🌙'; });

if (!post) {
  document.getElementById('post').innerHTML = '<div class="p-4">Post not found.</div>';
} else {
  document.title = `${post.title} — EZ Vacancy`;
  document.getElementById('title').textContent = post.title;
  document.getElementById('meta').textContent = `${post.sub} • ${post.type.toUpperCase()} • ${formatDate(post.date)}`;
  document.getElementById('crumbCat').textContent = post.type;
  document.getElementById('crumbTitle').textContent = post.exam;

  const btnApply = document.getElementById('btnApply');
  const btnNotice = document.getElementById('btnNotice');
  const btnPdf = document.getElementById('btnPdf');
  if (post.apply) { btnApply.href = post.apply; btnApply.classList.remove('hidden'); }
  if (post.notice) { btnNotice.href = post.notice; btnNotice.classList.remove('hidden'); }
  if (post.pdf) { btnPdf.href = post.pdf; btnPdf.classList.remove('hidden'); }

  document.getElementById('content').innerHTML = post.content || '<p>All important links are provided above. Visit the official notification for complete details.</p>';

  const tables = document.getElementById('tables');
  if (post.importantDates) {
    const rows = post.importantDates.map(r => `<tr><td class="px-3 py-2 border">${r[0]}</td><td class="px-3 py-2 border">${r[1]}</td></tr>`).join('');
    tables.insertAdjacentHTML('beforeend', `<div><div class="font-semibold mb-2">Important Dates</div><table class="w-full text-sm border border-slate-200 dark:border-slate-700">${rows}</table></div>`);
  }
  if (post.eligibility || post.age) {
    tables.insertAdjacentHTML('beforeend', `<div><div class="font-semibold mb-2">Eligibility</div><div class="text-sm text-slate-600 dark:text-slate-300">${post.eligibility||''} ${post.age?('<br/>Age: '+post.age):''}</div></div>`);
  }

  const favBtn = document.getElementById('btnFav');
  const updateFavBtn = () => favBtn.textContent = isBookmarked(post.slug) ? '⭐ Saved' : '☆ Save';
  updateFavBtn();
  favBtn.addEventListener('click', () => { const saved = toggleBookmark(post.slug); toast(saved?'Added to favorites':'Removed'); updateFavBtn(); });

  document.getElementById('btnShare').addEventListener('click', ()=> share({ title:post.title, text:post.exam, url:location.href }).then(()=>toast('Shared')).catch(()=>{}));
  document.getElementById('btnCopy').addEventListener('click', ()=> copyToClipboard(location.href).then(()=>toast('Link copied')));

  const related = posts.filter(p => p.slug!==post.slug && (p.sub===post.sub || p.type===post.type)).slice(0,6);
  document.getElementById('related').innerHTML = related.map(p => `
    <a href="post.html?slug=${p.slug}" class="block rounded border border-slate-200 dark:border-slate-800 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60">
      <div class="text-sm font-medium">${p.title}</div>
      <div class="text-[11px] text-slate-500">${p.sub} • ${formatDate(p.date)}</div>
    </a>`).join('');

  const ld = { "@context":"https://schema.org", "@type":"NewsArticle", "headline":post.title, "datePublished":post.date, "author":{"@type":"Organization","name":"EZ Vacancy"} };
  const s = document.createElement('script'); s.type='application/ld+json'; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
}