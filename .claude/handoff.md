# Handoff — Sassy Foodie / Chef Daija

**Working on:** New client site for Chef Daija, a West Philadelphia chef who cooks and sells her own food.

**Last action:** Priced the whole menu at Philadelphia market rates, rewrote the About page around the three-school / two-city / Japanese-and-jerk story, verified clean at 390 and 1440 through headless Comet, deployed and pushed.

**Next step:**
```bash
open docs/price-sheet.md   # get Daija to approve the 51 prices we set, and get the 2 missing school names
```

**Live:** https://sassy-foodie.pages.dev
**Repo:** https://github.com/Kaoz625/sassy-foodie (main, pushed, clean)

**Key files**
- `CLAUDE.md` — read first. Explains that `build.mjs` generates the HTML and that editing a `.html` directly gets erased.
- `DESIGN.md` — the design system, written before any screen. Concept is "The Scale".
- `build.mjs` — layout, nav, all page copy, menu/gallery renderers. `node build.mjs --dist` for a deployable folder.
- `data/menu.json`, `data/infusions.json`, `data/gallery.json`, `data/site.json` — all content.
- `docs/price-sheet.md` — **the thing Daija has to sign off.**
- `research/` — social-scrape.md, menu-extracted.md, captions.md (136 captions verbatim), viktor-oddy-video.md.
- `assets/raw/` — 425 original scraped files, ~735MB, gitignored. Never deploy this.

## Blockers — all need a human, none block the build

1. **51 prices are ours, not hers.** `docs/price-sheet.md` separates the 8 she published from the 51 we set at Philly market rates, and lists the 9 that moved off an old posted price. She has to approve before these are treated as final. The order flow already makes her confirm the total by text, so nobody can pay a wrong number in the meantime.
2. **Two culinary schools are unnamed.** Markus says three; the scrape only confirms Walnut Hill College. The About page says "three culinary schools" and names only Walnut Hill. Get the other two names.
3. **Phone number conflict.** Markus gave 267-616-0427 and that is what is on the site. Her own 2020 post says 267-977-2072. Confirm which is live.
4. **The infusion side is a business/legal call, not a design one.** Prices there are entirely ours. The page is age-gated and `noindex`. Cannabis is not recreationally legal in PA.
5. **"Shroom" items deliberately excluded.** Her deleted 2021 dessert menu sold a Shroom Chocolate Bar ($60/$40) and Shroom Hot Chocolate ($30). Those read as psilocybin and are not on the site. Flagged in `research/menu-extracted.md` section 4 and in the price sheet.

## Known, low priority

- Internal links use `.html`; Cloudflare Pages serves extensionless and 308-redirects `/menu.html` to `/menu`. Works fine, costs one cached redirect per page. Fix only if you also fix local preview.
- No custom domain yet. Add one via `wrangler pages` or the dashboard, then add a canonical tag.
- 115 of her videos are downloaded in `assets/raw/` and none are on the site yet. `data/gallery.json` already supports `{video, poster}` items.

## Gotchas that cost time this session

- **The `gh` keyring token is dead** (401 on REST and GraphQL). `GITHUB_PAT` is fine-grained and cannot create repos. Use `export GH_TOKEN="$GITHUB_API_KEY"` — the classic token.
- **Playwright `fullPage` screenshots lie on this site.** `backdrop-filter` on the sticky nav and the fixed order bar produce large blank bands, which look exactly like content that failed to render. Use `scroll-shots.mjs` (scrolled viewport frames) instead. The DOM was verified correct.
- **Headless Comet dies past ~11 pages in one browser session.** `verify-sf.mjs` takes one `WIDTH` per run for that reason.
- ImageMagick on this Mac is broken (`montage` cannot write output, no fonts). Python + PIL works.
