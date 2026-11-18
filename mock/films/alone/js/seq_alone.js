/* seq_alone.js - the human. It sits with the others at the fire and is given food. The fire burns
   low, it runs for wood, and out there at dusk it is alone. It runs back, they welcome it, it sits
   among them. Then a flat is put down on the same spot: a wall between it and the others, a floor,
   the front of a block with this one cell cut open, a chair, a table, a lamp. It looks for the
   others at the window and at the door. Nobody is there.
   Played straight. The feeling track (GLOW, at the end) is checked against the rules in finale.js;
   the faces below say the same thing. */
(function (S) {
  const { $, to, set, hop, face, draws, cut, Wd, SHAKES, puff, E } = S;
  const H = HK.H, GH = EP.gy, GO = EP.go, R2 = 57.2958;
  const mk = (parent, o) => makeHuman(parent, Object.assign({ skin: HUMAN_SKIN }, o));
  /* the others sit a little further back than the human, so the wall can come down between them */
  const el = mk(E.people, { wear: "vio2", kind: "adult", style: 4, top: 1, seed: 15, s: 0.9 });
  const basket = makeBasket(E.people);
  const teen = mk(E.people, { wear: "tur2", kind: "teen", style: 2, seed: 13, s: 0.85 });
  const yv = mk(E.people, { wear: "yel2", kind: "adult", style: 1, seed: 21, s: 0.9 });
  const kid = mk(E.people, { wear: "pnk2", kind: "kid", style: 0, seed: 14, s: 0.8 });
  const hero = mk(E.kids, { wear: "blu2", kind: "adult", style: 3, top: 1, seed: 11, s: 0.9 });
  const es = el.st, ts = teen.st, ys = yv.st, ks = kid.st, hs = hero.st;
  const PEOPLE = [el, teen, yv, kid, hero], OTHERS = [el, teen, yv, kid];
  const standK = hero.low(HP.stand);
  const SEAT = 59;                      /* hip height on the armchair */
  const FIRE = EP.fire, PILE = EP.pile;
  const X_OUT = PILE[0] + 30, X_MEET = 1540, X_FIRE = 1756, X_WOOD = 1772, X_SIT0 = 1722;

  /* ---- things ---- */
  const bread = G('<circle r="9" class="f-wood"/><circle r="9" fill="none" class="s-wood2" stroke-width="2.4"/><path class="s-wood2" stroke-width="1.8" stroke-linecap="round" d="M-4,-2 l8,4"/>', E.props, "bread");
  const bundle = G('<path class="s-trunk2" stroke-width="5.5" stroke-linecap="round" d="M-26,8 L24,6"/><path class="s-trunk" stroke-width="5.5" stroke-linecap="round" d="M-28,-3 L26,-7 M-24,3 L30,1 M-20,-9 L22,-12"/>', E.props, "bundle");
  const armchair = PP(E.back,
    '<path class="s-doorc2" stroke-width="5" stroke-linecap="round" d="M-34,-8 L-37,0 M36,-8 L39,0"/>' +
    '<rect x="-54" y="-116" width="30" height="112" rx="11" class="f-sofa2" transform="rotate(-7 -39 -8)"/>' +
    '<rect x="26" y="-74" width="12" height="28" class="f-sofa2"/><rect x="-40" y="-84" width="82" height="17" rx="8.5" class="f-sofa2"/>' +
    '<rect x="-42" y="-50" width="88" height="44" rx="9" class="f-sofa"/>' +
    '<path stroke="#FFFBEF" stroke-width="2.6" stroke-linecap="round" opacity="0.25" d="M-30,-42 L30,-42"/>', "armchair");
  const stool = makeChair(E.back, 30);
  const table = PP(E.front,
    '<path class="s-steel" stroke-width="4" stroke-linecap="round" fill="none" d="M-30,0 L-27,-66 M30,0 L27,-66"/>' +
    '<rect x="-38" y="-73" width="76" height="8" rx="3" class="f-desk"/><rect x="-38" y="-67" width="76" height="3" class="f-desk2"/>' +
    '<rect x="-27" y="-76" width="22" height="3" rx="1.5" fill="#F4F1E4"/><path fill="#F4F1E4" d="M6,-73 l0,-13 l13,0 l0,13 Z"/><path stroke="#F4F1E4" stroke-width="2.4" fill="none" d="M19,-83 q7,3 0,8"/>', "table");
  const lampG = G('<circle class="hal" cy="62" r="50" fill="#FFE9B8" opacity="0"/><path class="s-ink" stroke-width="2.4" d="M0,-160 L0,34"/><path class="f-frame" d="M-11,34 L11,34 L22,56 L-22,56 Z"/><circle class="blb" cy="60" r="7" fill="#8C8C9A"/>', E.back, "lamp");
  const lampHalo = q(lampG, ".hal"), bulb = q(lampG, ".blb");
  const cone = G('<path fill="#FFE9B8" d="M-22,56 L22,56 L170,436 L-170,436 Z"/>', E.front, "cone");
  cone.setAttribute("transform", "translate(" + EP.lamp[0] + " " + EP.lamp[1] + ")");

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
  const dust = (t, x, y, n) => puff(E.back, t, x, y + 2, { n: n || 4, r: 4, v: 20, cls: "sand2", a0: -PI * 0.95, a1: -PI * 0.05, life: 0.45, rise: 4, seed: Math.round(t * 10), op: 0.6 });
  /* where a hand is, in the world. Read after the figure is drawn. */
  const hand = (p, L) => {
    const s = p.st, d = p.dims, A = s.run, sw = A * 42 * sin(s.ph);
    const u = (L ? s.Lu + sw : s.Ru - sw) / R2, f = u + ((L ? s.Lf : s.Rf) - A * 62) / R2;
    const ex = (d.tw - 3) * (L ? -1 : 1) - d.ua * sin(u), ey = -d.th + 9 + d.ua * cos(u);
    return p.at(ex - (d.fa + 2) * sin(f), ey + (d.fa + 2) * cos(f));
  };

  /* things that are tweened and read in the draw below */
  const W = { weave: 1, fire: 1, fwood: 0, bread: 0, breadS: 1, carry: 0, take: 0, pile: 1 };
  const Rm = { wall: 0, floor: 0, front: 0, chair: 0, table: 0, lamp: 0, on: 0, door: 0 };

  /* ================================================================= where everyone starts */
  Object.assign(hs, { x: X_SIT0, y: GH, flip: 1, turn: 0.5, Lu: -18, Lf: -52, Ru: -12, Rf: -58, Rz: 1 }, HP.cross, FACE.calm, { px: 2.5, py: 1.5, mouth: 0.4 });
  Object.assign(ys, { x: 1622, y: GO, flip: 1, turn: 0.6, Lu: -20, Lf: -50, Ru: -14, Rf: -56, Rz: 1 }, HP.cross, FACE.calm, { px: 2.5, py: 1, mouth: 0.5 });
  Object.assign(es, { x: 1952, y: GO, flip: -1, turn: 0.5, headR: 8, Lu: -42, Lf: -62, Ru: -30, Rf: -78, Lz: 2, Rz: 1 }, HP.cross, FACE.calm, { px: 2, py: 2.5, mouth: 0.4 });
  Object.assign(ts, { x: 2016, y: GO, flip: -1, turn: 0.5, Lu: -20, Lf: -50, Ru: -14, Rf: -56, Rz: 1 }, HP.cross, FACE.happy, { px: 2, py: 2 });
  Object.assign(ks, { x: 1890, y: GO, flip: -1, turn: 0.6, Lu: -50, Lf: -74, Ru: -58, Rf: -62, Rz: 1 }, HP.knees, FACE.happy, { px: 2, py: 2 });
  hero.lx = X_SIT0; yv.lx = 1622; el.lx = 1952; teen.lx = 2016; kid.lx = 1890;

  /* ================================================================= the camera */
  const V_CAMP = [1575, 540, 500], V_AWAY = [980, 225, 900], V_MEET = [1390, 480, 640], V_GOOD = [1610, 560, 460], V_FLAT = [1410, 300, 640], V_END = [1480, 400, 520];
  cut(-0.2, -0.1, V_CAMP, 0);                           /* the film opens on the fire */
  cut(HK.upT + 0.05, HK.arriveT - 0.05, V_AWAY, 0);    /* the camera leaves before the human does, so it stays in the picture */
  cut(HK.backT, HK.stopT - 0.05, V_MEET, 0);
  cut(HK.moveT + 0.05, HK.moveT + 0.5, V_GOOD, 0);
  cut(H[5] + 0.02, H[5] + 0.5, V_FLAT, 0);
  cut(H[10] + 0.2, H[10] + 0.85, V_END, 0);

  /* the hour: late afternoon, then dusk while it is out there, and the moon comes up */
  const h0 = H[0];
  to(Wd, h0 + 0.25, 1.5, { sy: 566 }, "sine.inOut");
  to(Wd, h0 + 0.55, 1.3, { night: 0.62 }, "sine.inOut");
  to(Wd, h0 + 0.55, 1.3, { lit: 0.32 }, "sine.inOut");
  to(Wd, h0 + 0.85, 1.2, { my: 366 }, "sine.out");

  /* ================================================================= 1. it needs the others.
     The one next to it hands it food. It eats. The fire burns low, and it goes for wood. */
  const giveT = HK.giveT, biteT = HK.biteT;
  to(ys, 0.02, 0.2, { Ru: -34, Rf: -4, r: 9, Rz: 2 }, "power2.out");
  face(ys, 0.02, 0.2, "happy", { px: 3, py: 0 });
  to(hs, 0.04, 0.18, { turn: -0.8, headR: -4 }, "sine.inOut");
  face(hs, 0.05, 0.18, "happy", { px: -3, py: 1 });
  to(hs, 0.06, 0.18, { Lu: 46, Lf: -46 }, "power2.out");
  to(W, giveT, 0.12, { bread: 1 }, "sine.inOut");
  to(ys, giveT + 0.14, 0.25, { Ru: -14, Rf: -56, r: 0, Rz: 1 }, "sine.inOut");
  to(hs, giveT + 0.13, 0.18, { Lu: -34, Lf: -128, Lz: 2, turn: 0.5, headR: 0 }, "power2.inOut");
  face(hs, giveT + 0.14, 0.15, "happy", { px: 2, py: 1 });
  to(hs, biteT - 0.06, 0.06, { open: 0.9 }, "none");
  to(hs, biteT + 0.01, 0.06, { open: 0.05 }, "none");
  set(W, biteT + 0.01, { breadS: 0 });
  face(ys, giveT + 0.45, 0.25, "calm", { px: 2.5, py: 1.5, mouth: 0.5 });
  to(W, HK.dipT, 0.4, { fire: 0.5 }, "sine.inOut");
  /* it gets up and goes for wood */
  const upT = HK.upT, walkT = HK.walkT;
  face(hs, biteT + 0.08, 0.14, "calm", { px: 3, py: 2, mouth: 0.1 });                            /* a look at the fire */
  pz(hero, upT, 0.11, "crouch", { r: 14, Lu: 20, Lf: -20, Lz: 1, Ru: 10, Rf: -30, headR: 0 }, "power2.out");
  pz(hero, upT + 0.11, 0.14, "stand", { r: 0, Lu: 6, Lf: -6, Ru: -4, Rf: -6, Rz: 0 }, "back.out(1.6)");
  go(hero, walkT, HK.arriveT - walkT, X_OUT, { amp: 1 });
  to(hs, walkT, 0.12, { turn: 0.6 }, "none");
  face(hs, walkT, 0.2, "calm", { px: 3, py: 0, mouth: 0.2 });
  to(ys, walkT + 0.1, 0.2, { turn: -0.8 }, "sine.inOut"); face(ys, walkT + 0.1, 0.2, "calm", { px: -3, py: 0, mouth: 0.4 });
  to(ys, walkT + 0.7, 0.3, { turn: 0.6 }, "sine.inOut"); face(ys, walkT + 0.7, 0.3, "calm", { px: 2.5, py: 2, mouth: 0.3 });
  /* the others, all along: the little one rocks, the big one looks into the fire */
  for (let t = 0.3; t < HK.seeT - 1.4; t += 1.3) { to(ks, t, 0.6, { r: 4 }, "sine.inOut"); to(ks, t + 0.65, 0.6, { r: -3 }, "sine.inOut"); }
  for (let t = 0.6; t < HK.seeT - 1.5; t += 2.1) { to(ts, t, 0.4, { px: -1, py: 2.5, headR: 5 }, "sine.inOut"); to(ts, t + 1.0, 0.4, { px: 2.5, py: 1, headR: 0 }, "sine.inOut"); }

  /* ================================================================= 2. alone.
     It reaches the dead wood as the light goes, picks some up, and looks back at the fire, a long way off. */
  const h1 = H[1], aT = HK.arriveT, pickT = HK.pickT, lookT = HK.lookT;
  face(hs, h1 - 0.25, 0.3, "restless", { px: 3, py: 0, mouth: -0.2, brow: -0.3 });
  pz(hero, aT, 0.12, "crouch", { r: 16, Lu: -44, Lf: -24, Ru: -34, Rf: -26, Lz: 2, Rz: 1, headR: 6 }, "power2.out");
  set(W, pickT, { carry: 1, pile: 0 });
  pz(hero, pickT + 0.03, 0.18, "stand", { r: 0, Lu: -14, Lf: -84, Ru: -4, Rf: -6, Rz: 0, headR: 0 }, "back.out(1.4)");
  to(hs, lookT, 0.2, { turn: -0.85, headR: 4 }, "sine.inOut");
  face(hs, lookT, 0.25, "sad", { px: -3, py: 0, mouth: -0.6, lid: 0.12 });
  to(hs, lookT + 0.03, 0.28, { Ru: 12, Rf: 118, Rz: 1 }, "sine.inOut");                          /* its free arm comes across its body */
  to(hs, lookT + 0.1, 0.3, { shiver: 0.4 }, "none");

  /* ================================================================= 3. it goes to the others */
  const h2 = H[2], backT = HK.backT, stopT = HK.stopT;
  set(hs, HK.turnT, { flip: 1, turn: 0.7 });
  to(hs, HK.turnT, 0.08, { headR: 0, shiver: 0 }, "none");
  face(hs, HK.turnT, 0.15, "restless", { px: 3, py: 0, brow: -0.7, mouth: -0.4 });
  to(hs, backT - 0.06, 0.12, { Ru: -4, Rf: -6, Rz: 0 }, "sine.inOut");
  go(hero, backT, stopT - backT, X_MEET, { amp: 1 });
  dust(backT + 0.02, X_OUT - 6, GH, 4);
  face(hs, backT + 0.45, 0.25, "restless", { px: 3, py: 0, brow: -0.4, mouth: -0.1, pup: 1.1 });

  /* ================================================================= 4. they welcome it.
     They see it coming. The one who fed it gets up and takes the wood. The little one runs to it
     and holds on. The others wave. The wood goes on the fire. */
  const seeT = HK.seeT, takeT = HK.takeT, kidT = HK.kidT, hugT = HK.hugT, woodT = HK.woodT, moveT = HK.moveT;
  to(ys, seeT, 0.07, { turn: -0.9 }, "sine.inOut"); face(ys, seeT, 0.2, "happy", { px: -3, py: 0, open: 0.3 });
  to(ks, seeT + 0.04, 0.12, { turn: 0.9 }, "sine.inOut"); face(ks, seeT + 0.04, 0.15, "laugh", { px: 3, py: 0 });
  to(es, seeT + 0.08, 0.2, { turn: 0.9, headR: 0 }, "sine.inOut"); face(es, seeT + 0.08, 0.2, "happy", { px: 3, py: 0 });
  to(ts, seeT + 0.1, 0.2, { turn: 0.9, headR: 0 }, "sine.inOut"); face(ts, seeT + 0.1, 0.2, "laugh", { px: 3, py: 0 });
  to(W, seeT + 0.05, 0.2, { weave: 0 }, "none");
  /* the one who fed it: up, and its hands out for the wood */
  set(ys, seeT + 0.08, { flip: -1, turn: 0.7 });
  pz(yv, seeT + 0.08, 0.1, "crouch", { r: 10, Lu: 20, Lf: -20, Ru: 10, Rf: -30 }, "power2.out");
  pz(yv, seeT + 0.18, 0.14, "stand", { r: 0, Lu: 6, Lf: -6, Ru: -4, Rf: -6, Rz: 0 }, "back.out(1.5)");
  to(ys, takeT - 0.14, 0.14, { Lu: -62, Lf: -22, Lz: 2, Ru: -54, Rf: -26, Rz: 1 }, "power2.out");
  to(hs, takeT - 0.14, 0.14, { Lu: -58, Lf: -28, Lz: 2 }, "power2.out");
  to(W, takeT, 0.12, { take: 1 }, "sine.inOut");                                                 /* the wood changes hands */
  face(hs, takeT - 0.1, 0.2, "awe", { px: 3, py: 1, mouth: 0.25, open: 0.15 });
  set(ys, takeT + 0.16, { flip: 1, turn: 0.6 });
  to(ys, takeT + 0.13, 0.14, { Lu: -14, Lf: -84, Ru: -4, Rf: -6, Rz: 0 }, "sine.inOut");
  go(yv, takeT + 0.2, 0.36, X_WOOD, { amp: 0.6 });
  face(ys, takeT + 0.2, 0.2, "happy", { px: 3, py: 1 });
  to(ys, woodT - 0.1, 0.1, { r: 8, Lu: -64, Lf: -14, Lz: 2 }, "power2.out");                     /* onto the fire */
  to(W, woodT - 0.08, 0.1, { carry: 0 }, "power2.in");
  set(W, woodT + 0.04, { fwood: 1 });
  to(W, woodT + 0.03, 0.25, { fire: 1.3 }, "back.out(2)");
  to(W, woodT + 0.4, 0.6, { fire: 1.12 }, "sine.inOut");
  puff(E.fire, woodT + 0.04, 0, -24, { n: 9, r: 2.6, v: 46, fill: "#FFD98A", a0: -PI * 0.85, a1: -PI * 0.15, life: 0.6, rise: 50, seed: 31, op: 0.95 });
  to(ys, woodT + 0.02, 0.12, { r: 0, Lu: 6, Lf: -6, Lz: 1 }, "sine.inOut");
  go(yv, woodT + 0.14, 0.33, 1890, { amp: 0.6 });                                                /* round the fire, to the place the little one left */
  set(ys, woodT + 0.49, { flip: -1, turn: 0.6 });
  pz(yv, woodT + 0.5, 0.25, "cross", { Lu: -20, Lf: -50, Ru: -14, Rf: -56, Rz: 1 }, "power2.inOut");
  face(ys, woodT + 0.5, 0.25, "happy", { px: 2, py: 1 });
  /* the little one: up, across, and its arms round the human */
  pz(kid, seeT + 0.16, 0.14, "stand", { Lu: 6, Lf: -6, Ru: -4, Rf: -6, r: 0 }, "back.out(2)");
  go(kid, kidT, hugT - kidT - 0.05, X_MEET + 27);
  to(ks, hugT - 0.18, 0.16, { Lu: -104, Lf: -8, Ru: -96, Rf: -10, Lz: 2, Rz: 1 }, "power2.out");
  to(ks, hugT, 0.16, { Lu: -78, Lf: -30, Ru: -70, Rf: -28, r: 10, headR: -6 }, "power2.out");
  face(ks, hugT, 0.2, "bliss", { px: 2, py: 0 });
  /* the two across the fire */
  to(es, hugT - 0.08, 0.16, { Lu: -152, Lf: 8 }, "back.out(1.6)");
  /* one arm up, once, and down again. (v2: it waved twice, and the big one got up and hopped. Cut:
     the beat is 0.8 s now.) */
  to(es, hugT + 0.3, 0.22, { Lu: -42, Lf: -62 }, "sine.inOut");
  to(ts, moveT + 0.25, 0.25, { turn: 0.5 }, "sine.inOut");
  face(ts, moveT + 0.25, 0.25, "happy", { px: 2, py: 2 });
  /* the human: the feeling changes when it is held */
  to(hs, hugT, 0.1, { r: -4 }, "power2.out"); to(hs, hugT + 0.1, 0.2, { r: 0 }, "sine.inOut");
  to(hs, hugT + 0.02, 0.22, { Lu: -26, Lf: -34, Lz: 1, Ru: -20, Rf: -50, Rz: 1, headR: 12, turn: 0.5 }, "power2.out");   /* its arms come down round the little one */
  face(hs, hugT + 0.04, 0.25, "happy", { px: 2, py: 3, lid: 0.25, lidL: 0.3 });
  to(hs, hugT + 0.3, 0.14, { headR: 3, turn: 0.85 }, "sine.inOut");                              /* and it looks up at the others, at the fire */
  face(hs, hugT + 0.3, 0.14, "happy", { px: 3, py: -0.5, lid: 0.15, lidL: 0.4, open: 0.3 });
  /* they go to the fire together */
  to(hs, moveT - 0.02, 0.15, { Lu: 6, Lf: -6, Ru: -4, Rf: -6, Rz: 0, headR: 0, turn: 0.6 }, "sine.inOut");
  to(ks, moveT - 0.08, 0.12, { Lu: 6, Lf: -6, Ru: -4, Rf: -6, r: 0, headR: 0, Lz: 1, Rz: 0 }, "sine.inOut");
  face(ks, moveT - 0.06, 0.12, "laugh", { px: 3, py: 0 });
  go(kid, moveT + 0.06, 0.38, X_FIRE - 50);                                                      /* the little one stays at its side */
  pz(kid, moveT + 0.46, 0.2, "knees", { Lu: -50, Lf: -74, Ru: -58, Rf: -62, Rz: 1, turn: 0.6 }, "power2.out");
  face(ks, moveT + 0.46, 0.2, "happy", { px: 2, py: 1 });
  go(hero, moveT + 0.06, 0.38, X_FIRE, { amp: 0.6 });
  to(es, moveT + 0.25, 0.3, { turn: 0.5, headR: 8 }, "sine.inOut");
  face(es, moveT + 0.25, 0.3, "happy", { px: 2, py: 2, lid: 0.2 });
  to(W, moveT + 0.3, 0.3, { weave: 1 }, "none");

  /* ================================================================= 5. with the others.
     It sits down among them and the little one leans on it. */
  const h4 = H[4], sitT = HK.sitT, leanT = HK.leanT;
  pz(hero, sitT, 0.22, "cross", { r: 0, Lu: -18, Lf: -52, Ru: -12, Rf: -58, Lz: 1, Rz: 1, turn: 0.5, headR: 0 }, "power2.inOut");
  face(hs, sitT, 0.22, "happy", { px: 2.5, py: 1.5 });
  to(hs, sitT + 0.24, 0.34, { breath: 1.4 }, "none");
  to(ks, leanT, 0.24, { r: 12, headR: 8 }, "sine.inOut");
  face(ks, leanT, 0.24, "bliss", { px: 2, py: 1 });
  /* (v2 had a look down at the little one first: cut.) It looks into the fire. */
  to(hs, leanT + 0.04, 0.24, { headR: 3 }, "sine.inOut");
  face(hs, leanT + 0.04, 0.26, "bliss", { px: 2, py: 1.5, mouth: 0.8, lid: 0.4, lidL: 0.3 });
  face(ys, leanT + 0.06, 0.26, "bliss", { px: 2, py: 1.5, lid: 0.4 });

  /* ================================================================= the change: a flat is put down here */
  const C0 = H[5], wallT = HK.wallT, floorT = HK.floorT, frontT = HK.frontT, chairT = HK.chairT, tableT = HK.tableT, lampT = HK.lampT, onT = HK.onT;
  /* concrete does not bounce: the wall and the front come down and stay */
  to(Rm, wallT - 0.2, 0.2, { wall: 1 }, "power2.in");
  to(Rm, floorT, 0.3, { floor: 1 }, "power1.inOut");
  to(Rm, frontT - 0.2, 0.2, { front: 1 }, "power2.in");
  SHAKES.push([wallT, 9], [frontT, 8], [chairT + 0.08, 2.5]);
  to(Rm, chairT, 0.2, { chair: 1 }, "back.out(2.2)");
  to(Rm, tableT, 0.2, { table: 1 }, "back.out(2.2)");
  to(Rm, lampT, 0.28, { lamp: 1 }, "back.out(1.5)");
  [[0, 1], [0.05, 0.15], [0.1, 1], [0.14, 0.3], [0.19, 1]].forEach(([dt, v]) => set(Rm, onT + dt, { on: v }));
  to(Wd, onT, 0.2, { lit: 0 }, "none");
  /* the human: a start when the wall lands where the others were, and then it finds itself on a chair */
  hop(hs, wallT, 0.14, 6);
  face(hs, wallT, 0.08, "shock", { px: -3, py: -1, mouth: -0.45, open: 0.3 });
  to(hs, wallT, 0.12, { turn: -0.9, headR: -8, Lu: -18, Lf: -52, breath: 1 }, "power2.out");       /* it looks round at where the little one was */
  to(hs, wallT + 0.2, 0.15, { turn: 0.8, headR: -4 }, "sine.inOut");                             /* and at where the fire was */
  face(hs, wallT + 0.2, 0.15, "puzzled", { px: 3, py: -1 });
  hop(hs, frontT, 0.12, 4);
  face(hs, frontT, 0.08, "shock", { px: 2, py: -3, mouth: -0.45, open: 0.3 });
  to(hs, frontT, 0.1, { headR: -8 }, "power2.out");
  const lowNow = hero.low(HP.cross, 0);
  set(hs, chairT - 0.002, { gnd: 0, h: lowNow });
  to(hs, chairT, 0.2, Object.assign({}, HP.chair, { h: SEAT, r: 0, x: EP.chair, Lu: -6, Lf: -40, Ru: -4, Rf: -44, headR: 0 }), "back.out(1.8)");
  face(hs, chairT, 0.12, "shock", { px: 0, py: 3, mouth: -0.45, open: 0.3 });
  to(hs, chairT + 0.2, 0.15, { turn: -0.8 }, "sine.inOut");                                      /* the table laid for one */
  face(hs, chairT + 0.2, 0.2, "puzzled", { px: -3, py: 1 });
  to(hs, chairT + 0.41, 0.15, { turn: -0.5, headR: -9 }, "sine.inOut");                          /* the lamp */
  face(hs, chairT + 0.41, 0.18, "puzzled", { px: -2.5, py: -3 });
  hero.lx = EP.chair;

  /* ================================================================= X1: it still needs the others.
     It looks at the door, at the window, and down. */
  const h6 = H[6], h7 = H[7], h8 = H[8], h9 = H[9], h10 = H[10], h11 = H[11];
  to(hs, h6, 0.18, { turn: 0.8, headR: 0 }, "sine.inOut");
  face(hs, h6, 0.18, "puzzled", { px: 3, py: 0 });
  to(hs, h6 + 0.38, 0.2, { turn: -0.8, headR: -3 }, "sine.inOut");
  face(hs, h6 + 0.38, 0.2, "restless", { px: -3, py: 0, mouth: -0.2 });
  to(hs, h6 + 0.76, 0.28, { turn: 0.3, headR: 7 }, "sine.inOut");
  face(hs, h6 + 0.76, 0.28, "sad", { px: 1, py: 2.5, mouth: -0.45, brow: -0.6, lid: 0.2 });
  /* ================================================================= X2: being alone still feels bad */
  to(hs, h7 + 0.02, 0.3, { Lu: -25, Lf: -118, Lz: 2, Ru: 12, Rf: 118, Rz: 1, headR: 11, r: 5 }, "sine.inOut");   /* its arms come across its body, as in the meadow */
  face(hs, h7 + 0.02, 0.3, "sad", { px: 1, py: 3 });
  to(hs, h7 + 0.3, 0.3, { shiver: 0.35 }, "none");
  to(hs, h7 + 0.74, 0.2, { turn: 0.8, headR: 3 }, "sine.inOut");                                 /* the door */
  face(hs, h7 + 0.74, 0.2, "restless", { px: 3, py: -0.5, brow: -0.8, mouth: -0.5 });
  /* ================================================================= X3: it still looks for the others */
  const up2 = HK.up2T, winT = HK.winT, toDoorT = HK.toDoorT, doorT = HK.doorT, openT = HK.openT;
  to(hs, up2 - 0.1, 0.1, { shiver: 0 }, "none");
  pz(hero, up2, 0.14, "stand", { h: standK + 7, r: 0, Lu: 6, Lf: -6, Ru: -4, Rf: -6, Lz: 1, Rz: 0, headR: 0 }, "power2.out");
  to(hs, up2 + 0.14, 0.06, { h: standK }, "power2.in");
  set(hs, up2 + 0.21, { gnd: 1, h: 0 });
  face(hs, up2, 0.15, "restless", { px: -3, py: -1, brow: -0.4, mouth: -0.2 });
  go(hero, HK.toWinT, winT - HK.toWinT - 0.04, 1722, { amp: 0.45 });
  to(hs, winT - 0.08, 0.14, { Lu: -35, Lf: -25, Ru: -31, Rf: -27, Rz: 1, headR: -5, turn: 0.85 }, "back.out(1.5)");   /* hands on the sill */
  face(hs, winT - 0.08, 0.14, "restless", { px: 3, py: -1.5, brow: -0.4, mouth: -0.15, pup: 1.1 });
  to(hs, winT + 0.07, 0.1, { py: -2.5, headR: -7 }, "sine.inOut");                               /* the windows across */
  face(hs, winT + 0.18, 0.1, "sad", { mouth: -0.5 });
  to(hs, toDoorT - 0.12, 0.11, { Lu: 6, Lf: -6, Ru: -4, Rf: -6, Rz: 0, headR: 0 }, "sine.inOut");
  go(hero, toDoorT, doorT - toDoorT - 0.04, 1846, { amp: 0.5 });
  to(hs, toDoorT, 0.12, { turn: 0.7 }, "none");
  face(hs, toDoorT, 0.2, "restless", { px: 3, py: 0, brow: -0.3, mouth: -0.1 });
  to(hs, doorT, 0.1, { Ru: -66, Rf: -14, Rz: 2 }, "power2.out");                                 /* its hand on the door */
  to(Rm, openT, 0.22, { door: 1 }, "power2.inOut");
  to(hs, openT, 0.22, { Ru: -40, Rf: -30 }, "power2.inOut");
  face(hs, openT, 0.2, "awe", { px: 3, py: 0, mouth: 0.15, open: 0.2 });
  /* ================================================================= X4: nobody is there */
  to(hs, h9, 0.12, { Ru: -4, Rf: -6, Rz: 0 }, "sine.inOut");
  to(hs, h9 + 0.02, 0.18, { turn: 0.9, r: 8 }, "sine.inOut");                                      /* it leans into the doorway */
  face(hs, h9 + 0.02, 0.2, "puzzled", { px: 3, py: -2.5, mouth: -0.25 });                        /* up the stairs */
  face(hs, h9 + 0.3, 0.25, "sad", { px: 2.5, py: 1, mouth: -0.75, lid: 0.2 });
  to(hs, h9 + 0.3, 0.25, { r: 0, headR: 10, turn: 0.5 }, "sine.inOut");
  const closeT = HK.closeT, back2T = HK.back2T, sit2T = HK.sit2T, slumpT = HK.slumpT;
  to(hs, closeT - 0.12, 0.11, { Ru: -66, Rf: -14, Rz: 2 }, "power2.out");
  to(Rm, closeT, 0.2, { door: 0 }, "power2.inOut");
  to(hs, closeT, 0.2, { Ru: -74, Rf: -8 }, "power2.inOut");
  to(hs, closeT + 0.21, 0.11, { Ru: -4, Rf: -6, Rz: 0 }, "sine.inOut");
  /* ================================================================= X5: the bad feeling never stops.
     It goes back to the chair and sits. A day passes in the window. */
  go(hero, back2T, sit2T - back2T - 0.06, EP.chair, { amp: 0.45 });
  to(hs, back2T, 0.2, { headR: 13, turn: 0.4, px: 1, py: 3 }, "sine.inOut");
  set(hs, sit2T, { flip: 1, gnd: 0, h: standK });
  to(hs, sit2T + 0.02, 0.22, Object.assign({}, HP.chair, { h: SEAT, Lu: -6, Lf: -40, Ru: -4, Rf: -44 }), "power2.inOut");
  to(hs, slumpT, 0.3, { r: 13, headR: 15, Lu: -34, Lf: -52, Ru: -30, Rf: -56, Lz: 2, Rz: 1 }, "sine.inOut");   /* elbows on its knees */
  face(hs, slumpT, 0.3, "sad", { px: 1, py: 3, lid: 0.42, mouth: -0.7 });
  to(Wd, HK.dayT, 0.4, { night: 0 }, "sine.inOut");
  to(Wd, HK.nightT, 0.45, { night: 0.62 }, "sine.inOut");
  /* ================================================================= its own words */
  to(hs, h11 - 0.08, 0.2, { headR: 9, turn: 0.4 }, "sine.inOut");
  face(hs, h11 - 0.08, 0.15, "sad", { px: 1.5, py: 2, lid: 0.3, mouth: -0.7 });
  [0, 1, 2].forEach((k) => { to(hs, HK.sayT + k * 0.16, 0.07, { open: 0.42 }, "sine.inOut"); to(hs, HK.sayT + 0.08 + k * 0.16, 0.07, { open: 0.04 }, "sine.inOut"); });

  /* ================================================================= draw */
  const flames = qa(E.fire, ".fl"), fpool = $("fpool"), fhalo = $("fhalo"), fwood = $("fwood");
  const sparks = G([0, 1, 2, 3, 4, 5].map(() => '<circle r="2.2" fill="#FFD98A"/>').join(""), $("sparks")), spk = Array.from(sparks.children);
  const flclip = $("eflclipr"), flroll = $("eflroll"), lightF = $("elightF"), lampF = $("elampF"), pilesticks = $("pilesticks");
  const winstars = $("winstars"), opplit = $("opplit"), fwlit = $("fwlit");
  const [rx0, , rx1] = EP.room, [fy0, fy1] = EP.floor, [wx0] = EP.win, dx1 = EP.door[2];
  const pop = (g, x, y, k, flip) => { OP(g, k > 0.01 ? 1 : 0); place(g, x, y, 0, flip || 1, Math.max(0.01, k)); };
  draws.push((t) => {
    const n = Wd.night, nn = sat(n / 0.62);
    /* the flat (cheap, and it must be hidden before the change) */
    OP(E.wall, Rm.wall > 0.001 ? 1 : 0); TR(E.wall, "translate(0 " + f1(-(1 - Rm.wall) * 1000) + ")");
    OP(E.facade, Rm.front > 0.001 ? 1 : 0); TR(E.facade, "translate(0 " + f1(-(1 - Rm.front) * 1120) + ")");
    OP(E.floor, Rm.floor > 0.001 ? 1 : 0);
    SA(flclip, "width", f1(Rm.floor * (rx1 - rx0 + 60)));
    OP(flroll, Rm.floor > 0.001 && Rm.floor < 0.999 ? 1 : 0); place(flroll, rx0 - 30 + Rm.floor * (rx1 - rx0 + 60), (fy0 + fy1) / 2, 0, 1);
    TR(E.dleaf, "translate(" + dx1 + " 0) scale(" + f2(1 - 0.86 * Rm.door) + " 1)");
    OP(winstars, nn * 0.9); OP(opplit, nn); OP(fwlit, nn);
    pop(armchair, EP.chair, GH, Rm.chair); pop(table, EP.table, GH + 8, Rm.table); pop(stool, EP.stool, GH - 2, Rm.table, -1);
    const on = Rm.on * sat(n / 0.25), fl2 = on * (0.95 + 0.05 * sin(t * 41));
    OP(lampG, Rm.lamp > 0.01 ? 1 : 0);
    place(lampG, EP.lamp[0], EP.lamp[1] - (1 - Rm.lamp) * 150, sin(t * 2.3) * 2.2 * Math.exp(-1.2 * Math.max(0, t - lampT)), 1);
    SA(bulb, "fill", on > 0.5 ? "#FFF3C4" : "#8C8C9A");
    OP(lampHalo, fl2 * 0.5); OP(cone, fl2 * 0.11); OP(lampF, fl2 * 0.3 * Rm.floor);
    /* by day the window lights a patch of the floor */
    OP(lightF, (1 - nn) * 0.42 * Rm.front);
    TR(lightF, "translate(" + (wx0 - 34) + " " + (fy0 + 10) + ")");
    /* the fire */
    const gone = Rm.wall > 0.999;
    OP(E.others, gone ? 0 : 1);
    OP(pilesticks, W.pile);
    if (!gone) {
      const f = W.fire;
      flames.forEach((e, i) => TR(e, "translate(0 -6) scale(" + f2(f * (1 + 0.12 * sin(t * 11 + i * 2))) + " " + f2(f * (1 + 0.2 * sin(t * 13 + i))) + ") translate(0 6)"));
      const fg = sat(n / 0.45) * (0.55 + 0.45 * f) * (0.93 + 0.07 * sin(t * 17)) * (1 - Rm.wall);
      OP(fpool, fg * 0.7); OP(fhalo, fg * 0.55);
      OP(fwood, W.fwood);
      spk.forEach((e, i) => { const u = ((t * 0.55 + i / 6) % 1 + 1) % 1; place(e, sin(u * 7 + i * 2.1) * 12, -44 - u * 130 * f, 0, 1); OP(e, (1 - u) * sat(n * 3) * sat(f - 0.3) * sat(u * 10)); });
      /* the weaving goes on while the old one sits */
      OP(basket, 1); place(basket, es.x - 46, GO + 3, 0, 1);
    }
    /* the little one is in front of the human while it holds on to it, and with the others before and after */
    const kpar = t >= kidT && t < moveT + 0.46 ? E.near : E.people;
    if (kid.g._w.parentNode !== kpar) kpar.appendChild(kid.g._w);
    /* people: phase from distance, and the small loops that ride on the poses */
    PEOPLE.forEach((p, i) => { p.st.ph = Bake.at("hu" + i + ".ph", t); });
    const sv = [es.Lf, es.Rf, es.Lu];
    es.Lf += 9 * sin(t * 5.2) * W.weave; es.Rf += 9 * sin(t * 5.2 + 2) * W.weave; es.Lu += 4 * sin(t * 2.6) * W.weave;
    if (!gone) OTHERS.forEach((p) => p.draw(t));
    hero.draw(t);
    es.Lf = sv[0]; es.Rf = sv[1]; es.Lu = sv[2];
    /* what is carried */
    if (W.breadS > 0.01 && !gone) {
      const a = hand(yv, false), b = hand(hero, true), u = W.bread;
      OP(bread, 1); place(bread, lerp(a[0], b[0], u), lerp(a[1], b[1], u), 0, W.breadS);
    } else OP(bread, 0);
    if (W.carry > 0.01 && !gone) {
      const a = hand(hero, true), b = hand(yv, true), k = W.take, u = W.carry, fl_ = k > 0.5 ? ys.flip : hs.flip;
      const x = lerp(a[0] - 4 * hs.flip, b[0] - 4 * ys.flip, k), y = lerp(a[1], b[1], k) - 5;
      OP(bundle, 1); place(bundle, lerp(FIRE[0], x, u), lerp(FIRE[1] - 14, y, u), -4 * fl_, fl_);
    } else OP(bundle, 0);
  });

  /* ================================================================= the human's feeling.
     Checked against the five rules in finale.js. Green = feels right, red = feels wrong.
     It turns good when the answer comes (it is held). In the flat no answer comes, and it never turns. */
  const GLOW = [
    [0.02, "green", 0.4, 0.12],                /* with the others */
    [giveT + 0.1, "green", 0.55, 0.2],         /* it is fed */
    [walkT + 0.05, "green", 0.25, 0.2],         /* it runs off: nothing wrong yet, only less of what was right */
    [h1 - 0.3, "red", 0.4, 0.3],               /* further from them with every step, and the light going */
    [aT, "red", 0.55, 0.2],                    /* out of their sight and hearing */
    [lookT, "red", 0.72, 0.25],                /* alone */
    [backT, "red", 0.5, 0.25],                 /* it has turned back: moving */
    [backT + 0.45, "red", 0.35, 0.3],          /* and they are close */
    [hugT, "red", 0, 0.1],                     /* held: the answer. From here the light is drawn round the two of them: GLOW2 */
    [wallT - 0.02, "red", 0.4, 0.08],          /* the thud, and the one on its arm is gone: a start */
    [wallT + 0.2, "red", 0.25, 0.2],           /* nothing in a wall says danger */
    [frontT - 0.03, "red", 0.38, 0.08],
    [frontT + 0.2, "red", 0.25, 0.2],
    [h6 + 0.1, "red", 0.45, 0.3],              /* nobody in the room */
    [h7 + 0.05, "red", 0.72, 0.3],             /* alone, as in the meadow */
    [up2 + 0.05, "red", 0.55, 0.2],            /* on its feet, looking: moving */
    [doorT, "red", 0.4, 0.2],                  /* the door: they may be behind it */
    [h9 + 0.1, "red", 0.85, 0.25],             /* nobody: now it lands */
    [h10 + 0.15, "red", 1, 0.3],               /* and nothing ends it */
  ];
  /* While the little one holds on to it and then sits against it the two are one outline (as the
     monkeys were in v9), so the little one is not washed out by the light next to it. The feeling is
     still the human's. */
  const GLOW2 = [
    [hugT + 0.06, "green", 0.6, 0.2],          /* held: the answer */
    [woodT, "green", 0.78, 0.25],              /* the fire comes up, and they are all round it */
    [sitT, "green", 0.85, 0.3],                /* among them */
    [wallT - 0.08, "green", 0, 0.08],          /* the wall comes down between them */
  ];
  Object.assign(S.A, { hero, hs, kid, HGLOW: GLOW, HGLOW2: GLOW2, Rm, W, state: { hero: hs, fed: ys, old: es, big: ts, little: ks, W, Rm, Wd } });
})(ST);
