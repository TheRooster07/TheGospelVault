// ============================================================
// The Gospel Vault — site check (CSG Version 23)
//
// Run this in VS Code's terminal BEFORE you commit:
//
//     node site-check.mjs
//
// It changes nothing. It lists anything a new or changed page is
// missing, so every page stays tied into the rest of the site:
//   • every page: site icon lines, search data (dateModified),
//     breadcrumb, "Last updated" line, title, description,
//     canonical address, share bar, and a sitemap entry
//   • every series folder: a main page (index.html), a card or link
//     on a Vault page, and a line in llms.txt
//   • broken internal links (links to pages or files that don't exist)
//   • sitemap entries that point to missing or forwarding pages
//   • titles longer than about 65 characters (a reminder, not an error)
//
//   node site-check.mjs --quiet    show only problems, no title reminders
// ============================================================
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = dirname(fileURLToPath(import.meta.url));
const ORIGIN = 'https://thegospelvault.com/';
const QUIET = process.argv.includes('--quiet');
const SKIP_DIRS = new Set(['.git', '.github', '.vscode', 'node_modules', 'pagefind', 'Claude outputs', '_to_delete', 'tools']);
// Folders that hold site machinery, not reader content
const NOT_SERIES = new Set(['assets', 'css', 'js', 'bible-studies', 'ideas', 'charts', 'img', 'icons']);

const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') && e.isDirectory()) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(full); }
    else if (e.name.toLowerCase().endsWith('.html')) pages.push(relative(SITE, full).split('\\').join('/'));
  }
})(SITE);
pages.sort();

const read = p => readFileSync(join(SITE, p), 'utf8');
const headOf = s => { const i = s.indexOf('</head>'); return i < 0 ? s : s.slice(0, i); };
const isRedirect = h => /http-equiv=["']refresh["']/i.test(h);
const isNoindex = h => /<meta\s+name=["']robots["'][^>]*noindex/i.test(h);
const urlFor = p => p === 'index.html' ? ORIGIN : ORIGIN + (p.endsWith('/index.html') ? p.slice(0, -10) : p);
const decode = s => s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&[a-z]+;/g, 'x');

const sitemap = existsSync(join(SITE, 'sitemap.xml')) ? read('sitemap.xml') : '';
const smUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
const llms = existsSync(join(SITE, 'llms.txt')) ? read('llms.txt') : '';
const vaultPages = pages.filter(p => /^vault(-\d+[^/]*)?\.html$/.test(p));
const vaultText = vaultPages.map(read).join('\n');

const problems = {};       // heading -> [items]
const add = (k, v) => (problems[k] = problems[k] || []).push(v);
const longTitles = [];
const cache = {};

for (const p of pages) {
  const s = read(p); const h = headOf(s); cache[p] = { s, h };
  if (p === '404.html') continue;
  if (isRedirect(h)) continue;
  const noindex = isNoindex(h);
  if (!/<title>[\s\S]*?<\/title>/.test(h)) add('Missing a page title', p);
  else {
    const t = decode(h.match(/<title>([\s\S]*?)<\/title>/)[1].trim());
    if (t.length > 65) longTitles.push(`${p}  (${t.length}) ${t}`);
  }
  if (noindex || p === 'search.html') continue;
  if (!/<meta\s+name=["']description["']/i.test(h)) add('Missing a description', p);
  if (!/rel=["']canonical["']/i.test(h)) add('Missing a canonical address', p);
  if (!h.includes('<!-- tgv-icons -->')) add('Missing the site icon lines (<!-- tgv-icons -->)', p);
  if (!/"dateModified"/.test(h)) add('Missing search data with dateModified (Article or CollectionPage)', p);
  if (p !== 'index.html' && !h.includes('BreadcrumbList')) add('Missing breadcrumb search data (BreadcrumbList)', p);
  if (!s.includes('<!--tgv-updated-->')) add('Missing the "Last updated" line — run node update-stamp.mjs', p);
  if (!s.includes('share-bar.js') && !/name=["']share-bar["'][^>]*off/.test(h)) add('Missing the share bar line', p);
  if (!smUrls.has(urlFor(p))) add('Not in sitemap.xml — run node update-stamp.mjs', p);
}

// Broken internal links
const broken = new Map();
for (const p of pages) {
  if (p === '404.html') continue;
  for (const m of cache[p].s.matchAll(/(?:href|src)=["']([^"'#?]+)/g)) {
    let h = m[1].trim();
    if (/^(https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(h)) {
      if (h.startsWith(ORIGIN)) h = '/' + h.slice(ORIGIN.length); else continue;
    }
    let t;
    try { t = decodeURIComponent(h); } catch { t = h; }
    t = t.startsWith('/') ? t.slice(1) : posix.normalize(posix.join(posix.dirname(p), t));
    if (t === '' || t === '.' ) t = 'index.html';
    else if (t.endsWith('/')) t += 'index.html';
    if (t.startsWith('..')) continue;
    const full = join(SITE, t);
    const ok = existsSync(full) && (!statSync(full).isDirectory() || existsSync(join(full, 'index.html')));
    if (!ok && !broken.has(`${p} → ${m[1]}`)) broken.set(`${p} → ${m[1]}`, 1);
  }
}
for (const k of broken.keys()) add('Broken internal links (page → link)', k);

// Sitemap entries that point nowhere
for (const u of smUrls) {
  let p = u.startsWith(ORIGIN) ? u.slice(ORIGIN.length) : null;
  if (p === null) continue;
  if (p === '') p = 'index.html'; else if (p.endsWith('/')) p += 'index.html';
  if (!existsSync(join(SITE, p))) add('Sitemap lists a page that does not exist', u);
  else if (cache[p] && isRedirect(cache[p].h)) add('Sitemap lists a forwarding page (remove it)', u);
}

// Series folders: main page, Vault link, llms.txt line
const seriesDirs = [];
for (const top of readdirSync(SITE, { withFileTypes: true })) {
  if (!top.isDirectory() || top.name.startsWith('.') || SKIP_DIRS.has(top.name) || NOT_SERIES.has(top.name)) continue;
  seriesDirs.push(top.name);
}
if (existsSync(join(SITE, 'bible-studies')))
  for (const d of readdirSync(join(SITE, 'bible-studies'), { withFileTypes: true }))
    if (d.isDirectory() && !NOT_SERIES.has(d.name)) seriesDirs.push('bible-studies/' + d.name);
for (const d of seriesDirs) {
  const hasHtml = pages.some(p => p.startsWith(d + '/'));
  if (!hasHtml) continue;
  const idx = d + '/index.html';
  const isFwd = existsSync(join(SITE, idx)) && isRedirect(cache[idx]?.h || '');
  if (!existsSync(join(SITE, idx))) add('Series folder has no main page (index.html)', d + '/');
  if (!vaultText.includes(`href="${d}/`) && !vaultText.includes(`href="./${d}/`) && !vaultText.includes(`/${d}/"`))
    add('Series folder is not linked from any Vault page', d + '/');
  if (!isFwd && !llms.includes(`${ORIGIN}${d}/`)) add('Series folder is not listed in llms.txt', d + '/');
}

// Report
const keys = Object.keys(problems);
console.log(`\nThe Gospel Vault — site check · ${pages.length} pages · ${seriesDirs.length} series folders\n`);
if (!keys.length) console.log('✔ Everything is tied in: no problems found.');
for (const k of keys) {
  console.log(`✖ ${k}: ${problems[k].length}`);
  problems[k].slice(0, 25).forEach(x => console.log('    ' + x));
  if (problems[k].length > 25) console.log(`    … and ${problems[k].length - 25} more`);
}
if (!QUIET && longTitles.length) {
  console.log(`\n• Reminder: ${longTitles.length} title(s) run past ~65 characters (Google may cut the end). Shorten if the page name allows:`);
  longTitles.slice(0, 5).forEach(x => console.log('    ' + x));
  if (longTitles.length > 5) console.log(`    … and ${longTitles.length - 5} more (run with --quiet to hide)`);
}
console.log('');
process.exitCode = keys.length ? 1 : 0;
