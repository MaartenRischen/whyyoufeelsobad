/* tl.js - the words and their timing for the ADHD animal intro.
   Reading rule from the brief: 0.4 s to find the label + 20 characters a second, min 1.3 s. */
const FPS = 30;
const rd = (s) => Math.max(1.3, 0.4 + s.length / 20);

/* v9: voice 3, "same words twice": after the change the same sentence comes back word for word. */
const TEXT = {
  fish: ["A stickleback attacks red.",
    "The red rival leaves.",
    "Now there is a red block.",
    "A stickleback attacks red.",
    "The red block stays."],
  beetle: ["A dung beetle steers by light.",
    "Starlight. It rolls straight.",
    "Now there are street lights.",
    "A dung beetle steers by light.",
    "Lamplight. It rolls to the lamp."],
  toad: ["Each spring a toad walks home.",
    "It reaches its pond and breeds.",
    "Now there is a road.",
    "Each spring a toad walks home.",
    "It reaches the road."],
  monkeys: ["A baby monkey needs to cling.",
    "It clings to its mother. It feels safe.",
    "Now there is a cloth dummy.",
    "A baby monkey needs to cling.",
    "It clings to the cloth."],
};
const NUM = ["1", "2", null, "3", "4"];
/* the human child. v9: voice 3, "same words twice" (Maarten, 17 Nov 2026). Source: ../voice/voices.json */
const HTEXT = ["Human children learn by moving, exploring and playing together.",
  "Sitting still for long feels bad.",
  "So the child gets up.",
  "It plays with the others for hours.",
  "It is worn out and calm.",
  "Now there is a desk. Six hours a day.",
  "Human children learn by moving, exploring and playing together.",
  "Sitting still for long feels bad.",
  "So the child gets up.",
  "It is told to sit down.",
  "It is restless all day."];
const HNUM = ["1", "2", "3", "4", "5", null, "1", "2", "3", "4", "5"];
/* extra time on a label because its action needs it.
   v9: the lines at 2, 8, 9 and 10 got shorter, and their action did not: getting up, running and the tag
   (1.75 s), the walk to the window (2.2 s), sitting back down (2.3 s), and the last hold with the clock
   reaching 3:00 (4.4 s). Their holds are raised so each beat is at least as long as it was in v8. */
const HHOLD = [0, 0.3, 1.15, 2.4, 1.1, 0.9, 0.2, 0.5, 1.5, 1.55, 3.2];
const ORDER = ["fish", "beetle", "toad", "monkeys"];
const SPECIES = { fish: "THREE-SPINED STICKLEBACK", beetle: "DUNG BEETLE", toad: "COMMON TOAD", monkeys: "RHESUS MACAQUE", human: "HUMAN" };

/* feeling per beat: [colour, strength] at the END of the beat. A summary only: the picture uses the
   per-animal tracks in finale.js, which also carry the rules. v5: in the changed world the animal
   feels what its mechanism reads (the lamp feels better than the stars), not what the viewer knows. */
const FEEL = {
  fish: [["red", 0.5], ["green", 0.7], ["red", 0.45], ["red", 0.9], ["red", 1]],
  beetle: [["green", 0.3], ["green", 0.55], ["green", 0.8], ["green", 1], ["red", 0.95]],
  toad: [["green", 0.35], ["green", 0.85], ["green", 0.15], ["green", 0.5], ["red", 0.9]],
  monkeys: [["red", 0.55], ["green", 0.75], ["red", 0.8], ["red", 0.7], ["red", 0.65]],
};

const GAP = 1.5, LEAD = 0.8;
/* extra time a label stays up because its action needs it (the reading rule is the minimum) */
const HOLD = { fish: [0, 0, 0, 0, 0.6], beetle: [0, 0, 0, 0, 0.8], toad: [0, 0, 0, 0, 0.9], monkeys: [0, 0.35, 0, 0, 1.15] };
const BEATS = {}, MOVE = {};
(function () {
  let t = 0.4;
  for (const an of ORDER) {
    const z0 = t, z1 = t + (an === "fish" ? 1.2 : GAP);
    MOVE[an] = [z0, z1];
    let s = an === "fish" ? 0.8 : z1 - LEAD;
    const beats = [];
    TEXT[an].forEach((line, i) => { const e = s + rd(line) + HOLD[an][i]; beats.push([s, e]); s = e; });
    BEATS[an] = beats;
    t = s;
  }
  /* 5. the human child: ten beats and the change, at the fuller pace. The camera travels east to it. */
  window.HMOVE = [t, t + 2.8];
  let s = HMOVE[1] - LEAD;
  const hb = [];
  HTEXT.forEach((line, i) => { const e = s + rd(line) + HHOLD[i]; hb.push([s, e]); s = e; });
  window.HBEATS = hb;
  window.OUT_MOVE = [s + 100, s + 102];   /* v6: no wide pull-out, the film goes on to the human */
  window.END = Math.round((s + 1.0) * FPS) / FPS;
})();
const bt = (an, i) => BEATS[an][i][0];

/* key moments, shared by the picture (film.js) and the sound (sound/make_sfx.py via sound/events.cjs) */
const K = (function () {
  const F = BEATS.fish.map((b) => b[0]), B = BEATS.beetle.map((b) => b[0]), T = BEATS.toad.map((b) => b[0]), M = BEATS.monkeys.map((b) => b[0]);
  const HITS = [F[3] + 0.6, F[3] + 1.15, F[4] + 0.25, F[4] + 0.65, F[4] + 0.98, F[4] + 1.25, F[4] + 1.48, F[4] + 1.68, F[4] + 1.85, F[4] + 2.0];
  for (let t = HITS[HITS.length - 1] + 0.14; t < F[4] + 2.9; t += 0.14) HITS.push(t);
  for (let t = HITS[HITS.length - 1] + 0.3; t < HMOVE[1] + 1; t += 0.42) HITS.push(t);
  const car1T = T[4] + 1.2, car2T = MOVE.monkeys[0] + 0.4;
  return {
    F, B, T, M, HITS,
    N0: MOVE.beetle[0] + 0.3, N1: MOVE.toad[0] + 0.3,
    hitT: F[1] + 0.5, dropT: F[2] + 0.4,
    stopT: B[3] + 0.1, goT: B[3] + 0.55, crashT: B[4] + 0.85, arrive: [0.08, 0.0, 0.13, 0.04, 0.17],
    plopT: T[1] + 1.15,
    car1T, hit1: car1T + 0.55 * (1320 - 512) / 1640, car2T, hit2: car2T + 0.55 * (548 + 340) / 1640,
  };
})();

/* key moments of the human chain, shared by the picture (seq_human.js) and the sound */
const HK = (function () {
  const H = HBEATS.map((b) => b[0]);
  return {
    H,
    upT: H[2] + 0.2, runT: H[2] + 0.62, tagT: H[2] + 1.75,
    grabT: H[3] + 1.5, landT: H[3] + 3.25, flopT: H[4] + 0.75,
    floorT: H[5] + 0.12, wallT: H[5] + 0.95, chairT: H[5] + 1.3, deskT: H[5] + 1.62, boardT: H[5] + 2.0, clockT: H[5] + 2.35,
    lookT: H[6] + 1.0, offT: H[8] + 1.0, winT: H[8] + 2.2, toldT: H[9] + 0.15, backT: H[9] + 0.85, sitT: H[9] + 2.3, stillT: H[10] + 1.7,
  };
})();
