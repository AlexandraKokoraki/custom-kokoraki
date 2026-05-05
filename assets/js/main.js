/* ==========================================================================
   main.js — Minimal vanilla JS
   --------------------------------------------------------------------------
   Two responsibilities only:
     1. Mobile navigation toggle
     2. IntersectionObserver-based scroll reveals
   No frameworks, no dependencies. ~1KB minified.
   ========================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------------------
     1. Mobile navigation toggle
     ----------------------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!isOpen));
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    /* Close menu on link click */
    nav.querySelectorAll('.nav__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* -----------------------------------------------------------------------
     2. Scroll reveal — respect prefers-reduced-motion
     ----------------------------------------------------------------------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.scroll-reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Reduced motion: show everything immediately */
    document.querySelectorAll('.scroll-reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* -----------------------------------------------------------------------
     3. Lazy-load Google Maps embed (click-to-load, GDPR-friendly)
     ----------------------------------------------------------------------- */
  const mapPlaceholder = document.querySelector('[data-map-load]');
  if (mapPlaceholder) {
    mapPlaceholder.addEventListener('click', function () {
      const src = mapPlaceholder.getAttribute('data-map-src');
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = '0';
      iframe.loading = 'lazy';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.title = 'Google Maps — Υψηλάντου 24, Κερατσίνι';
      mapPlaceholder.innerHTML = '';
      mapPlaceholder.appendChild(iframe);
    }, { once: true });
  }
})();
