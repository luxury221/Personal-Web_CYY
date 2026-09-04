# Yaoyang Chen · LLM Systems Portfolio

Bilingual personal portfolio for **陈耀洋 / Yaoyang Chen**, focused on:

- LLM Systems
- Multimodal RAG
- Agentic Systems
- Evaluation & Interpretability
- Multimodal Interaction
- AI System Engineering

The site uses an **Editorial AI × Research Console** visual language and is organized around one technical axis:

**RETRIEVE · REASON · BUILD**

> **Building LLM systems around evidence, reasoning and measurable improvement.**

## Portfolio structure

The content follows a research-oriented case-study pattern:

**Problem → Insight → System → Contribution → Evidence → Limitation / Next**

The goal is to show not only what technologies were used, but also why the problem matters, why a design decision was made, what Yaoyang personally contributed, what evidence supports a claimed improvement, where a system still fails, and what should be tried next.

## Pages

### Home — `index.html`

Establishes the research thesis and selected evidence.

Current highlighted MultiRank-RAG results:

- FinQA nDCG@5: `0.678 → 0.878`
- MultiHop-RAG V5 evidence-chain score: `0.890`

### About — `profile.html`

Systems mindset and working principles:

1. **Evidence First**
2. **Measure the Gain**
3. **Ship the System**

### Projects — `experience.html`

#### 01 · MultiRank-RAG
Primary personal research and engineering flagship.

- complex-PDF multimodal RAG
- structured evidence nodes
- GraphRAG
- hybrid retrieval
- MultiRank G0–G4
- evidence-chain verification
- public V0–V5 evaluation

#### 02 · Kongming
Agentic-system flagship.

- six explicit agent roles
- `AgentContext / AgentEvent / AgentArtifact`
- job RAG
- evidence-based matching
- structured long-term state
- regression verification

#### 03 · AI Homework System
Production-oriented AI infrastructure case.

- AI-first grading + teacher final review
- Redis asynchronous workers
- MinIO private object storage
- Theia + Judge0
- Docker / private deployment

The portfolio presents verified system architecture without claiming unspecified team modules as individual ownership.

#### 04 · Interactive Avatar
Realtime multimodal interaction case.

- text / image / preset → 3D avatar
- assisted 8-point rigging
- Three.js / React Three Fiber
- Qwen realtime voice via WebSocket
- MediaPipe gesture events
- session history / summaries / recordings

### Academic — `education.html`

Frames the dual-degree background as **Mathematics × AI Systems** rather than two independent course lists.

### Research — `focus.html`

Research questions are organized around Multimodal RAG, Agentic Systems, Evaluation & Interpretability, and Multimodal Interaction. Each direction includes method, evidence and a current bottleneck / next-step section.

### Contact — `contact.html`

Research collaboration, AI engineering projects, open-source collaboration and internship opportunities.

## Evidence Assets V4

Projects include repository-grounded visual proof rather than prose-only descriptions.

```text
assets/evidence/
├── multirank-architecture.svg
├── multirank-ablation.svg
├── multirank-evidence-node.svg
├── kongming-agent-flow.svg
├── homework-infrastructure.svg
└── avatar-realtime-flow.svg
```

The evidence layer is implemented by:

```text
styles-evidence-v4.css
evidence-v4.js
```

It provides architecture diagrams, benchmark / ablation visualization, evidence-node and graph views, workflow diagrams, direct source links, evidence bars and a zoomable proof modal.

These diagrams are explanatory assets derived from public repository documentation, not fabricated screenshots.

## Project Showcase V5

V5 adds a second proof layer that distinguishes three evidence types explicitly:

1. **REAL PRODUCT SCREEN** — an actual interface screenshot already published in the source repository.
2. **PROJECT ASSET** — a genuine visual/product asset from the repository, clearly labeled as *not* a UI screenshot.
3. **RUNTIME / SOURCE PROOF** — direct links to experiment runners, services, state protocols, components or documentation that verify the implementation.

This distinction is intentional: repositories without verified product screenshots do not receive manufactured screenshots just to make the portfolio look fuller.

### MultiRank-RAG

The repository currently provides stronger research/runtime evidence than UI screenshots, so V5 shows:

- `scripts/40_run_main_experiment.py`
- `backend/services/pipeline.py`
- `backend/services/retrieval.py`
- `docs/PUBLIC_BENCHMARK_RESULTS.md`

This complements the V4 architecture, evidence-node and ablation visuals.

### Kongming

The repository does not currently expose a formal UI-screenshot set. V5 therefore separates:

**Project assets**
- `public/kongming-ip.png`
- `public/avatars/interviewer/interview-room.png`

from **implementation proof**
- `src/lib/agentRuntime.ts`
- `src/lib/agents.ts`
- `src/lib/matchEngine.ts`
- `docs/08-multi-agent-multimodal-architecture.md`

The visual assets are explicitly labeled as project assets, not interface screenshots.

### AI Homework System

V5 uses real product screenshots already published in the repository README, including:

- platform overview
- teacher workspace
- AI grading + teacher review
- teaching assistant

The same section also links the documented HITL workflow, default 8-worker Redis setup, MinIO signed-URL storage and Theia + Judge0 execution chain.

### Interactive Avatar

V5 uses real product screens already stored in:

```text
frontend/public/intro-real/
```

Selected screens cover:

- Create
- Rig Assist
- Scene
- Realtime Interact
- Dashboard

Runtime proof links directly to:

- `frontend/src/audio/voiceWsClient.js`
- `frontend/src/components/avatar/InteractiveAvatarScene.jsx`
- `frontend/src/components/avatar/GestureDetector.jsx`
- `frontend/src/hooks/useSessionMachine.js`

Showcase screenshots support lazy loading, source links, image-failure fallback, bilingual captions and a large-screen modal.

V5 implementation:

```text
styles-showcase-v5.css
showcase-v5.js
showcase-v5-guard.js
```

## MultiRank-RAG public evidence

Source documents:

```text
MultiRank-RAG/docs/PUBLIC_BENCHMARK_RESULTS.md
MultiRank-RAG/docs/EXPERIMENTS.md
MultiRank-RAG/docs/ARCHITECTURE.md
```

Public benchmark setup:

- retriever fixed to BM25 for V0–V5
- candidate / rerank k: `50 / 10`
- answer generation disabled for retrieval evaluation

Key results:

- FinQA V0→V5 nDCG@5: `0.678 → 0.878`
- MultiHop-RAG V4→V5 chain score: `0.864 → 0.890`
- MultiHop-RAG V4→V5 gold-node coverage: `0.662 → 0.730`
- MMLongBench-Doc remains limited by first-stage candidate retrieval
- RAGBench eManual acts as a useful saturated simple-text negative control

## Styling architecture

```text
styles.css              # stable layout / typography / shared components
styles-ai.css           # LLM Systems visual identity
styles-ai-v2.css        # semantic trace / research-console motion
styles-content-v3.css   # research narrative / case-study hierarchy
styles-evidence-v4.css  # visual proof / evidence gallery
styles-showcase-v5.css  # real screens / runtime proof / project showcase
```

Runtime layers:

```text
script-core.js
script.js
cyy-ai-v2.js
content-v3-fixes.js
evidence-v4.js
showcase-v5.js
showcase-v5-guard.js
```

## CYY Research Assistant

The companion remains under the legacy path:

```text
assets/cys-pet/
```

Research Assistant 2.0 performs deterministic local Top-K retrieval over portfolio knowledge and exposes evidence cards, match scores and project/page routing without requiring an external model API.

## Run locally

No build step is required.

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Use `Ctrl + F5` after pulling changes if cached CSS or JavaScript is still visible.

## Deploy

Static deployment works with GitHub Pages, Vercel, Netlify or Cloudflare Pages.

For GitHub Pages:

**Settings → Pages → Deploy from a branch → `main` → `/ (root)`**

## Public-content note

Before public deployment, verify that `3138402129@qq.com` is the intended public email address. Team-project descriptions should continue to distinguish personal contribution from whole-system capability.
