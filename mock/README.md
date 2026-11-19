# mock/ - design mock-ups, not part of the live site

Three directions for whyyoufeelsobad.com as a scroll-driven page (Open Brain thought 4803, 18 Nov 2026).
Not linked from the homepage. Every page carries `noindex,nofollow`.

- `a/` the film is the page (one pinned stage, the film plays to where the scroll is)
- `b/` the film is inside the words (film behind a black plate with the sentence cut out)
- `c/` same words, two worlds (two looping pictures, one sentence, snap steps)
- `film/` web copy of the coded film from the workspace repo, `mismatch-series/coded/js` (v9).
  Three small changes, each marked "web copy" in the code: labels can be HTML already in the page
  (`finale.js`), a page can ask for a fixed camera view (`stage.js`), and the film reports the
  strongest feeling in the frame and keeps labels inside a cropped picture (`finale.js`).
- `shared.js` puts the film on a page and decides which moment is drawn
- `films/` the two films for the opening (Open Brain thoughts 4823, 4839 and 4840, 18 Nov 2026; version 3,
  about 11 and 14 seconds), each drawn live:
  - `films/orca/` the orca, in the sea and then in a tank (workspace `mismatch-series/coded-orca/js`)
  - `films/alone/` the human, with the others and then alone in a flat (workspace `mismatch-series/coded-lonely/js`)
  Each has `js/` (a plain copy of the film's code, nothing patched), `embed.html` (the stage for a
  frame: `frame.contentWindow.__film.draw(seconds)`), `index.html` (a test player: it starts by itself, loops, and can
  play the film at two other lengths). No sound anywhere (Maarten, 18 Nov 2026: no sound in any
  film, ever). `films/film.css` is shared. `__film` gives `KEY`, `NAME`, `END`, `BEATS`,
  `TEXT`, `NUM`, `draw`, `cam`. A page that already holds the lines as HTML marks them
  `data-lab="orca-0"`, `data-lab="alone-0"` and so on inside `#labels`, and the film uses those
  elements. `window.__view = [x, y, width]` fixes the camera, `window.__inset` keeps labels inside
  a cropped picture, `window.__feel` reports the strongest feeling in the frame.
- `fonts/` Montserrat, Archivo Black, Space Mono (SIL Open Font License, texts alongside)

## page/ - the whole page as one preview (Open Brain thought 4892, 19 Nov 2026)

`page/` is the full page in the order of `wyfsb/page-script.md`, with self-playing loops. It replaces
directions a, b and c, which stay here only as a record. Address: /mock/page/ (unlinked, noindex).

- `page/index.html` is built by `wyfsb/page1/build.py` in the workspace repo. Do not edit it by hand:
  change the words in `build.py` and run it.
- `page/page.js` runs the loops: one line at a time, 0.15 s + 1 s per 28 characters, never under
  0.8 s; a loop starts when it comes on screen and repeats. No sound, no controls, nothing reads
  the scroll position.
- `page/loops/*.mp4` are the four loops cut from the two films (orca in the sea, orca in a tank, human
  with the others, human alone in a flat), rendered from the films' own code by
  `wyfsb/page1/render-loops.mjs`. They have no sound track. Render them again when a film or one of
  those lines changes. Drawing the films live was too slow with two or three on one screen (the
  feeling glow is an SVG blur), so the live drawing is now the fallback: it is used when the browser
  refuses to start a video, with reduced motion (one still), and with `?live=1`.
- Films that are not made yet are flat colour blocks with the subject's name and their lines.

## pairs/ - six ways to get from part 1 of a pair to part 2 (Open Brain thought 4915, 19 Nov 2026)

Maarten, after seeing two loops of one story run at the same time on `page/`: "Can't be at the same
time." `pairs/` is one reusable part with six behaviours to choose from. Address: /mock/pairs/
(chooser), `a/` to `f/`. Rule in all of them: one loop on the whole page moves at a time; every other
loop is a still with one readable line.

- `pairs/index.html` and `a/` to `f/` are built by `wyfsb/pairs/build.py` in the workspace repo. The
  loop lines come from `wyfsb/page1/build.py`. Do not edit the pages by hand.
- `pairs/pairs.js` is the part: `<section class="pair" data-mode="a..f">` with two `<figure class="loop">`.
  a, b: the loop nearest the middle of the screen plays. c: one frame, part 1, cut card, part 2, with a
  two-bar marker and tap to jump. d: taking turns. e: line by line in turns. f: the change line is a button.
- `pairs/stills/` are the pictures a loop shows while it stands still, cut from `page/loops/*.mp4` by
  `wyfsb/pairs/stills.sh`. The videos themselves are the ones in `page/loops/`.
- `page/` is not changed by this.

The pictures are drawn live from code: `film.draw(seconds)`. There are no video files.
Work log: `wyfsb/design-log.md` in the workspace repo.
