/* Chico PD - home page: typing headline, dispatch ticker, chat preview and pop quiz. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* Typing headline */
  var typeEl = $(".xhero-type-text");
  if (typeEl && !reduce) {
    var words = typeEl.dataset.words.split("|"), w = 0, n = words[0].length, deleting = true;
    setTimeout(function tick() {
      var word = words[w];
      if (deleting) {
        n--;
        if (n <= 0) { deleting = false; w = (w + 1) % words.length; }
      } else {
        n++;
        if (n >= words[w].length) { deleting = true; typeEl.textContent = words[w]; return setTimeout(tick, 2200); }
      }
      typeEl.textContent = words[w].slice(0, Math.max(n, 0)) || "​";
      setTimeout(tick, deleting ? 35 : 70);
    }, 2600);
  }

  if (!window.CHICO) return;

  /* Dispatch ticker: radio codes scrolling past */
  var run = $("#ticker-run");
  if (run) {
    var items = CHICO.radio.map(function (r) {
      var m = /\(([^)]+)\)\s*(.*)$/.exec(r[0]) || /(CODE-\d+)\s*(.*)$/.exec(r[0]);
      return m ? '<span class="tk"><b>' + esc(m[1]) + "</b>" + esc(m[2].replace(/\.$/, "")) + "</span>" : "";
    }).join("");
    run.innerHTML = '<div class="ticker-set">' + items + '</div><div class="ticker-set" aria-hidden="true">' + items + "</div>";
    /* Move the ticker with a script so it starts on the first frame on every device. */
    var set = run.firstChild, x = 0, last = 0, paused = false, speed = 60; /* pixels per second */
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) {
      run.parentNode.addEventListener("mouseenter", function () { paused = true; });
      run.parentNode.addEventListener("mouseleave", function () { paused = false; });
    }
    var step = function (now) {
      var dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      var w = set.getBoundingClientRect().width;
      if (!paused && w) {
        x -= speed * dt;
        if (-x >= w) x += w;
        run.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Chat preview: macros "typed" into a game chat box */
  var chat = $("#chat-lines");
  if (chat) {
    var lines = [
      ["me", CHICO.roleplay[0]],
      ["do", CHICO.roleplay[3]],
      ["flobby", "/flobby (10-11) TRAFFIC STOP"],
      ["me", CHICO.roleplay[4]],
      ["do", CHICO.roleplay[6]],
      ["flobby", "/flobby CODE-4 SCENE CLEARED"]
    ];
    var li = 0;
    function addLine() {
      var l = lines[li % lines.length];
      li++;
      var row = document.createElement("p");
      row.className = "chat-line chat-" + l[0];
      row.textContent = l[1];
      chat.appendChild(row);
      while (chat.children.length > 4) chat.removeChild(chat.firstChild);
      if (!reduce) setTimeout(addLine, 2400);
    }
    if (reduce) { for (var k = 0; k < 4; k++) addLine(); } else { addLine(); addLine(); setTimeout(addLine, 1200); }
  }

  /* Pop quiz: one quick question, right on the home page */
  var qEl = $("#pop-q"), opts = $("#pop-options"), res = $("#pop-result");
  if (qEl && opts) {
    var radio = [], viol = [], seen = {};
    CHICO.radio.forEach(function (r) {
      var m = /\((10-\d+)\)\s*(.*)$/.exec(r[0]) || /(CODE-\d+)\s*(.*)$/.exec(r[0]);
      if (!m || seen[m[1]] || m[1] === "10-63") return;
      seen[m[1]] = 1;
      radio.push({ a: m[1].replace("CODE-", "Code "), b: m[2].replace(/\.$/, "").toLowerCase() });
    });
    CHICO.violations.forEach(function (g) { g.items.forEach(function (it) { viol.push({ a: it[0], b: it[1].toLowerCase() }); }); });

    function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
    function ask() {
      var pool = Math.random() < .5 ? radio : viol, isRadio = pool === radio;
      var picks = shuffle(pool).slice(0, 4), right = picks[0];
      var flip = Math.random() < .5;
      qEl.innerHTML = flip
        ? "What is <b>" + esc(right.a) + "</b>?"
        : "Which " + (isRadio ? "code is" : "violation is") + " <b>" + esc(cap(right.b)) + "</b>?";
      opts.innerHTML = shuffle(picks).map(function (p) {
        var label = flip ? cap(p.b) : p.a;
        return '<button type="button" data-ok="' + (p === right ? 1 : 0) + '">' + esc(label) + "</button>";
      }).join("");
      res.textContent = "";
      res.className = "pop-result";
      opts.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          if (opts.classList.contains("is-done")) return;
          opts.classList.add("is-done");
          var ok = b.dataset.ok === "1";
          opts.querySelectorAll("button").forEach(function (x) { x.disabled = true; if (x.dataset.ok === "1") x.classList.add("is-right"); });
          if (!ok) b.classList.add("is-wrong");
          res.className = "pop-result " + (ok ? "is-right" : "is-wrong");
          res.textContent = ok ? "Correct! Nice work, officer." : "Not quite. It's " + (flip ? cap(right.b) : right.a) + ".";
        });
      });
      opts.classList.remove("is-done");
    }
    ask();
    $("#pop-new").addEventListener("click", ask);
  }
})();
