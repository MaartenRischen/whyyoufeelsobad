/* stage.js - the timeline helpers, the one camera, the world's own life, and the small effects.
   The sequences (seq_*.js) build on what this returns. */
const ST = (function () {
  gsap.defaults({ lazy: false, overwrite: false });
  const $ = (id) => document.getElementById(id);
  const cam = $("cam");
  $("palcss").textContent = palCSS();
  const L = buildWorld(cam);
  const E = buildEast(L, cam);
  const P = PLACE;
  /* `main` holds every tween. It is stepped by hand from draw(), in world time. */
  const main = gsap.timeline({ paused: true });
  const to = (o, t, d, v, e) => main.to(o, Object.assign({ duration: d, ease: e || "power2.inOut" }, v), t);
  const set = (o, t, v) => main.set(o, v, t);
  const hop = (o, t, d, hgt, k) => { k = k || "h"; to(o, t, d * 0.5, { [k]: hgt }, "power2.out"); to(o, t + d * 0.5, d * 0.5, { [k]: 0 }, "power2.in"); };
  const face = (o, t, d, name, extra, e) => to(o, t, d, Object.assign({}, FACE[name], extra || {}), e || "power2.out");
  const draws = [];
  const F = K.F, B = K.B, T = K.T, M = K.M;

  /* ================================================================= time: a short hold on the big hits */
  const STOPS = [];            /* [time, hold] - the world stands still for `hold`, then catches up */
  function warp(t) {
    for (const [ts, h] of STOPS) {
      if (t <= ts) continue;
      const r = h * 3;
      if (t < ts + h) return ts;
      if (t < ts + h + r) return ts + (h + r) * ((t - ts - h) / r);
    }
    return t;
  }

  /* ================================================================= camera */
  const WIDE = [0, 0, 1080], V_FISH = [80, 750, 480], V_FISH2 = [112, 850, 400], V_BEETLE = [468, 566, 204], V_STARS = [420, 40, 660], V_LAMP = [672, 478, 356],
    V_TOAD0 = [250, 640, 420], V_POND = [84, 556, 388], V_TOAD2 = [352, 606, 390], V_TOAD3 = [384, 668, 316], V_MONK = [166, 296, 300], V_MONK2 = [190, 304, 300];
  const CAM = [];
  let _last = WIDE;
  const cut = (t0, t1, v, dip) => { CAM.push({ t0, t1, a: _last, b: v, dip: dip || 0 }); _last = v; };
  cut(MOVE.fish[0], MOVE.fish[1], V_FISH, 0);
  cut(F[4] - 0.25, F[4] + 0.7, V_FISH2, 0);
  cut(MOVE.beetle[0], MOVE.beetle[1], V_BEETLE, 0.6);
  cut(B[1] + 0.3, B[1] + 1.05, V_STARS, 0);
  cut(B[4] - 0.3, B[4] + 0.5, V_LAMP, 0);
  cut(MOVE.toad[0], MOVE.toad[1], V_TOAD0, 0.3);
  cut(T[1] - 0.2, T[1] + 0.9, V_POND, 0);
  cut(T[2] + 1.0, T[3] + 0.4, V_TOAD2, 0);
  cut(T[4] - 0.1, T[4] + 0.7, V_TOAD3, 0);
  cut(MOVE.monkeys[0], MOVE.monkeys[1], V_MONK, 0.5);
  cut(M[4] + 0.15, M[4] + 0.9, V_MONK2, 0);
  /* v6: no wide pull-out. The camera goes east to the human (cuts in seq_human.js). */
  const SHAKES = [];            /* [time, amplitude px] */
  const PUNCH = [];             /* [time, amount] - a quick push in on a hit */
  const C = { x: 0, y: 0, w: 1080, s: 1, cx: 540, cy: 675 };
  function camAt(t, tr) {
    let r = WIDE;
    for (const k of CAM) {
      if (t >= k.t1) { r = k.b; continue; }
      if (t <= k.t0) { r = k.a; break; }
      let u = (t - k.t0) / (k.t1 - k.t0);
      u = u * u * u * (u * (6 * u - 15) + 10);
      const wa = k.a[2], wb = k.b[2];
      let w = Math.exp(lerp(Math.log(wa), Math.log(wb), u)) * (1 + k.dip * sin(PI * u));
      w = Math.min(w, 1080);
      const ca = [k.a[0] + wa / 2, k.a[1] + wa * 0.625], cb = [k.b[0] + wb / 2, k.b[1] + wb * 0.625];
      const cx = lerp(ca[0], cb[0], u), cy = lerp(ca[1], cb[1], u);
      r = [cx - w / 2, cy - w * 0.625, w];
      break;
    }
    /* web copy: a page may ask for a fixed view [x, y, width] instead of the film's own camera */
    if (window.__view) r = window.__view;
    /* the camera is held by hand: it floats a little when it is close */
    const zf = sat((1 - r[2] / 1080) * 3);
    let w = r[2] * (1 + 0.005 * zf * sin(tr * 0.9));
    for (const [pt, amt] of PUNCH) { const d = tr - pt; if (d >= 0 && d < 0.9) w *= 1 - amt * Math.exp(-6.5 * d) * sat(d / 0.04); }
    let cx = r[0] + r[2] / 2 + noise(tr * 0.33, 3) * r[2] * 0.007 * zf, cy = r[1] + r[2] * 0.625 + noise(tr * 0.29, 8) * r[2] * 0.007 * zf;
    w = Math.min(w, 1080);
    let x = clamp(cx - w / 2, 0, WORLD_W - w), y = clamp(cy - w * 0.625, 0, 1350 - w * 1.25);
    let sx = 0, sy = 0;
    for (const [st, amp] of SHAKES) {
      const d = tr - st;
      if (d >= 0 && d < 0.6) { const e = amp * Math.exp(-8 * d); sx += e * sin(d * 71); sy += e * cos(d * 59); }
    }
    C.w = w; C.s = 1080 / w; C.x = x + sx / C.s; C.y = y + sy / C.s; C.cx = C.x + w / 2; C.cy = C.y + w * 0.625;
    TR(cam, "translate(" + f1(-C.x * C.s) + " " + f1(-C.y * C.s) + ") scale(" + Math.round(C.s * 1000) / 1000 + ")");
  }
  const scr = (p) => [(p[0] - C.x) * C.s, (p[1] - C.y) * C.s];
  const inView = (x, y, m) => x > C.x - m && x < C.x + C.w + m && y > C.y - m && y < C.y + C.w * 1.25 + m;

  /* ================================================================= world state */
  const Wd = { night: 0, road: 0, lampUp: 0, lampOn: 0, cage: 0, bars: 0, trail: 1, spawn: 0, sunAbs: 0, sax: 1540, say: 404 };
  const sunE = $("sun"), moonE = $("moon"), starsE = $("stars"), clouds = qa(cam, ".cloud"), reeds = qa(cam, ".reed"), wplants = qa(cam, ".wplant");
  const lampP = $("lampP"), lampG = $("lampG"), bulb = $("bulb"), coneP = $("coneP"), halo = $("halo"), poolE = $("poolE"), roadclip = $("roadclipr"), roll = $("roll");
  const LAMPHITS = [];
  const N0 = K.N0, N1 = K.N1;
  to(Wd, N0, 1.0, { night: 1 }, "sine.inOut");
  to(Wd, N1, 0.9, { night: 0 }, "sine.inOut");
  to(Wd, B[2] + 0.12, 0.5, { lampUp: 1 }, "back.out(2.2)");
  [[0.6, 1], [0.67, 0.15], [0.76, 1], [0.82, 0.3], [0.9, 1]].forEach(([dt, v]) => set(Wd, B[2] + dt, { lampOn: v }));
  to(Wd, N1 + 0.3, 0.3, { lampOn: 0 }, "none");
  to(Wd, T[2] + 0.1, 0.7, { road: 1 }, "power1.inOut");
  const par = { sx: 0, sy: 0 };
  const twk = qa(starsE, "circle").filter((e, i) => i % 6 === 0).map((e, i) => ({ e, o: +e.getAttribute("opacity"), p: i * 1.9 }));
  const tws = qa(cam, ".tw").map((e) => ({ e, x: +e.dataset.x, y: +e.dataset.y, sx: e.dataset.sx, sy: e.dataset.sy, p: +e.dataset.p, k: +e.dataset.k, done: 0 }));
  const cbs = qa(cam, ".cb").map((e) => ({ e, p: +e.dataset.p }));
  const wvs = qa(cam, ".wv"), shafts = qa(cam, ".shaft");
  const lily = $("lily");
  const bends = [];             /* [x, y, radius, fn -> strength] grass leans away from what walks through it */
  draws.push((t) => {
    const n = Wd.night;
    palApply(n);
    /* depth: the sky and the far hills move less than the ground when the camera travels */
    par.sx = (C.cx - 540) * 0.2; par.sy = (C.cy - 675) * 0.1;
    TR(L.sky, "translate(" + f1(par.sx) + " " + f1(par.sy) + ")");
    TR(L.hills, "translate(" + f1(par.sx * 0.45) + " " + f1(par.sy * 0.4) + ")");
    /* in the east the sun is placed by hand (Wd.sax, Wd.say are world points) */
    place(sunE, lerp(650 + n * 60, Wd.sax - par.sx, Wd.sunAbs), lerp(lerp(168, 660, ss(n * 1.15)), Wd.say - par.sy, Wd.sunAbs), t * 4, 1);
    place(moonE, 520, lerp(700, 330, ss(n * 1.1 - 0.1)), -12, 1);
    OP(starsE, ss(n * 1.6 - 0.6));
    if (n > 0.3) twk.forEach((s) => OP(s.e, s.o * (0.55 + 0.45 * sin(t * 3.1 + s.p))));
    clouds.forEach((c, i) => { place(c, +c.dataset.x + t * (3 + i * 1.6), +c.dataset.y, 0, +c.dataset.s); });
    reeds.forEach((r) => place(r, +r.dataset.x, +r.dataset.y, sin(t * 1.3 + +r.dataset.p) * 4 + sin(t * 0.5) * 2, 1));
    wplants.forEach((r) => place(r, +r.dataset.x, 1322, sin(t * 0.9 + +r.dataset.p) * 5, +r.dataset.s));
    /* wind in the grass */
    for (const w of tws) {
      if (w.done && !inView(w.x, w.y, 30)) continue;
      w.done = 1;
      let a = (sin(t * 1.5 - w.x * 0.011 + w.p) * 3.4 + sin(t * 0.62 - w.x * 0.004) * 2.6) * w.k;
      for (const b of bends) { const dx = w.x - b[0](), dy = w.y - b[1](), d2 = dx * dx + dy * dy, r = b[2]; if (d2 < r * r) a += (dx < 0 ? -1 : 1) * 26 * (1 - Math.sqrt(d2) / r) * b[3](); }
      TR(w.e, "translate(" + w.x + " " + w.y + ") rotate(" + f1(a) + ") scale(" + w.sx + " " + w.sy + ")");
    }
    if (inView(240, 380, 260)) cbs.forEach((c) => TR(c.e, "translate(" + f1(sin(t * 0.8 + c.p) * 2.6) + " " + f1(cos(t * 0.63 + c.p * 1.7) * 1.8) + ")"));
    /* the stream */
    const wx = ((t * 13) % 60) - 30, wy = sin(t * 1.1) * 1.4;
    wvs.forEach((e) => TR(e, "translate(" + f1(wx) + " " + f1(wy) + ")"));
    shafts.forEach((e) => { TR(e, "skewX(" + f1(sin(t * 0.5 + +e.dataset.p) * 5) + ")"); OP(e, (0.045 + 0.03 * sin(t * 0.8 + +e.dataset.p * 2)) * +e.dataset.o * (1 - n * 0.8)); });
    TR(lily, "translate(0 " + f1(sin(t * 1.4) * 0.8) + ")");
    /* lamp */
    const up = Wd.lampUp;
    OP(lampG, up > 0.01 ? 1 : 0);
    TR(lampP, "translate(" + P.lamp[0] + " " + P.lamp[1] + ") rotate(" + f1(wobble(t, LAMPHITS, 5, 19, 3.2) + (1 - up) * 6) + ") scale(" + f1(lerp(0.6, 1, up) * 100) / 100 + " " + Math.round(up * 1000) / 1000 + ") translate(" + -P.lamp[0] + " " + -P.lamp[1] + ")");
    const on = Wd.lampOn, fl = on * (0.94 + 0.06 * sin(t * 43));
    SA(bulb, "fill", on > 0.5 ? "#FFF3C4" : "#8C8C9A");
    OP(coneP, fl * 0.2 * n); OP(halo, fl * 0.5 * n); OP(poolE, fl * 0.5 * n);
    /* road rolling out */
    const rw = Wd.road * 1140;
    SA(roadclip, "width", f1(rw));
    place(roll, -20 + rw, (P.roadY[0] + P.roadY[1]) / 2, 0, 1);
    OP(roll, Wd.road > 0.001 && Wd.road < 0.999 ? 1 : 0);
    OP(E.road, Wd.road > 0.999 ? 1 : 0);
  });

  /* ================================================================= small effect systems */
  const fx = L.fx, actors = L.actors, aqua = $("aqua");
  /* paper scraps thrown by an impact. o.fill gives round drops in one colour. */
  function burst(parent, t0, x, y, n, seed, o) {
    const R = rng(seed), ps = [];
    const cols = o.cols || ["cream"];
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = lerp(o.a0, o.a1, R()), v = lerp(o.v0, o.v1, R());
      ps.push({ vx: cos(a) * v, vy: sin(a) * v, sp: (R() - 0.5) * 1400, gy: y + lerp(o.g0 || 0, o.g1 || 0, R()), ph: R() * 6 });
      const c = cols[Math.floor(R() * cols.length)], k = R();
      s += o.fill ? '<path fill="' + o.fill + '" stroke="#22202E" stroke-width="1.2" d="M0,-6 Q5,1 0,4.5 Q-5,1 0,-6 Z"/>'
        : k < 0.5 ? '<rect x="-4" y="-2.5" width="' + f1(6 + R() * 5) + '" height="' + f1(3 + R() * 3) + '" class="f-' + c + '"/>' : '<path class="f-' + c + '" d="M-4,3 L0,-5 L5,3 Z"/>';
    }
    const g = G(s, parent, "burst");
    const els = Array.from(g.children);
    const grav = o.grav || 900;
    OP(g, 0);
    draws.push((t) => {
      const d = t - t0;
      if (d < 0 || (o.life && d > o.life)) { OP(g, 0); return; }
      OP(g, o.fade ? sat(1 - (d - o.fade) / 0.4) : 1);
      ps.forEach((p, i) => {
        let px = x + p.vx * d, py = y + p.vy * d + 0.5 * grav * d * d, r = o.fill ? Math.atan2(p.vy + grav * d, p.vx) * 57.3 - 90 : p.ph * 57 + p.sp * d;
        if (!o.nog && py > p.gy && p.vy * d + 0.5 * grav * d * d > 0) {
          const A = 0.5 * grav, Bq = p.vy, Cq = y - p.gy;
          const tl_ = (-Bq + Math.sqrt(Math.max(0, Bq * Bq - 4 * A * Cq))) / (2 * A);
          px = x + p.vx * tl_; py = p.gy; r = p.ph * 57 + p.sp * tl_;
          if (o.sink) { OP(els[i], 0); return; }
        }
        OP(els[i], 1);
        place(els[i], px, py, r, o.s || 1);
      });
    });
  }
  /* impact stars */
  function pow(parent, t0, x, y, s, r) {
    const g = makePow(parent);
    OP(g, 0);
    draws.push((t) => {
      const d = t - t0;
      if (d < 0 || d > 0.3) { OP(g, 0); return; }
      OP(g, d < 0.2 ? 1 : 1 - (d - 0.2) / 0.1);
      place(g, x, y, (r || 0) + d * 60, s * (0.5 + 1.6 * Math.sqrt(d / 0.3)));
    });
  }
  /* a puff: paper circles that swell and are gone. Dust, bubbles, exhaust. */
  function puff(parent, t0, x, y, o) {
    o = o || {};
    const n = o.n || 5, R = rng(o.seed || 7), life = o.life || 0.55, ps = [];
    let s = "";
    for (let i = 0; i < n; i++) {
      ps.push({ a: lerp(o.a0 === undefined ? -PI : o.a0, o.a1 === undefined ? 0 : o.a1, R()), v: (o.v || 34) * (0.45 + R()), d: R() * life * 0.25 });
      s += o.ring ? '<circle r="' + f1((o.r || 6) * (0.6 + R() * 0.8)) + '" fill="none" class="s-' + (o.cls || "foam") + '" stroke-width="1.8"/>' : '<circle r="' + f1((o.r || 6) * (0.6 + R() * 0.8)) + '" class="f-' + (o.cls || "cream") + '"/>';
    }
    const g = G(s, parent, "puff"), els = Array.from(g.children);
    OP(g, 0);
    draws.push((t) => {
      const d = t - t0;
      if (d < 0 || d > life * 1.25) { OP(g, 0); return; }
      OP(g, o.op || 0.9);
      let X = typeof x === "function" ? x() : x, Y = typeof y === "function" ? y() : y;
      if (Array.isArray(X)) { Y = X[1]; X = X[0]; }
      ps.forEach((p, i) => {
        const u = sat((d - p.d) / life), e = 1 - (1 - u) * (1 - u);
        place(els[i], X + cos(p.a) * p.v * e, Y + sin(p.a) * p.v * e - (o.rise || 0) * u, 0, u <= 0 ? 0 : (0.35 + 0.95 * e) * (1 - u * u * u));
      });
    });
  }
  /* a ring on water */
  function ring(parent, t0, x, y, o) {
    o = o || {};
    const life = o.life || 0.9, g = G('<ellipse fill="none" class="s-foam" stroke-width="2.4"/>', parent, "ring"), e = g.firstChild;
    OP(g, 0);
    draws.push((t) => {
      const d = t - t0;
      if (d < 0 || d > life) { OP(g, 0); return; }
      const u = d / life, r = lerp(o.r0 || 6, o.r1 || 46, 1 - (1 - u) * (1 - u));
      OP(g, (1 - u) * (o.op || 0.9));
      SA(e, "cx", f1(x)); SA(e, "cy", f1(y)); SA(e, "rx", f1(r)); SA(e, "ry", f1(r * (o.k || 0.36)));
    });
  }
  /* a paper mark over a head: "!", "?", an anger vein, a drop. pos is a point or a function. */
  function mark(parent, t0, pos, kind, o) {
    o = o || {};
    const g = makeMark(parent, kind), dur = o.dur || 0.6, s = o.s || 1;
    OP(g, 0);
    draws.push((t) => {
      const d = t - t0;
      if (d < 0 || d > dur) { OP(g, 0); return; }
      const p = typeof pos === "function" ? pos() : pos;
      const u = sat(d / 0.16), popv = u < 1 ? (1 - (1 - u) * (1 - u)) * (1 + 0.45 * (1 - u)) : 1, out = d > dur - 0.1 ? (dur - d) / 0.1 : 1;
      OP(g, 1);
      place(g, p[0], p[1], (o.r || 0) + sin(d * 30) * (kind === "vein" ? 0 : 4) * (1 - u), s * Math.max(0.01, popv * out) * (kind === "vein" ? 1 + 0.15 * sin(d * 34) : 1));
    });
  }
  /* bubbles rising in the stream */
  (function () {
    const R = rng(3);
    let s = "";
    const bs = [];
    for (let i = 0; i < 16; i++) { bs.push({ x: 40 + R() * 1000, p: R() * 5, sp: 26 + R() * 30, r: 2.2 + R() * 3.2 }); s += '<circle r="' + f1(bs[i].r) + '" fill="none" class="s-foam" stroke-width="1.8" opacity="0.8"/>'; }
    const g = G(s, aqua, "bubbles");
    const els = Array.from(g.children);
    draws.push((t) => bs.forEach((b, i) => {
      const u = ((t * b.sp / 240 + b.p) % 1 + 1) % 1;
      place(els[i], b.x + sin(u * 12 + b.p) * 6, 1300 - u * 240, 0, 0.6 + 0.5 * u);
      OP(els[i], u < 0.92 ? 0.8 : 0);
    }));
    /* specks drifting in the water */
    let m = "";
    const ms = [];
    for (let i = 0; i < 26; i++) { ms.push({ x: R() * 1080, y: 1080 + R() * 220, p: R() * 6, v: 4 + R() * 9 }); m += '<circle r="' + f1(1 + R() * 1.4) + '" fill="#FFFBEF" opacity="' + f1(0.25 + R() * 0.3) + '"/>'; }
    const mg = G(m, aqua, "specks"), mel = Array.from(mg.children);
    draws.push((t) => ms.forEach((s_, i) => place(mel[i], ((s_.x + t * s_.v) % 1100) - 10, s_.y + sin(t * 0.7 + s_.p) * 8, 0, 1)));
  })();
  /* seeds on the air by day, and a leaf now and then from the tree */
  (function () {
    const R = rng(17);
    let s = "";
    const ms = [];
    for (let i = 0; i < 16; i++) { ms.push({ x: R() * 1080, y: 560 + R() * 400, p: R() * 6, v: 9 + R() * 14 }); s += '<g><circle r="' + f1(1.6 + R() * 1.4) + '" fill="#FFFBEF" opacity="0.8"/><path stroke="#FFFBEF" stroke-width="0.8" opacity="0.6" d="M0,0 l0,5"/></g>'; }
    const g = G(s, fx, "seeds"), els = Array.from(g.children);
    let lf = "";
    const ls = [];
    for (let i = 0; i < 5; i++) { ls.push({ x: 60 + R() * 380, p: R() * 6, per: 5 + R() * 4, off: R() * 9 }); lf += '<path class="f-' + (i % 2 ? "leaf2" : "leaf1") + '" d="M0,0 q7,-9 16,0 q-9,8 -16,0 Z"/>'; }
    const lg = G(lf, fx, "leaves"), lel = Array.from(lg.children);
    draws.push((t) => {
      const day = 1 - Wd.night;
      OP(g, day * 0.9);
      ms.forEach((m, i) => place(els[i], ((m.x + t * m.v) % 1120) - 20, m.y + sin(t * 0.6 + m.p) * 14 - t * 1.5 % 40, sin(t + m.p) * 20, 1));
      lel.forEach((e, i) => {
        const l = ls[i], u = (((t + l.off) / l.per) % 1 + 1) % 1;
        OP(e, u < 0.06 ? u / 0.06 : u > 0.9 ? (1 - u) / 0.1 : 1);
        place(e, l.x + sin(u * 9 + l.p) * 26 + u * 40, 300 + u * 250, sin(u * 14 + l.p) * 70, 0.9);
      });
    });
  })();

  return { $, cam, L, E, P, main, to, set, hop, face, draws, F, B, T, M, STOPS, warp, cut, SHAKES, PUNCH, C, camAt, scr, inView, Wd, LAMPHITS, par, bends,
    fx, actors, aqua, burst, pow, puff, ring, mark, after: [], A: {} };
})();
