/* CYY enhancement runtime — consolidated.
   The stable base runtime remains in script-core.js (loaded before this file).
   This file concatenates, in their original execution order, the layers that
   used to load as separate scripts: research-console motion (AI v2), content
   narrative fixes (v3), visual evidence (v4), project showcase (v5 + guard),
   final QA (v6) and the Research Assistant companion chain (pet v0.5–v0.7 +
   assistant 2.0 + greetings). Layer banners mark each section; do not reorder
   sections — later layers intentionally patch/override earlier ones. */
(() => {
  document.documentElement.classList.add('cyy-ai-mode');

  const cleanupStyle = document.createElement('style');
  cleanupStyle.textContent = '.cyy-ai-mode .petal-canvas,.cyy-ai-mode .ink-layer{display:none!important}';
  document.head.appendChild(cleanupStyle);
})();

/* ================================================================ */
/* ================  LAYER: content-v3-fixes  ==================== */
/* ================================================================ */


/* ================================================================ */
/* ================  LAYER: content-v3-fixes.js?v=20260904.1            */
/* ================================================================ */

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


/* ================================================================ */
/* ================  LAYER: cyy-ai-v2.js?v=20260904.2                   */
/* ================================================================ */

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


/* ================================================================ */
/* ================  LAYER: evidence-v4.js?v=20260904.1                 */
/* ================================================================ */

/* CYY Portfolio Evidence Assets V4
   Adds grounded diagrams, benchmark proof and source links without changing the slide-deck runtime. */
(() => {
  'use strict';

  const ROOT = 'https://github.com/';
  const isEn = () => document.documentElement.lang?.toLowerCase().startsWith('en');

  const assets = {
    multirankArchitecture: {
      src: 'assets/evidence/multirank-architecture.svg',
      titleZh: '系统架构 / Evidence Flow', titleEn: 'Architecture / Evidence Flow',
      noteZh: '从复杂 PDF 到 evidence chain 的端到端结构。', noteEn: 'End-to-end flow from complex PDF to evidence chain.',
      href: `${ROOT}luxury221/MultiRank-RAG/blob/main/docs/ARCHITECTURE.md`, source: 'ARCHITECTURE.md'
    },
    multirankAblation: {
      src: 'assets/evidence/multirank-ablation.svg',
      titleZh: '公开消融 / V0 → V5', titleEn: 'Public Ablation / V0 → V5',
      noteZh: '固定 BM25 candidate set 下的 FinQA 与 MultiHop 证据。', noteEn: 'FinQA and MultiHop evidence under a fixed BM25 candidate set.',
      href: `${ROOT}luxury221/MultiRank-RAG/blob/main/docs/PUBLIC_BENCHMARK_RESULTS.md`, source: 'PUBLIC_BENCHMARK_RESULTS.md'
    },
    multirankNode: {
      src: 'assets/evidence/multirank-evidence-node.svg',
      titleZh: 'Evidence Node / 文档结构接口', titleEn: 'Evidence Node / Document Interface',
      noteZh: '保留 page、bbox、type、visual fields 与关系图。', noteEn: 'Preserves page, bbox, type, visual fields and graph relations.',
      href: `${ROOT}luxury221/MultiRank-RAG/blob/main/docs/ARCHITECTURE.md`, source: 'ARCHITECTURE.md'
    },
    kongmingFlow: {
      src: 'assets/evidence/kongming-agent-flow.svg',
      titleZh: '多 Agent Workflow / Structured State', titleEn: 'Multi-Agent Workflow / Structured State',
      noteZh: '六类角色通过共享 Context / Event / Artifact 传递状态。', noteEn: 'Six roles pass state through shared Context / Event / Artifact.',
      href: `${ROOT}lljjcc426/Kongming-Student-Job-Matching-Agent/blob/main/docs/08-multi-agent-multimodal-architecture.md`, source: '08-multi-agent-multimodal-architecture.md'
    },
    homeworkInfra: {
      src: 'assets/evidence/homework-infrastructure.svg',
      titleZh: 'HITL / 异步 AI 基础设施', titleEn: 'HITL / Asynchronous AI Infrastructure',
      noteZh: '从评分细则快照、AI 建议到教师复核、Redis Worker、MinIO 与 Judge0。', noteEn: 'From rubric snapshots and AI suggestions to teacher review, Redis workers, MinIO and Judge0.',
      href: `${ROOT}pythc/ai-homework-system`, source: 'README.md / deployment'
    },
    avatarRealtime: {
      src: 'assets/evidence/avatar-realtime-flow.svg',
      titleZh: 'Realtime Multimodal / 会话状态链路', titleEn: 'Realtime Multimodal / Session State Flow',
      noteZh: '四步数字人流程进入语音、打断、手势、3D 场景与会话数据闭环。', noteEn: 'The four-step avatar flow continues into voice, interruption, gesture, 3D scene state and session data.',
      href: `${ROOT}WaterXiao-git/AI-Avatar`, source: 'README.md / main flow'
    }
  };

  function link(label, href) {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.textContent = label;
    return a;
  }

  function addEvidenceBar(caseEl, links) {
    if (!caseEl || caseEl.querySelector('.evidence-bar')) return;
    const anchor = caseEl.querySelector('.case-links');
    if (!anchor) return;
    const bar = document.createElement('div');
    bar.className = 'evidence-bar';
    links.forEach(([label, href]) => bar.appendChild(link(label, href)));
    anchor.insertAdjacentElement('afterend', bar);
  }

  function figure(asset, wide = false) {
    const el = document.createElement('figure');
    el.className = `evidence-asset${wide ? ' is-wide' : ''}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'evidence-asset-button';
    button.setAttribute('aria-label', isEn() ? `Enlarge ${asset.titleEn}` : `放大查看 ${asset.titleZh}`);
    const img = document.createElement('img');
    img.src = asset.src;
    img.alt = isEn() ? asset.titleEn : asset.titleZh;
    img.loading = 'lazy';
    img.decoding = 'async';
    button.appendChild(img);
    button.addEventListener('click', () => openModal(asset));

    const caption = document.createElement('figcaption');
    const main = document.createElement('div');
    main.className = 'evidence-caption-main';
    const b = document.createElement('b');
    b.textContent = isEn() ? asset.titleEn : asset.titleZh;
    const span = document.createElement('span');
    span.textContent = isEn() ? asset.noteEn : asset.noteZh;
    main.append(b, span);
    const source = link(`SOURCE / ${asset.source} ↗`, asset.href);
    source.className = 'evidence-source-link';
    caption.append(main, source);
    el.append(button, caption);
    return el;
  }

  function gallery(caseEl, config) {
    if (!caseEl || caseEl.querySelector('.evidence-gallery')) return;
    const gallery = document.createElement('section');
    gallery.className = 'evidence-gallery';
    const head = document.createElement('div');
    head.className = 'evidence-gallery-head';
    const titleWrap = document.createElement('div');
    const kicker = document.createElement('span');
    kicker.className = 'evidence-gallery-kicker';
    kicker.textContent = 'VISUAL PROOF / REPOSITORY-GROUNDED';
    const title = document.createElement('h3');
    title.className = 'evidence-gallery-title';
    title.textContent = isEn() ? config.titleEn : config.titleZh;
    titleWrap.append(kicker, title);
    const note = document.createElement('p');
    note.className = 'evidence-gallery-note';
    note.textContent = isEn() ? config.noteEn : config.noteZh;
    head.append(titleWrap, note);
    const grid = document.createElement('div');
    grid.className = 'evidence-gallery-grid';
    config.items.forEach(([asset, wide]) => grid.appendChild(figure(asset, wide)));
    gallery.append(head, grid);

    const target = caseEl.querySelector(config.after) || caseEl.querySelector('.project-story-grid') || caseEl.querySelector('.project-lede');
    target?.insertAdjacentElement('afterend', gallery);
  }

  function addResearchSource(id, label, href) {
    const panel = document.getElementById(id);
    const proof = panel?.querySelector('.research-proof');
    if (!proof || proof.querySelector('.research-proof-source')) return;
    const source = link(`${label} ↗`, href);
    source.className = 'research-proof-source';
    proof.appendChild(source);
  }

  let modal;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'evidence-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = '<button class="evidence-modal-close" type="button" aria-label="Close">×</button><div class="evidence-modal-inner"><img alt="" /></div>';
    modal.querySelector('.evidence-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
    document.body.appendChild(modal);
    return modal;
  }

  function openModal(asset) {
    const m = ensureModal();
    const img = m.querySelector('img');
    img.src = asset.src;
    img.alt = isEn() ? asset.titleEn : asset.titleZh;
    m.classList.add('is-open');
    document.body.classList.add('evidence-modal-open');
    m.querySelector('.evidence-modal-close').focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('evidence-modal-open');
  }

  function applyLanguage() {
    document.querySelectorAll('.evidence-gallery').forEach((galleryEl) => galleryEl.remove());
    enhanceEvidence();
  }

  function enhanceEvidence() {
    const multi = document.getElementById('case-01');
    const kongming = document.getElementById('case-02');
    const homework = document.getElementById('case-03');
    const avatar = document.getElementById('case-04');

    addEvidenceBar(multi, [
      ['CODE', `${ROOT}luxury221/MultiRank-RAG`],
      ['BENCHMARK / V0–V5', `${ROOT}luxury221/MultiRank-RAG/blob/main/docs/PUBLIC_BENCHMARK_RESULTS.md`],
      ['EXPERIMENTS', `${ROOT}luxury221/MultiRank-RAG/blob/main/docs/EXPERIMENTS.md`],
      ['ARCHITECTURE', `${ROOT}luxury221/MultiRank-RAG/blob/main/docs/ARCHITECTURE.md`]
    ]);
    gallery(multi, {
      titleZh: '把方法、结构和结果放到同一组证据里',
      titleEn: 'Method, architecture and results in one evidence set',
      noteZh: '图示内容直接根据 MultiRank-RAG 仓库架构文档与公开 benchmark 报告整理。',
      noteEn: 'Visuals are derived directly from the MultiRank-RAG architecture and public benchmark documentation.',
      after: '.evidence-strip',
      items: [[assets.multirankArchitecture, true], [assets.multirankAblation, false], [assets.multirankNode, false]]
    });

    addEvidenceBar(kongming, [
      ['CODE', `${ROOT}lljjcc426/Kongming-Student-Job-Matching-Agent`],
      ['AGENT ARCHITECTURE', `${ROOT}lljjcc426/Kongming-Student-Job-Matching-Agent/blob/main/docs/08-multi-agent-multimodal-architecture.md`],
      ['OCR DESIGN', `${ROOT}lljjcc426/Kongming-Student-Job-Matching-Agent/blob/main/docs/12-ocr-integration.md`]
    ]);
    gallery(kongming, {
      titleZh: 'Agent 不是数量展示，而是职责与状态边界',
      titleEn: 'Agents are role and state boundaries, not a count',
      noteZh: 'Workflow 对应项目文档中输入层、编排层、智能体层、产物层与展示层的分层设计。',
      noteEn: 'The workflow maps to the documented input, orchestration, agent, artifact and presentation layers.',
      after: '.project-story-grid',
      items: [[assets.kongmingFlow, true]]
    });

    addEvidenceBar(homework, [
      ['CODE', `${ROOT}pythc/ai-homework-system`],
      ['README / WORKFLOW', `${ROOT}pythc/ai-homework-system/blob/main/README.md`]
    ]);
    gallery(homework, {
      titleZh: 'AI 能力必须进入可审计、可部署的业务约束',
      titleEn: 'AI capability must live inside auditable, deployable constraints',
      noteZh: '图示根据项目 README 中的完整批改闭环、默认 8 Worker、MinIO、Judge0 与部署说明整理。',
      noteEn: 'The diagram follows the documented grading loop, eight default workers, MinIO, Judge0 and deployment architecture.',
      after: '.project-story-grid',
      items: [[assets.homeworkInfra, true]]
    });

    addEvidenceBar(avatar, [
      ['CODE', `${ROOT}WaterXiao-git/AI-Avatar`],
      ['README / MAIN FLOW', `${ROOT}WaterXiao-git/AI-Avatar/blob/main/README.md`]
    ]);
    gallery(avatar, {
      titleZh: '从“生成数字人”到实时多模态状态协调',
      titleEn: 'From avatar generation to realtime multimodal state coordination',
      noteZh: '图示对应仓库中的四步主流程、Qwen 实时语音、WebSocket、MediaPipe 和会话数据沉淀。',
      noteEn: 'The diagram follows the documented four-step flow, Qwen realtime voice, WebSocket, MediaPipe and session persistence.',
      after: '.project-story-grid',
      items: [[assets.avatarRealtime, true]]
    });

    addResearchSource('research-01', 'SOURCE / PUBLIC BENCHMARK', `${ROOT}luxury221/MultiRank-RAG/blob/main/docs/PUBLIC_BENCHMARK_RESULTS.md`);
    addResearchSource('research-02', 'SOURCE / AGENT ARCHITECTURE', `${ROOT}lljjcc426/Kongming-Student-Job-Matching-Agent/blob/main/docs/08-multi-agent-multimodal-architecture.md`);
    addResearchSource('research-04', 'SOURCE / AI-AVATAR', `${ROOT}WaterXiao-git/AI-Avatar`);
  }

  function boot() {
    enhanceEvidence();
    const observer = new MutationObserver(() => requestAnimationFrame(applyLanguage));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();


/* ================================================================ */
/* ================  LAYER: showcase-v5.js?v=20260904.1                 */
/* ================================================================ */

/* Project Showcase V5
   Adds verified product screens, repository assets and runtime/source proof.
   Evidence types are explicit: a project asset is never presented as a UI screenshot. */
(() => {
  'use strict';

  const GH = 'https://github.com/';
  const RAW = 'https://raw.githubusercontent.com/';
  const isEn = () => document.documentElement.lang?.toLowerCase().startsWith('en');

  const configs = {
    'case-01': {
      titleZh: '运行入口与可复现实现',
      titleEn: 'Runtime & Reproducible Implementation',
      noteZh: '当前仓库没有等价的产品界面截图，因此这里展示真实实验入口、后端 Pipeline 与公开结果，而不是制造 Demo 截图。',
      noteEn: 'The repository does not expose equivalent product screenshots, so this section shows real experiment entry points, backend pipeline code and public results instead of manufactured demo screens.',
      type: 'RUNTIME / SOURCE PROOF',
      insertAfter: '.evidence-gallery',
      runtime: [
        {
          tag: 'EXPERIMENT RUNNER',
          title: 'V0–V5 Main Experiment',
          descZh: '固定 retriever / candidate K / rerank K 的公开消融入口。',
          descEn: 'Entry point for controlled V0–V5 ablations with fixed retrieval settings.',
          code: 'scripts/40_run_main_experiment.py',
          href: `${GH}luxury221/MultiRank-RAG/blob/main/scripts/40_run_main_experiment.py`
        },
        {
          tag: 'PIPELINE SERVICE',
          title: 'Backend Pipeline',
          descZh: '后端分析流程与模块编排入口，连接解析、检索、重排与结果输出。',
          descEn: 'Backend orchestration connecting parsing, retrieval, reranking and result delivery.',
          code: 'backend/services/pipeline.py',
          href: `${GH}luxury221/MultiRank-RAG/blob/main/backend/services/pipeline.py`
        },
        {
          tag: 'RETRIEVAL SERVICE',
          title: 'Retrieval Runtime',
          descZh: '检索服务实现，用源码证明系统并非只有架构图和结果表。',
          descEn: 'Retrieval implementation showing that the system extends beyond diagrams and result tables.',
          code: 'backend/services/retrieval.py',
          href: `${GH}luxury221/MultiRank-RAG/blob/main/backend/services/retrieval.py`
        },
        {
          tag: 'PUBLIC RESULTS',
          title: 'Benchmark & Reproduction',
          descZh: '公开记录运行设置、V0–V5 指标、观察与复现实验命令。',
          descEn: 'Public record of run settings, V0–V5 metrics, observations and reproduction command.',
          code: 'docs/PUBLIC_BENCHMARK_RESULTS.md',
          href: `${GH}luxury221/MultiRank-RAG/blob/main/docs/PUBLIC_BENCHMARK_RESULTS.md`
        }
      ]
    },

    'case-02': {
      titleZh: '产品资产与实现边界',
      titleEn: 'Product Assets & Implementation Boundaries',
      noteZh: '仓库暂未提供正式页面截图；下方图片是项目真实视觉资产，不作为 UI Screenshot。实现证明则直接链接 Agent Runtime、Agent Team 与 Match Engine。',
      noteEn: 'The repository does not currently provide formal UI screenshots. Images below are genuine project assets, explicitly not UI screenshots; implementation proof links directly to agent runtime and matching code.',
      type: 'PROJECT ASSET + RUNTIME PROOF',
      insertAfter: '.evidence-gallery',
      assets: [
        {
          src: 'assets/showcase/kongming/product-identity.jpg',
          titleZh: '孔明职配 · Product Identity',
          titleEn: 'Kongming · Product Identity',
          descZh: '仓库中的品牌 / IP 视觉资产；用于证明产品视觉体系，不代表界面截图。',
          descEn: 'Repository brand/IP asset proving the product visual system; this is not a UI screenshot.',
          href: `${GH}lljjcc426/Kongming-Student-Job-Matching-Agent/tree/main/public`
        },
        {
          src: 'assets/showcase/kongming/interview-room.jpg',
          titleZh: 'Interview Environment Asset',
          titleEn: 'Interview Environment Asset',
          descZh: '模拟面试体验使用的真实场景资产；属于产品内容资产，不作为独立页面截图。',
          descEn: 'Real environment asset used by the interview experience; a product content asset, not a standalone UI screen.',
          href: `${GH}lljjcc426/Kongming-Student-Job-Matching-Agent/tree/main/public/avatars/interviewer`
        }
      ],
      runtime: [
        {
          tag: 'SHARED STATE', title: 'Agent Runtime',
          descZh: '定义 AgentContext / AgentEvent / AgentArtifact 与共享运行协议。',
          descEn: 'Defines AgentContext / AgentEvent / AgentArtifact and the shared runtime protocol.',
          code: 'src/lib/agentRuntime.ts',
          href: `${GH}lljjcc426/Kongming-Student-Job-Matching-Agent/blob/main/src/lib/agentRuntime.ts`
        },
        {
          tag: 'AGENT TEAM', title: 'Role Implementations',
          descZh: '六类求职 Agent 的职责与执行逻辑实现。',
          descEn: 'Implementation of the role-specific career agents and their execution logic.',
          code: 'src/lib/agents.ts',
          href: `${GH}lljjcc426/Kongming-Student-Job-Matching-Agent/blob/main/src/lib/agents.ts`
        },
        {
          tag: 'MATCH ENGINE', title: 'Evidence-based Matching',
          descZh: '可解释匹配评分与岗位 / 简历证据的计算入口。',
          descEn: 'Entry point for interpretable matching scores and job/resume evidence.',
          code: 'src/lib/matchEngine.ts',
          href: `${GH}lljjcc426/Kongming-Student-Job-Matching-Agent/blob/main/src/lib/matchEngine.ts`
        },
        {
          tag: 'ARCHITECTURE', title: 'Multi-Agent Design',
          descZh: '输入层、编排层、智能体层、产物层和展示层的正式设计文档。',
          descEn: 'Documented input, orchestration, agent, artifact and presentation layers.',
          code: 'docs/08-multi-agent-multimodal-architecture.md',
          href: `${GH}lljjcc426/Kongming-Student-Job-Matching-Agent/blob/main/docs/08-multi-agent-multimodal-architecture.md`
        }
      ]
    },

    'case-03': {
      titleZh: '真实教学工作流界面',
      titleEn: 'Real Teaching Workflow Screens',
      noteZh: '仓库当前为私有，README 中的真实界面截图暂不可匿名访问；仓库公开后此区将恢复展示实际产品界面。',
      noteEn: 'The repository is currently private, so its README product screenshots are not anonymously reachable; this section will show the real screens once the repository goes public.',
      type: 'REAL PRODUCT SCREEN / PENDING PUBLIC RELEASE',
      insertAfter: '.evidence-gallery',
      /* pythc/ai-homework-system is private, so its README user-attachment
         images 404 for anonymous visitors. Re-enable these screens when the
         repository goes public.
      screens: [
        {
          src: 'https://github.com/user-attachments/assets/96f9be8d-654c-489e-9b72-eb2e9ebc2440',
          titleZh: 'Platform Overview', titleEn: 'Platform Overview',
          descZh: '项目 README 的总体产品界面展示。', descEn: 'Overall product interface published in the project README.', wide: true
        },
        {
          src: 'https://github.com/user-attachments/assets/1626cc8f-f345-4f12-b663-5de5ac8736ce',
          titleZh: 'Teacher Workspace', titleEn: 'Teacher Workspace',
          descZh: '教师端课程、作业与教学工作台。', descEn: 'Teacher workspace for courses, assignments and teaching operations.'
        },
        {
          src: 'https://github.com/user-attachments/assets/270bc95f-6d9f-4f72-bc54-2e5fda4aa6d5',
          titleZh: 'AI Grading + Teacher Review', titleEn: 'AI Grading + Teacher Review',
          descZh: 'AI 建议评分进入教师复核流程的真实界面。', descEn: 'Real interface where AI grading suggestions enter teacher review.'
        },
        {
          src: 'https://github.com/user-attachments/assets/9813f5f4-4731-4034-a179-6522445c9a33',
          titleZh: 'Teaching Assistant', titleEn: 'Teaching Assistant',
          descZh: '课程 / 作业数据上的对话式教学助手。', descEn: 'Conversational teaching assistant over course and assignment data.'
        }
      ],
      */
      screens: [],
      source: `${GH}pythc/ai-homework-system/blob/main/README.md`,
      runtime: [
        {
          tag: 'HITL REVIEW', title: 'Teacher Final Control',
          descZh: 'AI 只给出建议评分与依据，最终成绩由教师确认。',
          descEn: 'AI provides suggested scores and rationale; teachers retain final authority.',
          code: 'README / workflow', href: `${GH}pythc/ai-homework-system/blob/main/README.md`
        },
        {
          tag: 'ASYNC WORKERS', title: '8-way AI Workers',
          descZh: '默认 8 个 AI Worker 共享 Redis 队列并行消费。',
          descEn: 'Eight default AI workers consume a shared Redis queue in parallel.',
          code: 'server_worker_1 ... server_worker_8', href: `${GH}pythc/ai-homework-system/blob/main/README.md`
        },
        {
          tag: 'PRIVATE STORAGE', title: 'MinIO + Signed URLs',
          descZh: '文件进入私有对象存储，通过签名 URL 控制访问。',
          descEn: 'Files live in private object storage and are accessed through signed URLs.',
          code: 'STORAGE_BACKEND=s3', href: `${GH}pythc/ai-homework-system/blob/main/README.md`
        },
        {
          tag: 'CODE SANDBOX', title: 'Theia + Judge0',
          descZh: '代码题使用独立 IDE 工作区与 Judge0 执行链路。',
          descEn: 'Programming tasks use isolated IDE workspaces and a Judge0 execution chain.',
          code: 'THEIA + JUDGE0', href: `${GH}pythc/ai-homework-system/blob/main/README.md`
        }
      ]
    },

    'case-04': {
      titleZh: '真实端到端多模态产品界面',
      titleEn: 'Real End-to-End Multimodal Product Screens',
      noteZh: '这些图片来自仓库 frontend/public/intro-real，覆盖创建、绑骨、场景、实时交互与 Dashboard，是项目实际前端流程的公开资产。',
      noteEn: 'These repository assets come from frontend/public/intro-real and cover creation, rigging, scene setup, realtime interaction and dashboard—the actual frontend product flow.',
      type: 'REAL PRODUCT SCREEN / REPOSITORY ASSET',
      insertAfter: '.evidence-gallery',
      screens: [
        {
          src: 'assets/showcase/avatar/create.jpg',
          titleZh: '01 / Create', titleEn: '01 / Create',
          descZh: '文本、图片或预设角色进入 3D 生成流程。', descEn: 'Text, image or preset character enters the 3D generation flow.', wide: true
        },
        {
          src: 'assets/showcase/avatar/rig.jpg',
          titleZh: '02 / Rig Assist', titleEn: '02 / Rig Assist',
          descZh: '8 点位辅助标注、任务轮询与动作预览。', descEn: 'Eight-point assisted annotation, task polling and motion preview.'
        },
        {
          src: 'assets/showcase/avatar/scene.jpg',
          titleZh: '03 / Scene', titleEn: '03 / Scene',
          descZh: '场景选择、上传和生成后的预览配置。', descEn: 'Scene selection, upload and generated-scene preview configuration.'
        },
        {
          src: 'assets/showcase/avatar/full-interact.jpg',
          titleZh: '04 / Realtime Interact', titleEn: '04 / Realtime Interact',
          descZh: '3D 角色、实时语音和手势事件汇合的交互页面。', descEn: 'Interaction screen where 3D avatar, realtime voice and gesture events converge.'
        },
        {
          src: 'assets/showcase/avatar/dashboard.jpg',
          titleZh: '05 / Dashboard', titleEn: '05 / Dashboard',
          descZh: '模型、会话历史与数据回看的真实 Dashboard。', descEn: 'Real dashboard for models, session history and review.'
        }
      ],
      source: `${GH}WaterXiao-git/AI-Avatar/tree/main/frontend/public/intro-real`,
      runtime: [
        {
          tag: 'VOICE WS', title: 'Realtime Voice Client',
          descZh: '浏览器实时语音 WebSocket 客户端实现。',
          descEn: 'Browser realtime-voice WebSocket client implementation.',
          code: 'frontend/src/audio/voiceWsClient.js',
          href: `${GH}WaterXiao-git/AI-Avatar/blob/main/frontend/src/audio/voiceWsClient.js`
        },
        {
          tag: '3D INTERACTION', title: 'Interactive Avatar Scene',
          descZh: '3D 场景、角色状态与交互事件的核心前端实现。',
          descEn: 'Core frontend implementation for 3D scene, avatar state and interaction events.',
          code: 'frontend/src/components/avatar/InteractiveAvatarScene.jsx',
          href: `${GH}WaterXiao-git/AI-Avatar/blob/main/frontend/src/components/avatar/InteractiveAvatarScene.jsx`
        },
        {
          tag: 'GESTURE', title: 'MediaPipe Gesture Detector',
          descZh: '手势识别与 3D 动作触发实现。',
          descEn: 'Gesture recognition and 3D action-trigger implementation.',
          code: 'frontend/src/components/avatar/GestureDetector.jsx',
          href: `${GH}WaterXiao-git/AI-Avatar/blob/main/frontend/src/components/avatar/GestureDetector.jsx`
        },
        {
          tag: 'SESSION STATE', title: 'Session Machine',
          descZh: '会话阶段、打断和状态切换的前端状态管理。',
          descEn: 'Frontend state management for session phases, interruption and transitions.',
          code: 'frontend/src/hooks/useSessionMachine.js',
          href: `${GH}WaterXiao-git/AI-Avatar/blob/main/frontend/src/hooks/useSessionMachine.js`
        }
      ]
    }
  };

  let modal = null;
  let lastTrigger = null;

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  function ensureModal() {
    if (modal) return modal;
    modal = make('div', 'showcase-modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = '<button class="showcase-modal-close" type="button" aria-label="Close">×</button><div class="showcase-modal-inner"><img alt="" /></div>';
    modal.querySelector('.showcase-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal(); });
    document.body.appendChild(modal);
    return modal;
  }

  function openModal(src, alt, trigger) {
    const m = ensureModal();
    lastTrigger = trigger || null;
    const img = m.querySelector('img');
    img.src = src;
    img.alt = alt || '';
    m.classList.add('is-open');
    document.body.classList.add('showcase-modal-open');
    m.querySelector('.showcase-modal-close').focus({ preventScroll: true });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('showcase-modal-open');
    if (lastTrigger?.focus) lastTrigger.focus({ preventScroll: true });
    lastTrigger = null;
  }

  function sectionHead(config) {
    const head = make('div', 'showcase-v5-head');
    const left = make('div');
    left.append(
      make('span', 'showcase-v5-kicker', 'PROJECT SHOWCASE / V5'),
      make('h3', 'showcase-v5-title', isEn() ? config.titleEn : config.titleZh),
      make('span', 'showcase-v5-type', config.type)
    );
    const note = make('p', 'showcase-v5-note', isEn() ? config.noteEn : config.noteZh);
    head.append(left, note);
    return head;
  }

  function screenCard(item, sourceHref, index) {
    const fig = make('figure', `product-screen${item.wide ? ' is-wide' : ''}${item.tall ? ' is-tall' : ''}`);
    const button = make('button', 'product-screen-button');
    button.type = 'button';
    const alt = isEn() ? item.titleEn : item.titleZh;
    button.setAttribute('aria-label', isEn() ? `Enlarge ${alt}` : `放大查看 ${alt}`);

    const frame = make('div', 'product-screen-frame');
    const toolbar = make('div', 'product-screen-toolbar');
    toolbar.append(make('i'), make('i'), make('i'), make('span', '', `SCREEN / ${String(index + 1).padStart(2, '0')} · VERIFIED REPOSITORY ASSET`));
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    const fallback = make('div', 'product-screen-error', isEn() ? 'SOURCE IMAGE COULD NOT BE LOADED. OPEN THE REPOSITORY SOURCE BELOW.' : '源图片暂时无法加载，请通过下方 SOURCE 查看仓库原始资源。');
    img.addEventListener('error', () => fig.classList.add('is-error'), { once: true });
    img.addEventListener('load', () => fig.classList.remove('is-error'), { once: true });
    frame.append(toolbar, img, fallback);
    button.appendChild(frame);
    button.addEventListener('click', () => {
      if (!fig.classList.contains('is-error')) openModal(item.src, alt, button);
    });

    const caption = document.createElement('figcaption');
    const copy = make('div', 'product-screen-copy');
    copy.append(make('b', '', alt), make('span', '', isEn() ? item.descEn : item.descZh));
    const source = make('a', 'product-screen-source', 'SOURCE ↗');
    source.href = item.href || sourceHref || '#';
    source.target = '_blank';
    source.rel = 'noreferrer';
    caption.append(copy, source);
    fig.append(button, caption);
    return fig;
  }

  function assetCard(item) {
    const fig = make('figure', 'project-asset-card');
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = isEn() ? item.titleEn : item.titleZh;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => { img.style.display = 'none'; }, { once: true });
    const cap = document.createElement('figcaption');
    cap.append(
      make('b', '', isEn() ? item.titleEn : item.titleZh),
      make('span', '', isEn() ? item.descEn : item.descZh)
    );
    fig.append(img, cap);
    if (item.href) {
      fig.style.cursor = 'pointer';
      fig.addEventListener('click', () => window.open(item.href, '_blank', 'noopener,noreferrer'));
    }
    return fig;
  }

  function runtimeBlock(items) {
    if (!items?.length) return null;
    const wrap = make('div', 'runtime-proof');
    const head = make('div', 'runtime-proof-head');
    head.append(
      make('b', '', isEn() ? 'IMPLEMENTATION / RUNTIME PROOF' : '实现 / 运行证明'),
      make('span', '', 'OPEN SOURCE · DIRECT LINKS')
    );
    const grid = make('div', 'runtime-proof-grid');
    items.forEach((item) => {
      const card = make('a', 'runtime-proof-card');
      card.href = item.href;
      card.target = '_blank';
      card.rel = 'noreferrer';
      card.append(
        make('span', '', item.tag),
        make('strong', '', item.title),
        make('p', '', isEn() ? item.descEn : item.descZh),
        make('div', 'runtime-proof-code', `${item.code} ↗`)
      );
      grid.appendChild(card);
    });
    wrap.append(head, grid);
    return wrap;
  }

  function buildShowcase(caseEl, config) {
    const section = make('section', 'showcase-v5');
    section.dataset.showcaseV5 = '1';
    section.appendChild(sectionHead(config));

    if (config.screens?.length) {
      const grid = make('div', 'product-screen-grid');
      config.screens.forEach((item, index) => grid.appendChild(screenCard(item, config.source, index)));
      section.appendChild(grid);
    }

    if (config.assets?.length) {
      const grid = make('div', 'project-asset-grid');
      config.assets.forEach((item) => grid.appendChild(assetCard(item)));
      section.appendChild(grid);
    }

    const runtime = runtimeBlock(config.runtime);
    if (runtime) section.appendChild(runtime);

    const target = caseEl.querySelector(config.insertAfter) || caseEl.querySelector('.evidence-gallery') || caseEl.querySelector('.project-story-grid') || caseEl.querySelector('.project-lede');
    target?.insertAdjacentElement('afterend', section);
  }

  function render() {
    document.querySelectorAll('[data-showcase-v5]').forEach((el) => el.remove());
    Object.entries(configs).forEach(([id, config]) => {
      const caseEl = document.getElementById(id);
      if (caseEl) buildShowcase(caseEl, config);
    });
  }

  function boot() {
    if (!document.getElementById('case-01')) return;
    render();
    let lastLang = document.documentElement.lang;
    const observer = new MutationObserver(() => {
      const nextLang = document.documentElement.lang;
      if (nextLang === lastLang) return;
      lastLang = nextLang;
      requestAnimationFrame(render);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();


/* ================================================================ */
/* ================  LAYER: showcase-v5-guard.js?v=20260904.1           */
/* ================================================================ */

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


/* ================================================================ */
/* ================  LAYER: final-v6.js?v=20260904.1                    */
/* ================================================================ */

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

    ensureMeta('meta[name="description"]', { name: 'description' }).setAttribute('content', meta.description);
    ensureMeta('meta[name="robots"]', { name: 'robots' }).setAttribute('content', 'index,follow,max-image-preview:large');
    ensureMeta('meta[property="og:title"]', { property: 'og:title' }).setAttribute('content', meta.ogTitle);
    ensureMeta('meta[property="og:description"]', { property: 'og:description' }).setAttribute('content', meta.description);
    ensureMeta('meta[property="og:type"]', { property: 'og:type' }).setAttribute('content', 'website');
    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' }).setAttribute('content', 'summary_large_image');
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image' }).setAttribute('content', 'https://luxury221.github.io/Personal-Web_CYY/assets/og-card.jpg');
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title' }).setAttribute('content', meta.ogTitle);
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description' }).setAttribute('content', meta.description);

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

  function repairContentTypos() {
    document.querySelectorAll('[data-enen]').forEach((el) => el.removeAttribute('data-enen'));
    document.querySelectorAll('[data-zh]').forEach((el) => {
      if (el.getAttribute('data-zh') === '孔杰职配') el.setAttribute('data-zh', '孔明职配');
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const current = node.nodeValue;
      if (!current || (!current.includes('孔杰职配') && !current.includes('GRAPHRADI'))) return;
      node.nodeValue = current.replace(/孔杰职配/g, '孔明职配').replace(/GRAPHRADI/g, 'GRAPHRAG');
    });
  }

  function improveAccessibility() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle && !langToggle.getAttribute('aria-label')) langToggle.setAttribute('aria-label', 'Switch language');

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', [...rel].join(' '));
    });

    document.querySelectorAll('.project-asset-card:not([data-v6-a11y])').forEach((card) => {
      card.dataset.v6A11y = '1';
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
      if (!card.hasAttribute('role')) card.setAttribute('role', 'link');
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        card.click();
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
    const english = document.documentElement.lang?.startsWith('en');
    document.querySelectorAll('#case-03 .product-screen-grid, #case-04 .product-screen-grid').forEach((grid) => {
      grid.setAttribute('aria-label', english ? 'Verified product screenshots' : '已验证的真实产品截图');
    });
  }

  /* On #case-01 content-v3 expands .case-links with the same proof links the
     V4 evidence bar carries, so the bar renders as a duplicate row directly
     beneath it. Keep the bar only where it adds links the row lacks. */
  function dedupeEvidenceBars() {
    document.querySelectorAll('.slide-panel').forEach((panel) => {
      const links = panel.querySelector('.case-links');
      const bar = panel.querySelector('.evidence-bar');
      if (links && bar && links.children.length > 1) bar.remove();
    });
  }

  function run() {
    applyPublishingMeta();
    repairContentTypos();
    improveAccessibility();
    markProofRails();
    dedupeEvidenceBars();
    stopLegacyPetalRAF();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();

  /* Language is the only late mutation V6 needs to observe. Pet UI mutations
     should not trigger full-page QA work. */
  const observer = new MutationObserver(() => markProofRails());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();


/* ================================================================ */
/* ================  LAYER: pet.js?v=0.5.0                              */
/* ================================================================ */

(() => {
  'use strict';

  if (window.CYSPet?.version) return;

  const VERSION = '0.5.0';
  const ASSET = 'assets/cys-pet/';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const STATES = new Set([
    'boot', 'idle', 'hover', 'wave', 'point', 'read', 'thinking', 'working',
    'success', 'error', 'dragging', 'sleep', 'wake'
  ]);

  const SPRITES = {
    boot: 'idle.webp', idle: 'idle.webp', hover: 'idle.webp', dragging: 'idle.webp',
    wake: 'wave.webp', wave: 'wave.webp', success: 'wave.webp', point: 'point.webp',
    read: 'read.webp', working: 'read.webp', thinking: 'thinking.webp',
    error: 'thinking.webp', sleep: 'sleep.webp'
  };

  const PRIORITY = {
    idle: 0, hover: 10, point: 20, read: 20, wave: 26, wake: 35,
    thinking: 70, working: 75, success: 80, error: 85, sleep: 90,
    dragging: 100, boot: 100
  };

  const labels = {
    zh: {
      profile: '简介', experience: '经历', education: '教育', focus: '方向', contact: '联系',
      ask: '可以问我：项目、训练、方向或联系方式。',
      placeholder: '问问 CYY…', thinking: 'THINKING', working: 'WORKING', here: '当前页'
    },
    en: {
      profile: 'Profile', experience: 'Experience', education: 'Education', focus: 'Focus', contact: 'Contact',
      ask: 'Ask me about projects, training, focus, or contact.',
      placeholder: 'Ask CYY…', thinking: 'THINKING', working: 'WORKING', here: 'HERE'
    }
  };

  const routes = {
    'index.html': { state: 'wave', zh: '欢迎来到我的个人档案。想先看哪一部分？', en: 'Welcome to my archive. Where would you like to begin?' },
    '': { state: 'wave', zh: '欢迎来到我的个人档案。想先看哪一部分？', en: 'Welcome to my archive. Where would you like to begin?' },
    'profile.html': { state: 'read', zh: '这里是个人简介与档案时间线。', en: 'This page holds the profile and archive timeline.' },
    'experience.html': { state: 'point', zh: '这里记录四组 AI 项目：RAG、智能体、数字人与可解释性。可以拖拽切换案例。', en: 'Four AI projects live here — RAG, agents, digital human, interpretability. Drag the deck to switch cases.' },
    'education.html': { state: 'read', zh: '这里按方向归档训练轨迹与技术栈。', en: 'Training directions and toolchains are archived here.' },
    'focus.html': { state: 'thinking', zh: '这里是持续深化的三个方向：检索、推理、构建。', en: 'Three directions keep deepening here — retrieve, reason, build.' },
    'contact.html': { state: 'wave', zh: '如果你想交流 RAG、智能体或工程实践，可以从这里联系。', en: 'For RAG, agents, or engineering conversations, you can reach out here.' }
  };

  const navMessages = {
    'profile.html': ['查看个人简介与时间线。', 'Open the profile and timeline.'],
    'experience.html': ['这里是实践经历档案。', 'Open the practice archive.'],
    'education.html': ['查看训练方向与技术栈。', 'Open training and toolchains.'],
    'focus.html': ['查看关注方向与研究问题。', 'Open focus and research questions.'],
    'contact.html': ['查看联系方式。', 'Open contact details.']
  };

  const runtime = {
    state: 'boot', previous: 'idle', statePriority: PRIORITY.boot, priorityUntil: 0,
    timer: 0, bubbleTimer: 0, inactivityTimer: 0, hoverTimer: 0, idleTimer: 0,
    dragging: false, moved: false, startX: 0, startY: 0, originLeft: 0, originTop: 0,
    introDone: false, pointerWasSleeping: false, lastHintHref: '', lastHintAt: 0,
    cssReady: false, spriteReady: false, activeSprite: 0, currentSprite: '',
    agentBusy: false, renderer: null
  };

  function lang() {
    return document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';
  }
  function copy() { return labels[lang()]; }
  function pathname() { return location.pathname.split('/').pop() || ''; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function now() { return performance.now(); }
  function isHome() { return pathname() === 'index.html' || pathname() === ''; }
  function isBusyState(state = runtime.state) { return ['thinking', 'working', 'success', 'error'].includes(state); }

  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = `${ASSET}pet.css?v=${VERSION}`;
  document.head.appendChild(styleLink);

  const root = document.createElement('aside');
  root.className = 'cys-pet-root is-hidden';
  root.setAttribute('aria-label', 'CYY Archive Companion');
  root.dataset.state = 'boot';
  root.hidden = true;
  root.innerHTML = `
    <div class="cys-pet-bubble" role="status" aria-live="polite">
      <div class="cys-pet-bubble-head"><span>01 / CYY</span><button class="cys-pet-bubble-close" type="button" aria-label="Close">×</button></div>
      <p class="cys-pet-bubble-text"></p>
    </div>
    <section class="cys-pet-panel" aria-label="Archive Companion panel">
      <div class="cys-pet-panel-head">
        <div class="cys-pet-panel-title">CYY · ARCHIVE COMPANION</div>
        <button class="cys-pet-panel-close" type="button" aria-label="Close">×</button>
        <div class="cys-pet-panel-sub">AGENT / RETRIEVAL / RESEARCH · v0.5 WEB</div>
      </div>
      <div class="cys-pet-actions">
        <button class="cys-pet-action" type="button" data-pet-route="profile.html" data-label="PROFILE"><b>PROFILE</b><span data-pet-label="profile"></span></button>
        <button class="cys-pet-action" type="button" data-pet-route="experience.html" data-label="EXPERIENCE"><b>EXPERIENCE</b><span data-pet-label="experience"></span></button>
        <button class="cys-pet-action" type="button" data-pet-route="education.html" data-label="EDUCATION"><b>EDUCATION</b><span data-pet-label="education"></span></button>
        <button class="cys-pet-action" type="button" data-pet-route="focus.html" data-label="FOCUS"><b>FOCUS</b><span data-pet-label="focus"></span></button>
        <button class="cys-pet-action" type="button" data-pet-route="contact.html" data-label="CONTACT"><b>CONTACT</b><span data-pet-label="contact"></span></button>
      </div>
      <form class="cys-pet-ask">
        <div class="cys-pet-input-wrap"><input class="cys-pet-input" autocomplete="off" /><button class="cys-pet-submit" type="submit" aria-label="Send">→</button></div>
        <p class="cys-pet-hint"></p>
      </form>
    </section>
    <div class="cys-pet-character" role="button" tabindex="0" aria-label="Open CYY Archive Companion">
      <img class="cys-pet-sprite is-active" data-pet-sprite="0" alt="CYY Archive Companion" draggable="false" />
      <img class="cys-pet-sprite" data-pet-sprite="1" alt="" aria-hidden="true" draggable="false" />
      <span class="cys-pet-sparkle" aria-hidden="true"></span>
      <span class="cys-pet-sleep-mark" aria-hidden="true">Z z</span>
      <span class="cys-pet-status"><i class="cys-pet-status-dot"></i><b>THINKING</b></span>
    </div>`;
  document.body.appendChild(root);

  const character = root.querySelector('.cys-pet-character');
  const spriteLayers = [...root.querySelectorAll('.cys-pet-sprite')];
  const bubble = root.querySelector('.cys-pet-bubble');
  const bubbleText = root.querySelector('.cys-pet-bubble-text');
  const panel = root.querySelector('.cys-pet-panel');
  const input = root.querySelector('.cys-pet-input');
  const hint = root.querySelector('.cys-pet-hint');
  const statusText = root.querySelector('.cys-pet-status b');

  function updateLanguage() {
    const c = copy();
    ['profile', 'experience', 'education', 'focus', 'contact'].forEach((key) => {
      const el = root.querySelector(`[data-pet-label="${key}"]`);
      if (el) el.textContent = c[key];
    });
    input.placeholder = c.placeholder;
    hint.textContent = c.ask;
    markCurrentRoute();
  }
  updateLanguage();

  const langObserver = new MutationObserver(updateLanguage);
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  function spriteFor(state) { return `${ASSET}${SPRITES[state] || SPRITES.idle}`; }

  function createSpriteRenderer() {
    function setState(state, options = {}) {
      const src = spriteFor(state);
      if (runtime.currentSprite === src && !options.immediate) return;
      runtime.currentSprite = src;

      if (options.immediate || reduceMotion) {
        spriteLayers.forEach((layer, index) => {
          layer.src = src;
          layer.classList.toggle('is-active', index === 0);
        });
        runtime.activeSprite = 0;
        return;
      }

      const nextIndex = runtime.activeSprite === 0 ? 1 : 0;
      const next = spriteLayers[nextIndex];
      const prev = spriteLayers[runtime.activeSprite];
      const activate = () => {
        next.classList.add('is-active');
        prev.classList.remove('is-active');
        runtime.activeSprite = nextIndex;
      };

      if (next.src.endsWith(src) && next.complete) {
        activate();
        return;
      }
      next.onload = activate;
      next.onerror = activate;
      next.src = src;
    }

    return { kind: 'sprite-crossfade', setState };
  }

  runtime.renderer = createSpriteRenderer();

  function registerRenderer(renderer) {
    if (!renderer || typeof renderer.setState !== 'function') return false;
    runtime.renderer = renderer;
    runtime.renderer.setState(runtime.state, { immediate: true });
    root.dataset.renderer = renderer.kind || 'custom';
    return true;
  }

  function preloadSprites() {
    [...new Set(Object.values(SPRITES))].forEach((name) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = `${ASSET}${name}`;
    });
  }

  function canTransition(next, options) {
    if (options.force) return true;
    if (runtime.dragging && next !== 'dragging') return false;
    const nextPriority = options.priority ?? PRIORITY[next] ?? 0;
    if (now() < runtime.priorityUntil && nextPriority < runtime.statePriority) return false;
    return true;
  }

  function setState(next, options = {}) {
    if (!STATES.has(next)) next = 'idle';
    if (!canTransition(next, options)) return false;

    const nextPriority = options.priority ?? PRIORITY[next] ?? 0;
    if (runtime.state !== next) runtime.previous = runtime.state;
    runtime.state = next;
    runtime.statePriority = nextPriority;
    runtime.priorityUntil = options.hold ? Number.POSITIVE_INFINITY : now() + (options.lock || options.duration || 0);
    root.dataset.state = next;
    statusText.textContent = next === 'working' ? copy().working : copy().thinking;
    runtime.renderer?.setState(next, { immediate: options.immediate });

    clearTimeout(runtime.timer);
    if (options.duration) {
      runtime.timer = setTimeout(() => {
        runtime.priorityUntil = 0;
        setState(options.after || 'idle', { force: true, priority: PRIORITY[options.after || 'idle'] || 0 });
      }, options.duration);
    }

    if (next === 'idle') scheduleIdleMotion();
    else clearTimeout(runtime.idleTimer);

    root.dispatchEvent(new CustomEvent('cys:state', { detail: { state: next, priority: nextPriority } }));
    return true;
  }

  function say(message, options = {}) {
    if (!message) return;
    bubbleText.textContent = message;
    bubble.classList.add('is-visible');
    clearTimeout(runtime.bubbleTimer);
    if (options.duration !== 0) {
      runtime.bubbleTimer = setTimeout(() => bubble.classList.remove('is-visible'), options.duration || 4200);
    }
    if (options.state) {
      setState(options.state, {
        priority: options.priority,
        lock: options.lock || 900,
        hold: options.hold,
        duration: options.stateDuration || 1900,
        after: options.after || 'idle',
        force: options.force
      });
    }
  }

  function closeBubble() {
    clearTimeout(runtime.bubbleTimer);
    bubble.classList.remove('is-visible');
  }

  function markCurrentRoute() {
    const current = pathname();
    root.querySelectorAll('[data-pet-route]').forEach((button) => {
      const active = button.dataset.petRoute === current;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
      button.title = active ? copy().here : '';
    });
  }

  function openPanel(force) {
    const shouldOpen = typeof force === 'boolean' ? force : !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', shouldOpen);
    root.classList.toggle('is-panel-open', shouldOpen);
    if (shouldOpen) {
      closeBubble();
      markCurrentRoute();
      setState('hover', { force: true, priority: PRIORITY.hover });
      setTimeout(() => input.focus({ preventScroll: true }), 120);
    } else if (!runtime.agentBusy) {
      setState('idle', { force: true });
    }
  }

  function navigate(href, label) {
    if (href === pathname()) {
      say(lang() === 'en' ? 'You are already here.' : '已经在这一页了。', { state: 'wave', duration: 1500, force: true });
      return;
    }
    openPanel(false);
    setState('point', { force: true, priority: 40, lock: 500, duration: 650, after: 'idle' });
    setTimeout(() => {
      if (typeof window.runExitTransition === 'function') window.runExitTransition(label || 'ARCHIVE', href);
      else location.href = href;
    }, 160);
  }

  function inferAsk(text) {
    const q = text.trim().toLowerCase();
    const isEn = lang() === 'en';
    if (!q) return;

    runtime.agentBusy = true;
    setState('thinking', { force: true, priority: PRIORITY.thinking, hold: true });
    say(isEn ? 'Searching the archive…' : '正在检索档案…', { duration: 0 });

    setTimeout(() => {
      let target = null;
      let label = null;
      let message = '';
      let state = 'success';

      if (/(经历|实习|项目|project|experience|intern|rag|agent)/i.test(q)) {
        target = 'experience.html'; label = 'EXPERIENCE';
        message = isEn ? 'The experience archive holds four AI project cases. I can take you there.' : '经历档案里有四组 AI 项目案例，我带你过去。';
      } else if (/(教育|课程|学校|gpa|education|course|school)/i.test(q)) {
        target = 'education.html'; label = 'EDUCATION'; state = 'read';
        message = isEn ? 'Training directions and toolchains are filed on the Training page.' : '训练方向与技术栈都整理在 Training 页面。';
      } else if (/(研究|方向|focus|research|检索|推理|构建)/i.test(q)) {
        target = 'focus.html'; label = 'FOCUS'; state = 'thinking';
        message = isEn ? 'The Focus archive covers the three directions — retrieve, reason, build.' : 'Focus 档案整理了检索、推理与构建三个方向。';
      } else if (/(联系|邮箱|email|contact|微信|wechat)/i.test(q)) {
        target = 'contact.html'; label = 'CONTACT'; state = 'wave';
        message = isEn ? 'Contact details are in the final archive page.' : '联系方式在最后一页档案里，我带你过去。';
      } else if (/(简介|是谁|profile|about|介绍)/i.test(q)) {
        target = 'profile.html'; label = 'PROFILE'; state = 'point';
        message = isEn ? 'The Profile page is the shortest introduction and timeline.' : 'Profile 页面有简短介绍和档案时间线。';
      } else {
        runtime.agentBusy = false;
        runtime.priorityUntil = 0;
        say(isEn ? 'I can guide you through Profile, Experience, Training, Focus, and Contact. Try asking about one of them.' : '我可以带你查看简介、经历、训练、方向和联系方式。试着问我其中一项吧。', {
          state: 'wave', priority: 35, duration: 2600, stateDuration: 1900, force: true
        });
        return;
      }

      runtime.agentBusy = false;
      runtime.priorityUntil = 0;
      say(message, { state, priority: 45, duration: 1800, stateDuration: 1500, force: true });
      if (target) setTimeout(() => navigate(target, label), 900);
    }, 650);
  }

  function scheduleIdleMotion() {
    clearTimeout(runtime.idleTimer);
    if (reduceMotion || root.hidden || document.hidden) return;
    const delay = 22000 + Math.random() * 18000;
    runtime.idleTimer = setTimeout(() => {
      if (runtime.state !== 'idle' || runtime.agentBusy || runtime.dragging || panel.classList.contains('is-open')) {
        scheduleIdleMotion();
        return;
      }
      const roll = Math.random();
      const state = roll < .52 ? 'wave' : roll < .78 ? 'read' : 'thinking';
      const duration = state === 'thinking' ? 2200 : 1700;
      setState(state, { priority: 15, lock: duration, duration, after: 'idle' });
    }, delay);
  }

  root.addEventListener('click', (event) => event.stopPropagation());
  root.addEventListener('pointerenter', () => document.body.classList.add('cys-pet-hovering'));
  root.addEventListener('pointerleave', () => document.body.classList.remove('cys-pet-hovering'));
  root.querySelector('.cys-pet-bubble-close').addEventListener('click', closeBubble);
  root.querySelector('.cys-pet-panel-close').addEventListener('click', () => openPanel(false));
  root.querySelectorAll('[data-pet-route]').forEach((button) => {
    button.addEventListener('click', () => navigate(button.dataset.petRoute, button.dataset.label));
  });
  root.querySelector('.cys-pet-ask').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value;
    input.value = '';
    inferAsk(text);
  });

  character.addEventListener('mouseenter', () => {
    if (!runtime.dragging && runtime.state !== 'sleep' && !runtime.agentBusy) {
      setState('hover', { priority: PRIORITY.hover });
    }
  });
  character.addEventListener('mouseleave', () => {
    if (!runtime.dragging && runtime.state === 'hover' && !panel.classList.contains('is-open')) {
      setState('idle', { force: true });
    }
  });
  character.addEventListener('dblclick', () => {
    if (runtime.dragging || runtime.agentBusy) return;
    setState('wave', { force: true, priority: 32, duration: 1700, after: 'idle' });
  });
  character.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPanel();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) openPanel(false);
  });
  document.addEventListener('pointerdown', (event) => {
    if (panel.classList.contains('is-open') && !root.contains(event.target)) openPanel(false);
  }, true);

  if (finePointer && !reduceMotion) {
    window.addEventListener('pointermove', (event) => {
      if (runtime.dragging || root.hidden) return;
      const rect = character.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * .26;
      root.style.setProperty('--look-x', clamp((event.clientX - cx) / window.innerWidth * 4, -2.0, 2.0).toFixed(2));
      root.style.setProperty('--look-y', clamp((event.clientY - cy) / window.innerHeight * 3, -1.4, 1.4).toFixed(2));
    }, { passive: true });
  }

  function storedPosition() {
    try { return JSON.parse(localStorage.getItem('cys-pet-position-v1') || 'null'); }
    catch (_) { return null; }
  }

  function applyStoredPosition() {
    const pos = storedPosition();
    if (!pos) return;
    root.classList.toggle('is-left', pos.side === 'left');
    const height = root.getBoundingClientRect().height || 230;
    const top = clamp((pos.y || .66) * innerHeight, 76, innerHeight - height - 8);
    root.style.top = top + 'px';
    root.style.bottom = 'auto';
  }

  character.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    runtime.pointerWasSleeping = runtime.state === 'sleep';
    runtime.dragging = true;
    runtime.moved = false;
    runtime.startX = event.clientX;
    runtime.startY = event.clientY;
    const rect = root.getBoundingClientRect();
    runtime.originLeft = rect.left;
    runtime.originTop = rect.top;
    root.style.left = rect.left + 'px';
    root.style.right = 'auto';
    root.style.top = rect.top + 'px';
    root.style.bottom = 'auto';
    root.classList.add('is-dragging');
    setState('dragging', { force: true, priority: PRIORITY.dragging, hold: true });
    character.setPointerCapture?.(event.pointerId);
  });

  character.addEventListener('pointermove', (event) => {
    if (!runtime.dragging) return;
    const dx = event.clientX - runtime.startX;
    const dy = event.clientY - runtime.startY;
    if (Math.hypot(dx, dy) > 5) runtime.moved = true;
    const width = root.getBoundingClientRect().width;
    const height = root.getBoundingClientRect().height;
    root.style.left = clamp(runtime.originLeft + dx, 4, innerWidth - width - 4) + 'px';
    root.style.top = clamp(runtime.originTop + dy, 70, innerHeight - height - 4) + 'px';
  });

  function finishDrag(event) {
    if (!runtime.dragging) return;
    runtime.dragging = false;
    runtime.priorityUntil = 0;
    root.classList.remove('is-dragging');
    const rect = root.getBoundingClientRect();
    const side = rect.left + rect.width / 2 < innerWidth / 2 ? 'left' : 'right';
    const top = clamp(rect.top, 76, innerHeight - rect.height - 8);
    root.classList.toggle('is-left', side === 'left');
    root.style.left = '';
    root.style.right = '';
    root.style.top = top + 'px';
    root.style.bottom = 'auto';

    try { localStorage.setItem('cys-pet-position-v1', JSON.stringify({ side, y: top / innerHeight })); }
    catch (_) {}

    if (!reduceMotion && window.gsap) {
      gsap.fromTo(character, { x: side === 'left' ? -3 : 3 }, { x: 0, duration: .35, ease: 'back.out(2)' });
    }

    if (runtime.pointerWasSleeping && !runtime.moved) {
      runtime.pointerWasSleeping = false;
      setState('wake', { force: true, priority: PRIORITY.wake, duration: 1300, after: 'idle' });
      say(lang() === 'en' ? 'I am here.' : '我在。', { duration: 1400 });
    } else {
      runtime.pointerWasSleeping = false;
      setState('idle', { force: true });
      if (!runtime.moved) openPanel();
    }

    if (event?.pointerId !== undefined) character.releasePointerCapture?.(event.pointerId);
  }

  character.addEventListener('pointerup', finishDrag);
  character.addEventListener('pointercancel', finishDrag);

  function markActivity() {
    clearTimeout(runtime.inactivityTimer);
    if (runtime.state === 'sleep' && !runtime.dragging) {
      runtime.priorityUntil = 0;
      setState('wake', { force: true, priority: PRIORITY.wake, duration: 1300, after: 'idle' });
    }
    runtime.inactivityTimer = setTimeout(() => {
      if (!runtime.dragging && !runtime.agentBusy && !panel.classList.contains('is-open')) {
        closeBubble();
        setState('sleep', { force: true, priority: PRIORITY.sleep, hold: true });
      }
    }, 90000);
  }

  ['pointerdown', 'keydown', 'wheel', 'scroll', 'touchstart'].forEach((name) => {
    window.addEventListener(name, markActivity, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      closeBubble();
      setState('sleep', { force: true, priority: PRIORITY.sleep, hold: true });
    } else {
      runtime.priorityUntil = 0;
      markActivity();
    }
  });

  function scheduleNavHint(link) {
    clearTimeout(runtime.hoverTimer);
    const href = link?.getAttribute('href') || '';
    const msg = navMessages[href];
    if (!msg || runtime.dragging || runtime.state === 'sleep' || runtime.agentBusy || panel.classList.contains('is-open')) return;
    setState('point', { priority: PRIORITY.point, lock: 650 });
    runtime.hoverTimer = setTimeout(() => {
      const tooSoon = runtime.lastHintHref === href && Date.now() - runtime.lastHintAt < 12000;
      if (tooSoon) return;
      runtime.lastHintHref = href;
      runtime.lastHintAt = Date.now();
      if (finePointer) say(msg[lang() === 'en' ? 1 : 0], { duration: 1500 });
    }, 420);
  }

  document.addEventListener('mouseover', (event) => {
    const link = event.target.closest?.('.nav-links a, .home-actions a');
    if (link) scheduleNavHint(link);
  });
  document.addEventListener('mouseout', (event) => {
    const link = event.target.closest?.('.nav-links a, .home-actions a');
    if (!link) return;
    clearTimeout(runtime.hoverTimer);
    if (runtime.state === 'point' && !bubble.classList.contains('is-visible')) setState('idle', { force: true });
  });

  const observeTargets = Array.from(document.querySelectorAll('.content-block, .case-section, .slide-panel, .subpage-hero'));
  if ('IntersectionObserver' in window && observeTargets.length) {
    let lastSectionAt = 0;
    const observer = new IntersectionObserver((entries) => {
      const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!best || Date.now() - lastSectionAt < 5200 || panel.classList.contains('is-open') || runtime.state === 'sleep' || runtime.agentBusy) return;
      if (best.intersectionRatio > .45) {
        lastSectionAt = Date.now();
        setState(best.target.matches('.subpage-hero') ? 'point' : 'read', {
          priority: 18, lock: 900, duration: 1700, after: 'idle'
        });
      }
    }, { threshold: [.45, .65] });
    observeTargets.forEach((el) => observer.observe(el));
  }

  window.addEventListener('resize', () => {
    if (!root.hidden) applyStoredPosition();
  });

  window.addEventListener('cys:pet', (event) => {
    const detail = event.detail || {};
    if (detail.message) {
      say(detail.message, {
        state: detail.state,
        priority: detail.priority,
        duration: detail.duration,
        stateDuration: detail.stateDuration,
        hold: detail.hold,
        force: detail.force
      });
    } else if (detail.state) {
      setState(detail.state, {
        priority: detail.priority,
        duration: detail.duration,
        after: detail.after,
        hold: detail.hold,
        force: detail.force
      });
    }
  });

  function agentThinking(message) {
    runtime.agentBusy = true;
    setState('thinking', { force: true, priority: PRIORITY.thinking, hold: true });
    say(message || (lang() === 'en' ? 'Thinking…' : '正在思考…'), { duration: 0 });
  }

  function agentWorking(message) {
    runtime.agentBusy = true;
    setState('working', { force: true, priority: PRIORITY.working, hold: true });
    say(message || (lang() === 'en' ? 'Working through the archive…' : '正在处理档案…'), { duration: 0 });
  }

  function finishAgent(state, message, duration) {
    runtime.agentBusy = false;
    runtime.priorityUntil = 0;
    say(message, {
      state, force: true, priority: PRIORITY[state], duration,
      stateDuration: state === 'error' ? 2200 : 1800, after: 'idle'
    });
  }

  const api = {
    version: VERSION,
    state: () => runtime.state,
    renderer: () => runtime.renderer?.kind || 'unknown',
    registerRenderer,
    setState: (state, options = {}) => setState(state, { ...options, force: options.force ?? true }),
    say,
    open: () => openPanel(true),
    close: () => openPanel(false),
    sleep: () => setState('sleep', { force: true, priority: PRIORITY.sleep, hold: true }),
    wake: () => { runtime.priorityUntil = 0; markActivity(); },
    agent: {
      thinking: agentThinking,
      working: agentWorking,
      success(message) { finishAgent('success', message || (lang() === 'en' ? 'Done.' : '完成。'), 2600); },
      error(message) { finishAgent('error', message || (lang() === 'en' ? 'Something went wrong.' : '这里遇到了一点问题。'), 3000); }
    }
  };
  window.CYSPet = api;

  function shouldShowRouteGreeting() {
    if (isHome()) return true;
    try {
      const last = Number(sessionStorage.getItem('cys-pet-last-greeting') || 0);
      return Date.now() - last > 22000;
    } catch (_) {
      return true;
    }
  }

  function stampGreeting() {
    try { sessionStorage.setItem('cys-pet-last-greeting', String(Date.now())); }
    catch (_) {}
  }

  function showPet() {
    if (runtime.introDone || !runtime.cssReady || !runtime.spriteReady) return;
    runtime.introDone = true;
    root.hidden = false;
    applyStoredPosition();
    root.classList.remove('is-hidden');

    requestAnimationFrame(() => {
      if (reduceMotion) {
        root.classList.add('is-ready');
      } else if (isHome()) {
        const origin = document.getElementById('homeArchiveCard');
        if (origin && window.gsap) {
          const from = origin.getBoundingClientRect();
          const to = root.getBoundingClientRect();
          const dx = from.left + from.width * .76 - (to.left + to.width / 2);
          const dy = from.top + from.height * .69 - (to.top + to.height / 2);
          gsap.set(root, { x: dx, y: dy, scale: .32, opacity: 0 });
          root.classList.add('is-ready');
          gsap.to(root, {
            x: 0, y: 0, scale: 1, opacity: 1,
            duration: .92, delay: .14, ease: 'power4.out', clearProps: 'transform,opacity'
          });
        } else {
          root.classList.add('is-ready');
        }
      } else {
        root.classList.add('is-ready');
        if (window.gsap) {
          gsap.from(root, { y: 14, opacity: 0, duration: .5, ease: 'power3.out', clearProps: 'transform,opacity' });
        }
      }
    });

    markActivity();
    const route = routes[pathname()] || routes[''];
    const showGreeting = shouldShowRouteGreeting();
    setTimeout(() => {
      runtime.priorityUntil = 0;
      setState(route.state, {
        force: true,
        priority: 30,
        lock: 1500,
        duration: route.state === 'thinking' ? 2500 : 1800,
        after: 'idle'
      });
      if (showGreeting) {
        stampGreeting();
        say(route[lang()], { duration: 4100 });
      }
    }, reduceMotion ? 100 : 880);
  }

  function waitForIntro() {
    const intro = document.getElementById('intro');
    if (!intro) {
      showPet();
      return;
    }
    const observer = new MutationObserver(() => {
      if (!document.getElementById('intro')) {
        observer.disconnect();
        showPet();
      }
    });
    observer.observe(document.body, { childList: true, subtree: false });
    setTimeout(() => {
      if (!document.getElementById('intro')) showPet();
    }, 4600);
  }

  styleLink.addEventListener('load', () => {
    runtime.cssReady = true;
    waitForIntro();
  }, { once: true });
  styleLink.addEventListener('error', () => {
    runtime.cssReady = true;
    waitForIntro();
  }, { once: true });

  const firstSprite = spriteLayers[0];
  firstSprite.decoding = 'async';
  firstSprite.src = spriteFor('idle');
  runtime.currentSprite = firstSprite.src;
  firstSprite.addEventListener('load', () => {
    runtime.spriteReady = true;
    runtime.renderer.setState('idle', { immediate: true });
    preloadSprites();
    waitForIntro();
  }, { once: true });
  firstSprite.addEventListener('error', () => {
    runtime.spriteReady = true;
    waitForIntro();
  }, { once: true });
})();


/* ================================================================ */
/* ================  LAYER: pet-v06.js?v=0.6.0                          */
/* ================================================================ */

(() => {
  'use strict';

  const api = window.CYSPet;
  const root = document.querySelector('.cys-pet-root');
  if (!api || !root || root.dataset.v06Ready === '1') return;

  const VERSION = '0.6.0';
  const ASSET = 'assets/cys-pet/';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

  root.dataset.v06Ready = '1';
  root.dataset.renderer = api.renderer?.() || 'sprite-crossfade';

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = `${ASSET}pet-v06.css?v=${VERSION}`;
  document.head.appendChild(style);

  const character = root.querySelector('.cys-pet-character');
  const panel = root.querySelector('.cys-pet-panel');
  const panelHead = root.querySelector('.cys-pet-panel-head');
  const panelClose = root.querySelector('.cys-pet-panel-close');
  const panelSub = root.querySelector('.cys-pet-panel-sub');
  const bubble = root.querySelector('.cys-pet-bubble');
  const input = root.querySelector('.cys-pet-input');
  const spriteLayers = [...root.querySelectorAll('.cys-pet-sprite')];

  if (!character || !panel || !panelHead || !bubble) return;

  /* Renderer host: v0.5 owns state dispatch; v0.6 supplies a mount point and a
     richer contract for Rive/Live2D without touching page or Agent logic. */
  let renderStage = root.querySelector('.cys-pet-render-stage');
  if (!renderStage) {
    renderStage = document.createElement('div');
    renderStage.className = 'cys-pet-render-stage';
    spriteLayers.forEach((layer) => renderStage.appendChild(layer));
    character.insertBefore(renderStage, character.firstChild);
  }

  let rendererHost = root.querySelector('.cys-pet-renderer-host');
  if (!rendererHost) {
    rendererHost = document.createElement('div');
    rendererHost.className = 'cys-pet-renderer-host';
    rendererHost.setAttribute('aria-hidden', 'true');
    character.insertBefore(rendererHost, renderStage.nextSibling);
  }

  /* Page context row. It updates quietly as sections become prominent, giving
     the companion actual awareness of what the visitor is reading. */
  let contextRow = root.querySelector('.cys-pet-context');
  if (!contextRow) {
    contextRow = document.createElement('div');
    contextRow.className = 'cys-pet-context';
    contextRow.innerHTML = '<span>NOW</span><b>ARCHIVE</b>';
    panelHead.insertAdjacentElement('afterend', contextRow);
  }
  const contextLabel = contextRow.querySelector('b');
  let activeSection = '';

  function routeName() {
    const name = location.pathname.split('/').pop() || 'index.html';
    const map = {
      'index.html': 'HOME', 'profile.html': 'PROFILE', 'experience.html': 'EXPERIENCE',
      'education.html': 'EDUCATION', 'focus.html': 'FOCUS', 'contact.html': 'CONTACT'
    };
    return map[name] || 'ARCHIVE';
  }

  function labelForSection(el) {
    if (!el) return routeName();
    const heading = el.querySelector?.('h1, h2, h3, .sub-kicker, .case-role');
    const raw = heading?.textContent?.trim().replace(/\s+/g, ' ');
    if (!raw) return routeName();
    return `${routeName()} · ${raw}`.slice(0, 82);
  }

  function updateContext(label) {
    activeSection = label || routeName();
    contextLabel.textContent = activeSection;
    contextLabel.title = activeSection;
  }
  updateContext(routeName());

  const contextTargets = [...document.querySelectorAll('.subpage-hero, .content-block, .case-section, .slide-panel, .focus-item, .timeline-item')];
  if ('IntersectionObserver' in window && contextTargets.length) {
    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
        else visible.delete(entry.target);
      });
      if (!visible.size) return;
      const [best] = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
      updateContext(labelForSection(best));
    }, { threshold: [0.3, 0.5, 0.7] });
    contextTargets.forEach((el) => observer.observe(el));
  }

  /* Accessibility: expose panel state and keep hidden controls out of the tab
     order. */
  panel.id ||= 'cysPetPanel';
  character.setAttribute('aria-controls', panel.id);
  character.setAttribute('aria-expanded', panel.classList.contains('is-open') ? 'true' : 'false');
  if ('inert' in panel) panel.inert = !panel.classList.contains('is-open');

  const panelObserver = new MutationObserver(() => {
    const open = panel.classList.contains('is-open');
    character.setAttribute('aria-expanded', String(open));
    if ('inert' in panel) panel.inert = !open;
    if (open) requestAnimationFrame(() => fitFloating(panel, 'panel'));
  });
  panelObserver.observe(panel, { attributes: true, attributeFilter: ['class'] });

  if (panelSub) panelSub.textContent = 'CASE / TREATY / RESEARCH · v0.6 WEB';

  /* Minimize/restore: useful on phones and long reading sessions. It persists
     only for the current tab session, so the companion always returns next time. */
  const tools = document.createElement('span');
  tools.className = 'cys-pet-panel-tools';
  const minimize = document.createElement('button');
  minimize.type = 'button';
  minimize.className = 'cys-pet-panel-minimize';
  minimize.setAttribute('aria-label', 'Minimize CYS companion');
  minimize.textContent = '−';
  tools.append(minimize);
  if (panelClose) tools.append(panelClose);
  panelHead.append(tools);

  const summon = document.createElement('button');
  summon.type = 'button';
  summon.className = 'cys-pet-summon';
  summon.setAttribute('aria-label', 'Restore CYS Archive Companion');
  summon.textContent = 'CYS';
  document.body.appendChild(summon);

  function minimizedStored() {
    try { return sessionStorage.getItem('cys-pet-minimized-v1') === '1'; }
    catch (_) { return false; }
  }
  function storeMinimized(value) {
    try { sessionStorage.setItem('cys-pet-minimized-v1', value ? '1' : '0'); }
    catch (_) {}
  }
  function syncSummonSide() {
    summon.classList.toggle('is-left', root.classList.contains('is-left'));
  }
  function minimizePet() {
    api.close?.();
    root.classList.add('is-minimized');
    summon.classList.add('is-visible');
    storeMinimized(true);
    syncSummonSide();
  }
  function restorePet({ greet = true } = {}) {
    root.classList.remove('is-minimized');
    summon.classList.remove('is-visible');
    storeMinimized(false);
    if (greet) {
      api.setState?.('wave', { force: true, priority: 36, duration: 1500, after: 'idle' });
      api.say?.(document.documentElement.lang?.startsWith('en') ? 'Archive Companion restored.' : '档案助手已回来。', { duration: 1500 });
    }
  }
  minimize.addEventListener('click', minimizePet);
  summon.addEventListener('click', () => restorePet());

  const sideObserver = new MutationObserver(syncSummonSide);
  sideObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
  syncSummonSide();
  if (minimizedStored()) minimizePet();

  /* Smart floating placement for a pet that can be dragged anywhere. */
  function fitFloating(el, type) {
    if (!el || isMobile() || root.classList.contains('is-minimized')) return;
    const prop = type === 'panel' ? '--cys-panel-shift-y' : '--cys-bubble-shift-y';
    el.style.setProperty(prop, '0px');
    const rect = el.getBoundingClientRect();
    const safeTop = 82;
    const safeBottom = innerHeight - 14;
    let shift = 0;
    if (rect.top < safeTop) shift += safeTop - rect.top;
    if (rect.bottom + shift > safeBottom) shift -= rect.bottom + shift - safeBottom;
    el.style.setProperty(prop, `${Math.round(shift)}px`);
  }

  const bubbleObserver = new MutationObserver(() => {
    if (bubble.classList.contains('is-visible')) requestAnimationFrame(() => fitFloating(bubble, 'bubble'));
  });
  bubbleObserver.observe(bubble, { attributes: true, attributeFilter: ['class'] });

  function refit() {
    if (panel.classList.contains('is-open')) fitFloating(panel, 'panel');
    if (bubble.classList.contains('is-visible')) fitFloating(bubble, 'bubble');
    syncSummonSide();
  }
  window.addEventListener('resize', refit, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(refit, 120), { passive: true });
  root.addEventListener('cys:state', () => requestAnimationFrame(refit));

  /* Renderer v2 adapter. Expected shape:
     { kind, mount(host, ctx), setState(state, options), setLook({x,y}),
       setActive(bool), resize(rect), destroy() }
     Only setState is required. */
  let mountedRenderer = null;
  const coreRegisterRenderer = api.registerRenderer?.bind(api);

  function mountRenderer(renderer) {
    if (!renderer || typeof renderer.setState !== 'function' || !coreRegisterRenderer) return false;
    try { mountedRenderer?.destroy?.(); } catch (_) {}
    rendererHost.replaceChildren();

    const context = {
      root,
      character,
      host: rendererHost,
      version: VERSION,
      reducedMotion: reduceMotion,
      assetBase: ASSET,
      getContext: () => companionContext()
    };

    try { renderer.mount?.(rendererHost, context); }
    catch (error) {
      console.error('[CYS] custom renderer mount failed', error);
      return false;
    }

    const adapter = {
      kind: renderer.kind || 'custom-v2',
      setState(state, options) { renderer.setState(state, options, context); }
    };
    const ok = coreRegisterRenderer(adapter);
    if (!ok) return false;

    mountedRenderer = renderer;
    root.dataset.renderer = adapter.kind;
    try { renderer.setActive?.(!document.hidden && !root.classList.contains('is-minimized')); } catch (_) {}
    try { renderer.resize?.(character.getBoundingClientRect()); } catch (_) {}
    return true;
  }

  function companionContext() {
    return {
      version: VERSION,
      route: routeName(),
      path: location.pathname,
      language: document.documentElement.lang || 'zh-CN',
      section: activeSection || routeName(),
      state: api.state?.() || root.dataset.state || 'idle',
      renderer: api.renderer?.() || root.dataset.renderer || 'unknown',
      minimized: root.classList.contains('is-minimized')
    };
  }

  if (!reduceMotion) {
    window.addEventListener('pointermove', (event) => {
      if (!mountedRenderer?.setLook || mountedRenderer.kind === 'layered-motion' || root.classList.contains('is-minimized')) return;
      const rect = character.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * .28;
      const x = Math.max(-1, Math.min(1, (event.clientX - cx) / Math.max(innerWidth * .34, 1)));
      const y = Math.max(-1, Math.min(1, (event.clientY - cy) / Math.max(innerHeight * .34, 1)));
      try { mountedRenderer.setLook({ x, y }); } catch (_) {}
    }, { passive: true });
  }

  document.addEventListener('visibilitychange', () => {
    try { mountedRenderer?.setActive?.(!document.hidden && !root.classList.contains('is-minimized')); } catch (_) {}
  });
  const characterResize = new ResizeObserver(() => {
    try { mountedRenderer?.resize?.(character.getBoundingClientRect()); } catch (_) {}
    refit();
  });
  characterResize.observe(character);

  /* Public v0.6 surface. Preserve v0.5 methods while adding non-breaking APIs. */
  api.version = VERSION;
  api.mountRenderer = mountRenderer;
  api.context = companionContext;
  api.minimize = minimizePet;
  api.restore = restorePet;
  api.isMinimized = () => root.classList.contains('is-minimized');
  api.refit = refit;
  api.rendererHost = () => rendererHost;

  const readyDetail = { api, context: companionContext() };
  window.dispatchEvent(new CustomEvent('cys:pet:ready', { detail: readyDetail }));
  document.dispatchEvent(new CustomEvent('cys:pet:ready', { detail: readyDetail }));
})();


/* ================================================================ */
/* ================  LAYER: pet-v061.js?v=0.6.1                         */
/* ================================================================ */

(() => {
  'use strict';

  const api = window.CYSPet;
  const root = document.querySelector('.cys-pet-root');
  if (!api || !root || root.dataset.v061Ready === '1') return;

  const VERSION = '0.6.1';
  const ASSET = 'assets/cys-pet/';
  root.dataset.v061Ready = '1';

  const character = root.querySelector('.cys-pet-character');
  const bubble = root.querySelector('.cys-pet-bubble');
  const bubbleText = root.querySelector('.cys-pet-bubble-text');
  const bubbleName = root.querySelector('.cys-pet-bubble-head span');
  const panelSub = root.querySelector('.cys-pet-panel-sub');
  const spriteLayers = [...root.querySelectorAll('.cys-pet-sprite')];

  if (bubbleName) bubbleName.textContent = 'Yaoyang Chen';
  if (panelSub) panelSub.remove();

  function routeKey() {
    if (document.querySelector('.home-cover') || document.getElementById('homeArchiveCard')) return 'index';
    const segment = location.pathname.split('/').filter(Boolean).pop() || 'index';
    return segment.toLowerCase().replace(/\.html$/, '') || 'index';
  }

  const currentRoute = routeKey();
  const isHome = currentRoute === 'index';
  const pageState = {
    profile: 'read',
    experience: 'read',
    education: 'read',
    focus: 'thinking',
    contact: 'wave'
  };

  /* The v0.5 point sprite is the asset that can show the colour/glitch artifact
     during navigation. Keep the semantic state, but render it with the stable
     wave pose until the final Rive rig replaces these WebP assets. */
  if (api.registerRenderer && spriteLayers.length >= 2) {
    const map = {
      boot: 'idle.webp', idle: 'idle.webp', hover: 'idle.webp', dragging: 'idle.webp',
      wake: 'wave.webp', wave: 'wave.webp', success: 'wave.webp', point: 'wave.webp',
      read: 'read.webp', working: 'read.webp', thinking: 'thinking.webp',
      error: 'thinking.webp', sleep: 'sleep.webp'
    };
    let active = Math.max(0, spriteLayers.findIndex((layer) => layer.classList.contains('is-active')));
    let current = '';

    api.registerRenderer({
      kind: 'sprite-crossfade',
      setState(state, options = {}) {
        const src = `${ASSET}${map[state] || map.idle}`;
        if (src === current && !options.immediate) return;
        current = src;

        if (options.immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          spriteLayers.forEach((layer, index) => {
            layer.src = src;
            layer.classList.toggle('is-active', index === 0);
          });
          active = 0;
          return;
        }

        const nextIndex = active === 0 ? 1 : 0;
        const next = spriteLayers[nextIndex];
        const prev = spriteLayers[active];
        const activate = () => {
          next.classList.add('is-active');
          prev.classList.remove('is-active');
          active = nextIndex;
        };
        if (next.src.endsWith(src) && next.complete) activate();
        else {
          next.onload = activate;
          next.onerror = activate;
          next.src = src;
        }
      }
    });
  }

  /* Mouse movement/hover should no longer switch poses. Hover CSS can still
     style links normally; only the companion action state is suppressed. */
  const navSelector = '.nav-links a, .home-actions a';
  ['mouseover', 'mouseout'].forEach((type) => {
    window.addEventListener(type, (event) => {
      if (event.target?.closest?.(navSelector)) event.stopPropagation();
    }, true);
  });
  ['mouseenter', 'mouseleave'].forEach((type) => {
    window.addEventListener(type, (event) => {
      if (event.target === character) event.stopPropagation();
    }, true);
  });

  /* v0.5 also translates the whole sprite by a few pixels on pointer move.
     Until we have a real eye/head rig, keep the current WebP character still. */
  window.addEventListener('pointermove', () => {
    root.style.setProperty('--look-x', '0');
    root.style.setProperty('--look-y', '0');
  }, { passive: true });

  /* Reject the old hover/nav/ambient action priorities. Page-entry and section
     observers use higher/different priorities, so those remain event-driven. */
  root.addEventListener('cys:state', (event) => {
    const state = event.detail?.state;
    const priority = Number(event.detail?.priority ?? -1);
    const hoverDriven = priority === 10;
    const idleMicroAction = priority === 15;
    const navHoverPoint = state === 'point' && priority === 20;
    if (hoverDriven || idleMicroAction || navHoverPoint) {
      queueMicrotask(() => api.setState?.('idle', { force: true, priority: 0 }));
    }
  });

  /* Clicking the character is now the explicit manual action trigger. The
     existing click still opens/closes the archive panel; this adds one wave. */
  if (character) {
    let press = null;
    character.addEventListener('pointerdown', (event) => {
      press = { x: event.clientX, y: event.clientY, sleep: api.state?.() === 'sleep' };
    });
    character.addEventListener('pointerup', (event) => {
      if (!press) return;
      const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6;
      const wasSleep = press.sleep;
      press = null;
      if (moved || wasSleep) return;
      api.setState?.('wave', { force: true, priority: 42, duration: 1650, after: 'idle' });
    });
  }

  /* Only the home page is allowed to show the default welcome sentence. Any
     route greeting from the legacy core is suppressed on subpages, while the
     page-specific entry pose still plays silently. */
  if (!isHome) {
    try { sessionStorage.setItem('cys-pet-last-greeting', String(Date.now())); } catch (_) {}

    const legacyGreetings = new Set([
      '欢迎来到我的个人档案。想先看哪一部分？',
      'Welcome to my archive. Where would you like to begin?',
      '这里是个人简介与档案时间线。',
      'This page holds the profile and archive timeline.',
      '这里记录四组 AI 项目：RAG、智能体、数字人与可解释性。可以拖拽切换案例。',
      'Four AI projects live here — RAG, agents, digital human, interpretability. Drag the deck to switch cases.',
      '这里按方向归档训练轨迹与技术栈。',
      'Training directions and toolchains are archived here.',
      '这里是持续深化的三个方向：检索、推理、构建。',
      'Three directions keep deepening here — retrieve, reason, build.',
      '如果你想交流 RAG、智能体或工程实践，可以从这里联系。',
      'For RAG, agents, or engineering conversations, you can reach out here.'
    ]);

    const greetingObserver = new MutationObserver(() => {
      const text = bubbleText?.textContent?.trim();
      if (bubble?.classList.contains('is-visible') && legacyGreetings.has(text)) {
        bubble.classList.remove('is-visible');
      }
    });
    if (bubble) greetingObserver.observe(bubble, { attributes: true, attributeFilter: ['class'] });
    setTimeout(() => greetingObserver.disconnect(), 4200);

    const triggerPageEntry = () => {
      if (root.hidden) return false;
      const state = pageState[currentRoute] || 'idle';
      api.setState?.(state, { force: true, priority: 32, duration: state === 'thinking' ? 2200 : 1800, after: 'idle' });
      return true;
    };

    if (!triggerPageEntry()) {
      const visibleObserver = new MutationObserver(() => {
        if (triggerPageEntry()) visibleObserver.disconnect();
      });
      visibleObserver.observe(root, { attributes: true, attributeFilter: ['hidden', 'class'] });
      setTimeout(() => visibleObserver.disconnect(), 5000);
    }
  }

  api.version = VERSION;
})();


/* ================================================================ */
/* ================  LAYER: pet-v062.js?v=0.6.2.1                       */
/* ================================================================ */

(() => {
  'use strict';

  const api = window.CYSPet;
  const root = document.querySelector('.cys-pet-root');
  if (!api || !root || root.dataset.v062Ready === '1') return;

  const VERSION = '0.6.2';
  root.dataset.v062Ready = '1';

  const panel = root.querySelector('.cys-pet-panel');
  const bubble = root.querySelector('.cys-pet-bubble');
  const bubbleText = root.querySelector('.cys-pet-bubble-text');
  const bubbleName = root.querySelector('.cys-pet-bubble-head span');
  const panelSub = root.querySelector('.cys-pet-panel-sub');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (bubbleName) bubbleName.textContent = 'Yaoyang Chen';
  if (panelSub) panelSub.remove();

  function routeKey() {
    if (document.querySelector('.home-cover') || document.getElementById('homeArchiveCard')) return 'index';
    const segment = location.pathname.split('/').filter(Boolean).pop() || 'index';
    return segment.toLowerCase().replace(/\.html$/, '') || 'index';
  }

  const route = routeKey();
  const isHome = route === 'index';

  /* ------------------------------------------------------------------
     Greeting guard

     The default archive greeting belongs to the home page only. Do the check
     immediately as well as reactively so a very fast cached CSS load cannot
     briefly expose a legacy subpage greeting before the enhancement layer is
     ready.
  ------------------------------------------------------------------ */
  if (!isHome && bubble && bubbleText) {
    const legacyGreetings = new Set([
      '欢迎来到我的个人档案。想先看哪一部分？',
      'Welcome to my archive. Where would you like to begin?',
      '这里是个人简介与档案时间线。',
      'This page holds the profile and archive timeline.',
      '这里记录四组 AI 项目：RAG、智能体、数字人与可解释性。可以拖拽切换案例。',
      'Four AI projects live here — RAG, agents, digital human, interpretability. Drag the deck to switch cases.',
      '这里按方向归档训练轨迹与技术栈。',
      'Training directions and toolchains are archived here.',
      '这里是持续深化的三个方向：检索、推理、构建。',
      'Three directions keep deepening here — retrieve, reason, build.',
      '如果你想交流 RAG、智能体或工程实践，可以从这里联系。',
      'For RAG, agents, or engineering conversations, you can reach out here.'
    ]);

    const suppressLegacyGreeting = () => {
      const text = bubbleText.textContent?.trim();
      if (legacyGreetings.has(text)) bubble.classList.remove('is-visible');
    };

    suppressLegacyGreeting();
    const greetingObserver = new MutationObserver(suppressLegacyGreeting);
    greetingObserver.observe(bubble, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true,
      characterData: true
    });
    setTimeout(() => greetingObserver.disconnect(), 6500);
  }

  /* ------------------------------------------------------------------
     Action director

     The companion reacts to semantic navigation, not incidental pointer
     movement. v0.5 can still emit low-priority hover, ambient and legacy
     section states; normalize those back to idle before they become a visible
     pose change. The v0.6.1 page-entry action (priority 32) remains intact.
  ------------------------------------------------------------------ */
  root.addEventListener('cys:state', (event) => {
    const state = event.detail?.state;
    const priority = Number(event.detail?.priority ?? -1);

    const legacyHover = priority === 10;
    const legacyAmbient = priority === 15;
    const legacySection = priority === 18;
    const legacyNavHover = state === 'point' && priority === 20;
    const duplicateSubpageEntry = !isHome && priority === 30;

    if (legacyHover || legacyAmbient || legacySection || legacyNavHover || duplicateSubpageEntry) {
      queueMicrotask(() => {
        const current = api.state?.();
        if (['thinking', 'working', 'success', 'error', 'sleep', 'dragging'].includes(current)) return;
        api.setState?.('idle', { force: true, priority: 0 });
      });
    }
  });

  /* ------------------------------------------------------------------
     Stable region entry

     A region only triggers after it remains the dominant visible block for a
     short dwell. Fast scrolling therefore does not make the character flick
     through poses. The first visible content block is treated as part of page
     entry; later blocks each trigger at most once per page visit.
  ------------------------------------------------------------------ */
  const targets = [...document.querySelectorAll(
    '.content-block, .case-section, .slide-panel, .focus-item, .timeline-item'
  )];

  const seen = new WeakSet();
  const visible = new Map();
  let candidate = null;
  let dwellTimer = 0;
  let lastActionAt = 0;
  let initialVisiblePrimed = false;
  const directorReadyAt = Date.now() + (isHome ? 1800 : 3300);

  function sectionState(el) {
    if (el?.matches?.('.focus-item')) return 'thinking';
    if (route === 'focus' && !el?.matches?.('.timeline-item')) return 'thinking';
    if (route === 'contact') return 'wave';
    return 'read';
  }

  function bestVisible() {
    return [...visible.entries()]
      .filter(([el, ratio]) => !seen.has(el) && ratio >= 0.52)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }

  function armCandidate(el) {
    if (!el || seen.has(el) || candidate === el) return;
    candidate = el;
    clearTimeout(dwellTimer);

    dwellTimer = setTimeout(() => {
      const ratio = visible.get(el) || 0;
      const current = api.state?.();
      const busy = ['thinking', 'working', 'success', 'error', 'sleep', 'dragging'].includes(current);
      const panelOpen = panel?.classList.contains('is-open');
      const tooEarly = Date.now() < directorReadyAt;
      const coolingDown = Date.now() - lastActionAt < 2600;

      if (candidate !== el || ratio < 0.52) {
        candidate = null;
        return;
      }

      if (busy || panelOpen || tooEarly || coolingDown) {
        candidate = null;
        setTimeout(() => armCandidate(bestVisible()), 700);
        return;
      }

      seen.add(el);
      candidate = null;
      lastActionAt = Date.now();
      const state = sectionState(el);
      api.setState?.(state, {
        force: true,
        priority: 34,
        duration: state === 'thinking' ? 2100 : 1750,
        after: 'idle'
      });
    }, reduceMotion ? 180 : 620);
  }

  function reconsider() {
    armCandidate(bestVisible());
  }

  if ('IntersectionObserver' in window && targets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
        else visible.delete(entry.target);
      });

      if (!initialVisiblePrimed) {
        initialVisiblePrimed = true;
        const initial = [...visible.entries()]
          .filter(([, ratio]) => ratio >= 0.52)
          .sort((a, b) => b[1] - a[1])[0]?.[0];
        if (initial) seen.add(initial);
      }

      reconsider();
    }, { threshold: [0.35, 0.52, 0.68, 0.82] });

    targets.forEach((el) => observer.observe(el));
  }

  if (panel) {
    const panelObserver = new MutationObserver(() => {
      if (!panel.classList.contains('is-open')) setTimeout(reconsider, 260);
    });
    panelObserver.observe(panel, { attributes: true, attributeFilter: ['class'] });
  }

  root.addEventListener('cys:state', (event) => {
    if (event.detail?.state === 'idle') setTimeout(reconsider, 240);
  });

  /* Keep the WebP body still on pointer movement. A future Rive/Live2D
     renderer may use normalized gaze inputs without translating the whole
     character sprite. */
  window.addEventListener('pointermove', () => {
    root.style.setProperty('--look-x', '0');
    root.style.setProperty('--look-y', '0');
  }, { passive: true });

  api.version = VERSION;
})();


/* ================================================================ */
/* ================  LAYER: pet-v07.js?v=0.7.0                          */
/* ================================================================ */

(() => {
  'use strict';

  const api = window.CYSPet;
  const root = document.querySelector('.cys-pet-root');
  if (!api || !root || root.dataset.v07Ready === '1') return;

  const VERSION = '0.7.0';
  const ASSET = 'assets/cys-pet/';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.dataset.v07Ready = '1';

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = `${ASSET}pet-v07.css?v=${VERSION}`;
  document.head.appendChild(style);

  const assetForState = {
    boot: 'idle.webp',
    idle: 'idle.webp',
    hover: 'idle.webp',
    dragging: 'idle.webp',
    wake: 'wave.webp',
    wave: 'wave.webp',
    success: 'wave.webp',
    point: 'wave.webp',
    read: 'read.webp',
    working: 'read.webp',
    thinking: 'thinking.webp',
    error: 'thinking.webp',
    sleep: 'sleep.webp'
  };

  function createSet(index) {
    const set = document.createElement('div');
    set.className = `cys-v07-set${index === 0 ? ' is-active' : ''}`;
    set.dataset.rigSet = String(index);

    ['lower', 'torso', 'upper'].forEach((part) => {
      const img = document.createElement('img');
      img.className = `cys-v07-layer cys-v07-layer--${part}`;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.draggable = false;
      img.decoding = 'async';
      set.appendChild(img);
    });

    return set;
  }

  function layeredRenderer() {
    let rig = null;
    let sets = [];
    let activeSet = 0;
    let currentAsset = '';
    let currentState = 'idle';
    let destroyed = false;
    let swapToken = 0;

    function imagesFor(set) {
      return [...set.querySelectorAll('.cys-v07-layer')];
    }

    function loadSet(set, src, token) {
      const images = imagesFor(set);
      return Promise.all(images.map((img) => new Promise((resolve) => {
        if (destroyed || token !== swapToken) return resolve();
        if (img.src.endsWith(src) && img.complete) return resolve();
        const done = () => {
          img.onload = null;
          img.onerror = null;
          resolve();
        };
        img.onload = done;
        img.onerror = done;
        img.src = src;
      })));
    }

    function applySemanticState(state) {
      currentState = state || 'idle';
      if (rig) rig.dataset.motionState = currentState;
    }

    return {
      kind: 'layered-motion',

      mount(host) {
        rig = document.createElement('div');
        rig.className = 'cys-v07-rig';
        rig.dataset.motionState = 'idle';
        sets = [createSet(0), createSet(1)];
        sets.forEach((set) => rig.appendChild(set));
        host.replaceChildren(rig);

        const idle = `${ASSET}${assetForState.idle}`;
        currentAsset = idle;
        sets.forEach((set) => imagesFor(set).forEach((img) => { img.src = idle; }));
      },

      setState(state, options = {}) {
        if (!rig || destroyed) return;
        const semantic = state || 'idle';
        const src = `${ASSET}${assetForState[semantic] || assetForState.idle}`;
        applySemanticState(semantic);

        /* Semantic states can share the same pose asset (POINT uses WAVE while
           the old point.webp is bypassed). In that case restart motion only;
           there is no reason to cross-fade the same bitmap. */
        if (src === currentAsset) {
          if (!reduceMotion && !options.immediate) {
            rig.classList.remove('is-restarting');
            void rig.offsetWidth;
            rig.classList.add('is-restarting');
            requestAnimationFrame(() => rig.classList.remove('is-restarting'));
          }
          return;
        }

        currentAsset = src;
        const token = ++swapToken;
        const nextIndex = activeSet === 0 ? 1 : 0;
        const next = sets[nextIndex];
        const prev = sets[activeSet];

        const activate = () => {
          if (destroyed || token !== swapToken) return;
          next.classList.add('is-active');
          prev.classList.remove('is-active');
          activeSet = nextIndex;
        };

        if (reduceMotion || options.immediate) {
          imagesFor(next).forEach((img) => { img.src = src; });
          activate();
          return;
        }

        loadSet(next, src, token).then(activate);
      },

      setActive(active) {
        if (!rig) return;
        rig.classList.toggle('is-paused', !active);
      },

      setLook() {
        /* Intentionally ignored for the WebP pseudo-rig. Pointer movement no
           longer shifts the whole character. A future Rive model can consume
           normalized gaze without changing this public renderer contract. */
      },

      resize() {
        /* CSS keeps the segmented layers aligned to the renderer host. */
      },

      destroy() {
        destroyed = true;
        ++swapToken;
        rig?.remove();
        rig = null;
        sets = [];
      }
    };
  }

  function mount() {
    if (typeof api.mountRenderer !== 'function') return false;
    const ok = api.mountRenderer(layeredRenderer());
    if (!ok) return false;

    root.dataset.motionEngine = 'layered-webp';
    api.version = VERSION;
    api.motionEngine = () => root.dataset.motionEngine || 'unknown';

    window.dispatchEvent(new CustomEvent('cys:pet:motion-ready', {
      detail: {
        version: VERSION,
        renderer: api.renderer?.(),
        motionEngine: api.motionEngine()
      }
    }));
    return true;
  }

  /* v0.6 creates mountRenderer synchronously before this file loads, but keep a
     short retry path so a slow browser cannot leave the character invisible. */
  if (!mount()) {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (mount() || tries > 20) clearInterval(timer);
    }, 80);
  }
})();


/* ================================================================ */
/* ================  LAYER: research-assistant.js?v=2.0.0               */
/* ================================================================ */

/* CYY Research Assistant 2.0 — local retrieval + evidence result UI.
   No external model/API is required: the assistant retrieves from a curated
   portfolio knowledge index and exposes the matched evidence before routing. */
(() => {
  'use strict';

  const VERSION = '2.0.0';
  const ROUTES = {
    about: ['profile.html', 'ABOUT'],
    projects: ['experience.html', 'PROJECTS'],
    academic: ['education.html', 'ACADEMIC'],
    research: ['focus.html', 'RESEARCH'],
    contact: ['contact.html', 'CONTACT']
  };

  const COPY = {
    zh: {
      title: 'CYY · RESEARCH ASSISTANT',
      sub: 'LOCAL RETRIEVAL / EVIDENCE ROUTING / TOP-K TRACE',
      head: 'CYY / RESEARCH',
      hint: '可以问我：最强的 RAG 项目、Agent、AI 系统工程、研究方向、学校或技术栈。',
      placeholder: '检索 CYY 的项目与研究…',
      labels: ['关于', '项目', '学术', '研究', '联系'],
      quick: ['最强的 RAG 项目', '做过哪些 Agent？', '研究方向是什么？'],
      found: 'EVIDENCE FOUND',
      answer: 'SYNTHESIZED ANSWER',
      openProject: 'OPEN PROJECT →',
      openPage: 'OPEN PAGE →',
      noEvidence: '没有找到高置信度证据。可以试试 MultiRank-RAG、孔明职配、AI Homework、Avatar、研究方向、学校或技术栈。',
      searched: '已检索本地知识库',
      source: 'SOURCE'
    },
    en: {
      title: 'CYY · RESEARCH ASSISTANT',
      sub: 'LOCAL RETRIEVAL / EVIDENCE ROUTING / TOP-K TRACE',
      head: 'CYY / RESEARCH',
      hint: 'Ask about the strongest RAG project, agents, AI systems, research, academic background, or stack.',
      placeholder: 'Retrieve CYY projects and research…',
      labels: ['About', 'Projects', 'Academic', 'Research', 'Contact'],
      quick: ['Strongest RAG project', 'What agents have you built?', 'Research interests'],
      found: 'EVIDENCE FOUND',
      answer: 'SYNTHESIZED ANSWER',
      openProject: 'OPEN PROJECT →',
      openPage: 'OPEN PAGE →',
      noEvidence: 'No high-confidence evidence was found. Try MultiRank-RAG, Kongming, AI Homework, Avatar, research interests, academic background, or stack.',
      searched: 'Local knowledge retrieved',
      source: 'SOURCE'
    }
  };

  const KB = [
    {
      id: 'multirank', type: 'PROJECT', route: 'projects', projectIndex: 0, state: 'read',
      title: { zh: 'MultiRank-RAG', en: 'MultiRank-RAG' },
      summary: {
        zh: '复杂 PDF 多模态 RAG 研究旗舰：统一 evidence nodes、混合召回、GraphRAG、MultiRank 重排与证据链自修正。',
        en: 'Research flagship for complex-PDF multimodal RAG: unified evidence nodes, hybrid retrieval, GraphRAG, MultiRank reranking and evidence-chain self-correction.'
      },
      answer: {
        zh: '目前最能代表 CYY 大模型方向的是 MultiRank-RAG。它不仅做回答生成，而是把复杂文档解析、跨模态证据组织、GraphRAG、多路召回、自适应重排与证据链验证放进同一条可评测链路。',
        en: 'MultiRank-RAG is currently the strongest representation of CYY’s LLM direction. It combines complex-document parsing, cross-modal evidence organization, GraphRAG, multi-route retrieval, adaptive reranking and evidence-chain verification in one measurable pipeline.'
      },
      facts: [
        ['FINQA nDCG@5', '.878'],
        ['MULTIHOP CHAIN', '.890'],
        ['GOLD COVERAGE', '.730']
      ],
      keywords: [
        ['multirank', 10], ['multi rank', 10], ['rag', 4], ['最强', 4], ['旗舰', 4], ['多模态rag', 8], ['多模态 rag', 8],
        ['graphrag', 8], ['graph rag', 8], ['检索', 4], ['rerank', 6], ['重排', 6], ['证据链', 7], ['evidence chain', 7],
        ['finqa', 8], ['multihop', 8], ['pdf', 3], ['项目', 1], ['project', 1]
      ]
    },
    {
      id: 'kongming', type: 'PROJECT', route: 'projects', projectIndex: 1, state: 'thinking',
      title: { zh: '孔明职配 · Agentic Career System', en: 'Kongming · Agentic Career System' },
      summary: {
        zh: '六类显式 Agent 通过共享上下文和 Artifact 协作，结合岗位 RAG、证据化匹配、面试控制与长期记忆。',
        en: 'Six explicit agent roles collaborate through shared context and artifacts, combining job RAG, evidence-based matching, interview control and long-term memory.'
      },
      answer: {
        zh: '如果关注 Agent，孔明职配是最直接的案例。系统不是让多个 Agent 自由对话，而是用角色边界、共享状态、结构化 Artifact 与确定性评分把求职流程组织成可控工作流。',
        en: 'For agent engineering, Kongming is the clearest case. Instead of free-form agent chat, it uses role boundaries, shared state, structured artifacts and deterministic scoring to organize a controllable career workflow.'
      },
      facts: [['AGENT ROLES', '06'], ['JOB POSTS', '500'], ['VERIFY', '10+']],
      keywords: [
        ['孔明', 10], ['kongming', 10], ['agent', 6], ['智能体', 6], ['多agent', 7], ['multi-agent', 7], ['agentic', 7],
        ['求职', 6], ['job matching', 6], ['岗位', 3], ['memory', 5], ['长期记忆', 5], ['面试', 4], ['项目', 1], ['project', 1]
      ]
    },
    {
      id: 'homework', type: 'PROJECT', route: 'projects', projectIndex: 2, state: 'working',
      title: { zh: 'AI Homework System', en: 'AI Homework System' },
      summary: {
        zh: 'Human-in-the-loop AI 批改基础设施：异步 Worker、Redis 队列、MinIO、Judge0、教师复核与私有部署。',
        en: 'Human-in-the-loop AI grading infrastructure with asynchronous workers, Redis queues, MinIO, Judge0, teacher review and private deployment.'
      },
      answer: {
        zh: 'AI Homework System 更能证明 production AI system 能力。重点不是“接一个模型批作业”，而是把 AI 初评、教师复核、异步任务、对象存储、代码执行与部署治理组成完整工程闭环。',
        en: 'AI Homework System demonstrates production AI systems engineering. The emphasis is not merely model-based grading, but a full loop of AI first-pass grading, teacher review, asynchronous jobs, object storage, code execution and deployment governance.'
      },
      facts: [['AI WORKERS', '08'], ['REVIEW', 'HITL'], ['EXECUTION', 'JUDGE0']],
      keywords: [
        ['homework', 10], ['作业', 7], ['批改', 7], ['grading', 7], ['教师', 4], ['teacher', 4], ['worker', 6],
        ['redis', 6], ['minio', 6], ['judge0', 7], ['theia', 6], ['human-in-the-loop', 7], ['hitl', 7], ['基础设施', 4],
        ['ai system', 4], ['工程', 2], ['项目', 1], ['project', 1]
      ]
    },
    {
      id: 'avatar', type: 'PROJECT', route: 'projects', projectIndex: 3, state: 'wave',
      title: { zh: 'Interactive Avatar', en: 'Interactive Avatar' },
      summary: {
        zh: '实时多模态交互系统：文本/图片到 3D、辅助绑骨、Three.js、Qwen 实时语音、WebSocket 与 MediaPipe 手势。',
        en: 'Realtime multimodal system spanning text/image-to-3D, assisted rigging, Three.js, Qwen realtime voice, WebSocket and MediaPipe gestures.'
      },
      answer: {
        zh: 'Interactive Avatar 代表多模态实时交互方向。它把语言模型从文本 UI 推进到语音、3D 空间、动作和会话状态共存的实时环境。',
        en: 'Interactive Avatar represents realtime multimodal interaction, moving language models beyond text UI into a stateful environment combining speech, 3D space, motion and live sessions.'
      },
      facts: [['INPUT MODES', '03'], ['FLOW STEPS', '04'], ['SESSION', 'REALTIME']],
      keywords: [
        ['avatar', 10], ['数字人', 8], ['3d', 6], ['three.js', 7], ['threejs', 7], ['mediapipe', 7], ['语音', 5], ['voice', 5],
        ['websocket', 6], ['多模态', 4], ['multimodal', 4], ['实时', 4], ['realtime', 4], ['项目', 1], ['project', 1]
      ]
    },
    {
      id: 'research', type: 'RESEARCH', route: 'research', state: 'thinking',
      title: { zh: 'Research Agenda', en: 'Research Agenda' },
      summary: {
        zh: '四条主线：Multimodal RAG、Agentic Systems、Evaluation & Interpretability、Multimodal Interaction。',
        en: 'Four lines: Multimodal RAG, Agentic Systems, Evaluation & Interpretability, and Multimodal Interaction.'
      },
      answer: {
        zh: '当前研究主线不是单一模型训练，而是围绕 LLM Systems 展开：证据如何被检索和组织、Agent 如何在约束下行动、改进如何被可靠评测，以及模型如何进入实时多模态环境。',
        en: 'The current research agenda is centered on LLM systems rather than a single model-training problem: evidence retrieval and organization, constrained agent action, reliable evaluation of gains, and realtime multimodal interaction.'
      },
      facts: [['RAG', 'GROUNDING'], ['AGENT', 'CONTROL'], ['EVAL', 'ROBUSTNESS']],
      keywords: [
        ['研究', 8], ['方向', 6], ['research', 8], ['interest', 5], ['llm systems', 7], ['multimodal rag', 7], ['agentic systems', 7],
        ['interpretability', 6], ['evaluation', 6], ['评测', 6], ['可解释', 5], ['多模态交互', 5]
      ]
    },
    {
      id: 'evaluation', type: 'RESEARCH', route: 'research', state: 'thinking',
      title: { zh: 'Evaluation & Interpretability', en: 'Evaluation & Interpretability' },
      summary: {
        zh: '固定候选集消融、鲁棒性预测、线性 Probe、不确定性特征与离线可复现评测。',
        en: 'Controlled ablations, robustness prediction, linear probes, uncertainty features and offline reproducible evaluation.'
      },
      answer: {
        zh: '在评测上，CYY 更关注“为什么有效”而不只是“能不能跑”：固定候选集做消融、保留失败案例，并用 Probe、不确定性和离线容器检查鲁棒性与复现性。',
        en: 'For evaluation, the focus is on why a method works rather than merely whether it runs: controlled candidate sets, preserved failure cases, probes, uncertainty measures and offline containers for robustness and reproducibility.'
      },
      facts: [['ABLATION', 'V0–V5'], ['PROBE', 'LINEAR'], ['RUNTIME', 'OFFLINE']],
      keywords: [
        ['评测', 9], ['evaluation', 9], ['可解释', 7], ['interpretability', 7], ['鲁棒', 7], ['robustness', 7], ['probe', 7],
        ['不确定性', 6], ['uncertainty', 6], ['消融', 7], ['ablation', 7], ['aimo', 6], ['复现', 5], ['reproducibility', 5]
      ]
    },
    {
      id: 'academic', type: 'ACADEMIC', route: 'academic', state: 'read',
      title: { zh: 'Academic Background', en: 'Academic Background' },
      summary: {
        zh: '重庆邮电大学本科，智能科学与技术 × 数学与应用数学并行训练。',
        en: 'Undergraduate at CQUPT with parallel training in Intelligence Science & Technology and Mathematics & Applied Mathematics.'
      },
      answer: {
        zh: '学术背景是“AI 系统 + 数学基础”双线并行：重庆邮电大学，本科阶段学习智能科学与技术与数学与应用数学，并把数学训练用于建模、优化、表示与评测。',
        en: 'The academic background combines AI systems with mathematical foundations at CQUPT, with undergraduate training in Intelligence Science & Technology and Mathematics & Applied Mathematics.'
      },
      facts: [['UNIVERSITY', 'CQUPT'], ['DEGREES', '02'], ['AXIS', 'MATH × AI']],
      keywords: [
        ['学校', 7], ['重邮', 9], ['重庆邮电', 10], ['cqupt', 10], ['专业', 7], ['双学位', 8], ['数学', 5], ['academic', 6],
        ['education', 6], ['university', 6], ['major', 6], ['degree', 6], ['智能科学', 7], ['数学与应用数学', 8]
      ]
    },
    {
      id: 'stack', type: 'SYSTEM', route: 'academic', state: 'working',
      title: { zh: 'AI Systems Stack', en: 'AI Systems Stack' },
      summary: {
        zh: '检索、Agent/后端、部署与多模态交互四层组织，而不是简单技术栈堆叠。',
        en: 'Organized across retrieval, agent/backend, deployment and multimodal interaction rather than as a flat tool wall.'
      },
      answer: {
        zh: '技术栈按系统能力组织：检索侧 LlamaIndex / Qdrant / BM25 / reranker / GraphRAG；Agent 与后端侧 FastAPI / 状态化 workflow / WebSocket；部署侧 Redis / MinIO / Docker；交互侧 React / Three.js / MediaPipe。',
        en: 'The stack is organized by system capability: LlamaIndex/Qdrant/BM25/rerankers/GraphRAG for retrieval; FastAPI/stateful workflows/WebSocket for agents and backend; Redis/MinIO/Docker for deployment; React/Three.js/MediaPipe for interaction.'
      },
      facts: [['RETRIEVAL', 'QDRANT'], ['BACKEND', 'FASTAPI'], ['DEPLOY', 'DOCKER']],
      keywords: [
        ['技术栈', 10], ['stack', 9], ['skills', 7], ['会什么', 7], ['fastapi', 8], ['react', 6], ['qdrant', 8], ['llamaindex', 8],
        ['docker', 7], ['python', 5], ['redis', 4], ['minio', 4], ['websocket', 4], ['three.js', 4]
      ]
    },
    {
      id: 'about', type: 'PROFILE', route: 'about', state: 'point',
      title: { zh: 'Yaoyang Chen / 陈耀洋', en: 'Yaoyang Chen / 陈耀洋' },
      summary: {
        zh: '聚焦 LLM Systems 的本科生，方法论是 Evidence First · Measure the Gain · Ship the System。',
        en: 'Undergraduate focused on LLM systems, guided by Evidence First · Measure the Gain · Ship the System.'
      },
      answer: {
        zh: 'CYY 的核心定位是 LLM Systems × RAG × Agent Engineering，强调把模型放进有数据来源、有状态、有工具、有边界和有评测的完整系统。',
        en: 'CYY is positioned around LLM Systems × RAG × Agent Engineering, with an emphasis on complete systems that have provenance, state, tools, boundaries and evaluation.'
      },
      facts: [['METHOD', 'R³'], ['FOCUS', 'LLM SYSTEMS'], ['PRINCIPLE', 'EVIDENCE FIRST']],
      keywords: [['陈耀洋', 10], ['yaoyang', 10], ['是谁', 7], ['介绍', 6], ['about', 6], ['profile', 6], ['who', 4], ['定位', 5]]
    },
    {
      id: 'contact', type: 'CONTACT', route: 'contact', state: 'wave',
      title: { zh: 'Contact', en: 'Contact' },
      summary: {
        zh: '科研合作、项目协作与实习机会可通过公开邮箱联系。',
        en: 'Research collaboration, projects and internship opportunities can use the public email channel.'
      },
      answer: {
        zh: '当前公开联系方式为 3138402129@qq.com，适合科研合作、项目协作与实习机会沟通。',
        en: 'The current public contact address is 3138402129@qq.com for research collaboration, projects and internship opportunities.'
      },
      facts: [['CHANNEL', 'EMAIL'], ['STATUS', 'OPEN'], ['LOCATION', 'CHONGQING']],
      keywords: [['联系', 9], ['邮箱', 10], ['email', 10], ['contact', 9], ['合作', 6], ['collaboration', 6], ['实习', 6], ['internship', 6]]
    }
  ];

  const runtime = { lastQuestion: '', lastResults: [], root: null };

  function lang() {
    return document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';
  }

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/[，。！？、,.!?;:：；()（）[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function retrieve(question, limit = 3) {
    const q = normalize(question);
    if (!q) return [];
    const compact = q.replace(/\s+/g, '');

    return KB.map((doc) => {
      let score = 0;
      let matched = 0;
      doc.keywords.forEach(([phrase, weight]) => {
        const p = normalize(phrase);
        if (!p) return;
        const hit = q.includes(p) || compact.includes(p.replace(/\s+/g, ''));
        if (hit) { score += weight; matched += 1; }
      });
      if (q.includes(normalize(doc.title.zh)) || q.includes(normalize(doc.title.en))) score += 8;
      return { ...doc, score, matched };
    })
      .filter((doc) => doc.score > 0)
      .sort((a, b) => b.score - a.score || b.matched - a.matched)
      .slice(0, limit)
      .map((doc, index, arr) => ({
        ...doc,
        confidence: Math.min(.99, Math.max(.56, doc.score / Math.max(10, arr[0]?.score || doc.score)))
      }));
  }

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function navigateResult(doc) {
    if (!doc?.route) return;
    const [href, label] = ROUTES[doc.route] || [];
    if (!href) return;
    if (Number.isInteger(doc.projectIndex)) {
      try { sessionStorage.setItem('cyy-target-project', String(doc.projectIndex)); } catch (_) {}
    }
    if (currentPage() === href) {
      if (Number.isInteger(doc.projectIndex)) {
        document.querySelector(`.slide-tab[data-slide="${doc.projectIndex}"]`)?.click();
      }
      return;
    }
    if (typeof window.runExitTransition === 'function') window.runExitTransition(label, href);
    else location.href = href;
  }

  function restoreProjectTarget() {
    if (currentPage() !== 'experience.html') return;
    let index = null;
    try {
      const stored = sessionStorage.getItem('cyy-target-project');
      if (stored !== null) {
        index = Number(stored);
        sessionStorage.removeItem('cyy-target-project');
      }
    } catch (_) {}
    if (!Number.isInteger(index)) return;
    setTimeout(() => document.querySelector(`.slide-tab[data-slide="${index}"]`)?.click(), 650);
  }

  function ensureStyles() {
    if (document.querySelector('link[data-cyy-ra-style]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `assets/cys-pet/research-assistant.css?v=${VERSION}`;
    link.dataset.cyyRaStyle = 'true';
    document.head.appendChild(link);
  }

  function resultLabel(doc) {
    if (doc.type === 'PROJECT') return `PROJECT / ${doc.id.toUpperCase()}`;
    return `${doc.type} / CYY`;
  }

  function synthesize(results) {
    const l = lang();
    if (!results.length) return COPY[l].noEvidence;
    if (results.length === 1) return results[0].answer[l];

    const first = results[0];
    const related = results.slice(1).map((r) => r.title[l]).join(' · ');
    if (l === 'en') return `${first.answer.en} Related evidence also points to ${related}.`;
    return `${first.answer.zh} 相关证据还命中了：${related}。`;
  }

  function renderResults(results, host) {
    const l = lang();
    const c = COPY[l];
    runtime.lastResults = results;
    host.innerHTML = '';
    host.classList.add('is-visible');

    const head = document.createElement('div');
    head.className = 'cys-ra-results-head';
    head.innerHTML = `<span class="cys-ra-trace"><i></i><b>${String(results.length).padStart(2, '0')}</b> ${c.found}</span><span>TOP-K / ${results.length || 0}</span>`;
    host.appendChild(head);

    if (!results.length) {
      const empty = document.createElement('div');
      empty.className = 'cys-ra-empty';
      empty.textContent = c.noEvidence;
      host.appendChild(empty);
      return;
    }

    const list = document.createElement('div');
    list.className = 'cys-ra-result-list';
    results.forEach((doc, index) => {
      const card = document.createElement('article');
      card.className = 'cys-ra-result';
      card.style.setProperty('--ra-i', index);

      const top = document.createElement('div');
      top.className = 'cys-ra-result-top';
      top.innerHTML = `<b>${resultLabel(doc)}</b><span>MATCH ${Math.round(doc.confidence * 100)}%</span>`;
      card.appendChild(top);

      const title = document.createElement('h4');
      title.textContent = doc.title[l];
      card.appendChild(title);

      const summary = document.createElement('p');
      summary.textContent = doc.summary[l];
      card.appendChild(summary);

      const facts = document.createElement('div');
      facts.className = 'cys-ra-facts';
      doc.facts.forEach(([label, value]) => {
        const fact = document.createElement('span');
        fact.className = 'cys-ra-fact';
        fact.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
        facts.appendChild(fact);
      });
      card.appendChild(facts);

      const actions = document.createElement('div');
      actions.className = 'cys-ra-actions';
      const source = document.createElement('span');
      source.className = 'cys-ra-source';
      source.textContent = `${c.source} / LOCAL PORTFOLIO`;
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'cys-ra-open';
      open.textContent = doc.type === 'PROJECT' ? c.openProject : c.openPage;
      open.addEventListener('click', () => navigateResult(doc));
      actions.append(source, open);
      card.appendChild(actions);
      list.appendChild(card);
    });
    host.appendChild(list);

    const answer = document.createElement('div');
    answer.className = 'cys-ra-answer';
    const label = document.createElement('span');
    label.className = 'cys-ra-answer-label';
    label.textContent = c.answer;
    const paragraph = document.createElement('p');
    paragraph.textContent = synthesize(results);
    answer.append(label, paragraph);
    host.appendChild(answer);
  }

  function decorate(root) {
    if (root.dataset.assistant === 'research-v2') return;
    root.dataset.assistant = 'research-v2';
    root.setAttribute('aria-label', 'CYY Research Assistant');
    runtime.root = root;

    const title = root.querySelector('.cys-pet-panel-title');
    const sub = root.querySelector('.cys-pet-panel-sub');
    const head = root.querySelector('.cys-pet-bubble-head span');
    const input = root.querySelector('.cys-pet-input');
    const hint = root.querySelector('.cys-pet-hint');
    const form = root.querySelector('.cys-pet-ask');
    const actions = [...root.querySelectorAll('.cys-pet-action')];
    if (!form || !input) return;

    const quick = document.createElement('div');
    quick.className = 'cys-ra-query';
    form.parentNode.insertBefore(quick, form);

    const resultsHost = document.createElement('section');
    resultsHost.className = 'cys-ra-results';
    resultsHost.setAttribute('aria-live', 'polite');
    form.parentNode.insertBefore(resultsHost, form);

    function applyLanguage() {
      const c = COPY[lang()];
      if (title) title.textContent = c.title;
      if (sub) sub.textContent = c.sub;
      if (head) head.textContent = c.head;
      input.placeholder = c.placeholder;
      if (hint) hint.textContent = c.hint;
      actions.forEach((button, index) => {
        const bold = button.querySelector('b');
        const label = button.querySelector('span');
        const key = ['ABOUT', 'PROJECTS', 'ACADEMIC', 'RESEARCH', 'CONTACT'][index];
        if (bold) bold.textContent = key;
        if (label) label.textContent = c.labels[index] || key;
        button.dataset.label = key;
      });

      quick.innerHTML = '';
      c.quick.forEach((text) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'cys-ra-chip';
        chip.textContent = text;
        chip.addEventListener('click', () => {
          input.value = text;
          form.requestSubmit();
        });
        quick.appendChild(chip);
      });

      if (runtime.lastQuestion) renderResults(retrieve(runtime.lastQuestion), resultsHost);
    }
    applyLanguage();

    const languageObserver = new MutationObserver(() => requestAnimationFrame(applyLanguage));
    languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const question = input.value.trim();
      input.value = '';
      if (!question) return;

      runtime.lastQuestion = question;
      resultsHost.classList.remove('is-visible');
      resultsHost.innerHTML = '';
      const api = window.CYSPet;
      api?.agent?.thinking(lang() === 'en' ? 'Retrieving local evidence…' : '正在检索本地证据…');

      setTimeout(() => {
        const results = retrieve(question, 3);
        renderResults(results, resultsHost);
        api?.agent?.success(results.length
          ? `${COPY[lang()].searched} · ${results.length} ${COPY[lang()].found}`
          : COPY[lang()].noEvidence);
        if (results[0]?.state) api?.setState?.(results[0].state, { duration: 1700, after: 'idle', force: true });
      }, 360);
    }, true);
  }

  function boot() {
    ensureStyles();
    restoreProjectTarget();

    const existing = document.querySelector('.cys-pet-root');
    if (existing && window.CYSPet) {
      decorate(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const root = document.querySelector('.cys-pet-root');
      if (!root || !window.CYSPet) return;
      observer.disconnect();
      decorate(root);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      const root = document.querySelector('.cys-pet-root');
      if (root && window.CYSPet) decorate(root);
    }, 3200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();


/* ================================================================ */
/* ================  LAYER: research-greetings.js?v=1.0.0               */
/* ================================================================ */

/* Normalize legacy companion greetings to the current Research Assistant language. */
(() => {
  'use strict';

  const replacements = {
    zh: new Map([
      ['欢迎来到我的个人档案。想先看哪一部分？', '欢迎来到 CYY Research Assistant。你可以直接问我项目、RAG、Agent 或研究方向。'],
      ['这里是个人简介与档案时间线。', '这里是 About：个人定位、技术方法和当前轨迹。'],
      ['这里记录四组 AI 项目：RAG、智能体、数字人与可解释性。可以拖拽切换案例。', '这里是四个旗舰 AI 系统：MultiRank-RAG、孔明职配、AI Homework System 与 Interactive Avatar。可以拖拽查看 Pipeline 和证据。'],
      ['这里按方向归档训练轨迹与技术栈。', '这里是 Academic：双学位、数学与 AI 训练，以及阶段性成果。'],
      ['这里是持续深化的三个方向：检索、推理、构建。', '这里按研究问题整理 Multimodal RAG、Agentic Systems、Evaluation 与 Multimodal Interaction。'],
      ['如果你想交流 RAG、智能体或工程实践，可以从这里联系。', '这里保留科研合作、项目协作和实习机会的联系入口。']
    ]),
    en: new Map([
      ['Welcome to my archive. Where would you like to begin?', 'Welcome to CYY Research Assistant. Ask directly about projects, RAG, agents, or research.'],
      ['This page holds the profile and archive timeline.', 'This is About: positioning, working principles, and the current technical trajectory.'],
      ['Four AI projects live here — RAG, agents, digital human, interpretability. Drag the deck to switch cases.', 'Four flagship AI systems live here: MultiRank-RAG, Kongming, AI Homework System, and Interactive Avatar. Drag to inspect their pipelines and evidence.'],
      ['Training directions and toolchains are archived here.', 'This is Academic: dual-degree training, mathematics, AI systems, and selected recognition.'],
      ['Three directions keep deepening here — retrieve, reason, build.', 'Research is organized around Multimodal RAG, Agentic Systems, Evaluation, and Multimodal Interaction.'],
      ['For RAG, agents, or engineering conversations, you can reach out here.', 'This page keeps the contact channel for research collaboration, projects, and internships.']
    ])
  };

  function lang() {
    return document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';
  }

  function attach(root) {
    const bubble = root.querySelector('.cys-pet-bubble-text');
    if (!bubble || bubble.dataset.researchGreetingReady === 'true') return;
    bubble.dataset.researchGreetingReady = 'true';

    const normalize = () => {
      const map = replacements[lang()];
      const next = map.get(bubble.textContent.trim());
      if (next) bubble.textContent = next;
    };
    normalize();

    const observer = new MutationObserver(normalize);
    observer.observe(bubble, { childList: true, characterData: true, subtree: true });
  }

  const existing = document.querySelector('.cys-pet-root');
  if (existing) attach(existing);
  const observer = new MutationObserver(() => {
    const root = document.querySelector('.cys-pet-root');
    if (!root) return;
    attach(root);
    observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
