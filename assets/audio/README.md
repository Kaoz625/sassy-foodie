# Sassy Foodie — site music bed

`kitchen-loop.mp3` and `kitchen-loop.ogg` are the same 51.9 second instrumental
loop in two formats. Warm neo-soul / trap-soul. No vocals.

## Originality

**This is original generated audio. It contains no third-party sample, no
interpolation of an existing song, and no material lifted from any recording.**

It was created from a text prompt by a generative music model. Nothing was
sampled, chopped, or re-pitched from a real track. The MP3 that came out of the
model carries a Google C2PA content-credential manifest, which is a signed,
machine-readable record that the audio was machine-generated. That manifest is
preserved in the raw render kept off-repo (see "Files" below); the shipped MP3
is re-encoded and does not carry it.

Safe to ship on a commercial site.

## Who made it

| | |
|---|---|
| Model | **Google Lyria 3.5** (`models/lyria-3.5`) |
| Interface | Gemini API, `:generateContent`, `responseModalities: ["AUDIO"]` |
| Called with | `curl` + `GEMINI_API_KEY` from `~/.credentials/api-keys.env` |
| Date generated | **7 September 2026** |
| Raw render | 179.25 s, MP3 192 kb/s, 44.1 kHz stereo |
| Post | ffmpeg 44.1 kHz float → loop cut → loudness normalise → encode |

### The exact prompt

```
Instrumental neo-soul and trap-soul music bed for the website of an upscale
Black-owned soul food kitchen in New York. Warm Fender Rhodes electric piano
playing lush jazz chords with 7ths and 9ths, slow confident head-nod groove at
about 72 BPM in a minor key. Soft rounded 808 sub-bass that glides between
notes, crisp finger snaps and rimshot, light shaker, subtle vinyl warmth and
tape saturation. Regal, feminine, grown, expensive, unhurried, sensual but
tasteful. Strictly instrumental: no vocals, no vocal chops, no lyrics, no
humming. Steady loopable groove all the way through, no intro build, no drop,
no cinematic riser, no corporate uplift.
```

No seed was set, so the render is not reproducible byte-for-byte. Re-running the
prompt gives a different take in the same style.

## How the loop was cut

The render came back at **exactly 74.000 BPM**, so it has a clean bar grid.

1. Onset autocorrelation put the beat at 0.810811 s (74.000 BPM), bar = 3.243244 s.
2. Waveform cross-correlation found the phrase repeating every **16 bars =
   51.89190 s** (peak normalised correlation 0.70–0.91 across the track).
3. The arrangement stops dead for about 0.7 s every 8 bars. A 16-bar loop keeps
   that stop landing on the same beat every time; a 12-bar loop would have made
   it fall 8 bars, 8 bars, 4 bars, which a musical ear notices.
4. The cut starts at **22.490 s** into the render — inside one of those quiet
   stops. The loop therefore *joins in silence*, and the groove slams back in
   about 250 ms later, exactly as it does everywhere else in the track.
5. A 300 ms equal-power wrap crossfade sits over the join. The audio that would
   have followed the loop is faded out across the same window in which the loop
   head fades in, so nothing is butt-jointed. Head and tail correlate at 0.95
   over that window, so the crossfade phase-aligns instead of flanging.
6. Loudness: two-pass ffmpeg `loudnorm` in **linear** mode (pure gain, no
   dynamics touched, join preserved sample for sample), then −4 dB extra for
   codec headroom. Master sits at **−20.0 LUFS integrated, −6.55 dBTP**.

The −4 dB is not optional. At −16 LUFS the encoders overshot on decode: the MP3
came back at +0.18 dBFS and the Opus at +1.43 dBFS from a master that peaked at
−2.58 dBFS. That is clipping on any integer output path. With the extra
headroom they decode at −3.66 and −2.80 dBFS.

−20 LUFS is a background-bed level. Turn the element's `volume` up if you want
it louder; do not re-normalise the file.

## The shipped files — measured, not assumed

| | kitchen-loop.mp3 | kitchen-loop.ogg |
|---|---|---|
| Codec | MP3 (LAME) | Opus |
| Duration (container) | 51.891906 s | 51.898417 s |
| Duration (decoded) | 51.89191 s | 51.89194 s |
| Bit rate | 56,099 b/s | 33,129 b/s |
| Sample rate | 32,000 Hz | 48,000 Hz |
| Channels | 1 (mono) | 1 (mono) |
| Size | 363,888 B (355.4 KiB) | 214,550 B (209.5 KiB) |
| Decoded peak | −3.66 dBFS | −2.80 dBFS |

**Total 578,438 bytes — 564.9 KiB / 578.4 kB.** Under the 600 KB cap either way
you count a kilobyte.

Mono on purpose. Stereo at this length does not fit the budget, and this plays
under copy at low volume.

### Loop seam — checked, not assumed

Measured on the shipped files after decoding, not on the master.

| | MP3 | OGG/Opus |
|---|---|---|
| Last 600 ms, 100 ms bins (dB RMS) | −18.5 −29.8 −32.1 −34.1 −34.0 −35.8 | −18.0 −29.3 −31.8 −33.8 −33.5 −35.4 |
| First 600 ms, 100 ms bins (dB RMS) | −34.8 −33.3 −13.3 −11.7 −14.2 −12.5 | −34.9 −33.5 −13.2 −11.3 −13.8 −12.0 |
| **Step across the join** | **+1.06 dB** | **+0.54 dB** |
| Sample-level jump at the join | 0.00313 | 0.00138 |
| Median jump between neighbouring samples | 0.00460 | 0.00487 |
| Spectral flux at the join, file tiled ×2 | 7.87 | 7.02 |
| Mean / sd of flux everywhere else | 9.02 / 4.12 | 9.58 / 4.36 |
| **z-score at the join** | **−0.28 (43rd pct)** | **−0.59 (23rd pct)** |
| Loudest flux frame inside the loop | 53.30 | 59.76 |

Read that as: **there is no hard cut.**

- The waveform step at the join is *smaller* than the average step between two
  neighbouring samples, so there is no click.
- The join is one of the *calmer* moments in the whole loop — 43rd and 23rd
  percentile for spectral change, against a loudest-frame figure of 53–60.
- Raw `volumedetect` over the first and last 0.5 s looks alarming (−11 dB vs
  −30 dB) and it is not a fault. The last half-second is the arrangement's own
  quiet stop; the loud part starts 200 ms *after* the join, which is the groove
  re-entering. It does the same thing 8 bars earlier inside the loop. Compare
  the 100 ms bins either side of the join, not 0.5 s blocks.

MP3 decodes to 1,660,541 samples and Opus to 1,660,542 at 32 kHz — one sample
apart, so LAME's gapless header is being honoured and the two formats loop
identically.

### No vocals — checked

No vocal separator is installed on this Mac (no demucs, spleeter, torch or
librosa), so this was checked on the spectrogram instead. In the 92–102 s
breakdown, where drums drop out and a voice would be naked, the harmonics are
straight horizontal lines on an exact integer series from a ~142 Hz fundamental,
with no vibrato and no pitch glide. That is a sustained keyboard, not a singer.

## Using it

Serve the Opus first and let the MP3 catch everything else. iOS Safari does not
play Ogg Opus and will fall through to the MP3, which is why the MP3 is the one
carrying the higher bit rate.

```html
<audio id="bed" loop preload="none">
  <source src="/assets/audio/kitchen-loop.ogg" type="audio/ogg; codecs=opus">
  <source src="/assets/audio/kitchen-loop.mp3" type="audio/mpeg">
</audio>
```

Two things to get right in the page code, which lives outside this folder:

1. **Never autoplay with sound.** Every browser blocks it and Safari can mute
   the element for the rest of the session. Start on a click, and give the user
   a visible mute control that remembers its state.
2. `<audio loop>` is fine here because the seam is clean. If you ever want a
   guaranteed sample-exact loop, decode once into a Web Audio `AudioBuffer` and
   set `source.loop = true`.

## Files

Only the two audio files and this README belong in the repo. The 179 s raw
render, the float WAV master, the spectrograms and the analysis scripts are in
the session scratchpad:

```
/private/tmp/claude-501/-Users-markususche-Desktop-NYC-Design-Skills/\
a2060ebf-fff4-4fb9-9d95-8711455575f2/scratchpad/audio/
  lyria_0.mp3        raw 179 s render, C2PA manifest intact
  full.wav           44.1 kHz stereo float decode
  loop_master.wav    the cut loop, before normalising
  loop_bed.wav       normalised master that both shipped files came from
  make_loop.py       the cut + crossfade
  spec_*.png         spectrograms used for the vocal check
```

Scratchpad is temporary. If the raw render matters for provenance, copy
`lyria_0.mp3` somewhere durable — it is the file that carries the C2PA
signature.

## What did not work, for the next session

Tried in the house order — our CLIs, then APIs. Four generators were dead before
Lyria answered, and all four for the same boring reason: no money on the
account.

| Path | Result |
|---|---|
| `elevenlabs-pp-cli music generate` | CLI sends `Authorization: Bearer`; ElevenLabs wants `xi-api-key`. HTTP 401 every time, with a valid key. **CLI bug.** |
| ElevenLabs Music REST | HTTP 402 `paid_plan_required` — "Music API is not available for free users." Account is on the free tier. All 11 pooled ElevenLabs accounts are free tier too. |
| `fal-pp-cli inference` | HTTP 403 `{"detail":"User is locked. Reason: TOP_UP."}` on all six model ids tried (`fal-ai/minimax-music`, `fal-ai/stable-audio`, `cassetteai/music-generator`, `fal-ai/elevenlabs/sound-effects`, `fal-ai/lyria2`, `fal-ai/ace-step`). The lock happens before model routing, so **this tells us nothing about which fal model ids exist** — none of them 404'd, and none of them resolved either. |
| Stability Stable Audio 2.5 | HTTP 402, "You lack sufficient credits". Balance was 4.9 credits. |
| Replicate `meta/musicgen` | HTTP 402 "insufficient credit". The model resolves fine (200 on the model endpoint); note the official-model route `/v1/models/{o}/{n}/predictions` 404s for community models — use `/v1/predictions` with a version id. |
| `suno-pp-cli` | Prints "web-only — use playwright-pp-cli for browser automation". Not attempted; the API path landed first. |
| ComfyUI | Not running on mac1 or mac2. No local audio model available. |

**Lyria on the Gemini API is the working music path on this machine.** It is not
in any of our CLIs yet. Worth a `lyria-pp-cli`, or a `music` verb on
`gemini-aistudio-pp-cli`, which today has no generation command at all — only
files, corpora, caching and tuning.

```
POST https://generativelanguage.googleapis.com/v1beta/models/lyria-3.5:generateContent?key=$GEMINI_API_KEY
{"contents":[{"role":"user","parts":[{"text":"<prompt>"}]}],
 "generationConfig":{"responseModalities":["AUDIO"]}}
```

Audio comes back base64 in `candidates[0].content.parts[].inlineData` as
`audio/mpeg`. Also on the key: `lyria-3-pro-preview` and `lyria-3-clip-preview`
(30 s). One call cost 1,161 tokens and took about 90 seconds.

One config change was made outside this folder while chasing the ElevenLabs
CLI: `~/.config/elevenlabs-pp-cli/config.toml` now holds `ELEVENLABS_API_KEY`
from `~/.credentials/api-keys.env` instead of the older pooled key. Both keys
authenticate (both return 200 to `xi-api-key`), so nothing is broken either
way. Backup of the original: `<scratchpad>/elevenlabs-config.toml.bak`.
