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
