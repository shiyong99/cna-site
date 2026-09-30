import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DB_PATH } from './lib/db.mjs';
import { createHandler } from './lib/http.mjs';
import * as api from './lib/api.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)));
const PORT = process.env.PORT || 4173;

// Ensure the local database exists (seed it on first run).
if (!existsSync(DB_PATH)) {
  await import('./scripts/seed.mjs');
}

createServer(createHandler({ api, root: ROOT }))
  .listen(PORT, () => console.log(`[server] http://127.0.0.1:${PORT} (SQLite: ${DB_PATH})`));
