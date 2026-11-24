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

## diagrams/ - the pair as a small diagram drawn in the page (Open Brain thought 4943, 19 Nov 2026)

Maarten, after the pair options: "something that looks like simplified gifs, maybe even without
background, that loop. More a diagram/illustration than a 'video' with a frame". `diagrams/` holds six
directions to choose from. Address: /mock/diagrams/ (chooser), `1/` to `6/`. No video, no image file,
no frame: every picture is SVG in the page, in ink, with red for the bad feeling and green for the
good one.

- The pages are built by `wyfsb/diagrams/build.py` in the workspace repo, which also holds the
  drawings and the words. Do not edit the pages by hand.
- `diagrams/diagrams.css` shows, draws, moves and colours the parts of a drawing according to
  `data-b` on the diagram (the beat). With no `data-b` a diagram is at rest: a complete still.
- `diagrams/diagrams.js` only counts beats. One diagram on the whole page moves at a time: the pair
  nearest the middle of the screen, part 1, then part 2, and round again. Without JavaScript and with
  reduced motion nothing runs and every diagram is its still.
- `page/` and `pairs/` are not changed by this.

The pictures are drawn live from code: `film.draw(seconds)`. There are no video files.
Work log: `wyfsb/design-log.md` in the workspace repo.

## loop/ - three pairs as one loop each (20 Nov 2026, a sample for the diagram library)

Address: /mock/loop/ (unlinked, noindex). The orca, the hatchling and "thirty and millions" from `page/`, each
as ONE loop: the world the figure is shaped for, then the change, then the mismatched world, with the figure in
the same place. The still is the mismatched world with the lost answer drawn faintly.

- `loop/index.html` and `loop/loop.css` are written by `wyfsb/page2/loops.py` in the workspace repo. Do not edit
  them by hand.
- The page loads `page/page.css` and `page/page.js` unchanged. The loops are rows of one `.dgrid`, so the runner
  gives them turns: one loop moves at a time.

## humans-first/ - the home page with humans first (hub chat, 23 Nov 2026)

Address: /mock/humans-first/ (unlinked, noindex). The live home page in another order, to compare with the
live one (the bar on top flips between the two). Maarten, 23 Nov 2026: "maybe it's much stronger to actually
start explaining the concept of mismatch, not with animals but with humans".

- Order: title and short answer; six humans from the library, each loop whole (its world, the change, the
  mismatched world); the name of the thing and one animal (the orca, both halves); "Six more animals" behind a fold (the four other animals
  of the grid, the hatchling, the bear); then the human loops with both halves, with the phone before the
  pike and porn before the oystercatcher; the rest of the live page unchanged.
- The first version showed only the mismatched half of the six opening loops. Maarten, 15:20: the version
  from before the mismatch has to be there "right at the start", "the only way to show what is really
  happening here in these diagrams". The six are loops the rest of the page does not show (anxious, sleep,
  eating, boss, crying baby, friends), so no drawing comes twice.
- No fact is added. The six opening loops keep the library's beats, readouts and captions (whole sentences of
  the library captions, with some left out). Their drawings are redrawn (`wyfsb_literal.py`, project doc
  `claude/builders/wyfsb-literal.py`). Maarten, 16:10, on the library drawings: "I was frowning before I
  understood it", "be much more literal", "it's not a bunch of bears on television. It's war and destruction",
  "too many thought steps". Rules of the redraw: a thing looks like the thing (a television with a stand and
  the word NEWS, a phone with a chat and a thumbs-up, a sleeper lying in a bed); one short word in the drawing
  where a shape alone could be read two ways (NEWS, WAR, BOSS, 3 AM, WAA, HA); nothing stands in for something
  else. The rest of the page and `library/` still have the older drawings.
- `humans-first/index.html`, `page.js` and `first.css` are written by `build_humans_first.py` (project doc
  `claude/builders/wyfsb-humans-first-build.py`), which reads the live `index.html` and `library/index.html`
  of this repo. Do not edit them by hand. The builder in the workspace repo (`wyfsb/page2/build.py`) does
  not know this order yet.
- No grid at any width (Maarten, 18:23: on a desktop "it's weird that they're in a grid but playing one by
  one", "just make em real big so it has the same effect; they start playing as soon as the user scrolls to
  them"). The six opening loops and the six animals in the fold stand one under the other, each a `.dpair.lone`
  in a `.stack`; on a wide screen the drawing is 760 px wide with its words beside it. The loop nearest the
  middle of the screen plays.
- Term labels (Maarten, 18:34: "clearly name and introduce with a nice clear label the terms as we use them,
  when you introduce them"). A card with "This is called", the term and one line, where the page first shows
  the thing: Evolutionary mismatch (after the six humans), Closed loop and Open loop (after the human in the
  flat), Proxy (at "Sometimes an answer does come, and it is a fake."), Hyperstimulus (at "Some fakes work
  better than the real thing."), EEA (before the camp). Proxy now names every fake answer, the office
  included, as in Cor ("a proxy is a 'solution' to empty shelf that isn't a solution", Open Brain 1570); the
  live page kept the word for fakes built on purpose. Lines changed for that: "The next proxy was built on
  purpose." and "The lure and the feed on your phone are proxies built on purpose."
- Copy pass (Maarten, 18:42: "this entire page could massively benefit from a strict no-ai-slop skill pass.
  it's pretty bad"). The list `PASS` in the builder holds every old and new sentence. Kinds of change: closing
  sayings turned into plain statements ("What that world had was answers." became "In that world a feeling got
  its answer."), stacks of short sentences joined where one depends on the other, captions put in the third
  person throughout, a caption and the line under it that said the same thing made one (the oystercatcher),
  "Here is one label from start to finish." replaced by a sentence that says something, term cards in whole
  sentences. Every claim, figure and condition is kept. Not touched: the lines Maarten wrote or approved one by
  one (title, short answer, "It is hard to see in yourself...", "Nobody thinks the orca is the problem.",
  "Humans are animals too...", "Your feelings are right.", "Humans need a world for humans.") and the block on
  disease and medication, apart from one sentence that repeated the next. The rules tile now says eighteen
  (the live rules page has eighteen).
- `humans-first/page.js` is the live `page.js` with two changes: a diagram with `data-from` starts on that
  beat, and a diagram inside a shut fold gets no turn.

**Fact cards (24 Nov 2026).** Maarten: "a distinctly differently graphically treated sprinkle of maybe mind-blowing
new facts, but very important pillars of our thinking", each "at the appropriate time". Eight dark cards (oxblood,
gold line "Most people don't know this", source line that opens the Cor finding), each placed after the loop it
belongs to: what a feeling is (Nesse, Cor 348) after the six humans; ties to other people and survival
(Holt-Lunstad, 463) after the lonely human; a media figure lifts mood and not loneliness (Stein, 1371) after the
phone; wanting and liking (Berridge and Robinson, 45) after porn; the ultra-processed food trial (Hall, 866) after
food; self-esteem as a measure of acceptance (Leary, 620) after "among thirty"; relatives and child survival
(Sear and Mace, 703) after the camp; bad feelings as protection (Nesse, 346) before "Your feelings are right."
Every text was checked against its Cor finding. A small study says in the card how many people or animals it had.
The two Nesse cards are his reading and carry his name. Dunbar's 150 is left out: Cor holds a challenge to it.

**Fact cards, second round (24 Nov 2026, 07:41).** Maarten: "They need their own little graphics for sure", and
green, not oxblood, "because it feels more eye-catching". Each card now has its own small drawing (a dial from bad
to good; one person alone and five together with +50%; a person on a phone with MOOD ticked and LONELINESS crossed;
a rat and a sweet drop with LIKES ticked and WANTS crossed; two bars with +500; an included and a left-out person
with a gauge each; a baby among mother and relatives; a thermometer equal to an anxious person). The card is dark
green (--teal-deep) with a gold label and gold marks. On a phone: label, drawing, text, source. On a desktop the
drawing stands left of the text. The drawings are written in the builder (P_FEELING and the rest).
