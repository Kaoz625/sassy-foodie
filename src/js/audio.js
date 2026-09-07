/* Sassy Foodie — the room tone.
 *
 * Rules this file exists to enforce:
 *   1. It NEVER autoplays. Browsers block it anyway, and a food page that
 *      starts talking at you is a page you close.
 *   2. It downloads NOTHING until somebody asks for sound. The <audio> element
 *      is not built until the first tap, so a phone on cellular pays 0 bytes.
 *   3. If the file is missing or the browser refuses to play it, the control
 *      removes itself. A dead button is worse than no button.
 *
 * The choice is remembered for the session only. Next visit starts quiet.
 */
(function () {
  'use strict';

  var SRC = './assets/audio/kitchen-loop.mp3';
  var KEY = 'sf_sound';
  var FADE = 700; // ms
  var VOL = 0.32; // she is the main event, not the music

  var btn = document.querySelector('[data-sound]');
  if (!btn) return;

  var el = null;
  var timer = null;
  var wanted = false;

  function label(on) {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Turn the music off' : 'Turn the music on');
    btn.classList.toggle('is-on', on);
  }

  function kill() {
    // Missing file, blocked codec, anything: take the control away.
    if (el) { try { el.pause(); } catch (e) {} el = null; }
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    if (btn.parentNode) btn.parentNode.removeChild(btn);
  }

  function fade(to, done) {
    clearInterval(timer);
    if (!el) return;
    var from = el.volume;
    var start = performance.now();
    timer = setInterval(function () {
      if (!el) { clearInterval(timer); return; }
      var t = Math.min(1, (performance.now() - start) / FADE);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * t));
      if (t === 1) { clearInterval(timer); if (done) done(); }
    }, 30);
  }

  function build() {
    el = new Audio();
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0;
    el.addEventListener('error', kill);
    el.src = SRC;
    return el;
  }

  function on() {
    if (!el) build();
    var p = el.play();
    // play() rejects on a blocked gesture or an undecodable file. Both mean
    // "this control is lying to the user", so both take it down.
    if (p && p.catch) {
      p.then(function () { fade(VOL); }).catch(kill);
    } else {
      fade(VOL);
    }
    wanted = true;
    label(true);
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }

  function off() {
    wanted = false;
    label(false);
    try { sessionStorage.setItem(KEY, '0'); } catch (e) {}
    if (el) fade(0, function () { if (el) el.pause(); });
  }

  btn.addEventListener('click', function () {
    if (btn.getAttribute('aria-pressed') === 'true') off(); else on();
  });

  // Leaving the tab should not leave music playing behind it.
  document.addEventListener('visibilitychange', function () {
    if (!el) return;
    if (document.hidden) { try { el.pause(); } catch (e) {} }
    else if (wanted) { try { el.play(); } catch (e) {} }
  });

  label(false);

  // Carry the choice across a page change inside one visit. This is a real
  // user gesture continuing, not an autoplay, but browsers can still refuse —
  // and if they do, kill() cleans up rather than leaving a stuck button.
  try {
    if (sessionStorage.getItem(KEY) === '1') on();
  } catch (e) {}
})();
