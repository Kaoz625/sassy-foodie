/* Chef Daija — shared site behaviour.
   Owns the DOM. Three.js owns the canvas. No animation libraries are mixed
   here — see DESIGN.md §5 (house CRITICAL rule). */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- mobile nav ------------------------------------------------------ */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.getAttribute('data-open') === 'true';
      links.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
    // close on escape so keyboard users are not trapped
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.getAttribute('data-open') === 'true') {
        links.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* --- mark the current page in the nav -------------------------------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (here === 'index.html' && href === './')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* --- reveal on scroll ------------------------------------------------ */
  var revealables = document.querySelectorAll('.rv');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('is-in'); }, (i % 6) * 60);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* --- the scale beam tips with scroll (DESIGN.md §5) ------------------ */
  var beams = document.querySelectorAll('.beam');
  if (beams.length && !reduced) {
    var ticking = false;
    var tip = function () {
      beams.forEach(function (b) {
        var r = b.getBoundingClientRect();
        var p = 1 - (r.top / window.innerHeight);      // 0 entering, 1 passed
        var deg = Math.max(-2.4, Math.min(2.4, (p - 0.5) * 4.8));
        b.style.setProperty('--tilt', deg.toFixed(2) + 'deg');
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(tip);
    }, { passive: true });
    tip();
  }

  /* --- footer year ----------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
