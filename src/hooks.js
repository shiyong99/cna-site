import { useSyncExternalStore, useEffect, useState } from 'react';
import { shellStore } from './store.js';
import { fetchJson } from './lib.js';

export function useShell() {
  return useSyncExternalStore(shellStore.subscribe, shellStore.get);
}

export function useApi(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetchJson(url)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);
  return data;
}
