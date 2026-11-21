/* library.js - the diagram library (mock/library/). Source: wyfsb/library/library.js in the workspace repo.

   Two jobs.
   1 The runner of mock/page/page.js, for one grid of loops: one loop moves at a time. The loops that are on screen
     take turns, starting with the one nearest the middle of the screen. An entry the filter has hidden gets no
     turn. A click on a loop gives it the next turn at once.
   2 The filter: five ways to narrow the library (in their words, feeling, setting, need, kind of mismatch). One
     choice per way; an entry shows when it fits every choice made.

   Without JavaScript, and with reduced motion, no loop moves and every entry shows its still. The filter needs
   JavaScript and stays hidden without it. */
(function () {
  "use strict";
  var root = document.documentElement;
  var rows = [].slice.call(document.querySelectorAll(".dgrid.lib .lp"));

  /* ---------------------------------------------------------------- the filter */
  var bar = document.querySelector(".filter"), chosen = {};
  function fits(row) {
    for (var f in chosen) {
      var have = (row.getAttribute("data-" + f) || "").split(" ");
      if (have.indexOf(chosen[f]) < 0) return false;
    }
    return true;
  }
  function apply() {
    var n = 0;
    rows.forEach(function (r) { var ok = fits(r); r.hidden = !ok; if (ok) n++; });
    [].forEach.call(bar.querySelectorAll(".chip[data-f]"), function (c) {
      var f = c.getAttribute("data-f"), v = c.getAttribute("data-v");
      c.setAttribute("aria-pressed", chosen[f] === v ? "true" : "false");
      /* a chip that would leave nothing, given the other choices, is dimmed */
      var keep = chosen[f]; chosen[f] = v;
      var any = rows.some(fits);
      if (keep === undefined) delete chosen[f]; else chosen[f] = keep;
      c.classList.toggle("off", !any);
    });
    [].forEach.call(bar.querySelectorAll(".fa"), function (d) {
      var on = d.querySelector(".chip[aria-pressed=true]");
      d.querySelector(".fa-on").textContent = on ? on.firstChild.textContent.trim() : "";
    });
    var some = Object.keys(chosen).length > 0;
    document.getElementById("fa-shown").textContent = some ? n + " of " + rows.length + " loops" : rows.length + " loops";
    document.getElementById("fa-reset").hidden = !some;
    if (window.__lib) window.__lib.again();
  }
  if (bar) {
    bar.hidden = false;
    bar.addEventListener("click", function (ev) {
      var c = ev.target.closest && ev.target.closest(".chip");
      if (!c) return;
      if (c.id === "fa-reset") chosen = {};
      else {
        var f = c.getAttribute("data-f"), v = c.getAttribute("data-v");
        if (chosen[f] === v) delete chosen[f]; else chosen[f] = v;
        var d = c.closest("details"); if (d) d.open = false;
      }
      apply();
    });
    apply();
  }

  /* ---------------------------------------------------------------- the runner */
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { root.classList.add("still"); return; }
  root.classList.add("moving");
  var START = 320, REST = 550;
  var parts = rows.map(function (r) {
    var d = r.querySelector(".dg[data-beats]");
    return { el: d, row: r, beats: d.getAttribute("data-beats").split(",").map(Number) };
  });
  var token = 0, timer = 0, moving = null, wanted = null;

  function rest(p) { p.el.removeAttribute("data-b"); if (moving === p) moving = null; }
  function vis(el) { var r = el.getBoundingClientRect(), vh = window.innerHeight; return r.height ? (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / Math.min(r.height, vh) : 0; }
  function nearest() {
    var mid = window.innerHeight / 2, best = -1, bd = 1e9;
    parts.forEach(function (p, i) {
      if (vis(p.row) < 0.6) return;
      var r = p.row.getBoundingClientRect(), d = Math.abs((r.top + r.bottom) / 2 - mid) + Math.abs((r.left + r.right) / 2 - window.innerWidth / 2) * 0.01;
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }
  function play(i) {
    var n = 0;
    while (n < parts.length && vis(parts[i].row) < 0.6) { i = (i + 1) % parts.length; n++; }
    if (n === parts.length) { var t0 = token; timer = setTimeout(function () { if (t0 === token) play(i); }, 400); return; }
    var p = parts[i], tok = token, d = p.el;
    if (moving && moving !== p) rest(moving);
    moving = p;
    d.classList.add("snap"); d.setAttribute("data-b", "0"); void d.getBoundingClientRect(); d.classList.remove("snap");
    var k = 0;
    (function next() {
      if (tok !== token) return;
      if (k === p.beats.length) {
        rest(p);
        timer = setTimeout(function () { if (tok === token) play((i + 1) % parts.length); }, REST);
        return;
      }
      timer = setTimeout(function () {
        if (tok !== token) return;
        k++; d.setAttribute("data-b", String(k));
        timer = setTimeout(next, p.beats[k - 1] * 1000);
      }, k === 0 ? START : 0);
    })();
  }
  function start(i) { token++; clearTimeout(timer); parts.forEach(rest); if (i >= 0) play(i); }
  var asked = false, shownSet = "";
  function look() {
    asked = false;
    /* start again only when the set of loops on screen has changed, so a small scroll does not cut a loop short */
    var set = parts.map(function (p, i) { return vis(p.row) >= 0.6 ? i : ""; }).join(",");
    if (set === shownSet && moving) return;
    shownSet = set;
    if (moving && vis(moving.row) >= 0.6) return;
    start(nearest());
  }
  function ask() { if (!asked) { asked = true; requestAnimationFrame(look); } }
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", ask);
  window.addEventListener("load", ask);
  document.addEventListener("visibilitychange", function () { if (document.hidden) { start(-1); shownSet = ""; } else ask(); });
  document.querySelector(".dgrid.lib").addEventListener("click", function (ev) {
    if (ev.target.closest("a")) return;
    var row = ev.target.closest(".lp"); if (!row) return;
    for (var i = 0; i < parts.length; i++) if (parts[i].row === row) { start(i); return; }
  });
  window.__lib = { again: function () { shownSet = ""; start(-1); ask(); }, moving: function () { return document.querySelectorAll(".dg[data-b]").length; } };
  ask();
})();
