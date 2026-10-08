"""Add The Gospel Vault reader tools (text size, light/dark, verse popups) to every page.

Usage:  python install_reader_tools.py [--dry-run]   (run from the site root)
Safe to run twice: pages that already have the tools are skipped.
"""
import os, re, sys

DRY = "--dry-run" in sys.argv
ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP_DIRS = {".git", "_to_delete", "Claude outputs", "node_modules"}
EARLY = ("<script>try{var d=document.documentElement,t=localStorage.getItem('tgv-theme'),"
         "s=localStorage.getItem('tgv-text');if(t)d.setAttribute('data-theme',t);"
         "if(s)d.setAttribute('data-text',s)}catch(e){}</script>")
SHARE = re.compile(r'([ \t]*)<script src="((?:\.\./)*)assets/share-bar\.js" defer></script>')

done = skipped = 0
problems = []
for dirpath, dirnames, files in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for name in files:
        if not name.endswith(".html"):
            continue
        path = os.path.join(dirpath, name)
        rel = os.path.relpath(path, ROOT)
        with open(path, encoding="utf-8", newline="") as f:
            s = f.read()
        if "reader-tools.js" in s:
            skipped += 1
            continue
        m = SHARE.search(s)
        if m:
            prefix = m.group(2)
        else:
            prefix = "../" * rel.replace("\\", "/").count("/")
        nl = "\r\n" if "\r\n" in s else "\n"
        if s.count("</head>") != 1 or s.count("</body>") != 1:
            problems.append(rel)
            continue
        head_add = (f'<link rel="stylesheet" href="{prefix}assets/reader-tools.css">{nl}{EARLY}{nl}</head>')
        s2 = s.replace("</head>", head_add, 1)
        tag = f'<script src="{prefix}assets/reader-tools.js" defer></script>'
        if m:
            s2 = SHARE.sub(lambda mm: mm.group(0) + nl + mm.group(1) + tag, s2, count=1)
        else:
            s2 = s2.replace("</body>", tag + nl + "</body>", 1)
        if not DRY:
            with open(path, "w", encoding="utf-8", newline="") as f:
                f.write(s2)
        done += 1

print(("Would update" if DRY else "Updated"), done, "pages; already had it:", skipped)
if problems:
    print("Skipped (unusual <head>/<body>):", *problems, sep="\n  ")
