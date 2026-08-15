/* Albany Junk Removal — shared front-end behavior (loaded on every page) */
(function () {
  // Header shadow on scroll
  var header = document.querySelector('header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu open/close
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    var toggle = function (open) {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { toggle(!menu.classList.contains('open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { toggle(false); }); });
  }

  // Mobile accordions (Services, Service Area, …) — hover dropdowns don't work on touch.
  // Each .m-acc-btn toggles the .m-acc-panel immediately after it.
  document.querySelectorAll('.m-acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling;
      if (!panel) return;
      var open = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4 * 70) + 'ms';
      io.observe(el);
    });
  }

  // Quote form (present on the homepage, service pages, and services hub).
  // Submits to Netlify Forms via AJAX so the inline success state shows without
  // a page navigation. Add an email notification under Forms in Netlify to get
  // each lead in your inbox. Falls back to the success message on local preview.
  var form = document.getElementById('quoteForm');
  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var errorEl = null;
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (errorEl) { errorEl.remove(); errorEl = null; }
      submitBtn.disabled = true;
      var original = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      var showSuccess = function () {
        form.style.display = 'none';
        var s = document.getElementById('formSuccess');
        if (s) s.classList.add('show');
      };
      try {
        var body = new URLSearchParams(new FormData(form)).toString();
        var res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body });
        if (!res.ok) throw new Error('Network response was not ok');
        showSuccess();
      } catch (err) {
        if (location.protocol === 'file:') { showSuccess(); return; }
        submitBtn.disabled = false;
        submitBtn.textContent = original;
        errorEl = document.createElement('p');
        errorEl.className = 'form-note';
        errorEl.style.color = '#B4341F';
        errorEl.textContent = 'Something went wrong sending your request. Please call (503) 877-4254 or try again.';
        submitBtn.insertAdjacentElement('afterend', errorEl);
      }
    });
  }

  // Cleanout cards: tap to reveal the "after" on touch (hover handles desktop)
  document.querySelectorAll('.clean-photo.ba-hover').forEach(function (el) {
    el.addEventListener('click', function () { el.classList.toggle('revealed'); });
  });

  // Before / after comparison slider
  var ba = document.getElementById('ba');
  var baRange = document.getElementById('baRange');
  if (ba && baRange) {
    var setPos = function () { ba.style.setProperty('--pos', baRange.value + '%'); };
    baRange.addEventListener('input', setPos);
    setPos();
  }

  // --- Conversion tracking (GA4 events) ---
  function track(name, params){ try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch (e) {} }
  function sectionOf(el){
    var s = el.closest('section, header, footer, .mobile-bar');
    if (!s) return 'page';
    if (s.classList && s.classList.contains('mobile-bar')) return 'mobile_bar';
    if (s.tagName === 'HEADER') return 'header';
    if (s.tagName === 'FOOTER') return 'footer';
    if (s.classList && s.classList.contains('hero2')) return 'hero';
    if (s.classList && s.classList.contains('final')) return 'final';
    return s.id || 'page';
  }
  document.querySelectorAll('a[href^="sms:"]').forEach(function (a) {
    a.addEventListener('click', function () { track('text_photos_click', { location: sectionOf(a) }); });
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () { track('call_click', { location: sectionOf(a) }); });
  });
  document.querySelectorAll('.clean-card .btn').forEach(function (a) {
    a.addEventListener('click', function () {
      var href = a.getAttribute('href') || '';
      var svc = href.indexOf('garage') > -1 ? 'garage' : href.indexOf('estate') > -1 ? 'estate' : href.indexOf('office') > -1 ? 'rental' : 'other';
      track('service_card_click', { service: svc });
    });
  });
  var trackForm = document.getElementById('quoteForm');
  if (trackForm) {
    trackForm.addEventListener('submit', function () { if (trackForm.checkValidity()) track('quote_form_submit'); });
  }

  // Current year in footer
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
