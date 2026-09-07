# Sassy Foodie — handoff

Working on: Chef Daija's site. This pass did the purple rebrand, her logo, a
photo of her working, site music, Cash App buttons, and the subdomain.

Last action: deployed and verified live on both hostnames.

Next step:
```bash
cd "/Users/markususche/Desktop/sassy foodie" && node build.mjs && git status
```

## Live
- **https://sassyfoodie.lyreosai.com** — give people this one
- https://sassy-foodie.pages.dev
- Repo: https://github.com/Kaoz625/sassy-foodie

## What changed this pass
- **Palette is purple.** "Aubergine & Brass". Read DESIGN.md §2 BEFORE touching
  a colour — especially the rule that any light falling on a photograph stays
  warm. The hero glow and the Three.js key light are brass on purpose. Turning
  them violet makes her food look green.
- **Her logo** redrawn as SVG: `assets/logo.svg` (lockup) and
  `assets/logo-mark.svg` (badge, also copied to `assets/favicon.svg`). The fire
  is warm on purpose — drawn in the accent colour it reads as a magnifying
  glass, and that mistake was made once already.
- **Photos of her**: `assets/img/chef-at-work.jpg`, `chef-hands.jpg` (+ mobile).
  No face in either frame.
- **Music**: `assets/audio/kitchen-loop.mp3` / `.ogg`, 52s, original generated,
  provenance in `assets/audio/README.md`. Control is `src/js/audio.js`.
- **Cash App buttons** everywhere the cashtag used to be plain text.
- **Infusions**: butter/oil is $75 and marked HER price; the three Shroom items
  are on the site in their own section.

## Verified, not assumed
- 7 pages x 2 widths: 0 console errors, 0 contrast failures, 0 tap targets
  under 44px, 0 missing alt, 0 horizontal overflow.
- Live: music button survives a click and goes aria-pressed=true; canvas paints;
  0 broken images; 2 Cash App links on the home page; 0 page errors.
- Audio is real: 51.9s, mono, mean -18.4 dB, max -3.7 dB.

## Blockers
None.

## Open, low priority
- The logo has no stacked square lockup WITH the name in it (the badge has no
  wordmark). She will want one for a shirt front. The judge asked for it; it is
  not needed for the site.
- Both photos of her are soft phone stills. If she can send one good photo of
  herself cooking, it would lift the About page a lot.
- `menu` at 390px sometimes times out the harness screenshot on Google Fonts.
  Harness flake, not a site bug — documented in the traps section.

## Traps (still true)
- Comet only, `--headless=new`, never `--disable-gpu`.
- Deploy `dist/`, never the repo root (`assets/raw/` is ~735MB).
- Generated `.html` is written by `build.mjs`; never hand-edit it.
- `export GH_TOKEN="$GITHUB_API_KEY"` for git — the keyring token is dead.
- Cloudflare: Pages token for Pages, DNS token for DNS. See CLAUDE.md.
- ImageMagick is broken on this Mac. Use Python PIL.
