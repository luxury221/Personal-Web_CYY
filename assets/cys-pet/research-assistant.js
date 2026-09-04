/* CYY Research Assistant — deterministic local knowledge layer.
   Keeps the existing companion renderer/state machine and upgrades the product semantics. */
(() => {
  'use strict';

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
      sub: 'LOCAL KNOWLEDGE / EVIDENCE ROUTING / SYSTEM TRACE',
      head: 'CYY / RESEARCH',
      hint: '可以问我：MultiRank-RAG、Agent、项目、研究方向、学校、技术栈或联系方式。',
      placeholder: '问一个关于 CYY 的问题…',
      labels: ['关于', '项目', '学术', '研究', '联系']
    },
    en: {
      title: 'CYY · RESEARCH ASSISTANT',
      sub: 'LOCAL KNOWLEDGE / EVIDENCE ROUTING / SYSTEM TRACE',
      head: 'CYY / RESEARCH',
      hint: 'Ask about MultiRank-RAG, agents, projects, research, background, stack, or contact.',
      placeholder: 'Ask a question about CYY…',
      labels: ['About', 'Projects', 'Academic', 'Research', 'Contact']
    }
  };

  function lang() {
    return document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'zh';
  }

  function wantsNavigation(q) {
    return /(打开|查看|带我去|跳转|进入|open|show|go to|take me|navigate)/i.test(q);
  }

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function navigate(routeKey) {
    const [href, label] = ROUTES[routeKey] || [];
    if (!href) return;
    if (currentPage() === href) return;
    setTimeout(() => {
      if (typeof window.runExitTransition === 'function') window.runExitTransition(label, href);
      else location.href = href;
    }, 1100);
  }

  function classify(question) {
    const q = question.trim().toLowerCase();
    const isEn = lang() === 'en';

    if (/(multirank|graph\s*rag|多模态\s*rag|检索|rerank|evidence chain|证据链|finqa|multihop)/i.test(q)) {
      return {
        route: 'projects', state: 'read',
        answer: isEn
          ? 'MultiRank-RAG is the research flagship: structured multimodal evidence nodes, hybrid retrieval, GraphRAG, MultiRank reranking and evidence-chain verification. Public ablations report FinQA nDCG@5 = 0.878 and MultiHop-RAG chain score = 0.890.'
          : 'MultiRank-RAG 是目前的研究旗舰：结构化多模态 evidence nodes、混合召回、GraphRAG、MultiRank 重排和证据链校验。公开消融中 FinQA nDCG@5 = 0.878，MultiHop-RAG evidence-chain score = 0.890。'
      };
    }

    if (/(孔明|kongming|agent|智能体|memory|长期记忆|job matching|求职)/i.test(q)) {
      return {
        route: 'projects', state: 'thinking',
        answer: isEn
          ? 'Kongming is the agentic-systems case: six explicit roles share structured context and artifacts instead of free-form agent chat. The workflow includes job RAG, evidence-based matching, interview control and long-term memory, with 500 sourced job postings and 10+ verification scripts.'
          : '孔明职配对应 Agentic Systems：六类角色共享结构化上下文与 Artifact，不让多个 Agent 无约束互聊。系统包含岗位 RAG、证据化匹配、面试控制和长期记忆，岗位库约 500 条，并有 10+ 个验证脚本。'
      };
    }

    if (/(homework|作业|批改|grading|teacher|教师|worker|redis|minio|judge0|theia)/i.test(q)) {
      return {
        route: 'projects', state: 'working',
        answer: isEn
          ? 'AI Homework System demonstrates production AI infrastructure: AI-first grading with teacher review, Redis-backed asynchronous workers, private object storage, Judge0 code execution and deployable service separation. Its value is the human-in-the-loop and operational system design, not only model output.'
          : 'AI Homework System 主要证明 production AI infrastructure 能力：AI 先批、教师复核、Redis 异步 Worker、私有对象存储、Judge0 代码执行与可部署的服务拆分。重点不是“模型会批改”，而是 Human-in-the-loop 与工程闭环。'
      };
    }

    if (/(avatar|数字人|3d|three\.js|mediapipe|语音|voice|websocket|多模态交互|multimodal interaction)/i.test(q)) {
      return {
        route: 'projects', state: 'wave',
        answer: isEn
          ? 'Interactive Avatar is the realtime multimodal case: text/image-to-3D, assisted rigging, Three.js scenes, bidirectional Qwen voice over WebSocket and MediaPipe gesture events. It explores how language models behave inside spatial, stateful realtime interaction.'
          : 'Interactive Avatar 对应实时多模态方向：文本/图片生成 3D、辅助绑骨、Three.js 场景、Qwen 双向实时语音与 MediaPipe 手势事件。它关注语言模型进入空间化、带状态的实时交互之后如何协同。'
      };
    }

    if (/(研究|方向|research|interest|multimodal rag|agentic systems|interpretability|evaluation)/i.test(q)) {
      return {
        route: 'research', state: 'thinking',
        answer: isEn
          ? 'The current research agenda has four lines: Multimodal RAG, Agentic Systems, Evaluation & Interpretability, and Multimodal Interaction. The common question is how to make LLM systems traceable, controllable and measurable.'
          : '当前研究主线有四条：Multimodal RAG、Agentic Systems、Evaluation & Interpretability、Multimodal Interaction。它们共同围绕一个问题：怎样让 LLM 系统更可追溯、可控、可评测。'
      };
    }

    if (/(学校|重邮|重庆邮电|专业|双学位|数学|academic|education|university|major|degree|奖学金|award|mcm|国奖)/i.test(q)) {
      return {
        route: 'academic', state: 'read',
        answer: isEn
          ? 'Yaoyang Chen studies at Chongqing University of Posts and Telecommunications with parallel undergraduate training in Intelligence Science & Technology and Mathematics & Applied Mathematics. The academic page also records selected scholarships and competition recognition.'
          : '陈耀洋就读于重庆邮电大学，本科阶段并行学习智能科学与技术、数学与应用数学两条训练线。Academic 页面还整理了国家奖学金、中天科技奖学金、一等奖学金以及竞赛阶段性成果。'
      };
    }

    if (/(技术栈|stack|skills|会什么|fastapi|react|qdrant|llamaindex|docker|python)/i.test(q)) {
      return {
        route: 'academic', state: 'working',
        answer: isEn
          ? 'The stack is organized by systems rather than a tool wall: retrieval uses LlamaIndex, Qdrant, BM25, rerankers and GraphRAG; agent/backend work uses FastAPI, stateful workflows and WebSocket; deployment uses Redis, MinIO and Docker; multimodal interfaces use React, Three.js and MediaPipe.'
          : '技术栈不是按“会哪些库”堆墙，而是按系统组织：检索侧有 LlamaIndex、Qdrant、BM25、reranker、GraphRAG；Agent/后端侧有 FastAPI、状态化 workflow、WebSocket；部署侧有 Redis、MinIO、Docker；多模态交互侧有 React、Three.js、MediaPipe。'
      };
    }

    if (/(联系|邮箱|email|contact|合作|实习|internship|collaboration)/i.test(q)) {
      return {
        route: 'contact', state: 'wave',
        answer: isEn
          ? 'For research collaboration, projects or internships, the public contact address is 3138402129@qq.com. The Contact page keeps the communication channel intentionally minimal.'
          : '科研合作、项目协作或实习机会都可以联系。目前公开邮箱是 3138402129@qq.com；Contact 页面刻意只保留最直接的沟通入口。'
      };
    }

    if (/(是谁|介绍|about|profile|who are you|yaoyang|陈耀洋)/i.test(q)) {
      return {
        route: 'about', state: 'point',
        answer: isEn
          ? 'Yaoyang Chen is an undergraduate focused on LLM systems, especially RAG, agent engineering, evaluation and multimodal interaction. The working principle is Evidence First, Measure the Gain, Ship the System.'
          : '陈耀洋是一名聚焦 LLM Systems 的本科生，重点做 RAG、Agent Engineering、Evaluation 与多模态交互。当前统一的方法论是：Evidence First、Measure the Gain、Ship the System。'
      };
    }

    return {
      route: null, state: 'wave',
      answer: isEn
        ? 'I can answer from the local portfolio knowledge base. Try asking about MultiRank-RAG, Kongming, AI Homework System, Interactive Avatar, research interests, academic background, stack, or contact.'
        : '我会从这个网站的本地知识库里回答。你可以问：MultiRank-RAG、孔明职配、AI Homework System、Interactive Avatar、研究方向、学术背景、技术栈或联系方式。'
    };
  }

  function decorate(root) {
    if (root.dataset.assistant === 'research') return;
    root.dataset.assistant = 'research';
    root.setAttribute('aria-label', 'CYY Research Assistant');

    const title = root.querySelector('.cys-pet-panel-title');
    const sub = root.querySelector('.cys-pet-panel-sub');
    const head = root.querySelector('.cys-pet-bubble-head span');
    const input = root.querySelector('.cys-pet-input');
    const hint = root.querySelector('.cys-pet-hint');
    const actions = [...root.querySelectorAll('.cys-pet-action')];

    function applyLanguage() {
      const c = COPY[lang()];
      if (title) title.textContent = c.title;
      if (sub) sub.textContent = c.sub;
      if (head) head.textContent = c.head;
      if (input) input.placeholder = c.placeholder;
      if (hint) hint.textContent = c.hint;
      actions.forEach((button, index) => {
        const bold = button.querySelector('b');
        const label = button.querySelector('span');
        const key = ['ABOUT', 'PROJECTS', 'ACADEMIC', 'RESEARCH', 'CONTACT'][index];
        if (bold) bold.textContent = key;
        if (label) label.textContent = c.labels[index] || key;
        button.dataset.label = key;
      });
    }
    applyLanguage();

    const languageObserver = new MutationObserver(() => requestAnimationFrame(applyLanguage));
    languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    const form = root.querySelector('.cys-pet-ask');
    if (!form || !input) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const question = input.value.trim();
      input.value = '';
      if (!question) return;

      const result = classify(question);
      const api = window.CYSPet;
      api?.agent?.thinking(lang() === 'en' ? 'Searching the local knowledge base…' : '正在检索本地知识库…');

      setTimeout(() => {
        api?.agent?.success(result.answer);
        if (result.state) api?.setState?.(result.state, { duration: 1800, after: 'idle', force: true });
        if (result.route && wantsNavigation(question)) navigate(result.route);
      }, 420);
    }, true);
  }

  function boot() {
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
