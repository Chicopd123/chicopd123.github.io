/* Chico PD - officer quizzes.
   Questions are built at random from the violations and radio codes in data.js,
   plus the hand-written scenes and questions below. To add a scene, copy one of
   the SCENES lines and change the text, the codes and the explanation. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var app = $("#quiz-app");
  if (!app || !window.CHICO) return;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scenes: pick every violation that applies ---------- */
  var SCENES = [
    { text: "A person starts shooting at officers in the street.", codes: ["1.2", "1.9", "2.4", "2.5"],
      why: "Shooting at officers is using force against the state government (1.2). It is shooting in public (1.9), causes a serious public disturbance (2.4) and threatens officers' lives (2.5)." },
    { text: "A person starts shooting at officers in the street and insults them while doing it.", codes: ["1.2", "1.9", "2.4", "2.5", "2.6"],
      why: "Same as shooting at officers (1.2, 1.9, 2.4, 2.5), and insulting on-duty officers adds 2.6." },
    { text: "You pull a driver over for running a red light. They refuse to show you their licence.", codes: ["3.4", "3.6"],
      why: "Running a red light breaks traffic laws (3.4). Refusing to show a licence when asked is 3.6." },
    { text: "A driver knocks down a pedestrian, who survives. When you stop the driver, they offer you money to forget about it.", codes: ["1.8", "1.10"],
      why: "Hitting a pedestrian who survives is 1.8. Offering money to an on-duty officer is attempted bribery (1.10)." },
    { text: "A driver hits a pedestrian and the pedestrian dies.", codes: ["1.4"],
      why: "A collision that kills a pedestrian is 1.4. If they survive, it would be 1.8." },
    { text: "While you are cuffing a suspect, they pull away and try to run.", codes: ["3.1"],
      why: "Pulling away or escaping during an arrest is resisting arrest (3.1)." },
    { text: "You are arresting a suspect when their friend steps in, blocks you and pulls the suspect away. What does the friend get?", codes: ["3.3"],
      why: "Helping someone resist or escape an arrest is 3.3, aiding in resisting arrest." },
    { text: "A man punches another civilian in the street and starts a big fight that blocks the road.", codes: ["3.5", "2.4"],
      why: "Attacking a civilian is 3.5. Fighting and blocking roads is disorderly conduct (2.4)." },
    { text: "Someone calls dispatch about a shootout. You arrive and nothing is happening. They admit it was a joke.", codes: ["2.3"],
      why: "Knowingly reporting a fake emergency is 2.3, making a false emergency call." },
    { text: "A driver rams a parked police car on purpose.", codes: ["2.1"],
      why: "Police vehicles are government property, so damaging one on purpose is 2.1." },
    { text: "A player smashes up another civilian's car on purpose, then tells them they're going to kill them.", codes: ["2.2", "2.5"],
      why: "Damaging a civilian's car is 2.2. A serious threat to kill someone is 2.5." },
    { text: "On Floor 1, you tell a person not to go past the metal detector. They walk past it anyway.", codes: ["3.2", "1.7"],
      why: "Ignoring your order is disobeying a lawful order (3.2), and going past the metal detector into a restricted area is trespassing (1.7)." },
    { text: "A player is blocking the entrance to the PD garage.", codes: ["1.1"],
      why: "Blocking the PD garage entrance is taking control of a state facility, so it's 1.1." },
    { text: "A player steals a civilian's car.", codes: ["1.5"],
      why: "Taking someone's private property without permission is 1.5." },
    { text: "A suspect points a gun at an on-duty medic and takes their items.", codes: ["1.6"],
      why: "Using or threatening force to rob an on-duty public servant is 1.6." },
    { text: "A player grabs a civilian, drives them away and holds them against their will.", codes: ["1.3"],
      why: "Abducting and holding someone against their will is kidnapping (1.3)." },
    { text: "During a traffic stop, the driver keeps calling you names and abusing you.", codes: ["2.6"],
      why: "Insulting or abusing an on-duty officer is 2.6." },
    { text: "You order a speeding driver to stop. They ignore you and keep driving.", codes: ["3.4", "3.2"],
      why: "Speeding breaks traffic laws (3.4), and ignoring your order to stop is 3.2." },
    { text: "A player tells a civilian to pay them, or they'll wreck the civilian's car.", codes: ["2.7"],
      why: "Using threats to force someone to hand over money is extortion (2.7)." },
    { text: "A player tells a civilian to pay up or they'll wreck their car. When the civilian refuses, they smash the car up.", codes: ["2.7", "2.2"],
      why: "The threat to get money is extortion (2.7), and smashing the civilian's car is damage to private property (2.2)." },
    { text: "A player is blocking the entrance to the PD garage. You order them to move and they refuse.", codes: ["1.1", "3.2"],
      why: "Blocking the PD garage is 1.1, and refusing your order to move is disobeying a lawful order (3.2)." },
    { text: "On Floor 1, a person walks past the metal detector after you told them not to, then insults you.", codes: ["3.2", "1.7", "2.6"],
      why: "Ignoring your order is 3.2, going past the metal detector is 1.7, and insulting an on-duty officer is 2.6." },
    { text: "On a traffic stop, the driver refuses to show their licence and keeps calling you names.", codes: ["3.6", "2.6"],
      why: "Refusing to show a licence is 3.6, and insulting an on-duty officer is 2.6." },
    { text: "A driver runs a red light and hits a pedestrian, who survives.", codes: ["3.4", "1.8"],
      why: "Running a red light breaks traffic laws (3.4), and hitting a pedestrian who survives is 1.8." },
    { text: "A player steals a civilian's car and speeds off through a red light.", codes: ["1.5", "3.4"],
      why: "Stealing the car is 1.5, and running the red light breaks traffic laws (3.4)." },
    { text: "While you're cuffing a suspect, they offer you money to let them go, then try to pull away.", codes: ["1.10", "3.1"],
      why: "Offering money to an on-duty officer is attempted bribery (1.10), and pulling away is resisting arrest (3.1)." },
    { text: "A player rams a parked police car on purpose, then refuses your order to get out of the vehicle.", codes: ["2.1", "3.2"],
      why: "Damaging a police car is 2.1, and refusing your order is 3.2." },
    { text: "Someone calls in a fake shootout. When you arrive, they laugh and insult you.", codes: ["2.3", "2.6"],
      why: "The fake call is 2.3, and insulting an on-duty officer is 2.6." },
    { text: "A player threatens to kill an officer, then punches a civilian who tries to calm them down.", codes: ["2.5", "3.5"],
      why: "A serious threat to kill is 2.5, and punching a civilian is assault on a civilian (3.5)." },
    { text: "In the Redzone, a player deliberately kills another player.", codes: ["1.11"],
      why: "Murder (1.11) can only be issued in the Redzone, and needs a description of the situation." }
  ];

  /* ---------- Hand-written questions. The first option is the right one. ---------- */
  var KNOW = [
    { cat: "Procedure", q: "On a traffic stop the driver comes back clear. What do you do before calling Code 4?", o: ["Return the licence, get back in your car and beep 3 times", "Cuff and search them", "Call 10-80", "Ask for a supervisor with 10-37"], why: "If clear: return the licence, get back in your car, beep 3 times so they can go, then call Code 4." },
    { cat: "Procedure", q: "After taking the driver's licence on a traffic stop, which check do you run?", o: ["10-27 / 10-29 (ID and warrant check)", "10-13", "10-57", "Code 0"], why: "Return to your car and run a 10-27/29 check, then wait for dispatch." },
    { cat: "Procedure", q: "A pursuit starts with a hit and run. Which code does it start as?", o: ["10-57", "10-80", "10-11", "10-47"], why: "A pursuit starts as a 10-57 (hit and run) and becomes a 10-80 when the vehicle flees." },
    { cat: "Procedure", q: "When can you use a PIT manoeuvre?", o: ["Only when it is safe and authorised", "Whenever the suspect speeds", "At the start of every pursuit", "Never"], why: "Only PIT when it is safe and authorised." },
    { cat: "Procedure", q: "A suspect of the opposite gender needs a pat-down. Which code do you use?", o: ["10-63", "10-32", "10-26", "10-41"], why: "For the opposite gender, request an officer with a 10-63." },
    { cat: "Procedure", q: "How many steps are there in an official arrest?", o: ["14", "8", "10", "16"], why: "There are 14 steps from meeting the person to putting them in jail." },
    { cat: "Procedure", q: "What are the first 3 steps of an official arrest?", o: ["Introduce yourself, explain the arrest and read their rights", "Booking, fingerprints and mug shot", "Pat down, State ID and violations", "Cuff, search and call Code 4"], why: "Steps 1-3: introduce yourself, explain the arrest by voice and read their rights." },
    { cat: "Procedure", q: "You have a wanted suspect cuffed and searched. Which two codes come next?", o: ["10-26 then 10-15", "10-80 then 10-57", "Code 3 then Code 2", "10-8 then 10-7"], why: "Call 10-26 (suspect detained) and 10-15 (in custody, en route to PD), take them to the station, then Code 4." },
    { cat: "Procedure", q: "You are not vested and someone needs a 1.x violation. What do you do?", o: ["Request a supervisor with 10-37", "Issue it yourself", "Give them a 2.x instead", "Let them go"], why: "Only vested or higher can give 1.x. Request a supervisor with a 10-37." },
    { cat: "Procedure", q: "How do you properly record a violation?", o: ["Put the macro, click the 3 dots, record it and type the code", "Just say it in voice chat", "Only put the macro", "Post it in Discord"], why: "Macro + recorded violation = complete." },
    { cat: "Procedure", q: "Which two violations can only be issued in the Redzone?", o: ["1.11 Murder and 1.12 Assault on a public servant", "1.9 and 1.7", "2.5 and 2.6", "1.1 and 1.2"], why: "1.11 and 1.12 are Redzone only, and need a description of the situation." },
    { cat: "Procedure", q: "Which chat do all radio codes go through?", o: ["/flobby", "/me", "/do", "/ooc"], why: "All department radio goes through /flobby." },
    { cat: "Rules", q: "Under the PD rules, what do 2 warnings add up to?", o: ["1 reprimand", "Dismissal", "Nothing", "3 reprimands"], why: "Rule 16: 2 warnings make 1 reprimand." },
    { cat: "Rules", q: "How many reprimands lead to removal from the police?", o: ["3", "2", "5", "1"], why: "3 reprimands mean removal from the position of police officer." },
    { cat: "Rules", q: "Breaking rules 1-3 (false allegations, detaining without cause, attacking civilians without RP) means...", o: ["Dismissal", "1 warning", "1 reprimand", "A 10-minute timeout"], why: "Rules 1-3 lead to dismissal." },
    { cat: "Rules", q: "Breaking rules 11-15 (like arresting without a screenshot or poor roleplay) gets you...", o: ["1 warning", "Dismissal", "1 reprimand", "Nothing"], why: "Rules 11-15 give 1 warning." },
    { cat: "Rules", q: "How many days inactive before you are removed from the PD automatically?", o: ["7 days", "3 days", "14 days", "30 days"], why: "Inactive for 7 days means automatic removal." },
    { cat: "Badge", q: "How much XP do you need before RP1 and RP2?", o: ["50,000 XP", "10,000 XP", "25,000 XP", "100,000 XP"], why: "You need 50,000 XP and passed macros before doing RP1 and RP2." },
    { cat: "Badge", q: "Which of these can't you do while unbadged?", o: ["Make arrests", "Copy your macros", "Watch the RP videos", "Read the guides"], why: "Unbadged officers can't make arrests, go out alone, take a PD car or be on Floor 1." },
    { cat: "Badge", q: "After passing your training, how soon do you get your badge?", o: ["In less than 24 hours", "After a week", "Straight away", "After 30 days"], why: "Pass your training and you'll get your badge in less than 24 hours." },
    { cat: "Ranks", q: "What is rank 1 in Chico PD?", o: ["Recruit", "Sergeant", "Lieutenant", "Cadet"], why: "Recruit is rank 1, unbadged. Chief Federal General is rank 13." },
    { cat: "Ranks", q: "Where do new Sergeants work after getting their badge?", o: ["Floor 1 at the metal detectors", "On patrol alone", "In the interview room", "At the airport"], why: "New Sergeants work Floor 1 at the metal detectors." },
    { cat: "Ranks", q: "How many bodycams do you send to a PAB member to be cleared from Floor 1?", o: ["5", "3", "10", "1"], why: "First Sergeants send 5 bodycams to a PAB member to be cleared for patrols." },
    { cat: "Ranks", q: "Who can be a tester for the vest test?", o: ["Colonels and above", "Any Sergeant", "Recruits", "Only the Chief"], why: "Colonels can be testers for the vest test." },
    { cat: "Ranks", q: "Who teaches RP1 and RP2?", o: ["Lieutenants and Captains", "Recruits", "First Sergeants", "Nobody, you teach yourself"], why: "Lieutenants teach RP1 and RP2, and Captains can do the same." },
    { cat: "Ranks", q: "Which rank can approve vacations (time off)?", o: ["Deputy Federal General", "Sergeant Major", "Lieutenant", "Major"], why: "The Deputy Federal General can promote, fire and approve vacations." },
    { cat: "Ranks", q: "Which rank is rank 13, the top of the chain?", o: ["Chief Federal General", "Colonel General", "Deputy Federal General", "Major General"], why: "The Chief Federal General is rank 13, above everyone." }
  ];

  /* ---------- Helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var SMALL = { of: 1, a: 1, on: 1, or: 1, and: 1, to: 1, in: 1, the: 1 };
  function title(s) {
    return s.toLowerCase().split(" ").map(function (w, i) { return i && SMALL[w] ? w : w.charAt(0).toUpperCase() + w.slice(1); }).join(" ").replace(/\bI\.d\./, "I.D.");
  }

  /* Violations as a flat list */
  var VIOL = [];
  CHICO.violations.forEach(function (g) {
    g.items.forEach(function (it) { VIOL.push({ code: it[0], name: title(it[1]), def: it[2], minutes: g.minutes, level: g.id, tone: g.tone }); });
  });
  var VBY = {};
  VIOL.forEach(function (v) { VBY[v.code] = v; });

  /* Radio codes: one per code (10-63 is asked in the hand-written questions) */
  var RADIO = [], seen = {};
  CHICO.radio.forEach(function (r) {
    var m = /\((10-\d+)\)\s*(.*)$/.exec(r[0]) || /(CODE-\d+)\s*(.*)$/.exec(r[0]);
    if (!m || seen[m[1]] || m[1] === "10-63") return;
    seen[m[1]] = 1;
    RADIO.push({ code: m[1].replace("CODE-", "Code "), label: title(m[2].replace(/\.$/, "")), meaning: r[1] });
  });

  /* ---------- Question makers ---------- */
  function others(list, not, n, key) {
    var out = [], used = {};
    used[not[key]] = 1;
    shuffle(list).forEach(function (x) { if (out.length < n && !used[x[key]]) { used[x[key]] = 1; out.push(x); } });
    return out;
  }
  function mcq(cat, q, right, wrong, why, id) {
    return { type: "mcq", cat: cat, q: q, options: shuffle([right].concat(wrong)), answer: right, why: why, id: id };
  }
  var MAKERS = {
    violName: function () {
      var v = pick(VIOL), w = others(VIOL, v, 3, "name");
      return mcq("Violations", "What is violation <b>" + v.code + "</b>?", v.name, w.map(function (x) { return x.name; }), v.code + " is " + v.name + ": " + v.def, "vn" + v.code);
    },
    violCode: function () {
      var v = pick(VIOL), w = others(VIOL, v, 3, "code");
      return mcq("Violations", "Which violation is this?<span class=\"q-quote\">" + esc(v.def) + "</span>", v.code, w.map(function (x) { return x.code; }), v.code + " " + v.name + ". " + v.def, "vc" + v.code);
    },
    violMins: function () {
      var v = pick(VIOL);
      return mcq("Violations", "How many minutes does <b>" + v.code + " " + esc(v.name) + "</b> add to a sentence?", v.minutes + " minutes", shuffle(["5 minutes", "10 minutes", "20 minutes", "30 minutes"].filter(function (x) { return x !== v.minutes + " minutes"; })).slice(0, 3),
        "1.x felonies add 20 minutes, 2.x infractions add 10 and 3.x misdemeanors add 5.", "vm" + v.code);
    },
    radioMeaning: function () {
      var r = pick(RADIO), w = others(RADIO, r, 3, "label");
      return mcq("Radio codes", "What does <b>" + r.code + "</b> mean?", r.label, w.map(function (x) { return x.label; }), r.code + " " + r.label + ": " + r.meaning, "rm" + r.code);
    },
    radioCode: function () {
      var r = pick(RADIO), w = others(RADIO, r, 3, "code");
      return mcq("Radio codes", "Which code do you call for <b>" + esc(r.label.toLowerCase()) + "</b>?<span class=\"q-quote\">" + esc(r.meaning) + "</span>", r.code, w.map(function (x) { return x.code; }), r.code + " is " + r.label + ".", "rc" + r.code);
    },
    know: function () {
      var k = pick(KNOW);
      return mcq(k.cat, esc(k.q), k.o[0], k.o.slice(1), k.why, "k" + KNOW.indexOf(k));
    },
    scene: function () {
      var s = pick(SCENES);
      return { type: "scene", cat: "Scene", q: s.text, answer: s.codes.slice(), why: s.why, id: "s" + SCENES.indexOf(s) };
    }
  };

  var MODES = [
    { id: "mix", name: "Random Mix", tone: "gold", icon: "shuffle", count: 10, blurb: "10 random questions from everything: scenes, violations, radio and procedures.",
      makers: ["scene", "scene", "scene", "violName", "violCode", "violMins", "radioMeaning", "radioCode", "know", "know"] },
    { id: "scene", name: "Scene Challenge", tone: "red", icon: "siren", count: 8, blurb: "Read what happened and pick every violation that applies. Like a real call.",
      makers: ["scene"] },
    { id: "viol", name: "Violation Codes", tone: "blue", icon: "book", count: 10, blurb: "Codes, names and minutes for all 25 violations.",
      makers: ["violName", "violCode", "violMins"] },
    { id: "radio", name: "Radio Codes", tone: "cyan", icon: "radio", count: 10, blurb: "10-codes and Code 0-4. Know what to say on /flobby.",
      makers: ["radioMeaning", "radioCode"] },
    { id: "know", name: "Procedures & Ranks", tone: "purple", icon: "badge", count: 10, blurb: "Traffic stops, arrests, PD rules, getting your badge and the chain of command.",
      makers: ["know"] },
    { id: "speed", name: "Speed Round", tone: "green", icon: "timer", count: 0, seconds: 60, blurb: "60 seconds. Answer as many as you can. Wrong answers cost you time.",
      makers: ["violName", "violCode", "radioMeaning", "radioCode", "violMins"] }
  ];

  var ICONS = {
    shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    siren: '<path d="M7 18v-6a5 5 0 0 1 10 0v6"/><path d="M5 21h14M12 3v2M4.2 7.2l1.4 1.4M19.8 7.2l-1.4 1.4"/><rect x="5" y="18" width="14" height="3" rx="1"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    radio: '<rect x="5" y="8" width="14" height="13" rx="2"/><path d="M9 8 15 3M9 13h6M9 17h3"/>',
    badge: '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>'
  };
  function icon(name) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>"; }

  function best(id, val) {
    var k = "chicoQuizBest:" + id;
    try {
      if (val === undefined) return localStorage.getItem(k);
      var had = localStorage.getItem(k);
      if (had === null || val > +had) { localStorage.setItem(k, val); return had !== null && val > 0; }
    } catch (e) {}
    return false;
  }

  /* ---------- Screens ---------- */
  var state = null, timerId = null;

  function showMenu() {
    stopTimer();
    state = null;
    var html = '<div class="quiz-modes">';
    MODES.forEach(function (m) {
      var b = best(m.id);
      var bestText = b ? (m.id === "speed" ? "Best: " + b + " correct" : "Best: " + b + "%") : "Not tried yet";
      html += '<button type="button" class="quiz-mode tone-' + m.tone + '" data-mode="' + m.id + '">' +
        '<span class="quiz-mode-icon">' + icon(m.icon) + "</span>" +
        '<span class="quiz-mode-name">' + m.name + "</span>" +
        '<span class="quiz-mode-blurb">' + m.blurb + "</span>" +
        '<span class="quiz-mode-foot"><span>' + (m.seconds ? m.seconds + " seconds" : m.count + " questions") + "</span><span>" + bestText + "</span></span>" +
        '<span class="quiz-mode-go" aria-hidden="true">Start &rarr;</span></button>';
    });
    html += "</div>";
    app.innerHTML = html;
    app.querySelectorAll(".quiz-mode").forEach(function (b) {
      b.addEventListener("click", function () { start(b.dataset.mode); });
    });
  }

  function makeQuestion(mode, used) {
    for (var tries = 0; tries < 40; tries++) {
      var maker = mode.id === "mix" ? mode.makers[state.list.length % mode.makers.length] : pick(mode.makers);
      var q = MAKERS[maker]();
      if (!used[q.id]) { used[q.id] = 1; return q; }
    }
    return MAKERS[pick(mode.makers)]();
  }

  function start(id) {
    var mode = MODES.filter(function (m) { return m.id === id; })[0];
    state = { mode: mode, list: [], used: {}, i: 0, score: 0, streak: 0, bestStreak: 0, missed: [], answered: false, timeLeft: mode.seconds || 0 };
    if (mode.id === "mix") {
      mode.makers = shuffle(mode.makers);
    }
    var n = mode.seconds ? 1 : mode.count;
    for (var i = 0; i < n; i++) state.list.push(makeQuestion(mode, state.used));
    if (mode.seconds) startTimer();
    render();
    app.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(function () {
      state.timeLeft -= 0.1;
      updateTimer();
      if (state.timeLeft <= 0) { stopTimer(); finish(); }
    }, 100);
  }
  function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }
  function updateTimer() {
    var ring = $(".quiz-timer-ring", app), txt = $(".quiz-timer-num", app);
    if (!ring) return;
    var p = Math.max(0, state.timeLeft / state.mode.seconds);
    ring.style.strokeDashoffset = (1 - p) * 113.1;
    txt.textContent = Math.max(0, Math.ceil(state.timeLeft));
    ring.parentNode.parentNode.classList.toggle("is-low", state.timeLeft < 10);
  }

  function render() {
    var m = state.mode, q = state.list[state.i];
    var total = m.seconds ? null : state.list.length;
    var progress = total ? (state.i / total) * 100 : 0;
    var head = '<div class="quiz-bar tone-' + m.tone + '">' +
      '<button type="button" class="quiz-quit" aria-label="Back to all quizzes">&larr; Quizzes</button>' +
      '<span class="quiz-bar-name">' + m.name + "</span>" +
      '<span class="quiz-stat"><small>' + (total ? "Question" : "Answered") + "</small><b>" + (total ? (state.i + 1) + "/" + total : state.i) + "</b></span>" +
      '<span class="quiz-stat"><small>Score</small><b class="quiz-score">' + state.score + "</b></span>" +
      '<span class="quiz-stat quiz-streak' + (state.streak >= 3 ? " is-hot" : "") + '"><small>Streak</small><b>' + state.streak + "</b></span>" +
      (m.seconds ? '<span class="quiz-timer"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18"/><circle class="quiz-timer-ring" cx="20" cy="20" r="18"/></svg><span class="quiz-timer-num">' + Math.ceil(state.timeLeft) + "</span></span>" : "") +
      '<span class="quiz-progress"><span style="width:' + progress + '%"></span></span></div>';

    var body = '<div class="quiz-card tone-' + m.tone + '" data-type="' + q.type + '"><p class="quiz-cat">' + esc(q.cat) + "</p>";
    if (q.type === "scene") {
      body += '<h2 class="quiz-q quiz-scene-q"><span class="quiz-scene-tag">Scene</span>' + esc(q.q) + "</h2>" +
        '<p class="quiz-hint">Pick <b>every</b> violation that applies, then check your answer.</p>' + codePicker() +
        '<div class="quiz-actions"><span class="quiz-picked">0 picked</span><button type="button" class="btn quiz-check" disabled>Check answer</button></div>';
    } else {
      body += '<h2 class="quiz-q">' + q.q + '</h2><div class="quiz-options">';
      q.options.forEach(function (o, i) {
        body += '<button type="button" class="quiz-opt" data-val="' + esc(o) + '"><span class="quiz-key">' + "ABCD"[i] + "</span><span>" + esc(o) + "</span></button>";
      });
      body += "</div>";
    }
    body += '<div class="quiz-feedback" hidden></div></div>';
    app.innerHTML = head + body;

    $(".quiz-quit", app).addEventListener("click", showMenu);
    if (q.type === "scene") bindScene(q); else bindMcq(q);
  }

  function codePicker() {
    var html = '<div class="quiz-codes">';
    CHICO.violations.forEach(function (g) {
      html += '<div class="quiz-code-group tone-' + g.tone + '"><p>' + esc(g.title.split(" / ")[0]) + " &middot; " + g.minutes + " min</p><div>";
      g.items.forEach(function (it) {
        html += '<button type="button" class="quiz-code" aria-pressed="false" data-code="' + it[0] + '"><b>' + it[0] + "</b><span>" + esc(title(it[1])) + "</span></button>";
      });
      html += "</div></div>";
    });
    return html + "</div>";
  }

  function bindMcq(q) {
    app.querySelectorAll(".quiz-opt").forEach(function (b) {
      b.addEventListener("click", function () { answerMcq(q, b); });
    });
  }

  function answerMcq(q, btn) {
    if (state.answered) return;
    state.answered = true;
    var right = btn.dataset.val === q.answer;
    app.querySelectorAll(".quiz-opt").forEach(function (b) {
      b.disabled = true;
      if (b.dataset.val === q.answer) b.classList.add("is-right");
    });
    if (!right) btn.classList.add("is-wrong");
    result(right, q, right ? "" : "The answer is <b>" + esc(q.answer) + "</b>.", btn);
  }

  function bindScene(q) {
    var check = $(".quiz-check", app), count = $(".quiz-picked", app);
    app.querySelectorAll(".quiz-code").forEach(function (b) {
      b.addEventListener("click", function () {
        if (state.answered) return;
        var on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", on);
        var n = app.querySelectorAll('.quiz-code[aria-pressed="true"]').length;
        count.textContent = n + " picked";
        check.disabled = !n;
      });
    });
    check.addEventListener("click", function () { answerScene(q, check); });
  }

  function answerScene(q, btn) {
    if (state.answered) return;
    state.answered = true;
    var picked = [];
    app.querySelectorAll(".quiz-code").forEach(function (b) {
      b.disabled = true;
      var code = b.dataset.code, on = b.getAttribute("aria-pressed") === "true", need = q.answer.indexOf(code) !== -1;
      if (on) picked.push(code);
      if (on && need) b.classList.add("is-right");
      else if (on && !need) b.classList.add("is-wrong");
      else if (!on && need) b.classList.add("is-missed");
    });
    var missing = q.answer.filter(function (c) { return picked.indexOf(c) === -1; });
    var extra = picked.filter(function (c) { return q.answer.indexOf(c) === -1; });
    var right = !missing.length && !extra.length;
    var note = "";
    if (!right) {
      note = "The answer is <b>" + q.answer.join(", ") + "</b>.";
      if (missing.length) note += " You missed " + missing.join(", ") + ".";
      if (extra.length) note += " " + extra.join(", ") + (extra.length > 1 ? " don't" : " doesn't") + " apply here.";
    }
    btn.parentNode.hidden = true;
    result(right, q, note, $(".quiz-scene-q", app));
  }

  function result(right, q, note, fromEl) {
    if (right) {
      state.score++;
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      burst(fromEl);
    } else {
      state.streak = 0;
      state.missed.push(q);
      if (state.mode.seconds) state.timeLeft = Math.max(0, state.timeLeft - 3);
      var card = $(".quiz-card", app);
      if (!reduceMotion) { card.classList.remove("is-shake"); void card.offsetWidth; card.classList.add("is-shake"); }
    }
    $(".quiz-score", app).textContent = state.score;
    var st = $(".quiz-streak", app);
    $("b", st).textContent = state.streak;
    st.classList.toggle("is-hot", state.streak >= 3);

    if (state.mode.seconds) {
      setTimeout(next, right ? 450 : 1100);
      if (!right) showFeedback(false, q, note, true);
      return;
    }
    showFeedback(right, q, note, false);
  }

  function showFeedback(right, q, note, noButton) {
    var fb = $(".quiz-feedback", app);
    var last = state.i >= state.list.length - 1;
    fb.className = "quiz-feedback " + (right ? "is-right" : "is-wrong");
    fb.innerHTML = '<p class="quiz-verdict">' + (right ? pick(["Correct!", "Spot on!", "Nice work, officer.", "That's right!"]) : "Not quite.") + "</p>" +
      (note ? "<p>" + note + "</p>" : "") + '<p class="quiz-why">' + esc(q.why) + "</p>" +
      (noButton ? "" : '<button type="button" class="btn quiz-next">' + (last ? "See results" : "Next question") + ' <span aria-hidden="true">&rarr;</span></button>');
    fb.hidden = false;
    var nb = $(".quiz-next", fb);
    if (nb) { nb.addEventListener("click", next); nb.focus({ preventScroll: true }); }
    var r = fb.getBoundingClientRect();
    if (r.bottom > window.innerHeight) fb.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "end" });
  }

  function next() {
    if (!state) return;
    state.answered = false;
    if (state.mode.seconds) {
      if (state.timeLeft <= 0) return;
      state.i++;
      state.list.push(makeQuestion(state.mode, state.used));
      render();
      updateTimer();
      return;
    }
    if (state.i >= state.list.length - 1) return finish();
    state.i++;
    render();
    var top = app.getBoundingClientRect().top;
    if (top < 0) app.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function finish() {
    stopTimer();
    var m = state.mode, speed = !!m.seconds;
    var total = speed ? state.i + (state.answered ? 1 : 0) : state.list.length;
    var pct = total ? Math.round((state.score / total) * 100) : 0;
    var isBest = best(m.id, speed ? state.score : pct);
    var grade = pct === 100 ? ["Chief material", "A perfect score. You know your stuff."] :
      pct >= 80 ? ["Vest ready", "Great work. Just a couple to brush up on."] :
      pct >= 60 ? ["Solid officer", "Good knowledge, but keep practising."] :
      pct >= 40 ? ["Keep training", "Have another look at the guides and try again."] :
      ["Back to the guides", "Read the guides and violations, then have another go."];
    if (speed) grade = state.score >= 20 ? ["Lightning fast", "Seriously quick and accurate."] : state.score >= 12 ? ["Quick on the radio", "Fast thinking under pressure."] : grade;

    var review = "";
    if (state.missed.length) {
      review = '<div class="quiz-review"><h3>Ones to learn</h3><ul>' + state.missed.map(function (q) {
        var ans = q.type === "scene" ? q.answer.map(function (c) { return c + " " + VBY[c].name; }).join(", ") : esc(q.answer);
        return '<li><p class="quiz-review-q">' + (q.type === "scene" ? esc(q.q) : q.q) + '</p><p class="quiz-review-a">' + ans + "</p></li>";
      }).join("") + "</ul></div>";
    }
    var circ = 2 * Math.PI * 52;
    app.innerHTML = '<div class="quiz-result tone-' + m.tone + '">' +
      '<div class="quiz-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle class="quiz-ring-fill" cx="60" cy="60" r="52" style="stroke-dasharray:' + circ + ";stroke-dashoffset:" + circ + '"/></svg>' +
      '<span class="quiz-ring-num"><b>' + (speed ? state.score : pct + "%") + "</b><small>" + (speed ? "correct" : state.score + " of " + total) + "</small></span></div>" +
      '<p class="eyebrow">' + m.name + "</p><h2>" + grade[0] + "</h2><p class=\"quiz-result-text\">" + grade[1] + "</p>" +
      '<div class="quiz-result-stats"><span><b>' + state.score + "</b> correct</span><span><b>" + state.missed.length + "</b> wrong</span><span><b>" + state.bestStreak + "</b> best streak</span></div>" +
      (isBest ? '<p class="quiz-newbest">New personal best!</p>' : "") +
      '<div class="quiz-result-actions"><button type="button" class="btn quiz-again">Try again</button><button type="button" class="btn btn-ghost quiz-menu">All quizzes</button></div>' +
      review + "</div>";
    $(".quiz-again", app).addEventListener("click", function () { start(m.id); });
    $(".quiz-menu", app).addEventListener("click", showMenu);
    var fill = $(".quiz-ring-fill", app);
    var target = circ * (1 - (speed ? Math.min(state.score / 25, 1) : pct / 100));
    requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.strokeDashoffset = target; }); });
    if (pct >= 80 || isBest) burst($(".quiz-ring", app), 36);
    app.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    state = null;
  }

  /* Small burst of sparks on a right answer */
  function burst(el, n) {
    if (reduceMotion || !el) return;
    var r = el.getBoundingClientRect(), box = document.createElement("div");
    box.className = "quiz-burst";
    box.style.left = (r.left + r.width / 2) + "px";
    box.style.top = (r.top + r.height / 2) + "px";
    var colours = ["#f0bf4c", "#4fd964", "#4c9dff", "#ff5a52", "#b48cff"];
    for (var i = 0; i < (n || 18); i++) {
      var s = document.createElement("i");
      var a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90;
      s.style.setProperty("--x", Math.cos(a) * d + "px");
      s.style.setProperty("--y", Math.sin(a) * d + "px");
      s.style.background = colours[i % colours.length];
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 900);
  }

  /* Keyboard: 1-4 or A-D to answer, Enter for next */
  document.addEventListener("keydown", function (e) {
    if (!state || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    var opts = app.querySelectorAll(".quiz-opt");
    var k = e.key.toLowerCase(), idx = "1234".indexOf(k) !== -1 ? +k - 1 : "abcd".indexOf(k);
    if (opts.length && idx >= 0 && idx < opts.length && !state.answered) { e.preventDefault(); opts[idx].click(); }
    else if (e.key === "Enter" && state.answered) { var nb = $(".quiz-next", app); if (nb && document.activeElement !== nb) { e.preventDefault(); nb.click(); } }
  });

  showMenu();
})();
