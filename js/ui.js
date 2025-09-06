export const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

const BK_KEY = 'ev_bookmarks';
export function getBookmarks() { return new Set(store.get(BK_KEY, [])); }
export function saveBookmarks(set) { store.set(BK_KEY, Array.from(set)); }
export function isBookmarked(slug) { return getBookmarks().has(slug); }
export function toggleBookmark(slug) {
  const s = getBookmarks();
  const exists = s.has(slug);
  exists ? s.delete(slug) : s.add(slug);
  saveBookmarks(s);
  return !exists;
}

export function toast(msg) {
  const el = document.getElementById('toast') || document.body.appendChild(Object.assign(document.createElement('div'), { id:'toast' }));
  el.className = 'fixed bottom-4 right-4 bg-slate-900 text-white px-3 py-2 rounded shadow-soft text-sm';
  el.textContent = msg; el.style.display='block';
  setTimeout(()=> el.style.display='none', 1800);
}

export function copyToClipboard(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return Promise.resolve();
}

export function share(data) {
  if (navigator.share) return navigator.share(data);
  return copyToClipboard(data.url || location.href);
}

export function qs(name) {
  const p = new URLSearchParams(location.search); return p.get(name);
}