import { esc, fetchJson } from './lib.js';
import { ICON_HTML } from './icons.jsx';

/* Imperative interaction layer. React owns all rendering; this module keeps the
   small amount of event glue (global click delegation + the search input) that
   drives modal/drawer visibility and toasts, preserving the exact behaviour the
   original vanilla implementation had. */

export function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

function openDrawer() {
  const drawer = document.getElementById('drawer');
  if (drawer) drawer.classList.add('open');
  const overlay = document.querySelector('.overlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAll() {
  const drawer = document.getElementById('drawer');
  if (drawer) drawer.classList.remove('open');
  document.querySelectorAll('.overlay').forEach((o) => o.classList.remove('open'));
  const sm = document.getElementById('search-modal');
  if (sm) sm.classList.remove('open');
  const am = document.getElementById('auth-modal');
  if (am) am.classList.remove('open');
  document.body.style.overflow = '';
}

function openSearch() {
  const sm = document.getElementById('search-modal');
  if (!sm) return;
  sm.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const input = document.getElementById('search-input');
    if (input) input.focus();
  }, 60);
}

function openAuth() {
  const am = document.getElementById('auth-modal');
  if (am) am.classList.add('open');
}

export function bindInteractions() {
  if (bindInteractions.done) return;
  bindInteractions.done = true;

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (el) {
      const action = el.dataset.action;
      if (action === 'menu') openDrawer();
      else if (action === 'editions') openDrawer();
      else if (action === 'close-all') closeAll();
      else if (action === 'search') openSearch();
      else if (action === 'close-search') closeAll();
      else if (action === 'account') {
        e.preventDefault();
        closeAll();
        openAuth();
      } else if (action === 'close-auth') closeAll();
      else if (action === 'subscribe') {
        location.href = 'newsletters.html';
      } else if (action === 'do-signin') {
        e.preventDefault();
        closeAll();
        toast('Signed in (demo) — My Feed & bookmarks unlocked');
      } else if (action === 'bookmark') {
        el.classList.toggle('chip--saved');
        const on = el.classList.contains('chip--saved');
        el.innerHTML = `${ICON_HTML.bookmark} ${on ? 'Saved' : 'Bookmark'}`;
        toast(on ? 'Story saved to My Feed' : 'Bookmark removed');
      } else if (action === 'share') {
        const panel = document.getElementById('share-panel');
        if (panel) panel.classList.toggle('hide');
        else toast('Share links: WhatsApp · Telegram · Facebook · X · Email · Copy link');
      } else if (action === 'copy-link') {
        try {
          navigator.clipboard && navigator.clipboard.writeText(location.href);
        } catch (err) {
          /* noop */
        }
        toast('Link copied');
      }
      return;
    }

    const q = e.target.closest('[data-q]');
    if (q) {
      location.href = 'search.html?q=' + encodeURIComponent(q.dataset.q);
      return;
    }

    const g = e.target.closest('[data-goto]');
    if (g) {
      location.href = 'search.html?q=' + g.dataset.goto;
    }
  });
}

let suggestTimer = null;

export function bindSearchInput(input) {
  if (!input || bindSearchInput.done) return;
  bindSearchInput.done = true;

  input.addEventListener('input', () => {
    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(async () => {
      const q = input.value.trim();
      const box = document.getElementById('search-suggest');
      if (!box) return;
      if (!q) {
        box.innerHTML = '';
        return;
      }
      try {
        const hits = await fetchJson('/api/search-suggest?q=' + encodeURIComponent(q));
        box.innerHTML = hits.length
          ? hits
              .map(
                (h) =>
                  `<div class="drawer__link" style="cursor:pointer" data-goto="${encodeURIComponent(h.t)}"><span>${esc(h.t)}</span><span class="meta">${esc(h.type)} · ${esc(h.cat)}</span></div>`
              )
              .join('')
          : '<p class="meta" style="padding:10px 0">No matches. Press Enter to see all results.</p>';
      } catch (err) {
        box.innerHTML = '';
      }
    }, 150);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') location.href = 'search.html?q=' + encodeURIComponent(input.value);
  });
}
