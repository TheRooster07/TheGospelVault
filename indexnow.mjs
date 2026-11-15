// ============================================================
// The Gospel Vault — IndexNow (tell Bing about changed pages)
//
// Run this in VS Code's terminal AFTER you push (once GitHub has
// published the changes, about a minute later):
//
//     node indexnow.mjs
//
// It sends Bing every page whose <lastmod> in sitemap.xml is today
// (the pages update-stamp.mjs dated before you committed). Bing
// shares the notice with the other IndexNow engines (Yandex, etc.).
// Google does not use IndexNow.
//
//   node indexnow.mjs --dry            show what would be sent
//   node indexnow.mjs --all            send every page in the sitemap
//   node indexnow.mjs --since 2026-11-01   pages updated on/after a date
//   node indexnow.mjs john/index.html  send specific pages
//
// The key file ([32 letters/numbers].txt in this folder) must stay
// in the site's main folder; it proves to Bing the site is ours.
// ============================================================
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = dirname(fileURLToPath(import.meta.url));
const HOST = 'thegospelvault.com';
const ORIGIN = `https://${HOST}/`;
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const ALL = args.includes('--all');
const sinceIx = args.indexOf('--since');
const SINCE = sinceIx >= 0 ? args[sinceIx + 1] : null;
const named = args.filter((a, i) => !a.startsWith('--') && !(sinceIx >= 0 && i === sinceIx + 1));

const keyFile = readdirSync(SITE).find(f => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) { console.error('No IndexNow key file found in the site folder.'); process.exit(1); }
const KEY = readFileSync(join(SITE, keyFile), 'utf8').trim();
const KEY_URL = ORIGIN + keyFile;

const now = new Date(), pad = n => String(n).padStart(2, '0');
const TODAY = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

let urls;
if (named.length) {
  urls = named.map(f => f.replace(/\\/g, '/').replace(/^\.\//, ''))
    .map(f => f === 'index.html' ? ORIGIN : ORIGIN + (f.endsWith('/index.html') ? f.slice(0, -10) : f));
} else {
  const sm = readFileSync(join(SITE, 'sitemap.xml'), 'utf8');
  const entries = [...sm.matchAll(/<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?/g)].map(m => ({ url: m[1], date: m[2] || '' }));
  urls = entries.filter(e => ALL || (SINCE ? e.date >= SINCE : e.date === TODAY)).map(e => e.url);
}
if (!urls.length) { console.log(`No pages dated ${SINCE ? 'on/after ' + SINCE : 'today (' + TODAY + ')'} in sitemap.xml — nothing to send.\nTip: run "node update-stamp.mjs" before committing, or use --all.`); process.exit(0); }

console.log(`${urls.length} page(s) to send to IndexNow.`);
if (DRY) { urls.slice(0, 15).forEach(u => console.log('  ' + u)); if (urls.length > 15) console.log(`  … and ${urls.length - 15} more`); process.exit(0); }

// Make sure the key file is live first, or Bing will reject the submission.
try {
  const k = await fetch(KEY_URL, { cache: 'no-store' });
  const body = (await k.text()).trim();
  if (!k.ok || body !== KEY) {
    console.error(`The key file isn't live yet at ${KEY_URL} (status ${k.status}). Push the site, wait a minute, and run this again.`);
    process.exit(1);
  }
} catch (e) { console.error('Could not reach the site to check the key file: ' + e.message); process.exit(1); }

for (let i = 0; i < urls.length; i += 10000) {
  const batch = urls.slice(i, i + 10000);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_URL, urlList: batch })
  });
  const msg = { 200: 'Accepted', 202: 'Received — Bing will confirm the key shortly', 400: 'Bad request', 403: 'Key not valid (is the key file live?)', 422: 'Some addresses do not belong to this site', 429: 'Too many requests — try again later' }[res.status] || '';
  console.log(`IndexNow: ${res.status} ${msg} (${batch.length} page(s))`);
  if (res.status >= 400) process.exitCode = 1;
}
