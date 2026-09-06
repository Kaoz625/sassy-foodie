/* The 21+ door on the Infusion menu.
   Hidden by default in the HTML so a JS-off browser is not locked out of a page
   it cannot interact with anyway; JS shows it unless this browser already
   confirmed. Session-scoped on purpose — closing the browser re-asks. */
(function () {
  'use strict';
  var gate = document.getElementById('gate');
  if (!gate) return;

  var KEY = 'sf_age_ok';
  var ok = false;
  try { ok = sessionStorage.getItem(KEY) === '1'; } catch (e) { ok = false; }

  if (ok) return;                       // already confirmed this session

  gate.hidden = false;
  document.body.style.overflow = 'hidden';

  var yes = document.getElementById('gate-yes');
  var focusables = gate.querySelectorAll('button, a[href]');
  var first = focusables[0], last = focusables[focusables.length - 1];
  if (yes) yes.focus();

  // keep focus inside the door while it is up
  gate.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  if (yes) {
    yes.addEventListener('click', function () {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* private mode: just let them through */ }
      gate.hidden = true;
      document.body.style.overflow = '';
      var h1 = document.querySelector('main h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus(); }
    });
  }
})();
