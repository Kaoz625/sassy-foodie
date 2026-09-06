# Sassy Foodie — Chef Daija

Multi-page site for Chef Daija, a Philadelphia chef who cooks and sells her own
food. Static HTML, no framework, no build step at deploy.

## Commands

```bash
node build.mjs            # regenerate the .html pages from data/ + build.mjs
python3 -m http.server 8080   # preview at http://localhost:8080
```

## How it fits together

- `data/*.json` — the only place content lives. `site.json` (contact, socials),
  `menu.json` (The Kitchen), `infusions.json` (21+ menu), `gallery.json`.
- `build.mjs` — the generator. Holds the layout, the nav, the page copy and the
  menu/gallery renderers, and writes the `.html` files at the repo root.
  **Edit the page copy here, never in the generated `.html`.**
- `src/css/site.css` — one stylesheet, tokenised. Sections are numbered.
- `src/js/` — `order.js` (the cart + text/Cash App handoff), `site.js` (nav,
  reveal, the scale beam), `hero3d.js` (Three.js hero), `gate.js` (21+ door),
  `order-page.js` (the order table).
- `DESIGN.md` — the design system. Read it before changing anything visual.

## Ordering — there is no card processor

Deliberate. She takes orders by text and payment by Cash App `$DaijaRob`. The
site builds an itemised message and deep-links both. Do not replace this with a
checkout that looks like it takes cards. See `DESIGN.md` §8.

## Content rule

Her real photos and her real prices only. Nothing stock, nothing AI-generated,
nothing invented. An item with no confirmed price shows "Ask" rather than a
made-up number.
