#!/usr/bin/env python3
"""
Publish one approved Vault 9 (Ideas & Blog) reader submission.

Run from the site folder:

    python3 tools/publish_post.py submission.json

submission.json holds the fields from the Formspree email:

    {
      "source_id": "Gmail message ID (used to prevent duplicates)",
      "submitted": "2026-10-22T15:34:00Z"   (UTC; optional, defaults to now),
      "name": "...", "email": "...",
      "post_title": "...", "post_body": "...", "credit": "..."
    }

It does four things, and nothing else:
  1. writes ideas/<slug>.html from tools/post-template.html.tmpl
  2. adds a card to the top of "Recent Posts" on vault-9-ideas-blog.html
  3. adds the page to sitemap.xml
  4. adds an entry to the top of updates.html (What's New in the Vault)

The submitted text is published exactly as written: it is HTML-escaped
(so nothing a reader types can run as code or links) and only split into
paragraphs. Running it twice for the same source_id does nothing the
second time. Prints a JSON line: {"status": "published"|"already_published", "url": ...}
"""
import html
import json
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo
    ET = ZoneInfo("America/New_York")
except Exception:  # pragma: no cover
    ET = timezone.utc

SITE = Path(__file__).resolve().parent.parent
IDEAS = SITE / "ideas"
TEMPLATE = SITE / "tools" / "post-template.html.tmpl"
VAULT9 = SITE / "vault-9-ideas-blog.html"
SITEMAP = SITE / "sitemap.xml"
UPDATES = SITE / "updates.html"
BASE = "https://thegospelvault.com"
DEFAULT_CREDIT = "A Gospel Vault reader"


def esc(s):
    return html.escape(s or "", quote=True)


def slugify(title):
    s = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    s = re.sub(r"-{2,}", "-", s)[:60].strip("-")
    return s or "post"


def body_html(text):
    text = (text or "").replace("\r\n", "\n").replace("\r", "\n").strip()
    paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    out = []
    for p in paras:
        lines = [esc(l.strip()) for l in p.split("\n")]
        out.append("      <p>" + "<br>\n      ".join(lines) + "</p>")
    return "\n".join(out)


def summary(text, n=155):
    t = re.sub(r"\s+", " ", text or "").strip()
    if len(t) <= n:
        return t
    cut = t[:n].rsplit(" ", 1)[0].rstrip(",;:.-—")
    return cut + "…"


def find_existing(source_id):
    if not IDEAS.exists():
        return None
    needle = f'<meta name="tgv-source-id" content="{esc(source_id)}">'
    for f in IDEAS.glob("*.html"):
        if needle in f.read_text(encoding="utf-8"):
            return f
    return None


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sub = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    source_id = (sub.get("source_id") or "").strip()
    title = (sub.get("post_title") or "").strip()
    body = (sub.get("post_body") or "").strip()
    if not source_id or not title or not body:
        sys.exit("source_id, post_title and post_body are all required")

    existing = find_existing(source_id)
    if existing:
        print(json.dumps({"status": "already_published",
                          "url": f"{BASE}/ideas/{existing.name}"}))
        return

    # The post is dated the day it goes live (ET), not the day it was sent.
    live = datetime.now(timezone.utc).astimezone(ET)
    date_iso = live.strftime("%Y-%m-%d")
    date_long = f"{live.strftime('%B')} {live.day}, {live.year}"
    date_short = f"{live.strftime('%b')} {live.day}"
    month_label = f"{live.strftime('%B')} {live.year}"

    credit = (sub.get("credit") or "").strip() or DEFAULT_CREDIT
    byline = f"By {esc(credit)}"

    IDEAS.mkdir(exist_ok=True)
    slug = base = slugify(title)
    i = 2
    while (IDEAS / f"{slug}.html").exists():
        slug = f"{base}-{i}"
        i += 1

    desc = summary(body)
    jsonld = json.dumps({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": desc,
        "datePublished": date_iso,
        "author": {"@type": "Person", "name": credit},
        "publisher": {"@type": "Organization", "name": "The Gospel Vault"},
        "isPartOf": {"@type": "CollectionPage", "name": "Vault 9 — Ideas & Blog",
                     "url": f"{BASE}/vault-9-ideas-blog.html"},
        "url": f"{BASE}/ideas/{slug}.html",
    }, ensure_ascii=False, indent=2).replace("</", "<\\/")

    page = TEMPLATE.read_text(encoding="utf-8")
    for k, v in {
        "SOURCE_ID": esc(source_id), "TITLE": esc(title), "DESCRIPTION": esc(desc),
        "SLUG": slug, "JSONLD": jsonld, "BYLINE": byline, "DATE_ISO": date_iso,
        "DATE_LONG": date_long, "BODY": body_html(body),
    }.items():
        page = page.replace("{{" + k + "}}", v)
    assert "{{" not in page, "unfilled placeholder in template"

    # --- Vault 9 card -------------------------------------------------
    v9 = VAULT9.read_text(encoding="utf-8")
    start = "<!-- POSTS:START"
    if start not in v9 or "<!-- POSTS:END -->" not in v9:
        sys.exit("Vault 9 page is missing the POSTS:START / POSTS:END markers")
    v9 = re.sub(r'\s*<p class="posts-empty"[^>]*>.*?</p>', "", v9, flags=re.S)
    card = (f'      <a class="card" href="ideas/{slug}.html">\n'
            f'        <span class="tag">{esc(date_long)} &middot; {esc(credit)}</span>\n'
            f'        <h3>{esc(title)}</h3>\n'
            f'        <p>{esc(summary(body, 140))}</p>\n'
            f'      </a>')
    v9 = re.sub(r"(<!-- POSTS:START[^\n]*-->\n)", lambda m: m.group(1) + card + "\n", v9, count=1)

    # --- sitemap ------------------------------------------------------
    sm = SITEMAP.read_text(encoding="utf-8")
    loc = f"{BASE}/ideas/{slug}.html"
    if loc not in sm:
        sm = sm.replace("</urlset>", f"  <url>\n    <loc>{loc}</loc>\n  </url>\n</urlset>", 1)

    # --- What's New ---------------------------------------------------
    up = UPDATES.read_text(encoding="utf-8")
    li = (f'      <li>\n'
          f'        <time datetime="{date_iso}">{date_short}</time>\n'
          f'        <div>\n'
          f'          <span class="tag">Vault 9 · Ideas &amp; Blog</span>\n'
          f'          <h3><a href="ideas/{slug}.html">{esc(title)}</a></h3>\n'
          f'          <p>A reader reflection by {esc(credit.rstrip("."))}.</p>\n'
          f'        </div>\n'
          f'      </li>\n')
    m = re.search(r'( *)<h2 class="updates-month">([^<]+)</h2>\s*<ul class="updates-list">\n', up)
    if not m:
        sys.exit("updates.html: could not find the month list")
    if m.group(2).strip() == month_label:
        up = up[:m.end()] + li + up[m.end():]
    else:
        ind = m.group(1)
        block = (f'{ind}<h2 class="updates-month">{month_label}</h2>\n'
                 f'{ind}<ul class="updates-list">\n{li}{ind}</ul>\n')
        up = up[:m.start()] + block + up[m.start():]

    (IDEAS / f"{slug}.html").write_text(page, encoding="utf-8")
    VAULT9.write_text(v9, encoding="utf-8")
    SITEMAP.write_text(sm, encoding="utf-8")
    UPDATES.write_text(up, encoding="utf-8")
    print(json.dumps({"status": "published", "url": loc, "slug": slug,
                      "title": title, "credit": credit}))


if __name__ == "__main__":
    main()
