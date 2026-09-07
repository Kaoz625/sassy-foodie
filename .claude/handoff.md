# Handoff — Sassy Foodie client site

**Updated:** 2026-09-06 · profile `claude` · scrape stage only

Working on: Building Daija's website (Sassy Foodie — chef, West Philadelphia). This pass was **content collection only**. No site code written yet.

Last action: Scraped all three of her real accounts through headless Comet with her signed-in cookies. 246 images, 115 videos, 136 verbatim captions, 22 real prices, all saved and described.

Next step: Read these three files, in this order, then design:
```
open "/Users/markususche/Desktop/sassy foodie/research/social-scrape.md"
open "/Users/markususche/Desktop/sassy foodie/research/menu-extracted.md"
open "/Users/markususche/Desktop/sassy foodie/assets/raw/MANIFEST.md"
```

Key files:
- `research/social-scrape.md` — who she is, her voice, the three accounts, her logo, customer testimonials
- `research/menu-extracted.md` — every real price, all 8 menu graphics transcribed, the full dish list
- `research/captions.md` — 136 captions verbatim, indexed SF-nn / GT-nn / TT-nn
- `assets/raw/MANIFEST.md` — every one of the 361 media files, its source post URL, and what is visibly in it
- `assets/raw/ig-sassyfoodiee/ig-sassyfoodiee-LOGO.jpg` — her real logo. Use its palette, do not invent one.

Blockers — three questions only Markus or Daija can answer:
1. Which trading name does the site carry — **Sassy Foodie** or **Your Choice Cuisine**? Both appear on her own material.
2. Is the phone **267-977-2072** still hers? Three sources agree but the newest is 2020.
3. Cannabis-infused food is an openly advertised add-on of hers, and an old deleted menu of hers listed psilocybin items. Neither is on any page yet. See `menu-extracted.md` section 4 before building a menu.

Do NOT use: any stock photo, any AI-generated image. Everything needed is in `assets/raw/`.
Deploy target when built: Cloudflare Pages. Never Vercel.
