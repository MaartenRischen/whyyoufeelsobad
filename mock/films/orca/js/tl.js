/* tl.js - the words and their timing for the orca film.
   Words: Open Brain thought 4840, word for word (shorter lines by claude-web on Maarten's "I think the
   lines can be shorter too", 18 Nov 2026). They replace steps 5 and 6 of thought 4822.
   Version 2 (dispatch 4839): the film does the job of an animated diagram. A label stays for as long
   as it takes to read it and no longer: 0.15 s to find it + 28 characters a second. With two and
   three word labels the limit is the picture, not the reading: no label is up for less than 0.8 s,
   the least time an action gets to be seen.
   (v1 and the ADHD film: 0.4 s + 20 characters a second, plus time for the action.) */
const FPS = 30;
const rd = (s) => Math.max(0.8, 0.15 + s.length / 28);
const KEY = "orca", NAME = "ORCA";

const TEXT = [
  "An orca needs its family to survive.",
  "Apart, it feels bad.",
  "So it calls.",
  "They answer.",
  "It feels good.",
  "Now it lives in a tank.",
  "It still needs its family.",
  "Apart, it still feels bad.",
  "So it still calls.",
  "Nobody answers.",
  "The bad feeling never stops."];
const NUM = ["1", "2", "3", "4", "5", null, "1", "2", "3", "4", "5"];
/* the action has to fit the label, so there is no extra time on any of them */
const LEAD = 0.15, TAIL = 0.4;
const BEATS = [];
(function () {
  let s = LEAD;
  TEXT.forEach((line) => { const e = s + rd(line); BEATS.push([s, e]); s = e; });
  window.END = Math.round((s + TAIL) * FPS) / FPS;
})();

/* key moments of the picture (seq_orca.js) */
const K = (function () {
  const B = BEATS.map((b) => b[0]);
  const chaseT = B[0] + 0.55;                      /* it goes after a salmon */
  const snapT = chaseT + 0.55;
  const lostT = B[1] - 0.08;                        /* it turns round: nobody */
  const calls = [B[2] + 0.06, B[2] + 0.36];
  const replies = [B[3], B[3] + 0.1];
  const hearT = B[3] + 0.18;                        /* the first answer reaches it */
  const goT = B[3] + 0.26, meetT = B[4] + 0.08;
  const floorT = B[5] + 0.02, wallRT = B[5] + 0.42, wallLT = B[5] + 0.66, poolT = B[5] + 0.45, backT = B[5] + 0.55;
  const noseT = B[6] + 0.5;                         /* its nose at the wall where they were */
  const tcalls = [B[8] + 0.14, B[8] + 0.44];
  return { B, chaseT, snapT, lostT, calls, replies, hearT, goT, meetT, floorT, wallRT, wallLT, poolT, backT, noseT, tcalls };
})();
