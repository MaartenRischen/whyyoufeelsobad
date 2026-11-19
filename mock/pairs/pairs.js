/* pairs.js - one part, six ways to get from part 1 of a pair to part 2 (Open Brain thought 4915, 19 Nov 2026).

   HARD RULE: at no moment do two loops move. One loop on the whole page is live at a time. Every other
   loop shows a still with one readable line: its first line while it waits, its last line once it has played.

   A pair is <section class="pair" data-mode="a..f"> with two <figure class="loop">: part 1 and part 2.
   Without JavaScript, and with reduced motion, each figure is a still with all of its lines listed.

   data-mode
     a, b  focus   the loop nearest the middle of the screen plays, and repeats. (a has text between the two.)
     c     acts    one frame: part 1, a cut card, part 2, and round again. A marker of two bars; a tap jumps.
     d     turns   both on screen: one plays to its end and freezes, then the other.
     e     steps   both on screen: line 1 of part 1, line 1 of part 2, line 2, line 2, and so on.
     f     button  one frame: part 1 repeats until the reader presses the change line; then part 2 repeats.

   A line stays 0.15 s + 1 s per 28 characters, never under 0.8 s (report 4848), as on /mock/page/.
   The picture is the video file of /mock/page/loops/. If the browser refuses to start a video, the loop
   is drawn live from the film's code instead (one film at a time, so that is fast enough). */
(function () {
  "use strict";
  var LEAD = 0.15, TAIL = 0.4, FRAME = 1000 / 31;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var forceLive = /[?&]live=1/.test(location.search);
  var root = document.documentElement;
  if (still) { root.classList.add("still"); return; }
  root.classList.add("moving");
  var rd = function (s) { return Math.max(0.8, 0.15 + s.length / 28); };
  var base = document.currentScript ? document.currentScript.src.replace(/[^/]*$/, "") : "";
  var noVideo = forceLive, live = null;          /* live: the one loop that moves */

  /* ------------------------------------------------------------------ one loop */
  function Loop(el) {
    var L = this; L.el = el; L.pic = el.querySelector(".pic");
    L.items = [].slice.call(el.querySelectorAll(".lines li"));
    L.key = el.getAttribute("data-key"); L.film = el.getAttribute("data-film");
    L.from = +(el.getAttribute("data-from") || 0);
    L.crop = (el.getAttribute("data-crop") || "0,1350").split(",").map(Number);
    var s = LEAD; L.beats = L.items.map(function (li) { var d = rd(li.textContent.trim()), b = [s, s + d]; s += d; return b; });
    L.end = s; L.total = s + TAIL;
    L.t = 0; L.cur = -1; L.until = 0; L.done = null; L.played = false; L.drawn = -1; L.seek = false;
    var w = document.createElement("img"); w.className = "still wait"; w.alt = ""; w.src = base + "stills/" + L.key + "-wait.jpg"; L.pic.appendChild(w);
    L.bar = document.createElement("i"); L.bar.className = "prog"; L.pic.appendChild(L.bar);
    if (noVideo) L.mountFrame(); else L.mountVideo();
    L.rest("wait");
  }
  Loop.prototype.line = function (i) {
    if (i === this.cur) return;
    if (this.cur >= 0) this.items[this.cur].classList.remove("on");
    this.items[i].classList.add("on"); this.cur = i;
  };
  Loop.prototype.beatAt = function (t) {
    for (var i = 0; i < this.beats.length; i++) if (t < this.beats[i][1]) return i;
    return this.beats.length - 1;
  };
  Loop.prototype.mountVideo = function () {
    var L = this, v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.preload = "auto";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    v.setAttribute("disablepictureinpicture", ""); v.setAttribute("disableremoteplayback", "");
    v.setAttribute("aria-hidden", "true"); v.tabIndex = -1;
    v.src = base + "../page/loops/" + L.key + ".mp4";
    v.addEventListener("seeked", function () { L.seek = false; });
    v.addEventListener("error", function () { L.toLive(); });
    L.video = v; L.pic.insertBefore(v, L.pic.firstChild);
  };
  /* the browser will not play video: from now on every loop is drawn live */
  Loop.prototype.toLive = function () {
    var L = this; if (!L.video) return;
    noVideo = true; L.video.pause(); L.pic.removeChild(L.video); L.video = null; L.seek = false;
    L.mountFrame();
  };
  Loop.prototype.mountFrame = function () {
    var L = this, f = document.createElement("iframe");
    f.src = base + "../films/" + L.film + "/embed.html?labels=0";
    f.title = ""; f.setAttribute("aria-hidden", "true"); f.setAttribute("scrolling", "no"); f.tabIndex = -1;
    L.frame = f; L.pic.insertBefore(f, L.pic.firstChild); L.fit();
    (function wait() { var w = f.contentWindow; if (w && w.__film) L.api = w.__film; else setTimeout(wait, 60); })();
  };
  Loop.prototype.fit = function () {
    if (this.frame) this.frame.style.transform = "scale(" + this.pic.clientWidth / 1080 + ") translateY(" + -this.crop[0] + "px)";
  };
  Loop.prototype.filmTime = function (t) {
    var L = this, OB = L.api.BEATS, a = L.from, last = a + L.beats.length - 1;
    if (t < LEAD) return Math.max(0, OB[a][0] - (LEAD - t));
    if (t >= L.end) return last === OB.length - 1 ? Math.min(L.api.END, OB[last][1] + (t - L.end)) : OB[last][1] - 0.02;
    var i = L.beatAt(t), nb = L.beats[i], ob = OB[a + i];
    return ob[0] + (t - nb[0]) / (nb[1] - nb[0]) * (ob[1] - ob[0]);
  };
  /* stop moving. how: "wait" = still of the start, first line; "end" = still of the end, last line;
     "hold" = the picture as it is now, with the line that is on. */
  Loop.prototype.rest = function (how) {
    var L = this;
    if (live === L) live = null;
    if (L.video && !L.video.paused) L.video.pause();
    L.done = null;
    L.el.classList.remove("live", "s-wait", "s-end", "s-hold");
    L.el.classList.add("s-" + how);
    if (how === "wait") L.line(0);
    if (how === "end") L.line(L.items.length - 1);
    L.bar.style.transform = "scaleX(0)";
  };
  /* move from t0 to t1, then stop there and call done. Whatever else moved is stopped first. */
  Loop.prototype.run = function (t0, t1, done) {
    var L = this;
    if (live && live !== L) live.rest(live.played ? "end" : "wait");
    live = L; L.until = t1; L.done = done || null; L.played = true; L.drawn = -1;
    L.line(L.beatAt(t0));
    if (L.video) {
      var v = L.video;
      if (Math.abs(v.currentTime - t0) > 0.05 || v.ended) { L.seek = true; try { v.currentTime = t0; } catch (e) { L.seek = false; } if (!v.seeking) L.seek = false; }
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function (e) { if (e && e.name === "NotAllowedError") { L.toLive(); L.t = t0; } });
    }
    L.t = t0;
    /* the picture is ready: show it at once, so a loop that starts again does not blink */
    if (L.video ? L.video.readyState >= 2 : !!L.api) { L.el.classList.remove("s-wait", "s-end", "s-hold"); L.el.classList.add("live"); }
  };
  Loop.prototype.tick = function (dt, now) {
    var L = this, v = L.video;
    if (v) {
      if (L.seek || v.seeking || v.readyState < 2) return;
      L.t = v.currentTime;
    } else {
      if (!L.api) return;
      L.t += dt;
      if (now - L.drawn >= FRAME) { L.api.draw(L.filmTime(Math.min(L.t, L.total - 0.001))); L.drawn = now; }
    }
    if (!L.el.classList.contains("live")) { L.el.classList.remove("s-wait", "s-end", "s-hold"); L.el.classList.add("live"); }
    L.line(L.beatAt(L.t));
    L.bar.style.transform = "scaleX(" + Math.min(1, L.t / L.total).toFixed(3) + ")";
    if (L.t >= L.until - 0.012 || (v && v.ended)) {
      var d = L.done; L.rest("hold"); if (d) d();
    }
  };

  /* ------------------------------------------------------------------ the pairs */
  var units = [];                                 /* what can be "the one nearest the middle" */
  function Pair(el) {
    var P = this; P.el = el; P.mode = el.getAttribute("data-mode");
    P.loops = [].map.call(el.querySelectorAll(".loop"), function (f) { return new Loop(f); });
    P.on = false; P.act = 0; P.token = 0;
    if (P.mode === "a" || P.mode === "b") P.loops.forEach(function (L) { units.push({ el: L.el, start: function () { P.focus(L); }, stop: function () { if (live === L) L.rest("end"); } }); });
    else units.push({ el: el, start: function () { P.on = true; P.start(); }, stop: function () { P.on = false; P.stop(); } });
    if (P.mode === "c" || P.mode === "f") P.oneFrame();
  }
  /* a, b: this loop plays and repeats */
  Pair.prototype.focus = function (L) { (function again() { L.run(0, L.total, again); })(); };

  Pair.prototype.start = function () {
    var P = this, tok = ++P.token, A = P.loops[0], B = P.loops[1];
    var ok = function (fn) { return function () { if (P.on && tok === P.token) fn(); }; };
    if (P.mode === "c") P.playAct(0);
    if (P.mode === "f") P.playAct(P.act);
    if (P.mode === "d") {
      (function turn(i) { var L = P.loops[i]; L.run(0, L.total, ok(function () { L.rest("end"); turn(1 - i); })); })(0);
    }
    if (P.mode === "e") {
      /* the steps of a loop: one line each. A change line ("Now a tank.") goes with the line after it. */
      var segs = P.loops.map(function (L) {
        var cuts = [0]; L.beats.forEach(function (b, i) { if (!(i === 0 && L.items[0].classList.contains("chg"))) cuts.push(b[1]); });
        cuts[cuts.length - 1] = L.total;
        var out = []; for (var i = 1; i < cuts.length; i++) out.push([cuts[i - 1], cuts[i]]); return out;
      });
      var order = [], n = Math.max(segs[0].length, segs[1].length);
      for (var i = 0; i < n; i++) { if (segs[0][i]) order.push([A, segs[0][i]]); if (segs[1][i]) order.push([B, segs[1][i]]); }
      (function step(k) {
        var L = order[k][0], s = order[k][1];
        L.run(s[0], s[1], ok(function () { step((k + 1) % order.length); }));
      })(0);
    }
  };
  Pair.prototype.stop = function () {
    var P = this; P.token++;
    P.loops.forEach(function (L) { if (live === L || L.el.classList.contains("s-hold")) L.rest(L.played ? "end" : "wait"); });
    if (P.mode === "c") { P.loops.forEach(function (L) { L.played = false; L.rest("wait"); }); P.show(0); }
    if (P.card) P.card.classList.remove("on");
  };

  /* c, f: both parts in one frame, one of them shown */
  Pair.prototype.oneFrame = function () {
    var P = this, A = P.loops[0], B = P.loops[1];
    P.el.classList.add("one");
    var names = [A.el.getAttribute("data-name"), B.el.getAttribute("data-name")];
    if (P.mode === "c") {
      var m = document.createElement("div"); m.className = "marker"; m.setAttribute("role", "group"); m.setAttribute("aria-label", "Part 1 and part 2");
      P.tabs = names.map(function (nm, i) {
        var b = document.createElement("button"); b.type = "button"; b.innerHTML = "<i></i><span></span>"; b.lastChild.textContent = nm;
        b.addEventListener("click", function (e) { e.stopPropagation(); if (!P.on) return; P.token++; P.playAct(i); });
        m.appendChild(b); return b;
      });
      P.el.insertBefore(m, P.el.firstChild);
      P.card = document.createElement("div"); P.card.className = "card"; P.card.setAttribute("aria-hidden", "true"); P.el.appendChild(P.card);
      P.el.addEventListener("click", function () { if (!P.on) return; P.token++; P.playAct(1 - P.act); });
    } else {
      var btn = document.createElement("button"); btn.type = "button"; btn.className = "change";
      P.words = [B.items[0].textContent.trim(), P.el.getAttribute("data-back") || "Back."];
      btn.addEventListener("click", function () { P.rounds = 0; btn.classList.remove("nudge"); P.token++; P.act = 1 - P.act; P.show(P.act); if (P.on) P.playAct(P.act); else P.loops[P.act].rest("wait"); });
      P.btn = btn; P.el.appendChild(btn);
    }
    P.show(0);
  };
  Pair.prototype.show = function (i) {
    var P = this; P.act = i;
    P.loops.forEach(function (L, k) { L.el.classList.toggle("shown", k === i); });
    if (P.tabs) P.tabs.forEach(function (b, k) { b.classList.toggle("on", k === i); b.classList.toggle("past", k < i); b.firstChild.style.transform = k < i ? "scaleX(1)" : "scaleX(0)"; });
    if (P.btn) P.btn.textContent = P.words[i];
  };
  Pair.prototype.playAct = function (i) {
    var P = this, tok = P.token, L = P.loops[i];
    P.loops[1 - i].rest(P.loops[1 - i].played ? "end" : "wait");
    P.show(i);
    L.run(0, L.total, function () {
      if (!P.on || tok !== P.token) return;
      if (P.mode === "c") P.playAct(1 - i);
      else { P.rounds = (P.rounds || 0) + 1; if (i === 0 && P.rounds >= 1) P.btn.classList.add("nudge"); P.playAct(i); }
    });
  };

  var pairs = [].map.call(document.querySelectorAll(".pair"), function (el) { return new Pair(el); });

  /* which unit is nearest the middle of the screen */
  var current = null, asked = false;
  function choose() {
    asked = false;
    var vh = window.innerHeight, mid = vh / 2, best = null, bd = 1e9;
    units.forEach(function (u) {
      var r = u.el.getBoundingClientRect(), vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (vis < Math.min(r.height, vh) * 0.35) return;
      var d = Math.abs((r.top + r.bottom) / 2 - mid) - (u === current ? 14 : 0);
      if (d < bd) { bd = d; best = u; }
    });
    if (best === current) return;
    if (current) current.stop();
    current = best;
    if (current) current.start();
  }
  function ask() { if (!asked) { asked = true; requestAnimationFrame(choose); } }
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", function () { pairs.forEach(function (P) { P.loops.forEach(function (L) { L.fit(); }); }); ask(); });
  window.addEventListener("load", ask);
  document.addEventListener("visibilitychange", function () { if (document.hidden) { if (current) current.stop(); current = null; } else ask(); });
  ask();

  var prev = performance.now();
  (function tick(now) {
    var dt = Math.max(0, Math.min(0.25, (now - prev) / 1000)); prev = now;
    if (live) {
      live.tick(dt, now);
      /* c: the cut card covers the frame for as long as the change line takes; the bars fill */
      pairs.forEach(function (P) {
        if (P.mode !== "c" || !P.on) return;
        var L = P.loops[P.act], chg = L.items[0].classList.contains("chg") && live === L && L.t < L.beats[0][1];
        if (chg) P.card.textContent = L.items[0].textContent;
        P.card.classList.toggle("on", !!chg);
        if (live === L) P.tabs[P.act].firstChild.style.transform = "scaleX(" + Math.min(1, L.t / L.total).toFixed(3) + ")";
      });
    }
    requestAnimationFrame(tick);
  })(prev);

  /* for a test: how many loops move right now */
  window.__pairs = { pairs: pairs, moving: function () {
    var n = 0; pairs.forEach(function (P) { P.loops.forEach(function (L) { if (L.video ? !L.video.paused : live === L) n++; }); }); return n;
  }, live: function () { return live ? live.key : null; } };
})();
