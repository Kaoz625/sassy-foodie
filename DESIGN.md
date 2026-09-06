# DESIGN.md — Chef Daija / Sassy Foodie

The design system. Written before any screen. Every page obeys this file.

---

## 1. The concept: **The Scale**

She is a Libra. The Libra glyph is the scales — balance, symmetry, Venus, beauty,
and the refusal to choose between two good things.

The site has two menus: **The Kitchen** (her food) and **The Infusion** (the
side she makes for people who indulge). That is not an awkward second menu to
hide. That is literally the two pans of the scale, and the whole site is built
on it.

So: **symmetry is a layout law here, not a style choice.** A strong centre axis.
Mirrored compositions. Paired opposites. A golden balance beam that tips as you
scroll.

The second half of the brief is passion — she used to fight with people who did
not eat her food. That is heat, and it is why the palette is not a cold
minimal-luxury grey. There is pomegranate red under the gold.

**Balance is the structure. Passion is the temperature.**

---

## 2. Colour

Dark base. This is a night-kitchen, candlelit, gold-leaf world — not a bright
white "healthy meal prep" site. Food photography reads richest on dark.

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0A0A0B` | Page base. Warm near-black, not pure `#000`. |
| `--ink-2` | `#121114` | Raised surfaces, cards. |
| `--ink-3` | `#1B191E` | Hairlines, inset wells. |
| `--ivory` | `#F4EDE4` | Primary text. Warm, never pure white. |
| `--ivory-dim` | `#B8AEA3` | Secondary text, captions. |
| `--gold` | `#D9A94A` | THE accent. Venus, gold leaf, the scale beam. |
| `--gold-hi` | `#F2D08A` | Gold highlight — hover, focus, glints. |
| `--pom` | `#A8202E` | Pomegranate. Passion, heat, "sold out", spice level. |
| `--blush` | `#E7BBA8` | Soft Venus tone. Infusion side accent. |

**Rules**
- One accent does the work: gold. Pomegranate is a *spike*, not a second theme.
- The Infusion menu shifts to `--blush` as its accent so the two sides read as
  different rooms of the same house — same skeleton, different light.
- **No gradients as decoration.** Radial light-falloff behind the hero is
  allowed because it reads as a light source. Purple/blue "AI gradient" mesh is
  banned.
- Every text/background pair must clear WCAG AA (4.5:1 body, 3:1 large).

---

## 3. Type

| Role | Face | Notes |
|---|---|---|
| Display | **Fraunces** (variable) | `SOFT` and `WONK` axes up. Warm, high-contrast, appetising. Never flat geometric. |
| Body | **Inter** | Plain, legible, gets out of the way. |
| Label | **JetBrains Mono** | Uppercase, letter-spaced. Prices, tags, section numbers. |

- Display sizes are **big**. Hero headline is a layout element, not a caption.
- Body copy max width `62ch`. Never full-bleed paragraphs.
- Prices are always mono — they must be scannable in a column.
- Fluid type via `clamp()`. No fixed px on headings.

---

## 4. Layout

- Centre axis. Hero, section heads and the closing CTA are symmetric.
- Content grid is asymmetric *inside* the symmetric frame — that is what stops
  symmetry becoming boring.
- Spacing scale (rem): `0.5 · 0.75 · 1 · 1.5 · 2 · 3 · 4 · 6 · 8 · 12`.
- Max content width `1240px`; text blocks `62ch`; menu columns `2` at desktop,
  `1` at mobile.
- Radius: `2px` on inputs/buttons, `4px` on cards. Nearly square — sharp reads
  more expensive than pill-shaped.
- The **balance rule**: every major section has a visible centre line or a
  mirrored pair. The scale beam divider (`.beam`) is the recurring motif.

---

## 5. Motion

- **One driver.** The hero derives every animation from a single
  `scrollProgress` float. No competing timelines. (House method — see the
  `animated-3d-website-method` skill.)
- Reveal-on-scroll via `IntersectionObserver`, 12px rise + fade, 600ms,
  `cubic-bezier(.16,1,.3,1)`. Stagger 60ms.
- The scale beam tips a few degrees with scroll. Subtle. It is a motif, not a
  ride.
- **Never mix animation libraries in one tree.** Three.js owns the canvas.
  Vanilla CSS/JS owns the DOM. No Framer Motion, no GSAP here. (House CRITICAL
  rule.)
- `prefers-reduced-motion: reduce` kills all transforms, stops the 3D loop, and
  renders one static frame. This is tested, not assumed.

---

## 6. Imagery

**Her real photos only.** Scraped from her own Instagram and TikTok.

- No stock photography. No AI-generated food. Ever. A generated plate of food on
  a real cook's site is a lie the customer can taste.
- Dark, warm, close-cropped. Food fills the frame.
- `object-fit: cover`, `object-position: center`.
- Every image needs real alt text describing the actual dish.
- If we do not have a photo for a dish, the card runs **type-only** on a warm
  ink panel. A missing photo is fine. A fake photo is not.

---

## 7. Components

- `.beam` — the scale divider. A hairline gold rule with a centre pivot dot.
- `.dish-card` — image, name (display), one-line description, mono price, an
  add-to-order control.
- `.menu-section` — numbered (`01`, `02`) mono label, display heading, grid.
- `.btn` — primary is gold on ink; secondary is a gold hairline outline.
- `.order-bar` — sticky bottom bar showing item count and total once the order
  is non-empty.
- `.gate` — the 21+ interstitial for the Infusion menu.
- `.pill` — mono tag: `SPICY`, `VEGAN`, `LIMITED`, `SOLD OUT`.

**States are mandatory.** Every interactive element gets hover, focus-visible
(2px `--gold-hi` outline, 2px offset), active, and disabled. Focus is never
removed.

---

## 8. Commerce reality

She is a home chef, not a restaurant chain. There is no Stripe, no card
processing, no inventory system. The site must fit **how she actually sells**:

1. Customer builds an order in the browser (`localStorage`, no account).
2. The order becomes a clean itemised text message to **267-616-0427**.
3. Payment is **Cash App `$DaijaRob`**, deep-linked with the total.
4. She confirms by text.

This is a real, working, zero-fee checkout that she can run from her phone
today. Do not replace it with a fake "Add to cart → Checkout" that goes nowhere.
The site must never *look* like it takes card payments when it does not.

---

## 9. Accessibility (non-negotiable, house rule)

- WCAG 2.1 AA contrast everywhere.
- Tap targets ≥ 44×44px.
- Full keyboard path through nav, menu, order builder and the age gate.
- Skip-to-content link.
- Semantic landmarks, one `h1` per page, honest heading order.
- Reduced-motion respected.
- The order summary is a real `<table>` so a screen reader can read it as one.

---

## 10. What would make this AI slop — do not do it

- A centred hero saying "Elevating culinary experiences."
- Emoji as icons. Use inline SVG.
- Three symmetric feature boxes with lorem text.
- Invented reviews, invented star ratings, invented "500+ happy customers".
- Stock hands holding a bowl.
- Purple-to-blue gradient anything.
- A fake cart that implies card payment.
- Fabricated prices. If we did not read a price off her own post, the card says
  "Ask for today's price" and links to text her.
