import { createRoot } from 'react-dom/client';
import { SiteHeader, Drawer, SearchModal, AuthModal, SiteFooter } from './shell.jsx';
import { Fetcher } from './content.jsx';
import { FastApp } from './fast.jsx';
import { SearchPage } from './search.jsx';
import { SectionPage } from './section.jsx';
import { loadShell } from './store.js';

function mount(id, element) {
  const node = document.getElementById(id);
  if (node) createRoot(node).render(element);
}

function boot() {
  // Shared shell (header, drawer, search modal, auth modal, footer).
  mount('site-header', <SiteHeader />);
  mount('site-drawer', <Drawer />);
  mount('site-search', <SearchModal />);
  mount('site-auth', <AuthModal />);
  mount('site-footer', <SiteFooter />);

  // Hydrate every `[data-fetch]` container declared in the static HTML.
  document.querySelectorAll('[data-fetch]').forEach((node) => {
    createRoot(node).render(<Fetcher url={node.dataset.fetch} render={node.dataset.render} />);
  });

  // Page-specific applications (their own mount points in fast/search/section.html).
  mount('fast-app', <FastApp />);
  mount('search-app', <SearchPage />);
  mount('section-app', <SectionPage />);

  // Kick off the shared shell data fetch (nav, ticker, trending topics).
  loadShell();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
