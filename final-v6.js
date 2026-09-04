/* Final Portfolio QA V6
   Runtime cleanup, accessibility/SEO metadata and compatibility fixes. */
(() => {
  'use strict';

  document.documentElement.classList.add('cyy-v6');

  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const META = {
    'index.html': {
      title: 'Yaoyang Chen · LLM Systems',
      description: '陈耀洋 Yaoyang Chen — LLM Systems、Multimodal RAG、Agentic Systems、Evaluation 与 AI System Engineering 个人主页。',
      ogTitle: 'Yaoyang Chen — LLM Systems · Evidence · Agents · Evaluation'
    },
    'profile.html': {
      title: 'About · Yaoyang Chen',
      description: 'About Yaoyang Chen: systems mindset, Evidence First, measurable evaluation and research-to-product AI engineering.',
      ogTitle: 'About · Yaoyang Chen — Systems Mindset'
    },
    'experience.html': {
      title: 'Projects · Yaoyang Chen',
      description: 'Research and engineering case studies: MultiRank-RAG, Kongming, AI Homework System and Interactive Avatar.',
      ogTitle: 'Projects · Yaoyang Chen — LLM Systems Portfolio'
    },
    'education.html': {
      title: 'Academic · Yaoyang Chen',
      description: 'Academic foundation of Yaoyang Chen: Mathematics × Intelligence Science and Technology at CQUPT, awards and research training.',
      ogTitle: 'Academic · Yaoyang Chen — Mathematics × AI Systems'
    },
    'focus.html': {
      title: 'Research · Yaoyang Chen',
      description: 'Research agenda: Multimodal RAG, Agentic Systems, Evaluation & Interpretability, and Multimodal Interaction.',
      ogTitle: 'Research · Yaoyang Chen — LLM Systems Agenda'
    },
    'contact.html': {
      title: 'Contact · Yaoyang Chen',
      description: 'Contact Yaoyang Chen for LLM Systems, RAG, Agentic Systems, multimodal AI, research collaboration and internships.',
      ogTitle: 'Contact · Yaoyang Chen'
    }
  };

  function ensureMeta(selector, attrs) {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
      document.head.appendChild(el);
    }
    return el;
  }

  function applyPublishingMeta() {
    const meta = META[page] || META['index.html'];
    document.title = meta.title;

    const description = ensureMeta('meta[name="description"]', { name: 'description' });
    description.setAttribute('content', meta.description);

    const robots = ensureMeta('meta[name="robots"]', { name: 'robots' });
    robots.setAttribute('content', 'index,follow,max-image-preview:large');

    const ogTitle = ensureMeta('meta[property="og:title"]', { property: 'og:title' });
    ogTitle.setAttribute('content', meta.ogTitle);
    const ogDescription = ensureMeta('meta[property="og:description"]', { property: 'og:description' });
    ogDescription.setAttribute('content', meta.description);
    const ogType = ensureMeta('meta[property="og:type"]', { property: 'og:type' });
    ogType.setAttribute('content', 'website');

    const twitterCard = ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' });
    twitterCard.setAttribute('content', 'summary');
    const twitterTitle = ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title' });
    twitterTitle.setAttribute('content', meta.ogTitle);
    const twitterDescription = ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description' });
    twitterDescription.setAttribute('content', meta.description);

    if (!document.getElementById('cyy-person-schema')) {
      const schema = document.createElement('script');
      schema.id = 'cyy-person-schema';
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Yaoyang Chen',
        alternateName: ['陈耀洋', 'CYY'],
        affiliation: {
          '@type': 'CollegeOrUniversity',
          name: 'Chongqing University of Posts and Telecommunications'
        },
        knowsAbout: [
          'LLM Systems',
          'Multimodal RAG',
          'GraphRAG',
          'Agentic Systems',
          'Evaluation and Interpretability',
          'Multimodal Interaction'
        ],
        sameAs: ['https://github.com/luxury221']
      });
      document.head.appendChild(schema);
    }
  }

  function repairContentTypos(root = document) {
    root.querySelectorAll?.('[data-enen]').forEach((el) => el.removeAttribute('data-enen'));

    root.querySelectorAll?.('[data-zh]').forEach((el) => {
      if (el.getAttribute('data-zh') === '孔杰职配') el.setAttribute('data-zh', '孔明职配');
    });

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let next = node.nodeValue;
      if (!next) return;
      next = next.replace(/孔杰职配/g, '孔明职配').replace(/GRAPHRADI/g, 'GRAPHRAG');
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  function improveAccessibility() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle && !langToggle.getAttribute('aria-label')) {
      langToggle.setAttribute('aria-label', 'Switch language');
    }

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', [...rel].join(' '));
    });

    document.querySelectorAll('.project-asset-card').forEach((card) => {
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
      if (!card.hasAttribute('role')) card.setAttribute('role', 'link');
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      });
    });
  }

  /*
   * Compatibility cleanup for the legacy petal loop.
   * The old effect is no longer part of the AI visual direction, but it is
   * initialized by script-core.js before this enhancement layer runs.
   * Suppress the loop's next RAF scheduling once, then restore native RAF.
   */
  function stopLegacyPetalRAF() {
    const nativeRAF = window.requestAnimationFrame;
    if (typeof nativeRAF !== 'function' || window.__cyyV6PetalStopped) return;
    window.__cyyV6PetalStopped = true;

    window.requestAnimationFrame = function cyyV6RAF(callback) {
      try {
        const source = Function.prototype.toString.call(callback);
        if (source.includes('resting.forEach') && source.includes('petals.length')) return 0;
      } catch (error) {}
      return nativeRAF.call(window, callback);
    };

    window.setTimeout(() => {
      window.requestAnimationFrame = nativeRAF;
      document.querySelectorAll('.petal-canvas,.ink-layer').forEach((el) => el.remove());
    }, 220);
  }

  function markProofRails() {
    document.querySelectorAll('#case-03 .product-screen-grid, #case-04 .product-screen-grid').forEach((grid) => {
      grid.setAttribute('aria-label', document.documentElement.lang?.startsWith('en') ? 'Verified product screenshots' : '已验证的真实产品截图');
    });
  }

  function run() {
    applyPublishingMeta();
    repairContentTypos();
    improveAccessibility();
    markProofRails();
    stopLegacyPetalRAF();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();

  const observer = new MutationObserver((records) => {
    if (!records.some((record) => record.addedNodes.length || record.type === 'attributes')) return;
    repairContentTypos();
    improveAccessibility();
    markProofRails();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['lang'] });
})();
