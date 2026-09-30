import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'data');
mkdirSync(DATA_DIR, { recursive: true });

export const DB_PATH = join(DATA_DIR, 'cna.db');

export function openDb(path = DB_PATH) {
  return new DatabaseSync(path);
}

/** Convenience query helpers on a DatabaseSync instance. */
export function all(db, sql, ...params) {
  return db.prepare(sql).all(...params);
}

export function get(db, sql, ...params) {
  return db.prepare(sql).get(...params);
}
