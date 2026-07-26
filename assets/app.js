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

  // Mobile "Services" accordion (hover dropdowns don't work on touch)
  var accBtn = document.getElementById('mAccBtn');
  var accPanel = document.getElementById('mAccPanel');
  if (accBtn && accPanel) {
    accBtn.addEventListener('click', function () {
      var open = accPanel.classList.toggle('open');
      accBtn.setAttribute('aria-expanded', open);
    });
  }

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

  // Current year in footer
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
