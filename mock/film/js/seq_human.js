/* seq_human.js - 5. the human child. It sits by an adult who is weaving, cannot sit for long,
   runs to the other children and plays until it is worn out. Then a schoolroom is put down on
   the same spot: a floor, a wall in front of the tree, a chair, a desk, a clock.
   No slapstick here. The feeling track is in finale.js; the faces below say the same thing. */
(function (S) {
  const { $, to, set, hop, face, draws, cut, Wd, SHAKES, puff, mark, fx, E, inView } = S;
  const H = HK.H, T0 = HMOVE[0], GY = EP.gy;
  const mk = (o) => makeHuman(E.kids, Object.assign({ manq: HUMAN_MANQ }, o));
  const ad = mk({ skin: HUMAN_SKIN, wear: "vio2", kind: "adult", style: 4, hair: "hairB", pants: "k5", top: "k5", seed: 15, s: 0.9 });
  const basket = makeBasket(E.kids);
  const teen = mk({ skin: HUMAN_SKIN, wear: "pnk2", kind: "teen", style: 2, hair: "hairB", pants: "k3", seed: 13, s: 0.85 });
  const tod = mk({ skin: HUMAN_SKIN, wear: "tur2", kind: "tod", style: 3, hair: "hairS", pants: "k4", seed: 14, s: 0.7 });
  const fr = mk({ skin: HUMAN_SKIN, wear: "yel2", kind: "kid", style: 1, hair: "hairR", pants: "k2", seed: 12, s: 0.8 });
  const hero = mk({ skin: HUMAN_SKIN, wear: "blu2", kind: "kid", style: 0, hair: "hairK", pants: "k1", seed: 11, s: 0.8 });
  const chairA = makeChair(E.back, 28), chairH = makeChair(E.back, 28), deskA = makeDesk(E.front, 56), deskH = makeDesk(E.front, 56);
  const bubble = makeBubble(fx);
  const as = ad.st, ts = teen.st, ds = tod.st, fs = fr.st, hs = hero.st;
  const PEOPLE = [ad, teen, tod, fr, hero];
  const SEAT = 42;                      /* hip height on the school chair */
  const [SX, SA_] = [EP.seatH[0], EP.seatA[0]];
  const standK = hero.low(HP.stand), crouchK = hero.low(HP.crouch, 0);

  /* the stride comes from the distance covered, so feet do not slide */
  PEOPLE.forEach((p, i) => { Bake.def("hu" + i + ".x", () => p.st.x); Bake.def("hu" + i + ".run", () => p.st.run); });
  S.after.push(() => PEOPLE.forEach((p, i) => {
    const k = "hu" + i, d = p.dims, kk = 2 * PI / (2.7 * (d.tg + d.sn) * p.st.s);
    Bake.vel(k + ".x", k + ".v");
    const v = Bake.T[k + ".v"], rn = Bake.T[k + ".run"];
    Bake.map(k + ".rate", (j) => (rn[j] > 0.05 ? Math.min(Math.abs(v[j]), 900) * kk / Math.max(0.45, rn[j]) : 0));
    Bake.integ(k + ".rate", k + ".ph");
  }));
  /* go: run or walk to x1. o.amp 1 = run, 0.45 = walk. o.on: already moving. o.keep: keeps moving after. */
  const go = (p, t, d, x1, o) => {
    o = o || {};
    const s = p.st, amp = o.amp || 1;
    if (!o.noflip) set(s, t - 0.001, { flip: x1 > p.lx ? 1 : -1 });
    if (!o.on) to(s, t - 0.06, 0.14, { run: amp }, "none");
    to(s, t, d, { x: x1 }, o.ease || "none");
    if (!o.keep) to(s, t + d - 0.1, 0.16, { run: 0 }, "none");
    p.lx = x1;
  };
  const pz = (p, t, d, name, extra, e) => to(p.st, t, d, Object.assign({}, HP[name], extra || {}), e || "power2.out");
  const dust = (t, x, n) => puff(E.kids, t, x, GY + 2, { n: n || 4, r: 4, v: 20, cls: "sand2", a0: -PI * 0.95, a1: -PI * 0.05, life: 0.45, rise: 4, seed: Math.round(t * 10), op: 0.6 });

  /* things that are tweened and read in the draw below */
  const W = { weave: 1, write: 0, tap: 0, rock: 0, hang: 0, bubble: 0, basket: 1 };
  const Rm = { floor: 0, wall: 0, board: 0, clock: 0, chH: 0, chA: 0, dkH: 0, dkA: 0, s0: 0, s1: 0, s2: 0, s3: 0, s4: 0 };

  /* ================================================================= where everyone starts */
  Object.assign(as, { x: EP.adult[0], y: EP.adult[1], flip: 1, turn: 0.5, headR: 8, Lu: -42, Lf: -62, Ru: -30, Rf: -78, Lz: 2, Rz: 1 }, HP.cross, FACE.calm, { px: 2, py: 2.5, mouth: 0.4 });
  Object.assign(hs, { x: EP.sit0[0], y: GY, flip: 1, turn: -0.75, headR: -4, Lu: -18, Lf: -52, Ru: -12, Rf: -58, Rz: 1 }, HP.cross, FACE.calm, { px: -2.5, py: 1.5 });
  Object.assign(ts, { x: 1884, y: 672, gnd: 0, flip: -1, turn: 0.5, Lt: -70, Ls: 62, Rt: -84, Rs: 70, swing: 0.8, Lu: 14, Lf: -20, Ru: 10, Rf: -24 }, FACE.happy, { px: 2, py: 2 });
  Object.assign(fs, { x: 1800, y: GY, turn: 0.6 }, FACE.laugh);
  Object.assign(ds, { x: 1850, y: GY + 4, turn: 0.6, Lu: 62, Ru: -70, Lf: -30, Rf: 30, Rz: 1 }, FACE.happy, { open: 0.5 });
  hero.lx = EP.sit0[0]; fr.lx = 1800; tod.lx = 1850; teen.lx = 1884; ad.lx = EP.adult[0];

  /* ================================================================= the camera */
  const V_PLAY = [1430, 370, 640], V_H2 = [1478, 640, 330], V_H5 = [1530, 500, 540], V_CLASS = [1420, 410, 620], V_X2 = [1700, 610, 340], V_X5 = [1590, 480, 470], V_END = [1640, 540, 400];
  cut(T0, HMOVE[1], V_PLAY, 0.45);
  cut(H[1] - 0.25, H[1] + 0.8, V_H2, 0);
  cut(H[2] + 0.3, H[2] + 1.3, V_PLAY, 0);
  cut(H[4] + 0.2, H[4] + 1.5, V_H5, 0);
  cut(H[5] + 0.45, H[5] + 1.7, V_CLASS, 0);
  cut(H[7] - 0.3, H[7] + 0.7, V_X2, 0);
  cut(H[8] - 0.15, H[8] + 0.75, V_CLASS, 0);
  cut(H[10] + 0.3, H[10] + 1.6, V_X5, 0);
  cut(H[10] + 2.2, END, V_END, 0);

  /* the sun crosses the sky while they play, and it is evening when they are worn out */
  to(Wd, T0 + 0.2, 2.2, { sunAbs: 1 }, "sine.inOut");
  to(Wd, H[3] - 0.4, 6.4, { sax: 1716, say: 524 }, "sine.inOut");
  to(Wd, H[3] + 3.2, 2.6, { night: 0.26 }, "sine.inOut");

  /* ================================================================= the others play, all along */
  let lt = T0 + 0.4, dir = 1;
  const loopEnd = HK.runT - 0.1;
  while (lt + 0.6 < loopEnd) {
    go(fr, lt, 0.6, dir > 0 ? 1960 : 1800);
    hop(fs, lt + 0.64, 0.22, 10);
    go(tod, lt + 0.25, 0.72, dir > 0 ? 1905 : 1832, { amp: 0.7 });
    to(ts, lt + 0.1, 0.3, { px: dir > 0 ? -2 : 2.5 }, "sine.inOut");
    lt += 0.95; dir = -dir;
  }
  /* the teenager on the branch claps now and then */
  for (let t = T0 + 1.2; t < H[2]; t += 2.3) { to(ts, t, 0.14, { Lu: -30, Lf: -80, Ru: -34, Rf: -84 }, "sine.out"); to(ts, t + 0.14, 0.12, { Lf: -60, Rf: -62 }, "sine.inOut"); to(ts, t + 0.26, 0.12, { Lf: -80, Rf: -84 }, "sine.inOut"); to(ts, t + 0.5, 0.3, { Lu: 14, Lf: -20, Ru: 10, Rf: -24 }, "sine.inOut"); }

  /* ================================================================= H1: the need.
     It sits by the adult and watches her hands. Then it hears the others and looks. */
  const h0 = H[0];
  to(hs, h0 + 0.3, 0.2, { headR: 0 }, "sine.inOut"); to(hs, h0 + 0.5, 0.2, { headR: -4 }, "sine.inOut");
  to(hs, h0 + 1.1, 0.3, { turn: 0.8, headR: 5 }, "back.out(1.6)");
  face(hs, h0 + 1.12, 0.25, "awe", { px: 3, py: 0, open: 0.2, mouth: 0.45 });
  to(hs, h0 + 2.3, 0.3, { turn: -0.5, headR: -3 }, "sine.inOut");
  face(hs, h0 + 2.3, 0.3, "calm", { px: -2.5, py: 1.5, mouth: 0 });
  to(hs, h0 + 2.95, 0.3, { turn: 0.8, headR: 6 }, "sine.inOut");
  face(hs, h0 + 2.95, 0.45, "restless", { px: 3, py: 0, brow: -0.35, mouth: -0.15 });

  /* ================================================================= H2: sitting still feels bad */
  const h1 = H[1];
  to(hs, h1, 0.4, { jig: 0.9 }, "none");
  face(hs, h1 + 0.1, 0.4, "restless", { px: 3, py: 0 });
  to(hs, h1 + 0.5, 0.35, { r: 5, Lu: -30, Lf: -30 }, "sine.inOut");
  to(hs, h1 + 0.9, 0.33, { r: -4 }, "sine.inOut");
  pz(hero, h1 + 1.25, 0.3, "knees", { r: 0, Lu: -52, Lf: -72, Ru: -58, Rf: -62, jig: 0.5 }, "power2.inOut");      /* it pulls its knees up */
  [0, 1, 2].forEach((k) => { to(hs, h1 + 1.56 + k * 0.3, 0.15, { r: 7 }, "sine.inOut"); to(hs, h1 + 1.71 + k * 0.3, 0.15, { r: -5 }, "sine.inOut"); });   /* and rocks */
  to(hs, h1 + 1.6, 0.2, { turn: -0.6, px: -2.5 }, "sine.inOut");                     /* a look at the adult */
  to(hs, h1 + 2.05, 0.2, { turn: 0.8 }, "sine.inOut");                               /* and back at the others */
  face(hs, h1 + 2.05, 0.3, "strain", { px: 3, py: 0 });

  /* ================================================================= H3: it gets up and runs to them */
  const h2 = H[2], upT = HK.upT, runT = HK.runT, tagT = HK.tagT;
  face(hs, h2, 0.2, "keen", { px: 3, py: 0 });
  to(hs, h2, 0.2, { jig: 0, r: 0 }, "none");
  pz(hero, upT, 0.2, "crouch", { r: 18, Lu: 20, Lf: -20, Ru: 10, Rf: -30 }, "power2.out");
  pz(hero, upT + 0.2, 0.22, "stand", { r: 4, Lu: 6, Lf: -6, Ru: -4, Rf: -6 }, "back.out(2)");
  hop(hs, upT + 0.2, 0.22, 10);
  to(hs, upT + 0.2, 0.2, { turn: 0.6, headR: 0 }, "none");
  go(hero, runT, 0.72, 1836, { ease: "power1.out" });
  face(hs, runT + 0.2, 0.3, "happy", { px: 3, py: 0, open: 0.45 });
  dust(runT + 0.02, EP.sit0[0] - 8, 5);
  to(hs, runT + 0.7, 0.1, { r: -9 }, "power2.out"); to(hs, runT + 0.8, 0.25, { r: 0 }, "back.out(2)");
  dust(runT + 0.7, 1846, 4);
  /* the adult looks up, smiles, and goes on with her work */
  to(as, h2 + 0.45, 0.25, { turn: 0.9, headR: 0 }, "sine.inOut");
  face(as, h2 + 0.5, 0.3, "happy", { px: 3, py: 0 });
  to(as, h2 + 1.5, 0.3, { turn: 0.5, headR: 8 }, "sine.inOut");
  face(as, h2 + 1.5, 0.3, "calm", { px: 2, py: 2.5, mouth: 0.5 });
  /* its friend sees it coming, waves, tags it and is off */
  go(fr, runT + 0.15, 0.35, 1884);
  to(fs, runT + 0.5, 0.18, { Lu: -158, Lf: -10 }, "back.out(2)");
  [0, 1].forEach((k) => { to(fs, runT + 0.7 + k * 0.2, 0.1, { Lf: 22 }, "sine.inOut"); to(fs, runT + 0.8 + k * 0.2, 0.1, { Lf: -16 }, "sine.inOut"); });
  to(fs, tagT - 0.16, 0.14, { Lu: -84, Lf: -4, r: 12 }, "power2.out");
  to(fs, tagT + 0.02, 0.2, { Lu: 6, Lf: -6, r: 0 }, "power2.out");
  hop(hs, tagT + 0.02, 0.2, 8);
  face(hs, tagT + 0.04, 0.15, "laugh", { px: 3, py: 0 });
  to(ts, runT + 0.4, 0.3, { px: 3, py: 2.5 }, "sine.inOut");
  /* --- the chase (it runs on into the next beat) */
  const c0 = tagT + 0.2;
  go(fr, c0, 0.5, 2030, { keep: 1 });
  go(fr, c0 + 0.55, 0.8, 1720, { on: 1, keep: 1 });
  go(fr, c0 + 1.42, 0.6, 1940, { on: 1 });
  go(hero, c0 + 0.25, 0.5, 1990, { keep: 1 });
  go(hero, c0 + 0.8, 0.7, 1760, { on: 1, keep: 1 });
  go(hero, c0 + 1.56, 0.42, 1890, { on: 1, keep: 1 });
  go(hero, c0 + 2.04, 0.34, 1800, { on: 1 });
  face(hs, c0 + 0.9, 0.2, "laugh", { px: 3, py: 0, open: 0.6 });
  go(tod, c0 + 0.1, 0.9, 1900, { amp: 0.7 });
  go(tod, c0 + 1.1, 0.9, 1790, { amp: 0.7 });
  go(tod, c0 + 2.1, 0.6, 1862, { amp: 0.7 });
  to(ts, c0 + 0.2, 0.3, { px: -2.5, py: 2.5 }, "sine.inOut"); to(ts, c0 + 0.9, 0.5, { px: 3 }, "sine.inOut"); to(ts, c0 + 1.7, 0.4, { px: 0 }, "sine.inOut");

  /* ================================================================= H4: they play, climb and chase for hours */
  const h3 = H[3], grabT = HK.grabT, pullT = grabT + 0.7, landT = HK.landT;
  /* it jumps for the low branch, swings, and is pulled up to sit by the big one */
  pz(hero, grabT - 0.34, 0.16, "crouch", { r: 6, Lu: 30, Ru: 24 }, "power2.out");
  pz(hero, grabT - 0.18, 0.18, "stand", { r: 0, Lu: 172, Lf: 4, Ru: -172, Rf: -4, h: 98 - standK, turn: 0.3, headR: 0 }, "power2.out");
  face(hs, grabT - 0.2, 0.2, "keen", { px: 0, py: -3, open: 0.3 });
  set(hs, grabT, { gnd: 0, h: 98 });
  set(W, grabT, { hang: 1 });
  pz(hero, grabT, 0.2, "hang", {}, "power2.out");
  face(hs, grabT + 0.1, 0.2, "laugh", { px: 0, py: 0 });
  set(W, pullT, { hang: 0 });
  set(hs, pullT + 0.18, { flip: 1 });
  to(hs, pullT, 0.42, { h: 208, x: 1812 }, "power2.inOut");
  to(hs, pullT, 0.2, { Lt: -40, Ls: 86, Rt: -70, Rs: 60, Lu: 120, Lf: -60, Ru: -120, Rf: 60 }, "power2.out");
  to(hs, pullT + 0.2, 0.25, { Lt: -72, Ls: 64, Rt: -86, Rs: 72, Lu: 20, Lf: -24, Ru: -8, Rf: -20, swing: 0.9, turn: 0.6 }, "power2.out");
  face(hs, pullT + 0.3, 0.2, "happy", { px: 2.5, py: 1, open: 0.5 });
  to(ts, grabT + 0.2, 0.3, { Lu: -52, Lf: -6, px: 3, py: 3, r: 10 }, "power2.out");            /* the big one reaches down */
  to(ts, pullT + 0.35, 0.3, { Lu: 14, Lf: -20, r: 0, px: 3, py: 1 }, "power2.out");
  face(ts, pullT + 0.3, 0.2, "laugh", { px: 3, py: 1 });
  /* below: the little one looks up and bounces; the friend turns a cartwheel */
  to(ds, grabT, 0.25, { headR: -12, py: -3, px: -2, Lu: 150, Ru: -150 }, "sine.inOut");
  set(ds, grabT, { flip: -1 });
  [0, 1, 2, 3].forEach((k) => hop(ds, grabT + 0.2 + k * 0.32, 0.26, 9));
  face(fs, grabT - 0.3, 0.2, "keen", {});
  set(fs, grabT - 0.02, { flip: 1, gnd: 0, h: standK });
  to(fs, grabT, 0.62, { r: 360, x: 2052 }, "sine.inOut");
  to(fs, grabT, 0.3, { h: 86, Lu: 176, Ru: -176, Lf: 0, Rf: 0, Lt: -34, Rt: 30 }, "sine.out");
  to(fs, grabT + 0.32, 0.3, { h: standK, Lu: 6, Ru: -4, Lf: -6, Rf: -6, Lt: 0, Rt: 0 }, "sine.in");
  set(fs, grabT + 0.63, { r: 0, gnd: 1, h: 0 });
  fr.lx = 2052;
  face(fs, grabT + 0.66, 0.2, "laugh", {});
  hop(fs, grabT + 0.7, 0.24, 12);
  to(fs, grabT + 0.66, 0.2, { Lu: 160, Ru: -160 }, "back.out(2)"); to(fs, grabT + 1.1, 0.3, { Lu: 6, Ru: -4 }, "sine.inOut");
  /* it jumps down */
  to(hs, landT - 0.42, 0.14, { Lu: 60, Ru: -60, r: 10, swing: 0 }, "power2.out");
  set(hs, landT - 0.26, { flip: -1 });
  to(hs, landT - 0.26, 0.26, { x: 1764 }, "none");
  to(hs, landT - 0.26, 0.26, { h: crouchK }, "power2.in");
  to(hs, landT - 0.26, 0.24, Object.assign({}, HP.crouch, { Lu: 150, Ru: -150, Lf: 0, Rf: 0, r: 0 }), "power1.in");
  set(hs, landT, { gnd: 1, h: 0 });
  hero.lx = 1764;
  dust(landT, 1764, 6);
  to(hs, landT, 0.1, { sy: 0.9, sx: 1.07, Lu: 40, Ru: 30 }, "power2.out"); to(hs, landT + 0.1, 0.3, { sy: 1, sx: 1 }, "elastic.out(1,0.45)");
  pz(hero, landT + 0.1, 0.2, "stand", { Lu: 6, Ru: -4, Lf: -6, Rf: -6, turn: 0.6 }, "back.out(1.6)");
  face(hs, landT + 0.1, 0.2, "laugh", { px: 3, py: 0, open: 0.7 });
  /* and they race, there and back. They are slower on the way back. */
  go(fr, landT - 0.05, 0.75, 1650);
  go(hero, landT + 0.3, 0.42, 1640);
  go(hero, landT + 0.8, 0.56, 1790, { amp: 0.8 });
  go(fr, landT + 0.85, 0.35, 1682, { amp: 0.6 });
  go(tod, landT + 0.1, 0.7, 1790, { amp: 0.7 });
  to(ds, landT, 0.2, { headR: 0, py: 0, px: 2, Lu: 62, Ru: -70 }, "sine.inOut");
  face(hs, landT + 0.85, 0.3, "pant", { px: 3, py: 0 });
  /* the big one comes down */
  to(ts, landT + 0.3, 0.14, { r: 14, swing: 0, Lu: 60, Ru: -40 }, "power2.out");
  to(ts, landT + 0.44, 0.26, { y: GY, x: 1902 }, "power2.in");
  to(ts, landT + 0.44, 0.24, Object.assign({}, HP.crouch, { r: 0 }), "power1.in");
  set(ts, landT + 0.7, { gnd: 1 });
  pz(teen, landT + 0.72, 0.25, "stand", { Lu: 8, Ru: -6, Lf: -6, Rf: -6 }, "back.out(1.6)");
  teen.lx = 1902;
  dust(landT + 0.7, 1902, 5);

  /* ================================================================= H5: worn out and calm */
  const h4 = H[4], flopT = HK.flopT;
  go(hero, h4 + 0.08, 0.36, 1842, { amp: 0.45 });
  set(hs, h4 + 0.5, { flip: -1 });
  to(hs, h4 + 0.3, 0.3, { breath: 3 }, "none");
  pz(hero, h4 + 0.52, 0.2, "crouch", { r: 0, Lu: 30, Ru: 24, turn: 0.4 }, "power2.out");
  pz(hero, flopT - 0.03, 0.3, "out", { r: -22, Lu: 40, Lf: 12, Ru: 32, Rf: 10, headR: 6 }, "power2.out");
  dust(flopT + 0.05, 1842, 4);
  face(hs, h4 + 0.5, 0.3, "pant", { px: 2, py: 1 });
  to(hs, h4 + 1.9, 0.9, { breath: 1.5 }, "none");
  face(hs, h4 + 2.0, 0.6, "bliss", { px: 2, py: 1.5, mouth: 0.75, lid: 0.44, lidL: 0.3 });
  /* the friend sits down too */
  set(fs, h4 + 0.25, { flip: -1 });
  to(fs, h4 + 0.2, 0.3, { breath: 3 }, "none");
  pz(fr, h4 + 0.3, 0.3, "knees", { Lu: -50, Lf: -74, Ru: -58, Rf: -62, r: -4 }, "power2.out");
  face(fs, h4 + 0.3, 0.3, "pant", { px: 0, py: 1 });
  to(fs, h4 + 1.2, 0.3, { turn: -0.8, px: -2.5 }, "sine.inOut");
  face(fs, h4 + 1.9, 0.6, "happy", { px: -2.5, py: 0.5, lid: 0.3 });
  to(fs, h4 + 1.9, 0.9, { breath: 1.5 }, "none");
  /* the big one takes the little one home */
  go(teen, h4 + 0.15, 0.3, 1840, { amp: 0.45 });
  to(ts, h4 + 0.5, 0.25, { Lu: -50, Lf: -10 }, "sine.inOut");
  go(teen, h4 + 0.95, 1.6, 2150, { amp: 0.5 });
  go(tod, h4 + 0.95, 1.6, 2112, { amp: 0.62 });
  to(ds, h4 + 0.7, 0.25, { Lu: -150, Lf: 0, Ru: -40, Rf: 10, px: 2 }, "sine.inOut");
  face(ts, h4 + 0.5, 0.3, "happy", { px: 2, py: 2 });
  /* a wave back */
  to(hs, h4 + 1.25, 0.25, { Ru: 150, Rf: 10, turn: -0.7, px: -2.5 }, "back.out(1.6)");
  [0, 1].forEach((k) => { to(hs, h4 + 1.5 + k * 0.22, 0.11, { Rf: 30 }, "sine.inOut"); to(hs, h4 + 1.61 + k * 0.22, 0.11, { Rf: -6 }, "sine.inOut"); });
  to(hs, h4 + 2.0, 0.3, { Ru: 32, Rf: 10, turn: 0.4 }, "sine.inOut");
  /* the adult puts her work down and watches them */
  to(W, h4 + 0.8, 0.4, { weave: 0 }, "none");
  to(as, h4 + 0.9, 0.4, { turn: 0.9, headR: 0, Lu: -20, Lf: -50, Ru: -14, Rf: -56 }, "sine.inOut");
  face(as, h4 + 0.9, 0.4, "happy", { px: 3, py: 0.5, lid: 0.2 });

  /* ================================================================= the change: a schoolroom is put down here */
  const h5 = H[5], floorT = HK.floorT, wallT = HK.wallT, chairT = HK.chairT, deskT = HK.deskT, boardT = HK.boardT, clockT = HK.clockT;
  to(Wd, h5 + 0.05, 0.55, { night: 0 }, "sine.inOut");
  to(Rm, floorT, 0.62, { floor: 1 }, "power1.inOut");
  set(W, floorT + 0.3, { basket: 0 });
  to(Rm, wallT - 0.25, 0.6, { wall: 1 }, "bounce.out");
  SHAKES.push([wallT - 0.02, 9], [deskT + 0.05, 3], [boardT, 5]);
  to(Rm, chairT, 0.3, { chH: 1, chA: 1 }, "back.out(2.2)");
  to(Rm, deskT, 0.28, { dkH: 1, dkA: 1 }, "back.out(2.2)");
  to(Rm, boardT - 0.22, 0.5, { board: 1 }, "bounce.out");
  to(Rm, clockT, 0.3, { clock: 1 }, "back.out(3)");
  /* the two children: a start at each thing that lands, and then they find themselves on chairs */
  [[hero, hs, SX, 0], [fr, fs, SA_, 0.06]].forEach(([p, s, sx_, dl], i) => {
    hop(s, floorT + 0.34 + dl, 0.16, 4);
    face(s, floorT + 0.3 + dl, 0.15, "alert", { px: 2, py: 2.5 });
    hop(s, wallT + dl, 0.18, 7);
    face(s, wallT + dl, 0.1, "shock", { px: -3, py: -2 });
    to(s, wallT + dl, 0.14, { turn: -0.9, headR: -8 }, "power2.out");                           /* they look round at the wall */
    const lowNow = p.low(i ? HP.knees : HP.out, i ? -4 : -22);
    set(s, chairT + dl, { gnd: 0, h: lowNow });
    to(s, chairT + dl, 0.3, Object.assign({}, HP.chair, { h: SEAT, r: 0, x: sx_, Lu: -6, Lf: -40, Ru: -4, Rf: -44, headR: 0, breath: 1 }), "back.out(1.8)");
    face(s, chairT + dl, 0.15, "shock", { px: 0, py: 3 });
    to(s, chairT + 0.2 + dl, 0.2, { turn: 0.4 }, "sine.inOut");
    to(s, deskT + 0.05 + dl, 0.2, { Lu: -35, Lf: -75, Ru: -30, Rf: -80 }, "back.out(2)");       /* hands on the desk that has come up */
    face(s, deskT + 0.1 + dl, 0.3, "puzzled", { px: 2, py: 2.5 });
    to(s, boardT + 0.05 + dl, 0.2, { turn: 0.7, px: 3, py: -1.5 }, "sine.inOut");               /* the board, the clock */
    to(s, clockT + 0.1 + dl, 0.25, { py: -3, headR: i ? -6 : -10 }, "sine.inOut");
  });
  hero.lx = SX; fr.lx = SA_;
  mark(fx, deskT + 0.3, hero.topP(34), "?", { dur: 0.7, s: 0.62 });
  /* the adult starts too, gets up, and turns to the board */
  hop(as, wallT + 0.03, 0.18, 6);
  face(as, wallT + 0.03, 0.1, "shock", { px: -3, py: -2 });
  to(as, wallT + 0.03, 0.14, { turn: -0.9 }, "power2.out");
  pz(ad, h5 + 1.3, 0.22, "crouch", { r: 12, Lu: 20, Lf: -20, Ru: 10, Rf: -30, turn: 0.4, headR: 0 }, "power2.out");
  pz(ad, h5 + 1.52, 0.3, "stand", { r: 0, Lu: 6, Lf: -6, Ru: -4, Rf: -6, Lz: 1, Rz: 0 }, "back.out(1.5)");
  face(as, h5 + 1.5, 0.3, "puzzled", { px: 2, py: 0 });
  to(as, boardT + 0.02, 0.2, { turn: -0.8, px: -3, py: -1 }, "sine.inOut");
  set(as, h5 + 2.75, { flip: -1, turn: 0.5 });
  face(as, h5 + 2.75, 0.3, "calm", { px: 3, py: -1.5, mouth: 0.1 });

  /* ================================================================= school */
  const h6 = H[6], h7 = H[7], h8 = H[8], h9 = H[9], h10 = H[10];
  /* the teacher writes a row on the board */
  const writeRow = (r, t, d) => {
    const up = -150 + r * 14;
    to(as, t - 0.25, 0.25, { Lu: up, Lf: -4, Lz: 2, turn: 0.5, px: 3, py: -2 + r * 0.8 }, "power2.out");
    to(W, t - 0.05, 0.1, { write: 1 }, "none");
    to(Rm, t, d, { ["s" + r]: 1 }, "none");
    to(as, t, d, { Lu: up + 14, Lf: -62 }, "none");
    to(W, t + d, 0.1, { write: 0 }, "none");
  };
  writeRow(0, h6 + 0.3, 1.0);
  writeRow(1, h6 + 1.65, 1.0);
  writeRow(2, h7 + 0.45, 1.1);
  writeRow(3, h8 + 0.4, 1.2);
  /* --- X1: the need is still there. It watches the board, and then the tree in the window. */
  face(hs, h6, 0.3, "calm", { px: 3, py: -1 });
  to(hs, h6, 0.3, { headR: 0, turn: 0.6 }, "sine.inOut");
  to(hs, HK.lookT, 0.3, { turn: -0.9, headR: -9 }, "sine.inOut");
  face(hs, HK.lookT, 0.35, "restless", { px: -3, py: -2, mouth: -0.1, brow: -0.5, pup: 1.15, lid: 0.04 });
  to(hs, HK.lookT + 0.3, 0.6, { swing: 1 }, "none");
  /* the friend props its chin on its hand */
  face(fs, h6, 0.3, "calm", { px: 3, py: -1 });
  to(fs, h6, 0.3, { headR: 0, turn: 0.6 }, "sine.inOut");
  to(fs, h6 + 0.6, 0.4, { Lu: -40, Lf: -128, Lz: 2, headR: 11, r: 8 }, "sine.inOut");
  face(fs, h6 + 0.7, 0.5, "bored", { px: 3, py: -0.5 });
  /* --- X2: sitting still feels bad */
  to(hs, h7 + 0.1, 0.3, { turn: 0.4, headR: 4 }, "sine.inOut");
  face(hs, h7 + 0.1, 0.3, "restless", { px: 2, py: 2 });
  to(hs, h7 + 0.2, 0.3, { jig: 1, swing: 0.4 }, "none");
  to(W, h7 + 0.3, 0.1, { tap: 1 }, "none"); to(W, h7 + 1.0, 0.1, { tap: 0 }, "none");
  to(hs, h7 + 1.05, 0.35, { Lu: -40, Lf: -128, Lz: 2, headR: 11, r: 8 }, "sine.inOut");       /* chin on its hand */
  face(hs, h7 + 1.1, 0.4, "bored", { px: 2, py: 1 });
  to(hs, h7 + 1.7, 0.2, { r: -1 }, "sine.inOut"); to(hs, h7 + 1.9, 0.2, { r: 10 }, "sine.inOut"); to(hs, h7 + 2.1, 0.2, { r: 4 }, "sine.inOut");
  to(hs, h7 + 2.1, 0.3, { headR: -6 }, "sine.inOut");
  face(hs, h7 + 2.1, 0.3, "strain", { px: 1.5, py: -3 });                                     /* the clock */
  /* --- X3: it fidgets and gets up */
  to(hs, h8, 0.25, { Lu: -30, Lf: -78, Lz: 1, headR: 0, r: 0, turn: 0.4 }, "sine.inOut");
  face(hs, h8, 0.3, "strain", { px: 2, py: 1 });
  to(W, h8 + 0.1, 0.3, { rock: 1 }, "sine.inOut"); to(W, HK.offT - 0.3, 0.22, { rock: 0 }, "sine.inOut");
  const offT = HK.offT, winT = HK.winT;
  to(hs, offT - 0.08, 0.1, { jig: 0, swing: 0 }, "none");
  pz(hero, offT, 0.2, "stand", { h: standK + 7, Lu: 6, Lf: -6, Ru: -4, Rf: -6 }, "power2.out");
  to(hs, offT + 0.2, 0.1, { h: standK }, "power2.in");
  set(hs, offT + 0.3, { gnd: 1, h: 0 });
  face(hs, offT, 0.2, "keen", { px: -3, py: -1 });
  to(hs, offT, 0.2, { turn: -0.6 }, "sine.inOut");
  go(hero, offT + 0.34, 0.74, 1928, { amp: 0.7 });
  to(hs, offT + 0.34, 0.2, { turn: 0.7, px: 3 }, "none");
  to(hs, winT - 0.14, 0.24, { Lu: -128, Lf: -8, Ru: -118, Rf: -10, Rz: 1, h: 7, headR: -11, turn: 0.8 }, "back.out(1.6)");   /* on its toes at the sill */
  face(hs, winT - 0.1, 0.3, "awe", { px: 3, py: -3, mouth: 0.55, open: 0.3 });
  to(fs, offT + 0.4, 0.3, { turn: -0.9, headR: 0, r: 0, Lu: -35, Lf: -75, Lz: 1 }, "sine.inOut");                           /* the friend watches it go */
  face(fs, offT + 0.45, 0.3, "puzzled", { px: -3, py: -0.5 });
  face(fs, winT + 0.15, 0.3, "happy", { px: -3, py: -1, lid: 0.15 });
  /* --- X4: it is told to sit down */
  const toldT = HK.toldT, backT = HK.backT, sitT = HK.sitT;
  set(as, toldT - 0.08, { flip: 1, turn: 0.7 });
  face(as, toldT - 0.05, 0.12, "speak", { px: 3, py: 0 });
  to(as, toldT - 0.05, 0.2, { Lu: -84, Lf: -4, Lz: 2, headR: 0 }, "back.out(1.6)");
  to(W, toldT, 0.16, { bubble: 1 }, "back.out(2.5)");
  to(as, toldT + 0.55, 0.3, { Lu: -52, Lf: -6 }, "sine.inOut");                                /* the hand points down: sit */
  [0, 1, 2].forEach((k) => { to(as, toldT + 0.1 + k * 0.24, 0.12, { open: 0.15 }, "sine.inOut"); to(as, toldT + 0.22 + k * 0.24, 0.12, { open: 0.45 }, "sine.inOut"); });
  to(W, toldT + 1.25, 0.15, { bubble: 0 }, "power2.in");
  face(as, toldT + 0.95, 0.3, "calm", { px: 3, py: 0.5, mouth: 0, browOn: 0.5, brow: 0.1 });
  to(as, toldT + 1.5, 0.4, { Lu: 6, Lf: -6, Lz: 1 }, "sine.inOut");
  set(as, sitT + 0.3, { flip: -1, turn: 0.5 });
  face(as, sitT + 0.3, 0.3, "calm", { px: 3, py: -1.5, mouth: 0.1, browOn: 0 });
  /* the child starts, lets go of the sill, and walks back with its head down */
  hop(hs, toldT + 0.12, 0.16, 5);
  to(hs, toldT + 0.1, 0.12, { turn: -0.8, headR: 0 }, "power2.out");
  face(hs, toldT + 0.1, 0.1, "shock", { px: -3, py: 0, mouth: -0.45, open: 0.3 });      /* v7: the stock shock mouth curved up and read as a smile */
  to(hs, toldT + 0.3, 0.3, { Lu: 6, Lf: -6, Ru: -4, Rf: -6 }, "power2.out");
  face(hs, toldT + 0.5, 0.3, "shame", { px: -2, py: 2.5 });
  go(hero, backT, 0.62, SX, { amp: 0.4 });
  to(hs, backT, 0.3, { turn: 0.3, headR: 13, px: 1 }, "sine.inOut");
  set(hs, backT + 0.66, { gnd: 0, h: standK });
  to(hs, backT + 0.68, 0.22, { h: standK + 6 }, "power2.out");
  to(hs, backT + 0.9, 0.3, Object.assign({}, HP.chair, { h: SEAT, Lu: -35, Lf: -75, Ru: -30, Rf: -80 }), "power2.inOut");
  /* the friend looks at its desk at once */
  to(fs, toldT + 0.2, 0.15, { turn: 0.4, r: 6, headR: 8 }, "power2.out");
  face(fs, toldT + 0.2, 0.15, "alert", { px: 2, py: 3 });
  face(fs, toldT + 1.2, 0.5, "bored", { px: 2, py: 2.5 });
  /* --- X5: the restless feeling stays all day */
  to(hs, h10 + 0.1, 0.3, { jig: 1, swing: 0.5 }, "none");
  face(hs, h10 + 0.1, 0.3, "restless", { px: 2, py: 2 });
  to(hs, h10 + 0.85, 0.25, { turn: -0.6, headR: 2 }, "sine.inOut");                            /* the window */
  face(hs, h10 + 0.85, 0.25, "restless", { px: -3, py: -2, pup: 1.1 });
  to(as, h10 + 1.25, 0.2, { turn: -0.8, px: -3, py: 1 }, "sine.inOut");                        /* the teacher looks round */
  to(as, h10 + 1.72, 0.25, { turn: 0.5, px: 3, py: -1 }, "sine.inOut");
  to(hs, h10 + 1.42, 0.14, { turn: 0.3, headR: 9 }, "power2.out");
  face(hs, h10 + 1.42, 0.14, "strain", { px: 1, py: 3 });
  /* it makes its body sit still. Hands under its legs, eyes on the desk. */
  const stillT = HK.stillT;
  to(hs, stillT, 0.3, { jig: 0, swing: 0, Lu: 10, Lf: -22, Ru: 6, Rf: -24, r: 5, sy: 0.975 }, "power2.out");
  to(hs, stillT + 0.5, 0.5, { shiver: 0.4 }, "none");
  face(hs, stillT + 1.5, 0.25, "strain", { px: -3, py: -2.5 });                                /* one more look at the tree, eyes only */
  face(hs, stillT + 2.1, 0.5, "strain", { px: 1, py: 3, lid: 0.46, mouth: -0.6 });
  /* the friend puts its head down on its arm */
  to(fs, h10 + 1.0, 0.6, { r: 24, headR: 22, Lu: -62, Lf: -100, Lz: 2, Ru: -50, Rf: -96 }, "sine.inOut");
  face(fs, h10 + 1.1, 0.6, "bored", { px: 2, py: 3, lid: 0.62, lidL: 0.3 });
  writeRow(4, h10 + 2.3, 1.3);

  /* the clock: nine when it is hung up, three when the film ends */
  const CK = [[clockT, 9], [h7, 10], [h8, 11], [h9, 11.75], [h10, 12.25], [h10 + 0.5, 12.5], [h10 + 4.4, 15], [END + 2, 15.1]];
  const clockAt = (t) => {
    if (t <= CK[0][0]) return 9;
    for (let i = 1; i < CK.length; i++) if (t < CK[i][0]) { const u = (t - CK[i - 1][0]) / (CK[i][0] - CK[i - 1][0]); return lerp(CK[i - 1][1], CK[i][1], i === 6 ? ss(u) : u); }
    return 15.1;
  };

  /* ================================================================= draw */
  const smoke = G([0, 1, 2, 3, 4, 5].map(() => '<circle r="10" class="f-cloud"/>').join(""), $("esmoke")), smk = Array.from(smoke.children);
  const flames = qa($("efire"), ".fl"), cbe = qa(E.tree, ".cbe").concat(qa(E.canF, ".cbe")).map((e) => ({ e, p: +e.dataset.p }));
  const flclip = $("eflclipr"), flroll = $("eflroll"), lightF = $("elightF");
  const [rx0, , rx1] = EP.room, [fy0, fy1] = EP.floor;
  const chk = (g, x, k, a) => { OP(g, k > 0.01 ? 1 : 0); place(g, x, GY, a || 0, 1, Math.max(0.01, k)); };
  draws.push((t) => {
    /* the room parts (cheap, and they must be hidden before the change) */
    OP(E.wall, Rm.wall > 0.001 ? 1 : 0); TR(E.wall, "translate(0 " + f1(-(1 - Rm.wall) * 1000) + ")");
    OP(E.board, Rm.board > 0.001 ? 1 : 0); TR(E.board, "translate(0 " + f1(-(1 - Rm.board) * 640) + ")");
    OP(E.clock.g, Rm.clock > 0.01 ? 1 : 0);
    OP(E.floor, Rm.floor > 0.001 ? 1 : 0);
    OP(bubble, W.bubble > 0.01 ? 1 : 0);
    if (!inView(1760, 760, 620)) { OP(E.kids, 0); OP(E.back, 0); OP(E.front, 0); return; }
    OP(E.kids, 1); OP(E.back, 1); OP(E.front, 1);
    place(E.clock.g, EP.clock[0], EP.clock[1], 0, Math.max(0.01, Rm.clock));
    const ck = clockAt(t);
    rot(E.clock.hh, (ck % 12) * 30, 0, 0); rot(E.clock.mh, (ck % 1) * 360, 0, 0);
    SA(flclip, "width", f1(Rm.floor * (rx1 - rx0)));
    OP(flroll, Rm.floor > 0.001 && Rm.floor < 0.999 ? 1 : 0); place(flroll, rx0 + Rm.floor * (rx1 - rx0), (fy0 + fy1) / 2, 0, 1);
    OP(E.canF, Rm.wall > 0.3 ? 0 : 1);
    E.scr.forEach((e, i) => SA(e, "stroke-dashoffset", f2(1 - Rm["s" + i])));
    /* the light from the window moves over the floor as the day goes */
    const dayU = sat((ck - 9) / 6);
    OP(lightF, Rm.wall > 0.99 ? 0.3 + 0.12 * dayU : 0);
    TR(lightF, "translate(" + f1(lerp(1930, 1742, dayU)) + " " + (fy0 + 6) + ") skewX(" + f1(lerp(18, -30, dayU)) + ")");
    SA(lightF, "fill", dayU > 0.6 ? "#FFE7B0" : "#FFF6D2");
    /* camp fire, smoke, leaves */
    smk.forEach((e, i) => { const u = ((t * 0.22 + i / 6) % 1 + 1) % 1; place(e, 1716 + sin(u * 5 + i) * 9 + u * 34, 690 - u * 150, 0, 0.5 + u * 1.5); OP(e, (1 - u) * 0.5 * sat(u * 8)); });
    flames.forEach((e, i) => TR(e, "translate(1716 708) scale(" + f2(1 + 0.12 * sin(t * 11 + i * 2)) + " " + f2(1 + 0.2 * sin(t * 13 + i)) + ") translate(-1716 -708)"));
    cbe.forEach((c) => TR(c.e, "translate(" + f1(sin(t * 0.8 + c.p) * 2.6) + " " + f1(cos(t * 0.63 + c.p * 1.7) * 1.8) + ")"));
    /* things */
    OP(basket, W.basket); place(basket, EP.adult[0] + 46, GY + 3, 0, 1);
    const a = W.rock * (4.5 + 4.5 * sin(t * 6.5));
    chk(chairH, SX, Rm.chH, a); chk(chairA, SA_, Rm.chA, 0); chk(deskH, SX - 58, Rm.dkH, 0); chk(deskA, SA_ - 58, Rm.dkA, 0);
    /* people: phase from distance, and the small loops that ride on the poses */
    PEOPLE.forEach((p, i) => { p.st.ph = Bake.at("hu" + i + ".ph", t); });
    const sv = [as.Lu, as.Lf, as.Rf, hs.Rf, hs.x, hs.h, hs.r];
    as.Lf += 9 * sin(t * 5.2) * W.weave + 5 * sin(t * 23) * W.write; as.Rf += 9 * sin(t * 5.2 + 2) * W.weave; as.Lu += 4 * sin(t * 2.6) * W.weave + 2.5 * sin(t * 17) * W.write;
    hs.Rf += 15 * Math.max(0, sin(t * 19)) * W.tap;
    if (W.hang > 0.5) {           /* it hangs from the branch by its hands and swings */
      const r = 15 * sin((t - grabT) * 2 * PI / 0.7) / 57.2958;
      hs.r = r * 57.2958 * hs.flip; hs.x = 1800 - 84 * sin(r); hs.h = 182 - 84 * cos(r);
    } else if (a > 0.01) {        /* it rocks on the back legs of its chair */
      const ar = a / 57.2958;
      hs.x = SX + 17 - 17 * cos(ar) + SEAT * sin(ar); hs.h = SEAT * cos(ar) + 17 * sin(ar); hs.r = a * -hs.flip;
    }
    PEOPLE.forEach((p) => p.draw(t));
    as.Lu = sv[0]; as.Lf = sv[1]; as.Rf = sv[2]; hs.Rf = sv[3]; hs.x = sv[4]; hs.h = sv[5]; hs.r = sv[6];
    if (W.bubble > 0.01) { const p = ad.at(30, ad.dims.hy - ad.dims.hr - 8); place(bubble, p[0] + 26, p[1], 0, W.bubble); }
  });

  /* ================================================================= the child's feeling.
     Checked against the five rules in finale.js. Green = feels right, red = feels wrong. */
  const GLOW = [
    [H[0] + 1.5, "red", 0.22, 1.2],            /* it sees the others play: wanting */
    [H[1] + 0.1, "red", 0.6, 2.2],             /* still sitting */
    [runT + 0.1, "red", 0.25, 0.55],           /* moving, and they are close */
    [tagT, "green", 0.5, 0.3],                 /* tagged: it is in the game */
    [H[3] - 0.6, "green", 0.9, 0.6],
    [grabT + 0.7, "green", 1, 0.4],
    [H[3] + 3.5, "green", 0.9, 0.5],
    [H[4] + 0.3, "green", 0.5, 1.6],           /* worn out and calm */
    [wallT - 0.02, "red", 0.3, 0.08],          /* the thud of the wall: a start. Nothing in a desk says danger */
    [wallT + 0.3, "red", 0, 0.35],             /* it is rested: for now nothing presses */
    [HK.lookT + 0.2, "red", 0.25, 1.0],        /* it has sat a while. The tree is in the window */
    [H[7] + 0.1, "red", 0.65, 2.4],
    [H[8] + 0.1, "red", 0.75, 0.7],
    [offT + 0.05, "red", 0.3, 0.4],            /* on its feet, moving */
    [winT - 0.1, "green", 0.45, 0.35],         /* at the window, the tree in sight */
    [toldT + 0.1, "red", 0.6, 0.12],           /* told to sit: this is the consequence, and it lands */
    [sitT - 0.2, "red", 0.75, 0.6],
    [H[10] + 0.3, "red", 0.8, 1.0],
    [stillT + 0.2, "red", 0.92, 1.6],          /* the body sits still. The feeling does not */
  ];
  Object.assign(S.A, { hero, hs, ad, as, fr, HGLOW: GLOW, Rm });
})(ST);
