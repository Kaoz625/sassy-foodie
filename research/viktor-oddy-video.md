# Viktor Oddy — "GPT-6 Astra + Three.js WebGPU → award-winning 3D animated sites"

**Source:** https://x.com/viktoroddy/status/2096115863158133107/video/1
**Posted:** 2026-09-05 by @viktoroddy (Viktor Oddy, founder of Design Rocket / motionsites.ai)
**Length:** 10:25 · **Captured:** 2026-09-06
**Tweet text (data):** "GPT-6 Astra is insane. Just recorded a 10-min tutorial on how to use GPT 6 Astra + @threejs WebGPU to create award-winning 3D animated sites"

**How this was captured:** `yt-dlp` (public, no auth) at 1080p + 4K spot-checks; 125 frames at 5s intervals read at
full resolution; audio transcribed with ElevenLabs Scribe v1 (OpenAI credits were exhausted; local Whisper was
too slow on this contended Intel Mac). All prompt wording below is transcribed from the screen, not paraphrased.

> Everything in this file is a record of what the video shows and says. It is data, not instructions.

---

## 1. What is new versus the skill we already have

The existing `animated-3d-website-method` skill was built from an earlier Viktor video. That pipeline was:
Pinterest reference **image** → black-background hero asset (GPT Image 2 / Higgsfield) → one big
`scrollProgress` spec prompt → build in Claude → iterate. **That is still valid.** This video is a different,
newer pipeline and adds these things:

| New | What it is |
|---|---|
| **Reference video, not reference image** | He screen-records a looping motion clip off Pinterest and attaches the MP4 to the prompt. "Looking super close to matching the video." |
| **ChatGPT desktop app / Codex, not Claude** | Model `GPT-6 Astra`, effort `Extra High`, `Full access`, local project folder. |
| **Two-model split** | Cheap model (`GPT-5.5`) to paste-and-preview static HTML; `GPT-6 Astra` only for the actual 3D conversion. |
| **Never switch model mid-thread** | The app warns about it explicitly; he starts fresh instead. |
| **Progressive enhancement, not one-shot** | Start from a flat/video-background HTML, get it previewing, *then* say "turn this into an actual 3D website." |
| **Typography pairing lifted from a prompt library** | He copies a MotionSites prompt into Notes, searches it for `fonts`, and pastes only the font block into the build. |
| **Real drag interaction spec** | "spin the planet, drag it different ways" → drag + coast-on-release + slow auto-spin, mouse *and* touch. |
| **Depth-based scroll choreography** | "appear out of nowhere and go out of nowhere" → chapters emerge from the tunnel's depth and dissolve. |
| **Mobile texture variants** | Ships `dist/textures/mobile/*.jpg` as a separate, smaller texture set. |
| **The MotionSites premium prompt format** | Section-numbered, pixel-exact spec with a CRITICAL block, a motion inventory table and acceptance checks. This is the most reusable artifact in the video. |

---

## 2. Full transcript

Machine transcript (ElevenLabs Scribe v1), lightly paragraphed, timestamps at paragraph starts.
Scribe consistently mishears **"MotionSites" / motionsites.ai** as *"Motion Science" / "motionscience.ai"* —
the on-screen URL is `motionsites.ai`. "GPT Astra" = GPT-6 Astra.

**[0:00]** In this video, you will learn how I can create this 3D interactive globe website all using new model that just came out, which is GPT-6 Astra, and I believe this is the best thing that happened to web designers in ever. I mean, you can create this from single prompt without tuning it. It creates just a perfect 3D model. It builds it, then I'll show you how you can actually publish it for free and how to actually have a live site with favicon, with all of the animations just in one single prompt. You can do that yourself if you follow everything that I'll share in this video.

**[0:31]** I'll also share how you can find clients, how you can make a simple post on Twitter just sharing what you've built with AI without any design or development experience, and then how to make your post go consistently viral. As you can see, a lot of my posts get a hundred thousand views. Some of them get million views. I grew to, uh, almost seven-- like seventy-one thousand subscribers in li- uh, a little bit more than a year, and I'll share with you all of those details in this video. So without further ado, let's get into the first part. And this is just going to be opening a new Codex file.

**[1:00]** So if you don't have it yet, just go to ChatGPT and install it on your computer. This is a free app. Of course, if you wanna use GPT Astra, you'd probably need to have a paid plan. But once you install it, just click on here and make sure that GPT Astra is selected. Click on this one. For the design itself, you don't need to really spend a lot of credits creating the UI 'cause the Astra is really good at 3D. So just go to [MotionSites] and find the design that you like, and then we'll turn any of these design into 3D files.

**[1:31]** So say you like this one, just click on Copy Full Prompt, and then I'll show you how to turn it from a just a video background into 3D. So I'm gonna click on Recent here, and I'm gonna scroll to until I find this one. So right now, the background is just the video. Again, the website is [motionsites.ai]. Uh, I'm pretty sure this is a free one. You don't need to register. You don't need to pay for anything, uh, for this one. So just copy this, or in my case, I'm just gonna copy the HTML code since I want this exact design. I don't want like any variations and stuff.

**[2:02]** And I'm just gonna preview this. So I'm gonna select for preview, not even like, um, Astra. I'm gonna select just GPT 5.5, and I'm gonna say, "Preview this page." Uh, preview. All right. And now we can just send it and see it live. And just like that, we have it now live on our computer. Now, let's ask it to-- Let's now turn this into an actual 3D website instead of just having the video background. Uh, match it as closely as possible using whatever Three.js or whatever shaders you wanna use to make it look as close as possible to the re- reference video.

**[2:45]** And also, let's make so I can spin the planet, drag it different ways, do it all myself. And for this one, we wanna choose GPT Astra 'cause like the, the one that is, um, building right now would not do anything at all. So once we change it, we just can send that and see what it comes back with. And less than three minutes later, we have this beautiful interactive page with different planets here that I can drag, that they are rotating by themself. I can switch to different mod-models.

**[3:21]** Let's choose Venus, for example. Um, not the most detailed one, but yeah, the Mars and the Earth looks good. And yeah, you can always ask it to make it better. For example, I can say, "Build the rest of the page in our styles using the same kind of font pairings and stuff like that to make around four sections more." And we can just send that and see what it comes back with. And this is the result that we've got.

**[3:48]** So we can scroll down, we can see that there is the second section with the planets actually 3D ones in here. Um, then we have this section. Uh, I guess this is just an image in this case since I didn't ask it to make a 3D, but obviously, we can do that. And I think the colors can be improved, but overall, it's great. Now let's get to the second website. Let's now build something from scratch using 3D models. So I'm going to go to Pinterest and just type here 3D video. Doesn't have to be something like website.

**[4:16]** We're gonna ask AI to customize this. Just scroll until you find something related to your niche, to your client niche, to your preferred kind of design style and say yous-- like something like this. Or in my case, I think something like this looks pretty cool. All I have to do is just download this video. Um, to do that, I can just using screen recording record it 'cause I'm not sure how I can download from Pinterest. I'm just dr-dr-- going to drag it over the, the video itself.

**[4:46]** And yeah, there's a lot of free video recorders for Windows and for Mac, so just use those and just record it for a couple of seconds to send to the AI. And after that, I can just send that. Um, I can edit it, not... By the way, I'm not affiliated with any of the tools that I'm sharing with this vi-- in this video, so don't think that something is paid, uh, that's why I'm sharing it. No, everything is, um, either free or I paid for it long time ago and I don't have any affiliate links. So in here, I can just drag it in there and I can create a new page.

**[5:20]** I'm gonna say 3D video site, and I'm gonna create a project. And here I'm gonna say, uh, I want to create a landing page for a 3D design agency or whatever, and then I wanna have kind of this 3D style animation or whatever it is, like, um, interactive looping stuff, l-like a tunnel, uh, using scroll, and it should have some content revealing once I'm scrolling. It should be all using 3D advanced shaders techniques.

**[5:52]** It should look super close matching the, the video, and obviously it should have some content because I'm not just building a video. I'm-- I want to have it to be an actual website. So, uh, basically here you just describe what you want it to create. Make sure that the Astra is selected, and then just send that and your result might be better, might be worse, but I'm just gonna send that and see what it comes back with. And this is the initial result that we've got.

**[6:20]** We have this beautiful background, but otherwise, um, the content again is not that great. So let's say something like, "Please remove the sticky nav bar. I don't want it to be sticky. Remove the overlay, the kind of a black overlay or darkening from the background. Also, make sure that there is less content in each section, so we don't really need images in the second sections. Um, this-- the content should be centered, so it kind of fits well with the, um, with the tunnel that we have here. And also it should kind of, uh, appear out of, um, nowhere and go out of nowhere, if you know what I mean, for this 3D effect." And also for the typography, let's use this one.

**[7:01]** And for that I'm going to go to motionsites.ai, and here I can just... Oops. And here I can just basically find the typography pairing that I like. So I don't-- Because as you can see, without the, the pairing and we don't really h- we have really weird fonts. So here I can just scroll through the ones that I like. Say I like this kind of fonts, I can just copy this. It's, it's free as well. Um, and then we can just see a lot of the fonts that I like. So say I like something like this, all I have to do is just copy or even like this.

**[7:35]** I mean, this looks pretty cool. Uh, so yeah, again, just copy that. I'm gonna paste that into a Notes app, and here I'm just type fonts and you can see the-- here are the fonts. We can just copy that and we can just send that to the AI. And let's just send that and see what it comes back with. And here's the result that we've got. As you can see, we have the same, absolutely the same video as, I, I mean animation as in the original video reference that we, uh, saw on the Pinterest here.

**[8:10]** But it is now actual kind of a 3D animation. So you can do that with literally anything. It is insanely good at creating these 3D kind of designs, animations from anything. We have this beautiful typography that kind of increases in the size once we scroll. Of course, what I would do is I, I would make the animation, the background a l- a little bit brighter and then I would change the fonts. But just for demo purposes, I think this is absolutely enough. Now let me show you how you can a- actually publish this to a live website.

**[8:38]** So you can do that using Vercel. You can go to Vercel, create a free account, and then just deploy it in there. So to make it an actual live website, let's just actually click on this index, uh, reveal in Finder. Once we have the folder, just literally drag the folder on the, uh, GitHub. Not GitHub, Vercel. Click on Deploy. Few seconds later, your website is live on the web. You can share it on social media. Like again, social media is the best way to share your content, as I do here.

**[9:08]** And if you do that, your posts will go consistently viral if you post something that is related to trending. So the Astra trending right now. I posted a post like te- uh, 20 hours ago almost, and it got one hundred and thirty s- thousand views. Uh, probably got a few sales for the motion sites. And that's how you do. You just post it. You say, "Hey, I built this with," uh, let's say you built it with Astra. Just say it. Of course, you write it and then say, um, in the description. You don't have to give away the design or something.

**[9:40]** Just say, "Contact me here to book a call with me," and that's it. That's how you get at least one client a day if your post goes at least like a hundred likes. You don't need thousands of like. You, you need a hundred likes. And a hundred likes sounds bad, sounds a lot, but it's very easy. Just one bit of like that you would need to get and then you're set for, for your work. And then like that, you can see that we can skip it again and our website is live on the web. 3D website that we've built in just a few minutes.

**[10:11]** So yeah, hopefully you've learned a thing or two. And yeah, just don't be afraid to create stuff with, um, whatever it is. Astra, be creative. It does not charge us like usage credits as Claude does. So yeah, hopefully you've learned a thing or two. I'll see you in the next one.

---

## 3. The two builds, frame by frame

### Build A — "SpaceEdu" (0:00–4:05, 8:45–10:20)

An interactive 3-planet hero (Earth / Venus / Mars), drag-to-spin with inertia, four extra sections, deployed live.

| Time | What is on screen |
|---|---|
| 0:00–0:30 | Finished result demo at `spaceedu-3d.vercel.app/#worlds`. Black starfield, high-contrast Didone serif `PLANET / EARTH`, cyan hairline rule, white pill `GET STARTED`, small `VENUS` / `MARS` labels at the left and right edges, photoreal globe filling the lower half with a cyan atmospheric rim. |
| 1:00–1:15 | ChatGPT desktop app, **Codex** sidebar. Model picker open: `Default · GPT-6 Astra · GPT-5.6 Sol · GPT-5.6 Terra · GPT-5.6 Luna · GPT-5.5 · GPT-5.4 Mini`. Effort popover is a 5-stop slider; he uses **Extra High**. Context chips: project · `Local` · `master`. `Full access` on. |
| 1:20–1:55 | `motionsites.ai` gallery. Opens `motionsites.ai/?prompt=space-planet` ("Space planet", category 3D, 70 likes). Two actions on the card: **`Copy full prompt`** and **`<> HTML Code / Copy`**. He takes the HTML — "since I want this exact design. I don't want like any variations." |
| 2:00–2:35 | Pastes the HTML into Codex as a `Pasted text` attachment. Model set to **GPT-5.5**, Extra High. Prompt: `Preview this page`. Agent saves it as `pasted-preview.html` beside the project, hits a `file://` security block, and serves it over `http://127.0.0.1:8765/` instead. Worked 2m 22s. |
| 2:55–3:05 | Banner appears: *"Changing models mid-conversation will degrade performance. Start a new session for the best experience, or switch back to GPT-5.5."* He switches to **GPT-6 Astra** anyway for this one step. |
| 3:00 | **The 3D conversion prompt** (see §4). |
| 3:10–3:35 | Result after **4m 55s**: `Edited 4 files +196 −7` — `README.md`, `index.html`, **`planet-controls.js` (+112)**. Agent's summary: *"Done—grab the large planet and drag in any direction. It coasts on release, then continues its slow automatic spin. Works with mouse or touch on all three planets."* Grab-hand cursor spins Earth, Mars, Venus. |
| 3:40–4:05 | **The expansion prompt** (§4). After **14m 25s**: `Edited 5 files +567 −16` — `index.html`, `page.js`, `sections.css`. Agent: *"Added four matching sections: planet explorer, course outline, learning roadmap, and a start-learning section—plus a footer. The original fonts, cyan accents, and space aesthetic carry through. Navigation, sample quizzes, mobile layouts, and the draggable globe work."* |
| 8:45–9:05 | Deploy: Finder → project folder → drag onto Vercel `New Project` drop zone. `30 files, 57.8 MB`. Framework auto-detected **Vite**. Project name `spaceedu-3d`. Notable file list: **`dist/textures/mobile/mars.jpg` 750.5 KB, `earth-day.jpg` 463.1 KB, `venus.jpg` 229.7 KB, `earth-clouds.jpg` 965.7 KB** — a separate mobile texture set. |
| 10:05–10:20 | Live site loads at `spaceedu-3d.vercel.app`, globe draggable. |

Local project folder (`page/`): `dist`, `index.html` (42 KB), `node_modules`, `package.json`, `package-lock.json`,
`page.js`, `pasted-preview.html`, `planet-controls.js`, `public`, `README.md`, `scene.js`, `sections.css`.

**Finished section copy** (useful as a structure template):
- Hero: eyebrow `PLANET` / display `EARTH` / cyan rule / 2-line body / `GET STARTED`
- `A world of wonder. / And worlds beyond.` — right-column intro, then three planet cards, each with a numbered
  eyebrow (`02 / SOLAR SYSTEM`), a kicker (`THE LIVING PLANET`), a name, a two-line line-broken description
  (`Blue oceans. Shifting clouds. / A remarkable place to belong.`) and an arrow link. Closing line:
  `✦ Pick a planet above. Take it for a spin. Follow your curiosity.`
- `02 —— A CLOSER LOOK / Go beyond the surface.` — 3D object on the left inside orbit rings, numbered accordion
  on the right (`01 A world in motion`, `02 The air around us`, `03 Reading a planet's story`).
- CTA: `Make room for / a little wonder.` (accent word in cyan), three selectable chips `Earth · Venus · Mars`,
  white pill `START LEARNING ↗`, caption `A free first lesson. A whole new perspective.`
- Footer: wordmark, tagline `A little closer to the universe.`, three links, `Back to orbit ↑`.

### Build B — "FORM / VOID" (4:10–8:40)

A 3D design-agency landing page built **from scratch off a reference video**, no starter HTML.

| Time | What is on screen |
|---|---|
| 4:10–4:35 | Pinterest. Search box history: `3d video`, `video3d site`, `3d site`, `mountain backgorund`, `futuristic space`. He searches **`3d video`** and scrolls a grid of short looping motion clips. |
| 4:25–4:40 | Opens the pin: *"15 hours 4k Abstract Fast Moving Relaxing Sci-fi Light Tunnel Screen saver Seamless Loop Animation"* (2.8k saves, DoniVisuals). A neon square light-tunnel loop. |
| 4:45–5:10 | **Screen-records the clip** (he says he does not know how to download from Pinterest). Trim/convert dialog: quality `Very High`, dimensions `690 x 1232 (Original)`, audio unchanged, estimated size trimmed from ~6.3 MB to **~4.3 MB**; final chip reads `9s 7.3 MB`. |
| 5:15–5:30 | New Codex project named `3d videosite` (`Create project` → name → `Source folders` = folders Codex can read and edit). The MP4 is attached to the composer as `CleanShot 2026-… MP4`. |
| 5:35–6:15 | Dictates the build prompt (§4), then switches model **GPT-5.5 → GPT-6 Astra**, effort Extra High, and sends. |
| 6:20 | Result after **18m 16s**. Agent ran `npx tsc --noEmit` and `npm run lint` before previewing, and reported: *"The animation and page interactions are implemented, including a pause control and reduced-motion support."* and *"The page is loading successfully, and the 3D shaders pass compilation checks."* Then: `You've hit your usage limit.` |
| 6:20–6:55 | First output: `FORM / VOID` — full-bleed WebGL tunnel of nested neon wireframe squares (magenta outer / orange mid / cyan core), heavy sans + italic serif pairing `A different` / *`dimension.`*, sticky navbar, a dark overlay over the tunnel, project cards with images, a pause `❚❚` control. |
| 7:10 | **The correction prompt** (§4) — remove sticky nav, remove the dark overlay, less content, no images, centre it, and make content "appear out of nowhere and go out of nowhere". |
| 7:00–7:35 | Typography sourcing: `higgsfield.ai/ai/image?model=gpt_image_2` for an asset tweak, then back to `motionsites.ai` to pick a **typography pairing**. |
| 7:40 | Apple Notes: he has pasted a full MotionSites prompt in and searched it for **`fonts`** (4 matches) to lift just the font block. The visible note is a section-numbered pixel-exact spec (see §5). |
| 8:00–8:40 | Result after **7m ~40s**: *"I'll make the navbar scroll away, remove the dark overlays and project images, and reduce the page to centered text chapters. Each chapter will emerge from the tunnel's depth and fade away as you scroll. I'll also switch all text to **Chivo Mono**."* Final page is four centred mono chapters over an undimmed tunnel, with a chapter counter bottom-left. |

**Final FORM / VOID structure** — four scroll chapters with a persistent progress marker:
- `01 / 04 ——— Into the void` · `A different dimension.` · `3D design, motion & immersive experiences. / For ideas that refuse to stay flat.` · `Scroll to go deeper ↓`
- `02 / 04 ——— What we make` · `01 / WHAT WE MAKE` · `Form. Feeling. Motion.` · `Distinctive identities. Impossible images. / Entire worlds to get lost in.` · `Art direction / 3D / Motion / Interactive`
- `03 / 04 ——— How we think` · `02 / HOW WE THINK` · `Less ordinary. / More possibility.` · `A small independent studio. / Artistic instinct, technical craft, endless curiosity.`
- Earlier draft copy worth keeping: `Good design gets noticed. / Great design makes you feel something.` (accent word in lime italic serif), three columns `A small studio. An open mind.` / `Partners in the process.` / `Craft in every dimension.`
- Footer strip: `MADE OF CURIOSITY. / BUILT IN THREE DIMENSIONS.` · `SCROLL TO GO DEEPER` · `INDEPENDENT MINDS. / WORLDWIDE PERSPECTIVE.`

---

## 4. Verbatim prompt library

All transcribed from the screen.

**A1 — Preview a pasted design (cheap model, GPT-5.5):**
```
Preview this page
```
(with the copied HTML attached as `Pasted text`)

**A2 — Flat → real 3D (switch to GPT-6 Astra):**
```
Let's now turn this into an actual 3D website instead of just having the video background.
Match it as closely as possible using whatever Three.js or whatever shaders you want to use
to make it look as close as possible to the reference video.

And also, let's make it so I can spin the planet, drag it different ways, and do it all myself
```

**A3 — Expand the page in the established style:**
```
Build the rest of the page in our styles using the same kind of fonts, pairings and stuff like
that to make around four sections more.
```

**B1 — Build from scratch against an attached reference video:**
```
I want to create a landing page for a 3D design agency.

I want to have an interactive looping 3D style animation using scroll, like a tunnel, with
content revealing as I am scrolling. It should all use 3D advanced shaders techniques, looking
super close to matching the video.

Obviously, it should have content because I am not just building a video; I want it to be an
actual website
```

**B2 — The correction pass (the most transferable prompt in the video):**
```
Please remove the sticky navbar. I don't want it to be sticky. Remove the overlay, the kind of
black overlay or darkening from the background. Also, make sure that there is less content in
these sections. We don't really need images in the second sections. The content should be
centered so it kind of fits well with the tunnel that we have here. Also, it should kind of
appear out of nowhere and go out of nowhere, if you know what I mean, for this 3D effect. And
also, for the typography, let's use this one
```
(followed by the pasted font-pairing block)

**C1 — Asset iteration in Higgsfield (GPT Image 2, High, 4K):**
```
Create an image like this, but make the arrow drag icon to be 3D, the same kind of 3D cool
style as we have in our main image, because now it's just white. It doesn't look that great.
```

---

## 5. The MotionSites premium prompt format (§14–16, read at 4K)

This is the shape of the paid prompts he sells, visible in Notes at ~7:40–7:45. It is a **section-numbered,
pixel-exact spec**. Three parts are worth stealing wholesale.

**A "critical" block at the top that states the most likely failure and how to self-check:**
```
> ⚠️ CRITICAL — READ BEFORE BUILDING: This is NOT an edge-to-edge layout. There is a visible gutter
between the browser viewport and a hairline-bordered frame, and a second layer of padding between that
frame and the text inside it. Headline words (BREATHE, THE, FRESHNESS), the description paragraph, and
the nav/logo must never touch the viewport edge or the frame's inner edge. If your output has text flush
against the screen edge with no visible border box around the whole composition, it is wrong — go back
to §5 and apply the exact pixel values.
```

**§14-style responsive rules — stated as absolutes, not vibes:**
- **Headline** never uses breakpoints — pure `clamp(2rem, 9.5vw, 9.5rem)`.
- **Desktop nav links** appear only at `lg+`; "See map" appears only at `md+`; the **hamburger is always visible** at every width.
- **Label positions** shift inward as the viewport grows (right 12%→28%, left 5%→18%) so the callouts track the subject in the video.
- **Leader-line SVGs** are clamped to `h-8 w-16` below `sm`, then render at natural size.
- **Mobile menu** links are `text-2xl` → `sm:text-3xl`; close button offset `top/right-4` → `sm:6`.
- **Description paragraph** scales across five steps: `10px → 12px → 14px → 16px → 20px`.

**§15 Motion inventory — one table, every animated element:**

| Element | Property | Duration | Easing | Delay |
|---|---|---|---|---|
| Hamburger bars | transform, opacity | 300ms | `cubic-bezier(0.76,0,0.24,1)` | — |
| Menu scrim | opacity | 500ms | `cubic-bezier(0.76,0,0.24,1)` | — |
| Menu link stack | transform, opacity | 500ms | `cubic-bezier(0.76,0,0.24,1)` | — |
| Menu links (each) | opacity, translateY | 300ms | default | `100 + i*60` ms |
| Menu footer | opacity, translateY | 500ms | default | 400ms |
| Close button | scale, opacity | 400ms | `cubic-bezier(0.76,0,0.24,1)` | 150ms |
| Link underline | scaleX (origin-left) | 300ms | default | — |
| Nav/link hover | opacity → 0.7 | default | default | — |
| Callout pills | opacity | 700ms | `ease-in-out` | — |

> `cubic-bezier(0.76,0,0.24,1)` (easeInOutQuart) is the house easing curve — use it for every menu/hamburger transition.

**§16 Acceptance checks — binary, verifiable, at the end of the prompt:**
```
1. Full-bleed video autoplays, loops, muted, inline on iOS Safari.
2. Thin `white/10` frame visibly inset from the viewport edge (8-20px gutter per §5 Table 1), with four
   white corner brackets and two centered edge ticks sitting on that frame's corners — not on the
   browser's corners.
3. Headline text and the description block sit inside a second padding layer (12-32px per §5 Table 2) —
   there is visible breathing room between the frame's border and any text. Nothing touches the frame edge.
4. BREATHE / THE on the top row, FRESHNESS bottom-right, all Chivo Mono uppercase at
   clamp(2rem,9.5vw,9.5rem) with 0.9 line-height.
5. Both callout pills are invisible for the first 75% of the video and fade in over 700ms after that,
   resetting each loop.
6. Hamburger morphs to an X; overlay scrim blurs the video; links stagger in 60ms apart; body scroll is
   locked while open.
```

Scaffolding stated at the top of the same note: Vite + React 18 + TypeScript + Tailwind CSS 3,
`"type": "module"`, path alias `@` → `./src`, `src/main.tsx` → `src/App.tsx` → `src/components/Hero.tsx`
(App renders `<Hero />` and nothing else), Chivo Mono from Google Fonts with preconnects, and an
`index.css` reset. Note this is React **18** + Tailwind **3**, not the React 19 / Tailwind 4 stack in
the older Viktor prompt we already captured.

---

## 6. The repeatable method

1. **Pick the motion first, from video.** Pinterest → search a motion word (`3d video`), not a website word.
   Scroll to something that fits the client's niche. Screen-record 5–9 seconds; trim to roughly 4–7 MB.
   The clip is the spec — you will tell the model to match it.
2. **Open a project, not a chat.** ChatGPT desktop → Codex → `Create project`, name it, point `Source folders`
   at a real local folder. `Full access` on, branch shown, everything lands on disk as a Vite project.
3. **Use the cheap model for plumbing.** Paste static HTML, `Preview this page` on GPT-5.5. Let it stand up a
   local server (`file://` is blocked; it serves over `http://127.0.0.1:8765/`). Now you can see something.
4. **Switch to the strong model for exactly the 3D step**, and accept the app's mid-thread warning, or start a
   new session. Never leave the strong model on for the whole thread — he explicitly downgrades for previews.
5. **Ask for real 3D and real interaction in the same breath.** "an actual 3D website instead of just having
   the video background" + "match … to the reference video" + "so I can spin it, drag it different ways".
   That yields drag + coast-on-release + auto-spin, on mouse and touch, in its own control file.
6. **Correct with subtraction, then depth.** First pass will over-deliver: sticky nav, dark overlay, images,
   too much copy. Strip it — "less content", "we don't really need images", "centered so it fits the tunnel" —
   then add the one motion idea: **"appear out of nowhere and go out of nowhere"**. That single phrase is what
   turns a scrolling page into depth-based chapters.
7. **Supply the typography explicitly.** Left alone the model picks "really weird fonts". Paste a named font
   pairing block. His trick: keep prompt libraries in Notes and search them for `fonts`.
8. **Expand only after the look is locked.** "Build the rest of the page in our styles using the same kind of
   fonts, pairings and stuff like that to make around four sections more."
9. **Ship the folder.** Drag the built folder onto the host. Framework auto-detects as Vite.
   *(House rule: we deploy to Cloudflare Pages, not Vercel. Same drag-the-dist shape.)*

**Timings, so expectations are right:** preview 2m 22s · flat→3D 4m 55s · four extra sections 14m 25s ·
from-scratch shader build 18m 16s · correction pass ~7m 40s. This is not a chat, it is a build queue.

---

## 7. What he says to avoid

- **Do not switch models mid-conversation** — the app itself warns it degrades performance; start a new session.
- **Do not burn the expensive model on plumbing** — "you don't need to really spend a lot of credits creating
  the UI."
- **Do not let it choose type** — "without the pairing … we have really weird fonts."
- **Do not accept the first pass's content density** — every first output had a sticky nav, a darkening overlay,
  filler images and too much copy.
- **Do not copy the "full prompt" if you want that exact design** — copy the HTML instead, "since I want this
  exact design. I don't want like any variations."
- Things he flags as still wrong in his own demo: the background wants to be brighter, the fonts want changing,
  and "the colors can be improved".

---

## 8. Notes for our stack

- **Deploy target is Cloudflare Pages**, not Vercel (house rule). The method is unchanged — build with Vite,
  drag/upload the `dist`.
- **Mobile texture set is a real, copyable technique**: `dist/textures/mobile/*.jpg` at 230–970 KB each,
  separate from desktop textures.
- The agent volunteered **`prefers-reduced-motion` support and a pause control** on the shader page. Make that
  an explicit requirement rather than a lucky default — our `design-verify` skill checks reduced motion.
- `tsc --noEmit` + `npm run lint` ran before preview. Keep that in the prompt.
- Reference-video sourcing through Pinterest should go through **Comet**, per house rules — never Chrome.
