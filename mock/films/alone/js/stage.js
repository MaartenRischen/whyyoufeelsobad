/* stage.js - the timeline helpers, the one camera, the world's own life, and the small effects.
   The sequence (seq_alone.js) builds on what this returns. From ADHD v9's stage.js, without the animals. */
const ST = (function () {
  gsap.defaults({ lazy: false, overwrite: false });
  const $ = (id) => document.getElementById(id);
  const cam = $("cam");
  $("palcss").textContent = palCSS();
  const { L, E } = buildWorld(cam);
  /* `main` holds every tween. It is stepped by hand from draw(), in film time. */
  const main = gsap.timeline({ paused: true });
  const to = (o, t, d, v, e) => main.to(o, Object.assign({ duration: d, ease: e || "power2.inOut" }, v), t);
  const set = (o, t, v) => main.set(o, v, t);
  const hop = (o, t, d, hgt, k) => { k = k || "h"; to(o, t, d * 0.5, { [k]: hgt }, "power2.out"); to(o, t + d * 0.5, d * 0.5, { [k]: 0 }, "power2.in"); };
  const face = (o, t, d, name, extra, e) => to(o, t, d, Object.assign({}, FACE[name], extra || {}), e || "power2.out");
  const draws = [];

  /* ================================================================= camera */
  const V0 = [1380, 330, 740];
  const CAM = [];
  let _last = V0;
  const cut = (t0, t1, v, dip) => { CAM.push({ t0, t1, a: _last, b: v, dip: dip || 0 }); _last = v; };
  const SHAKES = [];            /* [time, amplitude px] */
  const C = { x: 0, y: 0, w: 1080, s: 1, cx: 540, cy: 675 };
  function camAt(t) {
    let r = V0;
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
    let w = r[2] * (1 + 0.004 * zf * sin(t * 0.9));
    let cx = r[0] + r[2] / 2 + noise(t * 0.33, 3) * r[2] * 0.005 * zf, cy = r[1] + r[2] * 0.625 + noise(t * 0.29, 8) * r[2] * 0.005 * zf;
    w = Math.min(w, 1080);
    let x = clamp(cx - w / 2, 920, WORLD_W - w), y = clamp(cy - w * 0.625, 0, 1350 - w * 1.25);
    let sx = 0, sy = 0;
    for (const [st, amp] of SHAKES) {
      const d = t - st;
      if (d >= 0 && d < 0.6) { const e = amp * Math.exp(-8 * d); sx += e * sin(d * 71); sy += e * cos(d * 59); }
    }
    C.w = w; C.s = 1080 / w; C.x = x + sx / C.s; C.y = y + sy / C.s; C.cx = C.x + w / 2; C.cy = C.y + w * 0.625;
    TR(cam, "translate(" + f1(-C.x * C.s) + " " + f1(-C.y * C.s) + ") scale(" + Math.round(C.s * 1000) / 1000 + ")");
  }
  const scr = (p) => [(p[0] - C.x) * C.s, (p[1] - C.y) * C.s];
  const inView = (x, y, m) => x > C.x - m && x < C.x + C.w + m && y > C.y - m && y < C.y + C.w * 1.25 + m;

  /* ================================================================= world state */
  /* night: the hour outside. lit: the night value of what stands in fire or lamp light.
     sx, sy and mx, my: the sun and the moon, as world points. */
  const Wd = { night: 0, lit: 0, sx: 1470, sy: 396, mx: 1668, my: 600 };
  const sunE = $("sun"), moonE = $("moon"), starsE = $("stars"), clouds = qa(cam, ".cloud"), wplants = qa(cam, ".wplant");
  const par = { sx: 0, sy: 0 };
  const twk = qa(starsE, "circle").filter((e, i) => i % 5 === 0).map((e, i) => ({ e, o: +e.getAttribute("opacity"), p: i * 1.9 }));
  const tws = qa(cam, ".tw").map((e) => ({ e, x: +e.dataset.x, y: +e.dataset.y, sx: e.dataset.sx, sy: e.dataset.sy, p: +e.dataset.p, k: +e.dataset.k }));
  const cbe = qa(cam, ".cbe").map((e) => ({ e, p: +e.dataset.p }));
  const wvs = qa(cam, ".wv"), shafts = qa(cam, ".shaft");
  draws.push((t) => {
    const n = Wd.night;
    palApply(n, Wd.lit);
    /* depth: the sky and the far hills move less than the ground when the camera travels */
    par.sx = (C.cx - 540) * 0.2; par.sy = (C.cy - 675) * 0.1;
    TR(L.sky, "translate(" + f1(par.sx) + " " + f1(par.sy) + ")");
    TR(L.hills, "translate(" + f1(par.sx * 0.45) + " " + f1(par.sy * 0.4) + ")");
    place(sunE, Wd.sx - par.sx, Wd.sy - par.sy, t * 4, 1);
    place(moonE, Wd.mx - par.sx, Wd.my - par.sy, -12, 1);
    const so = ss(n * 2.2 - 0.5);
    OP(starsE, so);
    if (so > 0.05) twk.forEach((s) => OP(s.e, s.o * (0.55 + 0.45 * sin(t * 3.1 + s.p))));
    clouds.forEach((c, i) => { place(c, +c.dataset.x + t * (3 + i * 1.6), +c.dataset.y, 0, +c.dataset.s); });
    wplants.forEach((r) => place(r, +r.dataset.x, 1322, sin(t * 0.9 + +r.dataset.p) * 5, +r.dataset.s));
    /* wind in the grass, only where the camera looks */
    for (const w of tws) {
      if (w.done && !inView(w.x, w.y, 110)) continue;     /* 110: a leaning tuft just outside the frame still reaches into it */
      w.done = 1;
      const a = (sin(t * 1.5 - w.x * 0.011 + w.p) * 3.4 + sin(t * 0.62 - w.x * 0.004) * 2.6) * w.k;
      TR(w.e, "translate(" + w.x + " " + w.y + ") rotate(" + f1(a) + ") scale(" + w.sx + " " + w.sy + ")");
    }
    cbe.forEach((c) => TR(c.e, "translate(" + f1(sin(t * 0.8 + c.p) * 2.6) + " " + f1(cos(t * 0.63 + c.p * 1.7) * 1.8) + ")"));
    /* the stream */
    const wx = ((t * 13) % 60) - 30, wy = sin(t * 1.1) * 1.4;
    wvs.forEach((e) => TR(e, "translate(" + f1(wx) + " " + f1(wy) + ")"));
    shafts.forEach((e) => { TR(e, "skewX(" + f1(sin(t * 0.5 + +e.dataset.p) * 5) + ")"); OP(e, (0.045 + 0.03 * sin(t * 0.8 + +e.dataset.p * 2)) * +e.dataset.o * (1 - n * 0.8)); });
  });

  /* ================================================================= small effect systems */
  const fx = L.fx;
  /* a puff: paper circles that swell and are gone. Dust, sparks. */
  function puff(parent, t0, x, y, o) {
    o = o || {};
    const n = o.n || 5, R = rng(o.seed || 7), life = o.life || 0.55, ps = [];
    let s = "";
    for (let i = 0; i < n; i++) {
      ps.push({ a: lerp(o.a0 === undefined ? -PI : o.a0, o.a1 === undefined ? 0 : o.a1, R()), v: (o.v || 34) * (0.45 + R()), d: R() * life * 0.25 });
      s += '<circle r="' + f1((o.r || 6) * (0.6 + R() * 0.8)) + '" ' + (o.fill ? 'fill="' + o.fill + '"' : 'class="f-' + (o.cls || "cream") + '"') + "/>";
    }
    const g = G(s, parent, "puff"), els = Array.from(g.children);
    OP(g, 0);
    draws.push((t) => {
      const d = t - t0;
      if (d < 0 || d > life * 1.25) { OP(g, 0); return; }
      OP(g, o.op || 0.9);
      ps.forEach((p, i) => {
        const u = sat((d - p.d) / life), e = 1 - (1 - u) * (1 - u);
        place(els[i], x + cos(p.a) * p.v * e, y + sin(p.a) * p.v * e - (o.rise || 0) * u, 0, u <= 0 ? 0 : (0.35 + 0.95 * e) * (1 - u * u * u));
      });
    });
  }
  /* seeds on the air by day, and a leaf now and then from the tree */
  (function () {
    const R = rng(17);
    let s = "";
    const ms = [];
    for (let i = 0; i < 14; i++) { ms.push({ x: R() * 1080, y: 560 + R() * 400, p: R() * 6, v: 9 + R() * 14 }); s += '<g><circle r="' + f1(1.6 + R() * 1.4) + '" fill="#FFFBEF" opacity="0.8"/><path stroke="#FFFBEF" stroke-width="0.8" opacity="0.6" d="M0,0 l0,5"/></g>'; }
    const g = G(s, E.tree, "seeds"), els = Array.from(g.children);
    let lf = "";
    const ls = [];
    for (let i = 0; i < 4; i++) { ls.push({ x: 1800 + R() * 300, p: R() * 6, per: 5 + R() * 4, off: R() * 9 }); lf += '<path class="f-' + (i % 2 ? "leaf2" : "leaf1") + '" d="M0,0 q7,-9 16,0 q-9,8 -16,0 Z"/>'; }
    const lg = G(lf, E.tree, "leaves"), lel = Array.from(lg.children);
    draws.push((t) => {
      OP(g, (1 - Wd.night) * 0.9);
      ms.forEach((m, i) => place(els[i], 960 + ((m.x * 1.2 + t * m.v) % 1260) - 20, m.y + sin(t * 0.6 + m.p) * 14 - t * 1.5 % 40, sin(t + m.p) * 20, 1));
      lel.forEach((e, i) => {
        const l = ls[i], u = (((t + l.off) / l.per) % 1 + 1) % 1;
        OP(e, u < 0.06 ? u / 0.06 : u > 0.9 ? (1 - u) / 0.1 : 1);
        place(e, l.x + sin(u * 9 + l.p) * 26 + u * 40, 560 + u * 300, sin(u * 14 + l.p) * 70, 0.9);
      });
    });
  })();

  return { $, cam, L, E, main, to, set, hop, face, draws, cut, SHAKES, C, camAt, scr, inView, Wd, par, fx, puff, after: [], A: {} };
})();
