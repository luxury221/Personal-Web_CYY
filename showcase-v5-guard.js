/* Project Showcase V5 interaction guard.
   Project-asset figures are clickable repository assets rather than slide-drag surfaces. */
(() => {
  'use strict';

  function bind(root = document) {
    root.querySelectorAll?.('.project-asset-card:not([data-deck-guard])').forEach((card) => {
      card.dataset.deckGuard = '1';
      card.addEventListener('pointerdown', (event) => event.stopPropagation());
    });
  }

  function boot() {
    bind();
    const observer = new MutationObserver((records) => {
      if (records.some((record) => record.addedNodes.length)) bind();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
