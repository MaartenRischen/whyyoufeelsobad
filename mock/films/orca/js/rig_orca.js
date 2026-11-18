/* rig_orca.js - the creatures of the orca film: jointed paper puppets held together with brass pins.
   The faces and the eye are the ones from the ADHD film (coded/js/rigs.js), unchanged.
   Each factory returns { g, st (plain numbers that GSAP tweens), draw(t) }. */

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

/* ------------------------------------------------------------------ orca: three body parts on two pins.
   Local units: the middle of the body is (0,0), it faces +x, y down. About 360 units from snout to flukes.
   kind: "mid" (the one the film is about), "mum", "bull" (a tall fin), "calf".
   The eye sits at the front tip of the white patch, larger than life, because the face has to say
   what the glow says. Orcas call with the mouth shut, so the calls leave the forehead (seq_orca.js). */
const OFACE = {
  /* looking for someone who is not there */
  search: { mouth: -0.35, open: 0, brow: -0.6, browOn: 0.9, lid: 0.04, lidA: -6, lidL: 0, pup: 0.9 },
  /* calling */
  call: { mouth: -0.5, open: 0.22, brow: -0.8, browOn: 1, lid: 0.2, lidA: -12, lidL: 0.05, pup: 1 },
  /* heard something */
  hear: { mouth: 0.2, open: 0.12, brow: -0.3, browOn: 0.5, lid: 0, lidA: 0, lidL: 0, pup: 1.25 },
  /* nothing came, again */
  flat: { mouth: -0.7, open: 0, brow: -0.9, browOn: 1, lid: 0.44, lidA: -15, lidL: 0.08, pup: 1 },
};
Object.assign(FACE, OFACE);

function makeOrca(parent, o) {
  o = o || {};
  const kind = o.kind || "mid";
  const E = eyeRig(117, -2, 11, { iris: "#7A5A3C", ir: 7.6, pr: 4.6, lid: "ok", lidL: "ok", sw: 2.2 });
  const DOR = {
    mid: "M22,-44 C10,-68 -8,-88 -30,-98 C-27,-80 -30,-62 -38,-43 Z",
    mum: "M24,-44 C12,-70 -8,-92 -32,-104 C-28,-84 -32,-64 -40,-43 Z",
    bull: "M26,-44 C20,-90 6,-132 -8,-152 Q-16,-154 -18,-142 C-22,-104 -28,-70 -40,-43 Z",
    calf: "M16,-44 C6,-58 -6,-68 -20,-72 C-18,-62 -22,-52 -28,-43 Z",
  }[kind];
  const JAW = "M151,16 C135,19.5 115,21.5 98,22.5 L95,39 C118,36 139,28 151,16 Z";
  const g = PP(parent,
    /* the rear, and the flukes on it */
    '<g class="rear">' +
    '<g class="flk"><path class="f-ok2" d="M-146,-6 C-166,-14 -190,-24 -216,-24 C-206,-14 -200,-6 -196,-1 L-150,2 Z"/><path class="f-ok" d="M-144,-8 C-162,-6 -184,2 -196,-1 C-202,8 -210,18 -222,26 C-192,26 -164,16 -144,8 Z"/>' +
    '<path class="s-ok2" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.8" d="M-160,6 L-200,18"/>' + brad(-150, 0, 3.6) + "</g>" +
    '<path class="f-ok" d="M-44,-45 C-84,-40 -122,-24 -152,-11 L-152,11 C-122,24 -84,36 -44,41 A43,43 0 0 0 -44,-45 Z"/>' +
    '<path class="f-ow" d="M-44,41 L-44,29 C-70,23 -96,9 -120,5 C-118,16 -110,24 -96,30 C-80,36 -62,40 -44,41 Z"/>' +
    "</g>" +
    '<g class="dor"><path class="f-ok" d="' + DOR + '"/><path class="s-ok2" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.8" d="' + (kind === "bull" ? "M-2,-60 L-10,-136" : kind === "calf" ? "M-8,-50 L-16,-66" : "M-8,-54 L-24,-88") + '"/></g>' +
    /* the body */
    '<path class="f-ok" d="M-60,-40 C-20,-49 40,-49 80,-41 C114,-34 140,-20 153,0 Q160,12 150,18 C128,31 100,41 60,45 C20,49 -30,45 -60,37 A39,39 0 0 1 -60,-40 Z"/>' +
    '<path class="f-ow" d="M100,22.5 C80,24 62,27 40,31 C8,37 -28,35 -60,28 L-60,37 C-30,45 20,49 60,45 C76,43.5 86,41.5 96,39 Z"/>' +
    '<path class="f-og" d="M-20,-45.5 C-38,-44 -54,-40 -66,-32 C-52,-33 -36,-34 -16,-37 Z"/>' +
    '<path stroke="#FFFBEF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.18" d="M8,-41 Q52,-43 96,-30"/>' +
    /* the mouth: dark inside, a tongue, and the white lower jaw on its own pin */
    '<path class="f-ink" d="' + JAW + '"/><path class="f-tongue" d="M140,20 L104,24 L104,33 C120,31 132,27 140,20 Z"/>' +
    '<g class="jaw"><path class="f-ow" d="' + JAW + '"/><path class="f-ow2" d="M151,16 C139,27 118,35.5 95,39 L95.6,35.5 C118,32 136,25 151,16 Z"/></g>' +
    '<path class="lip s-ink" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none" d=""/>' +
    /* the white patch, with the eye at its tip */
    '<ellipse cx="90" cy="-17" rx="24" ry="10" transform="rotate(-11 90 -17)" class="f-ow"/>' +
    E.svg +
    '<path class="brow s-og" stroke-width="5" stroke-linecap="round" d="M104,-17 L130,-16" opacity="0"/>' +
    '<g class="pec"><path class="f-ok" d="M68,30 C58,48 36,74 12,82 C8,70 22,48 46,30 Z"/><path class="s-ok2" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.8" d="M52,40 L24,72"/></g>' + brad(57, 34, 3.4) +
    brad(-56, 0, 4.2),
    "orca");
  const rear = q(g, ".rear"), flk = q(g, ".flk"), dor = q(g, ".dor"), pec = q(g, ".pec"), jaw = q(g, ".jaw"), lip = q(g, ".lip"), brow = q(g, ".brow"), eb = eyeBind(g, E, 0);
  /* a shut eye on a black head: the line has to be light */
  eb.ecl.setAttribute("stroke", "#D9DBE4"); eb.eo.setAttribute("stroke", "#14131C");
  const seed = o.seed || 1;
  const st = Object.assign({ x: 0, y: 0, r: 0, pitch: 0, flip: 1, s: o.s || 0.9, sx: 1, sy: 1, vis: 1, sw: 0, swA: 8, bend: 0, pec: 0, blinkOff: 0 }, FACE0, { px: 2 });
  function draw(t) {
    OP(g, st.vis);
    if (st.vis < 0.01) return;
    /* pitch: + is nose down, whichever way it faces */
    place(g, st.x, st.y, st.r + st.pitch * st.flip, st.s * st.flip * st.sx, st.s * st.sy);
    rot(rear, st.swA * 0.5 * sin(st.sw) + st.bend, -56, 0);
    rot(flk, st.swA * 1.25 * sin(st.sw - 1.0) + st.bend * 0.8, -150, 0);
    rot(dor, st.swA * 0.1 * sin(st.sw - 0.4), -8, -45);
    rot(pec, st.pec + sin(t * 1.7 + seed) * 5, 57, 34);
    rot(jaw, st.open * 17, 98, 22.5);
    SA(lip, "d", "M151,16 C135,19.5 115,21.5 100,22.4 Q94,22.8 " + f1(91 - Math.abs(st.mouth)) + "," + f1(22.8 - 8 * st.mouth));
    const bl = st.blinkOff ? 0 : blink(t, seed, 3.6);
    eyeSet(eb, st.px + noise(t * 1.1, seed) * 0.7, st.py, Math.max(st.lid, bl * 0.95), st.lidA, st.lidL, st.pup);
    OP(brow, st.browOn);
    TR(brow, "translate(0 " + f1(st.brow > 0 ? 3 * st.brow : 2.4 * st.brow) + ") rotate(" + f1(st.brow * 19) + " 117 -16)");
  }
  /* a point given in the orca's own units -> world */
  const at = (lx, ly) => {
    const a = (st.r + st.pitch * st.flip) * PI / 180, X = lx * st.s * st.flip * st.sx, Y = ly * st.s * st.sy;
    return [st.x + X * cos(a) - Y * sin(a), st.y + X * sin(a) + Y * cos(a)];
  };
  return { g, st, draw, at, kind };
}

/* a salmon: a small plain fish, no face to read */
function makeSalmon(parent, seed) {
  const g = PP(parent,
    '<g class="tl"><path class="f-salmon2" d="M-24,0 L-42,-13 Q-36,0 -42,13 Z"/></g>' +
    '<path class="f-salmon" d="M30,0 C20,-11 2,-14 -12,-10 L-26,-3 L-26,3 L-12,10 C2,14 20,11 30,0 Z"/>' +
    '<path class="f-salmon2" d="M30,0 C20,-11 2,-14 -12,-10 L-26,-3 C-8,-6 12,-6 30,0 Z"/>' +
    '<path class="f-salmon2" d="M2,-12 L-6,-21 L-12,-11 Z"/>' +
    '<circle cx="19" cy="-2.5" r="2.6" class="f-ink"/>', "salmon");
  const tl = q(g, ".tl");
  return { g, tl, seed };
}
