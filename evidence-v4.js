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