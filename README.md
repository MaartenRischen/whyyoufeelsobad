# whyyoufeelsobad.com

The personal way in to Demismatch. Plain static files, served from the repo root (GitHub Pages, branch main).
The domain is set in `CNAME`.

Since 24 Nov 2026 the home page is the humans-first page (Maarten: "Put this online"):

- `index.html`, `first.css`, `first.js` the home page. Written by `build_humans_first.py` together with
  `wyfsb_literal.py` (Claude project docs `claude/builders/wyfsb-humans-first-build.py` and
  `claude/builders/wyfsb-literal.py`): `python3 build_humans_first.py <this repo>`. It builds from the
  animals-first page that was live from 21 to 24 Nov 2026 (kept as `mock/humans-first/source-animals-first.html`)
  and from the loop library. `mock/README.md` lists every round.
- `page.css` is still used by the home page. `page.js` is used by nothing live any more; `first.js` is made from it.
- `library/` the loop library (live copy of `mock/library/`), linked from the home page's last tiles

Do not edit these by hand. WARNING: `wyfsb/publish.py` in the workspace repo copies `mock/page/` over `index.html`.
That puts the old animals-first page back. Do not run it for the home page until `wyfsb/page2/build.py` has been
taught the humans-first page. The library part of it (`wyfsb/library/build.py`) is not affected.

`mock/` keeps the previews and the older design rounds (its README lists them). Every page there carries
`noindex,nofollow`. The home page before 21 Nov 2026 (the tiles) is in git history; `style.css` belonged to it.

`look.css` is the one look for every Demismatch site (colours, typefaces, text sizes, the top bar, the Cor banner,
the foot). It is a copy. Change the master, never this copy.
