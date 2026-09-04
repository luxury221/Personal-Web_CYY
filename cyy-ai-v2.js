/* CYY 2026 — second-pass system motion.
   Motion is semantic: traces, stages, evidence and verification states. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('cyy-motion-ready');
  document.body.classList.add('cyy-motion-ready');

  function assignSteps(scope) {
    scope.querySelectorAll('.pipeline-flow').forEach((flow) => {
      [...flow.children].forEach((el, index) => el.style.setProperty('--step', index));
    });
    scope.querySelectorAll('.metric-cluster').forEach((cluster) => {
      [...cluster.children].forEach((el, index) => el.style.setProperty('--step', index + 2));
    });
  }

  function animateNumber(el) {
    if (!el || el.dataset.counted === 'true' || reduceMotion) return;
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d*\.?\d+)(\+?)$/);
    if (!match) return;

    const finalValue = Number(match[1]);
    if (!Number.isFinite(finalValue)) return;
    const suffix = match[2] || '';
    const decimals = (match[1].split('.')[1] || '').length;
    const pad = decimals === 0 && /^0\d+$/.test(match[1]) ? match[1].length : 0;
    const duration = 680;
    const started = performance.now();
    el.dataset.counted = 'true';

    function frame(now) {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = finalValue * eased;
      let text = decimals ? value.toFixed(decimals) : String(Math.round(value));
      if (pad) text = text.padStart(pad, '0');
      el.textContent = text + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = match[1] + suffix;
    }
    requestAnimationFrame(frame);
  }

  function activateSystemViz(el) {
    el.classList.add('is-live');
    el.querySelectorAll('.metric-card span').forEach((metric, index) => {
      setTimeout(() => animateNumber(metric), 220 + index * 90);
    });
  }

  function initObservers() {
    assignSteps(document);

    const dossierCards = document.querySelectorAll('.archive-card');
    const systemViz = document.querySelectorAll('.system-viz');
    const researchPanels = document.querySelectorAll('.slide-panel[id^="research-"]');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      dossierCards.forEach((el) => el.classList.add('is-live'));
      systemViz.forEach(activateSystemViz);
      researchPanels.forEach((el) => el.classList.add('is-live'));
      return;
    }

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > .34) entry.target.classList.add('is-live');
      });
    }, { threshold: [.34, .58] });
    dossierCards.forEach((el) => cardObserver.observe(el));

    const systemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > .42) activateSystemViz(entry.target);
      });
    }, { threshold: [.28, .42, .62] });
    systemViz.forEach((el) => systemObserver.observe(el));

    const researchObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > .36) entry.target.classList.add('is-live');
      });
    }, { rootMargin: '0px -18% 0px -18%', threshold: [.36, .58] });
    researchPanels.forEach((el) => researchObserver.observe(el));
  }

  function initHomeProof() {
    const proof = document.querySelector('.home-proof');
    if (!proof) return;
    const metrics = proof.querySelectorAll('.home-proof-item span strong');
    if (!metrics.length || reduceMotion || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      metrics.forEach((metric, index) => setTimeout(() => animateNumber(metric), 100 + index * 120));
      observer.disconnect();
    }, { threshold: .4 });
    observer.observe(proof);
  }

  function initProjectTraceHover() {
    document.querySelectorAll('.pipeline-node').forEach((node) => {
      node.addEventListener('mouseenter', () => {
        const flow = node.closest('.pipeline-flow');
        if (!flow) return;
        const nodes = [...flow.querySelectorAll('.pipeline-node')];
        const current = nodes.indexOf(node);
        nodes.forEach((item, index) => {
          item.style.opacity = index <= current ? '1' : '.48';
        });
      });
      node.addEventListener('mouseleave', () => {
        const flow = node.closest('.pipeline-flow');
        if (!flow) return;
        flow.querySelectorAll('.pipeline-node').forEach((item) => item.style.opacity = '');
      });
    });
  }

  function initResearchTabs() {
    document.querySelectorAll('.slide-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const scope = tab.closest('.content-main');
        if (!scope) return;
        const targetIndex = Number(tab.dataset.slide || 0);
        const panels = scope.querySelectorAll('.slide-panel[id^="research-"]');
        const panel = panels[targetIndex];
        if (!panel) return;
        panel.classList.remove('is-live');
        requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add('is-live')));
      });
    });
  }

  function boot() {
    initObservers();
    initHomeProof();
    initProjectTraceHover();
    initResearchTabs();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
