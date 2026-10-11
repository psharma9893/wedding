// Post-build sanity check: every file referenced by dist/index.html exists,
// no template placeholders leaked, and relative paths are used (GitHub Pages sub-path safe).
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const problems = [];

const refs = new Set();
for (const m of html.matchAll(/\s(src|href|srcset|imagesrcset)="([^"]+)"/g)) {
  const parts = /srcset/.test(m[1]) ? m[2].split(',') : [m[2]];
  for (const part of parts) {
    const url = part.trim().split(/\s+/)[0];
    if (!url || /^(https?:|tel:|mailto:|#|data:)/.test(url)) continue;
    refs.add(url);
  }
}
for (const url of refs) {
  if (url.startsWith('/')) problems.push(`Absolute path breaks on GitHub Pages sub-paths: ${url}`);
  const file = join(dist, decodeURIComponent(url.replace(/^\.\//, '').split(/[?#]/)[0]));
  if (!existsSync(file)) problems.push(`Missing file: ${url}`);
}
const leaked = html.match(/%[A-Z_]+%|<!--APP-->|\[ADD [^\]]*\]/g);
if (leaked) problems.push(`Unreplaced placeholders: ${[...new Set(leaked)].join(', ')}`);

if (problems.length) {
  console.error('\n✗ dist check failed:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`✓ dist check: ${refs.size} local references all present, no placeholders.`);
