// ============================================================
// Rebuild The Gospel Vault's site search index (the /pagefind folder)
//
// Run this from the site folder in VS Code's terminal any time you
// add or edit pages, BEFORE you commit and push:
//
//     node build-search.mjs
//
// Skipped automatically: "Claude outputs", "_to_delete", redirect
// pages, and any page marked <meta name="robots" content="noindex">.
// ============================================================
import { readdirSync, readFileSync, mkdirSync, copyFileSync, rmSync, mkdtempSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SITE = dirname(fileURLToPath(import.meta.url));
const OUT = join(SITE, 'pagefind');
const PAGEFIND_VERSION = '1.3.0';
const SKIP_DIRS = new Set(['.git', '.github', '.vscode', 'node_modules', 'pagefind', 'Claude outputs', '_to_delete']);

const pages = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) walk(full);
    } else if (entry.name.toLowerCase().endsWith('.html')) {
      const html = readFileSync(full, 'utf8');
      if (/http-equiv=["']refresh/i.test(html)) continue;                         // redirect page
      if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) continue;     // noindex page
      pages.push(full);
    }
  }
})(SITE);

const staging = mkdtempSync(join(tmpdir(), 'gv-search-'));
try {
  for (const file of pages) {
    const dest = join(staging, relative(SITE, file));
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(file, dest);
  }
  console.log(`Indexing ${pages.length} pages…`);
  rmSync(OUT, { recursive: true, force: true });
  execSync(`npx -y pagefind@${PAGEFIND_VERSION} --site "${staging}" --output-path "${OUT}"`, { stdio: 'inherit' });
  console.log('\nDone. Commit the "pagefind" folder along with your page changes.');
} finally {
  rmSync(staging, { recursive: true, force: true });
}
