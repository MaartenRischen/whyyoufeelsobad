/* shared.js - what the three mock-ups have in common: putting the coded film on a page and
   deciding which moment of it is drawn. The film is code (SVG), so any moment can be drawn on
   demand: film.draw(seconds). Nothing here is a video file. */
(function () {
  "use strict";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var players = [];
  var last = 0, running = false;

  function loop(now) {
    var dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    var busy = false;
    for (var i = 0; i < players.length; i++) if (players[i]._tick(dt)) busy = true;
    if (busy && !document.hidden) requestAnimationFrame(loop); else running = false;
  }
  function wake() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); } }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) wake(); });

  /* A player owns one film stage and its clock. */
  function Player(draw, opts) {
    opts = opts || {};
    this.draw = draw; this.t = opts.t || 0; this.view = opts.view || null; this.win = opts.win || window;
    this.mode = "still"; this.visible = true; this.dirty = true; this.fps = opts.fps || 30; this._acc = 0;
    players.push(this);
  }
  Player.prototype._paint = function () {
    this.win.__view = this.view;
    this.draw(this.t);
    this.dirty = false;
    if (this.onframe) this.onframe(this.t);
  };
  Player.prototype.show = function (t, view) { this.mode = "still"; this.t = t; if (view !== undefined) this.view = view; this.dirty = true; wake(); };
  /* play from a to b at film speed; loop with a short hold at the end */
  Player.prototype.play = function (a, b, o) {
    o = o || {};
    if (this.mode === "play" && this.a === a && this.b === b) return;
    this.mode = "play"; this.a = a; this.b = b; this.loopIt = !!o.loop; this.hold = o.hold === undefined ? 0.7 : o.hold; this.rate = o.rate || 1;
    this.t = RM ? (o.still === undefined ? b : o.still) : a; this._held = 0; this.dirty = true;
    if (o.view !== undefined) this.view = o.view;
    wake();
  };
  /* the playhead runs to T at film speed, faster only when it is far behind. Going back is a cut. */
  Player.prototype.chase = function (T, from) {
    this.mode = "chase";
    if (RM) { if (this.t !== T) { this.t = T; this.dirty = true; } wake(); return; }
    if (T < this.t - 0.01) { this.t = from === undefined ? T : from; this.dirty = true; }
    this.T = T; wake();
  };
  Player.prototype._tick = function (dt) {
    if (!this.visible) return false;
    var moving = false;
    if (!RM && this.mode === "play") {
      if (this.t < this.b) { this.t = Math.min(this.b, this.t + dt * this.rate); moving = true; this.dirty = true; }
      else if (this.loopIt) { this._held += dt; moving = true; if (this._held > this.hold) { this._held = 0; this.t = this.a; this.dirty = true; } }
    } else if (!RM && this.mode === "chase") {
      var gap = this.T - this.t;
      if (gap > 0.001) { var rate = Math.max(1, Math.min(8, gap / 3.5)); this.t = Math.min(this.T, this.t + dt * rate); moving = true; this.dirty = true; }
    }
    if (this.dirty) {
      /* 30 pictures a second is what the film was made at */
      this._acc += dt;
      if (this._acc >= 1 / this.fps - 0.004 || !moving) { this._acc = 0; this._paint(); }
    }
    return moving || this.dirty;
  };
  Player.prototype.setVisible = function (v) { if (v !== this.visible) { this.visible = v; if (v) { this.dirty = true; wake(); } } };

  /* Put the film in a frame inside `host` and scale it. fit: "contain" (whole 4:5 picture) or
     "cover" (fills the host; fx, fy say which part of the picture stays in view, 0..1). */
  function frame(host, o) {
    o = o || {};
    var base = o.base || "../film/";
    var f = document.createElement("iframe");
    f.src = base + "embed.html?labels=" + (o.labels ? "1" : "0");
    f.title = o.title || "Animated scene";
    f.setAttribute("scrolling", "no"); f.setAttribute("tabindex", "-1"); f.setAttribute("aria-hidden", "true");
    f.width = 1080; f.height = 1350;
    f.style.cssText = "position:absolute;left:0;top:0;width:1080px;height:1350px;border:0;transform-origin:0 0;pointer-events:none";
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    host.style.overflow = "hidden";
    host.appendChild(f);
    var st = { fit: o.fit || "cover", fx: o.fx === undefined ? 0.5 : o.fx, fy: o.fy === undefined ? 0.5 : o.fy };
    function layout() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      var s = st.fit === "cover" ? Math.max(w / 1080, h / 1350) : Math.min(w / 1080, h / 1350);
      var x = (w - 1080 * s) * (st.fit === "cover" ? st.fx : 0.5), y = (h - 1350 * s) * (st.fit === "cover" ? st.fy : 0.5);
      f.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) scale(" + s.toFixed(4) + ")";
    }
    layout();
    if (window.ResizeObserver) new ResizeObserver(layout).observe(host); else window.addEventListener("resize", layout);
    return new Promise(function (res) {
      (function wait() {
        var w = f.contentWindow;
        if (w && w.__film) {
          var p = new Player(function (t) { w.__film.draw(t); }, { win: w, t: o.t || 0, view: o.view || null, fps: o.fps });
          p.film = w.__film; p.el = f; p.focus = function (fx, fy) { st.fx = fx; st.fy = fy; layout(); };
          p.feel = function () { return w.__feel || [null, 0]; };
          if (window.IntersectionObserver) new IntersectionObserver(function (es) { p.setVisible(es[0].isIntersecting); }, { rootMargin: "20%" }).observe(host);
          p.show(p.t);
          res(p);
        } else setTimeout(wait, 40);
      })();
    });
  }

  /* the beats of one subject as [start, end] pairs, plus the camera move that leads in */
  function beats(film, key) { return key === "human" ? { move: film.HMOVE, beats: film.HBEATS } : { move: film.MOVE[key], beats: film.BEATS[key] }; }

  /* scroll progress 0..1 of a tall element against the viewport: 0 when its top reaches the top,
     1 when its bottom reaches the bottom */
  function progress(el) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight, span = r.height - vh;
    return span <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / span));
  }
  function onScroll(fn) {
    var tick = false;
    function run() { tick = false; fn(); }
    function req() { if (!tick) { tick = true; requestAnimationFrame(run); } }
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    req();
  }
  window.WY = { RM: RM, Player: Player, frame: frame, beats: beats, progress: progress, onScroll: onScroll, wake: wake };
})();
