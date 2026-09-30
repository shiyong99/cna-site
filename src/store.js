import { fetchJson } from './lib.js';

/* Tiny external store consumed via useSyncExternalStore. The shell is rendered
   into several separate React roots (header, drawer, search modal), so a single
   store is the source of truth for the shared /api/shell payload. */

function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    get: () => state,
    set: (next) => {
      state = typeof next === 'function' ? next(state) : next;
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

export const shellStore = createStore({
  nav: { primary: [], secondary: [], editions: [] },
  ticker: [],
  trending: []
});

let loading = false;

export function loadShell() {
  if (loading || shellStore.get().ticker.length) return;
  loading = true;
  fetchJson('/api/shell')
    .then((data) => {
      shellStore.set({ nav: data.nav, ticker: data.ticker, trending: data.trending });
    })
    .catch(() => {
      loading = false;
    });
}
