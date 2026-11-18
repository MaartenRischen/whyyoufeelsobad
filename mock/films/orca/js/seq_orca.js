/* seq_orca.js - the orca. It swims with its family, goes after a salmon and finds itself apart,
   calls, is answered, and swims back to them. Then a tank is put down in the same water: a floor,
   a wall between it and them, a second wall. It calls again and the call ends at the wall.
   Played straight: no slapstick, no marks. The feeling track is at the bottom; the face says the same. */
(function (S) {
  const { $, to, set, face, draws, cut, Wd, SHAKES, puff, ring, burst, call, aqua, fx, splash, tankcalls, inView } = S;
  const B = K.B, WY = SEA.wy, [TX0, TX1] = SEA.tank;
  const school = G("", aqua, "school");
  const SAL = [];
  (function () { const R = rng(41); for (let i = 0; i < 6; i++) SAL.push(Object.assign(makeSalmon(school, i), { dx: i * 46 + R() * 20, dy: (R() - 0.5) * 90, p: R() * 6, vx: -520 - R() * 160, vy: (i % 2 ? 1 : -1) * (30 + R() * 110) })); })();
  const bull = makeOrca(aqua, { kind: "bull", s: 1.25, seed: 3 });
  const mum = makeOrca(aqua, { kind: "mum", s: 1.1, seed: 2 });
  const calf = makeOrca(aqua, { kind: "calf", s: 0.55, seed: 4 });
  const hero = makeOrca(aqua, { kind: "mid", s: 0.9, seed: 1 });
  const hs = hero.st, ms = mum.st, bs = bull.st, cs = calf.st;
  const POD = [hero, mum, bull, calf];
  /* a paper puppet turns round by going edge-on */
  const turn = (st, t, d, flip) => { to(st, t, d * 0.5, { sx: 0.06 }, "power2.in"); set(st, t + d * 0.5, { flip }); to(st, t + d * 0.5, d * 0.5, { sx: 1 }, "power2.out"); };
  const head = () => hero.at(104, -30);                 /* the forehead: where a call leaves */
  const blowAt = (p, t, n) => puff(splash, t, () => p.at(42, -46)[0], WY - 6, { n: n || 8, r: 8, v: 58, a0: -PI * 0.72, a1: -PI * 0.28, rise: 70, life: 0.9, cls: "foam", seed: Math.round(t * 10) });

  /* ================================================================= where everyone starts */
  Object.assign(hs, { x: 330, y: 770 }, FACE.happy, { px: 3, py: -1.5 });
  Object.assign(ms, { x: 560, y: 650 }, FACE.calm, { px: 2, mouth: 0.5 });
  Object.assign(bs, { x: 790, y: 500 }, FACE.calm, { px: 2, mouth: 0.4 });
  Object.assign(cs, { x: 420, y: 556 }, FACE.happy, { px: 2 });

  /* ================================================================= the camera */
  const chaseT = K.chaseT, snapT = chaseT + 1.0, lostT = K.lostT, goT = K.goT, meetT = K.meetT, breathT = K.breathT;
  cut(B[1] + 0.5, B[1] + 1.8, [110, 370, 760]);
  cut(B[2] - 0.1, B[2] + 1.0, [0, 0, 1080]);
  cut(goT + 0.05, meetT + 0.2, [1240, 0, 1080]);
  cut(B[5] + 0.3, B[5] + 1.6, [900, 0, 1080]);
  cut(B[6] + 0.5, B[6] + 1.7, [1180, 150, 800]);
  cut(B[7] + 1.0, B[7] + 2.4, [900, 0, 1080]);
  cut(B[9] + 0.1, B[9] + 1.3, [1060, 290, 760]);
  cut(B[10] + 0.2, B[10] + 1.9, [900, 0, 1080]);

  /* ================================================================= 1. it needs its family
     They travel together. It keeps close to its mother. Then salmon come by underneath. */
  to(hs, 0, chaseT, { x: 444 }, "none");
  to(ms, 0, chaseT + 0.3, { x: 686 }, "none");
  to(bs, 0, chaseT + 0.3, { x: 916 }, "none");
  to(cs, 0, chaseT + 0.3, { x: 546 }, "none");
  to(hs, 0.3, 0.7, { y: 726 }, "sine.inOut");                          /* up against her side */
  to(ms, 0.6, 0.3, { px: -3, py: 2 }, "sine.inOut"); face(ms, 0.7, 0.3, "happy", { px: -3, py: 2 });
  face(hs, 0.8, 0.3, "bliss", { px: 2, py: -2 });
  to(ms, B[0] + 0.8, 0.3, { px: 2, py: 0 }, "sine.inOut");
  face(hs, B[0] + 0.8, 0.25, "keen", { px: 4, py: 3 });                /* it has seen the fish */
  /* it dives for them, snaps, misses, and follows them a little way */
  to(hs, chaseT, 1.0, { x: 470, y: 950 }, "power1.inOut");
  to(hs, snapT - 0.24, 0.14, { open: 0.9 }, "power2.out"); to(hs, snapT, 0.07, { open: 0 }, "none");
  turn(hs, snapT + 0.15, 0.28, -1);
  to(hs, snapT + 0.35, 0.55, { x: 330, y: 1004 }, "power1.out");
  face(hs, snapT + 0.2, 0.3, "keen", { px: 4, py: 1 });
  /* the others swim on */
  to(ms, chaseT + 0.3, 1.55, { x: 1560, y: 610 }, "power1.in");
  to(bs, chaseT + 0.3, 1.55, { x: 1780 }, "power1.in");
  to(cs, chaseT + 0.3, 1.55, { x: 1650, y: 780 }, "power1.in");
  face(ms, chaseT + 0.3, 0.3, "calm", { px: 2, mouth: 0.4 });

  /* ================================================================= 2. apart
     It turns round. The water is empty. It comes up, looks one way, looks the other. */
  turn(hs, lostT, 0.3, 1);
  face(hs, lostT + 0.16, 0.2, "alert", { px: 4, py: -1 });
  to(hs, lostT + 0.7, 0.3, { px: -3 }, "sine.inOut"); to(hs, lostT + 1.1, 0.3, { px: 4 }, "sine.inOut");
  face(hs, lostT + 0.6, 0.5, "search", { px: 4, py: -1 });
  to(hs, B[1] + 0.7, 1.15, { x: 480, y: 800 }, "sine.inOut");
  turn(hs, B[1] + 1.95, 0.26, -1);
  face(hs, B[1] + 2.05, 0.4, "sad", { px: 4, py: 0 });
  turn(hs, B[1] + 2.5, 0.26, 1);

  /* ================================================================= 3. it calls */
  to(hs, B[2], 0.3, { pitch: -8 }, "sine.inOut");
  face(hs, B[2] + 0.1, 0.2, "call", { px: 4, py: -1 });
  K.calls.forEach((tc, i) => {
    to(hs, tc - 0.06, 0.1, { sx: 1.05, sy: 0.95, open: 0.34 }, "power2.out"); to(hs, tc + 0.04, 0.4, { sx: 1, sy: 1, open: 0.12 }, "sine.out");
    call(fx, tc, head, { dirs: [1, -1], n: 3, v: 560, life: 1.6, a: 0.6, w: 6.5, op: 1 });
  });

  /* ================================================================= 4. they call back, and it goes to them */
  /* three voices from where the others went, out of sight to the right */
  K.replies.forEach((tr, j) => call(fx, tr, [2420, 600 + j * 50], { dirs: [-1], n: 2, v: 1150, r0: 1290, a: 0.3 - j * 0.04, life: 1.15, w: 7.5 - j, gap: 0.1, op: 0.95, pw: 0.9 }));
  const hearT = K.hearT;
  face(hs, hearT, 0.18, "hear", { px: 4, py: 0 });
  to(hs, hearT, 0.25, { y: 784, pitch: -13, open: 0 }, "back.out(2)");
  call(fx, B[3] + 0.84, head, { dirs: [1], n: 2, v: 560, life: 1.0, a: 0.5 });      /* it answers at once */
  to(hs, B[3] + 0.78, 0.1, { sx: 1.05, sy: 0.95 }, "power2.out"); to(hs, B[3] + 0.88, 0.3, { sx: 1, sy: 1 }, "sine.out");
  face(hs, goT - 0.1, 0.3, "happy", { px: 4, py: 0, open: 0.15 });
  to(hs, goT, 0.3, { pitch: 0 }, "sine.inOut");
  to(hs, goT, meetT - goT, { x: 1640, y: 664 }, "power2.inOut");
  /* the others come to meet it */
  set(ms, B[1] + 1, { x: 2780, y: 650, flip: -1 }); set(bs, B[1] + 1, { x: 2990, y: 520, flip: -1 }); set(cs, B[1] + 1, { x: 2700, y: 800, flip: -1 });
  to(ms, goT + 0.2, meetT - goT - 0.25, { x: 2010 }, "power2.out");
  to(bs, goT + 0.2, meetT - goT - 0.1, { x: 2150, y: 506 }, "power2.out");
  to(cs, goT + 0.1, meetT - goT - 0.3, { x: 1940 }, "power2.out");
  face(ms, goT, 0.3, "happy", { px: 3 }); face(cs, goT, 0.3, "happy", { px: 3, open: 0.3 }); face(bs, goT, 0.3, "happy", { px: 3 });

  /* ================================================================= 5. back with them
     It pushes its head in under its mother's. The calf bobs round them. They go up for a breath together. */
  to(hs, meetT, 0.5, { x: 1742, y: 716, pitch: -15 }, "sine.inOut");
  to(ms, meetT, 0.5, { y: 640, pitch: 7 }, "sine.inOut");
  face(hs, meetT + 0.2, 0.4, "bliss", { px: 3, py: -2 });
  face(ms, meetT + 0.2, 0.4, "bliss", { px: 2, py: 2 });
  [0, 1].forEach((k) => { to(hs, meetT + 0.55 + k * 0.4, 0.2, { y: 708, x: 1750 }, "sine.inOut"); to(hs, meetT + 0.75 + k * 0.4, 0.2, { y: 718, x: 1740 }, "sine.inOut"); });
  to(cs, meetT, 0.5, { x: 1900, y: 742 }, "sine.inOut"); to(cs, meetT + 0.5, 0.5, { x: 1880, y: 826 }, "sine.inOut"); to(cs, meetT + 1.0, 0.4, { x: 1910, y: 780 }, "sine.inOut");
  to(bs, meetT + 0.1, 0.5, { pitch: 5 }, "sine.inOut"); to(bs, meetT + 0.7, 0.5, { pitch: 0 }, "sine.inOut");
  to(hs, breathT - 1.0, 0.9, { x: 1640, y: 338, pitch: 0 }, "sine.inOut");
  to(ms, breathT - 1.05, 0.95, { x: 2150, y: 348, pitch: 0 }, "sine.inOut");
  to(cs, breathT - 0.9, 0.85, { x: 2040, y: 330 }, "sine.inOut");
  to(bs, breathT - 1.1, 1.0, { x: 2370, y: 356 }, "sine.inOut");
  face(hs, breathT - 0.9, 0.3, "happy", { px: 3, py: 0 }); face(ms, breathT - 0.9, 0.3, "happy", { px: 3, py: 0 });
  blowAt(hero, breathT); blowAt(mum, breathT + 0.12, 10); blowAt(calf, breathT + 0.2, 5);
  [hero, mum, calf].forEach((p, i) => ring(splash, breathT + i * 0.1, () => p.st.x, WY - 1, { r0: 30, r1: 120 * p.st.s, life: 1.0 }));
  to(hs, breathT + 0.45, 0.8, { y: 384 }, "sine.inOut");
  to(ms, breathT + 0.5, 0.8, { y: 394 }, "sine.inOut");
  to(cs, breathT + 0.5, 0.8, { y: 380 }, "sine.inOut");
  to(bs, breathT + 0.4, 0.9, { y: 486 }, "sine.inOut");

  /* ================================================================= the change: a tank is put down here */
  const floorT = K.floorT, wallRT = K.wallRT, wallLT = K.wallLT, poolT = K.poolT, backT = K.backT;
  to(Wd, floorT - 0.05, 0.5, { kelp: 0 }, "power2.in");
  to(Wd, floorT, 0.65, { floor: 1 }, "power2.out");
  SHAKES.push([floorT + 0.55, 4], [wallRT - 0.07, 10], [wallLT - 0.07, 8]);
  /* concrete does not bounce: each wall comes down and stays */
  to(Wd, wallRT - 0.33, 0.26, { wallR: 1 }, "power2.in");
  to(Wd, wallLT - 0.33, 0.26, { wallL: 1 }, "power2.in");
  to(Wd, poolT, 0.8, { pool: 1 }, "sine.inOut");
  to(Wd, poolT, 0.6, { tiles: 1 }, "sine.inOut");
  to(Wd, backT, 0.5, { back: 1 }, "back.out(1.3)");
  [[wallRT, TX1, 31], [wallLT, TX0, 37]].forEach(([tw, x, sd]) => {
    burst(splash, tw - 0.07, x, WY - 2, 16, sd, { a0: -PI * 0.92, a1: -PI * 0.08, v0: 140, v1: 380, g0: 4, g1: 8, cols: ["foam", "sea1", "foam"], grav: 1200 });
    [0, 0.16].forEach((d, i) => ring(splash, tw - 0.05 + d, x + (x > 1400 ? -1 : 1) * (70 + i * 30), WY - 1, { r0: 8, r1: 60, life: 0.8 }));
  });
  /* the others are on the far side of the wall now, and stay there */
  POD.slice(1).forEach((p) => set(p.st, wallRT + 0.4, { vis: 0 }));
  /* it starts at the floor, at the wall, at the second wall; then looks at where they were */
  face(hs, floorT + 0.25, 0.15, "alert", { px: 2, py: 5 });
  face(hs, wallRT - 0.08, 0.08, "shock", { px: 4, py: 0 });
  to(hs, wallRT - 0.05, 0.22, { x: 1596, pitch: -7 }, "power2.out");
  turn(hs, wallLT - 0.02, 0.26, -1);
  face(hs, wallLT + 0.1, 0.15, "shock", { px: 4, py: 0, open: 0.5 });
  turn(hs, B[5] + 2.45, 0.3, 1);
  face(hs, B[5] + 2.6, 0.4, "alert", { px: 4, py: 0 });
  to(hs, B[5] + 2.5, 0.9, { x: 1620, y: 430, pitch: 0 }, "sine.inOut");

  /* ================================================================= 1 again. It goes to the wall where they were. */
  const noseT = K.noseT;
  face(hs, B[6], 0.4, "search", { px: 4, py: 0 });
  to(hs, B[6] + 0.25, 1.2, { x: 1776, y: 560 }, "sine.inOut");
  [0, 0.55].forEach((d) => { to(hs, noseT + d, 0.16, { x: 1782 }, "sine.out"); to(hs, noseT + d + 0.16, 0.22, { x: 1775 }, "sine.inOut"); });
  to(hs, noseT + 0.2, 0.25, { py: -4 }, "sine.inOut"); to(hs, noseT + 0.7, 0.3, { py: 4 }, "sine.inOut");
  /* ================================================================= 2 again. Down the wall, and away from it. */
  to(hs, B[7] + 0.1, 0.9, { y: 740, pitch: 14 }, "sine.inOut");
  face(hs, B[7] + 0.2, 0.5, "sad", { px: 4, py: 2 });
  turn(hs, B[7] + 1.05, 0.3, -1);
  to(hs, B[7] + 1.05, 0.3, { pitch: 0 }, "sine.inOut");
  to(hs, B[7] + 1.35, 1.25, { x: 1440, y: 740 }, "sine.inOut");
  /* ================================================================= 3 again. It calls. The call ends at the walls. */
  turn(hs, B[8] - 0.04, 0.28, 1);
  to(hs, B[8], 0.3, { pitch: -8 }, "sine.inOut");
  face(hs, B[8] + 0.1, 0.2, "call", { px: 4, py: -1 });
  K.tcalls.forEach((tc) => {
    to(hs, tc - 0.06, 0.1, { sx: 1.05, sy: 0.95, open: 0.34 }, "power2.out"); to(hs, tc + 0.04, 0.4, { sx: 1, sy: 1, open: 0.12 }, "sine.out");
    call(tankcalls, tc, head, { dirs: [1, -1], back: 1, n: 3, v: 560, life: 1.6, a: 0.6, w: 6.5, op: 1 });
  });
  /* ================================================================= 4 again. It waits. Nothing comes. */
  face(hs, B[9], 0.3, "hear", { px: 4, py: 0, mouth: -0.1, pup: 1.1 });
  to(hs, B[9], 0.4, { pitch: -4, open: 0 }, "sine.inOut");
  turn(hs, B[9] + 0.9, 0.28, -1);
  face(hs, B[9] + 0.95, 0.4, "search", { px: 4, py: 0 });
  turn(hs, B[9] + 1.45, 0.28, 1);
  const lastCall = K.lastCall;
  to(hs, lastCall - 0.06, 0.1, { sx: 1.03, sy: 0.97, open: 0.26 }, "power2.out"); to(hs, lastCall + 0.04, 0.4, { sx: 1, sy: 1, open: 0 }, "sine.out");
  call(tankcalls, lastCall, head, { dirs: [1, -1], back: 1, n: 2, v: 560, life: 1.3, a: 0.5, op: 0.6, w: 4 });
  face(hs, B[9] + 2.5, 0.6, "flat", { px: 3, py: 2 });
  to(hs, B[9] + 2.5, 0.6, { pitch: 5, y: 756 }, "sine.inOut");
  /* ================================================================= 5 again. Wall to wall, and round again. */
  to(hs, B[10] + 0.25, 1.35, { x: 1764, y: 664, pitch: 0 }, "sine.inOut");
  turn(hs, B[10] + 1.6, 0.34, -1);
  to(hs, B[10] + 1.95, 2.2, { x: 1116, y: 790 }, "sine.inOut");
  turn(hs, B[10] + 4.15, 0.34, 1);
  to(hs, B[10] + 4.5, 2.2, { x: 1764, y: 680 }, "sine.inOut");

  /* ================================================================= motion from the path: tail beat, pitch */
  POD.forEach((p, i) => { Bake.def("o" + i + ".x", () => p.st.x); Bake.def("o" + i + ".y", () => p.st.y); });
  S.after.push(() => POD.forEach((p, i) => {
    const k = "o" + i;
    Bake.vel(k + ".x", k + ".vx"); Bake.vel(k + ".y", k + ".vy");
    const vx = Bake.T[k + ".vx"], vy = Bake.T[k + ".vy"];
    Bake.map(k + ".sp", (j) => Math.min(Math.hypot(vx[j], vy[j]), 800));
    const sp = Bake.T[k + ".sp"];
    Bake.map(k + ".rate", (j) => 2.0 + sp[j] * 0.017);
    Bake.integ(k + ".rate", k + ".ph");
    Bake.spring(k + ".sp", k + ".spl", 90, 16);
    Bake.map(k + ".pit0", (j) => clamp(Math.atan2(vy[j], Math.max(Math.abs(vx[j]), 110)) * 57.3, -36, 36) * sat(sp[j] / 50));
    Bake.spring(k + ".pit0", k + ".pit", 70, 15);
  }));

  draws.push((t) => {
    /* the salmon */
    const sd = t - snapT;
    SAL.forEach((f, i) => {
      let x = 620 + 300 * (snapT - Math.min(t, snapT)) + f.dx, y = 962 + f.dy + sin(t * 2.3 + f.p) * 7, r = 0;
      if (sd > 0) { const e = 1 - Math.exp(-sd * 5); x += f.vx * sd * (0.3 + 0.7 * e); y += f.vy * sd * e; r = Math.atan2(-f.vy * e, -f.vx) * 57.3 * 0.6; }
      if (x < -70 || x > 1160 || !inView(x, y, 60)) { SA(f.g._w, "display", "none"); return; }
      SA(f.g._w, "display", "inline");
      place(f.g, x, y, r, -1.2, 1.2);
      rot(f.tl, sin(t * (sd > 0 ? 34 : 17) + f.p) * 24, -24, 0);
    });
    /* the orcas */
    POD.forEach((p, i) => {
      const st = p.st;
      /* out of the picture: taken off the stage, so nothing of it is left to draw */
      if (st.vis < 0.01 || !inView(st.x, st.y, 330)) { SA(p.g._w, "display", "none"); return; }
      SA(p.g._w, "display", "inline");
      const k = "o" + i, sp = Bake.at(k + ".spl", t);
      const sv = [st.y, st.pitch, st.pec];
      st.sw = Bake.at(k + ".ph", t); st.swA = 4.5 + Math.min(sp, 520) * 0.03;
      st.pitch += Bake.at(k + ".pit", t);
      st.y += sin(t * 1.2 + i * 2.1) * 5 * (1 - sat(sp / 220));
      st.pec += sat(sp / 320) * 20;
      p.draw(t);
      st.y = sv[0]; st.pitch = sv[1]; st.pec = sv[2];
    });
  });

  /* ================================================================= the orca's feeling.
     Checked against the five rules of the ADHD film (coded/js/finale.js): the glow is what the animal's
     own mechanism reads at that moment. Green = feels right, red = feels wrong.
     Dispatch 4823: bad turns good when the answer comes; in the tank it stays bad. */
  const GLOW = [
    [0.3, "green", 0.4, 0.5],                 /* with its family: all in order */
    [chaseT + 0.1, "green", 0.5, 0.4],        /* salmon: something it wants */
    [lostT + 0.25, "red", 0.3, 0.3],          /* it turns round: nobody */
    [B[1] + 1.1, "red", 0.62, 1.2],           /* apart, and it stays that way */
    [B[2] + 0.1, "red", 0.72, 0.8],
    [hearT, "green", 0.45, 0.35],             /* an answer: this is what the call is for */
    [goT + 0.3, "green", 0.65, 0.8],          /* on the way to them */
    [meetT + 0.05, "green", 0.95, 0.4],       /* back with them */
    [breathT + 0.5, "green", 0.6, 0.8],
    [floorT + 0.2, "green", 0.4, 0.3],        /* the floor: unknown, but nothing in it says danger */
    [wallRT - 0.08, "red", 0.5, 0.08],        /* the bang of the wall: a start */
    [wallRT + 0.6, "red", 0.38, 0.6],         /* and they are not there */
    [B[6] + 0.2, "red", 0.52, 1.0],
    [B[7] + 0.1, "red", 0.7, 1.2],
    [B[8] + 0.2, "red", 0.76, 0.6],
    [B[9] + 0.9, "red", 0.9, 1.3],            /* nothing answers the need */
    [B[10] + 0.3, "red", 1, 1.6],             /* and nothing will */
  ];
  Object.assign(S.A, { hero, hs, mum, GLOW,
    top: () => hero.at(-4, -102), bot: () => hero.at(4, 66) });
})(ST);
