/* tl.js - the words and their timing for the human film ("lonely").
   Words: Open Brain thought 4822, step 9, word for word (Maarten with claude-web, 18 Nov 2026).
   Version 2 (dispatch 4839, Maarten: "it should go 2 to 4 times shorter", the film does the job of
   a GIF). Reading rule: 0.15 s to find the label + 28 characters a second, min 0.6 s. A beat is as
   long as its line takes to read and no longer: the action is fitted into the beat. */
const FPS = 30;
const rd = (s) => Math.max(0.6, 0.15 + s.length / 28);
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
const LEAD = 0.15;
const BEATS = [];
(function () {
  let s = LEAD;
  TEXT.forEach((line) => { const e = s + rd(line); BEATS.push([s, e]); s = e; });
  window.END = Math.round((s + 0.4) * FPS) / FPS;
})();

/* key moments of the picture (seq_alone.js) */
const HK = (function () {
  const H = BEATS.map((b) => b[0]);
  const C = H[5];
  return {
    H,
    /* 1: food is handed over, one bite, the fire burns low, it gets up and runs for wood */
    giveT: H[0] + 0.1, biteT: H[0] + 0.47, dipT: H[0] + 0.3, upT: H[0] + 0.68, walkT: H[0] + 0.93,
    /* 2: at the dead wood, alone */
    arriveT: H[1] + 0.12, pickT: H[1] + 0.24, lookT: H[1] + 0.47,
    /* 3: back */
    turnT: H[2] + 0.02, backT: H[2] + 0.1, stopT: H[2] + 0.98,
    /* 4: they see it, the wood changes hands, the little one holds on, wood on the fire, to the fire */
    seeT: H[2] + 0.7, takeT: H[2] + 1.16, kidT: H[2] + 1.0, hugT: H[3] + 0.08, woodT: H[3] + 0.48, moveT: H[3] + 0.62,
    /* 5: it sits among them */
    sitT: H[4] + 0.1, leanT: H[4] + 0.4,
    /* the change */
    wallT: C + 0.2, floorT: C + 0.3, frontT: C + 0.66, chairT: C + 0.8, tableT: C + 0.92, lampT: C + 1.02, onT: C + 1.22,
    /* 3 again: window, then door */
    up2T: H[8] + 0.02, toWinT: H[8] + 0.24, winT: H[8] + 0.48, toDoorT: H[8] + 0.85, doorT: H[8] + 1.15, openT: H[9] - 0.3,
    /* 4 and 5 again: the door shut, the chair, one day in the window */
    closeT: H[9] + 0.6, back2T: H[10] + 0.2, sit2T: H[10] + 0.5, slumpT: H[10] + 0.76, dayT: H[10] - 0.1, nightT: H[10] + 0.75,
    sayT: H[11] + 0.085,
  };
})();
