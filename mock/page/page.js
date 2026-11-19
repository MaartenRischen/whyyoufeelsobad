/* page.js - the loops of the preview page (Open Brain thought 4892, 19 Nov 2026).

   Every .loop holds its lines as a list. One line shows at a time. A line stays for
   0.15 s + 1 s per 28 characters, never under 0.8 s (the reading rule of report 4848).
   A loop starts when it comes on screen and repeats without end. No sound, no controls,
   and nothing here reads the scroll position.

   .loop.film  a part of an existing coded film (../films/orca, ../films/alone).
               The film still has the timing of its older, longer lines. So each new line is laid over
               the film's own beat for that line: the picture of that beat plays in the time the new
               line takes. data-from is the film's first beat for this loop.
               The picture is a short silent video file, loops/<key>.mp4, rendered from the film's code
               with exactly this timing (wyfsb/page1/render-loops.mjs in the workspace repo). Drawing
               two or three films live on one screen was too slow: the feeling glow is an SVG blur.
               The live drawing is still here and is used when the browser refuses to start the video
               (an iPhone in Low Power Mode), when reduced motion is asked for, and with ?live=1.
   .loop.ph    a film that is not made yet: flat colour, name, lines.
   data-sync   loops with the same value change line together (each line gets the longer of the
               two times). */
(function () {
  "use strict";
  var LEAD = 0.15, TAIL = 0.4, FRAME = 1000 / 31;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var forceLive = /[?&]live=1/.test(location.search);
  var rd = function (s) { return Math.max(0.8, 0.15 + s.length / 28); };
  var root = document.documentElement;
  root.classList.add(still ? "still" : "moving");

  var loops = [].map.call(document.querySelectorAll(".loop"), function (el) {
    var items = [].slice.call(el.querySelectorAll(".lines li"));
    return {
      el: el, items: items, pic: el.querySelector(".pic"),
      durs: items.map(function (li) { return rd(li.textContent.trim()); }),
      film: el.classList.contains("film") ? el.getAttribute("data-film") : null,
      key: el.getAttribute("data-key"),
      from: +(el.getAttribute("data-from") || 0),
      crop: (el.getAttribute("data-crop") || "0,1350").split(",").map(Number),
      sync: el.getAttribute("data-sync"),
      t: 0, cur: -1, on: false, frame: null, api: null, video: null, drawn: -1
    };
  });

  /* loops that change line together */
  var groups = {};
  loops.forEach(function (L) { if (L.sync) (groups[L.sync] = groups[L.sync] || []).push(L); });
  Object.keys(groups).forEach(function (k) {
    var g = groups[k], n = Math.max.apply(null, g.map(function (L) { return L.durs.length; }));
    for (var i = 0; i < n; i++) {
      var m = Math.max.apply(null, g.map(function (L) { return L.durs[i] || 0; }));
      g.forEach(function (L) { if (i < L.durs.length) L.durs[i] = m; });
    }
  });

  loops.forEach(function (L) {
    var s = LEAD; L.beats = L.durs.map(function (d) { var b = [s, s + d]; s += d; return b; });
    L.end = s; L.total = s + TAIL;
    L.el.setAttribute("data-seconds", L.total.toFixed(2));
  });

  function line(L, i) {
    if (i === L.cur) return;
    if (L.cur >= 0) L.items[L.cur].classList.remove("on");
    L.items[i].classList.add("on"); L.cur = i;
  }
  function beatAt(L, t) {
    for (var i = 0; i < L.beats.length; i++) if (t < L.beats[i][1]) return i;
    return L.beats.length - 1;
  }

  /* where in the old film the picture is, for a moment of the loop */
  function filmTime(L, t) {
    var OB = L.api.BEATS, a = L.from, last = a + L.beats.length - 1;
    if (t < LEAD) return Math.max(0, OB[a][0] - (LEAD - t));
    if (t >= L.end) return last === OB.length - 1 ? Math.min(L.api.END, OB[last][1] + (t - L.end)) : OB[last][1] - 0.02;
    var i = beatAt(L, t), nb = L.beats[i], ob = OB[a + i];
    return ob[0] + (t - nb[0]) / (nb[1] - nb[0]) * (ob[1] - ob[0]);
  }

  /* ---- the picture as a video file ---- */
  function mountVideo(L) {
    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    v.setAttribute("disablepictureinpicture", ""); v.setAttribute("disableremoteplayback", "");
    v.setAttribute("aria-hidden", "true"); v.tabIndex = -1;
    v.poster = "loops/" + L.key + ".jpg"; v.src = "loops/" + L.key + ".mp4";
    v.addEventListener("error", function () { toLive(L); });
    L.video = v; L.pic.appendChild(v);
    if (L.on) start(L);
  }
  function start(L) {
    var v = L.video; if (!v) return;
    try { v.currentTime = 0; } catch (e) {}
    var pr = v.play();
    if (pr && pr.catch) pr.catch(function (e) { if (e && e.name === "NotAllowedError") toLive(L); });
  }
  /* the browser will not play the file: draw the film live instead */
  function toLive(L) {
    if (!L.video) return;
    L.video.pause(); L.pic.removeChild(L.video); L.video = null; L.t = 0;
    mountFrame(L);
  }

  /* ---- the picture drawn live, in a frame ---- */
  function fit(L) {
    if (!L.frame) return;
    var k = L.pic.clientWidth / 1080;
    L.frame.style.transform = "scale(" + k + ") translateY(" + -L.crop[0] + "px)";
  }
  function mountFrame(L) {
    var f = document.createElement("iframe");
    f.src = "../films/" + L.film + "/embed.html?labels=0";
    f.title = ""; f.setAttribute("aria-hidden", "true"); f.setAttribute("scrolling", "no"); f.tabIndex = -1;
    L.frame = f; L.pic.appendChild(f); fit(L);
    (function wait() {
      var w = f.contentWindow;
      if (w && w.__film) {
        L.api = w.__film;
        if (still) { var m = L.beats[L.beats.length - 1]; L.api.draw(filmTime(L, (m[0] + m[1]) / 2)); }
        else L.api.draw(filmTime(L, L.t));
      } else setTimeout(wait, 60);
    })();
  }
  function mount(L) {
    if (!L.film || L.frame || L.video) return;
    if (still || forceLive) mountFrame(L); else mountVideo(L);
  }
  window.addEventListener("resize", function () { loops.forEach(fit); });

  if (!("IntersectionObserver" in window)) { loops.forEach(function (L) { L.on = true; }); loops.forEach(mount); }
  else {
    /* the film is put in place a screen before it is needed */
    var near = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { mount(e.target.__loop); near.unobserve(e.target); } });
    }, { rootMargin: "120% 0px" });
    /* a loop runs while a third of it is on screen, and starts from its first line */
    var seen = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var L = e.target.__loop, was = L.on;
        L.on = e.isIntersecting && e.intersectionRatio >= 0.3;
        if (L.on && !was) {
          var g = L.sync ? groups[L.sync] : null, mate = g && g.filter(function (x) { return x !== L && x.on; })[0];
          L.t = mate ? mate.t : 0; L.drawn = -1;
          mount(L); start(L);
        }
        if (!L.on && was && L.video) L.video.pause();
      });
    }, { threshold: [0, 0.3, 0.6] });
    loops.forEach(function (L) { L.el.__loop = L; if (L.film) near.observe(L.el); seen.observe(L.el); });
  }

  window.__loops = loops;
  if (still) { loops.forEach(function (L) { L.items.forEach(function (li) { li.classList.add("on"); }); }); return; }

  loops.forEach(function (L) { line(L, 0); });
  var prev = performance.now();
  function tick(now) {
    var dt = Math.max(0, Math.min(0.25, (now - prev) / 1000)); prev = now;
    for (var j = 0; j < loops.length; j++) {
      var L = loops[j];
      if (!L.on) continue;
      if (L.video) {
        /* the line follows the video's own clock, so word and picture cannot drift apart */
        if (L.video.readyState < 2) continue;
        L.t = Math.min(L.video.currentTime, L.total - 0.001);
      } else { L.t += dt; if (L.t >= L.total) L.t -= L.total; }
      line(L, beatAt(L, L.t));
      if (L.api && now - L.drawn >= FRAME) { L.api.draw(filmTime(L, L.t)); L.drawn = now; }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  /* for a test, and for rendering the video files: stop a loop and show one moment (live drawing only) */
  loops.forEach(function (L) { L.at = function (t) { L.on = false; L.t = t; line(L, beatAt(L, t)); if (L.api) L.api.draw(filmTime(L, t)); }; });
})();
