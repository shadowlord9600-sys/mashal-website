/* Hero load sequence — the site's one orchestrated moment.
       builder visual settles in -> copy sequences in -> the builder's
       type-and-assemble loop takes over, floating gently.
   Timings live in home.css so the sequence reads in one place; this file only
   decides WHETHER to run it and WHEN to start.

   Under prefers-reduced-motion the whole thing is skipped and the hero is
   shown in its final state — content is never withheld, only movement. */
(function () {
  'use strict';

  var hero = document.getElementById('hero');
  if (!hero) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var started = false;

  /* Final state, no animation.
     Note this must clear EVERY element the stylesheet starts hidden — both
     .hero-seq and .hero__visual are at opacity 0 under .js, so missing either
     one leaves it permanently invisible for reduced-motion users. */
  function settle() {
    hero.classList.remove('is-ready');
    hero.classList.add('is-settled');

    var hidden = hero.querySelectorAll('.hero-seq, .hero__visual');
    for (var i = 0; i < hidden.length; i++) {
      hidden[i].style.opacity = '1';
      hidden[i].style.transform = 'none';
      hidden[i].style.animation = 'none';
    }
  }

  function play() {
    if (started) return;
    started = true;
    hero.classList.add('is-ready');
  }

  function begin() {
    if (started) return;
    if (reduced.matches) { settle(); return; }

    // The builder visual is pure CSS — nothing to wait for.
    play();
  }

  /* Start only once the page is actually on screen. A tab opened in the
     background isn't painted, so rAF never fires and CSS animations are
     throttled — starting there would burn the sequence while nobody is
     looking, and the visitor would arrive at an already-finished hero. */
  if (document.visibilityState === 'hidden') {
    document.addEventListener('visibilitychange', function onVis() {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', onVis);
      begin();
    });
  } else {
    begin();
  }

  function onReducedChange() { if (reduced.matches) settle(); }
  if (reduced.addEventListener) reduced.addEventListener('change', onReducedChange);
  else if (reduced.addListener) reduced.addListener(onReducedChange);

  /* Failsafe: if anything throws or an animation never fires, make sure the
     hero is readable anyway. Only judge a visible page — a hidden one is
     legitimately unstarted, not broken. */
  window.setTimeout(function () {
    if (document.visibilityState !== 'visible') return;
    var title = hero.querySelector('.hero__title');
    if (title && window.getComputedStyle(title).opacity === '0') settle();
  }, 4000);
})();
