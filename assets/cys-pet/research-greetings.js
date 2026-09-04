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
