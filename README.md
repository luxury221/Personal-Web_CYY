# Yaoyang Chen · LLM Systems Portfolio

A bilingual personal website for **Yaoyang Chen / 陈耀洋**, focused on **LLM Systems, Multimodal RAG, Agentic Systems, Evaluation, Multimodal Interaction, and AI System Engineering**.

The site uses an **Editorial AI × Research Console** identity: restrained warm paper, muted teal, charcoal and brass, with serif/mono typography, system traces, evidence graphs, ranking telemetry and verification states.

## Core identity

The portfolio is organized around:

**RETRIEVE · REASON · BUILD**

- **Retrieve** — multimodal retrieval, GraphRAG, hybrid search, reranking, evidence chains
- **Reason** — agent orchestration, explicit state, evidence-constrained decisions, memory and verification
- **Build** — FastAI / React / WebSocket / async workers / deployment / realtime multimodal systems

The current personal thesis is:

> **Building LLM systems around evidence, reasoning and measurable improvement.**

The goal is not to present a collection of AI demos, but to show how evidence enters a system, how reasoning is constrained, how gains are measured, and how model capability is turned into a runnable product.

## Content architecture V3

The portfolio content follows a research-oriented case-study structure:

**Problem → Insight → System → Contribution → Evidence → Limitation / Next**

A technology list answers **what was used**. A case study should also answer:

- Why was the problem worth solving?
- What failed in the simpler approach?
- What design decision changed the system?
- What did Yaoyang personally own?
- What evidence supports the claimed improvement?
- Where does the system still fail?
- What should be tried next?

The site intentionally keeps limitations and negative controls visible instead of presenting every system as complete.

## Evidence Assets V4

The portfolio now includes repository-grounded visual proof instead of relying only on prose descriptions.

Current assets:

```text
assets/evidence/multirank-architecture.svg
assets/evidence/multirank-ablation.svg
assets/evidence/multirank-evidence-node.svg
assets/evidence/kongming-agent-flow.svg
```

They are rendered inside the project cases through:

```text
styles-evidence-v4.css
evidence-v4.js
```

Evidence V4 adds:

- architecture diagrams derived from repository documentation
- public benchmark / ablation visualization
- evidence-node / document-graph representation
- multi-agent workflow visualization
- direct `SOURCE` links back to repository documents
- `CODE / BENCHMARK / EXPERIMENTS / ARCHITECTURE` evidence bars
- zoomable visual-proof modal
- source links inside Research proof blocks

The visual assets are intentionally explanatory diagrams rather than fabricated screenshots. Their metrics and architecture labels are grounded in the corresponding public repositories.

## Page hierarchy

### `index.html` — Home

The homepage establishes the research thesis before listing technologies:

- “我关注的不只是让 AI 给出答案，而是让答案能够被检索、验证与度量。”
- LLM Systems · RAG · Agent Engineering
- Retrieve / Reason / Build
- selected evidence:
  - FinQA `0.678 → 0.878` nDCG@5 under the V0→V5 progression
  - MultiHop-RAG evidence-chain score `0.890`

The right-side **LLM Research Dossier** visualizes Query → Retrieval → Graph → Evidence → Verified.

### `profile.html` — About

The About page is organized around systems mindset rather than biography alone.

Current positioning:

- language models are capable but uncertain system components
- provenance, state, tools, boundaries and evaluation matter around the model
- current research goal: improve reliability and interpretability through retrieval, structured memory and evaluation

Working principles:

1. **Evidence First**
2. **Measure the Gain**
3. **Ship the System**

### `experience.html` — Projects

The project hierarchy is intentionally asymmetric.

#### 01 · MultiRank-RAG — Primary Research Flagship

Personal research and engineering flagship for complex-PDF multimodal RAG.

Narrative:

- **Problem** — correct evidence is often lost before generation
- **Insight** — retrieval should operate on structured evidence rather than anonymous chunks
- **System** — evidence nodes → hybrid retrieval → GraphRAG → MultiRank → evidence-chain verification
- **Contribution** — system architecture, evidence-node schema, GraphRAG, multi-route retrieval, MultiRank, verification and V0–V5 evaluation
- **Evidence** — controlled benchmark results and repository-grounded diagrams
- **Limitation** — absolute visual recall is still constrained by first-stage candidate retrieval
- **Next** — visual-first candidate generation, adaptive multimodal routing, learned evidence graphs

External evidence links are exposed directly from the case study:

- `CODE`
- `BENCHMARK / V0–V5`
- `EXPERIMENTS`
- `ARCHITECTURE`

Visual proof includes the full evidence flow, public benchmark ablation, and evidence-node representation.

#### 02 · Kongming — Agentic System Flagship

The case is framed around **why multi-agent architecture is needed**, not around the number of agents.

Key points:

- Resume Intake / Job Discovery / Match Reasoning / Resume Strategy / Interview Coach / Supervisor
- shared `AgentContext / AgentEvent / AgentArtifact`
- evidence-backed job matching
- long-term state rather than chat-log memory
- regression verification scripts

The visual proof maps the documented Input → Orchestration → Agents → Artifacts layers.

#### 03 · AI Homework System — AI Infrastructure Case

The portfolio uses this project to demonstrate production-oriented AI system engineering:

- AI suggestion + teacher final review
- Redis asynchronous queue
- default 8 workers
- MinIO private storage
- Theia + Judge0 isolation
- service separation and private deployment

The page deliberately avoids presenting unspecified team modules as Yaoyang's independent contribution.

#### 04 · Interactive Avatar — Realtime Multimodal Case

The case is framed around **realtime multimodal state consistency**, not just 3D generation.

- text / image / preset → Meshy
- assisted 8-point rigging
- Three.js / React Three Fiber
- Qwen realtime voice via WebSocket
- MediaPipe gestures
- session history / summary / recording

Yaoyang's stated contribution remains frontend and interaction development, focused on 3D scenes, realtime sessions and multimodal interaction flow.

## `focus.html` — Research

Research is organized as questions rather than a skills inventory.

### 01 · Multimodal RAG

Question: how should a system retrieve and organize a verifiable evidence chain when answers span text, tables, figures and cross-page relations?

Evidence:

- fixed BM25 candidate set
- FinQA `0.678 → 0.878` nDCG@5
- MultiHop-RAG chain score `0.890`
- MultiHop-RAG gold-node coverage `0.730`

Current bottleneck: first-stage visual candidate retrieval on MMLongBench-Doc.

### 02 · Agentic Systems

Question: how can agents plan, use tools and preserve memory without losing controllability to free-form generation?

Focus:

- explicit role boundaries
- structured shared state
- evidence gates
- deterministic rules where critical
- memory update policy and error attribution

### 03 · Evaluation & Interpretability

Question: when outputs improve, what evidence shows the gain comes from the method rather than candidate sets, data or randomness?

Focus:

- controlled ablation
- negative controls
- representation probes
- uncertainty statistics
- offline reproducibility

### 04 · Multimodal Interaction

Question: how should timing, interruption, scene state, speech and gesture events be coordinated in realtime multimodal systems?

Core Research proof blocks now carry direct repository source links where a public source is available.

## `education.html` — Academic

Academic identity is framed as **Mathematics × AI Systems** rather than two unrelated degree labels.

- 重庆邮电大学 / CQUPT
- 智能科学与技术
- 数学与应用数学

The bridge is:

**Mathematics**
- assumptions / boundaries
- structure / abstraction
- optimization / probability
- derivation / verification

**AI Systems**
- retrieval / ranking
- state / tool use
- ablation / robustness
- deployment / regression

The intended message is that mathematics shapes how problems are framed, while AI systems training turns those questions into experiments and engineering.

Selected recognition:

- 国家奖学金
- 中天科技奖学金
- 一等奖学金
- 中国目学生计算机设计大赛 · 国家二等奖
- MCM/ICM · Meritorious Winner

## `contact.html` — Contact

The final page continues the research narrative rather than falling back to a generic contact page.

It invites conversations around:

- Multimodal RAG
- Agentic Systems
- Evaluation
- AI System Engineering
- Multimodal Interaction
- research collaboration
- open-source / project collaboration
- internships

## Motion system

The stable GSAP architecture remains the base:

1. Reveal
2. Clip
3. Shared-object intro transition
4. Cover transition
5. Low-amplitude drift
6. Slide deck

Semantic AI motion adds:

7. Pipeline trace
8. Information-flow signal
9. Verification-state resolution
10. Research-question → method → proof hierarchy

Motion is used to explain system state, not as decoration.

## Styling architecture

```text
styles.css              # stable base layout / typography / components
styles-ai.css           # first LLM Systems redesign
styles-ai-v2.css        # semantic research-console motion states
styles-content-v3.css   '+
styles-evidence-v4.css  # visual proof / evidence gallery / source links
```

Runtime enhancement layers:

```text
script-core.js
script.js
cyy-ai-system.js
content-v3-fixes.js
evidence-v4.js
```

## CYY Research Assistant

The companion remains under the legacy asset path:

```text
assets/cys-pet/
```

Current product layer:

```text
assets/cys-pet/research-assistant.js
assets/cys-pet/research-assistant.css
assets/cys-pet/research-greetings.js
```

Research Assistant 2.0 performs deterministic local Top-K retrieval over portfolio knowledge and exposes evidence cards, match scores, facts and project/page routing without requiring an external model API.

## Public benchmark evidence

MultiRank-RAG public reports used by the site:

```text
docs/PUBLIC_BENCHMARK_RESULTS.md
docs/EXPERIMENTS.md
docs/ARCHITECTURE.md
```

Public benchmark setup:

- retriever: BM25 fixed for all V0–V5 variants
- candidate / rerank k: `50 / 10`
- answer generation disabled during retrieval evaluation

Key results:

- FinQA: V0 `nDCG@5 = 0.678` → V5 `0.878`
- MultiHop-RAG: V4→V5 chain score `0.864 → 0.890`
- MultiHop-RAG: V4→V5 gold-node coverage `0.662 → 0.730`
- MMLongBench-Doc: modality / visual indicators recover, while absolute retrieval remains low under the BM25 candidate set
- RAGBench eManual: simple-text setting remains saturated and acts as a useful negative control

These are presented as controlled evidence of method behavior, not generic marketing counters.

## Run locally

No build step is required.

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Use `Ctrl + F5` after pulling changes to bypass cached CSS/JS.

## Deploy

The site is static and can be deployed directly to GitHub Pages, Vercel, Netlify or Cloudflare Pages.

For GitHub Pages:

**Settings → Pages → Deploy from a branch → `main` → `/ (root)`**

## Public-content note

Before final public deployment, verify that `3138402129@qq.com` is the intended public email. Team-project role descriptions should continue to distinguish personal ownership from whole-system capability.
