import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHandler } from '../lib/http.mjs';
import * as api from '../lib/api-supabase.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export default createHandler({ api, root: ROOT });
