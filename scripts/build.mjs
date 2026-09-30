import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { cp, mkdir, readdir } from 'node:fs/promises';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

await build({
  entryPoints: [path.join(root, 'src/main.jsx')],
  bundle: true,
  format: 'iife',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  outfile: path.join(root, 'assets/js/app.js'),
  target: ['es2020'],
  minify: false,
  logLevel: 'info'
});

console.log('[build] React bundle written to assets/js/app.js');

// Copy static assets into public/ so Vercel can serve them at the root.
const publicDir = path.join(root, 'public');
await mkdir(publicDir, { recursive: true });

const entries = await readdir(root, { withFileTypes: true });
for (const entry of entries) {
  if (entry.isFile() && entry.name.endsWith('.html')) {
    await cp(path.join(root, entry.name), path.join(publicDir, entry.name), { force: true });
  }
}
await cp(path.join(root, 'assets'), path.join(publicDir, 'assets'), { recursive: true, force: true });

console.log('[build] static files copied to public/');
