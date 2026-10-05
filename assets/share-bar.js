/*!
 * The Gospel Vault — Share Bar
 * Adds Print/PDF, Facebook, X, Email, Copy link, Share, and WhatsApp
 * buttons to the end of each article, plus a clean print layout.
 *
 * INSTALL: add one line before </body> on any page:
 *   <script src="/assets/share-bar.js" defer></script>
 *
 * PLACEMENT (first match wins):
 *   1. an element with  data-share-bar  (put <div data-share-bar></div> where you want it)
 *   2. the end of <article>
 *   3. the end of <main>
 *   4. just before <footer>
 *   5. the end of <body>
 *
 * TURN OFF on a page (e.g. the homepage):
 *   <meta name="share-bar" content="off">
 */
(function () {
  "use strict";

  if (document.querySelector('meta[name="share-bar"][content="off"]')) return;
  if (document.querySelector(".gv-share")) return; // already added

  // ---------- Page details ----------
  function meta(sel) {
    var el = document.querySelector(sel);
    return el ? (el.getAttribute("content") || el.getAttribute("href") || "").trim() : "";
  }
  var pageUrl =
    meta('link[rel="canonical"]') || meta('meta[property="og:url"]') || location.href.split("#")[0];
  var pageTitle =
    meta('meta[property="og:title"]') || document.title || "The Gospel Vault";
  var pageDesc =
    meta('meta[property="og:description"]') || meta('meta[name="description"]');

  var u = encodeURIComponent(pageUrl);
  var t = encodeURIComponent(pageTitle);

  // ---------- Icons (inline SVG, inherit text color) ----------
  var S = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"';
  var stroke = ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var ICON = {
    print: "<svg " + S + stroke + '><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
    facebook: "<svg " + S + ' fill="currentColor"><path d="M13.5 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.3h2.8V22h3.4z"/></svg>',
    x: "<svg " + S + ' fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    email: "<svg " + S + stroke + '><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
    link: "<svg " + S + stroke + '><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    check: "<svg " + S + stroke + '><polyline points="20 6 9 17 4 12"/></svg>',
    share: "<svg " + S + stroke + '><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>',
    whatsapp: "<svg " + S + stroke + '><path d="M3 21l1.65-4.6A9 9 0 1 1 8.4 19.6L3 21z"/><path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l1-1.6-2-1-1 .9a4.6 4.6 0 0 1-2.3-2.3l.9-1-1-2L9 8.5z" fill="currentColor" stroke-width="1"/></svg>'
  };

  // ---------- Styles (screen + print) ----------
  var css = [
    ".gv-share{--gv-accent:var(--accent,var(--color-gold,var(--primary,#8a6d3b)));margin:2.5rem 0 1.5rem;padding-top:1.25rem;border-top:1px solid color-mix(in srgb,currentColor 18%,transparent);font-family:inherit}",
    ".gv-share__label{display:block;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin:0 0 .75rem}",
    ".gv-share__row{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}",
    ".gv-share__btn{box-sizing:border-box;display:inline-flex;align-items:center;gap:.45rem;min-height:40px;padding:.45rem .9rem;border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:.9rem;line-height:1;text-decoration:none;cursor:pointer;transition:background .15s,border-color .15s,color .15s,transform .15s}",
    ".gv-share__btn svg{width:18px;height:18px;flex:none}",
    ".gv-share__btn:hover{border-color:var(--gv-accent);color:var(--gv-accent);transform:translateY(-1px)}",
    ".gv-share__btn:focus-visible{outline:2px solid var(--gv-accent);outline-offset:2px}",
    ".gv-share__btn.is-done{border-color:#2e7d32;color:#2e7d32}",
    ".gv-share__btn[hidden]{display:none}",
    ".gv-share__status{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".gv-share--standalone{box-sizing:border-box;max-width:760px;margin:2.5rem auto 1.5rem;padding-left:16px;padding-right:16px}",
    ".gv-print-source{display:none}",
    "@media (max-width:480px){.gv-share__btn{padding:.45rem .75rem;font-size:.85rem}}",
    "@media print{",
    "  .gv-share,nav,.no-print,button,[role=search],.site-nav,.menu,.controls{display:none!important}",
    "  html,body{background:#fff!important;color:#000!important}",
    "  body{font-size:12pt;line-height:1.5}",
    "  a{color:#000!important;text-decoration:none!important}",
    "  img{max-width:100%!important;page-break-inside:avoid}",
    "  h1,h2,h3{page-break-after:avoid}",
    "  p,blockquote,li{orphans:3;widows:3}",
    "  .gv-print-source{display:block!important;margin-top:2rem;padding-top:.5rem;border-top:1px solid #999;font-size:9pt;color:#444!important}",
    "  @page{margin:0.75in}",
    "}"
  ].join("\n");
  var style = document.createElement("style");
  style.id = "gv-share-styles";
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- Build the bar ----------
  function btn(opts) {
    var el = document.createElement(opts.href ? "a" : "button");
    el.className = "gv-share__btn gv-share__btn--" + opts.key;
    if (opts.href) {
      el.href = opts.href;
      if (opts.newTab) { el.target = "_blank"; el.rel = "noopener noreferrer"; }
    } else {
      el.type = "button";
    }
    el.setAttribute("aria-label", opts.aria || opts.label);
    el.innerHTML = ICON[opts.icon || opts.key] + "<span>" + opts.label + "</span>";
    if (opts.onClick) el.addEventListener("click", opts.onClick);
    var li = document.createElement("li");
    li.appendChild(el);
    return li;
  }

  var bar = document.createElement("section");
  bar.className = "gv-share";
  bar.setAttribute("aria-label", "Share this page");
  bar.innerHTML = '<span class="gv-share__label">Share this</span>';
  var row = document.createElement("ul");
  row.className = "gv-share__row";
  var status = document.createElement("span");
  status.className = "gv-share__status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  // Native share (phones/tablets): opens the device share sheet — Instagram, Messages, etc.
  var shareLi = btn({
    key: "share", label: "Share", aria: "Share using your device",
    onClick: function () {
      navigator.share({ title: pageTitle, text: pageDesc || pageTitle, url: pageUrl }).catch(function () {});
    }
  });
  if (!navigator.share) shareLi.hidden = true;

  row.appendChild(shareLi);
  row.appendChild(btn({
    key: "print", label: "Print / PDF", aria: "Print or save as PDF",
    onClick: function () { window.print(); }
  }));
  row.appendChild(btn({
    key: "facebook", label: "Facebook", aria: "Share on Facebook", newTab: true,
    href: "https://www.facebook.com/sharer/sharer.php?u=" + u
  }));
  row.appendChild(btn({
    key: "x", label: "X", aria: "Share on X", newTab: true,
    href: "https://x.com/intent/post?url=" + u + "&text=" + t
  }));
  row.appendChild(btn({
    key: "whatsapp", label: "WhatsApp", aria: "Share on WhatsApp", newTab: true,
    href: "https://wa.me/?text=" + encodeURIComponent(pageTitle + " " + pageUrl)
  }));
  row.appendChild(btn({
    key: "email", label: "Email", aria: "Share by email",
    href: "mailto:?subject=" + t + "&body=" +
      encodeURIComponent((pageDesc ? pageDesc + "\n\n" : "") + "Read it here: " + pageUrl)
  }));

  var copyLi = btn({
    key: "copy", icon: "link", label: "Copy link", aria: "Copy link to this page",
    onClick: function () {
      var b = copyLi.firstChild;
      function done() {
        b.classList.add("is-done");
        b.innerHTML = ICON.check + "<span>Copied!</span>";
        status.textContent = "Link copied to clipboard";
        setTimeout(function () {
          b.classList.remove("is-done");
          b.innerHTML = ICON.link + "<span>Copy link</span>";
          status.textContent = "";
        }, 2000);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(pageUrl).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = pageUrl;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { window.prompt("Copy this link:", pageUrl); }
        document.body.removeChild(ta);
      }
    }
  });
  row.appendChild(copyLi);

  bar.appendChild(row);
  bar.appendChild(status);

  // Printed pages get the web address at the bottom
  var src = document.createElement("p");
  src.className = "gv-print-source";
  src.textContent = "Source: " + pageUrl;

  // ---------- Place it ----------
  function place() {
    var spot = document.querySelector("[data-share-bar]");
    if (spot) { spot.appendChild(bar); spot.appendChild(src); return; }
    var host = document.querySelector("article") || document.querySelector("main");
    if (host) { host.appendChild(bar); host.appendChild(src); return; }
    var footer = document.querySelector("body > footer, footer");
    if (!footer || footer.parentNode === document.body) {
      // Not inside a content column: center the bar to match the page
      bar.classList.add("gv-share--standalone");
      src.classList.add("gv-share--standalone");
    }
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(bar, footer);
      footer.parentNode.insertBefore(src, footer);
      return;
    }
    document.body.appendChild(bar);
    document.body.appendChild(src);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", place);
  else place();
})();
