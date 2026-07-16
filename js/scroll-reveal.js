/* Section reveals via IntersectionObserver.
   Subtle fade/slide only — no bounce, no elastic (DESIGN.md motion rule).

   Reveals are progressive enhancement layered on top of content that is
   already in the HTML, so the overriding rule is: NOTHING may stay hidden.
   The base .reveal style sets opacity:0, which means a reveal that never
   fires is a blank page. Guarded four ways:

     1. .no-js .reveal in main.css        — JS disabled entirely
     2. prefers-reduced-motion            — reveal immediately, no movement
     3. no IntersectionObserver           — reveal immediately
     4. sweep()                           — IO present but never delivered
                                            (e.g. the page was loaded in a
                                            background tab and intersections
                                            were never computed)

   sweep() is a manual geometric check rather than a blanket "show
   everything": it only reveals what is genuinely on screen, so the effect
   still works normally when it runs alongside a healthy observer. */
(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!items.length) return;

  function show(el) {
    el.classList.add('is-visible');
  }

  function revealAll() {
    items.forEach(function (el) {
      el.style.removeProperty('--reveal-delay'); // no stagger when not animating
      show(el);
    });
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target); // reveal once; don't re-hide on scroll up
    });
  }, {
    // Fire a little before the element's edge so the motion finishes as it
    // arrives rather than starting after it's already been read.
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.08
  });

  items.forEach(function (el) { observer.observe(el); });

  // Failsafe (4): reveal anything actually within the viewport that the
  // observer hasn't accounted for. Cheap, idempotent, and preserves the
  // effect for everything still off screen.
  function sweep() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach(function (el) {
      if (el.classList.contains('is-visible')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        show(el);
        observer.unobserve(el);
      }
    });
  }

  // A tab loaded in the background may never have intersections computed;
  // sweep once it is actually looked at, and again as a late backstop.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') sweep();
  });
  window.addEventListener('load', sweep);
  window.setTimeout(sweep, 2500);

  // If the user turns reduced-motion on mid-session, stop animating.
  function onReducedChange() {
    if (reduced.matches) {
      observer.disconnect();
      revealAll();
    }
  }
  if (reduced.addEventListener) reduced.addEventListener('change', onReducedChange);
  else if (reduced.addListener) reduced.addListener(onReducedChange);
})();
