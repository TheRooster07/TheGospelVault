// ============================================================
// The Gospel Vault — "Last updated" stamp (CSG Version 22)
//
// Run this from the site folder in VS Code's terminal BEFORE you
// commit, right next to the search rebuild:
//
//     node update-stamp.mjs
//     node build-search.mjs
//
// For every .html page you added or changed since your last commit,
// it sets today's date in three places:
//   1. the visible "Last updated ..." line at the bottom of the page
//   2. "dateModified" in the page's search data (JSON-LD)
//   3. <lastmod> for that page in sitemap.xml (new pages are added)
//
// Preview without changing anything:   node update-stamp.mjs --dry
// Stamp one page by hand:              node update-stamp.mjs john/index.html
// Skipped: redirect pages, noindex pages, _to_delete, Claude outputs.
// ============================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://thegospelvault.com/';
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const named = args.filter(a => !a.startsWith('--')).map(a => a.replace(/\\/g, '/').replace(/^\.\//, ''));

const now = new Date();
const pad = n => String(n).padStart(2, '0');
const ISO = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const HUMAN = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const STAMP = `<!--tgv-updated--><p class="tgv-updated" style="margin:.9rem auto 0;font-size:.8rem;opacity:.75;text-align:center;letter-spacing:.02em">Last updated <time datetime="${ISO}">${HUMAN}</time></p><!--/tgv-updated-->`;

let files = named;
if (!files.length) {
  const out = execSync('git status --porcelain -uall', { cwd: SITE, encoding: 'utf8' });
  files = out.split('\n').filter(Boolean)
    .filter(l => !l.startsWith(' D') && !l.startsWith('D '))
    .map(l => l.slice(3).trim().replace(/^"|"$/g, '').split(' -> ').pop());
}
files = files.filter(f => f.endsWith('.html') && !/^(_to_delete|Claude outputs|pagefind)\//.test(f));

const urlFor = f => f === 'index.html' ? ORIGIN : ORIGIN + (f.endsWith('/index.html') ? f.slice(0, -10) : f);
let sitemap = readFileSync(join(SITE, 'sitemap.xml'), 'utf8');
let stamped = 0, skipped = [];

for (const f of files) {
  const path = join(SITE, f);
  if (!existsSync(path)) continue;
  let html = readFileSync(path, 'utf8');
  const head = html.split('</head>')[0].toLowerCase();
  if (head.includes('http-equiv="refresh"')) { skipped.push(f + ' (redirect)'); continue; }
  const nl = html.includes('\r\n') ? '\r\n' : '\n';

  // 1. visible stamp
  if (html.includes('<!--tgv-updated-->')) {
    html = html.replace(/<!--tgv-updated-->[\s\S]*?<!--\/tgv-updated-->/, STAMP);
  } else {
    const i = html.lastIndexOf('</footer>');
    if (i >= 0) html = html.slice(0, i) + STAMP + nl + html.slice(i);
    else { const b = html.lastIndexOf('</body>'); html = html.slice(0, b) + `<div style="max-width:760px;margin:0 auto 1.5rem;padding:0 16px">${STAMP}</div>` + nl + html.slice(b); }
  }
  // 2. search data
  const hadDate = /"dateModified"\s*:/.test(html);
  html = html.replace(/("dateModified"\s*:\s*")[^"]*(")/g, `$1${ISO}$2`);
  if (!hadDate) skipped.push(f + ' (no dateModified in its search data — add one when convenient)');

  // 3. sitemap
  if (!head.includes('noindex')) {
    const url = urlFor(f).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const entry = new RegExp(`(<loc>${url}</loc>\\s*)(<lastmod>[^<]*</lastmod>)?`);
    if (entry.test(sitemap)) sitemap = sitemap.replace(entry, `$1<lastmod>${ISO}</lastmod>`);
    else sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${urlFor(f)}</loc>\n    <lastmod>${ISO}</lastmod>\n  </url>\n</urlset>`);
  }
  if (!DRY) writeFileSync(path, html, 'utf8');
  stamped++;
  console.log((DRY ? 'would stamp  ' : 'stamped  ') + f);
}
sitemap = sitemap.replace(/<\/loc>(<lastmod>)/g, '</loc>\n    $1');
if (!DRY && stamped) writeFileSync(join(SITE, 'sitemap.xml'), sitemap, 'utf8');
console.log(`\n${stamped} page(s) ${DRY ? 'would be ' : ''}stamped ${HUMAN}.`);
if (skipped.length) console.log('Notes:\n  ' + skipped.join('\n  '));
