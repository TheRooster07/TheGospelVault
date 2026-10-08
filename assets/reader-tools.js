/*!
 * The Gospel Vault — Reader Tools
 * 1. Text size:  A−  A  A+   (remembered across pages)
 * 2. Light / dark switch       (remembered across pages)
 * 3. Verse popups: hover (or tap) a Scripture reference to read the
 *    NASB95 text, using Blue Letter Bible's free ScriptTagger.
 *
 * INSTALL (the installer adds all three):
 *   <head>: <link rel="stylesheet" href="/assets/reader-tools.css">
 *           + the one-line inline script that applies saved choices early
 *   </body>: <script src="/assets/reader-tools.js" defer></script>
 *
 * TURN OFF on a page:
 *   <meta name="reader-tools" content="off">     (whole toolbar + popups)
 *   <meta name="verse-popups" content="off">     (popups only)
 * SKIP one area for popups: add class="noTag" to it.
 */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  if (doc.querySelector('meta[name="reader-tools"][content="off"]')) return;
  if (doc.getElementById("tgv-reader")) return;

  var KEY_TEXT = "tgv-text", KEY_THEME = "tgv-theme";
  var LEVELS = 5, DEFAULT = 1; // 0.9, 1, 1.1, 1.2, 1.35 (see reader-tools.css)

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }

  // ---------- Native theme of this page (before any override) ----------
  function luminance(rgb) {
    var m = (rgb || "").match(/\d+(\.\d+)?/g);
    if (!m || (m.length === 4 && +m[3] === 0)) return 1;
    return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
  }
  var saved = root.getAttribute("data-theme");
  root.removeAttribute("data-theme");
  var native = luminance(getComputedStyle(doc.body).backgroundColor) < 0.5 ? "dark" : "light";
  if (saved) root.setAttribute("data-theme", saved);
  root.setAttribute("data-tgv-native", native);

  // ---------- State ----------
  var level = parseInt(get(KEY_TEXT), 10);
  if (!(level >= 0 && level < LEVELS)) level = DEFAULT;
  var theme = get(KEY_THEME);
  if (theme !== "light" && theme !== "dark") theme = null;

  function applyText() {
    if (level === DEFAULT) root.removeAttribute("data-text");
    else root.setAttribute("data-text", String(level));
  }
  function applyTheme() {
    if (theme && theme !== native) root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
    root.setAttribute("data-tgv-eff", theme || native);
  }
  applyText(); applyTheme();

  // ---------- Toolbar ----------
  var SVG = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
  var SUN = "<svg " + SVG + '><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  var MOON = "<svg " + SVG + '><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  var bar = doc.createElement("div");
  bar.id = "tgv-reader";
  bar.className = "noTag";
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", "Reading options");
  bar.innerHTML =
    '<button type="button" class="tgv-sm" data-act="smaller" aria-label="Smaller text" title="Smaller text">A&minus;</button>' +
    '<button type="button" data-act="reset" aria-label="Default text size" title="Default text size">A</button>' +
    '<button type="button" class="tgv-lg" data-act="larger" aria-label="Larger text" title="Larger text">A+</button>' +
    '<span class="tgv-sep" aria-hidden="true"></span>' +
    '<button type="button" data-act="light" aria-label="Light mode" title="Light mode">' + SUN + "</button>" +
    '<button type="button" data-act="dark" aria-label="Dark mode" title="Dark mode">' + MOON + "</button>";

  function btn(a) { return bar.querySelector('[data-act="' + a + '"]'); }
  function sync() {
    var eff = theme || native;
    btn("smaller").disabled = level === 0;
    btn("larger").disabled = level === LEVELS - 1;
    btn("reset").setAttribute("aria-pressed", String(level === DEFAULT));
    btn("light").setAttribute("aria-pressed", String(eff === "light"));
    btn("dark").setAttribute("aria-pressed", String(eff === "dark"));
  }

  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var act = b.getAttribute("data-act");
    if (act === "smaller" && level > 0) level--;
    else if (act === "larger" && level < LEVELS - 1) level++;
    else if (act === "reset") level = DEFAULT;
    else if (act === "light" || act === "dark") theme = act;
    if (act === "light" || act === "dark") { put(KEY_THEME, theme); applyTheme(); }
    else { put(KEY_TEXT, level === DEFAULT ? null : String(level)); applyText(); }
    sync();
  });

  // In the site header on wide screens; a floating pill on phones and on
  // pages without a header.
  var headerBox = doc.querySelector(".site-header .container");
  var narrow = window.matchMedia ? window.matchMedia("(max-width: 720px)") : null;
  function place() {
    if (headerBox && !(narrow && narrow.matches)) {
      bar.classList.remove("tgv-float");
      headerBox.insertBefore(bar, headerBox.querySelector(".nav-toggle"));
    } else {
      bar.classList.add("tgv-float");
      if (bar.parentNode !== doc.body) doc.body.appendChild(bar);
    }
  }
  place();
  if (narrow) {
    if (narrow.addEventListener) narrow.addEventListener("change", place);
    else if (narrow.addListener) narrow.addListener(place);
  }
  sync();

  // ---------- Verse popups ----------
  if (doc.querySelector('meta[name="verse-popups"][content="off"]')) return;

  var BOOKS = {
    gen: "Genesis", exo: "Exodus", lev: "Leviticus", num: "Numbers", deu: "Deuteronomy", jos: "Joshua",
    jdg: "Judges", rth: "Ruth", "1sa": "1 Samuel", "2sa": "2 Samuel", "1ki": "1 Kings", "2ki": "2 Kings",
    "1ch": "1 Chronicles", "2ch": "2 Chronicles", ezr: "Ezra", neh: "Nehemiah", est: "Esther", job: "Job",
    psa: "Psalms", pro: "Proverbs", ecc: "Ecclesiastes", sng: "Song of Songs", isa: "Isaiah", jer: "Jeremiah",
    lam: "Lamentations", eze: "Ezekiel", dan: "Daniel", hos: "Hosea", joe: "Joel", amo: "Amos", oba: "Obadiah",
    jon: "Jonah", mic: "Micah", nah: "Nahum", hab: "Habakkuk", zep: "Zephaniah", hag: "Haggai",
    zec: "Zechariah", mal: "Malachi", mat: "Matthew", mar: "Mark", luk: "Luke", jhn: "John", act: "Acts",
    rom: "Romans", "1co": "1 Corinthians", "2co": "2 Corinthians", gal: "Galatians", eph: "Ephesians",
    php: "Philippians", col: "Colossians", "1th": "1 Thessalonians", "2th": "2 Thessalonians",
    "1ti": "1 Timothy", "2ti": "2 Timothy", tit: "Titus", phm: "Philemon", heb: "Hebrews", jas: "James",
    "1pe": "1 Peter", "2pe": "2 Peter", "1jo": "1 John", "2jo": "2 John", "3jo": "3 John", jde: "Jude",
    rev: "Revelation"
  };
  var SHORT = /^(\d+)(:\d+)?([–—-]\d+(:\d+)?)?$/;

  // Links that show only "5:7" or "39" get the full reference while the
  // tagger reads the page, then their original text is put back.
  function expandShortLinks() {
    var undo = [];
    var links = doc.querySelectorAll('a[href*="blueletterbible.org/"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i], t = a.textContent.trim();
      if (!SHORT.test(t)) continue;
      var m = a.getAttribute("href").match(/blueletterbible\.org\/[a-z0-9]+\/([a-z0-9]{3})\/(\d+)(?:\/(\d+))?/i);
      if (!m || !BOOKS[m[1].toLowerCase()]) continue;
      var book = BOOKS[m[1].toLowerCase()];
      undo.push([a, a.innerHTML]);
      a.textContent = book + " " + (t.indexOf(":") > -1 ? t : m[3] ? m[2] + ":" + t : t);
    }
    return undo;
  }

  function startTagger() {
    var s = doc.createElement("script");
    s.src = "https://www.blueletterbible.org/assets/scripts/blbToolTip/BLB_ScriptTagger-min.js";
    s.async = true;
    s.onload = function () {
      var T = window.BLB && window.BLB.Tagger;
      if (!T || typeof T.pageInit !== "function") return;
      T.Translation = "NASB95";
      T.HyperLinks = "hover";          // keep our own links; just add the popup
      T.HideTranslationAbbrev = false;
      T.TargetNewWindow = true;
      T.DarkTheme = false;             // colors come from reader-tools.css
      T.Style = "par";
      T.NoSearchTagNames = "h1 h2 h3 cite";
      T.NoSearchClassNames = "noTag doNotTag gv-share";
      var undo = expandShortLinks();
      try { T.pageInit(); } catch (e) {}
      // put the short link text back once the tagger has marked those links
      var started = Date.now();
      (function restore() {
        var done = undo.every(function (u) { return u[0].classList.contains("BLBST_a"); });
        if (!done && Date.now() - started < 3000) return setTimeout(restore, 50);
        for (var i = 0; i < undo.length; i++) undo[i][0].innerHTML = undo[i][1];
      })();
    };
    doc.head.appendChild(s);
  }
  // Keep the popup inside the screen (phones, references near the right edge).
  function clampPopup(div) {
    if (div.style.display === "none") return;
    var r = div.getBoundingClientRect(), w = doc.documentElement.clientWidth, pad = 8;
    if (!r.width) return;
    var left = parseFloat(div.style.left) || 0, shift = 0;
    if (r.right > w - pad) shift = (w - pad) - r.right;
    if (r.left + shift < pad) shift = pad - r.left;
    if (Math.abs(shift) > 0.5) div.style.left = Math.round(left + shift) + "px";
  }
  if (window.MutationObserver) {
    var watching = false;
    new MutationObserver(function () {
      var div = doc.getElementById("scriptDiv");
      if (!div || watching) return;
      watching = true;
      new MutationObserver(function () { clampPopup(div); })
        .observe(div, { attributes: true, attributeFilter: ["style", "class"], childList: true });
      clampPopup(div);
    }).observe(doc.body, { childList: true });
  }

  if (doc.readyState === "complete") startTagger();
  else window.addEventListener("load", startTagger);
})();
