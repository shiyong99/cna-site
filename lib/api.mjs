import { openDb, all, get } from './db.mjs';

function open() {
  return openDb();
}

/* ---------- shell ---------- */
export function getShell() {
  const db = open();
  const navRows = all(db, 'SELECT grp,label,href,is_current FROM nav ORDER BY grp, position');
  const nav = { primary: [], secondary: [], editions: [] };
  navRows.forEach((r) => {
    nav[r.grp].push({ label: r.label, href: r.href, ...(r.is_current ? { current: true } : {}) });
  });
  const ticker = all(db, 'SELECT symbol s, value v, change d, up FROM ticker ORDER BY position')
    .map((r) => ({ s: r.s, v: r.v, d: r.d, up: Boolean(r.up) }));
  const trending = all(db, 'SELECT term FROM trending ORDER BY position').map((r) => r.term);
  return { nav, ticker, trending };
}

/* ---------- sections ---------- */
export function getSections() {
  const db = open();
  const sections = all(db, 'SELECT key, title, dek FROM sections ORDER BY key');
  const facets = all(db, 'SELECT section_key, facet FROM section_facets ORDER BY section_key, position');
  return sections.map((s) => ({
    key: s.key,
    title: s.title,
    dek: s.dek,
    facets: facets.filter((f) => f.section_key === s.key).map((f) => f.facet)
  }));
}

export function getSection(key) {
  return getSections().find((s) => s.key === key) || getSections().find((s) => s.key === 'latest-news');
}

/* ---------- articles ---------- */
export function getArticles({ block, section } = {}) {
  const db = open();
  let rows;
  if (block) {
    rows = all(db, 'SELECT * FROM articles WHERE block = ? ORDER BY position', block);
  } else if (section) {
    rows = all(db, 'SELECT * FROM articles WHERE section = ? ORDER BY position', section);
  } else {
    rows = all(db, 'SELECT * FROM articles ORDER BY position');
  }
  return rows.map(mapArticle);
}

function mapArticle(a) {
  return { id: a.id, block: a.block, section: a.section, category: a.category, title: a.title, dek: a.dek, age: a.age, tone: a.tone };
}

/* ---------- search ---------- */
export function search({ q = '', type = '', cat = '' } = {}) {
  const db = open();
  const allItems = all(db, 'SELECT * FROM search_items ORDER BY position');
  const ql = (q || '').toLowerCase();
  const typeL = (type || '').toLowerCase();
  const catL = (cat || '').toLowerCase();
  const items = allItems
    .filter((d) => (!ql || d.title.toLowerCase().includes(ql)))
    .filter((d) => (!type || typeL === 'all' || (d.type || '').toLowerCase() === typeL))
    .filter((d) => (!cat || catL === 'all' || (d.category || '').toLowerCase() === catL))
    .map((d) => ({ title: d.title, category: d.category, type: d.type }));

  const base = allItems.filter((d) => !ql || d.title.toLowerCase().includes(ql));
  const types = ['All', 'Article', 'Podcast', 'Video', '8days', 'Advertorial'].map((t) => ({
    facet: t,
    count: t === 'All' ? base.length : base.filter((d) => d.type === t).length
  }));
  const cats = ['All', 'Singapore', 'Asia', 'Commentary', 'Sport', 'Watch', 'Podcast', 'Brand Studio', '8days'].map((c) => ({
    facet: c,
    count: c === 'All' ? base.length : base.filter((d) => d.category === c).length
  }));

  return { items, types, cats };
}

export function searchSuggest(q = '') {
  const db = open();
  const ql = q.toLowerCase();
  if (!ql) return [];
  return all(db, 'SELECT title t, category cat, type FROM search_items ORDER BY position')
    .filter((s) => s.t.toLowerCase().includes(ql))
    .slice(0, 8);
}

/* ---------- fast ---------- */
export function getFast() {
  const db = open();
  const stories = all(db, 'SELECT * FROM fast_stories ORDER BY position');
  const points = all(db, 'SELECT * FROM fast_points ORDER BY story_id, position');
  return stories.map((s) => ({
    cat: s.cat,
    title: s.title,
    tone: s.tone,
    points: points.filter((p) => p.story_id === s.id).map((p) => p.text)
  }));
}

/* ---------- videos / schedule ---------- */
export function getVideos(block) {
  const db = open();
  const rows = all(db, 'SELECT * FROM videos WHERE block = ? ORDER BY position', block);
  return rows.map((v) => ({ category: v.category, title: v.title, duration: v.duration, tone: v.tone }));
}

export function getSchedule() {
  const db = open();
  return all(db, 'SELECT time, show, details FROM schedule ORDER BY id');
}

/* ---------- podcasts / series ---------- */
export function getPodcasts(block) {
  const db = open();
  const rows = all(db, 'SELECT * FROM podcasts WHERE block = ? ORDER BY position', block);
  return rows.map((p) => ({ show: p.show, title: p.title, duration: p.duration, tone: p.tone }));
}

export function getSeries(block) {
  const db = open();
  const rows = all(db, 'SELECT * FROM series WHERE block = ? ORDER BY position', block);
  return rows.map((s) => ({ name: s.name, dek: s.dek, tone: s.tone }));
}

/* ---------- misc ---------- */
export function getDiscover() {
  const db = open();
  return all(db, 'SELECT title, dek, href, tone FROM discover ORDER BY position');
}

export function getGames() {
  const db = open();
  return all(db, 'SELECT label, tone FROM games ORDER BY position');
}

export function getInteractives() {
  const db = open();
  return all(db, 'SELECT eyebrow, title, tone FROM interactives ORDER BY position');
}

export function getRss() {
  const db = open();
  return all(db, 'SELECT category, url FROM rss_feeds ORDER BY id');
}

export function getNewsletters() {
  const db = open();
  return all(db, 'SELECT cadence, name, dek FROM newsletters ORDER BY id');
}

export function getPeople(kind) {
  const db = open();
  return all(db, 'SELECT name, role FROM people WHERE kind = ? ORDER BY position', kind);
}

export function getNetwork() {
  const db = open();
  return all(db, 'SELECT name FROM network_properties ORDER BY position');
}

export function getAdStats() {
  const db = open();
  return all(db, 'SELECT value, label FROM ad_stats ORDER BY id');
}

export function getAdSpecs() {
  const db = open();
  return all(db, 'SELECT name, dims, size FROM ad_specs ORDER BY id');
}

export function getContacts(group) {
  const db = open();
  if (group) {
    return all(db, 'SELECT heading, detail, email FROM contacts WHERE grp = ? ORDER BY id', group);
  }
  return all(db, 'SELECT heading, detail, email FROM contacts ORDER BY id');
}
