/* seq_beetle.js - 2. the dung beetles. The first one climbs its ball, reads the sky, and rolls
   on in a straight line. Then a street light comes on. */
(function (S) {
  const { to, set, hop, face, draws, P, B, L, SHAKES, PUNCH, STOPS, LAMPHITS, burst, pow, puff, mark, fx, actors, bends } = S;
  const N1 = K.N1, stopT = K.stopT, goT = K.goT, crashT = K.crashT, arrive = K.arrive;
  const SC = 0.56, GY = (y) => y - 13;          /* body centre for a ground point */
  const BE = [
    { a: [662, 708], p: [500, 766], c: [848, 786], t0: MOVE.beetle[0] - 0.4 },
    { a: [752, 660], p: [936, 640], c: [932, 772], t0: B[1] - 0.5 },
    { a: [712, 634], p: [540, 598], c: [866, 764], t0: B[1] - 0.35 },
    { a: [748, 688], p: [806, 742], c: [880, 776], t0: B[1] - 0.6 },
    { a: [736, 640], p: [498, 664], c: [836, 770], t0: B[1] - 0.2 },
  ];
  const turn = (s, t, d, flip) => { to(s, t, d * 0.5, { sx: 0.08 }, "power2.in"); set(s, t + d * 0.5, { flip }); to(s, t + d * 0.5, d * 0.5, { sx: 1 }, "power2.out"); };
  const top = (s, dy) => () => [s.x, s.y - s.jump - (dy || 26)];
  const lampSide = (s) => (P.lampHead[0] > s.x ? 1 : -1);
  BE.forEach((b, i) => {
    const pp = makeBeetle(actors, actors, { seed: i + 1 });
    const s = pp.st;
    const l1 = Math.hypot(b.p[0] - b.a[0], b.p[1] - b.a[1]), l2 = Math.hypot(b.c[0] - b.p[0], b.c[1] - b.p[1]);
    const f0 = b.p[0] > b.a[0] ? 1 : -1;
    Object.assign(s, { x: b.a[0], y: GY(b.a[1]), flip: f0 }, FACE.keen);
    b.s = s; b.pp = pp; b.l1 = l1;
    if (i === 0) {
      /* the hero: roll, stop, climb the ball, turn on it with its head to the sky, climb down, roll on */
      const tP = B[1] - 0.45, q = [lerp(b.a[0], b.p[0], 0.5), lerp(b.a[1], b.p[1], 0.5)];
      to(s, b.t0, tP - b.t0, { x: q[0], y: GY(q[1]), d: l1 * 0.5 }, "none");
      [11.15, 11.38, 11.6].forEach((t, k) => puff(actors, t, () => s.x + 12, () => s.y + 14, { n: 3, r: 2.6, v: 12, cls: "sand2", a0: -PI * 0.3, a1: 0, life: 0.45, rise: 3, seed: 40 + k, op: 0.8 }));
      const bx = q[0] + f0 * BALL.x * SC, by = GY(q[1]) + BALL.y * SC, br = f0 * (l1 * 0.5) / (BALL.r * SC) * 57.3 * 0.55;
      set(s, tP, { att: 0, bx, by, br });
      to(s, tP, 0.16, { roll: 0, tilt: -4, py: -3, px: -1 }, "power2.out");
      face(s, tP, 0.16, "alert", { py: -3 });
      /* up */
      to(s, tP + 0.16, 0.08, { sy: 0.8, sx: 1.1 }, "power2.out");
      to(s, tP + 0.24, 0.24, { x: bx, y: by - 30.2, tilt: 0 }, "power1.inOut");
      hop(s, tP + 0.24, 0.24, 15, "jump");
      to(s, tP + 0.24, 0.12, { sy: 1.12, sx: 0.92 }, "power2.out"); to(s, tP + 0.42, 0.3, { sy: 1, sx: 1 }, "elastic.out(1.2,0.4)");
      to(s, tP + 0.46, 0.08, { bs: 0.95 }, "power2.out"); to(s, tP + 0.54, 0.3, { bs: 1 }, "elastic.out(1.2,0.4)");
      /* head to the sky, and a turn each way: this is how it takes its bearing */
      const tU = tP + 0.52;
      to(s, tU, 0.25, { tilt: 13, hd: 15, ant: -1 }, "back.out(2)");
      face(s, tU, 0.25, "awe", { py: -3.2, px: -1 });
      turn(s, tU + 0.3, 0.26, -f0);
      turn(s, tU + 0.72, 0.26, f0);
      to(s, tU + 0.3, 0.9, { br: br + 40 }, "sine.inOut");
      /* down, and on */
      const tD = tU + 1.08;
      to(s, tD, 0.14, { tilt: -4, hd: 0, ant: 0 }, "power2.in");
      face(s, tD, 0.2, "happy", { py: 0, px: 0 });
      to(s, tD + 0.04, 0.24, { x: q[0], y: GY(q[1]) }, "power1.inOut");
      hop(s, tD + 0.04, 0.24, 12, "jump");
      to(s, tD + 0.2, 0.16, { roll: 1, tilt: -40 }, "power2.out");
      to(s, tD + 0.28, 0.1, { br }, "none");
      set(s, tD + 0.38, { att: 1 });
      to(s, tD + 0.4, stopT - (tD + 0.4), { x: b.p[0], y: GY(b.p[1]), d: l1 }, "power1.in");
      b.tU = tU;
    } else {
      to(s, b.t0, stopT - b.t0, { x: b.p[0], y: GY(b.p[1]), d: l1 }, "none");
      face(s, B[1] + 0.3 + i * 0.07, 0.4, "happy", { py: -1.5 });
    }
    /* the lamp comes on: every eye goes to it. To a beetle this is the best star there has ever been */
    const tL = B[2] + 0.66 + i * 0.05;
    face(s, tL, 0.3, "awe", { glint: 0.85, px: 2.5 * f0 * lampSide(s) * -1, py: -2.2, pup: 1.4 });
    /* stop. A start, a hop, round to the light, and off */
    const tS = stopT + i * 0.035;
    to(s, tS, 0.1, { roll: 0.75, hd: 10 }, "power2.out");
    hop(s, tS + 0.1, 0.26, 12, "jump");
    to(s, tS + 0.1, 0.1, { sy: 1.1, sx: 0.94 }, "power2.out"); to(s, tS + 0.3, 0.25, { sy: 1, sx: 1 }, "elastic.out(1.2,0.4)");
    mark(fx, tS + 0.02, top(s, 30), "!", { dur: 0.42, s: i === 0 ? 0.7 : 0.55 });
    const f1_ = b.c[0] >= b.p[0] - 20 ? 1 : -1;
    if (f1_ !== f0) { to(s, goT - 0.17, 0.08, { sx: 0.08 }, "power2.in"); set(s, goT - 0.09, { flip: f1_ }); to(s, goT - 0.09, 0.08, { sx: 1 }, "power2.out"); }
    face(s, goT - 0.1, 0.2, "rapt", { glint: 1, px: -2.5 * f1_ * lampSide({ x: b.p[0] }), py: -2.5 });
    to(s, goT - 0.1, 0.15, { roll: 1, hd: 0 }, "power2.out");
    puff(actors, goT, b.p[0] - f1_ * 14, b.p[1], { n: 4, r: 3, v: 16, cls: "sand2", a0: -PI * 0.9, a1: -PI * 0.1, life: 0.5, rise: 5, seed: 60 + i, op: 0.8 });
    const tI = crashT + arrive[i];
    to(s, goT, tI - goT, { x: b.c[0] - 22, y: GY(b.c[1]), d: l1 + l2 }, "power2.in");
    /* they never see the pole, only the light. The feeling turns at the impact, not before */
    face(s, tI, 0.05, "shock", { glint: 0, px: 0, py: 0 });
    b.tI = tI; b.f1 = f1_;
  });
  STOPS.push([crashT + 0.02, 0.1]); PUNCH.push([crashT + 0.02, 0.05]);
  SHAKES.push([crashT + 0.04, 16], [crashT + 0.15, 10]);
  LAMPHITS.push(crashT, crashT + 0.1, crashT + 0.17);
  pow(fx, crashT + 0.02, 888, 752, 0.85, 0);
  pow(fx, crashT + 0.12, 858, 744, 0.8, 30);
  pow(fx, crashT + 0.16, 918, 760, 0.7, 70);
  burst(actors, crashT + 0.03, 884, 764, 34, 9, { a0: -PI * 0.96, a1: -PI * 0.04, v0: 120, v1: 420, g0: -4, g1: 62, cols: ["dung", "dung2", "sand2", "cream", "btl2"], grav: 1000 });
  puff(actors, crashT + 0.04, 880, 776, { n: 9, r: 9, v: 70, cls: "sand2", a0: -PI, a1: 0, life: 0.8, rise: 10, seed: 77, op: 0.75 });
  /* after the crash: where everything ends up */
  (function () {
    const fly = (s, t, d, x, y, hgt, r) => { to(s, t, d, { x, r }, "none"); to(s, t, d * 0.45, { y: y - hgt }, "power2.out"); to(s, t + d * 0.45, d * 0.55, { y }, "bounce.out"); };
    const ballFly = (s, t, d, x, y, hgt, r) => { set(s, t, { att: 0, bx: s.cx, by: s.cy, br: 0 }); to(s, t, d, { bx: x, br: r }, "power1.out"); to(s, t, d * 0.4, { by: y - hgt }, "power2.out"); to(s, t + d * 0.4, d * 0.6, { by: y }, "bounce.out"); };
    BE.forEach((b) => { b.s.cx = b.c[0]; b.s.cy = b.c[1] - 13.5; set(b.s, b.tI, { roll: 0, hd: 0 }); });
    const s0 = BE[0].s, s1 = BE[1].s, s2 = BE[2].s, s3 = BE[3].s, s4 = BE[4].s;
    /* 0, the hero: thrown back, lands on its feet, sees stars - and then looks at the lamp again */
    fly(s0, BE[0].tI, 0.7, 792, GY(800), 58, -360);
    to(s0, BE[0].tI, 0.3, { tilt: -8 }, "power1.out");
    ballFly(s0, BE[0].tI, 1.1, 978, 800 - 13.5, 70, 420);
    to(s0, BE[0].tI + 1.1, 2.6, { bx: 1040, br: 720 }, "power1.out");
    face(s0, BE[0].tI + 0.7, 0.2, "tired", { glint: 0, px: 0, py: 0 });
    to(s0, BE[0].tI + 0.7, 0.1, { sy: 0.8, sx: 1.12 }, "power2.out"); to(s0, BE[0].tI + 0.8, 0.4, { sy: 1, sx: 1 }, "elastic.out(1.2,0.35)");
    puff(actors, BE[0].tI + 0.7, 792, 802, { n: 5, r: 3.4, v: 22, cls: "sand2", a0: -PI, a1: 0, life: 0.5, rise: 4, seed: 81, op: 0.8 });
    face(s0, N1 - 0.25, 0.4, "awe", { glint: 0.9, px: 2.4, py: -2.6, mouth: 0.7 });
    to(s0, N1 - 0.25, 0.4, { hd: -8, tilt: -2 }, "sine.inOut");
    /* 1: on its back, legs going */
    fly(s1, BE[1].tI, 0.8, 936, 790, 88, 180);
    set(s1, BE[1].tI, { kick: 1 });
    to(s1, BE[1].tI, 0.3, { tilt: 0 }, "none");
    ballFly(s1, BE[1].tI, 0.7, 968, 768 - 13.5, 30, 200);
    face(s1, BE[1].tI + 0.8, 0.3, "cry", { glint: 0, open: 0, px: 0 });
    /* 2: wing cases spring open, slides down the pole */
    to(s2, BE[2].tI, 0.16, { x: 893, y: 716, r: -52, tilt: 0 }, "power2.out");
    to(s2, BE[2].tI, 0.28, { wings: 1 }, "back.out(4)");
    to(s2, BE[2].tI + 0.5, 1.5, { y: 764 }, "power1.in");
    ballFly(s2, BE[2].tI, 0.6, 864, 782 - 13.5, 24, -160);
    face(s2, BE[2].tI + 0.5, 0.4, "sad", { glint: 0.5, px: 0 });
    /* 3: loses a leg, ends on its side */
    fly(s3, BE[3].tI, 0.65, 858, 800, 46, 470);
    set(s3, BE[3].tI, { noleg: 1 });
    to(s3, BE[3].tI, 0.3, { tilt: 0 }, "none");
    ballFly(s3, BE[3].tI, 0.9, 822, 796 - 13.5, 50, -300);
    face(s3, BE[3].tI + 0.65, 0.3, "tired", { glint: 0, px: 0 });
    /* 4: lands sitting on a ball */
    fly(s4, BE[4].tI, 0.75, 846, 752, 70, -380);
    to(s4, BE[4].tI, 0.3, { tilt: -6 }, "none");
    ballFly(s4, BE[4].tI, 0.45, 846, 778 - 13.5, 12, 90);
    face(s4, BE[4].tI + 0.75, 0.3, "sad", { glint: 0.6, px: 2, py: -2 });
    to(s4, BE[4].tI + 0.75, 0.1, { sy: 0.82, sx: 1.1 }, "power2.out"); to(s4, BE[4].tI + 0.85, 0.4, { sy: 1, sx: 1 }, "elastic.out(1.2,0.35)");
    /* the loose leg */
    const legG = G('<path class="s-btl" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M-6,-12 L3,1 L0,14"/>', actors);
    const tL = BE[3].tI;
    draws.push((t) => {
      const d = t - tL;
      if (d < 0) { OP(legG, 0); return; }
      OP(legG, 1);
      const u = Math.min(d, 0.9);
      place(legG, 880 - u * 120, 770 - 300 * u + 400 * u * u, u * 900, 0.55);
    });
    /* starlets round the hero's head */
    const stl = [0, 1, 2].map(() => makeStarlet(fx));
    const tS = BE[0].tI + 0.7;
    draws.push((t) => {
      const d = t - tS, o = sat(d / 0.2) * sat((N1 - 0.3 - t) / 0.4);
      stl.forEach((g, i) => { OP(g, d > 0 ? o : 0); const a = t * 5 + i * 2.094; place(g, s0.x + cos(a) * 15, s0.y - 17 + sin(a) * 4.5, t * 120, 0.55 + 0.1 * sin(a)); });
    });
  })();
  /* the grass gives way where the hero rolls */
  bends.push([() => BE[0].s.x, () => BE[0].s.y + 12, 30, () => (BE[0].s.att > 0.5 ? 1 : 0.4)]);
  /* trails: the line each beetle takes */
  const trailEls = BE.map(() => G('<path fill="none" stroke="#FFFBEF" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 9"/>', L.trails).firstChild);
  draws.push((t) => {
    const fade = sat(1 - (t - crashT - 0.2) / 0.5);
    BE.forEach((b, i) => {
      const s = b.s, e = trailEls[i];
      b.pp.draw(t);
      if (t < b.t0 + 0.1 || fade <= 0) { OP(e, 0); return; }
      /* where the ball touches the ground */
      const gx = s.att > 0.5 ? s.x + s.flip * BALL.x * SC * 0.5 : s.bx, gy = s.att > 0.5 ? s.y + 13 : s.by + 14;
      let d = "M" + b.a[0] + "," + b.a[1];
      if (t > goT) d += " L" + b.p[0] + "," + b.p[1];
      if (t < b.tI) d += " L" + f1(t > goT ? s.x : gx) + "," + f1(t > goT ? s.y + 13 : gy); else d += " L" + (b.c[0] - 22) + "," + b.c[1];
      SA(e, "d", d);
      OP(e, fade * 0.85 * sat((t - b.t0) / 0.4));
    });
  });
  S.A.BE = BE;
})(ST);
