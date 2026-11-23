/* page.js of mock/humans-first/: the live page.js with two changes (build_humans_first.py).
   1 A diagram with data-from starts on that beat, so a loop can show its mismatched half only.
   2 A diagram that is not laid out (inside a shut fold) gets no turn.

   page.js - runs the small diagrams of the page (Open Brain thought 4987, 20 Nov 2026).
   The same runner as mock/diagrams/diagrams.js.

   A diagram (.dg) is an SVG whose parts are shown, drawn, moved and coloured by the stylesheet,
   according to data-b on the diagram: the beat. This script only counts beats.
   With no data-b a diagram is at rest: its complete still.

   To keep the page calm, one diagram on the whole page moves at a time:
   - only the group (.dpair) nearest the middle of the screen runs;
   - inside it part 1 plays its beats and comes to rest, then part 2, and round again.
   Everything else on the page stands still.
   The grid of five animals (.dgrid, Open Brain 5009) counts as one group: its rows take turns. It starts with
   the row nearest the middle of the screen, plays that row's two parts, then goes on to the next row that is
   on screen, and round again. Still one diagram at a time.
   A beat lasts as long as its line takes to read: 0.15 s + 1 s per 28 characters, never under 0.8 s
   (the times are worked out by wyfsb/page2/build.py and sit in data-beats).

   Without JavaScript, and with reduced motion, nothing here runs and every diagram is its still. */
(function () {
  "use strict";
  var root = document.documentElement;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { root.classList.add("still"); return; }
  root.classList.add("moving");
  var START = 320, REST = 550;                    /* ms: before the first beat, and at rest before the other part starts */

  function group(el) {
    var P = { el: el, token: 0, timer: 0, on: false, grid: el.classList.contains("dgrid"), row: null };
    P.parts = [].map.call(el.querySelectorAll(".dg[data-beats]"), function (d) {
      return { el: d, row: d.parentNode, beats: d.getAttribute("data-beats").split(",").map(Number), from: +d.getAttribute("data-from") || 0 };
    });
    return P;
  }
  /* a group is a pair, or the whole grid; the rows of the grid are not groups of their own */
  var pairs = [].filter.call(document.querySelectorAll(".dgrid, .dpair"), function (el) {
    return el.classList.contains("dgrid") || !el.closest(".dgrid");
  }).map(group);
  var moving = null;                               /* the one diagram that has a beat */

  function rest(part) { part.el.removeAttribute("data-b"); if (moving === part) moving = null; }
  function seen(el) {                              /* at least 60% of it on screen */
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    if (!r.height) return false;
    return Math.min(r.bottom, vh) - Math.max(r.top, 0) >= r.height * 0.6;
  }
  function play(P, i) {
    if (P.grid) {                                  /* skip the rows that are off screen */
      var n = 0;
      while (n < P.parts.length && !seen(P.parts[i].row)) { i = (i + 1) % P.parts.length; n++; }
      if (n === P.parts.length) { var t0 = P.token; P.timer = setTimeout(function () { if (t0 === P.token) play(P, i); }, 400); return; }
    }
    var part = P.parts[i], tok = P.token, d = part.el;
    if (moving && moving !== part) rest(moving);
    moving = part;
    /* back to the start: what moves jumps there, the rest fades */
    var k = part.from;
    d.classList.add("snap"); d.setAttribute("data-b", String(k)); void d.getBoundingClientRect(); d.classList.remove("snap");
    (function next() {
      if (tok !== P.token) return;
      if (k === part.beats.length) {
        rest(part);
        P.timer = setTimeout(function () { if (tok === P.token) play(P, (i + 1) % P.parts.length); }, REST);
        return;
      }
      var wait = k !== part.from ? 0 : k ? part.beats[k - 1] * 1000 : START;
      P.timer = setTimeout(function () {
        if (tok !== P.token) return;
        k++; d.setAttribute("data-b", String(k));
        P.timer = setTimeout(next, part.beats[k - 1] * 1000);
      }, wait);
    })();
  }
  function first(P) {                              /* in the grid: the first part of the row nearest the middle */
    if (!P.grid || !P.row) return 0;
    for (var i = 0; i < P.parts.length; i++) if (P.parts[i].row === P.row) return i;
    return 0;
  }
  function start(P) { P.on = true; P.token++; play(P, first(P)); }
  function stop(P) { P.on = false; P.token++; clearTimeout(P.timer); P.parts.forEach(rest); }

  /* which group is nearest the middle of the screen */
  var current = null, asked = false;
  function choose() {
    asked = false;
    var vh = window.innerHeight, mid = vh / 2, best = null, bd = 1e9;
    pairs.forEach(function (P) {
      var dist;
      if (P.grid) {                                /* the grid is as near as its nearest row that is half on screen */
        dist = 1e9;
        P.parts.forEach(function (part) {
          var q = part.row.getBoundingClientRect();
          if (!q.height) return;
          if (Math.min(q.bottom, vh) - Math.max(q.top, 0) < Math.min(q.height, vh) * 0.5) return;
          dist = Math.min(dist, Math.abs((q.top + q.bottom) / 2 - mid));
        });
        if (dist === 1e9) return;
        dist -= P === current ? 14 : 0;
      } else {
        var r = P.el.getBoundingClientRect(), vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (!r.height) return;
        if (vis < Math.min(r.height, vh) * 0.5) return;
        dist = Math.abs((r.top + r.bottom) / 2 - mid) - (P === current ? 14 : 0);
      }
      if (dist < bd) { bd = dist; best = P; }
    });
    if (best && best.grid) {                       /* which row of the grid is nearest the middle */
      var row = null, rd = 1e9;
      best.parts.forEach(function (part) {
        var r = part.row.getBoundingClientRect(); if (!r.height) return; var d = Math.abs((r.top + r.bottom) / 2 - mid) - (part.row === best.row ? 14 : 0);
        if (d < rd) { rd = d; row = part.row; }
      });
      if (row !== best.row) { best.row = row; if (best === current) { stop(best); start(best); return; } }
    }
    if (best === current) return;
    if (current) stop(current);
    current = best;
    if (current) start(current);
  }
  function ask() { if (!asked) { asked = true; requestAnimationFrame(choose); } }
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", ask);
  window.addEventListener("load", ask);
  document.addEventListener("toggle", ask, true);
  document.addEventListener("visibilitychange", function () { if (document.hidden) { if (current) stop(current); current = null; } else ask(); });
  ask();

  /* for a test: how many diagrams have a beat right now */
  window.__dg = { moving: function () { return document.querySelectorAll(".dg[data-b]").length; }, pairs: pairs };
})();
