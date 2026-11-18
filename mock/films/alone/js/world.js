/* world.js - the landscape of the human film: the east end of the ADHD v9 world (js/world.js and
   js/east.js there), with the camp, the climbing tree and the stream. A fire is in the open, where
   the people sit. Later a flat is put down on that spot: a back wall between the human and the
   others, a floor, and the front of a block with one cell cut open.
   World units = frame pixels at the wide. The camera stays between x 1170 and 2160. */

/* ---- palette (day, night) ---- */
pal("sky", "#F6ECD4", "#1A1F4E");
pal("cloud", "#FFFaf0", "#2A3166");
pal("hillfar", "#C9D8AC", "#27335F");
pal("hillmid", "#A9C68A", "#2A3C62");
pal("meadow", "#8FB661", "#2E4A62");
pal("meadow2", "#A3C873", "#37566E");
pal("meadow3", "#7AA554", "#274059");
pal("tuft", "#5E8F48", "#1D3350");
pal("flower", "#FFF6DC", "#7F8DB8");
pal("sand", "#E6C98F", "#7F8BB2");
pal("sand2", "#D2B277", "#67749E");
pal("trunk", "#8C5A3C");
pal("trunk2", "#6B4130");
pal("leaf1", "#3E7248", "#1B3050");
pal("leaf2", "#57915A", "#233C5A");
pal("leaf3", "#2B5A3D", "#152744");
pal("water", "#55ADAB", "#2A4F78");
pal("water2", "#2A7F8C", "#1F3F68");
pal("water3", "#1A5F70", "#162F55");
pal("foam", "#E4F3EA", "#8FA3CC");
pal("earth", "#96633F");
pal("earth2", "#74482F");
pal("cream", "#F7F0DE", "#A9B4D8");
pal("ink", "#22202E", "#0C0D22");
pal("brass", "#D8A93B", "#8A84A0");
pal("brass2", "#F6DD8C", "#B9B8D6");
pal("wood", "#DDA95F");
pal("wood2", "#BC8644");
pal("sun", "#F0B93A");
pal("shadow", "#22202E", "#05061A");
pal("thatch", "#C9A465");
pal("thatch2", "#A07E45");
/* the flat. Inside it the light is a lamp: these do not change with the hour. */
pal("wallp", "#D8D2C6", "#D8D2C6");
pal("wallp2", "#C9C2B4", "#C9C2B4");
pal("skirt", "#A69C8C", "#A69C8C");
pal("lam", "#B7A283", "#B7A283");
pal("lam2", "#9A8566", "#9A8566");
pal("doorc", "#8F7458", "#8F7458");
pal("doorc2", "#735B43", "#735B43");
pal("land", "#6C6A7A", "#6C6A7A");
pal("land2", "#474552", "#474552");
pal("sofa", "#C7A452", "#C7A452");
pal("sofa2", "#A8873A", "#A8873A");
pal("desk", "#C9B08A", "#C9B08A");
pal("desk2", "#9E8662", "#9E8662");
pal("steel", "#6C7480", "#6C7480");
pal("frame", "#77737F", "#77737F");
/* the block from outside, and what the window shows: these follow the hour */
pal("facade", "#B4AEA6", "#343A5C");
pal("facade2", "#9A948C", "#272C4C");
pal("pane", "#A9C3CF", "#1C2146");
pal("block", "#A39E9A", "#262B52");
pal("block2", "#8A8683", "#1D2146");

const PLACE = { horizon: 548, bankY: 1000, waterY: 1052 };
const EP = {
  gy: 896,                    /* the ground the human stands on */
  go: 880,                    /* the others: a little further back */
  fire: [1830, 866],          /* a little further back than the feet of whoever walks past it */
  pile: [1150, 898],          /* dead wood, out in the meadow */
  trunk: 1975, branchY: 700, branchX: [1752, 1940],
  room: [1470, 560, 1990, 890],
  floor: [884, 1002],
  win: [1590, 624, 1700, 772],
  door: [1885, 644, 1962, 890],
  chair: 1775, table: 1548, stool: 1500,
  lamp: [1712, 560],
};
const WORLD_W = 2160;

function buildWorld(cam) {
  const R = rng(29);
  const L = {}, E = {};
  const layer = (name, str) => (L[name] = G(str || "", cam, "ly-" + name));

  /* ---- sky ---- */
  let stars = "";
  for (let i = 0; i < 120; i++) stars += '<circle cx="' + f1(700 + R() * 1800) + '" cy="' + f1(14 + R() * 460) + '" r="' + f1(1.1 + R() * 2.1) + '" fill="#FFF8E0" opacity="' + f1(0.5 + R() * 0.5) + '"/>';
  const cloud = (x, y, s) => '<g class="cloud" data-x="' + x + '" data-y="' + y + '" data-s="' + s + '"><path class="f-cloud" d="M-70,0 a26,26 0 0 1 24,-30 a34,34 0 0 1 62,-12 a26,26 0 0 1 44,16 a20,20 0 0 1 8,26 Z"/></g>';
  layer("sky",
    '<rect x="500" y="-10" width="2500" height="720" class="f-sky"/>' +
    '<g id="stars" opacity="0">' + stars + "</g>" +
    '<g id="sun"><circle r="74" class="f-sun" opacity="0.22"/><circle r="50" class="f-sun"/></g>' +
    '<g id="moon"><circle r="40" fill="#FBF3D6"/><circle cx="-12" cy="-10" r="8" fill="#E2D8B4"/><circle cx="14" cy="8" r="11" fill="#E2D8B4"/><circle cx="-6" cy="18" r="5" fill="#E2D8B4"/></g>' +
    cloud(1090, 150, 1.0) + cloud(1500, 262, 0.8) + cloud(1760, 96, 1.15));

  /* ---- hills ---- */
  layer("hills",
    '<path class="f-hillfar" d="M500,452 C600,430 700,396 740,440 C850,474 970,424 1090,452 C1200,472 1320,420 1460,440 C1600,462 1720,410 1860,430 C1980,446 2100,470 2210,440 L2400,440 L2400,720 L500,720 Z"/>' +
    '<path class="f-hillmid" d="M500,500 C600,492 760,470 900,506 C980,522 1040,512 1090,500 C1180,490 1300,522 1440,506 C1580,490 1700,476 1840,500 C1960,520 2080,500 2210,512 L2400,512 L2400,740 L500,740 Z"/>');

  /* ---- meadow ---- */
  let g = '<path class="f-meadow" d="M600,552 C820,542 960,558 1090,550 C1250,560 1450,540 1650,552 C1850,562 2050,544 2210,552 L2210,1360 L600,1360 Z"/>' +
    '<path class="f-meadow2" d="M600,628 C700,616 880,652 1090,626 C1250,610 1450,650 1650,634 C1850,618 2050,650 2210,630 L2210,724 C2050,744 1850,708 1650,726 C1450,744 1250,704 1090,721 C900,744 720,706 600,718 Z"/>' +
    '<path class="f-meadow3" d="M600,892 C800,874 950,912 1090,890 C1250,872 1450,912 1650,894 C1850,876 2050,910 2210,890 L2210,1010 L600,1010 Z"/>';
  const tuft = (x, y, s, flip, ph) => '<g class="tw" data-x="' + f1(x) + '" data-y="' + f1(y) + '" data-sx="' + (flip ? "-" : "") + f1(s) + '" data-sy="' + f1(s) + '" data-p="' + f1(ph) + '" data-k="1"><path class="f-tuft" d="M-9,0 Q-8,-9 -11,-15 Q-4,-10 -3,0 Q-1,-14 1,-21 Q4,-12 4,0 Q7,-8 11,-13 Q10,-6 9,0 Z"/></g>';
  for (let i = 0; i < 270; i++) {
    const x = 900 + R() * 1300, y = 575 + R() * 415, s = 0.7 + R() * 0.7 + (y - 560) / 900, fl = R(), flp = R(), ph = R() * 6;
    if (x > 1500 && x < 2090 && y > 846 && y < 990 && R() < 0.8) continue;       /* trodden ground where they sit */
    if (x > 1455 && x < 1770 && y > 596 && y < 722) continue;                    /* the camp */
    if (fl < 0.16) g += '<g class="tw" data-x="' + f1(x) + '" data-y="' + f1(y) + '" data-sx="' + f1(s) + '" data-sy="' + f1(s) + '" data-p="' + f1(ph) + '" data-k="1.6"><path class="s-tuft" stroke-width="2.2" fill="none" d="M0,0 L0,-12"/><circle cy="-14" r="4.2" class="f-flower"/><circle cy="-14" r="1.7" class="f-sun"/></g>';
    else g += tuft(x, y, s, flp < 0.5, ph);
  }
  layer("ground", g);

  /* ---- the scene ---- */
  const east = (L.east = G("", cam, "ly-east"));
  const sub = (name) => (E[name] = G("", east, "e-" + name));

  /* the camp: two shelters, further back */
  sub("camp");
  const hut = (x, y, w, h, o) => {
    let s = '<path class="f-thatch" d="M' + (x - w / 2) + "," + y + " Q" + (x - w * 0.46) + "," + (y - h) + " " + x + "," + (y - h * 1.04) + " Q" + (x + w * 0.46) + "," + (y - h) + " " + (x + w / 2) + "," + y + ' Z"/>';
    for (let i = 0; i < 7; i++) { const u = (i + 0.5) / 7 - 0.5; s += '<path class="s-thatch2" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.8" d="M' + f1(x + u * w * 0.2) + "," + f1(y - h * 1.0) + " Q" + f1(x + u * w * 0.8) + "," + f1(y - h * 0.7) + " " + f1(x + u * w * 0.96) + "," + f1(y - 3) + '"/>'; }
    s += '<path class="s-trunk2" stroke-width="3.4" stroke-linecap="round" d="M' + (x - 5) + "," + (y - h * 1.02) + " l-7,-13 M" + (x + 5) + "," + (y - h * 1.02) + ' l8,-12"/>';
    s += '<path class="f-ink" opacity="0.62" d="M' + (x + o - w * 0.13) + "," + y + " Q" + (x + o - w * 0.12) + "," + (y - h * 0.56) + " " + (x + o) + "," + (y - h * 0.6) + " Q" + (x + o + w * 0.12) + "," + (y - h * 0.56) + " " + (x + o + w * 0.13) + "," + y + ' Z"/>';
    return s;
  };
  G('<ellipse cx="1600" cy="706" rx="150" ry="20" class="f-sand" opacity="0.55"/>' + hut(1680, 690, 120, 76, -8) + hut(1548, 704, 156, 98, 10), E.camp);

  /* the tree */
  sub("tree");
  const tx = EP.trunk, by = EP.branchY;
  const blob = (x, y, r, c) => '<circle class="cbe f-' + c + '" data-p="' + f1((x * 0.013 + y * 0.007) % 6.28) + '" cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
  let bits = "";
  for (let i = 0; i < 50; i++) { const x = 1760 + R() * 420, y = 300 + R() * 270; bits += '<path class="f-' + (R() < 0.5 ? "leaf2" : "leaf3") + '" opacity="0.8" transform="translate(' + f1(x) + " " + f1(y) + ") rotate(" + f1(R() * 360) + ')" d="M0,0 q7,-9 16,0 q-9,8 -16,0 Z"/>'; }
  G('<ellipse cx="' + (tx + 6) + '" cy="884" rx="92" ry="15" class="f-shadow" opacity="0.2"/>' +
    '<g id="ecanB">' + blob(1830, 470, 104, "leaf3") + blob(1950, 388, 128, "leaf1") + blob(2076, 462, 112, "leaf3") + blob(1960, 500, 96, "leaf1") + blob(2150, 380, 90, "leaf1") + blob(1776, 400, 62, "leaf1") + bits + "</g>" +
    '<path class="f-trunk" d="M' + (tx - 44) + ",884 C" + (tx - 30) + ",820 " + (tx - 36) + ",760 " + (tx - 32) + ",700 C" + (tx - 30) + ",640 " + (tx - 22) + ",590 " + (tx - 16) + ",530 L" + (tx + 26) + ",530 C" + (tx + 22) + ",600 " + (tx + 28) + ",650 " + (tx + 30) + ",700 C" + (tx + 32) + ",770 " + (tx + 26) + ",830 " + (tx + 46) + ',884 Z"/>' +
    '<path class="f-trunk2" opacity="0.6" d="M' + (tx - 4) + ",884 C" + (tx + 4) + ",820 " + (tx + 2) + ",740 " + (tx + 4) + ",660 L" + (tx + 22) + ",660 C" + (tx + 24) + ",750 " + (tx + 20) + ",830 " + (tx + 34) + ',884 Z"/>' +
    '<path class="s-trunk2" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7" d="M' + (tx - 20) + ",800 q6,12 2,26 M" + (tx - 14) + ',612 q5,10 2,22"/>' +
    '<ellipse cx="' + (tx - 8) + '" cy="758" rx="9" ry="13" class="f-trunk2" opacity="0.85"/>' +
    '<path class="f-trunk" d="M' + (tx - 28) + "," + (by - 26) + " C" + (tx - 90) + "," + (by - 12) + " " + (tx - 160) + "," + (by - 6) + " " + (EP.branchX[0]) + "," + (by - 3) + " q-9,6 0,13 C" + (tx - 150) + "," + (by + 12) + " " + (tx - 90) + "," + (by + 14) + " " + (tx - 28) + "," + (by + 22) + ' Z"/>' +
    '<path class="f-trunk" d="M' + (tx + 22) + ",606 C" + (tx + 70) + ",600 " + (tx + 120) + ",586 " + (tx + 170) + ",566 l4,9 C" + (tx + 124) + ",602 " + (tx + 74) + ",620 " + (tx + 24) + ',636 Z"/>' +
    '<path class="f-leaf2" d="M' + (EP.branchX[0] + 6) + "," + (by - 2) + ' q-16,-20 -34,-10 q10,16 34,10 Z"/><path class="f-leaf1" d="M' + (EP.branchX[0] + 30) + "," + (by - 5) + ' q-2,-22 -22,-26 q-2,18 22,26 Z"/>' +
    '<g id="ecanF">' + blob(2096, 560, 46, "leaf2") + blob(1786, 520, 40, "leaf2") + blob(2010, 330, 44, "leaf2") + "</g>", E.tree);

  /* the dead wood out in the meadow */
  sub("pile");
  const [px, py] = EP.pile;
  G('<ellipse cx="' + px + '" cy="' + (py + 3) + '" rx="46" ry="7" class="f-shadow" opacity="0.18"/>' +
    '<path class="s-trunk2" stroke-width="9" stroke-linecap="round" fill="none" d="M' + (px - 40) + "," + (py - 3) + " L" + (px + 34) + "," + (py - 9) + '"/>' +
    '<path class="s-trunk" stroke-width="6" stroke-linecap="round" fill="none" d="M' + (px - 30) + "," + (py - 12) + " L" + (px + 38) + "," + (py - 2) + " M" + (px + 4) + "," + (py - 9) + " l14,-15 M" + (px - 12) + "," + (py - 9) + ' l-13,-12"/>' +
    '<g id="pilesticks"><path class="s-trunk" stroke-width="5.5" stroke-linecap="round" fill="none" d="M' + (px - 26) + "," + (py - 19) + " L" + (px + 28) + "," + (py - 15) + " M" + (px - 20) + "," + (py - 25) + " L" + (px + 22) + "," + (py - 22) + '"/></g>', E.pile);

  /* the others and the fire. No transform on this group: it is hidden, not moved, when the wall is down. */
  sub("others");
  const [fx0, fy0] = EP.fire;
  let stones = "";
  [[-34, 2, 11, 6], [-18, 7, 12, 6], [2, 9, 12, 6], [22, 7, 12, 6], [36, 1, 10, 6]].forEach(([x, y, rx, ry]) => { stones += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" class="f-sand2"/>'; });
  E.fire = G('<defs><radialGradient id="fglow"><stop offset="0" stop-color="#FFD98A" stop-opacity="0.8"/><stop offset="0.45" stop-color="#FFB45A" stop-opacity="0.32"/><stop offset="1" stop-color="#FFB45A" stop-opacity="0"/></radialGradient></defs>' +
    '<ellipse id="fpool" cx="0" cy="8" rx="250" ry="52" fill="url(#fglow)" opacity="0"/>' +
    '<circle id="fhalo" cy="-34" r="170" fill="url(#fglow)" opacity="0"/>' +
    '<ellipse cx="0" cy="5" rx="44" ry="9" class="f-ink" opacity="0.25"/>' +
    '<path class="s-trunk2" stroke-width="8" stroke-linecap="round" d="M-30,0 L24,-11 M-24,-11 L30,0"/>' +
    '<g id="fwood" opacity="0"><path class="s-trunk" stroke-width="6" stroke-linecap="round" d="M-34,-10 L20,-20 M-18,-22 L30,-12 M-8,-4 L34,-18"/></g>' +
    '<g id="flames"><path class="fl" fill="#F0B93A" d="M-22,-6 Q-30,-34 -8,-58 Q-6,-40 4,-36 Q2,-56 14,-74 Q34,-44 22,-6 Z"/>' +
    '<path class="fl" fill="#F08A2E" d="M-13,-6 Q-18,-26 -3,-42 Q0,-30 6,-28 Q8,-40 12,-48 Q22,-28 14,-6 Z"/>' +
    '<path class="fl" fill="#FFF3C4" d="M-6,-6 Q-8,-18 1,-28 Q9,-18 7,-6 Z"/></g>' +
    stones + '<g id="sparks"></g>', E.others, "fire");
  E.fire.setAttribute("transform", "translate(" + fx0 + " " + fy0 + ") scale(1.15)");
  E.people = G("", E.others, "people");

  /* ---- the flat ---- */
  const [rx0, ry0, rx1, ry1] = EP.room, [wx0, wy0, wx1, wy1] = EP.win, [dx0, dy0, dx1, dy1] = EP.door;
  /* what the window shows: the block across the street. Its colours follow the hour. */
  let opp = "", oppLit = "";
  const ww = wx1 - wx0;
  [[8, 62], [42, 62], [76, 62], [8, 100], [42, 100], [76, 100], [8, 138], [42, 138], [76, 138]].forEach(([x, y], i) => {
    if (y + 26 > wy1 - wy0) return;
    opp += '<rect x="' + (wx0 + x) + '" y="' + (wy0 + y) + '" width="24" height="26" class="f-pane"/>';
    if (i === 1 || i === 3 || i === 5) oppLit += '<rect x="' + (wx0 + x) + '" y="' + (wy0 + y) + '" width="24" height="26" fill="#F2D98A"/><path stroke="#D9BB62" stroke-width="1.6" d="M' + (wx0 + x) + "," + (wy0 + y + 9) + " l24,0 M" + (wx0 + x) + "," + (wy0 + y + 18) + ' l24,0"/>';
  });
  let stripes = "";
  for (let x = rx0 - 78; x < rx1 + 100; x += 52) stripes += '<rect x="' + x + '" y="' + ry0 + '" width="26" height="' + (ry1 - ry0) + '" class="f-wallp2" opacity="0.45"/>';
  sub("wall");
  G('<rect x="' + (rx0 - 100) + '" y="' + (ry0 - 60) + '" width="' + (rx1 - rx0 + 200) + '" height="' + (ry1 - ry0 + 60) + '" class="f-wallp"/>' + stripes +
    '<rect x="' + (rx0 - 100) + '" y="' + (ry1 - 16) + '" width="' + (rx1 - rx0 + 200) + '" height="16" class="f-skirt"/>' +
    /* the window */
    '<rect x="' + wx0 + '" y="' + wy0 + '" width="' + ww + '" height="' + (wy1 - wy0) + '" class="f-sky"/>' +
    '<g id="winstars">' + [[14, 14, 1.6], [40, 30, 1.2], [66, 10, 1.8], [92, 26, 1.3], [26, 40, 1.1]].map(([x, y, r]) => '<circle cx="' + (wx0 + x) + '" cy="' + (wy0 + y) + '" r="' + r + '" fill="#FFF8E0"/>').join("") + "</g>" +
    '<rect x="' + wx0 + '" y="' + (wy0 + 50) + '" width="' + ww + '" height="' + (wy1 - wy0 - 50) + '" class="f-block"/>' +
    '<rect x="' + wx0 + '" y="' + (wy0 + 50) + '" width="' + ww + '" height="5" class="f-block2"/>' + opp +
    '<g id="opplit" opacity="0">' + oppLit + "</g>" +
    '<path fill="#FFFBEF" opacity="0.13" d="M' + (wx0 + 6) + "," + (wy0 + 56) + " L" + (wx0 + 50) + "," + (wy0 + 4) + " L" + (wx0 + 68) + "," + (wy0 + 4) + " L" + (wx0 + 6) + "," + (wy0 + 78) + ' Z"/>' +
    '<rect x="' + (wx0 - 5) + '" y="' + (wy0 - 5) + '" width="' + (ww + 10) + '" height="' + (wy1 - wy0 + 10) + '" fill="none" class="s-frame" stroke-width="8"/>' +
    '<path class="s-frame" stroke-width="5" d="M' + ((wx0 + wx1) / 2) + "," + wy0 + " L" + ((wx0 + wx1) / 2) + "," + wy1 + '"/>' +
    '<rect x="' + (wx0 - 14) + '" y="' + (wy1 + 4) + '" width="' + (ww + 28) + '" height="8" rx="2" class="f-skirt"/>' +
    /* the door, and the landing behind it */
    '<rect x="' + (dx0 - 8) + '" y="' + (dy0 - 8) + '" width="' + (dx1 - dx0 + 16) + '" height="' + (dy1 - dy0 + 8) + '" class="f-doorc2"/>' +
    '<rect x="' + dx0 + '" y="' + dy0 + '" width="' + (dx1 - dx0) + '" height="' + (dy1 - dy0) + '" class="f-land2"/>' +
    '<rect x="' + dx0 + '" y="' + (dy0 + 40) + '" width="' + (dx1 - dx0) + '" height="' + (dy1 - dy0 - 74) + '" class="f-land"/>' +
    '<rect x="' + dx0 + '" y="' + (dy1 - 34) + '" width="' + (dx1 - dx0) + '" height="34" class="f-land2"/>' +
    '<path class="s-land2" stroke-width="4" stroke-linecap="round" fill="none" d="M' + (dx0 + 8) + "," + (dy1 - 34) + " l0,-62 M" + (dx0 + 30) + "," + (dy1 - 34) + " l0,-74 M" + (dx0 + 52) + "," + (dy1 - 34) + " l0,-86 M" + (dx0 + 2) + "," + (dy1 - 94) + " L" + (dx1 - 6) + "," + (dy1 - 132) + '"/>' +
    '<circle cx="' + ((dx0 + dx1) / 2) + '" cy="' + (dy0 + 22) + '" r="26" fill="#FFE9B8" opacity="0.12"/><circle cx="' + ((dx0 + dx1) / 2) + '" cy="' + (dy0 + 22) + '" r="5" fill="#E9DDB8"/>' +
    '<g id="dleaf"><rect x="' + -(dx1 - dx0) + '" y="' + dy0 + '" width="' + (dx1 - dx0) + '" height="' + (dy1 - dy0) + '" class="f-doorc"/>' +
    '<rect x="' + (-(dx1 - dx0) + 10) + '" y="' + (dy0 + 14) + '" width="' + (dx1 - dx0 - 20) + '" height="92" fill="none" class="s-doorc2" stroke-width="3"/>' +
    '<rect x="' + (-(dx1 - dx0) + 10) + '" y="' + (dy0 + 122) + '" width="' + (dx1 - dx0 - 20) + '" height="108" fill="none" class="s-doorc2" stroke-width="3"/>' +
    '<circle cx="' + (-(dx1 - dx0) + 11) + '" cy="' + (dy0 + 128) + '" r="4.6" class="f-brass"/></g>', E.wall);
  E.dleaf = q(E.wall, "#dleaf");

  sub("floor");
  const [fl0, fl1] = EP.floor;
  let boards = "";
  [fl0 + 30, fl0 + 64, fl0 + 96].forEach((y) => { boards += '<path class="s-lam2" stroke-width="2.2" opacity="0.7" d="M' + (rx0 - 30) + "," + y + " L" + (rx1 + 30) + "," + y + '"/>'; });
  for (let r = 0; r < 4; r++) for (let x = rx0 - 20 + (r % 2) * 70; x < rx1 + 30; x += 140) boards += '<path class="s-lam2" stroke-width="2.2" opacity="0.7" d="M' + x + "," + (fl0 + [0, 30, 64, 96][r]) + " L" + x + "," + (fl0 + [30, 64, 96, 118][r]) + '"/>';
  G('<clipPath id="eflclip"><rect id="eflclipr" x="' + (rx0 - 30) + '" y="' + (fl0 - 4) + '" width="0" height="' + (fl1 - fl0 + 8) + '"/></clipPath>' +
    '<g clip-path="url(#eflclip)"><rect x="' + (rx0 - 30) + '" y="' + fl0 + '" width="' + (rx1 - rx0 + 60) + '" height="' + (fl1 - fl0) + '" class="f-lam"/>' + boards +
    '<ellipse id="elampF" cx="' + EP.lamp[0] + '" cy="' + (fl0 + 52) + '" rx="150" ry="40" fill="#FFE9B8" opacity="0"/>' +
    '<path id="elightF" fill="#FFF6D2" opacity="0" d="M0,0 L' + ww + ",0 L" + (ww + 46) + ",76 L46,76 Z" + '"/></g>' +
    '<g id="eflroll"><ellipse rx="13" ry="' + ((fl1 - fl0) / 2 + 6) + '" class="f-lam2"/><ellipse rx="7" ry="' + ((fl1 - fl0) / 2) + '" class="f-ink" opacity="0.45"/></g>', E.floor);

  sub("back");      /* things behind the human */
  sub("kids");      /* the human. No transform on this group or above it: the glow reads its own. */
  sub("near");      /* one of the others, for the moment it is in front of the human */
  sub("props");     /* what is carried */
  sub("front");     /* things in front of the human */

  /* the front of the block, with one cell cut open */
  sub("facade");
  let seams = "", fw = "", fwLit = "";
  for (let x = 1210; x < 2300; x += 260) seams += '<path class="s-facade2" stroke-width="3" opacity="0.7" d="M' + x + ",40 L" + x + "," + (x > rx0 && x < rx1 ? ry0 - 22 : 1012) + '"/>';
  [[1500, 444, 1], [1690, 444, 0], [1880, 444, 1], [1500, 290, 0], [1690, 290, 1], [1880, 290, 0], [1310, 444, 0], [2070, 444, 0], [1310, 290, 1], [2070, 290, 0]].forEach(([x, y, lit]) => {
    fw += '<rect x="' + (x - 6) + '" y="' + (y - 6) + '" width="92" height="88" class="f-facade2"/><rect x="' + x + '" y="' + y + '" width="80" height="76" class="f-pane"/>';
    if (lit) fwLit += '<rect x="' + x + '" y="' + y + '" width="80" height="76" fill="#F2D98A"/><path stroke="#D9BB62" stroke-width="2" d="M' + x + "," + (y + 19) + " l80,0 M" + x + "," + (y + 38) + " l80,0 M" + x + "," + (y + 57) + ' l80,0"/>';
  });
  seams += '<rect x="900" y="402" width="1500" height="8" class="f-facade2" opacity="0.8"/>';
  G('<path class="f-facade" fill-rule="evenodd" d="M900,-40 L2400,-40 L2400,1014 L900,1014 Z M' + rx0 + "," + ry0 + " L" + rx0 + "," + fl1 + " L" + rx1 + "," + fl1 + " L" + rx1 + "," + ry0 + ' Z"/>' +
    '<rect x="900" y="' + (ry0 - 22) + '" width="1500" height="8" class="f-facade2" opacity="0.8"/>' + seams + fw + '<g id="fwlit" opacity="0">' + fwLit + "</g>" +
    '<path fill="none" class="s-facade2" stroke-width="12" stroke-linejoin="miter" d="M' + rx0 + "," + (fl1 + 6) + " L" + rx0 + "," + ry0 + " L" + rx1 + "," + ry0 + " L" + rx1 + "," + (fl1 + 6) + '"/>' +
    '<rect x="900" y="' + (fl1 - 2) + '" width="1500" height="16" class="f-facade2"/>', E.facade);

  /* ---- the stream at the front of the stage ---- */
  const wy = PLACE.waterY, bk = PLACE.bankY;
  let wave = "M870," + wy;
  for (let x = 870; x <= 2300; x += 60) wave += " q15,-7 30,0 t30,0";
  let lip = "M880," + (bk - 12) + " L2210," + (bk - 12) + " L2210," + (bk + 10);
  for (let x = 2210; x > 880; x -= 50) lip += " q-12," + f1(5 + R() * 6) + " -25,0 t-25,0";
  lip += " Z";
  let liptufts = "", pebbles = "", plants = "", shafts = "";
  for (let x = 900; x < 2200; x += 26 + R() * 30) liptufts += tuft(x, bk - 6 + R() * 8, 1.1 + R() * 0.7, R() < 0.5, R() * 6).replace('data-k="1"', 'data-k="1.2"');
  for (let i = 0; i < 36; i++) pebbles += '<ellipse cx="' + f1(890 + R() * 1310) + '" cy="' + f1(1318 + R() * 24) + '" rx="' + f1(7 + R() * 13) + '" ry="' + f1(4 + R() * 6) + '" class="f-' + (R() < 0.5 ? "sand2" : "earth") + '" opacity="0.8"/>';
  [[960, 0.9], [1070, 1.15], [1180, 1.1], [1300, 0.8], [1470, 1.2], [1640, 0.9], [1790, 1.1], [1930, 0.75], [2060, 1.2]].forEach(([x, s], i) => {
    plants += '<g class="wplant" data-x="' + x + '" data-s="' + s + '" data-p="' + f1(i * 1.3 + 2) + '"><path class="f-' + (i % 2 ? "leaf2" : "leaf1") + '" d="M-7,0 C-22,-50 12,-80 -8,-130 C-2,-160 6,-170 4,-190 C16,-150 22,-120 12,-90 C30,-50 2,-40 9,0 Z"/></g>';
  });
  [[980, 52, 0.7], [1200, 60, 0.9], [1440, 44, 0.6], [1650, 70, 1], [1880, 50, 0.7], [2080, 64, 0.9]].forEach(([x, w, o], i) => {
    shafts += '<path class="shaft" data-p="' + (i * 1.7 + 1) + '" data-o="' + o + '" fill="#FFFBEF" opacity="0.07" d="M' + x + "," + (wy + 2) + " L" + (x + w) + "," + (wy + 2) + " L" + (x + w * 1.5 - 70) + ",1316 L" + (x - 90 - w * 0.4) + ',1316 Z"/>';
  });
  layer("apron",
    '<path class="f-earth2" d="M880,' + (bk - 2) + " L2210," + (bk - 2) + ' L2210,1360 L880,1360 Z"/>' +
    '<path class="wv f-water3" d="' + wave + ' L2310,1360 L870,1360 Z"/>' +
    '<path class="f-water2" d="M880,' + (wy + 58) + " C1280," + (wy + 40) + " 1500," + (wy + 86) + " 1720," + (wy + 62) + " C1900," + (wy + 44) + " 2050," + (wy + 80) + " 2210," + (wy + 58) + ' L2210,1360 L880,1360 Z" opacity="0.55"/>' +
    shafts +
    '<path class="f-sand" d="M880,1300 C1250,1320 1420,1296 1620,1310 C1820,1322 2000,1294 2210,1308 L2210,1360 L880,1360 Z"/>' + pebbles + plants +
    '<path class="wv f-water" opacity="0.1" d="' + wave + ' L2310,1360 L870,1360 Z"/>' +
    '<path class="wv s-foam" stroke-width="4" fill="none" stroke-linecap="round" d="' + wave + '" opacity="0.9"/>' +
    '<path class="f-earth" d="M880,' + (bk - 4) + " L2210," + (bk - 4) + " L2210," + (bk + 16) + " C2000," + (bk + 26) + " 1800," + (bk + 10) + " 1600," + (bk + 18) + " C1400," + (bk + 26) + " 1250," + (bk + 14) + " 880," + (bk + 20) + ' Z"/>' +
    '<path class="f-meadow3" d="' + lip + '"/>' + liptufts);

  layer("fx");
  return { L, E };
}
