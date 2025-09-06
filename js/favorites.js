import { posts } from './data.js';
import { getBookmarks, toggleBookmark, formatDate, toast } from './ui.js';

const listEl = document.getElementById('favList');
function render() {
  const ids = Array.from(getBookmarks());
  const items = posts.filter(p => ids.includes(p.slug));
  listEl.innerHTML = items.map(p => `
    <li class="px-4 py-3 flex items-start justify-between gap-3">
      <a href="post.html?slug=${p.slug}" class="flex-1">
        <div class="font-medium">${p.title}</div>
        <div class="text-xs text-slate-500">${p.sub} • ${formatDate(p.date)}</div>
      </a>
      <button data-slug="${p.slug}" class="unfav text-sm px-2 py-1 rounded border border-slate-200 dark:border-slate-700">Remove</button>
    </li>
  `).join('') || `<li class="p-4 text-slate-500 text-sm">No favorites yet.</li>`;
  listEl.querySelectorAll('.unfav').forEach(b => b.addEventListener('click', () => { toggleBookmark(b.dataset.slug); toast('Removed'); render(); }));
}
render();