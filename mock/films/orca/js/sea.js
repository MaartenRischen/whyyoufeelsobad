/* sea.js - the one world of the orca film, built as layered cut paper: a strait, cut open.
   World units = frame pixels at the wide. The world is 2400 wide; the camera sees 1080 of it.
   Every colour has two values: the sea, and the tank that is put down in the same place. */
const P2 = (name, a, b) => pal(name, a, b || a);
P2("sky", "#F6ECD4");
P2("cloud", "#FFFAF0");
P2("sun", "#F0B93A");
P2("islfar", "#BFD0B4");
P2("islmid", "#96B48E");
P2("pine", "#3E7248");
P2("pine2", "#2B5A3D");
P2("sea1", "#4FA9AE", "#93DAE2");
P2("sea2", "#2F8794", "#84D2DD");
P2("sea3", "#1E6C7E", "#78CAD8");
P2("sea4", "#165768", "#70C4D4");
P2("sea5", "#104556", "#6BC0D1");
P2("foam", "#E4F3EA", "#F2FBF8");
P2("sand", "#C9B68A");
P2("sand2", "#A8956C");
P2("rock", "#5A6A72");
P2("rock2", "#46545C");
P2("kelp", "#6B8A3C");
P2("kelp2", "#8A9C42");
P2("kelp3", "#44663A");
P2("conc", "#CFD0CA");
P2("conc2", "#B2B4AE");
P2("conc3", "#E2E3DC");
P2("conc4", "#9A9D98");
P2("pback", "#BCC8CB");
P2("pback2", "#A6B4B8");
P2("stripe", "#2F7FA8");
P2("steel", "#6C7480");
P2("ok", "#262733");
P2("ok2", "#3A3C52");
P2("ow", "#F5F1E4");
P2("ow2", "#DDD8C8");
P2("og", "#8B90A6");
P2("tongue", "#E8776A");
P2("salmon", "#C4CFD3");
P2("salmon2", "#8FA3AD");
P2("red", "#E4472D");
P2("cream", "#F7F0DE");
P2("ink", "#22202E");
P2("brass", "#D8A93B");
P2("brass2", "#F6DD8C");
P2("shadow", "#22202E");

const WORLD_W = 2400;
const SEA = {
  wy: 300,                     /* the water line */
  floor: 1232,                 /* the sea bed */
  tank: [960, 1920, 1150],     /* the tank: inner left, inner right, floor */
  rim: 258,                    /* the top of the tank wall, a little over the water */
};

function buildSea(cam) {
  const R = rng(23);
  const L = {};
  const layer = (name, str) => (L[name] = G(str || "", cam, "ly-" + name));
  const WY = SEA.wy, FL = SEA.floor, [TX0, TX1, TFL] = SEA.tank, RIM = SEA.rim;

  /* ---- sky: it moves less than the water when the camera travels ---- */
  const cloud = (x, y, s) => '<g class="cloud" data-x="' + x + '" data-y="' + y + '" data-s="' + s + '"><path class="f-cloud" d="M-70,0 a26,26 0 0 1 24,-30 a34,34 0 0 1 62,-12 a26,26 0 0 1 44,16 a20,20 0 0 1 8,26 Z"/></g>';
  layer("sky",
    '<rect x="-200" y="-20" width="2900" height="' + (WY + 40) + '" class="f-sky"/>' +
    '<g id="sun" transform="translate(760 120)"><circle r="70" class="f-sun" opacity="0.22"/><circle r="47" class="f-sun"/></g>' +
    cloud(210, 96, 1.1) + cloud(930, 150, 0.8) + cloud(1380, 70, 1.0) + cloud(1840, 140, 0.75));
  /* ---- islands on the horizon, with firs ---- */
  let firs = "";
  const fir = (x, y, h, c) => '<path class="f-' + c + '" d="M' + f1(x) + "," + f1(y - h) + " L" + f1(x + h * 0.26) + "," + f1(y) + " L" + f1(x - h * 0.26) + "," + f1(y) + ' Z"/>';
  const ridge = (x) => 236 - 34 * Math.pow(Math.sin((x + 140) * 0.0034), 2) - 16 * Math.pow(Math.sin(x * 0.0091 + 1), 2);
  for (let x = -60; x < 2700; x += 9 + R() * 16) { const yy = ridge(x) + 6; if (yy < 228) firs += fir(x, yy, 16 + R() * 20, R() < 0.5 ? "pine" : "pine2"); }
  let far = "M-200," + (WY + 10), mid = "M-200," + (WY + 10);
  for (let x = -200; x <= 2700; x += 30) { far += " L" + x + "," + f1(214 - 30 * Math.pow(Math.sin(x * 0.0026 + 2), 2) - 12 * Math.sin(x * 0.011)); mid += " L" + x + "," + f1(ridge(x) + 8); }
  layer("isl", '<path class="f-islfar" d="' + far + " L2700," + (WY + 10) + ' Z"/><path class="f-islmid" d="' + mid + " L2700," + (WY + 10) + ' Z"/>' + firs);

  /* ---- the back wall of the tank, over the water (it comes up later) ---- */
  let seats = "";
  for (let r = 0; r < 4; r++) seats += '<rect x="' + (TX0 - 60) + '" y="' + (150 + r * 30) + '" width="' + (TX1 - TX0 + 120) + '" height="4" class="f-pback2" opacity="0.8"/>';
  layer("back", '<g id="tback"><rect x="' + (TX0 - 60) + '" y="118" width="' + (TX1 - TX0 + 120) + '" height="' + (WY - 118 + 30) + '" class="f-pback"/>' + seats +
    '<rect x="' + (TX0 - 60) + '" y="118" width="' + (TX1 - TX0 + 120) + '" height="9" class="f-conc3"/>' +
    '<rect x="' + (TX0 - 60) + '" y="' + (WY - 34) + '" width="' + (TX1 - TX0 + 120) + '" height="40" class="f-stripe"/></g>');

  /* ---- water: bands that get darker with depth ---- */
  const band = (y, a, ph) => { let d = "M-20," + y; for (let x = -20; x <= 2440; x += 80) d += " L" + x + "," + f1(y + a * Math.sin(x * 0.006 + ph)); return d + " L2440,1370 L-20,1370 Z"; };
  let shafts = "";
  for (let i = 0; i < 11; i++) {
    const x = 60 + i * 222 + R() * 60, w = 44 + R() * 34;
    shafts += '<path class="shaft" data-p="' + f1(i * 1.7) + '" data-o="' + f1(0.6 + R() * 0.4) + '" fill="#FFFBEF" opacity="0.07" d="M' + f1(x) + "," + (WY + 2) + " L" + f1(x + w) + "," + (WY + 2) + " L" + f1(x + w * 1.6 - 150) + "," + (FL + 20) + " L" + f1(x - 230 - w * 0.4) + "," + (FL + 20) + ' Z"/>';
  }
  layer("water",
    '<rect x="-20" y="' + WY + '" width="2460" height="1080" class="f-sea1"/>' +
    '<path class="f-sea2" d="' + band(500, 16, 0) + '"/><path class="f-sea3" d="' + band(720, 20, 2) + '"/><path class="f-sea4" d="' + band(940, 18, 4) + '"/><path class="f-sea5" d="' + band(1130, 14, 1) + '"/>' +
    '<g id="shafts">' + shafts + "</g>");

  /* ---- the tank's own back wall, under water: tiles. Faded in with the walls. ---- */
  let tiles = "";
  for (let x = TX0 + 80; x < TX1; x += 80) tiles += '<path stroke="#FFFFFF" stroke-width="2" opacity="0.2" d="M' + x + "," + WY + " L" + x + "," + TFL + '"/>';
  for (let y = WY + 85; y < TFL; y += 85) tiles += '<path stroke="#FFFFFF" stroke-width="2" opacity="0.2" d="M' + TX0 + "," + y + " L" + TX1 + "," + y + '"/>';
  layer("tiles", '<g id="ttiles" opacity="0">' + tiles +
    '<rect x="' + TX0 + '" y="' + WY + '" width="' + (TX1 - TX0) + '" height="46" class="f-stripe" opacity="0.55"/></g>');

  /* ---- the sea bed: far rocks, sand, rocks, kelp ---- */
  let bed = "M-20," + (FL + 6);
  for (let x = -20; x <= 2440; x += 60) bed += " L" + x + "," + f1(FL + 10 * Math.sin(x * 0.008) + 7 * Math.sin(x * 0.021 + 1));
  bed += " L2440,1370 L-20,1370 Z";
  let rocks = "", pebbles = "", farrock = "";
  [[150, 190, 150], [640, 150, 110], [1180, 230, 170], [1650, 170, 120], [2130, 240, 180]].forEach(([x, w, h]) => {
    farrock += '<path class="f-sea5" opacity="0.75" d="M' + (x - w) + "," + (FL + 10) + " C" + (x - w * 0.8) + "," + (FL - h * 0.7) + " " + (x - w * 0.3) + "," + (FL - h) + " " + x + "," + (FL - h * 0.92) + " C" + (x + w * 0.4) + "," + (FL - h * 1.05) + " " + (x + w * 0.85) + "," + (FL - h * 0.5) + " " + (x + w) + "," + (FL + 10) + ' Z"/>';
  });
  [[70, 70, 46], [420, 96, 60], [1020, 84, 52], [1560, 110, 66], [1980, 76, 48], [2300, 100, 62]].forEach(([x, w, h], i) => {
    rocks += '<path class="f-' + (i % 2 ? "rock" : "rock2") + '" d="M' + (x - w) + "," + (FL + 14) + " Q" + (x - w * 0.9) + "," + (FL - h * 0.8) + " " + (x - w * 0.2) + "," + (FL - h) + " Q" + (x + w * 0.7) + "," + (FL - h * 1.05) + " " + (x + w) + "," + (FL + 14) + ' Z"/>' +
      '<path stroke="#FFFBEF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.14" d="M' + (x - w * 0.6) + "," + (FL - h * 0.62) + " Q" + (x - w * 0.2) + "," + (FL - h * 0.9) + " " + (x + w * 0.3) + "," + (FL - h * 0.84) + '"/>';
  });
  for (let i = 0; i < 60; i++) pebbles += '<ellipse cx="' + f1(R() * WORLD_W) + '" cy="' + f1(FL + 30 + R() * 80) + '" rx="' + f1(7 + R() * 14) + '" ry="' + f1(4 + R() * 6) + '" class="f-sand2" opacity="0.7"/>';
  /* kelp: a stalk with blades, pinned at the bed, swaying */
  let kelp = "";
  const stalk = (x, h, s, c, p, dx) => {
    let d = "M0,0", b = "";
    const n = Math.round(h / 60);
    for (let i = 1; i <= n; i++) { const y = -i * 60, o = (i % 2 ? 1 : -1) * 12; d += " Q" + o + "," + (y + 30) + " 0," + y; b += '<path class="f-' + c + '" d="M0,' + (y + 24) + " q" + (i % 2 ? 46 : -46) + ",-14 " + (i % 2 ? 62 : -62) + ",-44 q" + (i % 2 ? -44 : 44) + ",6 " + (i % 2 ? -62 : 62) + ',44 Z"/>'; }
    return '<g class="kelp" data-x="' + x + '" data-s="' + s + '" data-p="' + f1(p) + '" data-k="' + f1(dx) + '"><path class="s-' + c + '" stroke-width="7" stroke-linecap="round" fill="none" d="' + d + '"/>' + b + '<circle cx="0" cy="' + (-n * 60 - 8) + '" r="9" class="f-' + c + '"/></g>';
  };
  const KX = [[40, 420, 1], [110, 560, 1.1], [190, 360, 0.9], [270, 480, 1], [690, 300, 0.9], [770, 420, 1], [850, 340, 0.85],
    [1260, 300, 0.9], [1340, 380, 1], [1420, 260, 0.85], [1700, 240, 0.8], [1790, 320, 0.9],
    [2080, 420, 1], [2160, 540, 1.1], [2250, 380, 0.9], [2330, 480, 1]];
  KX.forEach(([x, h, s], i) => { kelp += stalk(x, h, s, ["kelp", "kelp3", "kelp2"][i % 3], i * 1.37, 0.7 + R() * 0.6); });
  layer("bed", farrock + '<g id="kelpG">' + kelp + '</g><path class="f-sand" d="' + bed + '"/>' + pebbles + rocks);

  layer("aqua");               /* the orcas and the fish. No transform on this group: the glow reads their own. */
  layer("fx");                 /* calls, bubbles, specks */

  /* ---- the water line ---- */
  let wave = "M-140," + WY;
  for (let x = -140; x <= 2540; x += 60) wave += " q15,-7 30,0 t30,0";
  layer("top",
    '<path class="wv f-sea1" opacity="0.16" d="' + wave + ' L2560,1370 L-160,1370 Z"/>' +
    '<path class="wv s-foam" stroke-width="4" fill="none" stroke-linecap="round" d="' + wave + '" opacity="0.9"/><g id="splash"></g>');

  /* ---- the tank: a floor and two walls of cut concrete. They are put down later. ---- */
  const grit = (x0, y0, x1, y1, n) => { let s = ""; for (let i = 0; i < n; i++) s += '<circle cx="' + f1(lerp(x0, x1, R())) + '" cy="' + f1(lerp(y0, y1, R())) + '" r="' + f1(1.5 + R() * 3) + '" class="f-' + (R() < 0.5 ? "conc2" : "conc3") + '" opacity="0.7"/>'; return s; };
  const rail = (x0, x1) => { let s = '<path class="s-steel" stroke-width="5" stroke-linecap="round" fill="none" d="M' + x0 + "," + (RIM - 56) + " L" + x1 + "," + (RIM - 56) + " M" + x0 + "," + (RIM - 30) + " L" + x1 + "," + (RIM - 30) + '"/>'; for (let x = x0; x <= x1; x += 74) s += '<path class="s-steel" stroke-width="5" stroke-linecap="round" d="M' + x + "," + RIM + " L" + x + "," + (RIM - 56) + '"/>'; return s; };
  layer("slabs",
    '<g id="slabF"><rect x="300" y="' + TFL + '" width="2200" height="260" class="f-conc"/>' + grit(300, TFL + 20, 2400, 1350, 150) +
    '<rect x="300" y="' + TFL + '" width="2200" height="10" class="f-conc3"/>' +
    '<rect x="1404" y="' + (TFL - 5) + '" width="72" height="9" rx="2" class="f-steel"/><path class="s-ink" stroke-width="1.6" opacity="0.5" d="M1416,' + (TFL - 5) + " l0,9 M1428," + (TFL - 5) + " l0,9 M1440," + (TFL - 5) + " l0,9 M1452," + (TFL - 5) + " l0,9 M1464," + (TFL - 5) + ' l0,9"/></g>' +
    '<g id="slabR"><rect x="' + TX1 + '" y="' + RIM + '" width="560" height="1120" class="f-conc"/>' + grit(TX1 + 16, RIM + 20, 2400, 1350, 90) +
    '<rect x="' + TX1 + '" y="' + RIM + '" width="12" height="1120" class="f-conc2"/><rect x="' + (TX1 - 8) + '" y="' + RIM + '" width="576" height="12" rx="3" class="f-conc3"/>' + rail(TX1 + 34, 2400) + "</g>" +
    '<g id="slabL"><rect x="400" y="' + RIM + '" width="' + (TX0 - 400) + '" height="1120" class="f-conc"/>' + grit(400, RIM + 20, TX0 - 16, 1350, 90) +
    '<rect x="' + (TX0 - 12) + '" y="' + RIM + '" width="12" height="1120" class="f-conc2"/><rect x="392" y="' + RIM + '" width="' + (TX0 - 392 + 8) + '" height="12" rx="3" class="f-conc3"/>' + rail(410, TX0 - 34) +
    /* a ladder nobody in here can use */
    '<path class="s-steel" stroke-width="5" stroke-linecap="round" fill="none" d="M' + (TX0 + 9) + "," + (RIM - 34) + " L" + (TX0 + 9) + "," + (WY + 150) + " M" + (TX0 + 9) + "," + (RIM - 34) + " Q" + (TX0 + 9) + "," + (RIM - 52) + " " + (TX0 - 14) + "," + (RIM - 52) + '"/>' +
    [0, 1, 2, 3].map((i) => '<path class="s-steel" stroke-width="4" stroke-linecap="round" d="M' + (TX0 + 1) + "," + (WY + 20 + i * 38) + " L" + (TX0 + 9) + "," + (WY + 20 + i * 38) + '"/>').join("") + "</g>");
  layer("fxtop");
  return L;
}
