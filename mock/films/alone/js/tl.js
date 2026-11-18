/* tl.js - the words and their timing for the human film ("lonely").
   Words: Open Brain thought 4822, step 9, word for word (Maarten with claude-web, 18 Nov 2026).
   Reading rule from the brief, as in ADHD v9: 0.4 s to find the label + 20 characters a second, min 1.3 s. */
const FPS = 30;
const rd = (s) => Math.max(1.3, 0.4 + s.length / 20);
const KEY = "alone", NAME = "HUMAN";

const TEXT = [
  "A human needs other humans to survive.",
  "So being alone feels bad.",
  "So the human goes to the others.",
  "They welcome the human.",
  "Being with the others feels good.",
  "Now the human lives alone in a flat.",
  "The human still needs other humans.",
  "Being alone still feels bad.",
  "So the human still looks for the others.",
  "Nobody is there.",
  "The bad feeling never stops.",
  "“I'm lonely.”"];
/* null and not last: the change (dark label). The last one is the human's own words (speech label). */
const NUM = ["1", "2", "3", "4", "5", null, "1", "2", "3", "4", "5", null];
/* extra time a label stays up because its action needs it (the reading rule is the minimum):
   0 the food is handed over and eaten, the fire burns low (2.3 s); 1 the walk out, the wood, the look round (3.6 s);
   2 the way back (2.0 s); 3 the wood changes hands, the hug, wood on the fire, the walk to it (2.9 s);
   4 sitting down, leaning (1.3 s) and a rest; 5 wall, floor, front, chair, table, lamp (3.3 s);
   8 window, then door (3.9 s); 9 the open door, and closing it (2.4 s); 10 back to the chair and
   one day passing in the window (4.6 s); 11 a hold on the words. */
const HOLD = [0.8, 2.1, 0.7, 1.5, 1.4, 1.4, 0.3, 0.7, 1.7, 1.6, 3.2, 1.2];
const LEAD = 0.8;
const BEATS = [];
(function () {
  let s = LEAD;
  TEXT.forEach((line, i) => { const e = s + rd(line) + HOLD[i]; BEATS.push([s, e]); s = e; });
  window.END = Math.round((s + 1.0) * FPS) / FPS;
})();

/* key moments, shared by the picture (seq_alone.js) and the sound (sound/make_sfx.py via sound/events.cjs) */
const HK = (function () {
  const H = BEATS.map((b) => b[0]);
  const C = H[5];
  return {
    H,
    giveT: H[0] + 0.4, biteT: H[0] + 0.92, dipT: H[0] + 1.2, upT: H[0] + 1.9, walkT: H[0] + 2.3, arriveT: H[0] + 4.7, pickT: H[0] + 5.12,
    lookT: H[0] + 5.55,
    turnT: H[2] + 0.12, backT: H[2] + 0.3, stopT: H[2] + 1.9,
    seeT: H[2] + 1.35, takeT: H[2] + 2.15, kidT: H[2] + 1.9, hugT: H[3] + 0.1, woodT: H[3] + 0.95, moveT: H[3] + 1.7,
    sitT: H[4] - 0.2, leanT: H[4] + 0.5,
    wallT: C + 0.5, floorT: C + 0.95, frontT: C + 1.75, chairT: C + 2.2, tableT: C + 2.5, lampT: C + 2.8, onT: C + 3.1,
    up2T: H[8] + 0.2, toWinT: H[8] + 0.5, winT: H[8] + 1.15, toDoorT: H[8] + 2.25, doorT: H[8] + 3.25, openT: H[9] - 0.3,
    closeT: H[9] + 2.0, back2T: H[9] + 2.5, sit2T: H[10] + 0.55, slumpT: H[10] + 1.1, dayT: H[10] + 1.3, nightT: H[10] + 3.1,
    sayT: H[11] + 0.12,
  };
})();
