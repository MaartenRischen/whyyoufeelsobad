/* tl.js - the words and their timing for the orca film.
   Words: Open Brain thought 4822, steps 5 and 6, word for word (approved by Maarten, 18 Nov 2026).
   Reading rule of v9: 0.4 s to find the label + 20 characters a second, min 1.3 s. */
const FPS = 30;
const rd = (s) => Math.max(1.3, 0.4 + s.length / 20);
const KEY = "orca", NAME = "ORCA";

const TEXT = [
  "An orca needs its family to survive.",
  "So being apart from them feels bad.",
  "So it calls to them.",
  "They call back.",
  "Being back with them feels good.",
  "Now it lives in a tank.",
  "It still needs its family.",
  "Being apart still feels bad.",
  "So it still calls.",
  "Nobody calls back.",
  "The bad feeling never stops."];
const NUM = ["1", "2", "3", "4", "5", null, "1", "2", "3", "4", "5"];
/* extra time on a label because its action needs it (the reading rule is the minimum):
   0 the family together, then the salmon; 1 it turns round and they are gone; 2 three calls;
   3 the answer arrives and it swims to them; 4 the meeting, and a breath together;
   5 floor, two walls, the water; 6 to the wall where they were; 7 along the wall and back;
   8 three calls that end at the walls; 9 the wait; 10 round and round. */
const HOLD = [0.9, 1.0, 1.0, 1.6, 1.7, 1.9, 1.0, 0.9, 1.3, 1.9, 3.6];
const LEAD = 1.0;
const BEATS = [];
(function () {
  let s = LEAD;
  TEXT.forEach((line, i) => { const e = s + rd(line) + HOLD[i]; BEATS.push([s, e]); s = e; });
  window.END = Math.round((s + 1.0) * FPS) / FPS;
})();

/* key moments, shared by the picture (seq_orca.js) and the sound (sound/make_sfx.py via sound/events.cjs) */
const K = (function () {
  const B = BEATS.map((b) => b[0]);
  const chaseT = B[0] + 1.2;                       /* it goes after a salmon */
  const lostT = B[1] + 0.05;                        /* it turns round: nobody */
  const calls = [B[2] + 0.3, B[2] + 0.95, B[2] + 1.6];
  const replies = [B[3] + 0.12, B[3] + 0.42, B[3] + 0.8];
  const hearT = B[3] + 0.5;                         /* the first answer reaches it */
  const goT = B[3] + 1.05, meetT = B[4] + 0.35;
  const breathT = B[4] + 2.55;
  const floorT = B[5] + 0.12, wallRT = B[5] + 1.0, wallLT = B[5] + 1.45, poolT = B[5] + 1.8, backT = B[5] + 2.1;
  const noseT = B[6] + 1.45;                        /* its nose at the wall where they were */
  const tcalls = [B[8] + 0.3, B[8] + 0.95, B[8] + 1.6];
  const lastCall = B[9] + 1.9;
  const blows = [breathT, breathT + 0.12, breathT + 0.2];
  return { B, chaseT, lostT, calls, replies, hearT, goT, meetT, breathT, floorT, wallRT, wallLT, poolT, backT, noseT, tcalls, lastCall, blows };
})();
