# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The website for **Chef Daija** — one person in Philadelphia who cooks and sells
her own food. Client of NYC Tailblazers. Repo: `Kaoz625/sassy-foodie`.

Static multi-page HTML. No framework, no bundler, no deploy-time build.

## Commands

```bash
node build.mjs                 # regenerate every .html from data/ + build.mjs
node build.mjs --dist          # same, plus a deployable dist/ (5.8MB, ships only what is needed)
python3 -m http.server 8099    # preview on http://127.0.0.1:8099
```

**Always deploy `dist/`, never the repo root.** `assets/raw/` holds ~735MB of
original scraped media and is gitignored; `--dist` leaves it out.

There is no test suite. **Verification is visual and runs through headless
Comet** — see "Verifying a change" below. A change is not done until you have
looked at the rendered page.

## Architecture — the one thing to understand

`build.mjs` is the whole site. It holds the layout, the nav, every page's copy,
and the menu/gallery renderers, and it writes the `.html` files at the repo
root. The generated `.html` is committed so Cloudflare Pages can serve the
folder directly with no build step.

**Never edit a generated `.html` file.** Your change will be erased the next
time anyone runs `node build.mjs`. Edit `build.mjs` (structure and copy) or
`data/*.json` (content), then rebuild.

```
data/*.json  ──┐
               ├──> build.mjs ──> index.html, menu.html, ... (committed)
build.mjs    ──┘
```

- `data/site.json` — contact, socials, Cash App tag. Changing the phone number
  here changes it in every page, footer and SMS link.
- `data/menu.json` / `data/infusions.json` — the two menus.
- `data/gallery.json` — her photos and videos. **This also feeds the 3D hero**:
  `build.mjs` takes the first ten `img` values and passes them to the Three.js
  ring as `data-images`. Add photos here and the hero fills itself.
- `src/css/site.css` — one tokenised stylesheet, numbered sections.
- `src/js/order.js` — the cart. Exposes `window.SF`. Everything commerce goes
  through it.
- `src/js/hero3d.js` — the Three.js hero, an ES module loaded via an importmap.

## Rules specific to this client

**1. Her real content only.** Every photo and every price must come from her own
Instagram or TikTok. No stock photography, no AI-generated food, no invented
dishes, no invented prices, no invented reviews or ratings. A dish with no
confirmed price renders as `Ask`, and a dish with no photo renders as a
type-only card. Both empty states are already built — use them instead of
filling a gap with something plausible.

**2. There is no card processor, and the site must never imply one.** She takes
orders by text to `267-616-0427` and payment by Cash App `$DaijaRob`. The order
builder turns a browser-local cart into an itemised SMS plus a Cash App deep
link. Do not add a checkout that looks like it takes cards. See `DESIGN.md` §8.

**3. Two menus, kept apart on purpose.** `menu.html` is The Kitchen.
`infusions.html` is her infused side: 21+ age gate, `noindex`, its own accent
colour, and every item tagged `[infusion]` all the way into the text she
receives. An infused item must never be able to enter a regular order silently.

**4. `DESIGN.md` is the design system and it was written before any screen.**
Read it before changing anything visual. It carries the palette, the type scale,
the motion rules, and a list of what would make this look AI-generated.

## Design constraints that bite

- **One animation library per tree** (house CRITICAL rule). Three.js owns
  `#hero-canvas`. Vanilla CSS/JS owns the DOM. Do not add GSAP or Framer Motion.
- The hero derives every animation from a single `scrollProgress` float. Keep it
  that way — see the `animated-3d-website-method` skill in `NYC-Design-Skills`.
- `prefers-reduced-motion` must kill the rAF loop and render one static frame.
- No WebGL must still leave a usable hero (the CSS radial light stays).
- Accent colour is indirected through `--accent`. `body.infusion` re-points it.
  Never hard-code `--gold` in a component.

## Verifying a change

Use **Comet**, never Chrome or Chromium, and never the chrome-devtools MCP —
house rule, see the root `~/CLAUDE.md` and the `comet-browser` skill. Headless
with a scratch profile is the default so his own browser never opens:

```bash
bash ~/.claude/skills/comet-browser/scripts/install-runtime.sh   # once
cd ~/.local/share/nyc-design-tools/comet-runtime
SHOTDIR=/tmp/sf-shots node verify-sf.mjs                          # 3 widths, a11y audit
```

`verify-sf.mjs` screenshots every page at one width per run and reports contrast
failures, tap targets under 44px, missing alt text, horizontal overflow and
console errors. Look at the images — do not just read the JSON.

Two things about this harness that will otherwise cost you an hour:

- **One `WIDTH` per invocation, on purpose.** Headless Comet dies part-way
  through if you drive more than about eleven pages in a single browser
  session. Run it three times, not once.
- **Never trust a Playwright `fullPage` screenshot of this site.** The sticky
  nav and the fixed order bar both use `backdrop-filter`, and beyond-viewport
  capture renders large blank bands where content actually exists. It looks
  exactly like a section that failed to render, and it is not. Use
  `scroll-shots.mjs` instead, which takes ordinary viewport frames at scroll
  offsets. If a section still looks empty, prove it in the DOM before you
  "fix" anything.

## Deployment

Cloudflare Pages project `sassy-foodie`. Two live hostnames, same deploy:

- **https://sassyfoodie.lyreosai.com** — the one to give people.
- https://sassy-foodie.pages.dev — the Pages default.

**Never Vercel** (house rule). Backends go on Coolify (mac2) and Postgres on
Neon, though this site needs neither.

**Two different Cloudflare tokens, and using the wrong one looks like a
permissions bug.** `$CLOUDFLARE_ALL_DNS_TOKEN` reads zones and writes DNS but
returns `{"code":10000,"message":"Authentication error"}` on every
`/accounts/{id}/pages/...` call. `$CLOUDFLARE_PAGES_TOKEN` is the Pages one.
`$CLOUDFLARE_WRANGLER_OAUTH` fails on Pages too. The custom domain was added
with the Pages token and the CNAME (`sassyfoodie` → `sassy-foodie.pages.dev`,
proxied) with the DNS token; Cloudflare does NOT auto-create that record.

`~/go/bin/cloudflare-pp-cli` has the right commands but does not read
`CLOUDFLARE_API_TOKEN` from the environment — its only auth path writes the
live token in plaintext to `~/.config/cloudflare-pp-cli/config.toml`, so this
project uses curl for Cloudflare API work instead.

```bash
node build.mjs --dist
set -a && . ~/.credentials/api-keys.env && set +a
export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_PAGES_TOKEN"
wrangler pages deploy dist --project-name=sassy-foodie --branch main
```

Confirmed working after the last deploy: 7 pages 200 on both hostnames, plus
`/assets/audio/kitchen-loop.mp3` (363,888 B, `audio/mpeg`), `/assets/favicon.svg`
and `/assets/img/chef-at-work.jpg`.

Cloudflare serves pages extensionless and 308-redirects `/menu.html` to `/menu`.
Internal links use `.html` so that local `python3 -m http.server` previewing
works. That costs one cached redirect per page and is a deliberate trade.

## Pricing — read before you touch a number

Every menu item carries a `priceSource`:
- `"hers"` — a price Daija published herself. **Do not change these.**
- `"market"` — a Philadelphia going rate we set for a dish she never priced.

`docs/price-sheet.md` is the approval document for her, and it is regenerated
by hand, not by the build. If you change a price in `data/*.json`, update that
sheet too or she will approve a number that is no longer live.

## GitHub auth gotcha

The `gh` keyring token on this machine is dead (401 on both REST and GraphQL),
and `GITHUB_PAT` is fine-grained and cannot create repos. Use the classic token:

```bash
set -a && . ~/.credentials/api-keys.env && set +a && export GH_TOKEN="$GITHUB_API_KEY"
```
