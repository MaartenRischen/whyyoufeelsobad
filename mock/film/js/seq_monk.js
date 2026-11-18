/* seq_monk.js - 4. the monkeys. A baby clings to its mother. Then the mother is taken up and
   away, a cage comes down, and a cloth dummy is all there is to cling to. */
(function (S) {
  const { $, to, set, hop, face, draws, P, M, Wd, SHAKES, puff, mark, fx } = S;
  const monk = $("monk"), labback = $("labback"), cagefront = $("cagefront");
  const cage = makeCage(labback, cagefront);
  const CG = { x: 208, y: 318 };
  const mates = [makeMonkey(monk, monk, { baby: 1, s: 0.32, fur: "fur2", fur2: "trunk", ph: 1 }), makeMonkey(monk, monk, { baby: 1, s: 0.32, fur: "fur", fur2: "fur2", ph: 2 })];
  const rope = G('<path stroke="#22202E" stroke-width="2.4" stroke-linecap="round" d="M0,0 L0,-700"/><path fill="none" stroke="#22202E" stroke-width="2.4" d="M-7,0 a7,7 0 1 0 14,0 a7,7 0 1 0 -14,0"/>', monk);
  const mother = makeMonkey(monk, null, { s: 0.5, ph: 5 });
  const dummy = makeDummy(monk);
  const baby = makeMonkey(monk, null, { baby: 1, s: 0.35, ph: 3 });
  monk.appendChild(mother.ag._w); monk.appendChild(baby.ag._w);
  const ms = mother.st, bs = baby.st, m1 = mates[0].st, m2 = mates[1].st;
  const Mk = { rock: 0, dy: -420, dr: 0, dvis: 0, self: 0, rope: 0, ry: -300 };
  Object.assign(ms, { x: P.seat[0], y: P.seat[1], headR: -6, Lu: 10, Ru: -10 }, FACE.calm, { px: -3, py: -1 });
  Object.assign(bs, { x: 414, y: 517, flip: 1 }, FACE.sad, { px: -3 });
  Object.assign(m1, { x: 464, y: 516 }, FACE.happy); Object.assign(m2, { x: 488, y: 514, flip: -1 }, FACE.happy);
  const overB = (dy) => () => [bs.x + 2, bs.y - bs.h - (dy || 62)];
  /* the mates play all along */
  for (let t = 0.4; t < M[4] + 0.2; t += 1.1) {
    hop(m1, t, 0.34, 9); hop(m2, t + 0.5, 0.34, 11);
    to(m1, t, 0.3, { Lu: 120, Ru: -120, open: 0.7 }, "sine.inOut"); to(m1, t + 0.4, 0.3, { Lu: 20, Ru: -20, open: 0 }, "sine.inOut");
    to(m2, t + 0.5, 0.17, { headR: 8, tailA: 14 }, "sine.inOut"); to(m2, t + 0.67, 0.3, { headR: 0, tailA: 0 }, "sine.inOut");
  }
  /* --- M1: it needs its mother. Arms out, crying. */
  to(bs, M[0] - 0.6, 0.35, { Lu: 82, Ru: 104, Lf: 12, Rf: 14 }, "back.out(2)");
  face(bs, M[0] - 0.6, 0.3, "cry", { px: -3, open: 0.3 });
  to(bs, M[0] - 0.5, 0.3, { tear: 1 }, "none");
  [0, 0.42, 0.84, 1.26].forEach((d) => {
    const t = M[0] - 0.2 + d;
    hop(bs, t, 0.3, 7); to(bs, t, 0.15, { open: 1, headR: -7 }, "sine.out"); to(bs, t + 0.2, 0.15, { open: 0.3, headR: 0 }, "sine.in");
    to(bs, t, 0.15, { Lf: 28, Rf: 30 }, "sine.out"); to(bs, t + 0.2, 0.15, { Lf: 8, Rf: 10 }, "sine.in");
  });
  /* the mother hears it, turns, opens her arms */
  face(ms, M[0] + 0.85, 0.12, "alert", { px: 2, py: 0 });
  to(ms, M[0] + 0.85, 0.3, { headR: 7 }, "back.out(2)");
  mark(fx, M[0] + 0.87, () => [ms.x + 6, ms.y - 112], "!", { dur: 0.45, s: 0.55 });
  face(ms, M[0] + 1.2, 0.3, "happy", { px: 3, py: 0.5 });
  to(ms, M[0] + 1.2, 0.35, { Lu: 34, Ru: -40, r: 4 }, "back.out(2)");
  /* --- M2: it goes to her, clings, and is safe */
  face(bs, M[1] - 0.05, 0.2, "alert", { px: -3, open: 0.4, brow: -0.6 });
  to(bs, M[1] + 0.05, 0.24, { x: 376 }, "none"); hop(bs, M[1] + 0.05, 0.24, 12);
  to(bs, M[1] + 0.3, 0.3, { x: 330, y: 516 }, "none"); hop(bs, M[1] + 0.3, 0.3, 26);
  to(bs, M[1] + 0.55, 0.3, { Lu: 62, Ru: -62, Lf: -30, Rf: 30 }, "power2.out");
  face(bs, M[1] + 0.55, 0.3, "bliss", { px: 0 });
  to(bs, M[1] + 0.5, 0.5, { tear: 0 }, "none");
  to(bs, M[1] + 0.6, 0.35, { sy: 0.9, sx: 1.06 }, "power2.out"); to(bs, M[1] + 0.95, 0.4, { sy: 1, sx: 1 }, "elastic.out(1,0.4)");
  to(ms, M[1] + 0.5, 0.4, { Lu: -30, Lf: -78, Ru: 30, Rf: 78, headR: 0, px: 0, py: 3, r: 0 }, "back.out(1.7)");
  to(ms, M[1] + 0.6, 0.12, { sy: 0.96, sx: 1.03 }, "power2.out"); to(ms, M[1] + 0.72, 0.5, { sy: 1, sx: 1 }, "elastic.out(1,0.4)");
  face(ms, M[1] + 0.9, 0.3, "bliss", { px: 0, py: 2 });
  to(ms, M[1] + 0.9, 0.4, { headR: 9 }, "sine.inOut");
  to(Mk, M[1] + 0.8, 0.6, { rock: 1 }, "sine.inOut");
  /* --- M3: the hook comes down, the mother goes up */
  set(Mk, M[2] - 0.3, { rope: 1 });
  to(Mk, M[2] - 0.3, 0.3, { ry: 0 }, "power2.in");
  to(Mk, M[2] + 0.02, 0.15, { rock: 0 }, "none");
  face(ms, M[2] + 0.02, 0.08, "shock", { px: 0, py: -3 });
  to(ms, M[2] + 0.05, 0.15, { Lu: 40, Lf: 0, Ru: -40, Rf: 0, headR: 0 }, "none");
  to(ms, M[2] + 0.05, 0.08, { sy: 1.12, sx: 0.94 }, "power2.out");
  to(ms, M[2] + 0.12, 0.5, { y: -260 }, "back.in(1.4)");
  to(ms, M[2] + 0.2, 0.3, { Lu: 150, Ru: -150, Lf: 20, Rf: -20 }, "power2.out");       /* she reaches down for it */
  set(Mk, M[2] + 0.7, { rope: 0 });
  face(bs, M[2] + 0.12, 0.08, "shock", { px: 0, py: -3.5 });
  to(bs, M[2] + 0.15, 0.15, { Lu: 150, Ru: -150, Lf: 0, Rf: 0 }, "power2.out");       /* and it reaches up */
  mark(fx, M[2] + 0.16, overB(66), "!", { dur: 0.4, s: 0.6 });
  to(bs, M[2] + 0.25, 0.25, { y: 520, x: 305 }, "power2.in");
  to(bs, M[2] + 0.5, 0.12, { sy: 0.8, sx: 1.12 }, "power2.out"); to(bs, M[2] + 0.62, 0.35, { sy: 1, sx: 1 }, "elastic.out(1,0.4)");
  to(bs, M[2] + 0.62, 0.3, { Lu: 20, Ru: -20 }, "power2.out");
  to(Wd, M[2] + 0.45, 0.5, { cage: 1 }, "bounce.out");
  to(bs, M[2] + 0.7, 0.18, { y: 524 }, "none");
  set(Mk, M[2] + 0.85, { dvis: 1 });
  to(Mk, M[2] + 0.85, 0.4, { dy: 0 }, "bounce.out");
  to(Wd, M[2] + 1.15, 0.5, { bars: 1 }, "bounce.out");
  SHAKES.push([M[2] + 0.62, 5], [M[2] + 1.0, 5], [M[2] + 1.33, 8]);
  /* every thing that lands makes it start */
  [0.62, 1.0, 1.33].forEach((d) => { hop(bs, M[2] + d, 0.16, 5); });
  face(bs, M[2] + 0.75, 0.2, "sad", { px: 0, py: -3, pup: 0.8 });
  to(bs, M[2] + 1.0, 0.2, { px: 3.5, py: 0, headR: 6 }, "power2.out");        /* at the dummy */
  to(bs, M[2] + 1.4, 0.25, { px: -3, headR: -6 }, "sine.inOut");             /* at the bars */
  to(bs, M[2] + 1.35, 0.3, { shiver: 1 }, "none");
  mark(fx, M[2] + 1.05, overB(62), "?", { dur: 0.6, s: 0.55 });
  /* --- M4: it still wants to cling */
  to(bs, M[3] + 0.05, 0.3, { Lu: -104, Ru: -82, Lf: -14, Rf: -12, headR: 4 }, "back.out(2)");
  face(bs, M[3] + 0.05, 0.3, "cry", { px: 3.5, py: -1, open: 0.3 });
  to(bs, M[3] + 0.1, 0.3, { tear: 1 }, "none");
  [0.1, 0.52, 0.94].forEach((d) => {
    const t = M[3] + d;
    hop(bs, t, 0.3, 7); to(bs, t, 0.15, { open: 1, headR: 10 }, "sine.out"); to(bs, t + 0.2, 0.15, { open: 0.3, headR: 4 }, "sine.in");
    to(bs, t, 0.15, { Lf: -30, Rf: -28 }, "sine.out"); to(bs, t + 0.2, 0.15, { Lf: -10, Rf: -8 }, "sine.in");
  });
  /* --- M5: it clings to the cloth.
     v5, thought through from the baby's side: soft cloth answers the holding part of the need, so
     on the cloth it feels safe, and that feeling is real (it is why it stays). It turns bad only
     when the others have gone and nothing holds it back. */
  const c0 = M[4];
  const MT = { see: c0 - 0.22, cling: c0 + 0.3, look: c0 + 1.1, back: c0 + 1.55, alone: c0 + 2.2 };
  face(bs, MT.see, 0.2, "awe", { px: 4, py: 0, open: 0.25 });                       /* it fixes on the cloth */
  to(bs, MT.see, 0.2, { headR: 2, Lf: -24, Rf: -22 }, "power2.out");
  to(bs, c0 + 0.05, 0.3, { x: 342, shiver: 0 }, "none"); hop(bs, c0 + 0.05, 0.3, 14);
  to(bs, MT.cling, 0.3, { Lu: -96, Lf: -60, Ru: -70, Rf: -74, r: 9, headR: 14 }, "power2.out");
  face(bs, MT.cling, 0.3, "bliss", { px: 0 });
  to(bs, MT.cling, 0.4, { tear: 0 }, "none");
  to(Mk, c0 + 0.34, 0.12, { dr: 5 }, "power2.out"); to(Mk, c0 + 0.46, 0.7, { dr: 0 }, "elastic.out(1.2,0.25)");
  /* it settles in */
  to(bs, c0 + 0.62, 0.3, { headR: 19, sy: 0.95, sx: 1.04 }, "sine.inOut"); to(bs, c0 + 0.92, 0.3, { sy: 1, sx: 1, headR: 15 }, "sine.inOut");
  /* the others call. It looks - and stays where it feels safe */
  to(m1, c0 + 0.85, 0.2, { px: -3 }, "none"); to(m2, c0 + 0.9, 0.2, { px: 3 }, "none");
  set(m2, c0 + 0.9, { flip: 1 });
  to(m2, c0 + 0.95, 0.25, { Lu: 150, open: 0.8 }, "back.out(2)");
  [0, 0.3].forEach((d) => { to(m2, c0 + 1.15 + d, 0.15, { Lf: 30 }, "sine.inOut"); to(m2, c0 + 1.3 + d, 0.15, { Lf: -20 }, "sine.inOut"); });
  face(bs, MT.look, 0.25, "calm", { px: 4, py: 0, lid: 0.08, mouth: 0.35, pup: 1.1 });
  to(bs, MT.look, 0.25, { headR: -2 }, "sine.inOut");
  face(bs, MT.back, 0.3, "bliss", { px: 0 });
  to(bs, MT.back, 0.3, { headR: 18, r: 11, Lf: -68, Rf: -80 }, "sine.inOut");                /* it holds on tighter */
  to(Mk, MT.back + 0.05, 0.12, { dr: 4 }, "power2.out"); to(Mk, MT.back + 0.17, 0.6, { dr: 0 }, "elastic.out(1.2,0.25)");
  to(m2, c0 + 1.75, 0.2, { Lu: 20, px: 0, open: 0 }, "none");
  face(m2, c0 + 1.75, 0.3, "calm", { mouth: -0.3 });
  [m1, m2].forEach((s, i) => { const t = c0 + 1.85 + i * 0.15; set(s, t, { flip: 1 }); to(s, t, 0.9, { x: 640 + i * 20 }, "none"); for (let k = 0; k < 3; k++) hop(s, t + k * 0.3, 0.3, 14); to(s, t + 0.7, 0.25, { vis: 0 }, "none"); });
  /* they are gone. It looks after them; the cloth does not hold it back. Now it lands. */
  face(bs, MT.alone, 0.3, "sad", { px: 4, py: -0.5, lid: 0.12 });
  to(bs, MT.alone, 0.3, { headR: 0, r: 9 }, "sine.inOut");
  to(bs, MT.alone + 0.25, 0.4, { shiver: 1 }, "none");
  to(Mk, MT.alone + 0.3, 0.5, { self: 1 }, "sine.inOut");
  to(bs, MT.alone + 0.45, 0.4, { tear: 1 }, "none");
  face(bs, MT.alone + 0.75, 0.4, "sad", { px: 0, py: 1, lid: 0.72, lidL: 0.14, lidA: -18 });
  to(bs, MT.alone + 0.75, 0.4, { headR: 18, r: 11 }, "sine.inOut");
  draws.push((t) => {
    const rk = sin(t * 2.5) * 3.2 * Mk.rock;
    const self = sin(t * 5.2) * 5 * Mk.self;
    const sv = [ms.r, bs.r];
    ms.r += rk; bs.r += rk * 0.9 + self;
    mates.forEach((m) => m.draw(t));
    mother.draw(t); baby.draw(t);
    ms.r = sv[0]; bs.r = sv[1];
    OP(rope, Mk.rope); place(rope, ms.x, ms.y - 86 + Mk.ry, 0, 1);
    /* cage: back wall and tray drop in, then the dummy, then the bars */
    const cy = CG.y - (1 - Wd.cage) * 520, by = CG.y - (1 - Wd.bars) * 560;
    OP(cage.b, Wd.cage > 0.001 ? 1 : 0); place(cage.b, CG.x, cy, 0, 1);
    OP(cage.f, Wd.bars > 0.001 ? 1 : 0); place(cage.f, CG.x, by, 0, 1);
    OP(dummy, Mk.dvis); place(dummy, 392, 524 + Mk.dy, Mk.dr, 0.52);
  });
  Object.assign(S.A, { baby, mother, bs, ms, Mk, MT });
})(ST);
