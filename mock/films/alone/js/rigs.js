/* rigs.js - trimmed for the lonely film: the paper wrapper, the faces and the eye rig (from ADHD v9).
   Every creature is a jointed paper puppet held together with brass pins.
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

