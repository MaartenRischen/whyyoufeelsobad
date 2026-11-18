/* rigs.js - every creature is a jointed paper puppet held together with brass pins.
   Each factory returns { g, st (plain numbers that GSAP tweens), draw(t) }.
   v4: every creature has a face that can show what it feels (brow, lids, pupil, mouth),
   blinks and breathes on its own, and has more joints. */

let _uid = 0;
const f2 = (x) => Math.round(x * 100) / 100;
/* a puppet sits in a wrapper that carries the paper shadow; the inner <g> is the one that moves */
function PP(parent, str, cls) { const w = G("", parent, "pp"); const g = G(str, w, cls); g._w = w; return g; }

/* ------------------------------------------------------------------ faces */
/* The same few numbers drive every face:
   mouth -1 frown .. 1 smile, open 0..1, brow -1 worried .. 1 angry, browOn 0..1,
   lid 0..1 (upper), lidA its tilt in degrees (+ = angry), lidL 0..1 (lower), pup pupil size. */
const FACE = {
  calm: { mouth: 0.15, open: 0, brow: 0, browOn: 0, lid: 0.12, lidA: 0, lidL: 0, pup: 1 },
  happy: { mouth: 1, open: 0, brow: 0, browOn: 0, lid: 0.1, lidA: 0, lidL: 0.46, pup: 1.08 },
  bliss: { mouth: 1, open: 0, brow: 0, browOn: 0, lid: 0.56, lidA: 0, lidL: 0.5, pup: 1 },
  alert: { mouth: -0.15, open: 0.25, brow: -0.4, browOn: 0.8, lid: 0, lidA: 0, lidL: 0, pup: 0.78 },
  drive: { mouth: -0.35, open: 0, brow: 0.5, browOn: 0.85, lid: 0.2, lidA: 10, lidL: 0, pup: 0.9 },
  angry: { mouth: -0.75, open: 0, brow: 1, browOn: 1, lid: 0.32, lidA: 20, lidL: 0.1, pup: 0.74 },
  rage: { mouth: -1, open: 0.45, brow: 1, browOn: 1, lid: 0.4, lidA: 26, lidL: 0.16, pup: 0.56 },
  shock: { mouth: -0.3, open: 1, brow: -0.7, browOn: 1, lid: 0, lidA: 0, lidL: 0, pup: 0.46 },
  sad: { mouth: -0.85, open: 0, brow: -1, browOn: 1, lid: 0.3, lidA: -18, lidL: 0, pup: 1.12 },
  cry: { mouth: -1, open: 0.85, brow: -1, browOn: 1, lid: 0.5, lidA: -20, lidL: 0.3, pup: 1 },
  tired: { mouth: -0.5, open: 0.5, brow: -0.6, browOn: 0.8, lid: 0.58, lidA: -10, lidL: 0.05, pup: 0.9 },
  smug: { mouth: 0.8, open: 0, brow: 0.4, browOn: 0.7, lid: 0.45, lidA: 6, lidL: 0.1, pup: 0.95 },
  awe: { mouth: 0.3, open: 0.5, brow: -0.5, browOn: 0.6, lid: 0, lidA: 0, lidL: 0, pup: 1.35 },
  /* v5: heading for what it wants (feels good), and held by a cue stronger than the real one */
  keen: { mouth: 0.6, open: 0, brow: 0.2, browOn: 0.45, lid: 0.1, lidA: 3, lidL: 0.22, pup: 1.1 },
  rapt: { mouth: 1, open: 0.5, brow: -0.55, browOn: 0.55, lid: 0, lidA: 0, lidL: 0.12, pup: 1.45 },
};
const FACE0 = { mouth: 0.15, open: 0, brow: 0, browOn: 0, lid: 0.12, lidA: 0, lidL: 0, pup: 1, px: 0, py: 0 };

function eyeRig(cx, cy, r, o) {
  o = o || {};
  const id = "ec" + (++_uid), ir = o.ir || r * 0.66, pr = o.pr || r * 0.42, sw = o.sw || (r > 8 ? 2.4 : 1.6);
  const at = 'cx="' + f2(cx) + '" cy="' + f2(cy) + '"';
  const svg = '<g class="eyeR"><clipPath id="' + id + '"><circle ' + at + ' r="' + f2(r) + '"/></clipPath>' +
    "<circle " + at + ' r="' + f2(r) + '" fill="#FFFBEF"/>' +
    '<g clip-path="url(#' + id + ')"><g class="ir">' +
    (o.iris ? "<circle " + at + ' r="' + f2(ir) + '" fill="' + o.iris + '"/>' : "") +
    (o.slit ? "<ellipse " + at + ' rx="' + f2(pr * 1.3) + '" ry="' + f2(pr * 0.62) + '" fill="#22202E"/>' : "<circle " + at + ' r="' + f2(pr) + '" fill="#22202E"/>') +
    '<circle cx="' + f2(cx - pr * 0.5) + '" cy="' + f2(cy - pr * 0.55) + '" r="' + f2(pr * 0.34) + '" fill="#FFFBEF"/>' +
    '<circle class="gl" ' + at + ' r="' + f2(pr * 0.7) + '" fill="#FFD25E" opacity="0"/></g>' +
    '<g class="lu"><rect x="' + f2(cx - 2.5 * r) + '" y="' + f2(cy - 4 * r) + '" width="' + f2(5 * r) + '" height="' + f2(3 * r) + '" class="f-' + (o.lid || "ink") + '"/></g>' +
    '<g class="ll"><rect x="' + f2(cx - 2.5 * r) + '" y="' + f2(cy + r) + '" width="' + f2(5 * r) + '" height="' + f2(3 * r) + '" class="f-' + (o.lidL || o.lid || "ink") + '"/></g></g>' +
    '<circle class="eo" ' + at + ' r="' + f2(r) + '" fill="none" stroke="#22202E" stroke-width="' + sw + '"/>' +
    '<path class="ecl" fill="none" stroke="#22202E" stroke-width="' + f2(sw * 1.2) + '" stroke-linecap="round" opacity="0" d="M' + f2(cx - r * 0.78) + "," + f2(cy + r * 0.14) + " Q" + f2(cx) + "," + f2(cy - r * 0.5) + " " + f2(cx + r * 0.78) + "," + f2(cy + r * 0.14) + '"/></g>';
  return { svg, cx, cy, r, ir };
}
function eyeBind(root, E, idx) {
  const e = qa(root, ".eyeR")[idx || 0];
  return { ir: q(e, ".ir"), lu: q(e, ".lu"), ll: q(e, ".ll"), ecl: q(e, ".ecl"), gl: q(e, ".gl"), eo: q(e, ".eo"), E };
}
function eyeSet(b, px, py, lu, la, ll, pup, glint) {
  const E = b.E, m = E.r - E.ir * 0.7, d = Math.hypot(px, py);
  if (d > m && d > 0) { px *= m / d; py *= m / d; }
  TR(b.ir, "translate(" + f1(px + E.cx) + " " + f1(py + E.cy) + ") scale(" + f2(pup) + ") translate(" + f2(-E.cx) + " " + f2(-E.cy) + ")");
  TR(b.lu, "rotate(" + f1(la) + " " + f2(E.cx) + " " + f2(E.cy) + ") translate(0 " + f1(sat(lu) * 2 * E.r) + ")");
  TR(b.ll, "translate(0 " + f1(-sat(ll) * 2 * E.r) + ")");
  const cl = sat((lu + ll - 0.84) / 0.14);
  OP(b.ecl, cl); OP(b.eo, 1 - 0.75 * cl);
  OP(b.gl, glint || 0);
}

/* ------------------------------------------------------------------ fish: three body parts on two pins */
function makeFish(parent, opt) {
  opt = opt || {};
  const bc = opt.body || "fish", kc = opt.back || "fishback", fc = "fishfin";
  const E = eyeRig(64, -9, 14, { iris: opt.iris || "#49B7C9", ir: 9.6, pr: 5.6, lid: kc, lidL: bc, sw: 2.4 });
  const spn = (x, h) => '<g class="sp" data-x="' + (x + 6) + '"><path class="f-' + fc + '" d="M' + x + ",-30 L" + (x + 5) + "," + (-30 - h) + " L" + (x + 13) + ',-30 Z"/></g>';
  const BELLY = "M94,7 C80,25 42,39 0,37 C-18,36 -32,31 -44,24 C-20,21 22,15 52,9 C68,6 82,4 94,7 Z";
  const JAW = "M95.5,4.5 L72,10 L75,26 C83,22 91,14 95.5,4.5 Z";
  const g = PP(parent,
    '<g class="rear">' +
    '<g class="tail"><path class="f-' + fc + '" d="M-78,0 L-130,-38 Q-110,0 -130,38 Z"/><path class="s-' + bc + '" stroke-width="2.5" opacity="0.5" fill="none" d="M-92,-8 L-120,-26 M-94,0 L-118,0 M-92,8 L-120,26"/>' + brad(-82, 0, 3.4) + "</g>" +
    '<path class="f-' + fc + '" d="M-18,-31 Q-46,-58 -76,-10 L-56,-20 Z"/>' +
    '<path class="f-' + fc + '" d="M-14,33 Q-44,56 -74,10 L-54,20 Z"/>' +
    '<path class="f-' + bc + '" d="M-10,-35 C-44,-32 -68,-19 -88,-9 L-88,9 C-68,19 -44,34 -10,37 Z"/>' +
    '<path class="f-' + kc + '" d="M-10,-35 C-44,-32 -68,-19 -88,-9 L-88,-2 C-62,-8 -40,-11 -10,-12 Z"/>' +
    '<path class="s-' + fc + '" stroke-width="2.6" stroke-linecap="round" opacity="0.45" d="M-66,-9 L-66,7 M-54,-13 L-54,10"/>' +
    "</g>" +
    spn(26, 31) + spn(4, 30) + spn(-16, 22) +
    '<g class="pelv"><path class="f-red2" d="M10,33 L3,58 L21,35 Z"/></g>' +
    '<path class="f-' + bc + '" d="M96,3 C82,-22 42,-37 -4,-35 L-20,-34.6 A35.4,35.4 0 0 0 -20,36.2 L-4,37 C42,39 82,23 96,3 Z"/>' +
    '<path class="f-' + kc + '" d="M96,3 C82,-22 42,-37 -4,-35 L-20,-34.6 A35.4,35.4 0 0 0 -53.3,-12 C-30,-12.6 -14,-12 0,-12 C30,-12 52,-22 70,-24 C80,-16 90,-6 96,3 Z"/>' +
    '<path class="f-red" d="' + BELLY + '"/><path class="flush" fill="#FF3A2B" opacity="0" d="' + BELLY + '"/>' +
    '<path stroke="#FFFBEF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.35" d="M-2,-29 Q28,-31 58,-25"/>' +
    '<path class="s-' + fc + '" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.5" d="M-8,-20 L-8,7 M6,-22 L6,8 M20,-22 L20,7"/>' +
    '<path class="s-' + fc + '" stroke-width="3.5" stroke-linecap="round" fill="none" d="M46,-18 Q38,-2 46,12"/>' +
    '<path class="f-ink" d="' + JAW + '"/><path fill="#E8776A" d="M90,9 L76,12 L80,22 Z"/><g class="jaw"><path class="f-red" d="' + JAW + '"/><path class="flush" fill="#FF3A2B" opacity="0" d="' + JAW + '"/></g>' +
    '<path class="lip s-ink" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M95,4.6 L75,9.6"/>' +
    '<g class="pec"><path class="f-fish2" d="M36,7 Q14,-8 0,10 Q16,27 36,7 Z"/><path class="s-' + fc + '" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.5" d="M30,8 L8,6 M30,10 L10,14"/></g>' + brad(36, 7, 3.4) +
    E.svg +
    '<path class="brow s-ink" stroke-width="6.5" stroke-linecap="round" d="M47,-27 L83,-27" opacity="0"/>' +
    '<g class="hurt" opacity="0"><path class="s-ink" stroke-width="2.6" stroke-linecap="round" fill="none" d="M-2,0 l10,-7 M2,5 l10,-7 M26,-8 l-9,9 M-34,14 l8,6"/>' +
    '<g transform="translate(22 -26) rotate(-24)"><rect x="-11" y="-5" width="22" height="10" rx="3" fill="#F3D9B4" stroke="#22202E" stroke-width="1.6"/><path stroke="#22202E" stroke-width="1.4" d="M-3,-2 l0,4 M3,-2 l0,4"/></g></g>' +
    brad(-20, 0, 4.2),
    "fish");
  const rear = q(g, ".rear"), tail = q(g, ".tail"), pec = q(g, ".pec"), sp = qa(g, ".sp"), pelv = q(g, ".pelv"), jaw = q(g, ".jaw"), lip = q(g, ".lip"),
    brow = q(g, ".brow"), hurt = q(g, ".hurt"), flush = qa(g, ".flush"), eb = eyeBind(g, E, 0);
  const seed = opt.seed || 1;
  const st = Object.assign({ x: 0, y: 0, r: 0, flip: 1, s: 0.75, sx: 1, sy: 1, vis: 1, sw: 0, swA: 9, bend: 0, fan: 0, spine: 0, flush: 0, hurt: 0, lost: 0, dizzy: 0, blinkOff: 0 }, FACE0, { px: 2 });
  function draw(t) {
    OP(g, st.vis);
    if (st.vis < 0.01) return;
    place(g, st.x, st.y, st.r, st.s * st.flip * st.sx, st.s * st.sy);
    rot(rear, st.swA * 0.55 * sin(st.sw) + st.bend, -20, 0);
    rot(tail, st.swA * 1.3 * sin(st.sw - 1.1) + st.bend * 0.9, -80, 0);
    rot(pec, lerp(sin(t * 6.5 + seed) * 16 - 6, sin(t * 26) * 30 - 12, st.fan), 36, 7);
    sp.forEach((e, i) => {
      rot(e, lerp(-70, 3 + i * 4, st.spine) + sin(t * 31 + i) * 3 * st.spine * st.browOn, +e.dataset.x, -33);
      if (i === 1) OP(e, 1 - st.lost);
    });
    rot(pelv, lerp(64, 0, st.spine), 12, 33);
    rot(jaw, st.open * 36, 73, 10);
    SA(lip, "d", "M95,4.6 L75,9.6 Q70.5,10.8 " + f1(68.5 - Math.abs(st.mouth)) + "," + f1(10.8 - 7 * st.mouth));
    const bl = st.blinkOff ? 0 : blink(t, seed, 3.4);
    const dz = st.dizzy;
    eyeSet(eb, st.px + dz * 5 * cos(t * 17) + noise(t * 1.3, seed) * 0.8, st.py + dz * 5 * sin(t * 17), Math.max(st.lid, bl * 0.95), st.lidA, st.lidL, st.pup);
    OP(brow, st.browOn);
    TR(brow, "translate(0 " + f1(st.brow > 0 ? 3.5 * st.brow : 2.5 * st.brow) + ") rotate(" + f1(st.brow * 21) + " 65 -27)");
    OP(hurt, st.hurt);
    flush.forEach((e) => OP(e, st.flush));
  }
  return { g, st, draw };
}

function makeNest(parent) {
  return G(
    '<path class="f-nest" d="M-70,6 Q-62,-44 -8,-52 Q50,-56 68,6 Z"/>' +
    '<path class="s-nest2" stroke-width="4" stroke-linecap="round" fill="none" d="M-54,-6 Q-30,-30 0,-34 M-40,2 Q-10,-18 30,-22 M-20,-44 Q14,-48 44,-22 M14,-8 Q34,-14 54,0 M-58,2 Q-64,-10 -74,-8 M56,-10 Q66,-22 74,-16 M-30,-40 Q-36,-54 -30,-62 M30,-46 Q40,-58 36,-66"/>' +
    '<path class="s-leaf2" stroke-width="3.4" stroke-linecap="round" fill="none" d="M-46,-14 Q-20,-36 10,-40 M24,-34 Q44,-28 52,-8"/>' +
    '<ellipse cx="14" cy="-16" rx="18" ry="15" class="f-ink"/>' +
    '<circle cx="8" cy="-12" r="4.4" fill="#F6DD8C"/><circle cx="18" cy="-10" r="4.4" fill="#F6DD8C"/><circle cx="13" cy="-19" r="4.4" fill="#F6DD8C"/><circle cx="22" cy="-18" r="3.6" fill="#EFCB6E"/>' +
    '<circle cx="6.8" cy="-13.2" r="1.3" fill="#FFFBEF"/><circle cx="16.8" cy="-11.2" r="1.3" fill="#FFFBEF"/><circle cx="11.8" cy="-20.2" r="1.3" fill="#FFFBEF"/>',
    parent, "nest");
}

function makeBlock(parent) {
  return PP(parent,
    '<rect x="-84" y="-32" width="168" height="64" rx="7" class="f-wood"/>' +
    '<path class="s-wood2" stroke-width="3" stroke-linecap="round" fill="none" d="M-70,-20 Q-30,-26 10,-19 T72,-21 M-72,-9 Q-20,-14 30,-8 T70,-10"/>' +
    '<ellipse cx="-40" cy="-14" rx="7" ry="4" fill="none" class="s-wood2" stroke-width="2.4"/>' +
    '<path class="f-red" d="M-84,0 L84,0 L84,25 Q84,32 77,32 L-77,32 Q-84,32 -84,25 Z"/>' +
    '<path class="f-red2" d="M-84,20 L84,20 L84,25 Q84,32 77,32 L-77,32 Q-84,32 -84,25 Z"/>' +
    '<path stroke="#FFFBEF" stroke-width="3" stroke-linecap="round" opacity="0.3" d="M-70,7 L-20,7"/>' +
    '<rect x="-84" y="-32" width="168" height="64" rx="7" fill="none" class="s-ink" stroke-width="3"/>',
    "block");
}

/* ------------------------------------------------------------------ dung beetle: legs that find their footing */
const BALL = { x: 46, y: 2, r: 27 };
function makeBeetle(parent, ballParent, opt) {
  opt = opt || {};
  const L1 = 15, L2 = 18;
  const E = eyeRig(-37, -3, 6.6, { pr: 3.1, lid: "btl2", sw: 1.4 });
  const leg = (far) =>
    '<g class="leg"><path class="s-' + (far ? "btl2" : "btl") + '" stroke-width="6.2" stroke-linecap="round" d="M0,0 L' + L1 + ',0"/>' +
    '<g class="tib"><path class="s-' + (far ? "btl2" : "btl") + '" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M0,0 L' + L2 + ",0 l4,2.5 M" + (L2 * 0.45) + ",0 l2,-4 M" + (L2 * 0.75) + ',0 l2,-4"/></g></g>';
  const g = PP(parent,
    '<ellipse class="shd f-shadow" cx="4" cy="27" rx="40" ry="6" opacity="0.2"/>' +
    '<g class="bb">' + leg(1) + leg(1) + leg(1) +
    '<path class="wing f-btlwing" opacity="0" d="M-6,-6 Q22,-50 64,-36 Q48,-10 32,2 Z"/>' +
    '<ellipse cx="9" cy="3" rx="26" ry="15" class="f-btl2"/>' +
    '<ellipse cx="-21" cy="0" rx="15.5" ry="16.5" class="f-btl"/><path stroke="#F7F0DE" stroke-width="2.6" stroke-linecap="round" fill="none" opacity="0.4" d="M-30,-9 Q-22,-15 -13,-11"/>' +
    '<g class="hd"><path class="f-btl2" d="M-30,-10 L-44,-8 Q-55,-3 -58,6 L-52,10 L-31,10 Z"/><path class="s-btl" stroke-width="2.2" stroke-linecap="round" fill="none" d="M-52,2 l-5,3 M-49,-2 l-6,1"/>' +
    '<g class="ant"><path class="s-btl" stroke-width="2.4" stroke-linecap="round" fill="none" d="M-45,-7 L-52,-15"/><path class="f-btlwing" d="M-52,-15 l-7,-5 l1,4 l-5,-1 l3,4 l-4,2 l8,1 Z"/></g>' +
    E.svg + '<path class="brow s-ink" stroke-width="3" stroke-linecap="round" d="M-45,-11.5 L-30,-11.5" opacity="0"/>' +
    '<path class="mth s-ink" stroke-width="1.8" stroke-linecap="round" fill="none" d="M-52,7 Q-46,9 -40,7"/></g>' +
    '<g class="ely"><ellipse cx="9" cy="0" rx="28.5" ry="19" class="f-btl"/><path stroke="#F7F0DE" stroke-width="3.2" stroke-linecap="round" fill="none" opacity="0.5" d="M-4,-11 Q12,-17 29,-8"/><path class="s-btl2" stroke-width="2" fill="none" opacity="0.9" d="M-14,-4 Q10,-9 34,-3 M-16,4 Q10,0 36,5"/></g>' +
    leg(0) + leg(0) + leg(0) + brad(-9, 2, 3) + "</g>", "beetle");
  const bb = q(g, ".bb"), legs = qa(g, ".leg"), tibs = qa(g, ".tib"), ely = q(g, ".ely"), wing = q(g, ".wing"), hd = q(g, ".hd"), ant = q(g, ".ant"),
    brow = q(g, ".brow"), mth = q(g, ".mth"), shd = q(g, ".shd"), eb = eyeBind(g, E, 0);
  const ball = PP(ballParent || parent,
    '<ellipse cx="0" cy="26" rx="26" ry="5" class="f-shadow" opacity="0.2"/><g class="br"><circle r="27" class="f-dung"/>' +
    '<path class="f-dung2" d="M-14,-16 q10,-8 20,2 q-6,12 -20,-2 Z M6,10 q10,-6 16,4 q-10,8 -16,-4 Z M-22,6 q6,-4 10,2 q-6,6 -10,-2 Z M12,-12 q5,-3 8,2 q-5,4 -8,-2 Z"/>' +
    '<path stroke="#D2B277" stroke-width="2.4" stroke-linecap="round" fill="none" d="M-6,-24 l8,5 M16,-10 l7,-6 M-18,16 l-6,5 M2,20 l9,3 M-24,-6 l6,-3"/></g>' +
    '<path fill="#FFFBEF" opacity="0.14" d="M-20,-14 Q-8,-27 10,-24 Q-6,-20 -14,-6 Z"/>', "ball");
  const ballR = q(ball, ".br");
  const AT = [[-17, 8], [3, 11], [24, 8], [-20, 10], [0, 13], [21, 10]];
  const seed = opt.seed || 1;
  const st = Object.assign({ x: 0, y: 0, r: 0, flip: 1, s: 0.56, sx: 1, sy: 1, vis: 1, tilt: -40, roll: 1, d: 0, kick: 0, wings: 0, noleg: 0, hd: 0, ant: 0, glint: 0, jump: 0,
    bx: 0, by: 0, br: 0, att: 1, bvis: 1, bs: 1 }, FACE0, { lid: 0.05 });
  const YG = 27;
  function draw(t) {
    OP(g, st.vis);
    place(g, st.x, st.y - st.jump, st.r, st.s * st.flip * st.sx, st.s * st.sy);
    OP(shd, 0.2 * (1 - sat(st.kick)) * sat(1 - st.jump / 30) * (Math.abs(st.r) < 30 ? 1 : 0));
    const lift = st.roll * 13, th = st.tilt * PI / 180, ct = cos(th), sn = sin(th);
    TR(bb, "translate(0 " + f1(-lift) + ") rotate(" + f1(st.tilt) + ")");
    const ph0 = st.d * 0.34;
    for (let i = 0; i < 6; i++) {
      const k = i % 3, far = i < 3, a = AT[i];
      if (st.kick > 0.5) {
        const w = t * 24 + i * 2.1;
        TR(legs[i], "translate(" + a[0] + " " + a[1] + ") rotate(" + f1(100 + sin(w) * 42 - k * 20) + ")");
        TR(tibs[i], "translate(" + L1 + " 0) rotate(" + f1(-50 + sin(w + 1) * 36) + ")");
      } else {
        const ph = ph0 + k * 2.1 + (far ? PI : 0);
        /* attachment in the puppet's own frame */
        const ax = a[0] * ct - a[1] * sn;
        /* standing or walking: a foot under each hip */
        let tx = ax + [-13, 1, 14][k] + 6 * cos(ph), ty = YG - 5 * Math.max(0, sin(ph));
        if (st.roll > 0.001) {
          let rx, ry;
          if (k === 0) { rx = (far ? -26 : -33) + 8 * cos(ph); ry = YG - 4.5 * Math.max(0, sin(ph)); }
          else {
            const onBall = k === 2 || far;
            if (onBall) { const an = ((k === 2 ? (far ? 252 : 224) : 186) + 9 * sin(ph)) * PI / 180; rx = BALL.x + (BALL.r + 1) * cos(an); ry = BALL.y + (BALL.r + 1) * sin(an); }
            else { rx = -8 + 7 * cos(ph); ry = YG - 4 * Math.max(0, sin(ph)); }
          }
          tx = lerp(tx, rx, st.roll); ty = lerp(ty, ry, st.roll);
        }
        /* into the body's frame */
        const dx = tx, dy = ty + lift, bx = dx * ct + dy * sn, by = -dx * sn + dy * ct;
        let best = null;
        for (const bd of [1, -1]) {
          const r = ik2(a[0], a[1], bx, by, L1, L2, bd), a1 = r[0] * PI / 180;
          const kx = a[0] + L1 * cos(a1), ky = a[1] + L1 * sin(a1), wy = kx * sn + ky * ct;
          if (!best || wy < best[2]) best = [r[0], r[1], wy];
        }
        TR(legs[i], "translate(" + a[0] + " " + a[1] + ") rotate(" + f1(best[0]) + ")");
        TR(tibs[i], "translate(" + L1 + " 0) rotate(" + f1(best[1]) + ")");
      }
      if (i === 3) OP(legs[i], 1 - st.noleg);
    }
    rot(ely, -58 * st.wings, -12, -8);
    OP(wing, st.wings * 0.9);
    rot(hd, st.hd, -24, 0);
    rot(ant, st.ant * 26 + noise(t * 3.1, seed) * 7, -45, -7);
    const bl = blink(t, seed + 3, 3.1);
    eyeSet(eb, st.px, st.py, Math.max(st.lid, bl), -st.lidA, st.lidL, st.pup, st.glint);
    OP(brow, st.browOn);
    TR(brow, "translate(0 " + f1(st.brow > 0 ? 1.6 * st.brow : st.brow) + ") rotate(" + f1(-st.brow * 22) + " -37 -11.5)");
    SA(mth, "d", "M-52,7 Q-46," + f1(7 + 3 * st.mouth) + " -40," + f1(7 - 2 * st.mouth));
    /* the ball: held by the hind legs while attached, free otherwise */
    let bx = st.bx, by = st.by, br = st.br;
    if (st.att > 0.5) {
      bx = st.x + st.flip * BALL.x * st.s; by = st.y + BALL.y * st.s;
      br = st.flip * st.d / (BALL.r * st.s) * 57.3 * 0.55;
    }
    OP(ball, st.bvis);
    place(ball, bx, by, 0, st.s * st.bs, st.s * st.bs);
    rot(ballR, br, 0, 0);
  }
  return { g, ball, st, draw, YG };
}

/* ------------------------------------------------------------------ toad */
function makeToad(parent, opt) {
  opt = opt || {};
  const E = eyeRig(48, -50, 12, { iris: "#E3A93C", ir: 9, pr: 4.6, slit: 1, lid: "toad", sw: 2.2 });
  const hind = (far) =>
    '<g class="hind"><g class="thigh"><path class="s-' + (far ? "toad2" : "toad") + '" stroke-width="20" stroke-linecap="round" d="M-34,-14 L-8,-8"/>' +
    '<g class="shank"><path class="s-' + (far ? "toad2" : "toad") + '" stroke-width="13" stroke-linecap="round" d="M-8,-8 L-44,0"/>' +
    '<g class="foot"><path class="s-' + (far ? "toad2" : "toad") + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M-44,0 L-20,3 M-26,3 L-14,-3 M-24,3 L-12,2 M-24,3 L-14,7"/></g></g></g></g>';
  const fore = (far) =>
    '<g class="fore"><path class="s-' + (far ? "toad2" : "toad") + '" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M32,-16 L28,-4 L44,2"/>' +
    '<path class="s-' + (far ? "toad2" : "toad") + '" stroke-width="4.6" stroke-linecap="round" fill="none" d="M44,2 L55,-3 M44,2 L57,2 M44,2 L54,7"/></g>';
  const g = PP(parent,
    '<ellipse class="shd f-shadow" cx="0" cy="4" rx="62" ry="9" opacity="0.2"/>' +
    '<g class="body">' +
    '<g transform="translate(10 -3)">' + hind(1) + "</g>" + '<g transform="translate(8 -2)">' + fore(1) + "</g>" +
    '<g class="thr"><ellipse cx="54" cy="-9" rx="17" ry="11" class="f-toadb"/></g>' +
    '<path class="f-toad" d="M-58,-2 C-66,-32 -40,-55 -6,-54 C8,-54 18,-52 26,-52 C30,-62 42,-66 52,-60 C62,-54 62,-44 60,-40 C72,-34 78,-22 74,-12 C70,-2 44,0 22,0 L-50,0 Z"/>' +
    '<path class="f-toadb" d="M-46,0 C-26,-12 30,-11 68,-9 C58,0 36,0 22,0 Z"/>' +
    '<path stroke="#FFFBEF" stroke-width="3.4" stroke-linecap="round" fill="none" opacity="0.22" d="M-40,-42 Q-16,-52 14,-49"/>' +
    '<path class="f-toad2" d="M8,-47 q14,-7 24,3 q-13,9 -24,-3 Z"/>' +
    '<circle cx="-34" cy="-30" r="5" class="f-toad2"/><circle cx="-14" cy="-40" r="6" class="f-toad2"/><circle cx="-22" cy="-20" r="3.4" class="f-toad2"/><circle cx="4" cy="-30" r="4.2" class="f-toad2"/><circle cx="-44" cy="-14" r="3.6" class="f-toad2"/><circle cx="-2" cy="-16" r="3" class="f-toad2"/><circle cx="20" cy="-22" r="2.6" class="f-toad2"/>' +
    '<path class="mi f-ink" d=""/><path class="mth s-toad2" stroke-width="3.2" stroke-linecap="round" fill="none" d="M73,-17 Q56,-8 38,-13"/>' +
    '<circle cx="70" cy="-24" r="1.6" class="f-toad2"/>' +
    '<g class="eyeg">' + E.svg + '<path class="brow s-toad2" stroke-width="5" stroke-linecap="round" d="M34,-64 L62,-64" opacity="0"/></g>' +
    hind(0) + fore(0) + brad(-34, -14, 3.6) + brad(32, -16, 3.2) +
    "</g>", "toad");
  const body = q(g, ".body"), thighs = qa(g, ".thigh"), shanks = qa(g, ".shank"), feet = qa(g, ".foot"), fores = qa(g, ".fore"), shd = q(g, ".shd"), thr = q(g, ".thr"),
    mth = q(g, ".mth"), mi = q(g, ".mi"), brow = q(g, ".brow"), eyeg = q(g, ".eyeg"), eb = eyeBind(g, E, 0);
  const seed = opt.seed || 1;
  const L1T = Math.hypot(26, 6), L2T = Math.hypot(36, 8), A0T = Math.atan2(6, 26) * 57.2958, A1T = Math.atan2(8, -36) * 57.2958;
  const st = Object.assign({ x: 0, y: 0, flip: -1, s: 0.5, ph: 0, walk: 0, sx: 1, sy: 1, h: 0, r: 0, vis: 1, call: 0, sink: 0 }, FACE0);
  function draw(t) {
    OP(g, st.vis);
    if (st.vis < 0.01) return;
    place(g, st.x, st.y, 0, st.s * st.flip, st.s);
    const w = st.walk, a = sin(st.ph), b = sin(st.ph + PI);
    const br = 1 + 0.018 * sin(t * 2.6 + seed);
    TR(body, "translate(0 " + f1(-st.h - Math.abs(cos(st.ph)) * 3.5 * w) + ") rotate(" + f1(st.r + a * 4 * w) + ") scale(" + f2(st.sx) + " " + f2(st.sy * br) + ")");
    OP(shd, 0.2 * clamp(1 - st.h / 80, 0.3, 1));
    /* hind legs: the ankle is put where the foot stands, hip and knee follow */
    const bob = -st.h - Math.abs(cos(st.ph)) * 3.5 * w;
    [st.ph + PI, st.ph].forEach((ph, i) => {
      const tx = -44 - 11 * cos(ph) * w, ty = -6 * Math.max(0, sin(ph)) * w - bob * 0.6;
      const r = ik2(-34, -14, tx, ty, L1T, L2T, 1);
      const a1 = r[0] - A0T, a2 = r[1] - (A1T - A0T);
      rot(thighs[i], a1, -34, -14);
      rot(shanks[i], a2, -8, -8);
      rot(feet[i], -(a1 + a2) - Math.max(0, sin(ph)) * 18 * w, -44, 0);
    });
    [a, b].forEach((v, i) => rot(fores[i], v * 22 * w, 32, -16));
    /* the throat goes in and out all the time; much more when it calls */
    const th = 1 + (0.1 + 0.55 * st.call) * (0.5 + 0.5 * sin(t * (st.call > 0.3 ? 15 : 7) + seed));
    TR(thr, "translate(54 -9) scale(" + f2(th) + ") translate(-54 9)");
    const m = st.mouth, cy = -9 + 5 * m, ky = -13 - 5 * m;
    SA(mth, "d", "M73,-17 Q56," + f1(cy) + " 38," + f1(ky));
    SA(mi, "d", st.open > 0.03 ? "M73,-17 Q56," + f1(cy) + " 38," + f1(ky) + " Q54," + f1(cy + 20 * st.open) + " 73,-17 Z" : "");
    const bl = blink(t, seed + 5, 3.3);
    const lid = Math.max(st.lid, bl);
    /* a toad pulls its eye in when it blinks */
    TR(eyeg, "translate(0 " + f1(3.5 * bl + 9 * st.sink) + ")");
    eyeSet(eb, st.px + noise(t * 0.9, seed) * 0.8, st.py, lid, st.lidA, st.lidL, st.pup);
    OP(brow, st.browOn);
    TR(brow, "translate(0 " + f1(st.brow > 0 ? 3 * st.brow : 2 * st.brow) + ") rotate(" + f1(st.brow * 17) + " 48 -64)");
  }
  return { g, st, draw };
}

/* a toad seen from above, pressed flat on the road */
function makeFlatToad(parent) {
  return G(
    '<path class="f-road" opacity="0.5" d="M-90,-10 L90,-10 L90,-1 L-90,-1 Z M-90,8 L90,8 L90,17 L-90,17 Z"/>' +
    '<path class="f-toad" d="M-30,-4 C-40,-22 -66,-22 -62,-10 C-76,-8 -74,6 -60,6 C-66,18 -40,22 -30,10 C-10,18 16,18 30,10 C40,22 68,18 60,6 C74,6 78,-8 62,-10 C66,-22 40,-22 32,-4 C16,-12 -12,-12 -30,-4 Z"/>' +
    '<path class="s-toad" stroke-width="4" stroke-linecap="round" fill="none" d="M-64,-12 l-10,-4 M-64,-10 l-12,2 M-62,8 l-12,0 M-62,10 l-9,6 M62,-12 l10,-5 M64,-9 l12,1 M62,8 l12,0 M61,10 l9,6"/>' +
    '<path class="f-toad2" d="M-14,-2 q6,-5 12,0 q-6,5 -12,0 Z M6,5 q5,-4 10,0 q-5,4 -10,0 Z M-4,8 q4,-3 8,0 q-4,3 -8,0 Z"/>' +
    '<path class="s-ink" stroke-width="3" stroke-linecap="round" fill="none" d="M34,-6 l8,6 M42,-6 l-8,6 M34,5 l8,6 M42,5 l-8,6"/>' +
    '<path class="f-road" opacity="0.35" d="M-90,-10 L90,-10 L90,-1 L-90,-1 Z M-90,8 L90,8 L90,17 L-90,17 Z"/>',
    parent, "flat");
}

/* a toad in the pond: head above the water */
function makePondToad(parent, second, opt) {
  opt = opt || {};
  const E = eyeRig(6, -15, 6.8, { iris: "#E3A93C", ir: 5.2, pr: 2.7, slit: 1, lid: second ? "toad2" : "toad", sw: 1.6 });
  const g = G(
    '<ellipse class="rp" cx="0" cy="2" rx="' + (second ? 22 : 26) + '" ry="5" fill="none" stroke="#E4F3EA" stroke-width="2" opacity="0.7"/>' +
    '<g class="bob"><g class="thr"><ellipse cx="18" cy="-3" rx="8" ry="6" class="f-toadb"/></g>' +
    '<path class="f-toad' + (second ? "2" : "") + '" d="M-22,2 Q-20,-12 -6,-13 Q-4,-22 6,-22 Q14,-22 15,-14 Q24,-12 24,2 Z"/>' +
    '<path class="mth s-ink" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.7" d="M23,-6 Q17,-3 11,-5"/>' + E.svg + "</g>" +
    '<ellipse cx="0" cy="3" rx="' + (second ? 20 : 24) + '" ry="3.4" class="f-water" opacity="0.85"/>',
    parent, "ptoad");
  const bob = q(g, ".bob"), thr = q(g, ".thr"), mth = q(g, ".mth"), rp = q(g, ".rp"), eb = eyeBind(g, E, 0);
  const seed = opt.seed || 7;
  const st = Object.assign({ x: 0, y: 0, flip: 1, vis: 1, call: 0, dip: 0 }, FACE0);
  function draw(t) {
    OP(g, st.vis);
    if (st.vis < 0.01) return;
    place(g, st.x, st.y, 0, st.flip, 1);
    TR(bob, "translate(0 " + f1(sin(t * 2 + seed) * 0.9 + st.dip) + ")");
    const th = 1 + (0.12 + 0.8 * st.call) * (0.5 + 0.5 * sin(t * (st.call > 0.3 ? 15 : 6) + seed));
    TR(thr, "translate(18 -3) scale(" + f2(th) + ") translate(-18 3)");
    SA(mth, "d", "M23,-6 Q17," + f1(-3 + 2.5 * st.mouth) + " 11," + f1(-5 - 2.5 * st.mouth));
    const k = 1 + 0.12 * sin(t * 1.6 + seed);
    TR(rp, "translate(0 2) scale(" + f2(k) + ") translate(0 -2)");
    eyeSet(eb, st.px, st.py, Math.max(st.lid, blink(t, seed, 3.6)), st.lidA, st.lidL, st.pup);
  }
  return { g, st, draw };
}

/* ------------------------------------------------------------------ car (drives to the left) */
function makeCar(parent) {
  const wheel = (x) => '<g class="wh" data-x="' + x + '"><circle r="21" class="f-ink"/><circle r="10" class="f-cream"/><path class="s-ink" stroke-width="3" d="M-9,0 L9,0 M0,-9 L0,9"/><circle r="3" class="f-ink"/></g>';
  const g = PP(parent,
    '<ellipse cx="0" cy="2" rx="124" ry="9" class="f-shadow" opacity="0.28"/>' +
    '<g class="cb"><path class="f-car" d="M-118,-12 L-116,-44 Q-114,-54 -98,-56 L-62,-60 L-36,-92 Q-30,-98 -20,-98 L52,-98 Q62,-98 68,-90 L88,-58 L108,-54 Q118,-52 118,-40 L118,-12 Z"/>' +
    '<path class="f-car2" d="M-118,-26 L118,-26 L118,-12 L-118,-12 Z"/>' +
    '<path stroke="#FFFBEF" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.35" d="M-100,-50 L-66,-54 M-30,-93 L40,-93"/>' +
    '<path class="f-glass" d="M-52,-62 L-30,-88 L4,-88 L4,-62 Z M12,-88 L48,-88 Q54,-88 58,-82 L72,-62 L12,-62 Z"/>' +
    '<path fill="#FFFBEF" opacity="0.4" d="M-44,-64 L-28,-84 L-18,-84 L-34,-64 Z"/>' +
    '<path class="s-car2" stroke-width="2.6" fill="none" d="M8,-60 L8,-16 M-58,-58 L-58,-18"/><rect x="18" y="-52" width="14" height="4" rx="2" class="f-car2"/>' +
    '<rect x="-122" y="-46" width="11" height="13" rx="3" fill="#FFF3B8" stroke="#22202E" stroke-width="1.6"/><rect x="112" y="-46" width="8" height="12" rx="3" class="f-red"/>' +
    '<rect x="-124" y="-24" width="10" height="8" rx="2" class="f-ink"/></g>' +
    wheel(-70) + wheel(70) +
    '<path class="s-cream" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85" d="M134,-80 L250,-80 M150,-52 L310,-52 M134,-24 L230,-24"/>',
    "car");
  const cb = q(g, ".cb"), wh = qa(g, ".wh");
  return { g, draw(t, x) { TR(cb, "translate(0 " + f1(sin(t * 31) * 1.6) + ") rotate(" + f1(sin(t * 19) * 0.5) + ")"); wh.forEach((w) => TR(w, "translate(" + w.dataset.x + " -12) rotate(" + f1(-x * 2.7) + ")")); } };
}

/* ------------------------------------------------------------------ monkeys */
function makeMonkey(parent, armParent, o) {
  const B = o.baby;
  const bh = B ? 78 : 116, bw = B ? 40 : 52, hr = B ? 40 : 43, hy = -(bh + hr - 12), sh = -(bh - 20), sx = bw - 14, al = B ? 30 : 46, aw = B ? 15 : 19;
  const fur = o.fur || "fur", fur2 = o.fur2 || "fur2";
  const er = hr * (B ? 0.26 : 0.2), ex = hr * 0.37, ey = hy - 3;
  const EL = eyeRig(-ex, ey, er, { iris: "#7A4A2A", ir: er * 0.78, pr: er * 0.5, lid: "face", sw: B ? 2 : 1.8 });
  const ER = eyeRig(ex, ey, er, { iris: "#7A4A2A", ir: er * 0.78, pr: er * 0.5, lid: "face", sw: B ? 2 : 1.8 });
  const arm = (side) =>
    '<g class="arm a' + side + '"><path class="s-' + fur2 + '" stroke-width="' + aw + '" stroke-linecap="round" d="M0,0 L0,' + al + '"/>' +
    '<g class="fa"><path class="s-' + fur2 + '" stroke-width="' + (aw - 3) + '" stroke-linecap="round" d="M0,' + al + " L0," + (al * 1.9) + '"/><circle cx="0" cy="' + (al * 1.95) + '" r="' + (aw * 0.55) + '" class="f-face"/>' +
    '<path class="s-face" stroke-width="' + f2(aw * 0.24) + '" stroke-linecap="round" d="M' + f2(-aw * 0.3) + "," + f2(al * 1.95 + aw * 0.4) + " l" + f2(-aw * 0.12) + "," + f2(aw * 0.36) + " M0," + f2(al * 1.95 + aw * 0.5) + " l0," + f2(aw * 0.38) + " M" + f2(aw * 0.3) + "," + f2(al * 1.95 + aw * 0.4) + " l" + f2(aw * 0.12) + "," + f2(aw * 0.36) + '"/>' +
    brad(0, al, 2.6) + "</g>" + brad(0, 0, 3.2) + "</g>";
  const ear = (s) => '<g class="ear" data-s="' + s + '"><circle cx="' + s * (hr + 1) + '" cy="' + (hy - 4) + '" r="' + hr * 0.34 + '" class="f-' + fur + '"/><circle cx="' + s * (hr + 1) + '" cy="' + (hy - 4) + '" r="' + hr * 0.19 + '" class="f-ear"/></g>';
  const by = ey - er - hr * 0.13;
  const g = PP(parent,
    '<g class="lean">' +
    '<g class="tail"><path class="s-' + fur2 + '" stroke-width="' + (B ? 8 : 12) + '" stroke-linecap="round" fill="none" d="M' + (bw * 0.5) + ",-10 Q" + (bw + 22) + ",30 " + (bw + 4) + "," + (B ? 56 : 80) + '"/>' +
    '<g class="tail2"><path class="s-' + fur2 + '" stroke-width="' + (B ? 7 : 11) + '" stroke-linecap="round" fill="none" d="M' + (bw + 4) + "," + (B ? 56 : 80) + " Q" + (bw - 8) + "," + (B ? 78 : 110) + " " + (bw + 14) + "," + (B ? 86 : 122) + '"/></g></g>' +
    '<g class="tor"><path class="f-' + fur + '" d="M' + -bw + ",0 C" + -(bw + 10) + "," + -bh * 0.45 + " " + -(bw - 8) + "," + -(bh - 4) + " 0," + -bh + " C" + (bw - 8) + "," + -(bh - 4) + " " + (bw + 10) + "," + -bh * 0.45 + " " + bw + ',0 Z"/>' +
    '<ellipse cx="0" cy="' + -bh * 0.42 + '" rx="' + bw * 0.58 + '" ry="' + bh * 0.36 + '" class="f-face" opacity="0.75"/>' +
    '<path class="s-' + fur2 + '" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.7" d="M' + -bw * 0.2 + "," + -bh * 0.7 + " l4,6 M" + bw * 0.1 + "," + -bh * 0.72 + " l-3,6 M0," + -bh * 0.2 + ' l0,5"/></g>' +
    '<ellipse cx="' + -(bw - 10) + '" cy="-11" rx="' + bw * 0.5 + '" ry="' + bw * 0.34 + '" class="f-' + fur2 + '"/><ellipse cx="' + (bw - 10) + '" cy="-11" rx="' + bw * 0.5 + '" ry="' + bw * 0.34 + '" class="f-' + fur2 + '"/>' +
    '<ellipse cx="' + -(bw + 6) + '" cy="1" rx="' + bw * 0.26 + '" ry="' + bw * 0.16 + '" class="f-face"/><ellipse cx="' + (bw + 6) + '" cy="1" rx="' + bw * 0.26 + '" ry="' + bw * 0.16 + '" class="f-face"/>' +
    '<g class="head">' + ear(-1) + ear(1) +
    '<circle cx="0" cy="' + hy + '" r="' + hr + '" class="f-' + fur + '"/>' +
    '<path class="f-' + fur2 + '" d="M-9,' + (hy - hr + 2) + " q-2,-13 3,-14 q1,6 5,8 q2,-9 8,-9 q-1,9 3,15 q-10,6 -19,0 Z" + '"/>' +
    '<circle cx="' + -ex + '" cy="' + ey + '" r="' + hr * 0.42 + '" class="f-face"/><circle cx="' + ex + '" cy="' + ey + '" r="' + hr * 0.42 + '" class="f-face"/>' +
    '<ellipse cx="0" cy="' + (hy + hr * 0.42) + '" rx="' + hr * 0.6 + '" ry="' + hr * 0.46 + '" class="f-face"/>' +
    '<circle cx="' + -hr * 0.52 + '" cy="' + (hy + hr * 0.36) + '" r="' + hr * 0.13 + '" class="f-ear" opacity="0.5"/><circle cx="' + hr * 0.52 + '" cy="' + (hy + hr * 0.36) + '" r="' + hr * 0.13 + '" class="f-ear" opacity="0.5"/>' +
    EL.svg + ER.svg +
    '<path class="bwL s-' + fur2 + '" stroke-width="' + f2(hr * 0.085) + '" stroke-linecap="round" d="M' + f2(-ex - er * 0.9) + "," + f2(by) + " L" + f2(-ex + er * 0.9) + "," + f2(by) + '" opacity="0"/>' +
    '<path class="bwR s-' + fur2 + '" stroke-width="' + f2(hr * 0.085) + '" stroke-linecap="round" d="M' + f2(ex - er * 0.9) + "," + f2(by) + " L" + f2(ex + er * 0.9) + "," + f2(by) + '" opacity="0"/>' +
    '<path class="s-ink" stroke-width="2.6" stroke-linecap="round" fill="none" d="M-3,' + (hy + hr * 0.3) + " l-1,3 M3," + (hy + hr * 0.3) + ' l1,3"/>' +
    '<ellipse class="mo f-ink" opacity="0" cx="0" cy="' + (hy + hr * 0.62) + '" rx="' + hr * 0.17 + '" ry="' + hr * 0.2 + '"/>' +
    '<path class="mth s-ink" stroke-width="3" stroke-linecap="round" fill="none" d=""/>' +
    '<g class="tears" opacity="0"><path class="tr" fill="#8FD3EE" stroke="#22202E" stroke-width="1.2" d="M0,-5 Q4,1 0,4 Q-4,1 0,-5 Z"/><path class="tr" fill="#8FD3EE" stroke="#22202E" stroke-width="1.2" d="M0,-5 Q4,1 0,4 Q-4,1 0,-5 Z"/></g>' +
    "</g></g>", "monkey");
  const ag = PP(armParent || parent, '<g class="lean">' + arm("L") + arm("R") + "</g>", "marms");
  const lean = q(g, ".lean"), lean2 = q(ag, ".lean"), head = q(g, ".head"), aL = q(ag, ".aL"), aR = q(ag, ".aR"), faL = q(aL, ".fa"), faR = q(aR, ".fa"),
    tor = q(g, ".tor"), tail = q(g, ".tail"), tail2 = q(g, ".tail2"), ears = qa(g, ".ear"), mth = q(g, ".mth"), mo = q(g, ".mo"), bwL = q(g, ".bwL"), bwR = q(g, ".bwR"),
    tears = q(g, ".tears"), trs = qa(g, ".tr"), ebL = eyeBind(g, EL, 0), ebR = eyeBind(g, ER, 1);
  const seed = o.ph || 1, my = hy + hr * 0.56, mw = hr * 0.27;
  const st = Object.assign({ x: 0, y: 0, s: o.s || 0.5, flip: 1, r: 0, h: 0, headR: 0, Lu: 8, Lf: -6, Ru: -8, Rf: 6, vis: 1, sx: 1, sy: 1, tear: 0, tailA: 0, shiver: 0 }, FACE0, { mouth: 0.6 });
  function draw(t) {
    OP(g, st.vis); OP(ag, st.vis);
    if (st.vis < 0.01) return;
    const shx = st.shiver * sin(t * 47) * 1.2;
    place(g, st.x + shx, st.y - st.h, 0, st.s * st.flip * st.sx, st.s * st.sy);
    place(ag, st.x + shx, st.y - st.h, 0, st.s * st.flip * st.sx, st.s * st.sy);
    rot(lean, st.r, 0, 0); rot(lean2, st.r, 0, 0);
    const br = sin(t * 2.3 + seed);
    TR(tor, "scale(" + f2(1 + 0.012 * br) + " " + f2(1 + 0.02 * br) + ")");
    rot(head, st.headR + noise(t * 0.8, seed) * 1.6, 0, -bh + 6);
    TR(aL, "translate(" + -sx + " " + sh + ") rotate(" + f1(st.Lu) + ")");
    TR(aR, "translate(" + sx + " " + sh + ") rotate(" + f1(st.Ru) + ")");
    rot(faL, st.Lf, 0, al); rot(faR, st.Rf, 0, al);
    const bl = blink(t, seed + 2, 2.9), lid = Math.max(st.lid, bl), nx = noise(t * 1.1, seed + 4) * 0.7;
    eyeSet(ebL, st.px + nx, st.py, lid, st.lidA, st.lidL, st.pup);
    eyeSet(ebR, st.px + nx, st.py, lid, -st.lidA, st.lidL, st.pup);
    OP(bwL, st.browOn); OP(bwR, st.browOn);
    const bo = st.brow > 0 ? hr * 0.07 * st.brow : hr * 0.05 * st.brow;
    TR(bwL, "translate(0 " + f1(bo) + ") rotate(" + f1(st.brow * 20) + " " + f1(-ex) + " " + f1(by) + ")");
    TR(bwR, "translate(0 " + f1(bo) + ") rotate(" + f1(-st.brow * 20) + " " + f1(ex) + " " + f1(by) + ")");
    const wob = st.open > 0.3 && st.mouth < -0.5 ? sin(t * 38) * hr * 0.012 : 0;
    SA(mth, "d", "M" + f1(-mw) + "," + f1(my - st.mouth * hr * 0.05) + " Q0," + f1(my + st.mouth * hr * 0.24 + wob) + " " + f1(mw) + "," + f1(my - st.mouth * hr * 0.05));
    const op = sat((st.open - 0.1) / 0.9);
    OP(mth, op > 0.001 ? 0 : 1);
    OP(mo, op > 0.001 ? 1 : 0);
    TR(mo, "translate(0 " + f1(hy + hr * 0.62) + ") scale(" + f2(0.55 + 0.75 * op) + " " + f2(0.25 + 1.0 * op + wob * 0.2) + ") translate(0 " + f1(-(hy + hr * 0.62)) + ")");
    ears.forEach((e, i) => rot(e, +e.dataset.s * (noise(t * 2.2, seed + i * 3) * 4 + st.browOn * st.brow * -4), +e.dataset.s * (hr - 6), hy));
    OP(tears, st.tear);
    if (st.tear > 0.01) trs.forEach((e, i) => { const u = ((t * 1.5 + i * 0.5) % 1 + 1) % 1; TR(e, "translate(" + f1((i ? 1 : -1) * (ex + er * 0.2)) + " " + f1(ey + er + 3 + u * hr * 0.6) + ") scale(" + f2(B ? 1.5 : 1.2) + ")"); OP(e, u < 0.85 ? 1 : (1 - u) / 0.15); });
    rot(tail, sin(t * 1.7 + seed) * 7 + st.tailA, bw * 0.5, -10);
    rot(tail2, sin(t * 1.7 + seed - 0.9) * 12 + st.tailA * 1.4, bw + 4, B ? 56 : 80);
  }
  return { g, ag, st, draw, dims: { bh, bw, hr, hy, sh, al } };
}

/* the cloth dummy: a slanted cylinder in terry cloth with a block face. It never moves on its own. */
function makeDummy(parent) {
  let loops = "";
  const R = rng(5);
  for (let i = 0; i < 46; i++) {
    const x = -27 + R() * 54, y = -128 + R() * 120;
    loops += '<path class="s-cloth2" stroke-width="2.4" stroke-linecap="round" fill="none" d="M' + f1(x) + "," + f1(y) + ' q4,-6 8,0"/>';
  }
  return PP(parent,
    '<path class="f-wood2" d="M-48,0 L48,0 L40,-12 L-40,-12 Z"/>' +
    '<g transform="rotate(9)">' +
    '<rect x="-33" y="-136" width="66" height="132" rx="26" class="f-cloth"/>' + loops +
    '<rect x="-33" y="-136" width="66" height="132" rx="26" fill="none" class="s-cloth2" stroke-width="3"/>' +
    '<rect x="-29" y="-186" width="58" height="54" rx="12" class="f-wood"/><rect x="-29" y="-186" width="58" height="54" rx="12" fill="none" class="s-ink" stroke-width="2.6"/>' +
    '<circle cx="-13" cy="-164" r="9.5" fill="#FFFBEF" stroke="#22202E" stroke-width="2.4"/><circle cx="-13" cy="-164" r="4" fill="#22202E"/>' +
    '<circle cx="13" cy="-164" r="9.5" fill="#FFFBEF" stroke="#22202E" stroke-width="2.4"/><circle cx="13" cy="-164" r="4" fill="#22202E"/>' +
    '<path class="s-ink" stroke-width="3.2" stroke-linecap="round" d="M-12,-143 L12,-143"/>' +
    "</g>", "dummy");
}

/* the lab cage: back wall, tray, bars. Local: x 0..236, y 0..226 */
function makeCage(back, front) {
  let tiles = "";
  for (let x = 40; x < 236; x += 40) tiles += '<path class="s-lab2" stroke-width="2.5" d="M' + x + ",0 L" + x + ',214"/>';
  for (let y = 44; y < 214; y += 44) tiles += '<path class="s-lab2" stroke-width="2.5" d="M0,' + y + " L236," + y + '"/>';
  const b = G('<rect x="0" y="0" width="236" height="214" class="f-lab"/>' + tiles + '<rect x="-4" y="206" width="244" height="20" rx="4" class="f-cage"/><rect x="-4" y="206" width="244" height="7" rx="3" class="f-lab2"/>', back, "cageb");
  let bars = "";
  for (let x = 26; x < 236; x += 48) bars += '<path class="s-cage" stroke-width="4" stroke-linecap="round" d="M' + x + ",2 L" + x + ',208"/><path stroke="#FFFBEF" stroke-width="1.2" opacity="0.35" d="M' + (x - 1) + ",6 L" + (x - 1) + ',204"/>';
  const f = PP(front,
    '<path class="s-cage" stroke-width="5" fill="none" d="M60,-2 L84,-86 M176,-2 L152,-86"/><circle cx="118" cy="-92" r="13" fill="none" class="s-cage" stroke-width="6"/><path class="s-cage" stroke-width="5" d="M84,-86 L152,-86"/>' +
    bars + '<rect x="-4" y="-6" width="244" height="14" rx="5" class="f-cage"/><rect x="-4" y="-6" width="9" height="230" rx="4" class="f-cage"/><rect x="231" y="-6" width="9" height="230" rx="4" class="f-cage"/>', "cagef");
  return { b, f };
}

/* ------------------------------------------------------------------ small effects */
function makePow(parent) {
  return G('<path fill="#FFFBEF" stroke="#22202E" stroke-width="3" stroke-linejoin="round" d="M0,-40 L9,-14 L32,-28 L18,-5 L44,4 L17,11 L26,36 L4,19 L-10,42 L-12,15 L-40,22 L-20,2 L-40,-16 L-14,-13 Z"/>', parent, "pow");
}
function makeHeart(parent) {
  return G('<path class="f-red" stroke="#22202E" stroke-width="2.5" d="M0,10 C-22,-6 -14,-24 0,-12 C14,-24 22,-6 0,10 Z"/>', parent, "heart");
}
function makeStarlet(parent) {
  return G('<path fill="#F6DD8C" stroke="#22202E" stroke-width="2" stroke-linejoin="round" d="M0,-10 L3,-3 L10,-3 L4.5,1.5 L7,9 L0,4.5 L-7,9 L-4.5,1.5 L-10,-3 L-3,-3 Z"/>', parent, "starlet");
}
/* paper marks that say what a creature has just noticed */
function makeMark(parent, kind) {
  const d = kind === "!" ? '<path fill="#FFFBEF" stroke="#22202E" stroke-width="2.6" stroke-linejoin="round" d="M-5,-30 L5,-30 L3,-8 L-3,-8 Z"/><circle cy="0" r="4.4" fill="#FFFBEF" stroke="#22202E" stroke-width="2.6"/>'
    : kind === "?" ? '<path fill="none" stroke="#22202E" stroke-width="8.5" stroke-linecap="round" d="M-8,-24 Q-8,-33 1,-33 Q10,-33 10,-25 Q10,-19 1,-15 L1,-10"/><path fill="none" stroke="#FFFBEF" stroke-width="4" stroke-linecap="round" d="M-8,-24 Q-8,-33 1,-33 Q10,-33 10,-25 Q10,-19 1,-15 L1,-10"/><circle cy="0" r="4.4" fill="#FFFBEF" stroke="#22202E" stroke-width="2.6"/>'
      : kind === "vein" ? '<path fill="none" stroke="#22202E" stroke-width="7" stroke-linecap="round" d="M-9,-3 Q-3,-3 -3,-9 M3,-9 Q3,-3 9,-3 M9,3 Q3,3 3,9 M-3,9 Q-3,3 -9,3"/><path fill="none" stroke="#FF3A2B" stroke-width="3.4" stroke-linecap="round" d="M-9,-3 Q-3,-3 -3,-9 M3,-9 Q3,-3 9,-3 M9,3 Q3,3 3,9 M-3,9 Q-3,3 -9,3"/>'
        : '<path fill="#8FD3EE" stroke="#22202E" stroke-width="2" d="M0,-9 Q7,2 0,7 Q-7,2 0,-9 Z"/>';
  return G(d, parent, "mark");
}
