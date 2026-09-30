import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

export async function routeApi(pathname, params, api) {
  switch (pathname) {
    case '/api/shell': return api.getShell();
    case '/api/sections': return api.getSections();
    case '/api/articles': return api.getArticles({ block: params.get('block') || undefined, section: params.get('section') || undefined });
    case '/api/search': return api.search({ q: params.get('q') || '', type: params.get('type') || '', cat: params.get('cat') || '' });
    case '/api/search-suggest': return api.searchSuggest(params.get('q') || '');
    case '/api/fast': return api.getFast();
    case '/api/videos': return api.getVideos(params.get('block') || 'news');
    case '/api/schedule': return api.getSchedule();
    case '/api/podcasts': return api.getPodcasts(params.get('block') || 'featured');
    case '/api/series': return api.getSeries(params.get('block') || 'news-features');
    case '/api/discover': return api.getDiscover();
    case '/api/games': return api.getGames();
    case '/api/interactives': return api.getInteractives();
    case '/api/rss': return api.getRss();
    case '/api/newsletters': return api.getNewsletters();
    case '/api/people': return api.getPeople(params.get('kind') || 'presenter');
    case '/api/network': return api.getNetwork();
    case '/api/ad-stats': return api.getAdStats();
    case '/api/ad-specs': return api.getAdSpecs();
    case '/api/contacts': return api.getContacts(params.get('group') || undefined);
    default: return null;
  }
}

export function createHandler({ api, root }) {
  const ROOT = resolve(root);

  return async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith('/api/')) {
      try {
        const data = await routeApi(pathname, url.searchParams, api);
        if (data === null) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end('{"error":"not found"}');
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(data));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: String(e.message || e) }));
      }
    }

    try {
      let filePath = pathname === '/' ? '/index.html' : pathname;
      const file = normalize(join(ROOT, filePath));
      if (!file.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end('Forbidden');
      }
      const data = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  };
}
