/* Shared small utilities (no JSX). */

export const TONES = ['ph--b', 'ph--c', 'ph--d', 'ph--e', 'ph--f'];

export const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

export function fetchJson(url) {
  return fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))));
}
