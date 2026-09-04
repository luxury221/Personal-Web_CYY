/* Content V3 normalization guard + evidence-link enrichment. */
(() => {
  'use strict';

  const TEXT_FIXES = new Map([
    ['我如何做 AI 系谊', '我如何做 AI 系统'],
    ['孔杰职配', '孔明职配'],
    ['GRAPHRADI', 'GRAPHRAG'],
    ['YMLYANG CHEN', 'YAOYANG CHEN']
  ]);

  const ATTR_FIXES = [
    ['V0–VING', 'V0–V5'],
    ['interpretabily', 'interpretably']
  ];

  function normalizeText(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (!node.nodeValue?.trim()) return;
      TEXT_FIXES.forEach((next, prev) => {
        if (node.nodeValue.includes(prev)) node.nodeValue = node.nodeValue.replaceAll(prev, next);
      });
    });
  }

  function normalizeAttributes() {
    document.querySelectorAll('[data-enen]').forEach((el) => el.removeAttribute('data-enen'));
    document.querySelectorAll('[data-en]').forEach((el) => {
      let value = el.getAttribute('data-en') || '';
      ATTR_FIXES.forEach(([prev, next]) => { value = value.replaceAll(prev, next); });
      el.setAttribute('data-en', value);
    });
  }

  function addLink(host, href, label) {
    if (!host || host.querySelector(`a[href="${href}"]`)) return;
    const link = document.createElement('a');
    link.className = 'case-link';
    link.href = href;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = label;
    host.appendChild(link);
  }

  function enrichEvidenceLinks() {
    const multirank = document.querySelector('#case-01 .case-links');
    addLink(multirank, 'https://github.com/luxury221/MultiRank-RAG/blob/main/docs/PUBLIC_BENCHMARK_RESULTS.md', 'BENCHMARK / V0–V5 ↗');
    addLink(multirank, 'https://github.com/luxury221/MultiRank-RAG/blob/main/docs/EXPERIMENTS.md', 'EXPERIMENTS ↗');
    addLink(multirank, 'https://github.com/luxury221/MultiRank-RAG/blob/main/docs/ARCHITECTURE.md', 'ARCHITECTURE ↗');
  }

  function boot() {
    normalizeText();
    normalizeAttributes();
    enrichEvidenceLinks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();