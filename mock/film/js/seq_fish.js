/* seq_fish.js - 1. the stickleback. He tends his nest, drives off a rival, and then meets the block. */
(function (S) {
  const { $, to, set, face, draws, P, F, SHAKES, PUNCH, STOPS, burst, pow, puff, ring, mark, aqua } = S;
  const HITS = K.HITS, hitT = K.hitT, dropT = K.dropT;
  const nest = makeNest(aqua);
  place(nest, P.nest[0], P.nest[1], 0, 0.62);
  const rival = makeFish(aqua, { body: "fish2", back: "fishback2", iris: "#D6A93A", seed: 2 });
  const fish = makeFish(aqua, { seed: 1 });
  const blockG = makeBlock(aqua);
  const Bk = { x: P.block[0], y: 640, vis: 0 };
  const fs = fish.st, rs = rival.st;
  const HOME = [352, 1238], GUARD = [318, 1214], ATK = [300, 1218];
  Object.assign(fs, { x: HOME[0], y: HOME[1], s: 0.75, flip: -1, r: -17, fan: 1 }, FACE.calm, { px: 3, py: 2 });
  Object.assign(rs, { x: 770, y: 1192, s: 0.66, flip: -1 }, FACE.smug, { px: 3 });
  const Fa = { am: 0 };
  /* a paper puppet turns round by going edge-on */
  const turn = (st, t, d, flip) => { to(st, t, d * 0.5, { sx: 0.06 }, "power2.in"); set(st, t + d * 0.5, { flip }); to(st, t + d * 0.5, d * 0.5, { sx: 1 }, "power2.out"); };
  const cur = { x: HOME[0], y: HOME[1], r: 0, flip: -1 };
  const head = (dx, dy) => () => { const a = cur.r * PI / 180, f = cur.flip; return [cur.x + f * dx * cos(a) * 0.75 - dy * sin(a) * 0.75 * f, cur.y + f * dx * sin(a) * 0.75 + dy * cos(a) * 0.75]; };
  const over = (dy) => () => [cur.x + 10 * cur.flip, cur.y - dy];

  /* --- the rival swims in, pleased with himself */
  to(rs, F[0] + 0.15, 1.55, { x: 516, y: 1210 }, "sine.inOut");
  /* --- F1: he notices, turns, puts his spines up and takes his place in front of the nest */
  const seeT = F[0] + 0.72;
  face(fs, seeT, 0.12, "alert", { px: -5, py: -1 });
  to(fs, seeT, 0.12, { fan: 0, r: -4 }, "power2.out");
  mark(aqua, seeT + 0.02, over(46), "!", { dur: 0.62, s: 0.95 });
  turn(fs, seeT + 0.2, 0.26, 1);
  to(fs, seeT + 0.2, 0.26, { r: 0, px: 4, py: 0 }, "none");
  to(fs, seeT + 0.42, 0.22, { spine: 1 }, "back.out(3)");
  face(fs, seeT + 0.44, 0.2, "angry", { px: 4 });
  to(fs, seeT + 0.34, 0.55, { x: GUARD[0], y: GUARD[1] }, "power2.inOut");
  /* --- F2: the charge */
  face(fs, hitT - 0.47, 0.15, "rage", { px: 4 });
  to(fs, hitT - 0.47, 0.3, { x: 282, sx: 0.84, sy: 1.14 }, "power2.out");
  to(fs, hitT - 0.14, 0.14, { x: 378, sx: 1.22, sy: 0.88 }, "power3.in");
  puff(aqua, hitT - 0.13, 286, 1218, { n: 7, ring: 1, r: 5, v: 30, a0: PI * 0.7, a1: PI * 1.3, life: 0.7, rise: 30, seed: 5 });
  to(fs, hitT - 0.06, 0.06, { open: 1 }, "none");
  to(fs, hitT, 0.5, { sx: 1, sy: 1 }, "elastic.out(1.2,0.35)");
  to(fs, hitT, 0.2, { x: 364 }, "power2.out");
  to(fs, hitT + 0.1, 0.2, { open: 0.1 }, "none");
  STOPS.push([hitT, 0.09]); PUNCH.push([hitT, 0.045]); SHAKES.push([hitT, 8]);
  pow(aqua, hitT, 449, 1208, 0.66, 10);
  burst(aqua, hitT, 452, 1208, 9, 71, { a0: -PI * 0.75, a1: PI * 0.2, v0: 90, v1: 240, cols: ["fish2", "fishback2", "red"], grav: 260, nog: 1, life: 1.1, fade: 0.6, s: 0.8 });
  /* the rival: shock, a spin, and gone */
  face(rs, hitT - 0.12, 0.1, "alert", { px: 4 });
  face(rs, hitT, 0.05, "shock", { px: 0 });
  to(rs, hitT, 0.22, { x: 548, r: 38, sx: 0.78 }, "power3.out");
  to(rs, hitT + 0.22, 0.2, { sx: 1 }, "none");
  set(rs, hitT + 0.02, { dizzy: 1 });
  to(rs, hitT + 0.3, 1.0, { x: 1220, y: 1146, r: 330 }, "power2.in");
  /* he watches it go, is pleased, and goes back to his eggs */
  face(fs, hitT + 0.3, 0.25, "happy", { px: 4, py: -1 });
  to(fs, hitT + 0.32, 0.3, { spine: 0 }, "power1.out");
  [[0.36, -10], [0.5, 9], [0.64, -6], [0.78, 0]].forEach(([dt, r]) => to(fs, hitT + dt - 0.14, 0.14, { r }, "sine.inOut"));
  turn(fs, hitT + 0.66, 0.26, -1);
  to(fs, hitT + 0.72, 0.4, { x: HOME[0], y: HOME[1], r: -17 }, "power2.inOut");
  to(fs, hitT + 1.0, 0.15, { fan: 1, px: 3, py: 2 }, "none");
  /* --- F3: the block lands on the water */
  set(Bk, F[2] + 0.03, { vis: 1 });
  to(Bk, F[2] + 0.08, 0.32, { y: P.block[1] }, "power2.in");
  STOPS.push([dropT, 0.07]); SHAKES.push([dropT, 7]);
  burst($("splash"), dropT, P.block[0], P.waterY - 4, 22, 21, { a0: -PI * 0.94, a1: -PI * 0.06, v0: 150, v1: 420, g0: 6, g1: 10, cols: ["foam", "water", "foam"], sink: 1, grav: 1200 });
  burst($("splash"), dropT, P.block[0], P.waterY - 6, 8, 23, { a0: -PI * 0.8, a1: -PI * 0.2, v0: 200, v1: 400, g0: 8, g1: 10, fill: "#BFE6E2", sink: 1, grav: 1200 });
  puff(aqua, dropT + 0.02, P.block[0], P.waterY + 44, { n: 12, ring: 1, r: 6, v: 70, a0: 0.1, a1: PI - 0.1, life: 1.0, rise: -10, seed: 9 });
  [0, 0.18, 0.4].forEach((d, i) => { ring($("splash"), dropT + d, P.block[0] - 150 - i * 20, P.waterY - 2, { r0: 8, r1: 44, k: 0.2, life: 0.8 }); ring($("splash"), dropT + d, P.block[0] + 150 + i * 20, P.waterY - 2, { r0: 8, r1: 44, k: 0.2, life: 0.8 }); });
  /* he starts, looks up, turns to it */
  face(fs, dropT, 0.06, "shock", { px: -2, py: -5 });
  to(fs, dropT, 0.06, { fan: 0 }, "none");
  to(fs, dropT, 0.12, { y: HOME[1] + 16, x: HOME[0] + 12, r: 6 }, "power2.out");
  to(fs, dropT + 0.12, 0.6, { y: HOME[1] + 2, x: HOME[0] + 4 }, "elastic.out(1,0.4)");
  mark(aqua, dropT + 0.08, over(46), "!", { dur: 0.6, s: 0.95 });
  turn(fs, dropT + 0.5, 0.26, 1);
  to(fs, dropT + 0.5, 0.3, { r: -14, x: ATK[0], y: ATK[1] + 8 }, "power1.inOut");
  face(fs, dropT + 0.64, 0.25, "alert", { px: 2, py: -6, open: 0 });
  to(fs, dropT + 0.9, 0.3, { r: -22 }, "sine.inOut");
  /* --- F4, F5: the attacks. Each hit a lunge and a recoil, faster and faster. */
  face(fs, F[3] - 0.12, 0.2, "angry", { px: 2, py: -5 });
  to(fs, F[3] - 0.1, 0.24, { spine: 1 }, "back.out(3)");
  to(fs, F[3] + 0.0, 0.2, { r: 0, y: ATK[1], x: ATK[0] }, "power1.inOut");
  to(Fa, F[3] + 0.05, 0.3, { am: 1 }, "back.out(1.6)");
  face(fs, F[3] + 0.3, 0.2, "rage", { px: 3, py: -2, open: 0.1 });
  mark(aqua, F[3] + 0.32, head(40, -50), "vein", { dur: 0.9, s: 0.9 });
  to(fs, F[4], 0.8, { flush: 1 }, "none");
  to(fs, F[4] + 0.5, 1.6, { hurt: 1 }, "none");
  /* worn out, and still at it */
  to(fs, F[4] + 1.3, 0.9, { lid: 0.52, lidA: 4, brow: 0.25, pup: 0.8 }, "sine.inOut");
  HITS.forEach((h, i) => {
    if (i < 14) { pow(aqua, h, 356 + (i % 2) * 8, 1090, 0.36 + Math.min(i, 9) * 0.03, i * 40); if (i < 12) SHAKES.push([h, 2.5 + Math.min(i, 9) * 0.6]); }
    if (i < 2) { STOPS.push([h, 0.06]); PUNCH.push([h, 0.03]); }
    if (i < 9 && i % 2 === 0) { ring($("splash"), h + 0.03, P.block[0] - 96, P.waterY - 2, { r0: 6, r1: 30, k: 0.2, life: 0.6 }); ring($("splash"), h + 0.03, P.block[0] + 96, P.waterY - 2, { r0: 6, r1: 30, k: 0.2, life: 0.6 }); }
    if (i >= 3 && i < 13 && i % 3 === 0) burst(aqua, h, 350, 1094, 4, 80 + i, { a0: PI * 0.15, a1: PI * 0.85, v0: 60, v1: 160, cols: ["fish", "fishback", "red"], grav: 220, nog: 1, life: 1.2, fade: 0.7, s: 0.7 });
  });
  const lostT = HITS[7];
  const spineBit = G('<path class="f-fishfin" d="M-4,6 L1,-14 L6,6 Z"/>', aqua);

  function pose(t) {
    const reach = hitReach(t, HITS, 0.3, 0.34), am = Fa.am, k = lastHit(t, HITS), dk = k >= 0 ? t - HITS[k] : 9;
    const bob = sin(t * 2.1) * 3.5 * (1 - am * 0.7);
    let x = fs.x, y = fs.y + bob, r = fs.r, sx = fs.sx, sy = fs.sy;
    if (am > 0.001) {
      x = lerp(fs.x, lerp(ATK[0], 337, reach), am); y = lerp(fs.y, lerp(ATK[1], 1154, reach), am) + bob;
      r = fs.r - 70 * am + (k >= 0 ? sin(dk * 40) * 8 * Math.exp(-7 * dk) : 0) * am;
      const sq = k >= 0 ? Math.exp(-14 * dk) : 0;
      sx = fs.sx * (1 - 0.26 * sq + 0.12 * reach * (dk > 0.1 ? 1 : 0)); sy = fs.sy * (1 + 0.22 * sq);
    }
    return { x, y, r, sx, sy, reach, k, dk, am };
  }
  Bake.def("f.x", (t) => pose(t).x); Bake.def("f.y", (t) => pose(t).y);
  Bake.def("r.x", () => rs.x); Bake.def("r.y", () => rs.y);
  S.after.push(() => {
    for (const k of ["f", "r"]) {
      Bake.vel(k + ".x", k + ".vx"); Bake.vel(k + ".y", k + ".vy");
      const vx = Bake.T[k + ".vx"], vy = Bake.T[k + ".vy"];
      Bake.map(k + ".sp", (i) => Math.min(Math.hypot(vx[i], vy[i]), 700));
      const sp = Bake.T[k + ".sp"];
      Bake.map(k + ".rate", (i) => 5.5 + sp[i] * 0.045);
      Bake.integ(k + ".rate", k + ".ph");
      Bake.spring(k + ".vy", k + ".vyl", 160, 20);
      Bake.spring(k + ".sp", k + ".spl", 120, 18);
    }
  });

  draws.push((t) => {
    const p = pose(t);
    const save = { x: fs.x, y: fs.y, r: fs.r, sx: fs.sx, sy: fs.sy, dizzy: fs.dizzy, lost: fs.lost, open: fs.open, mouth: fs.mouth };
    const sp = Bake.at("f.spl", t), vy = Bake.at("f.vyl", t);
    fs.x = p.x; fs.y = p.y; fs.sx = p.sx; fs.sy = p.sy;
    fs.r = p.r + clamp(vy * 0.05 * fs.flip, -15, 15) * (1 - p.am);
    fs.sw = Bake.at("f.ph", t); fs.swA = 7 + Math.min(sp, 420) * 0.05 + p.am * 6;
    if (p.am > 0.001) {
      fs.open = Math.max(fs.open, p.reach * p.reach * 0.95, t > F[4] + 1.3 ? 0.3 + 0.2 * sin(t * 9) : 0);
      fs.dizzy = ss((t - (F[4] + 0.9)) / 1.0) * 0.9;
      fs.lost = t >= lostT ? 1 : 0;
    }
    cur.x = fs.x; cur.y = fs.y; cur.r = fs.r; cur.flip = fs.flip;
    fish.draw(t);
    Object.assign(fs, save);
    /* the rival: swagger in, swim phase from his own speed */
    const rsp = Bake.at("r.spl", t);
    const ry = rs.y;
    rs.y += sin(t * 2.6) * 4;
    rs.sw = Bake.at("r.ph", t); rs.swA = 8 + Math.min(rsp, 420) * 0.05;
    rival.draw(t);
    rs.y = ry;
    /* block: bobbing; knocked by each hit; it never leaves */
    const k = p.k, dk = p.dk, sinceDrop = t - dropT;
    let by = Bk.y + (sinceDrop > 0 ? 16 * Math.exp(-3.2 * sinceDrop) * cos(sinceDrop * 11) + sin(t * 1.9) * 2.2 : 0);
    let br = sinceDrop > 0 ? 7 * Math.exp(-2.6 * sinceDrop) * sin(sinceDrop * 9) + sin(t * 1.4) * 1.6 : -6 + (Bk.y - 640) * 0.02;
    if (k >= 0) { by -= (7 + Math.min(k, 10) * 0.9) * Math.exp(-9 * dk); br += (k % 2 ? 1 : -1) * (5 + Math.min(k, 10) * 0.8) * Math.exp(-5 * dk) * cos(dk * 17); }
    OP(blockG, Bk.vis);
    place(blockG, Bk.x, by, br, 1);
    /* the spine that comes off */
    const ds = t - lostT;
    if (ds < 0) OP(spineBit, 0);
    else { OP(spineBit, 1); const u = Math.min(ds, 2.2); place(spineBit, 330 - u * 26 + sin(u * 6) * 10, Math.min(1302, 1120 + u * 86), u * 200, 0.9); }
  });
  /* panting: bubbles from his mouth once he is worn out */
  for (let i = 0; i < 26; i++) { const tt = F[4] + 1.4 + i * 0.55; if (tt < END - 0.4) puff(aqua, tt, head(74, 6), head(74, 6), { n: 3, ring: 1, r: 3.4, v: 16, a0: -PI * 0.9, a1: -PI * 0.1, life: 0.8, rise: 44, seed: 100 + i }); }

  S.A.fish = fish; S.A.rival = rival; S.A.fishCur = cur;
  S.A.fishTop = () => [cur.x + 8 * cur.flip, cur.y - 40];
  S.A.blockTop = () => [P.block[0], P.waterY - 36];
})(ST);
