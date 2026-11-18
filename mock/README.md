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
- `fonts/` Montserrat, Archivo Black, Space Mono (SIL Open Font License, texts alongside)

The pictures are drawn live from code: `film.draw(seconds)`. There are no video files.
Work log: `wyfsb/design-log.md` in the workspace repo.
