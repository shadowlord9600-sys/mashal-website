/* Mobile nav toggle + scrolled state.
   Keeps aria-expanded truthful, closes on Escape / outside click / resize to
   desktop, and moves focus sensibly. */
(function () {
  'use strict';

  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');
  var nav = document.getElementById('nav');
  if (!toggle || !menu || !nav) return;

  var DESKTOP = window.matchMedia('(min-width: 48em)');

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('data-open', String(open));
    // Lock the page behind the panel only while it covers the viewport.
    document.body.style.overflow = open && !DESKTOP.matches ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setOpen(!isOpen());
  });

  // Any link tap closes the panel — same-page anchors otherwise leave it open
  // covering the section the visitor just asked to see.
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a') && !DESKTOP.matches) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!isOpen() || DESKTOP.matches) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });

  // Crossing into desktop must clear the mobile-only state, or the body stays
  // locked and the panel keeps its inline flags.
  function onBreakpoint() {
    if (DESKTOP.matches) setOpen(false);
  }
  if (DESKTOP.addEventListener) DESKTOP.addEventListener('change', onBreakpoint);
  else if (DESKTOP.addListener) DESKTOP.addListener(onBreakpoint);

  // Densify the bar once it's no longer over the top of the hero.
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
