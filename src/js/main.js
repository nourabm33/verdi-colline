(function () {
  'use strict';

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? toggle.dataset.close : toggle.dataset.open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* Slideshows: continuous sliding carousel, runs on its own (pauses only when the tab is hidden) */
  Array.prototype.forEach.call(document.querySelectorAll('[data-slideshow]'), function (box) {
    var track = box.querySelector('.slide-track');
    var slides = track ? track.querySelectorAll('.slide') : [];
    var dots = box.querySelectorAll('[data-slide]');
    var n = slides.length;
    if (n < 2) return;

    // Clone the first slide at the end so the last -> first step slides forward seamlessly.
    var clone = slides[0].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    Array.prototype.forEach.call(clone.querySelectorAll('img'), function (im) { im.loading = 'lazy'; im.removeAttribute('fetchpriority'); });
    track.appendChild(clone);

    var i = 0, timer = null;
    var render = function (idx, animate) {
      track.classList.toggle('no-anim', !animate);
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    };
    var markDot = function (idx) {
      Array.prototype.forEach.call(dots, function (d, k) {
        if (k === idx % n) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      Array.prototype.forEach.call(slides, function (s, k) {
        if (k === idx % n) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
    };
    var go = function (idx) {
      if (idx > n) { render(0, false); void track.offsetWidth; idx -= n; }
      i = idx;
      render(i, true);
      markDot(i);
    };
    track.addEventListener('transitionend', function (e) {
      if (e.target !== track || i !== n) return;
      i = 0;
      render(0, false);
      // Force reflow so the next transform change animates again.
      void track.offsetWidth;
      track.classList.remove('no-anim');
    });

    var stop = function () { clearInterval(timer); timer = null; };
    var start = function () {
      if (timer || document.hidden) return;
      timer = setInterval(function () { go(i + 1); }, 3200);
    };
    Array.prototype.forEach.call(dots, function (d, k) {
      d.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); go(k); stop(); start(); });
    });
    var sx = null;
    box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { go(dx < 0 ? i + 1 : (i === 0 ? n - 1 : i - 1)); stop(); start(); }
      sx = null;
    });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    markDot(0);
    render(0, false);
    start();
  });

  /* Lightbox */
  var lb = document.getElementById('lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox] .gallery-item'));
  if (lb && items.length) {
    var img = lb.querySelector('img');
    var cap = lb.querySelector('figcaption');
    var index = 0;
    var lastFocus = null;
    var show = function (i) {
      index = (i + items.length) % items.length;
      var a = items[index];
      img.src = a.getAttribute('href');
      img.alt = a.dataset.alt || '';
      cap.textContent = a.dataset.alt || '';
    };
    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.classList.add('menu-open');
      lb.querySelector('[data-lb-close]').focus();
    };
    var close = function () {
      lb.hidden = true;
      document.body.classList.remove('menu-open');
      img.src = '';
      if (lastFocus) lastFocus.focus();
    };
    items.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });
    lb.querySelector('[data-lb-close]').addEventListener('click', close);
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(index - 1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(index + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });
    var startX = null;
    lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(dx < 0 ? index + 1 : index - 1);
      startX = null;
    });
  }

  /* Contact form -> WhatsApp message */
  var form = document.querySelector('[data-whatsapp-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var lines = [form.dataset.intro];
      var labels = {};
      form.querySelectorAll('label').forEach(function (l) {
        var field = l.querySelector('input, textarea');
        if (field) labels[field.name] = l.firstChild.textContent.trim().replace(/\s*\(.*\)$/, '');
      });
      ['name', 'dates', 'guests', 'message'].forEach(function (k) {
        var v = (f.get(k) || '').toString().trim();
        if (v) lines.push(labels[k] + ': ' + v);
      });
      window.open(form.dataset.wa + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }

  /* Cookie consent (technical cookies only; non-essential stays off without consent) */
  var KEY = 'vc-consent';
  var banner = document.getElementById('cookie-banner');
  if (banner) {
    var read = function () {
      try { return JSON.parse(localStorage.getItem(KEY)); } catch (err) { return null; }
    };
    var write = function (analytics) {
      try { localStorage.setItem(KEY, JSON.stringify({ analytics: !!analytics, date: new Date().toISOString() })); } catch (err) { /* storage unavailable */ }
      document.dispatchEvent(new CustomEvent('vc:consent', { detail: { analytics: !!analytics } }));
      banner.hidden = true;
    };
    var stored = read();
    if (!stored) banner.hidden = false;
    else document.dispatchEvent(new CustomEvent('vc:consent', { detail: { analytics: !!stored.analytics } }));

    var prefs = banner.querySelector('.cookie-prefs');
    var saveBtn = banner.querySelector('[data-cookie="save"]');
    var manageBtn = banner.querySelector('[data-cookie="manage"]');
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      var action = btn.dataset.cookie;
      if (action === 'accept') write(true);
      else if (action === 'reject') write(false);
      else if (action === 'manage') { prefs.hidden = false; saveBtn.hidden = false; manageBtn.hidden = true; }
      else if (action === 'save') write(prefs.querySelector('[name="analytics"]').checked);
    });
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
