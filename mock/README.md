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

The pictures are drawn live from code: `film.draw(seconds)`. There are no video files.
Work log: `wyfsb/design-log.md` in the workspace repo.
