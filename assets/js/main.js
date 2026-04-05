/* ═══════════════════════════════════════════
   Ata Flug Transfer – Shared JS
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Mobile navigation
  var hamburger = document.getElementById('hamburger');
  var overlay = document.getElementById('mobile-overlay');
  var closeBtn = document.getElementById('mobile-close');

  if (hamburger && overlay) {
    hamburger.addEventListener('click', function () {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    function closeMobile() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMobile);

    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobile);
    });
  }

  // ── Active nav link
  var currentPath = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
  if (currentPath === '' || currentPath === 'index' || currentPath === 'index.html') currentPath = 'index';

  document.querySelectorAll('.nav-links a, .mobile-overlay a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var linkPage = href.replace(/^\.?\//, '').replace(/\.html$/, '') || 'index';
    if (linkPage === currentPath) {
      a.classList.add('active');
    }
  });

  // ── Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
