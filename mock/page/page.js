/* page.js - runs the small diagrams of the page (Open Brain thought 4987, 20 Nov 2026).
   The same runner as mock/diagrams/diagrams.js.

   A diagram (.dg) is an SVG whose parts are shown, drawn, moved and coloured by the stylesheet,
   according to data-b on the diagram: the beat. This script only counts beats.
   With no data-b a diagram is at rest: its complete still.

   To keep the page calm, one diagram on the whole page moves at a time:
   - only the group (.dpair) nearest the middle of the screen runs;
   - inside it part 1 plays its beats and comes to rest, then part 2, and round again.
   Everything else on the page stands still.
   A beat lasts as long as its line takes to read: 0.15 s + 1 s per 28 characters, never under 0.8 s
   (the times are worked out by wyfsb/page2/build.py and sit in data-beats).

   Without JavaScript, and with reduced motion, nothing here runs and every diagram is its still. */
(function () {
  "use strict";
  var root = document.documentElement;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { root.classList.add("still"); return; }
  root.classList.add("moving");
  var START = 320, REST = 550;                    /* ms: before the first beat, and at rest before the other part starts */

  var pairs = [].map.call(document.querySelectorAll(".dpair"), function (el) {
    var P = { el: el, token: 0, timer: 0, on: false };
    P.parts = [].map.call(el.querySelectorAll(".dg[data-beats]"), function (d) {
      return { el: d, beats: d.getAttribute("data-beats").split(",").map(Number) };
    });
    return P;
  });
  var moving = null;                               /* the one diagram that has a beat */

  function rest(part) { part.el.removeAttribute("data-b"); if (moving === part) moving = null; }
  function play(P, i) {
    var part = P.parts[i], tok = P.token, d = part.el;
    if (moving && moving !== part) rest(moving);
    moving = part;
    /* back to the start: what moves jumps there, the rest fades */
    d.classList.add("snap"); d.setAttribute("data-b", "0"); void d.getBoundingClientRect(); d.classList.remove("snap");
    var k = 0;
    (function next() {
      if (tok !== P.token) return;
      if (k === part.beats.length) {
        rest(part);
        P.timer = setTimeout(function () { if (tok === P.token) play(P, (i + 1) % P.parts.length); }, REST);
        return;
      }
      var wait = k === 0 ? START : 0;
      P.timer = setTimeout(function () {
        if (tok !== P.token) return;
        k++; d.setAttribute("data-b", String(k));
        P.timer = setTimeout(next, part.beats[k - 1] * 1000);
      }, wait);
    })();
  }
  function start(P) { P.on = true; P.token++; play(P, 0); }
  function stop(P) { P.on = false; P.token++; clearTimeout(P.timer); P.parts.forEach(rest); }

  /* which group is nearest the middle of the screen */
  var current = null, asked = false;
  function choose() {
    asked = false;
    var vh = window.innerHeight, mid = vh / 2, best = null, bd = 1e9;
    pairs.forEach(function (P) {
      var r = P.el.getBoundingClientRect(), vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (vis < Math.min(r.height, vh) * 0.5) return;
      var dist = Math.abs((r.top + r.bottom) / 2 - mid) - (P === current ? 14 : 0);
      if (dist < bd) { bd = dist; best = P; }
    });
    if (best === current) return;
    if (current) stop(current);
    current = best;
    if (current) start(current);
  }
  function ask() { if (!asked) { asked = true; requestAnimationFrame(choose); } }
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", ask);
  window.addEventListener("load", ask);
  document.addEventListener("visibilitychange", function () { if (document.hidden) { if (current) stop(current); current = null; } else ask(); });
  ask();

  /* for a test: how many diagrams have a beat right now */
  window.__dg = { moving: function () { return document.querySelectorAll(".dg[data-b]").length; }, pairs: pairs };
})();
