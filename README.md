# whyyoufeelsobad.com

The personal way in to Demismatch. Plain static files, served from the repo root (GitHub Pages, branch main).
The domain is set in `CNAME`.

Since 21 Nov 2026 the live site is the diagram page and the loop library that were previews under `mock/`:

- `index.html`, `page.css`, `page.js` the home page (live copy of `mock/page/`)
- `library/` the loop library (live copy of `mock/library/`), linked from the home page's last tiles

Do not edit these by hand. In the workspace repo: build the preview (`python3 wyfsb/page2/build.py <v>`,
`python3 wyfsb/library/build.py <v>`), look at it under /mock/, then run `python3 wyfsb/publish.py`, which copies
both to their live addresses, fixes the paths, takes `noindex` off and adds the head for search and link cards.

`mock/` keeps the previews and the older design rounds (its README lists them). Every page there carries
`noindex,nofollow`. The home page before 21 Nov 2026 (the tiles) is in git history; `style.css` belonged to it.

`look.css` is the one look for every Demismatch site (colours, typefaces, text sizes, the top bar, the Cor banner,
the foot). It is a copy. Change the master, never this copy.
