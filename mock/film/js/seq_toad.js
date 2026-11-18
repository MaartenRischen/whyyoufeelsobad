/* seq_toad.js - 3. the toads. One walks home to the pond and calls. Then a road is rolled out
   across the way back, and the next two keep walking. */
(function (S) {
  const { $, to, set, face, draws, P, T, L, Wd, SHAKES, PUNCH, STOPS, burst, pow, puff, ring, mark, fx, actors, bends } = S;
  const pondlife = $("pondlife"), ripples = $("ripples");
  const pathEl = G('<path fill="none" stroke="#FFFBEF" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 9" opacity="0"/>', L.trails).firstChild;
  const waitToad = makePondToad(pondlife, 1, { seed: 4 });
  const pondA = makePondToad(pondlife, 0, { seed: 9 });
  const spawn = G('<path fill="none" stroke="#22202E" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0.5 7" d="M262,752 q14,10 30,2 q16,-8 28,4 q10,8 22,0"/>', pondlife);
  const heart = makeHeart(fx);
  const flats = [makeFlatToad(L.road), makeFlatToad(L.road)];
  const toadC = makeToad(actors, { seed: 3 }), toadB = makeToad(actors, { seed: 2 }), toadA = makeToad(actors, { seed: 1 });
  const car1 = makeCar(L.car), car2 = makeCar(L.car);
  const tA = toadA.st, tB = toadB.st, tC = toadC.st, wS = waitToad.st, pS = pondA.st;
  const STR = 0.3;
  const walkTo = (s, t, d, from, toP, ease) => {
    const len = Math.hypot(toP[0] - from[0], toP[1] - from[1]);
    to(s, t - 0.15, 0.2, { walk: 1 }, "none");
    to(s, t, d, { x: toP[0], y: toP[1], ph: "+=" + (len * STR) }, ease || "none");
    to(s, t + d - 0.1, 0.2, { walk: 0 }, "none");
  };
  const over = (s, dy) => () => [s.x - 12, s.y - s.h - (dy || 44)];
  const A0 = [540, 890], A1 = [322, 768], B0 = [692, 964], B1 = [630, 928], B2 = [568, 892], B3 = [512, 850], C0 = [772, 986], C1 = [640, 936], C2 = [548, 868];
  Object.assign(tA, { x: A0[0], y: A0[1] }, FACE.keen); Object.assign(tB, { x: B0[0], y: B0[1] }, FACE.calm); Object.assign(tC, { x: C0[0], y: C0[1] }, FACE.calm);
  Object.assign(wS, { x: 214, y: 731, flip: 1 }, FACE.calm, { px: 1.5 });
  Object.assign(pS, { x: 262, y: 744, flip: -1, vis: 0 }, FACE.happy);
  const plopT = K.plopT;
  /* A: the walk home. It knows where it is going. */
  walkTo(tA, T[0] - 0.9, plopT - 0.5 - (T[0] - 0.9), A0, A1);
  to(tA, T[1] - 0.1, 0.3, { px: 3, pup: 1.15, brow: 0, browOn: 0.3, mouth: 0.5 }, "sine.inOut");      /* it sees the water */
  /* the jump */
  to(tA, plopT - 0.56, 0.14, { sy: 0.78, sx: 1.12 }, "power2.out");
  face(tA, plopT - 0.5, 0.1, "happy", { px: 2, open: 0.6 });
  to(tA, plopT - 0.42, 0.42, { x: 262, y: 744 }, "none");
  to(tA, plopT - 0.42, 0.2, { h: 46, sy: 1.2, sx: 0.88, r: -16 }, "power2.out");
  to(tA, plopT - 0.22, 0.22, { h: 0, r: 22 }, "power2.in");
  puff(actors, plopT - 0.42, A1[0] + 14, A1[1], { n: 4, r: 4, v: 20, cls: "sand2", a0: -PI * 0.5, a1: 0, life: 0.45, rise: 4, seed: 12, op: 0.7 });
  set(tA, plopT, { vis: 0 });
  const PA = { heart: 0, hy: 0 };
  set(pS, plopT, { vis: 1, dip: 13 });
  to(pS, plopT, 0.7, { dip: 0 }, "elastic.out(1.1,0.35)");
  STOPS.push([plopT, 0.05]);
  burst(ripples, plopT, 262, 742, 12, 31, { a0: -PI * 0.9, a1: -PI * 0.1, v0: 90, v1: 230, g0: 0, g1: 6, cols: ["foam", "water"], sink: 1, grav: 900 });
  burst(ripples, plopT, 262, 740, 7, 33, { a0: -PI * 0.85, a1: -PI * 0.15, v0: 140, v1: 260, g0: 2, g1: 6, fill: "#BFE6E2", sink: 1, grav: 900, s: 0.7 });
  [0, 0.16, 0.36].forEach((d, i) => ring(ripples, plopT + d, 262, 746, { r0: 10, r1: 58 + i * 14, k: 0.34, life: 0.95 }));
  /* it calls; the one who was waiting swims over */
  to(pS, plopT + 0.35, 0.2, { call: 1 }, "none");
  face(pS, plopT + 0.3, 0.3, "bliss", { px: -1 });
  face(wS, plopT + 0.05, 0.12, "alert", { px: 2 });
  face(wS, plopT + 0.4, 0.3, "happy", { px: 2 });
  to(wS, plopT + 0.25, 0.7, { x: 232 }, "sine.inOut");
  to(wS, plopT + 0.7, 0.2, { call: 0.6 }, "none");
  [0.5, 0.95, 1.4, 1.9].forEach((d, i) => ring(ripples, plopT + d, 262 - (i % 2) * 30, 748, { r0: 12, r1: 40, k: 0.34, life: 0.8, op: 0.6 }));
  to(PA, plopT + 0.3, 0.25, { heart: 1 }, "back.out(3)");
  to(PA, plopT + 0.3, 1.1, { hy: -34 }, "power1.out");
  to(PA, plopT + 1.2, 0.3, { heart: 0 }, "none");
  to(Wd, plopT + 0.4, 0.4, { spawn: 1 }, "none");
  to(pS, T[2] + 0.6, 0.6, { call: 0.25 }, "none"); to(wS, T[2] + 0.6, 0.6, { call: 0.15 }, "none");
  /* B: waits, follows, and meets the road */
  walkTo(tB, T[1] + 0.4, T[2] - 0.05 - (T[1] + 0.4), B0, B1);
  face(tB, T[1] + 0.3, 0.3, "keen", {});
  /* the road rolls past its nose */
  face(tB, T[2] + 0.12, 0.12, "alert", { px: 3, brow: -0.2, browOn: 0.5, open: 0.1 });       /* puzzled, not afraid */
  to(tB, T[2] + 0.1, 0.1, { sy: 0.9, sx: 1.06, r: -6 }, "power2.out"); to(tB, T[2] + 0.2, 0.4, { sy: 1, sx: 1, r: 0 }, "elastic.out(1.1,0.4)");
  mark(fx, T[2] + 0.16, over(tB), "?", { dur: 0.9, s: 0.72 });
  to(tB, T[2] + 0.45, 0.4, { px: -3 }, "sine.inOut");
  to(tB, T[2] + 0.95, 0.3, { px: 2, py: 2 }, "sine.inOut");       /* a look down at the tarmac */
  face(tB, T[3] - 0.15, 0.25, "keen", { px: 2, py: 0 });        /* and the pond wins: it feels as good as before */
  walkTo(tB, T[3] + 0.1, 1.2, B1, B2);
  walkTo(tB, T[4] + 0.05, 0.95, B2, B3);
  /* the car */
  const car1T = K.car1T, hit1 = K.hit1, car2T = K.car2T, hit2 = K.hit2;
  const Cr = { x1: 1320, x2: -340 };
  to(Cr, car1T, 0.55, { x1: -320 }, "none");
  face(tB, hit1 - 0.22, 0.07, "shock", { px: -4, py: -1 });
  to(tB, hit1 - 0.22, 0.08, { sy: 1.14, sx: 0.92 }, "power2.out");
  mark(fx, hit1 - 0.2, over(tB, 48), "!", { dur: 0.2, s: 0.8 });
  set(tB, hit1, { vis: 0 });
  STOPS.push([hit1, 0.1]); PUNCH.push([hit1, 0.05]);
  SHAKES.push([hit1, 15]);
  pow(fx, hit1, 512, 838, 0.9, 20);
  burst(actors, hit1, 512, 840, 12, 44, { a0: -PI * 0.95, a1: -PI * 0.55, v0: 160, v1: 380, g0: 0, g1: 40, cols: ["toad", "toad2", "brass", "toadb"], grav: 1000 });
  puff(actors, hit1 + 0.05, 470, 880, { n: 8, r: 9, v: 60, cls: "cream", a0: -PI * 0.5, a1: 0, life: 0.7, rise: 14, seed: 91, op: 0.55 });
  /* C keeps coming. It sees what happened. It keeps coming. */
  const cT0 = T[3] + 0.3, cT1 = car2T - 0.1, cD1 = (cT1 - cT0) * 0.553;
  face(tC, cT0 - 0.1, 0.3, "keen", {});
  walkTo(tC, cT0, cD1 - 0.02, C0, C1);
  face(tC, hit1 + 0.06, 0.08, "shock", { px: 3, py: -1 });
  mark(fx, hit1 + 0.1, over(tC), "!", { dur: 0.5, s: 0.7 });
  face(tC, hit1 + 0.75, 0.3, "keen", { px: 2 });               /* the start passes; the pond is still there */
  walkTo(tC, cT0 + cD1 + 0.2, cT1 - (cT0 + cD1 + 0.2), C1, C2);
  to(Cr, car2T, 0.55, { x2: 1300 }, "none");
  face(tC, hit2 - 0.2, 0.07, "shock", { px: 4 });
  set(tC, hit2, { vis: 0 });
  STOPS.push([hit2, 0.07]);
  SHAKES.push([hit2, 9]);
  pow(fx, hit2, 548, 858, 0.8, 50);
  burst(actors, hit2, 548, 860, 9, 46, { a0: -PI * 0.45, a1: -PI * 0.05, v0: 160, v1: 340, g0: 0, g1: 40, cols: ["toad", "toad2", "brass", "toadb"], grav: 1000 });
  bends.push([() => tA.x, () => tA.y, 34, () => tA.vis], [() => tB.x, () => tB.y, 34, () => tB.vis], [() => tC.x, () => tC.y, 34, () => tC.vis]);
  /* footfalls: a little dust under the first toad while the camera is close */
  for (let k = 0; k < 5; k++) { const tt = T[0] - 0.3 + k * 0.5; puff(actors, tt, () => tA.x + 16, () => tA.y + 1, { n: 2, r: 3, v: 10, cls: "sand2", a0: -PI * 0.4, a1: 0, life: 0.4, rise: 3, seed: 20 + k, op: 0.6 }); }
  draws.push((t) => {
    toadC.draw(t); toadB.draw(t); toadA.draw(t);
    /* the way back to the pond, drawn in the scene */
    const pu = sat((t - (T[0] + 0.25)) / 0.7), po = sat((T[4] + 2.0 - t) / 0.4);
    SA(pathEl, "d", "M" + B0[0] + "," + B0[1] + " L" + A0[0] + "," + A0[1] + " L" + A1[0] + "," + A1[1] + " L270,748");
    OP(pathEl, pu * po * 0.9);
    pondA.draw(t); waitToad.draw(t);
    OP(spawn, Wd.spawn);
    OP(heart, PA.heart); place(heart, 246, 700 + PA.hy, sin(t * 6) * 8, 0.9 * PA.heart);
    OP(flats[0], t >= hit1 ? 1 : 0); place(flats[0], 512, 846, 8, t >= hit1 ? 0.5 * (1 + 0.5 * Math.exp(-12 * (t - hit1))) : 0.5);
    OP(flats[1], t >= hit2 ? 1 : 0); place(flats[1], 548, 864, -6, t >= hit2 ? 0.5 * (1 + 0.5 * Math.exp(-12 * (t - hit2))) : 0.5);
    place(car1.g, Cr.x1, 872, 0, 0.92, 0.92); car1.draw(t, Cr.x1);
    place(car2.g, Cr.x2, 846, 0, -0.92, 0.92); car2.draw(t, -Cr.x2);
    OP(car2.g, Cr.x2 > 1290 ? 0 : 1);          /* v6: the world goes on to the east now, so the car must be gone, not parked off the old edge */
  });
  Object.assign(S.A, { toadA, toadB, toadC, pondA, tA, tB, tC, cT0 });
})(ST);
