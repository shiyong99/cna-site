import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  ssl: { rejectUnauthorized: false }
});

async function rows(sql, params = []) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  const { rows: result } = await pool.query(sql, params);
  return result;
}

/* ---------- shell ---------- */
export async function getShell() {
  const [navRows, tickerRows, trendingRows] = await Promise.all([
    rows('SELECT * FROM nav ORDER BY position'),
    rows('SELECT * FROM ticker ORDER BY position'),
    rows('SELECT * FROM trending ORDER BY position')
  ]);
  const nav = { primary: [], secondary: [], editions: [] };
  navRows.forEach((r) => {
    nav[r.grp].push({ label: r.label, href: r.href, ...(r.is_current ? { current: true } : {}) });
  });
  const ticker = tickerRows.map((r) => ({ s: r.symbol, v: r.value, d: r.change, up: Boolean(r.up) }));
  const trending = trendingRows.map((r) => r.term);
  return { nav, ticker, trending };
}

/* ---------- sections ---------- */
export async function getSections() {
  const [sections, facets] = await Promise.all([
    rows('SELECT * FROM sections ORDER BY "key"'),
    rows('SELECT * FROM section_facets ORDER BY position')
  ]);
  return sections.map((s) => ({
    key: s.key,
    title: s.title,
    dek: s.dek,
    facets: facets.filter((f) => f.section_key === s.key).map((f) => f.facet)
  }));
}

export async function getSection(key) {
  const sections = await getSections();
  return sections.find((s) => s.key === key) || sections.find((s) => s.key === 'latest-news');
}

/* ---------- articles ---------- */
export async function getArticles({ block, section } = {}) {
  let sql = 'SELECT * FROM articles';
  const params = [];
  if (block) {
    sql += ' WHERE block = $1';
    params.push(block);
  } else if (section) {
    sql += ' WHERE section = $1';
    params.push(section);
  }
  sql += ' ORDER BY position';
  const result = await rows(sql, params);
  return result.map(mapArticle);
}

function mapArticle(a) {
  return { id: a.id, block: a.block, section: a.section, category: a.category, title: a.title, dek: a.dek, age: a.age, tone: a.tone };
}

/* ---------- search ---------- */
export async function search({ q = '', type = '', cat = '' } = {}) {
  const allItems = await rows('SELECT * FROM search_items ORDER BY position');
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

export async function searchSuggest(q = '') {
  const ql = q.toLowerCase();
  if (!ql) return [];
  const allItems = await rows('SELECT * FROM search_items ORDER BY position');
  return allItems
    .filter((s) => s.title.toLowerCase().includes(ql))
    .slice(0, 8)
    .map((s) => ({ t: s.title, cat: s.category, type: s.type }));
}

/* ---------- fast ---------- */
export async function getFast() {
  const [stories, points] = await Promise.all([
    rows('SELECT * FROM fast_stories ORDER BY position'),
    rows('SELECT * FROM fast_points ORDER BY position')
  ]);
  return stories.map((s) => ({
    cat: s.cat,
    title: s.title,
    tone: s.tone,
    points: points.filter((p) => p.story_id === s.id).map((p) => p.text)
  }));
}

/* ---------- videos / schedule ---------- */
export async function getVideos(block) {
  const result = await rows('SELECT * FROM videos WHERE block = $1 ORDER BY position', [block]);
  return result.map((v) => ({ category: v.category, title: v.title, duration: v.duration, tone: v.tone }));
}

export async function getSchedule() {
  const result = await rows('SELECT * FROM schedule ORDER BY id');
  return result.map((s) => ({ time: s.time, show: s.show, details: s.details }));
}

/* ---------- podcasts / series ---------- */
export async function getPodcasts(block) {
  const result = await rows('SELECT * FROM podcasts WHERE block = $1 ORDER BY position', [block]);
  return result.map((p) => ({ show: p.show, title: p.title, duration: p.duration, tone: p.tone }));
}

export async function getSeries(block) {
  const result = await rows('SELECT * FROM series WHERE block = $1 ORDER BY position', [block]);
  return result.map((s) => ({ name: s.name, dek: s.dek, tone: s.tone }));
}

/* ---------- misc ---------- */
export async function getDiscover() {
  const result = await rows('SELECT * FROM discover ORDER BY position');
  return result.map((d) => ({ title: d.title, dek: d.dek, href: d.href, tone: d.tone }));
}

export async function getGames() {
  const result = await rows('SELECT * FROM games ORDER BY position');
  return result.map((g) => ({ label: g.label, tone: g.tone }));
}

export async function getInteractives() {
  const result = await rows('SELECT * FROM interactives ORDER BY position');
  return result.map((i) => ({ eyebrow: i.eyebrow, title: i.title, tone: i.tone }));
}

export async function getRss() {
  const result = await rows('SELECT * FROM rss_feeds ORDER BY id');
  return result.map((r) => ({ category: r.category, url: r.url }));
}

export async function getNewsletters() {
  const result = await rows('SELECT * FROM newsletters ORDER BY id');
  return result.map((n) => ({ cadence: n.cadence, name: n.name, dek: n.dek }));
}

export async function getPeople(kind) {
  const result = await rows('SELECT * FROM people WHERE kind = $1 ORDER BY position', [kind]);
  return result.map((p) => ({ name: p.name, role: p.role }));
}

export async function getNetwork() {
  const result = await rows('SELECT * FROM network_properties ORDER BY position');
  return result.map((n) => ({ name: n.name }));
}

export async function getAdStats() {
  const result = await rows('SELECT * FROM ad_stats ORDER BY id');
  return result.map((a) => ({ value: a.value, label: a.label }));
}

export async function getAdSpecs() {
  const result = await rows('SELECT * FROM ad_specs ORDER BY id');
  return result.map((a) => ({ name: a.name, dims: a.dims, size: a.size }));
}

export async function getContacts(group) {
  const result = group
    ? await rows('SELECT * FROM contacts WHERE grp = $1 ORDER BY id', [group])
    : await rows('SELECT * FROM contacts ORDER BY id');
  return result.map((c) => ({ heading: c.heading, detail: c.detail, email: c.email }));
}
