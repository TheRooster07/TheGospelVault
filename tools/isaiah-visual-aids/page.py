import re,html,os,shutil,subprocess
SRC='/mnt/user-data/uploads/TheGospelVault/prophesy/visual-aids.html'
OUT='/mnt/user-data/outputs/isaiah'
t=open(SRC,encoding='utf8').read()
charts=[ # n, slug, title, desc, anchor, label
(1,'isaiah-at-a-glance','Isaiah at a Glance','From Isaiah’s call to the new heavens and new earth: the ministry dates, the exile and return, and the prophetic bands.','introduction','Overview'),
(2,'kings-and-prophets-intro','Kings and Prophets in Isaiah’s Day','Judah, Israel, Assyria and the eighth-century prophets on one time line, 800–670 BC.','introduction','Introduction'),
(3,'shape-of-the-book','The Shape of the Book','Judgment (1–39) and comfort (40–66), with the three groups of nine chapters and the Suffering Servant at the center.','isaiah-40','Isaiah 40'),
(4,'messiah-first-advent','Messiah in Isaiah: The First Advent','Sixteen prophecies of the sufferings, each with its New Testament fulfillment.','isaiah-52-13-53-12','Messiah in Isaiah'),
(5,'messiah-second-advent','Messiah in Isaiah: The Second Advent','Fourteen prophecies of the glories that wait for Christ’s return and kingdom.','isaiah-63','Messiah in Isaiah'),
(6,'syro-ephraimite-crisis-isa7','The Syro-Ephraimite Crisis','Aram and Israel against Judah; Isaiah meets Ahaz at the upper pool; Ahaz turns to Assyria.','isaiah-7','Isaiah 7–8'),
(7,'sign-children-isa7-8','Isaiah’s Sign-Children','Shear-jashub, Immanuel and Maher-shalal-hash-baz — names that preached.','isaiah-8','Isaiah 7–8'),
(8,'burdens-on-the-nations-isa13','The Burdens on the Nations','The ten oracles of Isaiah 13–23 on a schematic map, from Babylon to Tyre.','isaiah-13','Isaiah 13–23'),
(9,'near-and-far-isa13-23','Near and Far in the Burdens','Which oracles were fulfilled in Isaiah’s era, and which also look to “that day.”','isaiah-13','Isaiah 13–23'),
(10,'in-that-day-isa24-27','“In That Day”: Isaiah 24–27','The Tribulation, the Second Coming and the Millennial Kingdom in Isaiah’s “little apocalypse.”','isaiah-24','Isaiah 24–27'),
(11,'six-woes-isa28-33','Six Woes and the Coming King','The woes of Isaiah 28–33 and God’s answer: the cornerstone and the King.','isaiah-28','Isaiah 28–33'),
(12,'sennacherib-701-isa36','Sennacherib’s Campaign, 701 BC','From the coast to Lachish, Libnah and the upper pool — and home to Nineveh.','isaiah-36','Isaiah 36–37'),
(13,'hezekiah-three-crises-isa36-39','Hezekiah’s Three Crises','Illness, Babylon’s envoys and Assyria’s siege, in the order they happened.','isaiah-38','Isaiah 36–39'),
(14,'cyrus-road-home-isa44','Cyrus and the Road Home','The deliverer named in advance: Persia, the fall of Babylon, the decree and the return.','isaiah-45','Isaiah 40–48'),
(15,'living-god-and-idols-isa40-48','The Living God and the Idols','“To whom will you liken Me?” — the idols and the LORD, side by side.','isaiah-44','Isaiah 40–48'),
(16,'four-servant-songs','The Four Servant Songs','The Servant who succeeds where the servant nation failed, with the New Testament fulfillments.','isaiah-42','Isaiah 42–53'),
(17,'isaiah53-who-is-speaking','Isaiah 52:13–53:12: Who Is Speaking?','God speaks of “My Servant”; Israel confesses “we” and “our”; the New Testament quotations.','isaiah-52-13-53-12','Isaiah 52:13–53:12'),
(18,'wife-of-jehovah-isa54','Israel, the Wife of Jehovah','The marriage picture behind Isaiah 50, 54 and 62 — from Sinai to the remarriage.','isaiah-54','Isaiah 50; 54; 62'),
]
groups=[('The book, its history and its Messiah','Overview &amp; Introduction',[1,2,3,4,5]),('Ahaz, Immanuel and the Assyrian threat','Isaiah 1–12',[6,7]),
('The nations and “that day”','Isaiah 13–27',[8,9,10]),('Woes, Sennacherib and Hezekiah','Isaiah 28–39',[11,12,13]),
('Comfort: Cyrus and the living God','Isaiah 40–48',[14,15]),('The Servant and the restored wife','Isaiah 49–66',[16,17,18])]
# images
os.makedirs(OUT+'/visual-aids/img',exist_ok=True)
subprocess.run(['pdftoppm','-jpeg','-jpegopt','quality=90','-scale-to-x','1600','-scale-to-y','900','Isaiah_Visual_Aids.pdf','tmpimg'],check=True)
for n,slug,*_ in charts:
    shutil.copy(f'tmpimg-{n:02d}.jpg',f'{OUT}/visual-aids/img/{n:02d}-{slug}.jpg')
shutil.copy('Isaiah_Visual_Aids.pptx',OUT+'/visual-aids/Isaiah_Visual_Aids.pptx')
shutil.copy('Isaiah_Visual_Aids.pdf',OUT+'/visual-aids/Isaiah_Visual_Aids.pdf')
pdfmb=os.path.getsize('Isaiah_Visual_Aids.pdf')/1e6; pptmb=os.path.getsize('Isaiah_Visual_Aids.pptx')/1e6
E=lambda s:html.escape(s,quote=True)
head=t[:t.index('<main>')]
foot=t[t.index('</main>'):]
desc='Eighteen charts, timelines and maps for the Isaiah 1–66 Outline and Notes — download the full set as a PDF or an editable PowerPoint.'
title='Visual Aids: Charts, Timelines &amp; Maps | Isaiah 1–66 Outline and Notes | The Gospel Vault'
head=re.sub(r'<title>.*?</title>',f'<title>{title}</title>',head,flags=re.S)
head=re.sub(r'(<meta name="description" content=")[^"]*',r'\g<1>'+E(desc),head)
head=re.sub(r'(<meta property="og:description" content=")[^"]*',r'\g<1>'+E(desc),head)
head=re.sub(r'(<meta name="twitter:description" content=")[^"]*',r'\g<1>'+E(desc),head)
head=re.sub(r'(og:title" content=")[^"]*',r'\g<1>Visual Aids: Charts, Timelines &amp; Maps | Isaiah 1–66 Outline and Notes',head)
head=re.sub(r'(twitter:title" content=")[^"]*',r'\g<1>Visual Aids: Charts, Timelines &amp; Maps | Isaiah 1–66 Outline and Notes',head)
head=head.replace('https://thegospelvault.com/prophesy/visual-aids.html','https://thegospelvault.com/bible-studies/isaiah/visual-aids.html')
head=head.replace('https://thegospelvault.com/prophesy/visual-aids/img/01-master-timeline-overview.jpg','https://thegospelvault.com/bible-studies/isaiah/visual-aids/img/01-isaiah-at-a-glance.jpg')
head=head.replace('href="style.css"','href="../../css/style.css"').replace('href="../assets/','href="../../assets/')
va_css=re.findall(r'^(\.va-[^\n]*|\.btn-outline[^\n]*|@media \(max-width: 720px\) \{ \.va-grid[^\n]*)$',open('/dev/stdin').read() if False else '',re.M)
head=head.replace('</head>','''<style>
.va-buttons{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:30px}
.btn-outline{background:transparent;color:var(--color-gold-light);font-weight:600}
.btn-outline:hover{background:rgba(201,162,75,.12);text-decoration:none}
.va-note{font-size:.82rem;margin:14px auto 0;text-align:center}
.va-intro-wrap{padding:40px 0 0}.va-intro-wrap .app-card{margin-bottom:0}
.va-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:26px}
.va-figure{margin:0;background:var(--color-panel);border:1px solid var(--color-border);border-radius:6px;overflow:hidden;display:flex;flex-direction:column}
.va-figure .va-img{display:block;background:#FAF7EF;border-bottom:1px solid var(--color-border)}
.va-figure .va-img img{width:100%;height:auto;aspect-ratio:16/9;object-fit:contain;transition:opacity .15s ease}
.va-figure .va-img:hover img{opacity:.9}
.va-figure figcaption{padding:16px 20px 20px}
.va-figure .tag{display:block;color:var(--color-gold);font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
.va-figure .tag a{color:var(--color-gold)}
.va-figure h3{font-size:1.05rem;margin-bottom:6px;text-wrap:balance}
.va-figure p{font-size:.88rem;margin:0}
.site-footer .attribution{font-size:.8rem;margin-top:6px}
@media (max-width:720px){.va-grid{grid-template-columns:1fr}}
</style>
</head>''',1)
# nav: active vault 4 not 5
head=head.replace('vault-5-topical-studies.html" class="active"','vault-5-topical-studies.html"').replace('vault-4-ot-book-studies.html">','vault-4-ot-book-studies.html" class="active">',1)
m=['<main>','<section class="hero">\n  <div class="container">',
'    <p class="eyebrow">Vault 4 &middot; OT Book Studies &middot; Isaiah 1&ndash;66 Outline and Notes</p>',
'    <h1>Visual Aids: Charts, Timelines &amp; Maps</h1>',
'    <p class="lead">Eighteen visual aids for the study of Isaiah &mdash; timelines, comparison charts and maps, each keyed to the chapter it illustrates. Download the full set as a PDF to read or print, or as an editable PowerPoint to teach from.</p>',
'    <div class="va-buttons">',
'      <a class="btn btn-primary" href="visual-aids/Isaiah_Visual_Aids.pdf">&#9082; Download the PDF</a>',
'      <a class="btn btn-outline" href="visual-aids/Isaiah_Visual_Aids.pptx" download>&#9082; Download the PowerPoint</a>','    </div>',
f'    <p class="va-note">PDF &middot; 18 pages &middot; {pdfmb:.1f} MB &nbsp;&nbsp;|&nbsp;&nbsp; PowerPoint &middot; 18 slides &middot; {pptmb:.1f} MB &middot; speaker notes give each chart&rsquo;s placement and sources</p>',
'  </div>\n</section>',
'<section class="va-intro-wrap">\n  <div class="container">\n    <div class="app-card">\n      <span class="label">How to Use These</span>',
'      <p>The charts follow the order of the book, so a leader can teach straight through the deck alongside the notes. Each chart links to the chapter it illustrates; select an image to open it full size. The charts draw on Pastor William K. Lyons&rsquo;s outline and notes; the two Messiah charts and the New Testament columns add cross-references, and the speaker notes name every source. Several charts connect to the <a href="../../prophesy/visual-aids.html">Prophecy visual aids</a>.</p>',
'    </div>\n  </div>\n</section>']
byn={c[0]:c for c in charts}
for gi,(eb,h2,ns) in enumerate(groups):
    m.append(f'<section{" class=\"section-alt\"" if gi%2 else ""}>\n  <div class="container">\n    <div class="section-heading">\n      <span class="eyebrow">{eb}</span>\n      <h2>{h2}</h2>\n    </div>\n    <div class="va-grid">')
    for n in ns:
        _,slug,ti,de,anc,lab=byn[n]; img=f'visual-aids/img/{n:02d}-{slug}.jpg'
        m.append(f'<figure class="va-figure" id="fig-{n:02d}">\n<a class="va-img" href="{img}" target="_blank" rel="noopener"><img src="{img}" alt="{E(ti)} — {E(de)}" loading="lazy" width="1600" height="900"></a>\n<figcaption><span class="tag">Chart {n} &middot; <a href="./#{anc}">{E(lab)}</a></span><h3>{E(ti)}</h3><p>{E(de)}</p></figcaption>\n</figure>')
    m.append('    </div>\n  </div>\n</section>')
m+=['<section>\n  <div class="container" style="text-align:center;">','    <div class="va-buttons">',
'      <a class="btn btn-primary" href="visual-aids/Isaiah_Visual_Aids.pdf">&#9082; Download the PDF</a>',
'      <a class="btn btn-outline" href="visual-aids/Isaiah_Visual_Aids.pptx" download>&#9082; Download the PowerPoint</a>','    </div>',
'    <p class="va-note"><a href="./">&larr; Back to Isaiah 1&ndash;66: Outline and Notes</a></p>',
'    <div data-share-bar style="max-width:760px;margin:40px auto 0;text-align:left;"></div>','  </div>\n</section>']
foot=re.sub(r'<div class="attribution">.*?</div>','<div class="attribution">Isaiah 1&ndash;66 Outline and Notes &mdash; Pastor William K. Lyons (used by permission) &middot; eBibleNotes.com. Charts: The Gospel Vault.</div>',foot,flags=re.S)
foot=foot.replace('src="../assets/','src="../../assets/')
open(OUT+'/visual-aids.html','w',encoding='utf8').write(head+'\n'.join(m)+'\n'+foot)
print('ok',pdfmb,pptmb)
