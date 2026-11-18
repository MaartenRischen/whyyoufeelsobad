/* stage.js - the timeline helpers, the one camera, the sea's own life, the tank parts, and the small effects.
   Same engine as the ADHD film (coded/js/stage.js); only the world is another one.
   seq_orca.js builds on what this returns. */
const ST = (function () {
  gsap.defaults({ lazy: false, overwrite: false });
  const $ = (id) => document.getElementById(id);
  const cam = $("cam");
  $("palcss").textContent = palCSS();
  const L = buildSea(cam);
  const WY = SEA.wy, FL = SEA.floor, [TX0, TX1, TFL] = SEA.tank;
  /* `main` holds every tween. It is stepped by hand from draw(), in world time. */
  const main = gsap.timeline({ paused: true });
  const to = (o, t, d, v, e) => main.to(o, Object.assign({ duration: d, ease: e || "power2.inOut" }, v), t);
  const set = (o, t, v) => main.set(o, v, t);
  const face = (o, t, d, name, extra, e) => to(o, t, d, Object.assign({}, FACE[name], extra || {}), e || "power2.out");
  const draws = [];

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

  /* ================================================================= camera: [x, y, width]; the frame is 4:5 */
  const WIDE = [0, 0, 1080];
  const CAM = [];
  let _last = WIDE;
  const cut = (t0, t1, v, dip) => { CAM.push({ t0, t1, a: _last, b: v, dip: dip || 0 }); _last = v; };
  const SHAKES = [];            /* [time, amplitude px] */
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
    /* a page may fix the camera: window.__view = [x, y, width] */
    if (window.__view) r = window.__view;
    /* the camera is held by hand: it floats a little when it is close */
    const zf = sat((1 - r[2] / 1080) * 3);
    let w = r[2] * (1 + 0.005 * zf * sin(tr * 0.9));
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
  /* pool: the colour of the water, 0 sea .. 1 tank. floor, wallR, wallL, back: the parts, 0 away .. 1 in place. */
  const Wd = { pool: 0, floor: 0, wallR: 0, wallL: 0, back: 0, tiles: 0, kelp: 1 };
  const clouds = qa(cam, ".cloud"), kelps = qa(cam, ".kelp").map((e) => ({ e, x: +e.dataset.x, s: +e.dataset.s, p: +e.dataset.p, k: +e.dataset.k }));
  const wvs = qa(cam, ".wv"), shafts = qa(cam, ".shaft").map((e) => ({ e, p: +e.dataset.p, o: +e.dataset.o }));
  const slabF = $("slabF"), slabR = $("slabR"), slabL = $("slabL"), tback = $("tback"), ttiles = $("ttiles"), kelpG = $("kelpG");
  const drop = (g, k, dist) => { OP(g, k > 0.001 ? 1 : 0); TR(g, "translate(0 " + f1(-(1 - k) * dist) + ")"); };
  draws.push((t) => {
    palApply(Wd.pool);
    /* depth: the sky and the islands move less than the water when the camera travels */
    TR(L.sky, "translate(" + f1(C.x * 0.8) + " 0)");
    TR(L.isl, "translate(" + f1(C.x * 0.55) + " 0)");
    clouds.forEach((c, i) => place(c, +c.dataset.x + t * (3 + i * 1.6), +c.dataset.y, 0, +c.dataset.s));
    /* kelp in the current; it goes down into the floor when the floor comes */
    OP(kelpG, Wd.kelp > 0.01 ? 1 : 0);
    if (Wd.kelp > 0.01) for (const k of kelps) { place(k.e, k.x, FL + 12, (sin(t * 0.9 + k.p) * 5 + sin(t * 0.37 + k.p * 2) * 3) * k.k, k.s, k.s * Wd.kelp); }
    /* the water line, and the light that comes down through it */
    const calm = 1 - 0.6 * Wd.pool;
    const wx = ((t * 13) % 60) - 30, wy = sin(t * 1.1) * 1.6 * calm;
    wvs.forEach((e) => TR(e, "translate(" + f1(wx) + " " + f1(wy) + ")"));
    shafts.forEach((s) => { TR(s.e, "skewX(" + f1(sin(t * 0.5 + s.p) * 5) + ")"); OP(s.e, (0.055 + 0.03 * sin(t * 0.8 + s.p * 2)) * s.o * (1 - 0.45 * Wd.pool)); });
    /* the tank */
    OP(slabF, Wd.floor > 0.001 ? 1 : 0); TR(slabF, "translate(0 " + f1((1 - Wd.floor) * 250) + ")");
    drop(slabR, Wd.wallR, 1200); drop(slabL, Wd.wallL, 1200);
    OP(tback, Wd.back > 0.001 ? 1 : 0); TR(tback, "translate(0 " + f1((1 - Wd.back) * 215) + ")");
    OP(ttiles, Wd.tiles);
  });

  /* ================================================================= small effect systems */
  const fx = L.fx, aqua = L.aqua, splash = $("splash");
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
        if (py > p.gy && p.vy * d + 0.5 * grav * d * d > 0) { OP(els[i], 0); return; }
        OP(els[i], 1);
        place(els[i], px, py, r, o.s || 1);
      });
    });
  }
  /* a puff: paper circles that swell and are gone. Breath, bubbles. x and y may be functions. */
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
  /* a ring on the water */
  function ring(parent, t0, x, y, o) {
    o = o || {};
    const life = o.life || 0.9, g = G('<ellipse fill="none" class="s-foam" stroke-width="2.4"/>', parent, "ring"), e = g.firstChild;
    OP(g, 0);
    draws.push((t) => {
      const d = t - t0;
      if (d < 0 || d > life) { OP(g, 0); return; }
      const u = d / life, r = lerp(o.r0 || 6, o.r1 || 46, 1 - (1 - u) * (1 - u));
      OP(g, (1 - u) * (o.op || 0.9));
      const X = typeof x === "function" ? x() : x;
      SA(e, "cx", f1(X)); SA(e, "cy", f1(y)); SA(e, "rx", f1(r)); SA(e, "ry", f1(r * (o.k || 0.2)));
    });
  }
  /* a call: sound drawn as paper arcs that leave a point and travel. pos is a point or a function.
     o.dirs: [1] right, [-1] left, [1, -1] both. o.a: half the opening in radians. o.v: px a second.
     In the tank the parent is clipped to the water, so a call ends at the wall. */
  function call(parent, t0, pos, o) {
    o = o || {};
    const n = o.n || 3, dirs = o.dirs || [1], gap = o.gap || 0.1, life = o.life || 1.5, v = o.v || 520, r0 = o.r0 || 40, a = o.a || 0.62, w = o.w || 5, op = o.op || 0.9;
    let s = "";
    for (let i = 0; i < n * dirs.length; i++) s += '<path fill="none" stroke="#FFF8E2" stroke-width="' + w + '" stroke-linecap="round"/>';
    const g = G(s, parent, "call"), els = Array.from(g.children);
    OP(g, 0);
    draws.push((t) => {
      const d = t - t0;
      if (d < 0 || d > life + n * gap) { OP(g, 0); return; }
      OP(g, 1);
      const p = typeof pos === "function" ? pos() : pos;
      dirs.forEach((dir, j) => {
        for (let i = 0; i < n; i++) {
          const e = els[j * n + i], age = d - i * gap;
          if (age < 0 || age > life) { OP(e, 0); continue; }
          const r = r0 + v * age, c = dir > 0 ? 0 : PI, k = (j === 0 ? 1 : (o.back || 0.6));
          OP(e, op * k * sat(age / 0.06) * Math.pow(1 - age / life, o.pw || 1.1));
          SA(e, "d", "M" + f1(p[0] + r * cos(c - a)) + "," + f1(p[1] + r * sin(c - a)) + " A" + f1(r) + "," + f1(r) + " 0 0 1 " + f1(p[0] + r * cos(c + a)) + "," + f1(p[1] + r * sin(c + a)));
        }
      });
    });
  }
  /* bubbles rising, and specks drifting in the water. The tank is filtered: fewer of both. */
  (function () {
    const R = rng(3);
    let s = "";
    const bs = [];
    for (let i = 0; i < 26; i++) { bs.push({ x: 30 + R() * (WORLD_W - 60), p: R() * 5, sp: 26 + R() * 30, r: 2.2 + R() * 3.4 }); s += '<circle r="' + f1(bs[i].r) + '" fill="none" class="s-foam" stroke-width="1.8" opacity="0.8"/>'; }
    const g = G(s, fx, "bubbles");
    const els = Array.from(g.children);
    let m = "";
    const ms = [];
    for (let i = 0; i < 60; i++) { ms.push({ x: R() * WORLD_W, y: WY + 60 + R() * (FL - WY - 90), p: R() * 6, v: 4 + R() * 9 }); m += '<circle r="' + f1(1 + R() * 1.6) + '" fill="#FFFBEF" opacity="' + f1(0.22 + R() * 0.3) + '"/>'; }
    const mg = G(m, fx, "specks"), mel = Array.from(mg.children);
    draws.push((t) => {
      const sea = 1 - Wd.pool;
      OP(g, 0.25 + 0.75 * sea); OP(mg, 0.15 + 0.85 * sea);
      const bot = lerp(FL, TFL, Wd.floor);
      /* every one is placed on every frame, in view or not: nothing may be left over from another moment */
      bs.forEach((b, i) => {
        const u = ((t * b.sp / 700 + b.p) % 1 + 1) % 1;
        place(els[i], b.x + sin(u * 12 + b.p) * 6, bot - 10 - u * (bot - WY - 20), 0, 0.6 + 0.5 * u);
        OP(els[i], u < 0.95 ? 0.8 : 0);
      });
      ms.forEach((s_, i) => place(mel[i], (s_.x + t * s_.v) % WORLD_W, s_.y + sin(t * 0.7 + s_.p) * 8, 0, 1));
    });
  })();
  /* the tank's water is the only place a call can go once the walls are down */
  const tankfx = G('<clipPath id="tankclip"><rect x="' + TX0 + '" y="' + (WY + 2) + '" width="' + (TX1 - TX0) + '" height="' + (TFL - WY - 2) + '"/></clipPath><g id="tankcalls" clip-path="url(#tankclip)"></g>', fx);

  return { $, cam, L, main, to, set, face, draws, STOPS, warp, cut, SHAKES, C, camAt, scr, inView, Wd,
    fx, aqua, splash, tankcalls: $("tankcalls"), burst, puff, ring, call, after: [], A: {} };
})();
