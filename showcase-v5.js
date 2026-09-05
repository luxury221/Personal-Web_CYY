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
