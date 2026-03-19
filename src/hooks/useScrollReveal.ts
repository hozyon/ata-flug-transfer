import { useEffect } from 'react';

/**
 * Attaches an IntersectionObserver to all elements with `.reveal`,
 * `.reveal-left`, or `.reveal-scale` classes and adds `.is-visible`
 * when they enter the viewport.
 *
 * Call once at the app or page level. Re-observes on DOM changes
 * via a MutationObserver so dynamically rendered content is covered.
 */
export function useScrollReveal() {
  useEffect(() => {
    const SELECTORS = '.reveal, .reveal-left, .reveal-scale';

    const observe = (io: IntersectionObserver) => {
      document.querySelectorAll<HTMLElement>(SELECTORS).forEach(el => {
        if (!el.classList.contains('is-visible')) io.observe(el);
      });
    };

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observe(io);

    // Re-scan when new elements are added to the DOM (e.g. lazy sections)
    const mo = new MutationObserver(() => observe(io));
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}
