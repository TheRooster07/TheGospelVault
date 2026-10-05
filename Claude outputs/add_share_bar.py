#!/usr/bin/env python3
"""
Add the Gospel Vault share bar to every HTML page in the site.

What it does, for each .html file under the site folder:
  1. Adds  <script src=".../assets/share-bar.js" defer></script>  before </body>
     (path is relative, so it works on the live site AND when opening files locally).
  2. Adds link-preview tags (Open Graph / X card) to <head> if they are missing,
     so shares on Facebook, X, WhatsApp, etc. show a title, description and image.
     Existing tags are never changed.
It also copies share-bar.js into  <site>/assets/  if it isn't there yet.

Usage (from the folder that holds this script and share-bar.js):
    python3 add_share_bar.py /path/to/your/site --dry-run   # preview, changes nothing
    python3 add_share_bar.py /path/to/your/site             # apply

Skip a page: add  <meta name="share-bar" content="off">  to its <head>
(the script still gets added, but the bar won't show), or list it in SKIP below.
Safe to run again: pages that already have the bar are left alone.
Commit to Git first so any change is one click to undo.
"""
import html
import os
import re
import shutil
import sys

# ---------- Settings ----------
SITE_URL = "https://thegospelvault.com"     # no trailing slash
SITE_NAME = "The Gospel Vault"
# Image shown in link previews when a page has none of its own (1200x630 works best).
# Put the file in your site and set its full URL, or leave "" to skip.
DEFAULT_IMAGE = ""
SKIP_DIRS = {".git", "node_modules", ".github", ".vscode", "_to_delete", "Claude outputs"}
SKIP = set()   # e.g. {"404.html"}
# --------------------------------

SCRIPT_NAME = "share-bar.js"


def page_url(rel_path):
    rel = rel_path.replace(os.sep, "/")
    if rel.endswith("index.html"):
        rel = rel[: -len("index.html")]
    return f"{SITE_URL}/{rel}"


def find(pattern, text):
    m = re.search(pattern, text, re.I | re.S)
    return html.unescape(m.group(1).strip()) if m else ""


def has_meta(text, attr, value):
    return re.search(rf'<meta[^>]+{attr}\s*=\s*["\']{re.escape(value)}["\']', text, re.I) is not None


def build_head_tags(text, rel_path):
    title = find(r"<title[^>]*>(.*?)</title>", text)
    desc = find(r'<meta[^>]+name\s*=\s*["\']description["\'][^>]+content\s*=\s*["\'](.*?)["\']', text)
    url = page_url(rel_path)
    q = lambda s: html.escape(s, quote=True)
    tags = []
    if not re.search(r'<link[^>]+rel\s*=\s*["\']canonical["\']', text, re.I):
        tags.append(f'<link rel="canonical" href="{q(url)}">')
    wanted = [
        ("property", "og:type", "article"),
        ("property", "og:site_name", SITE_NAME),
        ("property", "og:url", url),
        ("property", "og:title", title),
        ("property", "og:description", desc),
        ("property", "og:image", DEFAULT_IMAGE),
        ("name", "twitter:card", "summary_large_image" if DEFAULT_IMAGE else "summary"),
        ("name", "twitter:title", title),
        ("name", "twitter:description", desc),
        ("name", "twitter:image", DEFAULT_IMAGE),
    ]
    for attr, key, val in wanted:
        if val and not has_meta(text, attr, key):
            tags.append(f'<meta {attr}="{key}" content="{q(val)}">')
    return tags


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    if not args:
        print(__doc__)
        sys.exit(1)
    site = os.path.abspath(args[0])
    here = os.path.dirname(os.path.abspath(__file__))

    assets = os.path.join(site, "assets")
    target_js = os.path.join(assets, SCRIPT_NAME)
    if not os.path.exists(target_js):
        print(f"{'Would copy' if dry else 'Copying'} {SCRIPT_NAME} -> assets/")
        if not dry:
            os.makedirs(assets, exist_ok=True)
            shutil.copy2(os.path.join(here, SCRIPT_NAME), target_js)

    changed = skipped = 0
    for root, dirs, files in os.walk(site):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for name in sorted(files):
            if not name.lower().endswith((".html", ".htm")):
                continue
            path = os.path.join(root, name)
            rel = os.path.relpath(path, site)
            if rel.replace(os.sep, "/") in SKIP:
                continue
            with open(path, encoding="utf-8", errors="surrogateescape", newline="") as f:
                text = f.read()
            if SCRIPT_NAME in text:
                skipped += 1
                continue
            if not re.search(r"</body\s*>", text, re.I):
                print(f"  ! no </body> tag, left alone: {rel}")
                continue

            src = os.path.relpath(target_js, os.path.dirname(path)).replace(os.sep, "/")
            new = re.sub(r"(</body\s*>)",
                         f'<script src="{src}" defer></script>\n\\1',
                         text, count=1, flags=re.I)
            tags = build_head_tags(text, rel)
            if tags and re.search(r"</head\s*>", new, re.I):
                block = "  " + "\n  ".join(tags) + "\n"
                new = re.sub(r"(</head\s*>)", block + r"\1", new, count=1, flags=re.I)

            print(f"  + {rel}" + (f"  (+{len(tags)} preview tags)" if tags else ""))
            changed += 1
            if not dry:
                with open(path, "w", encoding="utf-8", errors="surrogateescape", newline="") as f:
                    f.write(new)

    verb = "Would update" if dry else "Updated"
    print(f"\n{verb} {changed} page(s); {skipped} already had the share bar.")


if __name__ == "__main__":
    main()
