/* finale.js - the feeling (light from the human), the labels, and the frame driver.
   From ADHD v9's finale.js. Built in, for pages that draw the film live: a label adopts an element
   that is already in the page (data-lab="alone-3"), window.__inset keeps labels inside a cropped
   picture, window.__feel reports the strongest feeling in the frame, window.__view (stage.js) fixes the camera. */
(function (S) {
  const { $, cam, main, draws, C, scr, Wd, camAt, A } = S;
  /* ================================================================= feeling: light from the animal itself */
  /* Maarten, 16 Nov: the feeling comes from the organism as a glow. Colour = which feeling,
     radius and brightness = how strong. It is drawn as light (soft, no grain, above the paper),
     because it is felt and not seen: an aura that follows the animal's outline, a wide halo,
     and rings that leave the body on every pulse. Each animal has its own track. */
  const COL = { red: ["#FF2440", "#FFE9DC"], green: ["#19E57C", "#EDFFE6"] };
  const adefs = $("adefs"), ahalo = $("ahalo"), acam = $("acam"), aring = $("aring"), dimE = $("dim");
  (function () {
    let s = "";
    for (const k in COL) {
      const c = COL[k][0], w = COL[k][1];
      s += '<radialGradient id="hg_' + k + '"><stop offset="0" stop-color="' + c + '" stop-opacity="0.07"/><stop offset="0.16" stop-color="' + c + '" stop-opacity="0.1"/><stop offset="0.34" stop-color="' + c + '" stop-opacity="0.36"/><stop offset="0.6" stop-color="' + c + '" stop-opacity="0.16"/><stop offset="0.85" stop-color="' + c + '" stop-opacity="0.04"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="rg_' + k + '"><stop offset="0.5" stop-color="' + c + '" stop-opacity="0"/><stop offset="0.84" stop-color="' + c + '" stop-opacity="0.5"/><stop offset="0.9" stop-color="' + w + '" stop-opacity="0.42"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>';
    }
    adefs.innerHTML = s;
  })();
  const GLOW = [];
  /* els: the paper parts whose outline glows. off: body centre in the first part's own units.
     rad: body radius in world units. keys: [time, colour, strength 0..1, ease time]. */
  function glower(els, off, rad, keys, pick) {
    const i = GLOW.length;
    els.forEach((e, k) => { if (!e.id) e.id = "gl" + i + "_" + k; });
    const f = document.createElementNS(NS, "filter");
    f.setAttribute("id", "af" + i); f.setAttribute("filterUnits", "userSpaceOnUse"); f.setAttribute("color-interpolation-filters", "sRGB");
    f.innerHTML =
      '<feGaussianBlur in="SourceAlpha" stdDeviation="20" result="w"/><feComponentTransfer in="w" result="w2"><feFuncA type="linear" slope="2"/></feComponentTransfer>' +
      '<feFlood flood-color="#f00" result="c1"/><feComposite in="c1" in2="w2" operator="in" result="wide"/>' +
      '<feGaussianBlur in="SourceAlpha" stdDeviation="4" result="n"/><feComponentTransfer in="n" result="n2"><feFuncA type="linear" slope="2"/></feComponentTransfer>' +
      '<feFlood flood-color="#fff" result="c2"/><feComposite in="c2" in2="n2" operator="in" result="tight"/>' +
      '<feMerge result="glow"><feMergeNode in="wide"/><feMergeNode in="tight"/></feMerge>' +
      '<feComposite in="glow" in2="SourceAlpha" operator="out" result="outer"/>' +
      '<feFlood flood-color="#f00" flood-opacity="0.3" result="c3"/><feComposite in="c3" in2="SourceAlpha" operator="in" result="inner"/>' +
      '<feMerge><feMergeNode in="outer"/><feMergeNode in="inner"/></feMerge>';
    adefs.appendChild(f);
    const blur = qa(f, "feGaussianBlur"), fa = qa(f, "feFuncA"), fl = qa(f, "feFlood");
    const grp = G(els.map((e) => '<use href="#' + e.id + '"/>').join(""), acam);
    grp.setAttribute("filter", "url(#af" + i + ")");
    const halo = G('<circle r="100"/>', ahalo), hc = halo.firstChild;
    const rings = [0, 1].map(() => G('<circle r="100"/>', aring));
    GLOW.push({ i, els, off, rad, keys, pick, f, blur, fa, fl, grp, halo, hc, rings, col: null, ph: i * 0.37 });
  }
  function track(keys, t) {
    let pc = null, pv = 0;
    for (const k of keys) {
      if (t < k[0]) break;
      const u = (t - k[0]) / (k[3] || 0.6);
      if (u >= 1) { if (k[2] > 0) pc = k[1]; pv = k[2]; continue; }
      if (!pc || pv <= 0) return [k[1], k[2] * ss(u)];
      if (k[2] <= 0 || k[1] === pc) return [pc, lerp(pv, k[2], ss(u))];
      /* a different feeling: the old one goes out, then the new one comes up */
      return u < 0.4 ? [pc, pv * (1 - ss(u / 0.4))] : [k[1], k[2] * ss((u - 0.4) / 0.6)];
    }
    return [pc, pv];
  }
  const hideG = (g) => { if (g._on !== 0) { g.grp.setAttribute("display", "none"); g.halo.setAttribute("display", "none"); g.rings.forEach((r) => r.setAttribute("display", "none")); g._on = 0; } };
  function feeling(t) {
    const camT = cam.getAttribute("transform");
    if (acam._t !== camT) { acam.setAttribute("transform", camT); acam._t = camT; }
    let D = 0, sw = 0, swx = 0, swy = 0, fcol = null, fI = 0;
    const act = [];
    for (const g of GLOW) {
      const [col, I0] = track(g.keys, t);
      if (!col || I0 < 0.004) { hideG(g); continue; }
      if (I0 > fI) { fI = I0; fcol = col; }
      const el = g.pick ? g.pick() : g.els[0];
      const m = el.getCTM();
      const sx = m.a * g.off[0] + m.c * g.off[1] + m.e, sy = m.b * g.off[0] + m.d * g.off[1] + m.f;
      const rs = g.rad * C.s;
      /* off the frame: nothing to draw */
      const far = Math.max(-sx, sx - 1080, -sy, sy - 1350) - rs * 6;
      if (far > 0) { hideG(g); continue; }
      if (g._on !== 1) { g.grp.removeAttribute("display"); g.halo.removeAttribute("display"); g._on = 1; }
      if (g.col !== col) {
        g.col = col;
        g.fl[0].setAttribute("flood-color", COL[col][0]); g.fl[1].setAttribute("flood-color", COL[col][1]); g.fl[2].setAttribute("flood-color", COL[col][0]);
        g.hc.setAttribute("fill", "url(#hg_" + col + ")");
        g.rings.forEach((r) => r.firstChild.setAttribute("fill", "url(#rg_" + col + ")"));
      }
      /* the pulse: red beats like a heart going fast, green breathes */
      const red = col === "red";
      const rate = red ? 2.2 : 0.7, ph = t * rate + g.ph, fr = ph - Math.floor(ph);
      const beat = red ? Math.exp(-Math.pow((fr - 0.08) / 0.07, 2)) + 0.55 * Math.exp(-Math.pow((fr - 0.34) / 0.08, 2)) : 0.5 - 0.5 * cos(fr * 2 * PI);
      const I = I0 * (1 + (red ? 0.16 : 0.1) * beat), br = 1 + (red ? 0.3 : 0.14) * beat;
      /* aura on the outline, in world units so it zooms with the picture */
      const wx = sx / C.s + C.x, wy = sy / C.s + C.y;
      const sW = g.rad * (0.16 + 0.62 * I), sT = g.rad * 0.05 + 1.2 + g.rad * 0.05 * I;
      const ext = g.rad * 2.2 + sW * 3.2;
      g.f.setAttribute("x", f1(wx - ext)); g.f.setAttribute("y", f1(wy - ext)); g.f.setAttribute("width", f1(ext * 2)); g.f.setAttribute("height", f1(ext * 2));
      g.blur[0].setAttribute("stdDeviation", f1(sW)); g.blur[1].setAttribute("stdDeviation", f1(sT));
      g.fa[0].setAttribute("slope", Math.round((0.9 + 2.6 * I0) * br * 100) / 100);
      g.fa[1].setAttribute("slope", Math.round((0.6 + 3.2 * I0) * br * 100) / 100);
      g.fl[2].setAttribute("flood-opacity", Math.round(sat(0.03 + 0.11 * I0 * br) * 100) / 100);
      g.grp.setAttribute("opacity", Math.round(sat(I0 * 4) * 100) / 100);
      /* the halo */
      const hr = rs * (1.5 + 4.4 * I);
      g.halo.setAttribute("transform", "translate(" + f1(sx) + " " + f1(sy) + ") scale(" + Math.round(hr * 10) / 1000 + ")");
      g.halo.setAttribute("opacity", Math.round(sat((0.25 + 0.6 * I0) * br * sat(I0 * 4)) * 100) / 100);
      /* rings that leave the body on each pulse */
      const life = red ? 0.8 : 1.5, per = 1 / rate;
      g.rings.forEach((r, k) => {
        const a = (fr + k) * per;
        if (a > life) { r.setAttribute("display", "none"); return; }
        const u = a / life, rr = rs * (0.8 + (1.2 + 4.6 * I0) * (1 - Math.pow(1 - u, 2)));
        r.removeAttribute("display");
        r.setAttribute("transform", "translate(" + f1(sx) + " " + f1(sy) + ") scale(" + Math.round(rr * 10) / 1000 + ")");
        r.setAttribute("opacity", Math.round(sat(I0 * (red ? 0.8 : 0.55) * Math.pow(1 - u, 1.4) * sat(a / 0.04)) * 100) / 100);
      });
      g._on = 1;
      D = Math.max(D, I0 * sat(1 - (far + rs * 6) / 200) * clamp(rs / 110, 0.4, 1));
      sw += I0; swx += I0 * sx; swy += I0 * sy; act.push([sx, sy, rs]);
    }
    window.__feel = [fcol, fI];
    /* the world steps back a little while something is felt strongly */
    dimE.style.opacity = Math.round(0.5 * D * (1 - 0.5 * Wd.night) * 1000) / 1000;
    /* ...but not the one who feels it: the dark leaves a clear space round the glowing animals */
    if (sw > 0) {
      const cx = swx / sw, cy = swy / sw;
      let R = 0, rm = 0;
      for (const a of act) { R = Math.max(R, Math.hypot(a[0] - cx, a[1] - cy) + a[2] * 1.5); rm = Math.max(rm, a[2]); }
      const bg = "radial-gradient(circle at " + Math.round(cx) + "px " + Math.round(cy) + "px, rgba(27,24,48,0) " + Math.round(R) + "px, rgba(27,24,48,1) " + Math.round(R + Math.max(160, rm * 2.6)) + "px)";
      if (dimE._bg !== bg) { dimE.style.background = bg; dimE._bg = bg; }
    }
  }
  /* --- who feels what, when ---
     v5 (Maarten, 16 Nov: "when the dung beetles are moving towards the artificial light, they
     actually feel really good... it's only when they crash that they all of a sudden feel real bad").
     THE RULES. Check every key below against them, and every new animal:
     1. The glow is what the animal's own mechanism reads at that moment. Never what the viewer knows.
     2. In the changed world the feeling keeps its type, at equal or greater strength. A super-cue
        (the lamp, the block) glows bigger than the real cue (the stars, the rival).
     3. A hazard the animal has no detector for (the road) changes nothing.
     4. It turns bad only when the consequence reaches the body, or when nothing answers the need.
     5. Dead: no glow.
     The face in seq_*.js must say the same thing as the key here. */
  /* the human: its track is written out, with the reasons, in seq_alone.js (GLOW) */
  glower([A.hero.g], [0, -62], 70, A.HGLOW);
  glower([A.hero.g, A.kid.g], [0, -62], 70, A.HGLOW2);

  /* ================================================================= labels */
  /* One label at a time, placed next to the human (Maarten, 15 Nov: "the text should be where the
     focus is"). The box does not move; a short line follows the subject. */
  const labelsEl = $("labels"), linesEl = $("lines"), tab = $("tab"), tabt = $("tabt");
  const hero = A.hero, hs = A.hs, GH = EP.gy;
  const hFeet = () => [hs.x, GH + 12], hHead = hero.topP(10);
  /* [side of the subject the box sits on, gap in px, where in the beat the place is taken (0..1),
     what it points at, (a fixed world point for the box; the line still goes to the fourth)] */
  const LCFG = [
    ["below", 40, 0.5, hFeet], ["below", 40, 0.8, hFeet], ["below", 40, 0.92, hFeet], ["below", 40, 0.3, hFeet], ["below", 40, 0.7, hFeet],
    ["below", 40, 0.92, hFeet],
    ["below", 40, 0.5, hFeet], ["below", 40, 0.5, hFeet], ["below", 40, 0.5, hFeet, [1745, GH + 12]], ["below", 40, 0.5, hFeet], ["below", 40, 0.96, hFeet],
    ["above", 34, 0.6, hHead]];
  const SEC = { key: KEY, text: TEXT, num: NUM, beats: BEATS, end: END + 1, cfg: LCFG, name: NAME };
  const LAB = TEXT.map((txt, i) => {
    const say = i === TEXT.length - 1;
    const have = labelsEl.querySelector('[data-lab="' + KEY + "-" + i + '"]');
    const d = have || document.createElement("div");
    d.className = "lab" + (say ? " say" : NUM[i] ? "" : " chg");
    if (!have) { d.innerHTML = (NUM[i] ? '<span class="n">' + NUM[i] + "</span>" : "") + '<span class="t">' + txt + "</span>"; labelsEl.appendChild(d); }
    return d;
  });
  let ANCH = [];
  const lineG = G('<path class="lu" fill="none" stroke="#F7F0DE" stroke-width="9" stroke-linecap="round"/><path class="lo" fill="none" stroke="#22202E" stroke-width="3.6" stroke-linecap="round"/><circle class="du" r="10" fill="#F7F0DE"/><circle class="dd" r="6" fill="#22202E"/>', linesEl);
  const lu = q(lineG, ".lu"), lo = q(lineG, ".lo"), du = q(lineG, ".du"), dd = q(lineG, ".dd");
  let anchReady = false;
  function labels(t) {
    if (!anchReady) return;
    let cur = null;
    const sec = SEC, s = sec.beats[0][0], e = sec.end, n = sec.beats.length, IN = window.__inset || 0;
    LAB.forEach((el, i) => {
      const b0 = sec.beats[i][0], b1 = i < n - 1 ? sec.beats[i + 1][0] : e;
      let a = 0;
      if (t >= b0 && t < b1) {
        /* v2: in over two frames, out on the cut: two labels are never up at once */
        const ain = sat((t - b0) / 0.06);
        a = ain;
        const cfg = sec.cfg[i];
        const A_ = ANCH[i];
        const w = el.offsetWidth, h = el.offsetHeight;
        const x = clamp(A_[0] - w / 2, 34 + IN, Math.max(34 + IN, 1080 - 34 - IN - w));
        const y = clamp(cfg[0] === "above" ? A_[1] - cfg[1] - h : A_[1] + cfg[1], 30, 1350 - 100 - h);
        el.style.left = f1(x) + "px"; el.style.top = f1(y) + "px";
        el.style.transformOrigin = "50% " + (cfg[0] === "above" ? "100%" : "0%");
        el.style.transform = "scale(" + (Math.round((0.86 + 0.14 * ss(ain)) * 1000) / 1000) + ")";
        if (t < b1) cur = { i, b0, x, y, w, h, a, cfg };
      }
      el.style.opacity = Math.round(a * 1000) / 1000;
    });
    tab.style.opacity = Math.round(ss(t / 0.12) * 1000) / 1000;
    if (tabt.textContent !== sec.name) tabt.textContent = sec.name;
    /* the short line from the label to what it is about */
    if (!cur) { OP(lineG, 0); return; }
    const tp = cur.cfg[3]();
    if (!tp) { OP(lineG, 0); return; }
    const p = scr(tp);
    const above = cur.cfg[0] === "above";
    const sy = above ? cur.y + cur.h + 2 : cur.y - 2;
    const grow = ss((t - cur.b0 - 0.03) / 0.1);
    if (grow <= 0 || (above ? p[1] < sy + 14 : p[1] > sy - 14)) { OP(lineG, 0); return; }
    const sx = clamp(p[0], cur.x + 30, cur.x + cur.w - 30);
    const ex = lerp(sx, p[0], grow), ey = lerp(sy, p[1], grow);
    const d = "M" + f1(sx) + "," + f1(sy) + " L" + f1(ex) + "," + f1(ey);
    lu.setAttribute("d", d); lo.setAttribute("d", d);
    du.setAttribute("cx", f1(ex)); du.setAttribute("cy", f1(ey)); dd.setAttribute("cx", f1(ex)); dd.setAttribute("cy", f1(ey));
    OP(lineG, cur.a);
  }

  /* ================================================================= the frame */
  /* The whole picture is a function of t. Nothing is kept from one call to the next. */
  function draw(t) {
    main.time(t);
    camAt(t);
    for (const f of draws) f(t);
    feeling(t);
    labels(t);
  }
  /* one pass over the whole film to work out stride phases */
  Bake.run(END + 0.1, 60, (t) => main.time(t));
  S.after.forEach((f) => f());
  const tl = gsap.timeline({ paused: true });
  const drv = { _t: 0 };
  Object.defineProperty(drv, "t", { get() { return this._t; }, set(v) { this._t = v; draw(v); } });
  tl.to(drv, { t: END, duration: END, ease: "none" }, 0);
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
  /* state: the numbers the timeline moves, for tests (the stateless check). Read only. */
  window.__film = { KEY, NAME, END, BEATS, TEXT, NUM, draw, cam: C, state: A.state, _main: main };
  /* take each label's place from the picture at its own moment */
  ANCH = BEATS.map((b, i) => { const c = LCFG[i], ts = b[0] + (b[1] - b[0]) * c[2]; draw(ts); return scr(c[4] || c[3]()); });
  anchReady = true;
  tl.seek(0);
  draw(0);
})(ST);
