(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.tabs')).forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('.tab'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.classList.remove('is-active');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        var activePanel = document.getElementById(tab.getAttribute('aria-controls'));
        if (activePanel) activePanel.classList.add('is-active');
      });
    });
  });

  var pagerBtns = Array.prototype.slice.call(document.querySelectorAll('.pager-btn'));
  var pagerPrev = document.getElementById('pager-prev');
  var pagerNext = document.getElementById('pager-next');

  function activatePage(index) {
    if (index < 0 || index >= pagerBtns.length) return;
    pagerBtns.forEach(function (btn, i) {
      var active = i === index;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
      var page = document.getElementById(btn.getAttribute('aria-controls'));
      if (page) page.classList.toggle('is-active', active);
    });
    if (pagerPrev) pagerPrev.disabled = index === 0;
    if (pagerNext) pagerNext.disabled = index === pagerBtns.length - 1;

    document.querySelectorAll('.conv-page audio').forEach(function (a) {
      if (!a.paused) a.pause();
    });
  }

  function currentPage() {
    return pagerBtns.findIndex(function (btn) {
      return btn.classList.contains('is-active');
    });
  }

  if (pagerBtns.length) {
    pagerBtns.forEach(function (btn, i) {
      btn.addEventListener('click', function () { activatePage(i); });
    });
    if (pagerPrev) pagerPrev.addEventListener('click', function () { activatePage(currentPage() - 1); });
    if (pagerNext) pagerNext.addEventListener('click', function () { activatePage(currentPage() + 1); });
    activatePage(0);
  }

  var demoBtns = Array.prototype.slice.call(document.querySelectorAll('.demo-btn'));

  demoBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      demoBtns.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
        var panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.classList.remove('is-active');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      var activePanel = document.getElementById(btn.getAttribute('aria-controls'));
      if (activePanel) activePanel.classList.add('is-active');
    });
  });

  var audios = Array.prototype.slice.call(document.querySelectorAll('audio'));

  audios.forEach(function (audio) {

    audio.addEventListener('error', function () {
      var placeholder = document.createElement('span');
      placeholder.className = 'audio-missing';
      placeholder.textContent = '—';
      placeholder.title = 'Audio not available yet';
      audio.replaceWith(placeholder);
    });

    audio.addEventListener('play', function () {
      audios.forEach(function (other) {
        if (other !== audio && !other.paused) other.pause();
      });
    });
  });

  [
    { id: 'main-figure', label: 'Figure unavailable' }
  ].forEach(function (spec) {
    var img = document.getElementById(spec.id);
    if (!img) return;
    img.addEventListener('error', function () {
      var box = document.createElement('div');
      box.className = 'figure-placeholder';
      box.setAttribute('role', 'img');
      box.setAttribute('aria-label', 'Figure placeholder');
      box.innerHTML =
        '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">' +
        '<path fill="currentColor" d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>' +
        '<span>' + spec.label + '</span>';
      img.replaceWith(box);
    });
  });

  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    reveals.forEach(function (el) { observer.observe(el); });
  }
})();
