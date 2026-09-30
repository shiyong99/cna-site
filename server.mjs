import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHandler } from './lib/http.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)));
const PORT = process.env.PORT || 4173;

// Use Supabase when DATABASE_URL is set (Vercel), otherwise SQLite (local dev).
const useSupabase = Boolean(process.env.DATABASE_URL);
const api = useSupabase
  ? await import('./lib/api-supabase.mjs')
  : await import('./lib/api.mjs');

if (!useSupabase) {
  const { DB_PATH } = await import('./lib/db.mjs');
  if (!existsSync(DB_PATH)) {
    await import('./scripts/seed.mjs');
  }
}

createServer(createHandler({ api, root: ROOT }))
  .listen(PORT, () => console.log(`[server] http://127.0.0.1:${PORT} (${useSupabase ? 'Supabase' : 'SQLite'})`));
