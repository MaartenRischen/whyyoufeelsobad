/* east.js - the landscape goes on to the east (world x 1080-2200). The human child lives here:
   a camp at the edge of the meadow and a climbing tree. Later a schoolroom is put down on the
   same spot. One world, one camera: the camera travels here from the monkey's cage. */
pal("wall", "#EDE6D2", "#EDE6D2");
pal("wall2", "#D9CFB4", "#D9CFB4");
pal("floorb", "#CFA46C", "#CFA46C");
pal("floorb2", "#AF8450", "#AF8450");
pal("board", "#3C5A4C", "#3C5A4C");
pal("board2", "#2B4338", "#2B4338");
pal("chalk", "#F4F1E4", "#F4F1E4");
pal("desk", "#DDAE66", "#DDAE66");
pal("desk2", "#B98846", "#B98846");
pal("steel", "#6C7480", "#6C7480");
pal("thatch", "#C9A465");
pal("thatch2", "#A07E45");

const EP = {
  gy: 890,                    /* the ground the humans stand on */
  adult: [1525, 892],
  sit0: [1640, 890],          /* where the child sits at first */
  seatH: [1836, 890],         /* where it ends up, and where its chair will be */
  seatA: [1672, 890],
  trunk: 1975, branchY: 700, branchX: [1752, 1940],
  win: [1880, 575, 2040, 772],
  board: [1440, 590, 1650, 760],
  clock: [1792, 542],
  room: [1320, 380, 2110, 890],
  floor: [884, 1002],
};
const WORLD_W = 2160;

function buildEast(L, cam) {
  const R = rng(29);
  const E = {};
  const NSg = (str, parent, cls, before) => { const g = G(str, null, cls); if (before) parent.insertBefore(g, before); else parent.appendChild(g); return g; };

  /* ---- sky, hills, ground: the same layers, further east ---- */
  NSg('<rect x="1080" y="-10" width="1500" height="700" class="f-sky"/>', L.sky, "", L.sky.firstChild);
  const cloud = (x, y, s) => '<g class="cloud" data-x="' + x + '" data-y="' + y + '" data-s="' + s + '"><path class="f-cloud" d="M-70,0 a26,26 0 0 1 24,-30 a34,34 0 0 1 62,-12 a26,26 0 0 1 44,16 a20,20 0 0 1 8,26 Z"/></g>';
  NSg(cloud(1290, 120, 1.0) + cloud(1700, 250, 0.8) + cloud(1960, 96, 1.15), L.sky);
  NSg('<path class="f-hillfar" d="M1080,453 C1200,472 1320,420 1460,440 C1600,462 1720,410 1860,430 C1980,446 2100,470 2210,440 L2210,720 L1080,720 Z"/>' +
    '<path class="f-hillmid" d="M1080,501 C1180,490 1300,522 1440,506 C1580,490 1700,476 1840,500 C1960,520 2080,500 2210,512 L2210,740 L1080,740 Z"/>', L.hills);
  let g = '<path class="f-meadow" d="M1080,550 C1250,560 1450,540 1650,552 C1850,562 2050,544 2210,552 L2210,1360 L1080,1360 Z"/>' +
    '<path class="f-meadow2" d="M1080,627 C1250,610 1450,650 1650,634 C1850,618 2050,650 2210,630 L2210,724 C2050,744 1850,708 1650,726 C1450,744 1250,704 1080,721 Z"/>' +
    '<path class="f-meadow3" d="M1080,891 C1250,872 1450,912 1650,894 C1850,876 2050,910 2210,890 L2210,1010 L1080,1010 Z"/>';
  for (let i = 0; i < 200; i++) {
    const x = 1090 + R() * 1110, y = 575 + R() * 415, s = 0.7 + R() * 0.7 + (y - 560) / 900, fl = R(), flp = R(), ph = R() * 6;
    if (x < 1322 && y > 540 && y < 905) continue;                               /* the road bends away here */
    if (x > 1400 && x < 2090 && y > 846 && y < 990 && R() < 0.72) continue;      /* trodden ground where they play */
    if (x > 1455 && x < 1770 && y > 596 && y < 722) continue;                    /* the camp */
    if (fl < 0.16) g += '<g class="tw" data-x="' + f1(x) + '" data-y="' + f1(y) + '" data-sx="' + f1(s) + '" data-sy="' + f1(s) + '" data-p="' + f1(ph) + '" data-k="1.6"><path class="s-tuft" stroke-width="2.2" fill="none" d="M0,0 L0,-12"/><circle cy="-14" r="4.2" class="f-flower"/><circle cy="-14" r="1.7" class="f-sun"/></g>';
    else g += '<g class="tw" data-x="' + f1(x) + '" data-y="' + f1(y) + '" data-sx="' + (flp < 0.5 ? "-" : "") + f1(s) + '" data-sy="' + f1(s) + '" data-p="' + f1(ph) + '" data-k="1"><path class="f-tuft" d="M-9,0 Q-8,-9 -11,-15 Q-4,-10 -3,0 Q-1,-14 1,-21 Q4,-12 4,0 Q7,-8 11,-13 Q10,-6 9,0 Z"/></g>';
  }
  NSg(g, L.ground);

  /* ---- the road bends north and leaves over the rise ---- */
  E.road = NSg('<path class="f-shadow" opacity="0.2" d="M1088,806 C1180,806 1246,766 1268,696 C1282,646 1290,606 1296,560 L1302,560 C1300,624 1298,694 1284,756 C1264,832 1190,894 1088,894 Z"/>' +
    '<path class="f-road" d="M1088,800 C1180,800 1240,760 1262,690 C1276,640 1284,600 1290,556 L1302,556 C1300,620 1298,690 1282,750 C1262,826 1190,886 1088,886 Z"/>' +
    '<path class="s-roadline" stroke-width="5" stroke-dasharray="40 40" fill="none" opacity="0.9" d="M1088,843 C1170,843 1240,800 1268,724"/>', L.road);

  /* ---- the east scene, between the old tree layer and the stream ---- */
  const east = NSg("", cam, "ly-east", L.apron);
  const sub = (name) => (E[name] = G("", east, "e-" + name));

  /* the camp: two shelters and a fire, further back */
  sub("camp");
  const hut = (x, y, w, h, o) => {
    let s = '<path class="f-thatch" d="M' + (x - w / 2) + "," + y + " Q" + (x - w * 0.46) + "," + (y - h) + " " + x + "," + (y - h * 1.04) + " Q" + (x + w * 0.46) + "," + (y - h) + " " + (x + w / 2) + "," + y + ' Z"/>';
    for (let i = 0; i < 7; i++) { const u = (i + 0.5) / 7 - 0.5; s += '<path class="s-thatch2" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.8" d="M' + f1(x + u * w * 0.2) + "," + f1(y - h * 1.0) + " Q" + f1(x + u * w * 0.8) + "," + f1(y - h * 0.7) + " " + f1(x + u * w * 0.96) + "," + f1(y - 3) + '"/>'; }
    s += '<path class="s-trunk2" stroke-width="3.4" stroke-linecap="round" d="M' + (x - 5) + "," + (y - h * 1.02) + " l-7,-13 M" + (x + 5) + "," + (y - h * 1.02) + ' l8,-12"/>';
    s += '<path class="f-ink" opacity="0.62" d="M' + (x + o - w * 0.13) + "," + y + " Q" + (x + o - w * 0.12) + "," + (y - h * 0.56) + " " + (x + o) + "," + (y - h * 0.6) + " Q" + (x + o + w * 0.12) + "," + (y - h * 0.56) + " " + (x + o + w * 0.13) + "," + y + ' Z"/>';
    return s;
  };
  G('<ellipse cx="1600" cy="706" rx="150" ry="20" class="f-sand" opacity="0.55"/>' + hut(1680, 690, 120, 76, -8) + hut(1548, 704, 156, 98, 10) +
    '<g id="efire"><path class="s-trunk2" stroke-width="5" stroke-linecap="round" d="M1700,714 l34,-9 M1702,704 l30,11"/><path class="fl f-car" d="M1708,708 q-3,-16 8,-26 q1,9 6,12 q2,-7 0,-12 q10,10 6,26 Z"/><path class="fl f-red" opacity="0.8" d="M1713,708 q-1,-9 4,-14 q4,6 3,14 Z"/></g>' +
    '<g id="esmoke"></g>', E.camp);

  /* the climbing tree */
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
    /* the low branch they climb on, and one higher up on the other side */
    '<path class="f-trunk" d="M' + (tx - 28) + "," + (by - 26) + " C" + (tx - 90) + "," + (by - 12) + " " + (tx - 160) + "," + (by - 6) + " " + (EP.branchX[0]) + "," + (by - 3) + " q-9,6 0,13 C" + (tx - 150) + "," + (by + 12) + " " + (tx - 90) + "," + (by + 14) + " " + (tx - 28) + "," + (by + 22) + ' Z"/>' +
    '<path class="f-trunk" d="M' + (tx + 22) + ",606 C" + (tx + 70) + ",600 " + (tx + 120) + ",586 " + (tx + 170) + ",566 l4,9 C" + (tx + 124) + ",602 " + (tx + 74) + ",620 " + (tx + 24) + ',636 Z"/>' +
    '<path class="f-leaf2" d="M' + (EP.branchX[0] + 6) + "," + (by - 2) + ' q-16,-20 -34,-10 q10,16 34,10 Z"/><path class="f-leaf1" d="M' + (EP.branchX[0] + 30) + "," + (by - 5) + ' q-2,-22 -22,-26 q-2,18 22,26 Z"/>', E.tree);

  /* the schoolroom: back wall (with a window that is a hole, so the tree shows through), floor, things */
  const [rx0, ry0, rx1, ry1] = EP.room, [wx0, wy0, wx1, wy1] = EP.win, [bx0, by0, bx1, by1] = EP.board;
  sub("wall");
  G('<path class="f-wall" fill-rule="evenodd" d="M' + rx0 + "," + ry0 + " L" + rx1 + "," + ry0 + " L" + rx1 + "," + ry1 + " L" + rx0 + "," + ry1 + " Z M" + wx0 + "," + wy0 + " L" + wx0 + "," + wy1 + " L" + wx1 + "," + wy1 + " L" + wx1 + "," + wy0 + ' Z"/>' +
    '<rect x="' + rx0 + '" y="' + (ry1 - 84) + '" width="' + (rx1 - rx0) + '" height="84" class="f-wall2"/>' +
    '<rect x="' + rx0 + '" y="' + (ry1 - 88) + '" width="' + (rx1 - rx0) + '" height="5" class="f-desk2" opacity="0.7"/>' +
    '<rect x="' + rx0 + '" y="' + (ry1 - 11) + '" width="' + (rx1 - rx0) + '" height="11" class="f-desk2"/>' +
    /* the sun through the window, on the wall */
    /* window frame and bars */
    '<rect x="' + (wx0 - 7) + '" y="' + (wy0 - 7) + '" width="' + (wx1 - wx0 + 14) + '" height="' + (wy1 - wy0 + 14) + '" fill="none" class="s-desk2" stroke-width="9"/>' +
    '<path class="s-desk2" stroke-width="5" d="M' + ((wx0 + wx1) / 2) + "," + wy0 + " L" + ((wx0 + wx1) / 2) + "," + wy1 + " M" + wx0 + "," + (wy0 + 78) + " L" + wx1 + "," + (wy0 + 78) + '"/>' +
    '<rect x="' + (wx0 - 16) + '" y="' + (wy1 + 4) + '" width="' + (wx1 - wx0 + 32) + '" height="9" rx="2" class="f-desk"/>' +
    '<path fill="#FFFBEF" opacity="0.2" d="M' + (wx0 + 8) + "," + (wy0 + 60) + " L" + (wx0 + 62) + "," + (wy0 + 4) + " L" + (wx0 + 84) + "," + (wy0 + 4) + " L" + (wx0 + 8) + "," + (wy0 + 84) + ' Z"/>' +
    /* a row of hooks with nothing on them */
    [0, 1, 2, 3, 4, 5, 6].map((i) => '<path class="s-steel" stroke-width="3" stroke-linecap="round" fill="none" d="M' + (1700 + i * 22) + ",666 l0,10 q0,5 5,5" + '"/>').join("") +
    '<rect x="1690" y="660" width="156" height="6" rx="2" class="f-desk2"/>', E.wall);
  sub("board");
  let scr = "";
  const SR = rng(8);
  for (let r = 0; r < 5; r++) {
    let d = "M" + (bx0 + 22) + "," + (by0 + 28 + r * 26), x = bx0 + 22;
    const len = 62 + SR() * 24;
    while (x < bx0 + 22 + len) { const dx = 6 + SR() * 8; d += " q" + f1(dx / 2) + "," + f1(-5 - SR() * 6) + " " + f1(dx) + ",0"; x += dx; if (SR() < 0.22) { d += " m7,0"; x += 7; } }
    scr += '<path class="scr s-chalk" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.92" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="' + d + '"/>';
  }
  G('<rect x="' + (bx0 - 7) + '" y="' + (by0 - 7) + '" width="' + (bx1 - bx0 + 14) + '" height="' + (by1 - by0 + 14) + '" rx="3" class="f-desk2"/>' +
    '<rect x="' + bx0 + '" y="' + by0 + '" width="' + (bx1 - bx0) + '" height="' + (by1 - by0) + '" class="f-board"/>' +
    '<path class="f-board2" opacity="0.5" d="M' + bx0 + "," + by0 + " L" + (bx0 + 80) + "," + by0 + " L" + (bx0 + 20) + "," + by1 + " L" + bx0 + "," + by1 + ' Z"/>' + scr +
    '<path class="s-chalk" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8" d="M' + (bx0 + 138) + "," + (by0 + 96) + " l44,0 l-22,-40 Z M" + (bx0 + 132) + "," + (by0 + 122) + " l56,0 M" + (bx0 + 132) + "," + (by0 + 138) + ' l38,0"/>' +
    '<rect x="' + (bx0 + 10) + '" y="' + (by1 + 7) + '" width="' + (bx1 - bx0 - 20) + '" height="6" rx="2" class="f-desk"/>' +
    '<rect x="' + (bx1 - 60) + '" y="' + (by1 + 2) + '" width="16" height="5" rx="2" class="f-chalk"/><rect x="' + (bx1 - 38) + '" y="' + (by1 + 1) + '" width="22" height="6" rx="1.5" class="f-steel"/>', E.board);
  E.scr = qa(E.board, ".scr");
  E.clock = makeClock(sub("clockL"));
  sub("floor");
  const [fy0, fy1] = EP.floor;
  let boards = "";
  [fy0 + 30, fy0 + 64, fy0 + 96].forEach((y, r) => { boards += '<path class="s-floorb2" stroke-width="2.2" opacity="0.7" d="M' + rx0 + "," + y + " L" + rx1 + "," + y + '"/>'; });
  for (let r = 0; r < 4; r++) for (let x = rx0 + 40 + (r % 2) * 70; x < rx1; x += 140) boards += '<path class="s-floorb2" stroke-width="2.2" opacity="0.7" d="M' + x + "," + (fy0 + [0, 30, 64, 96][r]) + " L" + x + "," + (fy0 + [30, 64, 96, 118][r]) + '"/>';
  G('<clipPath id="eflclip"><rect id="eflclipr" x="' + rx0 + '" y="' + (fy0 - 4) + '" width="0" height="' + (fy1 - fy0 + 8) + '"/></clipPath>' +
    '<g clip-path="url(#eflclip)"><rect x="' + rx0 + '" y="' + fy0 + '" width="' + (rx1 - rx0) + '" height="' + (fy1 - fy0) + '" class="f-floorb"/>' + boards +
    '<path id="elightF" fill="#FFF6D2" opacity="0.35" d="M0,0 L130,0 L176,70 L46,70 Z"/></g>' +
    '<g id="eflroll"><ellipse rx="13" ry="' + ((fy1 - fy0) / 2 + 6) + '" class="f-floorb2"/><ellipse rx="7" ry="' + ((fy1 - fy0) / 2) + '" class="f-ink" opacity="0.45"/></g>', E.floor);
  sub("back");      /* chairs */
  sub("kids");      /* the people. No transform on this group or above it: the glow reads their own. */
  sub("front");     /* desks */
  sub("canF");
  G('<g id="ecanF">' + blob(2096, 560, 46, "leaf2") + blob(1786, 520, 40, "leaf2") + blob(2010, 330, 44, "leaf2") + "</g>", E.canF);

  /* ---- the stream goes on ---- */
  const wy = PLACE.waterY, bk = PLACE.bankY;
  let wave = "M1070," + wy;
  for (let x = 1070; x <= 2300; x += 60) wave += " q15,-7 30,0 t30,0";
  let lip = "M1080," + (bk - 12) + " L2210," + (bk - 12) + " L2210," + (bk + 10);
  for (let x = 2210; x > 1080; x -= 50) lip += " q-12," + f1(5 + R() * 6) + " -25,0 t-25,0";
  lip += " Z";
  let liptufts = "", pebbles = "", plants = "", shafts = "";
  for (let x = 1100; x < 2200; x += 26 + R() * 30) liptufts += '<g class="tw" data-x="' + f1(x) + '" data-y="' + f1(bk - 6 + R() * 8) + '" data-sx="' + (R() < 0.5 ? "-" : "") + f1(1.1 + R() * 0.7) + '" data-sy="' + f1(1.1 + R() * 0.7) + '" data-p="' + f1(R() * 6) + '" data-k="1.2"><path class="f-tuft" d="M-9,0 Q-8,-9 -11,-15 Q-4,-10 -3,0 Q-1,-14 1,-21 Q4,-12 4,0 Q7,-8 11,-13 Q10,-6 9,0 Z"/></g>';
  for (let i = 0; i < 30; i++) pebbles += '<ellipse cx="' + f1(1090 + R() * 1110) + '" cy="' + f1(1318 + R() * 24) + '" rx="' + f1(7 + R() * 13) + '" ry="' + f1(4 + R() * 6) + '" class="f-' + (R() < 0.5 ? "sand2" : "earth") + '" opacity="0.8"/>';
  [[1180, 1.1], [1300, 0.8], [1470, 1.2], [1640, 0.9], [1790, 1.1], [1930, 0.75], [2060, 1.2]].forEach(([x, s], i) => {
    plants += '<g class="wplant" data-x="' + x + '" data-s="' + s + '" data-p="' + f1(i * 1.3 + 2) + '"><path class="f-' + (i % 2 ? "leaf2" : "leaf1") + '" d="M-7,0 C-22,-50 12,-80 -8,-130 C-2,-160 6,-170 4,-190 C16,-150 22,-120 12,-90 C30,-50 2,-40 9,0 Z"/></g>';
  });
  [[1200, 60, 0.9], [1440, 44, 0.6], [1650, 70, 1], [1880, 50, 0.7], [2080, 64, 0.9]].forEach(([x, w, o], i) => {
    shafts += '<path class="shaft" data-p="' + (i * 1.7 + 1) + '" data-o="' + o + '" fill="#FFFBEF" opacity="0.07" d="M' + x + "," + (wy + 2) + " L" + (x + w) + "," + (wy + 2) + " L" + (x + w * 1.5 - 70) + ",1316 L" + (x - 90 - w * 0.4) + ',1316 Z"/>';
  });
  NSg('<path class="f-earth2" d="M1080,' + (bk - 2) + " L2210," + (bk - 2) + ' L2210,1360 L1080,1360 Z"/>' +
    '<path class="wv f-water3" d="' + wave + ' L2310,1360 L1070,1360 Z"/>' +
    '<path class="f-water2" d="M1080,' + (wy + 58) + " C1280," + (wy + 40) + " 1500," + (wy + 86) + " 1720," + (wy + 62) + " C1900," + (wy + 44) + " 2050," + (wy + 80) + " 2210," + (wy + 58) + ' L2210,1360 L1080,1360 Z" opacity="0.55"/>' +
    shafts +
    '<path class="f-sand" d="M1080,1300 C1250,1320 1420,1296 1620,1310 C1820,1322 2000,1294 2210,1308 L2210,1360 L1080,1360 Z"/>' + pebbles + plants +
    '<path class="wv f-water" opacity="0.1" d="' + wave + ' L2310,1360 L1070,1360 Z"/>' +
    '<path class="wv s-foam" stroke-width="4" fill="none" stroke-linecap="round" d="' + wave + '" opacity="0.9"/>' +
    '<path class="f-earth" d="M1080,' + (bk - 4) + " L2210," + (bk - 4) + " L2210," + (bk + 16) + " C2000," + (bk + 26) + " 1800," + (bk + 10) + " 1600," + (bk + 18) + " C1400," + (bk + 26) + " 1250," + (bk + 14) + " 1080," + (bk + 20) + ' Z"/>' +
    '<path class="f-meadow3" d="' + lip + '"/>' + liptufts, L.apron);
  L.east = east;
  return E;
}
