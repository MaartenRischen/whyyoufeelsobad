/* rigs_human.js - the humans. They are the same kind of thing as the animals: jointed paper
   puppets held together with brass pins, cut from wood-coloured card (the wooden mannequin).
   They are bare, with shorts and a hair shape to tell them apart, and they do not change when
   the world changes.
   Local units: the hip is (0,0), y up is negative, the figure faces +x (a three-quarter view:
   the far arm and leg are the +x ones, a shade darker and behind the body).
   Angles: 0 = the limb hangs straight down; a positive angle swings it backward (toward -x). */
/* Maarten, 16 Nov, after seeing v6: "the mannequin rule is kinda dumb, doesn't work. maybe find some
   clever way to make them human but not clearly a specific race".
   So: people cut from coloured paper. Each person is one colour that is no skin colour (o.skin),
   with hair and clothes in a deep tone of that same colour. Colour says who it is, and nothing
   else. Red and green are left out: those two belong to the feeling glow.
   The wooden variants (o.manq, or no o.skin) are still here but no longer used. */
const HUMAN_MANQ = false;
/* skin: [base, far limbs, nose and cheeks, hair and clothes] */
const HSKIN = {
  blu: ["#74A4F2", "#5C8ADB", "#4670BF", "#2C4A8C"],
  yel: ["#F6CC4E", "#E2B236", "#C9962A", "#946A18"],
  vio: ["#AD92E6", "#9478D0", "#7A5EB6", "#523A86"],
  pnk: ["#E88CCB", "#D274B5", "#B65C9A", "#7C3468"],      /* orange was tried first and read as a tanned redhead */
  tur: ["#62CDD6", "#48B4BF", "#3498A4", "#1F6A76"],
};
/* Maarten, 17 Nov, after v7: "different colors per human doesn't work. we just need a neutral ish
   color". So everyone is cut from the same paper (HUMAN_SKIN). The five colours above are kept
   for clothes only (o.wear): that and the hair shape tell people apart. */
Object.assign(HSKIN, {
  slate: ["#97A3B6", "#818DA2", "#6B778C", "#3D4557"],
  stone: ["#B5AB9B", "#9E9484", "#877D6E", "#4F473D"],
  grey: ["#A9A8A6", "#93928F", "#7D7C79", "#454442"],
});
const HUMAN_SKIN = "slate";
for (const k in HSKIN) HSKIN[k].forEach((c, i) => pal(k + (i ? i + 1 : ""), c));
pal("wd", "#E8BC80");
pal("wd2", "#CC9B5F");
pal("wd3", "#AE7E48");
pal("blush", "#E2896A");
pal("hairK", "#2E2A3A");
pal("hairB", "#6B4130");
pal("hairR", "#B4572C");
pal("hairS", "#D9B25A");
pal("k1", "#2A7F8C");
pal("k2", "#E08A2E");
pal("k3", "#7B5EA8");
pal("k4", "#C9475B");
pal("k5", "#3F6B8E");

Object.assign(FACE, {
  /* wanting to move and not moving: tight mouth, worried brow, eyes that do not settle */
  restless: { mouth: -0.45, open: 0, brow: -0.55, browOn: 0.9, lid: 0.16, lidA: -8, lidL: 0.04, pup: 0.92 },
  strain: { mouth: -0.7, open: 0, brow: -0.85, browOn: 1, lid: 0.3, lidA: -14, lidL: 0.14, pup: 0.86 },
  bored: { mouth: -0.3, open: 0, brow: -0.2, browOn: 0.6, lid: 0.5, lidA: -4, lidL: 0.04, pup: 0.95 },
  laugh: { mouth: 1, open: 0.85, brow: 0, browOn: 0, lid: 0.5, lidA: 0, lidL: 0.48, pup: 1 },
  pant: { mouth: 0.75, open: 0.55, brow: -0.2, browOn: 0.4, lid: 0.42, lidA: -4, lidL: 0.26, pup: 1 },
  puzzled: { mouth: -0.2, open: 0.15, brow: -0.45, browOn: 0.9, lid: 0.02, lidA: 0, lidL: 0, pup: 0.9 },
  shame: { mouth: -0.8, open: 0, brow: -1, browOn: 1, lid: 0.42, lidA: -16, lidL: 0.06, pup: 1 },
  speak: { mouth: 0.05, open: 0.4, brow: 0.12, browOn: 0.5, lid: 0.14, lidA: 0, lidL: 0, pup: 0.95 },
});

const HBUILD = {
  tod: { hr: 34, th: 46, tw: 19, ua: 22, fa: 20, tg: 25, sn: 23, lw: 13, aw: 11, er: 0.25 },
  kid: { hr: 33, th: 58, tw: 20, ua: 28, fa: 26, tg: 34, sn: 32, lw: 13, aw: 11, er: 0.23 },
  teen: { hr: 30, th: 72, tw: 22, ua: 36, fa: 33, tg: 46, sn: 44, lw: 14, aw: 12, er: 0.21 },
  adult: { hr: 29, th: 86, tw: 25, ua: 43, fa: 39, tg: 57, sn: 55, lw: 16, aw: 13, er: 0.19 },
};

function makeHuman(parent, o) {
  const D = HBUILD[o.kind || "kid"];
  const { hr, th, tw, ua, fa, tg, sn, lw, aw } = D;
  const hy = -(th + hr - 4), shx = tw - 3, shy = -th + 9, hx = o.manq ? 9 : 7;
  /* o.manq: the strict painter's mannequin. No hair, no clothes, ball joints, a body in three
     blocks, an egg for a head. The face stays: it has to show what the glow shows. */
  const MQ = !!o.manq && !o.skin;
  const SK = o.skin || "wd";
  /* every colour below is written as wood (wd, wd2, wd3); sk() swaps in this person's paper */
  const sk = (h) => (o.skin ? h.replace(/\b([fs])-wd([23])?(?=["\s])/g, (m, a, n) => a + "-" + SK + (n || "")).replace(/f-blush/g, "f-" + SK + "3") : h);
  const hair = o.skin ? SK + "4" : MQ ? "wd3" : (o.hair || "hairK"), pants = o.skin ? (o.wear || SK + "4") : (o.pants || "k1"), top = MQ ? null : o.top ? (o.skin ? (o.wear || SK + "4") : o.top) : null;
  const er = hr * D.er, ex = hr * 0.37, ey = hy + hr * 0.08;
  const iris = o.skin ? "#3A3648" : "#5A3A22";
  const EL = eyeRig(-ex, ey, er, { iris, ir: er * 0.8, pr: er * 0.52, lid: SK, sw: 2 });
  const ER = eyeRig(ex, ey, er, { iris, ir: er * 0.8, pr: er * 0.52, lid: SK, sw: 2 });
  const by = ey - er - hr * 0.12;
  const arm = (side, col) =>
    '<g class="arm a' + side + '"><path class="s-' + col + '" stroke-width="' + aw + '" stroke-linecap="round" d="M0,0 L0,' + ua + '"/>' +
    '<g class="fa"><path class="s-' + col + '" stroke-width="' + (aw - 1.5) + '" stroke-linecap="round" d="M0,' + ua + " L0," + (ua + fa) + '"/>' +
    '<circle cx="0" cy="' + (ua + fa + 2) + '" r="' + f2(aw * 0.66) + '" class="f-' + col + '"/>' +
    '<g class="held"></g>' + (MQ ? '<circle cx="0" cy="' + ua + '" r="' + f2(aw * 0.6) + '" class="f-wd3"/>' : "") + brad(0, ua, MQ ? 1.8 : 2.4) + "</g>" + (MQ ? '<circle r="' + f2(aw * 0.72) + '" class="f-wd3"/>' : "") + brad(0, 0, MQ ? 2 : 3) + "</g>";
  const leg = (side, col) =>
    '<g class="leg l' + side + '"><path class="s-' + col + '" stroke-width="' + lw + '" stroke-linecap="round" d="M0,0 L0,' + tg + '"/>' +
    (MQ ? "" : '<path class="s-' + pants + '" stroke-width="' + (lw + 3.5) + '" stroke-linecap="round" d="M0,0 L0,' + f2(tg * 0.42) + '"/>') +
    '<g class="sh"><path class="s-' + col + '" stroke-width="' + (lw - 1.5) + '" stroke-linecap="round" d="M0,' + tg + " L0," + (tg + sn) + '"/>' +
    '<path class="f-' + col + '" d="M' + f2(-lw * 0.55) + "," + (tg + sn - 2) + " q0," + f2(lw * 0.62) + " " + f2(lw * 0.5) + "," + f2(lw * 0.62) + " l" + f2(lw * 0.85) + ",0 q" + f2(lw * 0.5) + ",0 " + f2(lw * 0.3) + "," + f2(-lw * 0.45) + " q" + f2(-lw * 0.5) + "," + f2(-lw * 0.5) + " " + f2(-lw * 1.1) + "," + f2(-lw * 0.5) + ' Z"/>' +
    (MQ ? '<circle cx="0" cy="' + tg + '" r="' + f2(lw * 0.58) + '" class="f-wd3"/>' : "") + brad(0, tg, MQ ? 1.9 : 2.6) + "</g>" + (MQ ? '<circle r="' + f2(lw * 0.66) + '" class="f-wd3"/>' + brad(0, 0, 2) : "") + "</g>";
  /* hair: a cap, plus what makes this one recognisable */
  const cap = "M" + f2(-hr * 1.03) + "," + f2(hy - 1) + " C" + f2(-hr * 1.12) + "," + f2(hy - hr * 0.92) + " " + f2(-hr * 0.5) + "," + f2(hy - hr * 1.26) + " 0," + f2(hy - hr * 1.13) +
    " C" + f2(hr * 0.6) + "," + f2(hy - hr * 1.26) + " " + f2(hr * 1.12) + "," + f2(hy - hr * 0.84) + " " + f2(hr * 1.03) + "," + f2(hy - 5) +
    " C" + f2(hr * 0.74) + "," + f2(hy - hr * 0.5) + " " + f2(hr * 0.3) + "," + f2(hy - hr * 0.66) + " " + f2(hr * 0.02) + "," + f2(hy - hr * 0.52) +
    " C" + f2(-hr * 0.4) + "," + f2(hy - hr * 0.7) + " " + f2(-hr * 0.76) + "," + f2(hy - hr * 0.46) + " " + f2(-hr * 1.03) + "," + f2(hy - 1) + " Z";
  const hs = o.style || 0;
  let hairBack = "", hairTop = '<path class="f-' + hair + '" d="' + cap + '"/>';
  if (hs === 0) hairTop += '<path class="f-' + hair + '" d="M-9,' + f2(hy - hr * 1.08) + " q-5,-15 5,-23 q1,10 7,13 q3,-11 12,-12 q-4,10 -1,22 Z" + '"/>';
  if (hs === 1) hairTop += '<path class="f-' + hair + '" d="M' + f2(-hr * 1.03) + "," + f2(hy - 8) + " q-7," + f2(hr * 0.5) + " -1," + f2(hr * 0.86) + " q7,3 9,-4 q-2," + f2(-hr * 0.4) + " -1," + f2(-hr * 0.7) + ' Z"/>' +
    '<path class="f-' + hair + '" d="M' + f2(hr * 1.03) + "," + f2(hy - 8) + " q7," + f2(hr * 0.5) + " 1," + f2(hr * 0.86) + " q-7,3 -9,-4 q2," + f2(-hr * 0.4) + " 1," + f2(-hr * 0.7) + ' Z"/>';
  if (hs === 2) hairBack = '<g class="ptail"><path class="f-' + hair + '" d="M' + f2(-hr * 0.8) + "," + f2(hy - hr * 0.6) + " q" + f2(-hr * 0.8) + "," + f2(hr * 0.3) + " " + f2(-hr * 0.62) + "," + f2(hr * 1.35) + " q" + f2(hr * 0.32) + "," + f2(-hr * 0.24) + " " + f2(hr * 0.44) + "," + f2(-hr * 0.9) + ' Z"/></g>';
  if (hs === 3) hairTop += [-0.62, -0.2, 0.26, 0.66].map((u, i) => '<circle cx="' + f2(hr * u) + '" cy="' + f2(hy - hr * (1.0 + (i % 2) * 0.1)) + '" r="' + f2(hr * 0.27) + '" class="f-' + hair + '"/>').join("");
  if (hs === 4) hairTop = '<circle cx="' + f2(-hr * 0.1) + '" cy="' + f2(hy - hr * 1.2) + '" r="' + f2(hr * 0.4) + '" class="f-' + hair + '"/>' + hairTop;
  if (MQ) { hairBack = ""; hairTop = ""; }
  const my = hy + hr * 0.52, mw = hr * 0.3;
  const tcol = top || "wd";
  const g = PP(parent, sk(
    '<g class="lean">' +
    '<g class="slotB"></g>' +
    leg("R", "wd2") + (MQ ? leg("L", "wd") : "") +
    '<g class="tor">' + (MQ ?
      /* chest block, waist ball, pelvis block */
      '<circle cx="0" cy="' + f2(-th * 0.36) + '" r="' + f2(tw * 0.56) + '" class="f-wd3"/>' +
      '<path class="f-wd" d="M' + -tw + "," + (-th + 9) + " Q" + -tw + "," + -th + " " + (-tw + 9) + "," + -th + " L" + (tw - 9) + "," + -th + " Q" + tw + "," + -th + " " + tw + "," + (-th + 9) + " L" + f2(tw * 0.8) + "," + f2(-th * 0.5) + " Q" + f2(tw * 0.74) + "," + f2(-th * 0.42) + " 0," + f2(-th * 0.42) + " Q" + f2(-tw * 0.74) + "," + f2(-th * 0.42) + " " + f2(-tw * 0.8) + "," + f2(-th * 0.5) + ' Z"/>' +
      '<path class="f-wd" d="M' + f2(-tw * 0.78) + "," + f2(-th * 0.26) + " Q0," + f2(-th * 0.34) + " " + f2(tw * 0.78) + "," + f2(-th * 0.26) + " L" + f2(tw * 0.92) + ",1 Q" + f2(tw * 0.6) + ",12 0,12 Q" + f2(-tw * 0.6) + ",12 " + f2(-tw * 0.92) + ',1 Z"/>' +
      '<path class="s-wd2" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.6" d="M0,' + f2(-th * 0.94) + " L0," + f2(-th * 0.48) + " M0," + f2(-th * 0.22) + ' L0,8"/>'
      : ('<path class="f-' + tcol + '" d="M' + -tw + "," + (-th + 9) + " Q" + -tw + "," + -th + " " + (-tw + 9) + "," + -th + " L" + (tw - 9) + "," + -th + " Q" + tw + "," + -th + " " + tw + "," + (-th + 9) + " L" + f2(tw * 0.86) + ",-6 Q" + f2(tw * 0.86) + ",5 0,5 Q" + f2(-tw * 0.86) + ",5 " + f2(-tw * 0.86) + ',-6 Z"/>' +
    (top ? '<path class="f-wd" d="M-8,' + -th + " L8," + -th + " L0," + (-th + 11) + ' Z"/>' :
      '<path class="s-wd2" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.5" d="M' + f2(-tw * 0.45) + "," + f2(-th * 0.5) + " q4," + f2(th * 0.12) + " 1," + f2(th * 0.24) + " M" + f2(tw * 0.42) + "," + f2(-th * 0.78) + " q3," + f2(th * 0.08) + " 1," + f2(th * 0.16) + '"/>'))) +
    "</g>" +
    (MQ ? "" : leg("L", "wd")) +
    (MQ ? "" :     '<path class="f-' + pants + '" d="M' + f2(-tw * 0.9) + ",-17 L" + f2(tw * 0.9) + ",-17 L" + f2(tw * 0.97) + ",5 Q0,13 " + f2(-tw * 0.97) + ',5 Z"/>' +
    '<path class="s-ink" stroke-width="1.6" stroke-linecap="round" opacity="0.35" fill="none" d="M' + f2(-tw * 0.9) + ",-17 L" + f2(tw * 0.9) + ',-17"/>') +
    '<g class="slotM"></g>' +
    '<g class="head">' + hairBack +
    (MQ ? '<circle cx="0" cy="' + (-th - 1) + '" r="7.5" class="f-wd3"/>' : '<rect x="-6" y="' + (-th - 5) + '" width="12" height="11" class="f-wd2"/>') +
    (MQ ? "" :     '<circle cx="' + f2(-hr * 0.99) + '" cy="' + f2(hy + hr * 0.1) + '" r="' + f2(hr * 0.2) + '" class="f-wd2"/><circle cx="' + f2(hr * 0.99) + '" cy="' + f2(hy + hr * 0.1) + '" r="' + f2(hr * 0.2) + '" class="f-wd2"/>') +
    (MQ ? '<ellipse cx="0" cy="' + f2(hy - hr * 0.03) + '" rx="' + f2(hr * 0.9) + '" ry="' + f2(hr * 1.04) + '" class="f-wd"/><path class="s-wd2" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.55" d="M' + f2(-hr * 0.5) + "," + f2(hy - hr * 0.86) + " q" + f2(hr * 0.5) + "," + f2(-hr * 0.14) + " " + f2(hr) + ',0"/>' : '<circle cx="0" cy="' + hy + '" r="' + hr + '" class="f-wd"/>') +
    hairTop +
    '<g class="feat">' +
    '<circle cx="' + f2(-hr * 0.58) + '" cy="' + f2(hy + hr * 0.4) + '" r="' + f2(hr * 0.15) + '" class="f-blush" opacity="' + (MQ ? 0.22 : 0.45) + '"/><circle cx="' + f2(hr * 0.58) + '" cy="' + f2(hy + hr * 0.4) + '" r="' + f2(hr * 0.15) + '" class="f-blush" opacity="0.45"/>' +
    EL.svg + ER.svg +
    '<path class="bwL s-' + hair + '" stroke-width="' + f2(hr * 0.09) + '" stroke-linecap="round" d="M' + f2(-ex - er * 0.95) + "," + f2(by) + " L" + f2(-ex + er * 0.95) + "," + f2(by) + '" opacity="0"/>' +
    '<path class="bwR s-' + hair + '" stroke-width="' + f2(hr * 0.09) + '" stroke-linecap="round" d="M' + f2(ex - er * 0.95) + "," + f2(by) + " L" + f2(ex + er * 0.95) + "," + f2(by) + '" opacity="0"/>' +
    '<path class="s-wd3" stroke-width="2.4" stroke-linecap="round" fill="none" d="M' + f2(hr * 0.03) + "," + f2(hy + hr * 0.2) + " q" + f2(hr * 0.1) + "," + f2(hr * 0.1) + " 0," + f2(hr * 0.13) + '"/>' +
    '<path class="mth" stroke="#22202E" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="#22202E" d=""/>' +
    '<g class="tears" opacity="0"><path class="tr" fill="#8FD3EE" stroke="#22202E" stroke-width="1.2" d="M0,-5 Q4,1 0,4 Q-4,1 0,-5 Z"/><path class="tr" fill="#8FD3EE" stroke="#22202E" stroke-width="1.2" d="M0,-5 Q4,1 0,4 Q-4,1 0,-5 Z"/></g>' +
    "</g></g>" +
    '<g class="slotF"></g>' +
    "</g>"), "human");
  const lean = q(g, ".lean"), slotB = q(g, ".slotB"), slotM = q(g, ".slotM"), slotF = q(g, ".slotF");
  const aR = G(sk(arm("R", "wd2")), slotB).firstChild, aL = G(sk(arm("L", "wd")), slotM).firstChild;
  const slots = [slotB, slotM, slotF];
  const head = q(g, ".head"), feat = q(g, ".feat"), tor = q(g, ".tor"), lL = q(g, ".lL"), lR = q(g, ".lR"), shL = q(lL, ".sh"), shR = q(lR, ".sh"),
    faL = q(aL, ".fa"), faR = q(aR, ".fa"), heldL = q(aL, ".held"), heldR = q(aR, ".held"),
    mth = q(g, ".mth"), bwL = q(g, ".bwL"), bwR = q(g, ".bwR"), tears = q(g, ".tears"), trs = qa(g, ".tr"), ptail = q(g, ".ptail"),
    ebL = eyeBind(g, EL, 0), ebR = eyeBind(g, ER, 1);
  const seed = o.seed || 1;
  /* Lz / Rz: 0 behind the body, 1 in front of the body and behind the head, 2 in front of everything */
  const st = Object.assign({
    x: 0, y: 0, h: 0, gnd: 1, s: o.s || 0.8, flip: 1, r: 0, sx: 1, sy: 1, vis: 1, headR: 0, turn: 0.25,
    Lu: 6, Lf: -6, Ru: -4, Rf: -6, Lz: 1, Rz: 0, Lt: 0, Ls: 0, Rt: 0, Rs: 0,
    run: 0, ph: 0, jig: 0, jf: 21, swing: 0, tear: 0, shiver: 0, breath: 1, hip: 0,
  }, FACE0, { mouth: 0.3 });
  const R2 = 57.2958;
  const footY = (hxk, a, b, r) => {
    const kx = hxk - tg * sin(a / R2), ky = tg * cos(a / R2), fx = kx - sn * sin((a + b) / R2), fy = ky + sn * cos((a + b) / R2);
    return Math.max(fx * sin(r / R2) + fy * cos(r / R2) + lw * 0.55, kx * sin(r / R2) + ky * cos(r / R2) + lw * 0.3);
  };
  function draw(t) {
    OP(g, st.vis);
    if (st.vis < 0.01) return;
    const A = st.run, p = st.ph;
    const jg = st.jig, sw = st.swing;
    const thL = st.Lt - A * 46 * sin(p) + jg * 3 * sin(t * st.jf), thR = st.Rt + A * 46 * sin(p) + jg * 1.2 * sin(t * st.jf + 1.3);
    const snL = st.Ls + A * (16 + 64 * Math.max(0, cos(p))) + jg * 8 * sin(t * st.jf + 0.6) + sw * 20 * sin(t * 3.3), snR = st.Rs + A * (16 + 64 * Math.max(0, -cos(p))) + jg * 3 * sin(t * st.jf + 2) + sw * 20 * sin(t * 3.3 + 2.5);
    const r = st.r + A * 9;
    const low = Math.max(footY(-hx, thL, snL, r), footY(hx, thR, snR, r), lw * 0.75);
    const shv = st.shiver * sin(t * 47) * 1.1;
    st.hip = st.y - st.h - st.gnd * low * st.s * st.sy;
    place(g, st.x + shv, st.hip, 0, st.s * st.flip * st.sx, st.s * st.sy);
    rot(lean, r, 0, 0);
    const br = sin(t * (st.breath > 1.5 ? 5.4 : 2.2) + seed), k = 0.012 * br * st.breath, lift = -k * th;
    TR(tor, "scale(" + f2(1 + k * 0.5) + " " + f2(1 + k) + ")");
    TR(head, "translate(0 " + f1(lift) + ") rotate(" + f1(st.headR + noise(t * 0.8, seed) * 1.5) + " 0 " + (-th + 4) + ")");
    TR(feat, "translate(" + f1(st.turn * hr * 0.2) + " " + f1(Math.abs(st.turn) * hr * 0.01) + ")");
    TR(aL, "translate(" + -shx + " " + f1(shy + lift) + ") rotate(" + f1(st.Lu + A * 42 * sin(p)) + ")");
    TR(aR, "translate(" + shx + " " + f1(shy + lift) + ") rotate(" + f1(st.Ru - A * 42 * sin(p)) + ")");
    rot(faL, st.Lf - A * 62, 0, ua); rot(faR, st.Rf - A * 62, 0, ua);
    const lz = Math.round(st.Lz), rz = Math.round(st.Rz);
    if (aL._z !== lz) { aL._z = lz; slots[lz].appendChild(aL.parentNode); }
    if (aR._z !== rz) { aR._z = rz; slots[rz].appendChild(aR.parentNode); }
    TR(lL, "translate(" + -hx + " 0) rotate(" + f1(thL) + ")"); TR(lR, "translate(" + hx + " 0) rotate(" + f1(thR) + ")");
    rot(shL, snL, 0, tg); rot(shR, snR, 0, tg);
    const bl = blink(t, seed + 2, 3.1), lid = Math.max(st.lid, bl), nx = noise(t * 1.1, seed + 4) * 0.6;
    eyeSet(ebL, st.px + nx, st.py, lid, st.lidA, st.lidL, st.pup);
    eyeSet(ebR, st.px + nx, st.py, lid, -st.lidA, st.lidL, st.pup);
    OP(bwL, st.browOn); OP(bwR, st.browOn);
    const bo = st.brow > 0 ? hr * 0.07 * st.brow : hr * 0.06 * st.brow;
    TR(bwL, "translate(0 " + f1(bo) + ") rotate(" + f1(st.brow * 19) + " " + f1(-ex) + " " + f1(by) + ")");
    TR(bwR, "translate(0 " + f1(bo) + ") rotate(" + f1(-st.brow * 19) + " " + f1(ex) + " " + f1(by) + ")");
    /* the mouth: a line that curls both ways, and opens into a shape below it */
    const op = sat(st.open), wob = op > 0.3 && st.mouth < -0.5 ? sin(t * 38) * hr * 0.012 : 0;
    const w = mw * (1 + 0.18 * Math.max(0, st.mouth) * op), cy = my - st.mouth * hr * 0.06, cu = my + st.mouth * hr * 0.2 + wob, cl = cu + op * hr * 0.44;
    SA(mth, "d", "M" + f1(-w) + "," + f1(cy) + " Q0," + f1(cu) + " " + f1(w) + "," + f1(cy) + " Q0," + f1(cl) + " " + f1(-w) + "," + f1(cy) + " Z");
    OP(tears, st.tear);
    if (st.tear > 0.01) trs.forEach((e, i) => { const u = ((t * 1.5 + i * 0.5) % 1 + 1) % 1; TR(e, "translate(" + f1((i ? 1 : -1) * (ex + er * 0.2)) + " " + f1(ey + er + 3 + u * hr * 0.6) + ") scale(1.3)"); OP(e, u < 0.85 ? 1 : (1 - u) / 0.15); });
    if (ptail) rot(ptail, sin(t * 2.1 + seed) * 5 + A * (14 + 10 * sin(p * 2)), -hr * 0.8, hy - hr * 0.6);
  }
  /* world position of a point given in the figure's own units (after the lean) */
  const at = (lx, ly) => {
    const r = (st.r + st.run * 9) / R2, x = lx * cos(r) - ly * sin(r), y = lx * sin(r) + ly * cos(r);
    return [st.x + x * st.s * st.flip * st.sx, st.hip + y * st.s * st.sy];
  };
  const topP = (dy) => () => at(0, hy - hr - (dy || 0) / st.s);
  /* how high the hip stands over the ground in a pose (world px), for handing over between gnd 1 and 0 */
  const low = (P, r) => Math.max(footY(-hx, P.Lt, P.Ls, r || 0), footY(hx, P.Rt, P.Rs, r || 0), lw * 0.75) * st.s;
  return { g, st, draw, at, topP, low, heldL, heldR, dims: { hr, th, tw, ua, fa, tg, sn, hy, lw } };
}

/* poses: the leg and arm numbers for a few stock positions */
const HP = {
  stand: { Lt: 0, Ls: 0, Rt: 0, Rs: 0 },
  cross: { Lt: -78, Ls: 152, Rt: -104, Rs: 158 },          /* cross-legged on the ground */
  out: { Lt: -84, Ls: 6, Rt: -96, Rs: 10 },                /* on the ground, legs out */
  knees: { Lt: -128, Ls: 118, Rt: -112, Rs: 100 },         /* on the ground, knees up */
  chair: { Lt: -86, Ls: 74, Rt: -94, Rs: 82 },
  crouch: { Lt: -62, Ls: 112, Rt: -78, Rs: 122 },
  hang: { Lt: 6, Ls: 14, Rt: -8, Rs: 20 },
};

/* ------------------------------------------------------------------ things */
function makeBasket(parent) {
  let weave = "";
  for (let i = 0; i < 5; i++) weave += '<path class="s-wood2" stroke-width="2.2" fill="none" d="M' + (-25 + i * 1.2) + "," + (-6 - i * 6.5) + " q" + (25 - i * 1.2) + ",7 " + (50 - i * 2.4) + ',0"/>';
  for (let i = 0; i < 6; i++) weave += '<path class="s-wood2" stroke-width="1.6" d="M' + (-20 + i * 8) + ",-2 L" + (-23 + i * 9.2) + ',-34"/>';
  return PP(parent, '<path class="f-wood" d="M-22,0 L22,0 L29,-36 L-29,-36 Z"/>' + weave +
    '<g class="rim"><path class="s-wood" stroke-width="3" stroke-linecap="round" d="M-27,-36 L-31,-52 M-14,-36 L-15,-56 M0,-36 L1,-58 M14,-36 L17,-55 M27,-36 L32,-50"/></g>', "basket");
}
/* a school chair and desk, seen from the side. The child faces -x. Local origin: the floor under the seat. */
function makeChair(parent, seatH) {
  return PP(parent,
    '<path class="s-steel" stroke-width="4" stroke-linecap="round" fill="none" d="M-17,0 L-13,' + -seatH + " M19,0 L15," + -seatH + " M15," + -seatH + " L20," + -(seatH + 46) + '"/>' +
    '<rect x="-20" y="' + -(seatH + 5) + '" width="42" height="7" rx="3" class="f-desk"/>' +
    '<rect x="14" y="' + -(seatH + 52) + '" width="8" height="26" rx="3.5" class="f-desk2" transform="rotate(6 18 ' + -(seatH + 40) + ')"/>', "chair");
}
function makeDesk(parent, h) {
  return PP(parent,
    '<path class="s-steel" stroke-width="4" stroke-linecap="round" fill="none" d="M-30,0 L-26,' + -h + " M26,0 L22," + -h + " M-28," + -h * 0.45 + " L24," + -h * 0.45 + '"/>' +
    '<rect x="-36" y="' + -(h + 7) + '" width="72" height="9" rx="3" class="f-desk"/><rect x="-36" y="' + -(h + 1) + '" width="72" height="3" class="f-desk2"/>' +
    '<g class="paper"><rect x="-22" y="' + -(h + 9.5) + '" width="30" height="3" class="f-chalk"/></g>', "desk");
}
function makeClock(parent) {
  let ticks = "";
  for (let i = 0; i < 12; i++) ticks += '<path stroke="#22202E" stroke-width="' + (i % 3 ? 1.6 : 3) + '" stroke-linecap="round" d="M0,-25 L0,' + (i % 3 ? -21.5 : -19.5) + '" transform="rotate(' + i * 30 + ')"/>';
  const g = PP(parent, '<circle r="33" class="f-ink"/><circle r="28.5" fill="#FFFBEF"/>' + ticks +
    '<path class="hh" stroke="#22202E" stroke-width="4.6" stroke-linecap="round" d="M0,3 L0,-13"/><path class="mh" stroke="#22202E" stroke-width="3" stroke-linecap="round" d="M0,4 L0,-21"/><circle r="3.2" class="f-red"/>', "clock");
  return { g, hh: q(g, ".hh"), mh: q(g, ".mh") };
}
/* what was said, without words: a paper bubble with an arrow that points down */
function makeBubble(parent) {
  return PP(parent, '<path fill="#FFFBEF" stroke="#22202E" stroke-width="3" stroke-linejoin="round" d="M-34,-70 q0,-12 12,-12 l44,0 q12,0 12,12 l0,34 q0,12 -12,12 l-22,0 l-18,18 l2,-18 l-6,0 q-12,0 -12,-12 Z"/>' +
    '<path fill="none" stroke="#22202E" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" d="M0,-70 L0,-38 M-12,-48 L0,-36 L12,-48"/>', "bubble");
}
