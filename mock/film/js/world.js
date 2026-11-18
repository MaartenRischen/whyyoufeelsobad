/* world.js - the one landscape, built as layered cut paper. World units = frame pixels at the wide. */

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
pal("dung", "#6B4A2E", "#3D3759");
pal("dung2", "#54381F", "#2B2747");
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
pal("road", "#3B3A47", "#17182E");
pal("roadline", "#F3E7CC", "#8894BC");
pal("red", "#E4472D", "#8E3350");
pal("red2", "#BF3520", "#6E2742");
pal("cream", "#F7F0DE", "#A9B4D8");
pal("ink", "#22202E", "#0C0D22");
pal("brass", "#D8A93B", "#8A84A0");
pal("brass2", "#F6DD8C", "#B9B8D6");
pal("fish", "#D3E2BC");
pal("fish2", "#C2D6CE");
pal("fishback", "#3E7C86");
pal("fishback2", "#4A6EA6");
pal("fishfin", "#2C6672");
pal("nest", "#B98F56");
pal("nest2", "#8A6638");
pal("btl", "#2B2438", "#1C1F47");
pal("btl2", "#42365E", "#31366E");
pal("btlwing", "#E9A45A", "#6A6A9A");
pal("toad", "#8A7B45");
pal("toad2", "#6C5F33");
pal("toadb", "#D2C48E");
pal("fur", "#B58C5E");
pal("fur2", "#9A7449");
pal("face", "#EFC9A8");
pal("ear", "#E39C86");
pal("cloth", "#E9D9B6");
pal("cloth2", "#C8B48A");
pal("lab", "#DCE4DD");
pal("lab2", "#BECAC4");
pal("cage", "#6C7480");
pal("lamp", "#4C4C5C", "#23243C");
pal("wood", "#DDA95F");
pal("wood2", "#BC8644");
pal("car", "#F0B93A");
pal("car2", "#C99422");
pal("glass", "#BFE3E6");
pal("sun", "#F0B93A");
pal("shadow", "#22202E", "#05061A");

/* ---- places ---- */
const PLACE = {
  horizon: 548,
  pond: [232, 732],
  pat: [700, 662],
  lamp: [905, 792],        /* base of the pole */
  lampHead: [856, 462],
  roadY: [800, 886],
  branchY: 522,
  seat: [326, 520],
  bankY: 1000,
  waterY: 1052,
  nest: [276, 1306],
  fishHome: [300, 1218],
  block: [352, 1052],
};

function buildWorld(cam) {
  const R = rng(11);
  const L = {};
  const layer = (name, str) => (L[name] = G(str || "", cam, "ly-" + name));

  /* ---- sky ---- */
  let stars = "";
  for (let i = 0; i < 90; i++) {
    const x = R() * W, y = 14 + R() * 500, r = 1.1 + R() * 2.1;
    stars += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="#FFF8E0" opacity="' + f1(0.5 + R() * 0.5) + '"/>';
  }
  /* the Milky Way: a band of fine dots from upper left to right */
  let mw = "";
  for (let i = 0; i < 330; i++) {
    const u = R(), v = (R() + R() + R() - 1.5) * 0.9;
    const x = lerp(380, 1090, u) + v * 22, y = lerp(60, 330, u) + v * 70 - Math.sin(u * 3) * 20;
    mw += '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(0.6 + R() * 1.3) + '" fill="#FFF8E0" opacity="' + f1(0.35 + R() * 0.6) + '"/>';
  }
  const cloud = (x, y, s) => '<g class="cloud" data-x="' + x + '" data-y="' + y + '" data-s="' + s + '"><path class="f-cloud" d="M-70,0 a26,26 0 0 1 24,-30 a34,34 0 0 1 62,-12 a26,26 0 0 1 44,16 a20,20 0 0 1 8,26 Z"/></g>';
  layer("sky",
    '<rect x="-10" y="-10" width="1100" height="700" class="f-sky"/>' +
    '<g id="stars" opacity="0"><ellipse cx="735" cy="195" rx="390" ry="62" transform="rotate(20 735 195)" fill="#FFF8E0" opacity="0.07"/>' + mw + stars + "</g>" +
    '<g id="sun"><circle r="74" class="f-sun" opacity="0.22"/><circle r="50" class="f-sun"/></g>' +
    '<g id="moon"><circle r="40" fill="#FBF3D6"/><circle cx="-12" cy="-10" r="8" fill="#E2D8B4"/><circle cx="14" cy="8" r="11" fill="#E2D8B4"/><circle cx="-6" cy="18" r="5" fill="#E2D8B4"/></g>' +
    cloud(250, 150, 1.2) + cloud(860, 250, 0.9) + cloud(470, 76, 0.7));

  /* ---- hills ---- */
  layer("hills",
    '<path class="f-hillfar" d="M-10,470 C120,410 250,440 370,468 C480,424 610,396 740,440 C850,474 970,424 1090,452 L1090,720 L-10,720 Z"/>' +
    '<path class="f-hillmid" d="M-10,528 C150,484 300,504 450,520 C600,492 760,470 900,506 C980,522 1040,512 1090,500 L1090,740 L-10,740 Z"/>');

  /* ---- meadow ---- */
  let g = '<path class="f-meadow" d="M-10,566 C200,538 420,554 640,548 C820,542 960,558 1090,550 L1090,1360 L-10,1360 Z"/>';
  g += '<path class="f-meadow2" d="M-10,640 C160,612 330,650 520,632 C700,616 880,652 1090,626 L1090,720 C900,744 720,706 540,724 C350,742 170,706 -10,730 Z"/>';
  g += '<path class="f-meadow3" d="M-10,900 C200,872 400,914 620,892 C800,874 950,912 1090,890 L1090,1010 L-10,1010 Z"/>';
  const inEll = (x, y, c, rx, ry) => ((x - c[0]) / rx) ** 2 + ((y - c[1]) / ry) ** 2 < 1;
  for (let i = 0; i < 190; i++) {
    const x = R() * W, y = 575 + R() * 420, s = 0.7 + R() * 0.7 + (y - 560) / 900;
    if (inEll(x, y, PLACE.pond, 140, 64) || inEll(x, y, PLACE.pat, 170, 78) || inEll(x, y, [860, 770], 150, 60)) continue;
    if (y > PLACE.roadY[0] - 16 && y < PLACE.roadY[1] + 12) continue;
    const fl = R();
    if (fl < 0.16) {
      g += '<g class="tw" data-x="' + f1(x) + '" data-y="' + f1(y) + '" data-sx="' + f1(s) + '" data-sy="' + f1(s) + '" data-p="' + f1(R() * 6) + '" data-k="1.6"><path class="s-tuft" stroke-width="2.2" fill="none" d="M0,0 L0,-12"/><circle cy="-14" r="4.2" class="f-flower"/><circle cy="-14" r="1.7" class="f-sun"/></g>';
    } else {
      g += '<g class="tw" data-x="' + f1(x) + '" data-y="' + f1(y) + '" data-sx="' + (R() < 0.5 ? "-" : "") + f1(s) + '" data-sy="' + f1(s) + '" data-p="' + f1(R() * 6) + '" data-k="1"><path class="f-tuft" d="M-9,0 Q-8,-9 -11,-15 Q-4,-10 -3,0 Q-1,-14 1,-21 Q4,-12 4,0 Q7,-8 11,-13 Q10,-6 9,0 Z"/></g>';
    }
  }
  layer("ground", g);

  /* ---- pond ---- */
  const [px, py] = PLACE.pond;
  let reeds = "";
  for (let i = 0; i < 7; i++) {
    const x = px - 96 + i * 30 + R() * 10, h = 46 + R() * 34, y = py - 34 - Math.abs(i - 3) * -3;
    reeds += '<g class="reed" data-x="' + f1(x) + '" data-y="' + f1(y) + '" data-p="' + f1(R() * 6) + '"><path class="s-leaf1" stroke-width="3.2" fill="none" d="M0,0 L0,-' + f1(h) + '"/><rect x="-3.6" y="-' + f1(h + 4) + '" width="7.2" height="19" rx="3.6" class="f-trunk2"/>' +
      '<path class="f-leaf2" d="M0,0 Q' + (i % 2 ? 14 : -14) + ",-" + f1(h * 0.5) + " " + (i % 2 ? 9 : -9) + ",-" + f1(h * 0.8) + " Q" + (i % 2 ? 4 : -4) + ",-" + f1(h * 0.4) + ' 0,0 Z"/></g>';
  }
  layer("pond",
    '<ellipse cx="' + px + '" cy="' + (py + 5) + '" rx="132" ry="56" class="f-meadow3"/>' +
    '<g id="reeds">' + reeds + "</g>" +
    '<ellipse cx="' + px + '" cy="' + py + '" rx="122" ry="49" class="f-water2"/>' +
    '<ellipse cx="' + (px - 6) + '" cy="' + (py - 5) + '" rx="100" ry="36" class="f-water"/>' +
    '<path class="s-foam" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7" d="M' + (px - 70) + "," + (py - 14) + " q16,-7 32,0 M" + (px + 10) + "," + (py + 16) + ' q14,-6 28,0"/>' +
    '<g id="lily"><ellipse cx="' + (px - 62) + '" cy="' + (py + 14) + '" rx="19" ry="8" class="f-leaf2"/><ellipse cx="' + (px + 66) + '" cy="' + (py - 12) + '" rx="15" ry="6.5" class="f-leaf1"/><circle cx="' + (px + 62) + '" cy="' + (py - 15) + '" r="4" class="f-flower"/></g>' +
    '<g id="ripples"></g><g id="pondlife"></g>');

  /* ---- the dry patch with the dung pat ---- */
  const [dx, dy] = PLACE.pat;
  let peb = "";
  for (let i = 0; i < 16; i++) {
    const a = R() * 6.28, rr = 40 + R() * 100;
    peb += '<ellipse cx="' + f1(dx + cos(a) * rr * 1.25 - 20) + '" cy="' + f1(dy + 28 + sin(a) * rr * 0.42) + '" rx="' + f1(2 + R() * 4) + '" ry="' + f1(1.5 + R() * 2) + '" class="f-sand2"/>';
  }
  layer("patch",
    '<path class="f-sand2" d="M' + (dx - 190) + "," + (dy + 34) + " C" + (dx - 180) + "," + (dy - 26) + " " + (dx - 60) + "," + (dy - 48) + " " + (dx + 20) + "," + (dy - 42) + " C" + (dx + 130) + "," + (dy - 44) + " " + (dx + 206) + "," + (dy - 2) + " " + (dx + 196) + "," + (dy + 60) + " C" + (dx + 190) + "," + (dy + 118) + " " + (dx + 40) + "," + (dy + 128) + " " + (dx - 50) + "," + (dy + 116) + " C" + (dx - 140) + "," + (dy + 108) + " " + (dx - 196) + "," + (dy + 84) + " " + (dx - 190) + "," + (dy + 34) + ' Z"/>' +
    '<path class="f-sand" transform="translate(0 -6)" d="M' + (dx - 190) + "," + (dy + 34) + " C" + (dx - 180) + "," + (dy - 26) + " " + (dx - 60) + "," + (dy - 48) + " " + (dx + 20) + "," + (dy - 42) + " C" + (dx + 130) + "," + (dy - 44) + " " + (dx + 206) + "," + (dy - 2) + " " + (dx + 196) + "," + (dy + 60) + " C" + (dx + 190) + "," + (dy + 118) + " " + (dx + 40) + "," + (dy + 128) + " " + (dx - 50) + "," + (dy + 116) + " C" + (dx - 140) + "," + (dy + 108) + " " + (dx - 196) + "," + (dy + 84) + " " + (dx - 190) + "," + (dy + 34) + ' Z"/>' +
    peb +
    '<g id="pat"><ellipse cx="' + dx + '" cy="' + (dy + 5) + '" rx="40" ry="13" class="f-shadow" opacity="0.18"/>' +
    '<path class="f-dung" d="M' + (dx - 36) + "," + (dy + 4) + " q-4,-16 12,-18 q-2,-14 14,-14 q4,-12 16,-6 q14,-2 12,12 q16,2 12,16 q8,10 -6,12 l-54,0 q-10,0 -6,-2 Z" + '"/>' +
    '<path class="s-dung2" stroke-width="3" stroke-linecap="round" fill="none" d="M' + (dx - 16) + "," + (dy - 10) + " q8,-6 16,0 M" + (dx + 2) + "," + (dy - 22) + ' q6,-4 12,0"/></g>');

  /* ---- road (rolled out later) ---- */
  const [r0, r1] = PLACE.roadY;
  let dashes = "";
  for (let x = 10; x < 1090; x += 92) dashes += '<rect x="' + x + '" y="' + ((r0 + r1) / 2 - 3) + '" width="48" height="6" rx="2" class="f-roadline"/>';
  layer("road",
    '<clipPath id="roadclip"><rect id="roadclipr" x="-20" y="' + (r0 - 20) + '" width="0" height="' + (r1 - r0 + 40) + '"/></clipPath>' +
    '<g clip-path="url(#roadclip)">' +
    '<path class="f-shadow" opacity="0.2" d="M-20,' + (r0 + 6) + " L1100," + (r0 + 6) + " L1100," + (r1 + 8) + " L-20," + (r1 + 8) + ' Z"/>' +
    '<rect x="-20" y="' + r0 + '" width="1120" height="' + (r1 - r0) + '" class="f-road"/>' +
    '<rect x="-20" y="' + (r0 + 7) + '" width="1120" height="3" class="f-roadline" opacity="0.8"/><rect x="-20" y="' + (r1 - 10) + '" width="1120" height="3" class="f-roadline" opacity="0.8"/>' + dashes +
    '<g id="tracks"></g></g>' +
    '<g id="roll"><ellipse rx="15" ry="' + ((r1 - r0) / 2 + 9) + '" class="f-road"/><ellipse rx="9" ry="' + ((r1 - r0) / 2 + 3) + '" class="f-ink" opacity="0.6"/><ellipse rx="4" ry="' + ((r1 - r0) / 2 - 8) + '" class="f-roadline" opacity="0.5"/></g>');

  layer("trails");
  layer("pool", '<ellipse id="poolE" cx="842" cy="768" rx="188" ry="74" fill="#FFD98A" opacity="0"/>');

  /* ---- street lamp (pops up later) ---- */
  const [lx, ly] = PLACE.lamp;
  layer("lamp",
    '<g id="lampG"><ellipse cx="' + lx + '" cy="' + (ly + 2) + '" rx="26" ry="8" class="f-shadow" opacity="0.25"/>' +
    '<g id="lampP">' +
    '<path class="f-lamp" d="M' + (lx - 5) + "," + ly + " L" + (lx - 4) + "," + (ly - 318) + " Q" + (lx - 4) + "," + (ly - 348) + " " + (lx - 34) + "," + (ly - 348) + " L" + (lx - 52) + "," + (ly - 348) + " L" + (lx - 52) + "," + (ly - 340) + " L" + (lx - 34) + "," + (ly - 340) + " Q" + (lx + 4) + "," + (ly - 340) + " " + (lx + 4) + "," + (ly - 318) + " L" + (lx + 5) + "," + ly + ' Z"/>' +
    '<path class="f-lamp" d="M' + (lx - 14) + "," + ly + " L" + (lx - 9) + "," + (ly - 26) + " L" + (lx + 9) + "," + (ly - 26) + " L" + (lx + 14) + "," + ly + ' Z"/>' +
    '<path class="f-lamp" d="M' + (lx - 84) + "," + (ly - 334) + " L" + (lx - 76) + "," + (ly - 352) + " L" + (lx - 40) + "," + (ly - 352) + " L" + (lx - 34) + "," + (ly - 334) + ' Z"/>' +
    '<path id="bulb" d="M' + (lx - 80) + "," + (ly - 334) + " L" + (lx - 38) + "," + (ly - 334) + " L" + (lx - 42) + "," + (ly - 326) + " L" + (lx - 76) + "," + (ly - 326) + ' Z" fill="#8C8C9A"/>' +
    "</g></g>");

  layer("actors");
  layer("car");
  layer("cone",
    '<path id="coneP" d="M' + (lx - 76) + "," + (ly - 326) + " L" + (lx - 42) + "," + (ly - 326) + " L" + (lx + 130) + "," + (ly - 20) + " L" + (lx - 250) + "," + (ly - 20) + ' Z" fill="#FFE2A0" opacity="0"/>' +
    '<circle id="halo" cx="' + (lx - 59) + '" cy="' + (ly - 328) + '" r="42" fill="#FFE9B8" opacity="0"/>');

  /* ---- the tree ---- */
  const by = PLACE.branchY;
  const blob = (x, y, r, c) => '<circle class="cb f-' + c + '" data-p="' + f1((x * 0.013 + y * 0.007) % 6.28) + '" cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
  let leafbits = "";
  for (let i = 0; i < 46; i++) {
    const x = 10 + R() * 470, y = 210 + R() * 300;
    leafbits += '<path class="f-' + (R() < 0.5 ? "leaf2" : "leaf3") + '" opacity="0.8" transform="translate(' + f1(x) + " " + f1(y) + ") rotate(" + f1(R() * 360) + ')" d="M0,0 q7,-9 16,0 q-9,8 -16,0 Z"/>';
  }
  layer("tree",
    '<ellipse cx="180" cy="656" rx="70" ry="13" class="f-shadow" opacity="0.2"/>' +
    '<g id="canopyB">' + blob(74, 430, 92, "leaf3") + blob(126, 322, 112, "leaf1") + blob(258, 272, 122, "leaf3") + blob(378, 336, 108, "leaf1") + blob(206, 404, 124, "leaf1") + blob(336, 428, 104, "leaf3") + blob(438, 436, 66, "leaf1") + blob(40, 330, 60, "leaf1") + leafbits + "</g>" +
    '<path class="f-trunk" d="M146,656 C160,600 160,520 150,440 C146,400 160,360 172,330 L200,330 C196,380 204,420 208,470 C212,540 204,600 216,656 Z"/>' +
    '<path class="f-trunk2" d="M176,656 C186,600 186,540 180,470 L196,470 C200,540 196,600 204,656 Z" opacity="0.6"/>' +
    '<path id="branch" class="f-trunk" d="M196,' + (by + 34) + " C260," + (by + 22) + " 360," + (by + 14) + " 520," + (by - 10) + " L522," + (by - 2) + " C380," + (by + 30) + " 280," + (by + 44) + " 200," + (by + 62) + ' Z"/>' +
    '<g id="labback"></g><g id="monk"></g><g id="cagefront"></g>' +
    '<g id="canopyF">' + blob(26, 500, 44, "leaf2") + blob(96, 548, 36, "leaf2") + blob(462, 268, 34, "leaf2") + blob(180, 196, 44, "leaf2") + "</g>");

  /* ---- the stream, cut open (the front of the stage) ---- */
  const wy = PLACE.waterY, bk = PLACE.bankY;
  let lip = "M-10," + (bk - 12) + " L1090," + (bk - 12) + " L1090," + (bk + 10);
  for (let x = 1090; x > -10; x -= 50) lip += " q-12," + f1(5 + R() * 6) + " -25,0 t-25,0";
  lip += " Z";
  let liptufts = "";
  for (let x = 6; x < 1080; x += 26 + R() * 30) liptufts += '<g class="tw" data-x="' + f1(x) + '" data-y="' + f1(bk - 6 + R() * 8) + '" data-sx="' + (R() < 0.5 ? "-" : "") + f1(1.1 + R() * 0.7) + '" data-sy="' + f1(1.1 + R() * 0.7) + '" data-p="' + f1(R() * 6) + '" data-k="1.2"><path class="f-tuft" d="M-9,0 Q-8,-9 -11,-15 Q-4,-10 -3,0 Q-1,-14 1,-21 Q4,-12 4,0 Q7,-8 11,-13 Q10,-6 9,0 Z"/></g>';
  let pebbles = "";
  for (let i = 0; i < 30; i++) {
    const x = R() * W;
    pebbles += '<ellipse cx="' + f1(x) + '" cy="' + f1(1318 + R() * 24) + '" rx="' + f1(7 + R() * 13) + '" ry="' + f1(4 + R() * 6) + '" class="f-' + (R() < 0.5 ? "sand2" : "earth") + '" opacity="0.8"/>';
  }
  let plants = "";
  [[70, 1.2], [128, 0.8], [200, 1.0], [602, 1.1], [700, 0.75], [790, 1.25], [905, 0.9], [1000, 1.15]].forEach(([x, s], i) => {
    plants += '<g class="wplant" data-x="' + x + '" data-s="' + s + '" data-p="' + f1(i * 1.3) + '">' +
      '<path class="f-' + (i % 2 ? "leaf2" : "leaf1") + '" d="M-7,0 C-22,-50 12,-80 -8,-130 C-2,-160 6,-170 4,-190 C16,-150 22,-120 12,-90 C30,-50 2,-40 9,0 Z"/></g>';
  });
  let wave = "M-130," + wy;
  for (let x = -130; x <= 1210; x += 60) wave += " q15,-7 30,0 t30,0";
  let shafts = "";
  [[90, 60, 0.9], [330, 44, 0.6], [520, 70, 1], [760, 50, 0.7], [960, 64, 0.9]].forEach(([x, w, o], i) => {
    shafts += '<path class="shaft" data-p="' + (i * 1.7) + '" data-o="' + o + '" fill="#FFFBEF" opacity="0.07" d="M' + x + "," + (wy + 2) + " L" + (x + w) + "," + (wy + 2) + " L" + (x + w * 1.5 - 70) + ",1316 L" + (x - 90 - w * 0.4) + ',1316 Z"/>';
  });
  layer("apron",
    '<path class="f-earth2" d="M-10,' + (bk - 2) + " L1090," + (bk - 2) + ' L1090,1360 L-10,1360 Z"/>' +
    '<path class="wv f-water3" d="' + wave + ' L1220,1360 L-140,1360 Z"/>' +
    '<path class="f-water2" d="M-10,' + (wy + 60) + " C200," + (wy + 40) + " 420," + (wy + 86) + " 640," + (wy + 62) + " C820," + (wy + 44) + " 960," + (wy + 80) + " 1090," + (wy + 58) + ' L1090,1360 L-10,1360 Z" opacity="0.55"/>' +
    '<g id="shafts">' + shafts + "</g>" +
    '<path class="f-sand" d="M-10,1312 C150,1296 320,1322 520,1306 C720,1292 900,1320 1090,1300 L1090,1360 L-10,1360 Z"/>' + pebbles +
    '<g id="plants">' + plants + "</g>" +
    '<g id="aqua"></g>' +
    '<path class="wv f-water" opacity="0.1" d="' + wave + ' L1220,1360 L-140,1360 Z"/>' +
    '<path class="wv s-foam" stroke-width="4" fill="none" stroke-linecap="round" d="' + wave + '" opacity="0.9"/>' +
    '<g id="splash"></g>' +
    '<path class="f-earth" d="M-10,' + (bk - 4) + " L1090," + (bk - 4) + " L1090," + (bk + 20) + " C900," + (bk + 12) + " 700," + (bk + 26) + " 540," + (bk + 18) + " C360," + (bk + 10) + " 180," + (bk + 26) + " -10," + (bk + 16) + ' Z"/>' +
    '<path class="f-meadow3" d="' + lip + '"/>' + liptufts);

  layer("fx");
  return L;
}
