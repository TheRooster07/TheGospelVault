// Ask the Vault — browser side.
// Encrypts each request before it leaves the device (on top of HTTPS), sends it to
// the private service, and decrypts the reply. Nothing is saved on the device:
// no cookies, no local storage, no history of questions or reference numbers.

(() => {
  "use strict";

  // Set after deploying the worker (see SETUP.md).
  const SERVICE_URL = "https://gv-ask.gospelvault.workers.dev/ask";
  // Written by tools/make-keys.mjs. Public: safe for anyone to see.
  const SERVICE_PUBLIC_KEY = {"kty":"EC","crv":"P-256","x":"959qZxgbdpbS7KSd6mx4PKrXwanCFvHhSWPwpuDm51g","y":"0RQ5wLNW_o_Sd1RKn_Ehn8Os7H533JPyayc2PW0N_wc"};

  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const b64 = {
    encode: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))),
    decode: (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)),
  };
  const $ = (id) => document.getElementById(id);

  function pad(obj, block) {
    const bytes = enc.encode(JSON.stringify(obj));
    const out = new Uint8Array(Math.ceil((bytes.length + 1) / block) * block).fill(0x20);
    out.set(bytes);
    return out;
  }

  async function seal(payload) {
    const server = await crypto.subtle.importKey("jwk", SERVICE_PUBLIC_KEY, { name: "ECDH", namedCurve: "P-256" }, false, []);
    const mine = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);
    const epk = await crypto.subtle.exportKey("raw", mine.publicKey);
    const shared = await crypto.subtle.deriveBits({ name: "ECDH", public: server }, mine.privateKey, 256);
    const hkdf = await crypto.subtle.importKey("raw", shared, "HKDF", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
      { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(epk), info: enc.encode("gv-ask v1") },
      hkdf, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc.encode("req") }, key, pad(payload, 1024));
    return { key, envelope: { v: 1, epk: b64.encode(epk), iv: b64.encode(iv), ct: b64.encode(ct) } };
  }

  async function open(key, sealed) {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64.decode(sealed.iv), additionalData: enc.encode("res") }, key, b64.decode(sealed.ct));
    return JSON.parse(dec.decode(plain));
  }

  // Sends one encrypted request and returns the decrypted reply (or { error }).
  async function send(payload) {
    try {
      const { key, envelope } = await seal(payload);
      const res = await fetch(SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(envelope),
        credentials: "omit",
        referrerPolicy: "no-referrer",
        cache: "no-store",
      });
      if (res.status === 429) return { error: "slow_down" };
      if (!res.ok) return { error: "failed" };
      return await open(key, await res.json());
    } catch {
      return { error: "network" };
    }
  }

  const MESSAGES = {
    slow_down: "Please wait a minute before trying again.",
    empty: "Please type a question first.",
    failed: "Something went wrong. Please try again in a moment.",
    network: "Could not reach Ask the Vault. Please check your connection and try again.",
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^https:\/\//i.test(u) ? esc(u) : "#");
  const link = (url, text, same) => `<a href="${safeUrl(url)}"${same ? "" : ' target="_blank" rel="noopener noreferrer"'}>${esc(text)}</a>`;
  const quote = (v) => `<blockquote>${v.text ? `<p>${esc(v.text)}</p>` : ""}<cite>${link(v.url, v.ref + " (WEB)")}</cite></blockquote>`;
  const notice = (error) => `<p class="notice">${esc(MESSAGES[error] || MESSAGES.failed)}</p>`;

  // An approved answer: each verse appears in full right after the paragraph that first cites it.
  function answerHtml(data, heading) {
    let html = `<h2>${heading}</h2><p class="asked">${esc(data.answer.question)}</p>`;
    html += data.answer.text.split(/\n\s*\n/).map((p, i) =>
      `<p>${esc(p.trim())}</p>` + (data.quotes || []).filter((v) => v.para === i).map(quote).join("")).join("");
    if (data.verses?.length) html += `<h2>More Scripture</h2>` + data.verses.map(quote).join("");
    if (data.more?.length) {
      html += `<h2>Go deeper</h2><ul class="sources">` + data.more.map((s) => `<li>${link(s.url, s.title, true)}</li>`).join("") + `</ul>`;
    }
    return html;
  }

  function render(data) {
    const out = $("answer");
    if (data.error) { out.innerHTML = notice(data.error); return; }
    let html = "";
    if (data.found && data.answer) {
      html += answerHtml(data, "Answer from The Gospel Vault");
    } else if (data.ref) {
      if (data.quick) {
        html += `<h2>Quick answer from our studies</h2>` +
          data.quick.text.split(/\n\s*\n/).map((p, i) =>
            `<p>${esc(p.trim())}</p>` + (data.quick.quotes || []).filter((v) => v.para === i).map(quote).join("")).join("") +
          `<p class="quicknote">This short answer was prepared with AI help, using only The Gospel Vault's published studies. ` +
          `A fuller answer, written and reviewed by The Gospel Vault, will be ready under your reference number below.</p>` +
          (data.quick.sources?.length ? `<p class="quicknote">Read more in our studies: ` +
            data.quick.sources.map((s) => link(s.url, s.title, true)).join(" · ") + `</p>` : "");
      }
      html += `<div class="refbox"><p><strong>Thank you for your question.</strong> ${data.quick ? "We read every question, and we will add a fuller answer from Scripture." : "We read every question and will prepare an answer from Scripture."}</p>` +
        `<p class="reflabel">Your reference number</p><p class="refcode" id="refcode">${esc(data.ref)}</p>` +
        `<p>Please <strong>write this number down</strong>. It is the only way to find your answer, because we do not keep anything that identifies you. ` +
        `Come back in a few days and enter it under <a href="#check">Check for your answer</a>.</p></div>`;
    } else {
      html += `<div class="refbox"><p><strong>Thank you for your question.</strong> We read every question, and questions like yours help us choose what to answer next on our ` +
        `<a href="/most-asked.html">Most Asked Questions</a> page.</p></div>`;
    }
    if (data.related?.length) {
      html += `<h2>You may also find these helpful</h2><ul class="sources">` +
        data.related.map((r) => `<li>${link(r.url, r.question, true)}</li>`).join("") + `</ul>`;
    }
    if (data.studies?.length) {
      html += `<h2>${data.found ? "More from our studies" : "While you wait, these studies may help"}</h2><ul class="studies">` +
        data.studies.map((s) => `<li>${link(s.url, s.title, true)}<span>${esc(s.excerpt)}</span></li>`).join("") + `</ul>`;
    }
    out.innerHTML = html;
    $("gospel").hidden = false;
  }

  async function ask(event) {
    event.preventDefault();
    const question = $("q").value.trim();
    if (question.length < 3) { render({ error: "empty" }); return; }
    const payload = { q: question };
    const contact = $("wants-reply").checked ? $("contact").value.trim() : "";
    if (contact) payload.contact = contact;
    $("send").disabled = true;
    $("answer").innerHTML = `<p class="notice">Looking for an answer… this can take a few seconds.</p>`;
    render(await send(payload));
    $("send").disabled = false;
    $("answer").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function check(event) {
    event.preventDefault();
    const ref = $("ref").value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const out = $("check-result");
    if (ref.length !== 6) { out.innerHTML = `<p class="notice">Please enter the 6-character reference number.</p>`; return; }
    $("check-send").disabled = true;
    out.innerHTML = `<p class="notice">Checking…</p>`;
    const data = await send({ ref });
    $("check-send").disabled = false;
    if (data.error) out.innerHTML = notice(data.error);
    else if (data.ready) { out.innerHTML = answerHtml(data, "Your answer"); $("gospel").hidden = false; }
    else out.innerHTML = `<p class="notice">Your answer is not ready yet, or the number was not recognized. Answers usually take a few days. Please check the number and try again later.</p>`;
  }

  // Quick exit: wipes the page and replaces it in the browser history.
  function quickExit() {
    for (const id of ["q", "contact", "ref"]) if ($(id)) $(id).value = "";
    $("answer").innerHTML = "";
    $("check-result").innerHTML = "";
    location.replace("https://en.wikipedia.org/wiki/Main_Page");
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!SERVICE_PUBLIC_KEY || !window.crypto?.subtle) {
      $("answer").innerHTML = `<p class="notice">Ask the Vault is not available in this browser yet.</p>`;
      $("send").disabled = true;
      $("check-send").disabled = true;
    }
    $("ask-form").addEventListener("submit", ask);
    $("check-form").addEventListener("submit", check);
    $("clear").addEventListener("click", () => {
      $("q").value = ""; $("contact").value = ""; $("wants-reply").checked = false; $("reply-row").hidden = true;
      $("answer").innerHTML = ""; $("gospel").hidden = true; $("q").focus();
    });
    $("wants-reply").addEventListener("change", () => {
      $("reply-row").hidden = !$("wants-reply").checked;
      if (!$("wants-reply").checked) $("contact").value = "";
    });
    $("exit").addEventListener("click", quickExit);
    $("q").addEventListener("input", () => { $("count").textContent = `${$("q").value.length} / 500`; });
    let lastEsc = 0;
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const now = Date.now();
      if (now - lastEsc < 800) quickExit();
      lastEsc = now;
    });
  });
})();
