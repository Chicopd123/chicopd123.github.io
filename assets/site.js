/* Chico PD - shared behaviour: copy buttons, officer details, search, guides, poster viewer,
   navigation and animations. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  var ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  /* ---------- Colour the parts of a macro so it is easier to read.
     Only the display changes: copying still uses the plain text. ---------- */
  function highlight(text) {
    var html = esc(text);
    html = html.replace(/^\/(me|do|flobby|m)\b/i, function (m, c) {
      var k = c.toLowerCase();
      return '<span class="cmd cmd-' + (k === "m" ? "me" : k) + '">' + m + "</span>";
    });
    html = html.replace(/\((10-\d+)\)|\b(CODE-\d)\b/g, function (m) { return '<span class="code-tag">' + m + "</span>"; });
    html = html.replace(/\[\+\d+MIN\]/g, function (m) { return '<span class="mins">' + m + "</span>"; });
    return html;
  }

  /* ---------- Officer details: fills name + badge into the intro macro ---------- */
  var store = {
    get: function (k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  function personalise(text) {
    var name = store.get("chico-name").trim().toUpperCase();
    var badge = store.get("chico-badge").trim().toUpperCase();
    if (name) text = text.replace("(YOUR NAME HERE)", name);
    if (badge) text = text.replace("####", badge);
    return text;
  }

  function refreshMacros() {
    $$("[data-macro] code").forEach(function (code) {
      if (!code.dataset.template) code.dataset.template = code.textContent;
      code.innerHTML = highlight(personalise(code.dataset.template));
      var cmd = (code.dataset.template.match(/^\/(me|do|flobby|m)\b/i) || [, ""])[1].toLowerCase();
      code.className = cmd ? "chat-" + (cmd === "m" ? "me" : cmd) : "";
      var body = code.closest(".macro-body");
      if (body) body.dataset.chat = cmd === "m" ? "me" : cmd;
    });
  }

  function initDetails() {
    var name = $("#officer-name"), badge = $("#officer-badge");
    if (!name || !badge) return;
    var box = $("#details-box"), sum = $("#details-sum");
    function summary() {
      if (!sum) return;
      var n = name.value.trim(), b = badge.value.trim();
      sum.textContent = n || b ? "Saved: " + [n, b && "#" + b].filter(Boolean).join(" \u00b7 ") : "Optional: add your name and badge number";
      sum.classList.toggle("is-set", !!(n || b));
    }
    name.value = store.get("chico-name");
    badge.value = store.get("chico-badge");
    summary();
    /* Open on tablets and computers; folded away on phones to save space. */
    if (box && window.matchMedia("(min-width: 48em)").matches) box.open = true;
    name.addEventListener("input", function () { store.set("chico-name", name.value); refreshMacros(); summary(); });
    badge.addEventListener("input", function () { store.set("chico-badge", badge.value); refreshMacros(); summary(); });
  }

  /* ---------- Copy ---------- */
  var hidden = document.createElement("textarea");
  hidden.setAttribute("aria-hidden", "true");
  hidden.tabIndex = -1;
  hidden.className = "copy-buffer";
  document.body.appendChild(hidden);

  /* The synchronous copy has to run first, inside the click, or Safari refuses it. */
  function legacyCopy(text) {
    hidden.value = text;
    hidden.focus({ preventScroll: true });
    hidden.select();
    try { hidden.setSelectionRange(0, 999999); } catch (e) {}
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    hidden.blur();
    hidden.value = "";
    return ok;
  }

  var status = $("#copy-status");
  var timers = new WeakMap();
  var toast = null, toastTimer = null;

  function showToast(text) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("aria-hidden", "true");
      toast.innerHTML = '<span class="toast-dot">&#10003;</span><span>Copied</span><code></code>';
      document.body.appendChild(toast);
    }
    $("code", toast).textContent = text;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 1800);
  }

  function setButton(button, ok) {
    button.classList.toggle("is-ok", ok);
    button.innerHTML = ok ? ICON_OK + "<span>Copied</span>" : ICON_COPY + "<span>Copy</span>";
  }

  function finish(button, ok, text) {
    clearTimeout(timers.get(button));
    if (ok) {
      setButton(button, true);
      if (status) status.textContent = "Copied: " + text;
      showToast(text);
      timers.set(button, setTimeout(function () { setButton(button, false); }, 1600));
    } else {
      setButton(button, false);
      showManual(text);
    }
  }

  function showManual(text) {
    var dialog = $("#manual-copy");
    var box = $("#manual-text");
    if (!dialog) return;
    box.value = text;
    dialog.showModal();
    box.focus();
    box.select();
  }

  function ripple(button, e) {
    if (reduceMotion) return;
    var r = button.getBoundingClientRect();
    var dot = document.createElement("span");
    dot.className = "ripple";
    dot.style.left = ((e.clientX || r.left + r.width / 2) - r.left) + "px";
    dot.style.top = ((e.clientY || r.top + r.height / 2) - r.top) + "px";
    button.appendChild(dot);
    setTimeout(function () { dot.remove(); }, 650);
  }

  function copy(button) {
    var row = button.closest("[data-macro]");
    var text = $("code", row).textContent;
    if (legacyCopy(text)) return finish(button, true, text);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { finish(button, true, text); },
        function () { finish(button, false, text); }
      );
      return;
    }
    finish(button, false, text);
  }

  document.addEventListener("click", function (e) {
    var button = e.target.closest(".copy");
    if (!button) return;
    e.preventDefault();
    copy(button);
    ripple(button, e);
  });

  /* ---------- Rendering from data.js ---------- */
  function macroRow(text, note) {
    return '<div class="macro" data-macro>' +
      '<div class="macro-body"><code>' + esc(text) + "</code>" +
      (note ? '<p class="macro-note">' + esc(note) + "</p>" : "") + "</div>" +
      '<button class="copy" type="button" aria-label="Copy: ' + esc(text) + '">' + ICON_COPY + "<span>Copy</span></button></div>";
  }

  function macroGroup(id, tone, title, blurb, rows) {
    return '<section class="macro-group tone-' + tone + '" id="' + id + '" data-group>' +
      '<div class="group-head"><h2>' + esc(title) + "</h2>" +
      '<span class="group-count">' + rows.length + "</span></div>" +
      (blurb ? '<p class="group-blurb">' + esc(blurb) + "</p>" : "") +
      rows.join("") + "</section>";
  }

  function renderMacros() {
    var root = $("#macro-list");
    if (!root || !window.CHICO) return;
    var html = macroGroup("roleplay", "gold", "Roleplay Actions", "",
      CHICO.roleplay.map(function (t) { return macroRow(t); }));
    html += macroGroup("radio", "cyan", "Radio Codes", "Sent on /flobby. The line under each one says when to use it.",
      CHICO.radio.map(function (r) { return macroRow(r[0], r[1]); }));
    CHICO.violations.forEach(function (g) {
      html += macroGroup(g.id, g.tone, g.title + " — " + g.minutes + " min", g.blurb,
        g.items.map(function (i) {
          return macroRow(CHICO.violationMacro(g, i), (i[4] ? i[4].toUpperCase() + ". " : "") + i[2]);
        }));
    });
    root.innerHTML = html;
  }

  /* ---------- Search: "104", "10 4", "felony" and "miranda" all find their macro ---------- */
  function normalise(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function stem(w) {
    if (w.length < 4) return w;
    if (/ies$/.test(w)) return w.slice(0, -3) + "y";
    if (/(sses|shes|ches)$/.test(w)) return w.slice(0, -2);
    if (/[^s]s$/.test(w)) return w.slice(0, -1);
    return w;
  }
  var ALIASES = { miranda: "rights", mirandize: "rights", mirandise: "rights" };

  function initSearch() {
    var input = $("#search");
    if (!input) return;
    var rows = $$("[data-macro]").map(function (row) {
      var group = row.closest("[data-group]");
      var head = group ? $("h2", group).textContent : "";
      var text = (row.dataset.search || "") + " " + $("code", row).textContent + " " + ($(".macro-note", row) || { textContent: "" }).textContent;
      var raw = normalise(text + " " + head);
      var expanded = raw.split(" ").map(function (w) { var s = stem(w); return s === w ? w : w + " " + s; }).join(" ");
      return { row: row, text: text, hay: expanded + " " + raw.replace(/ /g, "") };
    });
    var empty = $("#no-results"), count = $("#result-count");

    function run() {
      var terms = normalise(input.value).split(" ").filter(Boolean).map(function (t) { return ALIASES[t] || t; });
      var visible = 0;
      /* A violation code like 1.7 must find exactly that code, not 1.70 or 10-7. */
      var code = /^\s*\d+\.\d+\s*$/.test(input.value)
        ? new RegExp("(^|[^\\d.])" + input.value.trim().replace(".", "\\.") + "(?![\\d])") : null;
      /* Same for radio codes: 10-7 or 10 7 means 10-7, not 10-71 or 10-97. */
      var radio = input.value.match(/^\s*10[\s-]+(\d{1,3})\s*$/);
      if (radio) code = new RegExp("(^|[^\\d-])10-" + radio[1] + "(?!\\d)");
      var plain = input.value.match(/^\s*code[\s-]*(\d)\s*$/i);
      if (plain) code = new RegExp("CODE-" + plain[1] + "(?!\\d)");
      rows.forEach(function (item) {
        var match = code ? code.test(item.text) : terms.every(function (t) {
          return item.hay.indexOf(t) !== -1 || item.hay.indexOf(stem(t)) !== -1;
        });
        item.row.hidden = !match;
        if (match) visible++;
      });
      $$("[data-group]").forEach(function (g) { g.hidden = !$("[data-macro]:not([hidden])", g); });
      if (empty) empty.hidden = visible !== 0;
      if (count) count.textContent = terms.length ? visible + (visible === 1 ? " match" : " matches") : rows.length + " macros";
    }

    ["input", "search"].forEach(function (evt) { input.addEventListener(evt, run); });
    var q = new URLSearchParams(location.search).get("q");
    if (q) input.value = q;
    run();

    /* Press "/" anywhere to jump to search. */
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        input.focus();
      }
    });
  }

  /* ---------- Category chips light up for the section you're reading ---------- */
  function initScrollSpy() {
    var chips = $$(".chips .chip");
    if (!chips.length || !("IntersectionObserver" in window)) return;
    var byId = {};
    chips.forEach(function (c) { byId[c.getAttribute("href").slice(1)] = c; });
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting; });
      var active = Object.keys(byId).filter(function (id) { return seen[id]; })[0];
      chips.forEach(function (c) { c.classList.toggle("is-active", c === byId[active]); });
      if (byId[active] && byId[active].scrollIntoView && !reduceMotion) {
        var bar = byId[active].parentNode;
        bar.scrollTo({ left: byId[active].offsetLeft - 16, behavior: "smooth" });
      }
    }, { rootMargin: "-35% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- Guide tabs with a sliding highlight ---------- */
  function initGuides() {
    var bar = $(".guide-tabs");
    var tabs = $$(".guide-tab");
    if (!tabs.length) return;
    var indicator = document.createElement("span");
    indicator.className = "tab-indicator";
    indicator.setAttribute("aria-hidden", "true");
    bar.insertBefore(indicator, bar.firstChild);

    function place(tab) {
      indicator.style.width = tab.offsetWidth + "px";
      indicator.style.transform = "translateX(" + tab.offsetLeft + "px)";
    }
    function show(id) {
      if (!document.getElementById("guide-" + id)) id = tabs[0].getAttribute("href").slice(1);
      $$(".guide").forEach(function (g) { g.hidden = g.id !== "guide-" + id; });
      tabs.forEach(function (t) {
        var on = t.getAttribute("href") === "#" + id;
        t.classList.toggle("is-active", on);
        if (on) { t.setAttribute("aria-current", "true"); place(t); } else t.removeAttribute("aria-current");
      });
      observeReveals();
    }
    window.addEventListener("hashchange", function () { show(location.hash.slice(1)); window.scrollTo(0, 0); });
    window.addEventListener("resize", function () { var a = $(".guide-tab.is-active"); if (a) place(a); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { var a = $(".guide-tab.is-active"); if (a) place(a); });
    show(location.hash.slice(1));
  }

  /* ---------- Poster viewer ---------- */
  function initViewer() {
    var dialog = $("#viewer");
    if (!dialog) return;
    var links = [];
    var index = 0;
    var img = $("#viewer-img"), title = $("#viewer-title"), save = $("#viewer-save");
    var pos = $("#viewer-pos"), prev = $("#viewer-prev"), next = $("#viewer-next");

    function load(i) {
      index = (i + links.length) % links.length;
      var a = links[index];
      img.src = a.getAttribute("href");
      img.alt = a.dataset.alt || a.dataset.title;
      title.textContent = a.dataset.title;
      save.href = a.getAttribute("href");
      pos.textContent = links.length > 1 ? (index + 1) + " / " + links.length : "";
      prev.hidden = next.hidden = links.length < 2;
      $(".viewer-scroll", dialog).scrollTop = 0;
      img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    }

    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-poster]");
      if (!a || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      links = $$('a[data-poster="' + a.dataset.poster + '"]');
      load(links.indexOf(a));
      dialog.showModal();
    });
    prev.addEventListener("click", function () { load(index - 1); });
    next.addEventListener("click", function () { load(index + 1); });
    $("#viewer-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", function (e) {
      if (links.length < 2) return;
      if (e.key === "ArrowLeft") load(index - 1);
      if (e.key === "ArrowRight") load(index + 1);
    });
  }

  /* ---------- Header, mobile nav and back-to-top ---------- */
  function initChrome() {
    var header = $(".site-header");
    var toggle = $("#nav-toggle"), nav = $("#site-nav");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    var top = document.createElement("button");
    top.className = "to-top";
    top.type = "button";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
    document.body.appendChild(top);

    var ticking = false;
    function onScroll() {
      ticking = false;
      var y = window.scrollY;
      if (header) header.classList.toggle("is-scrolled", y > 8);
      top.classList.toggle("is-on", y > 900);
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal + count-up.
     Uses plain scroll position checks so it works in every browser. Anything already
     on screen shows straight away, and nothing can get stuck hidden. ---------- */
  var REVEAL = ".card, .tile, .stat, .journey-step, .notice, .info-block, .rp-card, .rp-locked, .shot, .macro-group, .section-head, .footer-grid > *";
  var pending = [];
  var counters = [];
  var watching = false;

  function inView(el, ratio) {
    var r = el.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < h * (ratio || 0.92) && (r.width || r.height);
  }

  function countUp(el) {
    var end = +el.dataset.count, start = null, dur = 1400;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step); else el.textContent = end;
    }
    el.textContent = "0";
    requestAnimationFrame(step);
  }

  function check() {
    pending = pending.filter(function (el) {
      if (el.closest("[hidden]")) return true;
      if (inView(el)) { el.classList.add("is-in"); return false; }
      return true;
    });
    counters = counters.filter(function (el) {
      if (inView(el, 0.85)) { countUp(el); return false; }
      return true;
    });
  }

  var queued = false;
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; check(); });
  }

  function observeReveals() {
    if (reduceMotion) return;
    $$(REVEAL).forEach(function (el) {
      if (el.classList.contains("reveal")) return;
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(REVEAL); });
      el.style.setProperty("--i", Math.min(siblings.indexOf(el), 6));
      el.classList.add("reveal");
      pending.push(el);
    });
    var journey = $(".journey");
    if (journey && !journey.classList.contains("reveal-line")) {
      journey.classList.add("reveal-line");
      pending.push(journey);
    }
    if (!watching) {
      watching = true;
      window.addEventListener("scroll", queue, { passive: true });
      window.addEventListener("resize", queue);
      /* Safety net: after 4 seconds, show anything still waiting that is on screen. */
      setTimeout(check, 4000);
    }
    check();
  }

  function initCounters() {
    if (reduceMotion) return;
    counters = $$("[data-count]");
    check();
  }

  renderMacros();
  refreshMacros();
  initDetails();
  initSearch();
  initScrollSpy();
  initChrome();
  initGuides();
  initViewer();
  observeReveals();
  initCounters();

  /* RP videos: show "coming soon" if a video file is missing. */
  $$(".rp-frame video").forEach(function (v) {
    var src = $("source", v);
    function missing() { v.hidden = true; $(".rp-missing", v.parentNode).hidden = false; }
    if (src) src.addEventListener("error", missing);
    v.addEventListener("error", missing);
    if (v.networkState === 3) missing();
  });

  var close = $("#manual-close");
  if (close) close.addEventListener("click", function () { $("#manual-copy").close(); });

  /* Rendering happens after load, so re-apply a #section link once the content exists. */
  if (location.hash && $("#macro-list")) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();
