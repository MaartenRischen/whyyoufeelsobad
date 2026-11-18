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

  /* ================================================================= where everyone starts */
  Object.assign(hs, { x: 330, y: 770 }, FACE.happy, { px: 3, py: -1.5 });
  Object.assign(ms, { x: 560, y: 650 }, FACE.calm, { px: 2, mouth: 0.5 });
  Object.assign(bs, { x: 790, y: 500 }, FACE.calm, { px: 2, mouth: 0.4 });
  Object.assign(cs, { x: 420, y: 556 }, FACE.happy, { px: 2 });

  /* ================================================================= the camera
     Two moves only: along with it when it swims to the others, and to the tank when the tank comes. */
  const chaseT = K.chaseT, snapT = K.snapT, lostT = K.lostT, goT = K.goT, meetT = K.meetT;
  cut(goT, meetT + 0.1, [1240, 0, 1080]);
  cut(B[5] + 0.1, B[5] + 0.6, [900, 0, 1080]);

  /* ================================================================= 1. it needs its family
     They travel together, it against its mother's side. Then salmon come by underneath and it dives. */
  to(hs, 0, chaseT, { x: 380 }, "none");
  to(ms, 0, chaseT + 0.05, { x: 610 }, "none");
  to(bs, 0, chaseT + 0.05, { x: 840 }, "none");
  to(cs, 0, chaseT + 0.05, { x: 470 }, "none");
  to(hs, 0.05, 0.4, { y: 726 }, "sine.inOut");                         /* up against her side */
  face(ms, 0.15, 0.2, "happy", { px: -3, py: 2 });
  face(hs, 0.2, 0.2, "bliss", { px: 2, py: -2 });
  face(hs, chaseT - 0.15, 0.12, "keen", { px: 4, py: 3 });             /* it has seen the fish */
  to(hs, chaseT, snapT - chaseT, { x: 470, y: 950 }, "power1.inOut");
  to(hs, snapT - 0.14, 0.1, { open: 0.9 }, "power2.out"); to(hs, snapT, 0.05, { open: 0 }, "none");
  turn(hs, snapT + 0.04, 0.16, -1);                                    /* after the fish, away from the others */
  to(hs, snapT + 0.1, 0.16, { x: 400, y: 985 }, "power1.out");
  /* the others swim on */
  to(ms, chaseT + 0.05, 0.8, { x: 1560, y: 610 }, "power1.in");
  to(bs, chaseT + 0.05, 0.8, { x: 1780 }, "power1.in");
  to(cs, chaseT + 0.05, 0.8, { x: 1650, y: 780 }, "power1.in");
  face(ms, chaseT + 0.05, 0.15, "calm", { px: 2, mouth: 0.4 });

  /* ================================================================= 2. apart
     It turns round. The water is empty. It comes up and looks. */
  turn(hs, lostT, 0.18, 1);
  face(hs, lostT + 0.09, 0.1, "alert", { px: 4, py: -1 });
  to(hs, lostT + 0.25, 0.6, { x: 480, y: 800 }, "sine.inOut");
  face(hs, lostT + 0.3, 0.2, "search", { px: 4, py: -1 });
  to(hs, lostT + 0.45, 0.14, { px: -3 }, "sine.inOut"); to(hs, lostT + 0.72, 0.14, { px: 4 }, "sine.inOut");
  face(hs, lostT + 0.95, 0.2, "sad", { px: 4, py: 0 });

  /* ================================================================= 3. it calls */
  to(hs, B[2] - 0.08, 0.14, { pitch: -8 }, "sine.inOut");
  face(hs, B[2] - 0.02, 0.1, "call", { px: 4, py: -1 });
  K.calls.forEach((tc) => {
    to(hs, tc - 0.04, 0.07, { sx: 1.05, sy: 0.95, open: 0.34 }, "power2.out"); to(hs, tc + 0.03, 0.2, { sx: 1, sy: 1, open: 0.12 }, "sine.out");
    call(fx, tc, head, { dirs: [1, -1], n: 3, v: 1500, life: 0.6, gap: 0.06, a: 0.6, w: 6.5, op: 1 });
  });

  /* ================================================================= 4. they call back, and it goes to them */
  /* voices from where the others went, out of sight to the right */
  K.replies.forEach((tr, j) => call(fx, tr, [2420, 600 + j * 50], { dirs: [-1], n: 2, v: 3200, r0: 1290, a: 0.3 - j * 0.04, life: 0.5, w: 7.5 - j, gap: 0.06, op: 0.95, pw: 0.9 }));
  const hearT = K.hearT;
  face(hs, hearT, 0.1, "hear", { px: 4, py: 0 });
  to(hs, hearT, 0.14, { y: 784, pitch: -13, open: 0 }, "back.out(2)");
  face(hs, goT - 0.04, 0.15, "happy", { px: 4, py: 0, open: 0.15 });
  to(hs, goT, 0.15, { pitch: 0 }, "sine.inOut");
  to(hs, goT, meetT - goT, { x: 1640, y: 664 }, "power2.inOut");
  /* the others come to meet it */
  set(ms, B[1] + 0.9, { x: 2780, y: 650, flip: -1 }); set(bs, B[1] + 0.9, { x: 2990, y: 520, flip: -1 }); set(cs, B[1] + 0.9, { x: 2700, y: 800, flip: -1 });
  to(ms, goT + 0.08, meetT - goT - 0.1, { x: 2010 }, "power2.out");
  to(bs, goT + 0.08, meetT - goT - 0.04, { x: 2150, y: 506 }, "power2.out");
  to(cs, goT + 0.04, meetT - goT - 0.12, { x: 1940 }, "power2.out");
  face(ms, goT, 0.15, "happy", { px: 3 }); face(cs, goT, 0.15, "happy", { px: 3, open: 0.3 }); face(bs, goT, 0.15, "happy", { px: 3 });

  /* ================================================================= 5. back with them
     It pushes its head in under its mother's. The calf bobs round them. */
  to(hs, meetT, 0.28, { x: 1742, y: 716, pitch: -15 }, "sine.inOut");
  to(ms, meetT, 0.28, { y: 640, pitch: 7 }, "sine.inOut");
  face(hs, meetT + 0.1, 0.2, "bliss", { px: 3, py: -2 });
  face(ms, meetT + 0.1, 0.2, "bliss", { px: 2, py: 2 });
  [0, 1].forEach((k) => { to(hs, meetT + 0.32 + k * 0.32, 0.16, { y: 708, x: 1750 }, "sine.inOut"); to(hs, meetT + 0.48 + k * 0.32, 0.16, { y: 718, x: 1740 }, "sine.inOut"); });
  to(cs, meetT, 0.3, { x: 1900, y: 742 }, "sine.inOut"); to(cs, meetT + 0.3, 0.35, { x: 1880, y: 826 }, "sine.inOut"); to(cs, meetT + 0.65, 0.3, { x: 1910, y: 780 }, "sine.inOut");
  to(bs, meetT + 0.05, 0.3, { pitch: 5 }, "sine.inOut"); to(bs, meetT + 0.5, 0.3, { pitch: 0 }, "sine.inOut");

  /* ================================================================= the change: a tank is put down here */
  const floorT = K.floorT, wallRT = K.wallRT, wallLT = K.wallLT, poolT = K.poolT, backT = K.backT;
  to(Wd, floorT, 0.22, { kelp: 0 }, "power2.in");
  to(Wd, floorT, 0.3, { floor: 1 }, "power2.out");
  SHAKES.push([floorT + 0.25, 4], [wallRT - 0.07, 10], [wallLT - 0.07, 8]);
  /* concrete does not bounce: each wall comes down and stays */
  to(Wd, wallRT - 0.3, 0.23, { wallR: 1 }, "power2.in");
  to(Wd, wallLT - 0.3, 0.23, { wallL: 1 }, "power2.in");
  to(Wd, poolT, 0.45, { pool: 1 }, "sine.inOut");
  to(Wd, poolT, 0.35, { tiles: 1 }, "sine.inOut");
  to(Wd, backT, 0.3, { back: 1 }, "power2.out");
  [[wallRT, TX1, 31], [wallLT, TX0, 37]].forEach(([tw, x, sd]) => {
    burst(splash, tw - 0.07, x, WY - 2, 16, sd, { a0: -PI * 0.92, a1: -PI * 0.08, v0: 140, v1: 380, g0: 4, g1: 8, cols: ["foam", "sea1", "foam"], grav: 1200 });
    [0, 0.1].forEach((d, i) => ring(splash, tw - 0.05 + d, x + (x > 1400 ? -1 : 1) * (70 + i * 30), WY - 1, { r0: 8, r1: 60, life: 0.5 }));
  });
  /* the floor startles them apart; the wall comes down in the gap */
  face(hs, floorT + 0.08, 0.08, "alert", { px: 2, py: 5 });
  to(hs, floorT + 0.08, 0.2, { x: 1650, y: 700, pitch: 0 }, "power2.out");
  to(ms, floorT + 0.08, 0.2, { x: 2150, pitch: 0 }, "power2.out");
  to(cs, floorT + 0.08, 0.2, { x: 2040 }, "power2.out");
  to(bs, floorT + 0.08, 0.2, { x: 2370 }, "power2.out");
  /* the others are on the far side of the wall now, and stay there */
  POD.slice(1).forEach((p) => set(p.st, wallRT + 0.15, { vis: 0 }));
  face(hs, wallRT - 0.08, 0.06, "shock", { px: 4, py: 0 });
  to(hs, wallRT - 0.05, 0.14, { x: 1610, pitch: -7 }, "power2.out");
  face(hs, wallLT + 0.05, 0.12, "alert", { px: 4, py: 0 });
  to(hs, wallLT, 0.25, { pitch: 0 }, "sine.inOut");

  /* ================================================================= 1 again. It goes to the wall where they were. */
  const noseT = K.noseT;
  face(hs, B[6], 0.15, "search", { px: 4, py: 0 });
  to(hs, B[6] + 0.02, 0.46, { x: 1776, y: 600 }, "sine.inOut");
  [0, 0.28].forEach((d) => { to(hs, noseT + d, 0.1, { x: 1783 }, "sine.out"); to(hs, noseT + d + 0.1, 0.14, { x: 1775 }, "sine.inOut"); });
  /* ================================================================= 2 again. Down the wall, and away from it. */
  to(hs, B[7] + 0.02, 0.4, { y: 740, pitch: 14 }, "sine.inOut");
  face(hs, B[7] + 0.06, 0.2, "sad", { px: 4, py: 2 });
  turn(hs, B[7] + 0.44, 0.18, -1);
  to(hs, B[7] + 0.44, 0.18, { pitch: 0 }, "sine.inOut");
  to(hs, B[7] + 0.58, 0.5, { x: 1440, y: 740 }, "sine.inOut");
  /* ================================================================= 3 again. It calls. The call ends at the walls. */
  turn(hs, B[8] - 0.07, 0.16, 1);
  to(hs, B[8] + 0.02, 0.1, { pitch: -8 }, "sine.inOut");
  face(hs, B[8] + 0.04, 0.1, "call", { px: 4, py: -1 });
  K.tcalls.forEach((tc) => {
    to(hs, tc - 0.04, 0.07, { sx: 1.05, sy: 0.95, open: 0.34 }, "power2.out"); to(hs, tc + 0.03, 0.2, { sx: 1, sy: 1, open: 0.12 }, "sine.out");
    call(tankcalls, tc, head, { dirs: [1, -1], back: 1, n: 3, v: 1500, life: 0.6, gap: 0.06, a: 0.6, w: 6.5, op: 1 });
  });
  /* ================================================================= 4 again. It waits. Nothing comes. */
  face(hs, B[9], 0.12, "hear", { px: 4, py: 0, mouth: -0.1, pup: 1.1 });
  to(hs, B[9], 0.2, { pitch: -4, open: 0 }, "sine.inOut");
  face(hs, B[9] + 0.5, 0.25, "flat", { px: 3, py: 2 });
  to(hs, B[9] + 0.5, 0.28, { pitch: 5, y: 756 }, "sine.inOut");
  /* ================================================================= 5 again. Wall to wall, and round again. */
  to(hs, B[10] + 0.02, 0.5, { x: 1764, y: 664, pitch: 0 }, "sine.inOut");
  turn(hs, B[10] + 0.52, 0.2, -1);
  to(hs, B[10] + 0.7, 1.15, { x: 1116, y: 790 }, "sine.inOut");

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
      let x = 620 + 520 * (snapT - Math.min(t, snapT)) + f.dx, y = 962 + f.dy + sin(t * 2.3 + f.p) * 7, r = 0;
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
    [0.02, "green", 0.4, 0.2],                /* with its family: all in order */
    [chaseT + 0.05, "green", 0.5, 0.2],       /* salmon: something it wants */
    [lostT + 0.08, "red", 0.45, 0.2],         /* it turns round: nobody */
    [B[1] + 0.6, "red", 0.68, 0.5],           /* apart, and it stays that way */
    [B[2] + 0.05, "red", 0.75, 0.3],
    [hearT, "green", 0.5, 0.18],              /* an answer: this is what the call is for */
    [goT + 0.15, "green", 0.7, 0.3],          /* on the way to them */
    [meetT, "green", 0.95, 0.25],             /* back with them */
    [floorT + 0.1, "green", 0.5, 0.15],       /* the floor: unknown, but nothing in it says danger */
    [wallRT - 0.08, "red", 0.5, 0.08],        /* the bang of the wall: a start, and they are not there */
    [B[6] + 0.1, "red", 0.58, 0.4],
    [B[7] + 0.1, "red", 0.72, 0.5],
    [B[8] + 0.1, "red", 0.8, 0.3],
    [B[9] + 0.2, "red", 0.92, 0.4],           /* nothing answers the need */
    [B[10] + 0.1, "red", 1, 0.5],             /* and nothing will */
  ];
  Object.assign(S.A, { hero, hs, mum, GLOW,
    top: () => hero.at(-4, -102), bot: () => hero.at(4, 66) });
})(ST);
