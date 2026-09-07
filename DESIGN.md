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

**Purple is her favourite colour, so purple leads.** Dark base still: a
night-kitchen, not a bright white "healthy meal prep" site. Food photography
reads richest on dark.

The direction is **Aubergine & Brass**. It was chosen over two other purple
directions by judging all three against her actual photographs.

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0B0910` | Page base. Near-black with the faintest aubergine. |
| `--ink-2` | `#14101B` | Raised surfaces, cards. |
| `--ink-3` | `#1E1828` | Inset wells, form fields. |
| `--ink-line` | `#382B48` | Hairlines. |
| `--ivory` | `#F4EDE4` | Primary text. Warm, never pure white. |
| `--ivory-dim` | `#B8ABAF` | Secondary text, captions. |
| `--violet` | `#BB69E6` | THE accent. OKLCH H 312.6. |
| `--violet-hi` | `#D9A6F5` | Hover, focus, glints. |
| `--brass` | `#B98B3C` | The metal — the scale, the beam, the hero light. |
| `--brass-hi` | `#F0CE8E` | Champagne. The 3D scale, dust, the key light. |
| `--heat` | `#C02C4A` | SPICY / SOLD OUT, and the fire in the logo. |
| `--heat-lift` | `#E4677E` | Heat text on dark. |
| `--infusion` | `#E184B6` | The Infusion side accent — the other pan. |
| `--infusion-hi` | `#F1B8D5` | Its highlight. |

**Rules**

- **Purple is the voice. Brass is the material and the LIGHT.** That split is
  the whole direction, and it is not a style choice — it is what keeps her food
  edible. A chromatic surround pushes an adjacent *neutral* toward its
  complement, and the complement of violet is green. Her banana pudding is 42%
  bright near-neutral; her lamb chops sit on a white plate on beige granite.
  Green whipped cream reads as spoiled dairy. So **any light that falls on a
  photograph stays warm** — the hero radial glow, and the Three.js key light in
  `hero3d.js`. If a later session "finishes the job" by turning those violet,
  the food dies. Do not.
- One accent does the work: violet. Heat is a *spike*, not a second theme, and
  brass is a material rather than a colour to decorate with.
- The Infusion menu re-points `--accent` to `--infusion` so the two sides read
  as different rooms of the same house — same skeleton, different light.
- **Hues in comments are OKLCH.** Say so next to any number you record. The
  same hex is 279 in HSV and 312.6 in OKLCH, and a session that "corrects" this
  accent to OKLCH 279 lands on a blue-violet and loses the food defence.
- **Name tokens for what they are, never for what they used to be.** Shipping
  `--gold: #BB69E6` is how a palette rots; so is leaving a `.pill--gold` class
  behind for the next person to find and re-introduce gold looking for it.
- **No gradients as decoration.** Radial light-falloff behind the hero is
  allowed because it reads as a light source. Purple/blue "AI gradient" mesh is
  banned — and this is now a purple site, so that line matters more, not less.
- Nothing may depend on telling violet from brass by colour alone: for a
  deuteranope they collapse toward similar-lightness browns. The pills carry
  words (SPICY, SOLD OUT) and must keep carrying words.
- Every text/background pair must clear WCAG AA (4.5:1 body, 3:1 large and UI).
  33 pairs were computed for this palette, including the runtime `color-mix`
  composites; zero fail. Recompute, do not estimate.

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

**Daija herself.** The site had 32 photographs of her food and none of her
working, on a page called *About Chef Daija*. Two frames of her at the prep
table now open that page. Rules that come with them:

- **Her face is hers to publish. Nobody else's is.** She is the business, so a
  clear frame of her is fine. A customer, a friend or a family member who
  happens to be in a scraped frame is not — testimonials stay text-only. If it
  is not certain whose face it is, the frame does not ship.
- The source frames are phone-video stills: tall, soft, and lit by a kitchen.
  Crop them by eye, cap their height in CSS, and do not upscale to hide it.
- Alt text describes what is *actually* in the frame — gloves, the green board,
  the steel table. Not "chef cooking".

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
- `.btn--cash` — the Cash App button. **The one colour on this site that is not
  ours and does not follow the palette.** It stays Cash App green because it is
  a payment affordance: people recognise the colour before they read the label,
  and payment must never look like navigation. It also means a future rebrand
  cannot accidentally disguise the checkout. Never print the cashtag as plain
  text where a tap would do — the whole checkout is that one link.
- `.nav__sound` — the music switch. See section 8b.
- `.brand__logo` — her logo, inline SVG, coloured from `--accent` so it follows
  the palette instead of fighting it.

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

## 8b. Sound

She asked for music. Music on a commercial page is normally a mistake, so it
ships under hard rules rather than not at all:

1. **It never autoplays.** Browsers block it, and a food page that starts
   talking at you is a page that gets closed.
2. **It costs nothing until it is wanted.** The `<audio>` element is not
   created until the first tap, so a phone on cellular downloads zero bytes.
3. **The control tells the truth.** It shows a muted speaker until sound is
   actually playing, and it carries `aria-pressed`.
4. **A dead control removes itself.** If the file is missing or the browser
   refuses to decode it, the button deletes itself rather than sitting there
   doing nothing.
5. **The choice lasts the session, not for ever.** Every visit starts quiet.
6. The track is original, generated, and credited in `assets/audio/README.md`.
   Never a real song, never a sample of one — this is a commercial site.

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
