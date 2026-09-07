/* Static site generator for Chef Daija / Sassy Foodie.
   Reads data/*.json, writes plain .html at the repo root so Cloudflare Pages
   serves the folder with no build step at deploy time.
   Run:  node build.mjs                                                       */
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, rmSync } from 'node:fs';

const site = JSON.parse(readFileSync('data/site.json', 'utf8'));
const readData = f => existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : { sections: [] };
const kitchen  = readData('data/menu.json');
const infusion = readData('data/infusions.json');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* --- icons ------------------------------------------------------------- */
const ICON = {
  scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18"/><path d="M8 21h8"/><path d="M3 7h18"/><path d="M6 7l-3 6a3 3 0 0 0 6 0z"/><path d="M18 7l3 6a3 3 0 0 1-6 0z"/></svg>`,
  menu:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`,
  cash:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`
};

/* --- layout ------------------------------------------------------------ */
const NAV = [
  ['menu.html', 'The Kitchen'],
  ['infusions.html', 'Infusions'],
  ['gallery.html', 'Gallery'],
  ['about.html', 'About'],
  ['contact.html', 'Contact']
];

function layout({ file, title, desc, body, head = '', bodyClass = '', hero3d = false }) {
  const fullTitle = file === 'index.html'
    ? `${site.brand} — ${site.chef}, ${site.city}`
    : `${title} — ${site.brand}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0A0A0B">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:site_name" content="${esc(site.brand)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="icon" href="./assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="./assets/favicon.svg">
<link rel="stylesheet" href="./src/css/site.css">
${hero3d ? `<script type="importmap">
{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js"}}
</script>` : ''}
${head}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip" href="#main">Skip to content</a>

<header class="nav">
  <div class="nav__in">
    <a class="brand" href="./index.html">${ICON.scale}<span>${esc(site.brand)}</span></a>
    <nav aria-label="Main">
      <ul class="nav__links" id="nav-links">
        ${NAV.map(([h, t]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('\n        ')}
        <li><a class="btn btn--ghost" href="order.html">Order &middot; <span data-order-count>0</span></a></li>
      </ul>
    </nav>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Open menu">${ICON.menu}</button>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="foot">
  <div class="wrap">
    <div class="foot__grid">
      <div>
        <a class="brand" href="./index.html">${ICON.scale}<span>${esc(site.brand)}</span></a>
        <p class="note" style="margin-top:1rem">${esc(site.tagline)}<br>Cooked by ${esc(site.chef)} in ${esc(site.city)}.</p>
      </div>
      <div>
        <h4>Order</h4>
        <ul>
          <li><a href="menu.html">The Kitchen</a></li>
          <li><a href="infusions.html">Infusions (21+)</a></li>
          <li><a href="order.html">Your order</a></li>
          <li><a href="tel:${site.phoneIntl}">Text ${esc(site.phone)}</a></li>
        </ul>
      </div>
      <div>
        <h4>Follow</h4>
        <ul>
          <li><a href="${site.socials.instagram}" rel="noopener noreferrer" target="_blank">Instagram &middot; sassy.foodiee</a></li>
          <li><a href="${site.socials.tiktok}" rel="noopener noreferrer" target="_blank">TikTok &middot; cookwdaijj</a></li>
          <li><a href="about.html">About Daija</a></li>
          <li><a href="contact.html">Contact &amp; hours</a></li>
        </ul>
      </div>
    </div>
    <div class="foot__base">
      <span>&copy; <span data-year></span> ${esc(site.brand)}</span>
      <span>Built by NYC Tailblazers</span>
    </div>
  </div>
</footer>

<div class="order-bar" data-open="false" role="region" aria-label="Your order">
  <div class="order-bar__in">
    <span class="order-bar__sum" data-order-sum></span>
    <a class="btn" href="order.html">Review order ${ICON.arrow}</a>
  </div>
</div>

<script src="./src/js/order.js"></script>
<script src="./src/js/site.js"></script>
${hero3d ? `<script type="module" src="./src/js/hero3d.js"></script>` : ''}
</body>
</html>
`;
}

/* --- menu rendering ---------------------------------------------------- */
function dishCard(item, menuName) {
  const priced = typeof item.price === 'number' && item.price > 0;
  const sold = item.status === 'sold-out';
  const img = item.img
    ? `<img class="dish__img" src="${esc(item.img)}" alt="${esc(item.alt || item.name)}" loading="lazy" decoding="async">`
    : `<div class="dish__img--none" aria-hidden="true">${esc((item.name || '?').slice(0, 1))}</div>`;
  const tags = (item.tags || []).map(t => {
    const cls = /SPIC|HOT/i.test(t) ? 'pill--hot' : /LIMIT|NEW/i.test(t) ? 'pill--gold' : '';
    return `<span class="pill ${cls}">${esc(t)}</span>`;
  }).join('');
  return `
      <article class="dish rv">
        ${img}
        <div class="dish__body">
          <div class="dish__top">
            <h3 class="dish__name">${esc(item.name)}</h3>
            <span class="price">${priced ? '$' + item.price.toFixed(2) : 'Ask'}</span>
          </div>
          ${item.desc ? `<p class="dish__desc">${esc(item.desc)}</p>` : ''}
          ${tags ? `<div class="dish__tags">${tags}${sold ? '<span class="pill pill--out">Sold out</span>' : ''}</div>` : (sold ? '<div class="dish__tags"><span class="pill pill--out">Sold out</span></div>' : '')}
          <div class="dish__foot">
            ${sold
              ? `<span class="note">Text to ask when this is back.</span>`
              : `<button class="btn btn--ghost" type="button"
                   data-add="${esc(item.id)}" data-name="${esc(item.name)}"
                   data-price="${priced ? item.price : 0}" data-menu="${menuName}">Add</button>
                 <div class="qty" role="group" aria-label="Quantity for ${esc(item.name)}">
                   <button type="button" data-step="${esc(item.id)}" data-dir="-1" aria-label="One less ${esc(item.name)}">&minus;</button>
                   <output data-qty-for="${esc(item.id)}">0</output>
                   <button type="button" data-step="${esc(item.id)}" data-dir="1" aria-label="One more ${esc(item.name)}">+</button>
                 </div>`}
          </div>
        </div>
      </article>`;
}

function renderMenu(data, menuName) {
  if (!data.sections || !data.sections.length) {
    return `
    <div class="panel center rv">
      <span class="label">Menu</span>
      <h3>Today's menu goes out on her socials first</h3>
      <p class="note" style="margin-inline:auto">This page fills in from Chef Daija's own posts. Nothing here is invented — if an item is not confirmed, it is not listed. Text her for what is cooking today.</p>
      <p style="margin-top:1.5rem"><a class="btn" href="tel:${site.phoneIntl}">Text ${esc(site.phone)}</a></p>
    </div>`;
  }
  return data.sections.map(sec => `
    <section class="menu-section">
      <div class="sec-head rv">
        <span class="label">${esc(sec.no || '')} ${esc(sec.title)}</span>
        <h2>${esc(sec.heading || sec.title)}</h2>
        ${sec.note ? `<p class="lede">${esc(sec.note)}</p>` : ''}
      </div>
      <div class="grid grid--3">
        ${(sec.items || []).map(i => dishCard(i, menuName)).join('')}
      </div>
    </section>`).join('\n    <div class="wrap"><div class="beam"></div></div>\n');
}


/* --- gallery ----------------------------------------------------------- */
const gallery = readData('data/gallery.json');
function renderGallery(limit) {
  const items = (gallery.items || []).slice(0, limit || undefined);
  if (!items.length) {
    return `<div class="panel center rv">
      <span class="label">Gallery</span>
      <h3>Her plates live on her socials right now</h3>
      <p class="note" style="margin-inline:auto">Every photo on this site is her own. Nothing here is stock and nothing is AI-generated — so this grid stays empty until her real posts are pulled in.</p>
      <p class="hero__cta" style="margin-top:1.5rem">
        <a class="btn" href="${site.socials.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a class="btn btn--ghost" href="${site.socials.tiktok}" target="_blank" rel="noopener noreferrer">TikTok</a>
      </p>
    </div>`;
  }
  return `<div class="grid grid--3">${items.map(it => it.video
    ? `<figure class="dish rv" style="margin:0">
         <video class="dish__img" src="${esc(it.video)}" ${it.poster ? `poster="${esc(it.poster)}"` : ''} controls playsinline preload="none"></video>
         ${it.caption ? `<figcaption class="dish__body"><p class="dish__desc">${esc(it.caption)}</p></figcaption>` : ''}
       </figure>`
    : `<figure class="dish rv" style="margin:0">
         <img class="dish__img" src="${esc(it.img)}" alt="${esc(it.alt || 'Dish by Chef Daija')}" loading="lazy" decoding="async">
         ${it.caption ? `<figcaption class="dish__body"><p class="dish__desc">${esc(it.caption)}</p></figcaption>` : ''}
       </figure>`).join('')}</div>`;
}

/* hero images for the 3D ring — her real photos only */
const heroImgs = (gallery.items || []).filter(i => i.img).slice(0, 10).map(i => i.img).join(',');

/* --- pages ------------------------------------------------------------- */
const pages = [];

/* ---------- HOME ---------- */
pages.push({
  file: 'index.html',
  title: 'Home',
  hero3d: true,
  desc: `${site.chef} cooks and sells her own soul food and seafood in ${site.city}. $25 platters, pre-order by text, pay by Cash App.`,
  body: `
  <section class="hero">
    <canvas id="hero-canvas" data-images="${esc(heroImgs)}" aria-hidden="true"></canvas>
    <div class="wrap hero__in">
      <span class="label">${esc(site.city)} &middot; Cooked to order</span>
      <h1>Food worth<br><em>fighting over.</em></h1>
      <p class="lede">${esc(site.chef)} makes every plate herself &mdash; no ghost kitchen, no line cook, no shortcuts. You text the order. She cooks it. You eat like somebody loves you.</p>
      <div class="hero__cta">
        <a class="btn" href="menu.html">See the menu ${ICON.arrow}</a>
        <a class="btn btn--ghost" href="tel:${site.phoneIntl}">${ICON.phone} Text ${esc(site.phone)}</a>
      </div>
      <div class="hero__meta">
        <span>Japanese &middot; Jerk &middot; Soul food</span>
        <span>Cash App &middot; $${esc(site.cashtag)}</span>
        <span>Pickup &amp; local delivery</span>
      </div>
    </div>
  </section>

  <div class="wrap"><div class="beam"></div></div>

  <section>
    <div class="wrap">
      <div class="grid grid--2" style="align-items:center;gap:var(--s5)">
        <div class="rv">
          <span class="label">01 &middot; The platter</span>
          <h2>Twenty-five dollars.<br>A fifteen dollar deposit<br>holds it.</h2>
          <p class="lede">Wings, baked mac and cheese, collard greens with smoked turkey necks, candied yams, and garlic butter rolls. It is the plate she built the business on.</p>
          <p class="hero__cta" style="justify-content:flex-start">
            <a class="btn" href="menu.html">Order a platter ${ICON.arrow}</a>
          </p>
        </div>
        <figure class="rv" style="margin:0">
          <img src="assets/img/platter-soul-food.jpg" width="1200" height="900"
               alt="Fried chicken, baked mac and cheese with a browned crust, collard greens and a toasted garlic butter roll in a black takeout tray"
               style="border-radius:var(--r-md);border:1px solid var(--ink-line)" loading="lazy" decoding="async">
        </figure>
      </div>
    </div>
  </section>

  <div class="wrap"><div class="beam"></div></div>

  <section>
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">02 &middot; What people text her back</span>
        <h2>She screenshots<br>the good ones.</h2>
        <p class="lede">These are real messages from real customers, posted by her, on her own page. No made-up reviews and no star ratings &mdash; just what people actually said.</p>
      </div>
      <div class="grid grid--3">
        <blockquote class="panel rv" style="margin:0">
          <p class="lede" style="color:var(--ivory)">&ldquo;Food so good I dam near cried&rdquo;</p>
          <footer class="note">A customer, on the $25 platter</footer>
        </blockquote>
        <blockquote class="panel rv" style="margin:0">
          <p class="lede" style="color:var(--ivory)">&ldquo;Girl, I dont know where to start&hellip; the garlic roll was perfection !!! And this Seafood Lasagna was amazing !!!!&rdquo;</p>
          <footer class="note">A customer, on the seafood lasagna</footer>
        </blockquote>
        <blockquote class="panel rv" style="margin:0">
          <p class="lede" style="color:var(--ivory)">&ldquo;The lasagna is good af&rdquo;</p>
          <footer class="note">A customer, mid-plate</footer>
        </blockquote>
      </div>
    </div>
  </section>

  <div class="wrap"><div class="beam"></div></div>

  <section>
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">03 &middot; The two sides</span>
        <h2>She is a Libra.<br>So there are two menus.</h2>
        <p class="lede">Balance is the whole point. One side feeds everybody. The other is the infused side, for the grown folks who like to indulge. Same hands, same standards, two different nights.</p>
      </div>
      <div class="grid grid--2">
        <article class="panel rv">
          <span class="label">The Kitchen</span>
          <h3>Platters, seafood, wings</h3>
          <p class="note">Her everyday food &mdash; the plates people come back for and text her about at midnight. Pre-order, pick it up, or have it run to you locally.</p>
          <p style="margin-top:1.5rem"><a class="btn btn--wide" href="menu.html">Open The Kitchen ${ICON.arrow}</a></p>
        </article>
        <article class="panel rv">
          <span class="label">The Infusion &middot; 21+</span>
          <h3>For those who indulge</h3>
          <p class="note">She makes her own infused butter and cooks with it. Kept behind its own door, age-gated, and never mixed into a regular order by accident.</p>
          <p style="margin-top:1.5rem"><a class="btn btn--ghost btn--wide" href="infusions.html">Open The Infusion ${ICON.arrow}</a></p>
        </article>
      </div>
    </div>
  </section>

  <div class="wrap"><div class="beam"></div></div>

  <section>
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">04 &middot; How it works</span>
        <h2>Three steps. No app, no fees.</h2>
        <p class="lede">She runs this from her own kitchen and her own phone. The site just makes your order easy to read.</p>
      </div>
      <div class="grid grid--3">
        <article class="panel rv">
          <span class="label label--dim">Step one</span>
          <h3>Build your order</h3>
          <p class="note">Tap through the menu and add what you want. Your order stays in your browser &mdash; no account, no sign-up.</p>
        </article>
        <article class="panel rv">
          <span class="label label--dim">Step two</span>
          <h3>Send it as a text</h3>
          <p class="note">One tap turns your order into a clean, itemized message to ${esc(site.phone)}. She replies with a time.</p>
        </article>
        <article class="panel rv">
          <span class="label label--dim">Step three</span>
          <h3>Pay by Cash App</h3>
          <p class="note">Send it to <strong>$${esc(site.cashtag)}</strong>. That is the whole checkout. No card processor takes a cut of her food.</p>
        </article>
      </div>
      <p class="center" style="margin-top:2rem"><a class="btn" href="order.html">Start an order ${ICON.arrow}</a></p>
    </div>
  </section>

  <div class="wrap"><div class="beam"></div></div>

  <section>
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">05 &middot; Straight from her kitchen</span>
        <h2>Her food, her photos.</h2>
        <p class="lede">Every picture on this site was taken by her. Nothing is stock and nothing is generated. If it has not come out of her kitchen, it is not on this page.</p>
      </div>
      ${renderGallery(9)}
      <p class="center" style="margin-top:2rem"><a class="btn btn--ghost" href="gallery.html">See all of it ${ICON.arrow}</a></p>
    </div>
  </section>`
});

/* ---------- THE KITCHEN ---------- */
pages.push({
  file: 'menu.html',
  title: 'The Kitchen',
  desc: `The Kitchen menu from ${site.chef} in ${site.city}. Build an order and text it straight to her.`,
  body: `
  <section class="page-head">
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">The Kitchen</span>
        <h1>What she is cooking</h1>
        <p class="lede">Add what you want, then send it as one text. She confirms the time and the total, and you pay by Cash App. Seafood moves with the market &mdash; if crab is up that week, she will tell you before she cooks.</p>
      </div>
      ${renderMenu(kitchen, 'kitchen')}
    </div>
  </section>
  <div class="wrap"><div class="beam"></div></div>
  <section>
    <div class="wrap center">
      <h2 class="rv">Do not see it? Ask.</h2>
      <p class="lede rv" style="margin-inline:auto">She takes special requests and does trays for parties, repasts, and Sunday dinners.</p>
      <p class="hero__cta rv">
        <a class="btn" href="tel:${site.phoneIntl}">${ICON.phone} Text ${esc(site.phone)}</a>
        <a class="btn btn--ghost" href="order.html">Review your order ${ICON.arrow}</a>
      </p>
    </div>
  </section>`
});

/* ---------- THE INFUSION ---------- */
pages.push({
  file: 'infusions.html',
  title: 'The Infusion (21+)',
  bodyClass: 'infusion',
  desc: `The infused menu from ${site.chef}. Adults 21 and over only.`,
  head: `<meta name="robots" content="noindex, nofollow">`,
  body: `
  <div class="gate" id="gate" hidden>
    <div class="gate__box">
      <span class="label">${ICON.scale} The Infusion</span>
      <h2>Are you 21 or over?</h2>
      <p class="note">This menu is her infused side. It is kept behind this door on purpose, and it is meant for adults only.</p>
      <div class="gate__actions">
        <button class="btn" type="button" id="gate-yes">Yes, I am 21+</button>
        <a class="btn btn--ghost" href="menu.html">No, take me to The Kitchen</a>
      </div>
      <p class="gate__fine">By entering you confirm you are of legal age where you are. Infused items are made to order and are never added to a regular order by accident &mdash; they stay tagged as infused all the way to her phone. Do not drive after eating them, keep them away from children and pets, and start low: edibles can take up to two hours to come on.</p>
    </div>
  </div>

  <section class="page-head">
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">The Infusion &middot; 21+</span>
        <h1>For those who indulge</h1>
        <p class="lede">Same cook, same standards, different night. Everything on this page is tagged <strong>[infusion]</strong> in your order so there is never a mix-up.</p>
      </div>
      ${renderMenu(infusion, 'infusion')}
    </div>
  </section>

  <div class="wrap"><div class="beam"></div></div>

  <section>
    <div class="wrap">
      <div class="panel rv">
        <span class="label">Before you order</span>
        <h3>Read this once</h3>
        <ul class="note" style="max-width:62ch;line-height:1.9">
          <li>Adults 21 and over only. She will not fill an infused order for anyone under age.</li>
          <li>Start with the smallest portion. Edibles can take 60&ndash;120 minutes to hit, and doubling up early is how people have a bad night.</li>
          <li>Do not drive, and do not mix with alcohol if you do not already know how you react.</li>
          <li>Store it sealed, labelled, and out of reach of children and pets. It looks like food, because it is food.</li>
          <li>Tell her about allergies when you text &mdash; she cooks it herself and can work around most of them.</li>
        </ul>
      </div>
    </div>
  </section>`,
  extraScript: `<script src="./src/js/gate.js"></script>`
});

/* ---------- ORDER ---------- */
pages.push({
  file: 'order.html',
  title: 'Your order',
  desc: `Review your order and send it to ${site.chef} as a text. Pay by Cash App $${site.cashtag}.`,
  body: `
  <section>
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">Checkout</span>
        <h1>Your order</h1>
        <p class="lede">Check it, add your name and when you want it, then send. The text goes to ${esc(site.phone)} and she replies to confirm.</p>
      </div>

      <div class="grid grid--2" style="align-items:start">
        <div class="panel">
          <h3 class="mt0">Items</h3>
          <div id="order-table"></div>
          <p id="order-empty" class="note" hidden>Nothing in your order yet. <a href="menu.html">Open The Kitchen</a>.</p>
          <p style="margin-top:1.5rem"><button class="btn btn--ghost" type="button" id="order-clear">Clear order</button></p>
        </div>

        <div class="panel">
          <h3 class="mt0">Send it</h3>
          <form id="order-form" novalidate>
            <div class="field">
              <label for="f-name">Your name</label>
              <input id="f-name" name="name" type="text" autocomplete="name" placeholder="So she knows whose plate it is">
            </div>
            <div class="field">
              <label for="f-when">Pickup or delivery, and when</label>
              <input id="f-when" name="when" type="text" placeholder="e.g. pickup around 7pm Friday">
            </div>
            <div class="field">
              <label for="f-notes">Notes, allergies, heat level</label>
              <textarea id="f-notes" name="notes" placeholder="Anything she should know before she cooks"></textarea>
            </div>
          </form>

          <div class="stack" style="margin-top:1.5rem">
            <a class="btn btn--wide" id="btn-sms" href="#">${ICON.phone} Send order by text</a>
            <a class="btn btn--ghost btn--wide" id="btn-cash" href="https://cash.app/$${esc(site.cashtag)}" target="_blank" rel="noopener noreferrer">${ICON.cash} Pay with Cash App &middot; $${esc(site.cashtag)}</a>
          </div>

          <p class="note" style="margin-top:1.5rem">Send the text first and wait for her to confirm the total and the time. Pay after she confirms &mdash; that way nothing is paid for a plate she cannot make that day.</p>

          <details style="margin-top:1.5rem">
            <summary class="label" style="cursor:pointer">Cannot text? Copy the order instead</summary>
            <textarea id="order-copy" class="note" readonly rows="8" style="width:100%;margin-top:.75rem;background:var(--ink-3);border:1px solid var(--ink-line);border-radius:2px;padding:.75rem"></textarea>
            <button class="btn btn--ghost" type="button" id="btn-copy" style="margin-top:.5rem">Copy to clipboard</button>
          </details>
        </div>
      </div>
    </div>
  </section>`,
  extraScript: `<script src="./src/js/order-page.js"></script>`
});

/* ---------- ABOUT ---------- */
pages.push({
  file: 'about.html',
  title: 'About Chef Daija',
  desc: `${site.chef} trained at three culinary schools and has cooked in Philadelphia and New York kitchens. Japanese technique, jerk, and her own blends.`,
  body: `
  <section class="page-head">
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">About</span>
        <h1>Chef Daija</h1>
        <p class="lede">Three culinary schools. Two cities. One person cooking your plate.</p>
      </div>
    </div>
  </section>

  <section style="padding-top:0">
    <div class="wrap">
      <div class="grid grid--3">
        <article class="panel rv">
          <span class="label">Trained three times over</span>
          <p class="note">Three culinary schools, starting with <strong>Walnut Hill College</strong> at 21. Each one taught her something the others did not &mdash; which is why her range does not look like one school&rsquo;s house style.</p>
        </article>
        <article class="panel rv">
          <span class="label">Two cities</span>
          <p class="note">Professional kitchens in <strong>Philadelphia and New York</strong>. Philly taught her the plate people actually want to eat. New York taught her the pace.</p>
        </article>
        <article class="panel rv">
          <span class="label">Her own blends</span>
          <p class="note"><strong>Japanese technique and jerk</strong>, plus marinades she builds herself. That combination is the thing you cannot get anywhere else in West Philly.</p>
        </article>
      </div>

      <div class="beam"></div>

      <div class="grid grid--2" style="align-items:center;gap:var(--s5)">
        <figure class="rv" style="margin:0">
          <img src="assets/img/miso-glazed-chicken.jpg" width="1200" height="900"
               alt="Glazed chicken with broccoli and rice on a white plate"
               style="border-radius:var(--r-md);border:1px solid var(--ink-line)" loading="lazy" decoding="async">
        </figure>
        <div class="rv">
          <h2>Read one marinade and you have got her.</h2>
          <p>The miso glazed chicken runs miso paste, honey, ginger, garlic, green onions, fish sauce, anchovy sauce and soy. The rice under it is cooked in butter, garlic, thyme and rosemary. That is a Japanese base, a French habit with the aromatics, and a Philly portion.</p>
          <p>Then she will turn around and put jerk on lamb chops and serve it with mac and cheese and collard greens. Both plates are hers. Neither is a copy.</p>
        </div>
      </div>

      <div class="beam"></div>

      <div class="sec-head rv">
        <h2>She has never been casual about her food.</h2>
      </div>
      <div class="panel rv" style="max-width:72ch;margin-inline:auto">
        <p>If you were around her and you did not eat what she cooked, it was a problem. Not a joke &mdash; an actual argument. That is the tell. People who cook because it pays do not fight you over a plate. People who cook because it is how they say something do.</p>
        <p>Her own words, from her page:</p>
        <blockquote style="margin:var(--s3) 0 0;padding-left:var(--s3);border-left:2px solid var(--accent)">
          <p class="lede" style="color:var(--ivory);margin-bottom:.5rem">&ldquo;If you know me you know I&rsquo;ve always had a passion for cooking ! I went to restaurant school at walnut hill college at 21! I&rsquo;ve been in and out of the culinary field for the last 5 years. I&rsquo;ve always loved cooking all my life and experimented with different flavors and ingredients!&rdquo;</p>
          <footer class="note">&mdash; ${esc(site.chef)}</footer>
        </blockquote>
      </div>

      <div class="beam"></div>

      <div class="sec-head rv">
        <span class="label">Her word for it</span>
        <h2>&ldquo;Snapped.&rdquo;</h2>
        <p class="lede">It is what she says when a dish comes out the way she wanted. <em>&ldquo;I snappped on the seafood salad real crab meat and shrimp !!&rdquo;</em> &middot; <em>&ldquo;I&rsquo;m back in the kitchen snapping again !&rdquo;</em> If she says she snapped on it, order it.</p>
      </div>

      <div class="grid grid--3">
        <article class="panel rv">
          <span class="label label--dim">Cooked to order</span>
          <p class="note">Nothing sits under a heat lamp. She cooks when the order comes in, which is why she asks you for a day and a time.</p>
        </article>
        <article class="panel rv">
          <span class="label label--dim">Her own hands</span>
          <p class="note">No staff, no line, no franchise. If it came out of her kitchen, she made it. That includes the catering trays.</p>
        </article>
        <article class="panel rv">
          <span class="label label--dim">Straight to her phone</span>
          <p class="note">Orders come to her by text and payment goes to her Cash App. Nobody takes a cut in the middle.</p>
        </article>
      </div>

      <div class="beam"></div>

      <div class="sec-head rv">
        <span class="label">Balance</span>
        <h2>Why there are two menus</h2>
        <p class="lede">She is a Libra and it shows in the work &mdash; heat against sweet, rich against sharp, one side of the menu against the other. The Kitchen feeds everybody. The Infusion is for the grown folks. Two pans on the same scale, and she will not send a plate out that leans wrong.</p>
      </div>

      <p class="center" style="margin-top:2rem"><a class="btn" href="menu.html">See what she is cooking ${ICON.arrow}</a></p>
    </div>
  </section>`
});

/* ---------- GALLERY ---------- */
pages.push({
  file: 'gallery.html',
  title: 'Gallery',
  desc: `Real plates by ${site.chef}, photographed by her, in ${site.city}.`,
  body: `
  <section>
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">Gallery</span>
        <h1>Her plates</h1>
        <p class="lede">All of it hers &mdash; her cooking, her camera, her kitchen. No stock photography and nothing generated. What you see is what turns up in the container.</p>
      </div>
      ${renderGallery()}
    </div>
  </section>`
});

/* ---------- CONTACT ---------- */
pages.push({
  file: 'contact.html',
  title: 'Contact',
  desc: `Text ${site.chef} at ${site.phone} to order. ${site.city} pickup and local delivery.`,
  body: `
  <section>
    <div class="wrap">
      <div class="sec-head rv">
        <span class="label">Contact</span>
        <h1>Text her</h1>
        <p class="lede">Texting is the fastest way to reach her &mdash; she is usually cooking, not sitting by an inbox.</p>
      </div>
      <div class="grid grid--2" style="align-items:start">
        <div class="panel rv">
          <span class="label">Order &amp; questions</span>
          <h3>${esc(site.phone)}</h3>
          <p class="note">Tell her what you want, how many, and when you need it. Say if there are allergies.</p>
          <p class="stack" style="margin-top:1.5rem">
            <a class="btn btn--wide" href="tel:${site.phoneIntl}">${ICON.phone} Call or text</a>
            <a class="btn btn--ghost btn--wide" href="order.html">Build an order first ${ICON.arrow}</a>
          </p>
        </div>
        <div class="panel rv">
          <span class="label">Payment</span>
          <h3>Cash App &middot; $${esc(site.cashtag)}</h3>
          <p class="note">Pay after she confirms your order and total. There is no card checkout on this site, and there are no processing fees taken out of her food.</p>
          <p style="margin-top:1.5rem"><a class="btn btn--ghost btn--wide" href="https://cash.app/$${esc(site.cashtag)}" target="_blank" rel="noopener noreferrer">${ICON.cash} Open Cash App</a></p>
        </div>
      </div>
      <div class="beam"></div>
      <div class="grid grid--3">
        <article class="panel rv">
          <span class="label label--dim">Where</span>
          <p class="note">${esc(site.city)}. Pickup, plus local delivery &mdash; text her your area and she will tell you if she runs there.</p>
        </article>
        <article class="panel rv">
          <span class="label label--dim">When</span>
          <p class="note">She posts what is cooking and when on her socials. If you want a specific day, give her notice.</p>
        </article>
        <article class="panel rv">
          <span class="label label--dim">Follow</span>
          <ul class="note" style="list-style:none;padding:0;display:grid;gap:.5rem">
            <li><a href="${site.socials.instagram}" target="_blank" rel="noopener noreferrer">Instagram &middot; sassy.foodiee</a></li>
            <li><a href="${site.socials.instagramAlt}" target="_blank" rel="noopener noreferrer">Instagram &middot; thegoldentickettttt</a></li>
            <li><a href="${site.socials.tiktok}" target="_blank" rel="noopener noreferrer">TikTok &middot; cookwdaijj</a></li>
          </ul>
        </article>
      </div>
    </div>
  </section>`
});

/* ---------- 404 ---------- */
pages.push({
  file: '404.html',
  title: 'Page not found',
  desc: 'That page is not here.',
  body: `
  <section>
    <div class="wrap center">
      <span class="label">404</span>
      <h1>That plate is gone.</h1>
      <p class="lede" style="margin-inline:auto">The page you were after does not exist. The food still does.</p>
      <p class="hero__cta"><a class="btn" href="./index.html">Back to the start ${ICON.arrow}</a><a class="btn btn--ghost" href="menu.html">See the menu</a></p>
    </div>
  </section>`
});

/* --- write ------------------------------------------------------------- */
let n = 0;
for (const p of pages) {
  let html = layout(p);
  if (p.extraScript) html = html.replace('</body>', `${p.extraScript}\n</body>`);
  writeFileSync(p.file, html);
  n++;
}
console.log(`built ${n} pages`);

/* --- dist -------------------------------------------------------------- *
 * `node build.mjs --dist` collects ONLY what ships into dist/.
 * This exists because assets/raw/ holds ~735MB of original scraped media that
 * must never be uploaded. Deploy dist/, never the repo root.               */
if (process.argv.includes('--dist')) {
  rmSync('dist', { recursive: true, force: true });
  mkdirSync('dist/assets', { recursive: true });
  for (const p of pages) cpSync(p.file, `dist/${p.file}`);
  cpSync('src', 'dist/src', { recursive: true });
  cpSync('assets/img', 'dist/assets/img', { recursive: true });
  cpSync('assets/favicon.svg', 'dist/assets/favicon.svg');
  writeFileSync('dist/_headers',
    '/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n' +
    '/src/*\n  Cache-Control: public, max-age=86400\n' +
    '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
  console.log('dist/ ready to deploy');
}
