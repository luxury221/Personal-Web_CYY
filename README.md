# Yaoyang Chen · LLM Systems Portfolio

Bilingual personal portfolio for **陈耀洋 / Yaoyang Chen**, focused on LLM Systems, Multimodal RAG, Agentic Systems, Evaluation & Interpretability, Multimodal Interaction, and AI System Engineering.

Visual language: **Editorial AI × Research Console**  
Technical axis: **RETRIEVE · REASON · BUILD**

> **Building LLM systems around evidence, reasoning and measurable improvement.**

## Portfolio structure

Each major project follows a research-oriented case-study pattern:

**Problem → Insight → System → Contribution → Evidence → Limitation / Next**

The portfolio is designed to show why a problem matters, what was actually built, what Yaoyang personally contributed, what evidence supports a claim, and where the system still fails.

## Pages

- `index.html` — Home / research thesis and selected evidence
- `profile.html` — About / systems mindset
- `experience.html` — Projects / four flagship systems
- `education.html` — Academic / Mathematics × AI Systems
- `focus.html` — Research / current research questions
- `contact.html` — Contact / collaboration and internship channel

## Flagship systems

### 01 · MultiRank-RAG — Primary Research Flagship

Complex-PDF multimodal RAG with structured evidence nodes, hybrid retrieval, GraphRAG, MultiRank reranking and evidence-chain verification.

Public highlighted results:

- FinQA V0→V5 nDCG@5: `0.678 → 0.878`
- MultiHop-RAG V5 evidence-chain score: `0.890`
- MultiHop-RAG V5 gold-node coverage: `0.730`

Public benchmark setup uses a fixed **BM25** candidate retriever for controlled V0–V5 comparison, candidate/rerank `k = 50 / 10`, and retrieval evaluation without answer generation.

Source evidence:

```text
MultiRank-RAG/docs/PUBLIC_BENCHMARK_RESULTS.md
MultiRank-RAG/docs/EXPERIMENTS.md
MultiRank-RAG/docs/ARCHITECTURE.md
scripts/40_run_main_experiment.py
backend/services/pipeline.py
backend/services/retrieval.py
```

### 02 · Kongming — Agentic System

Six explicit career-agent roles, shared `AgentContext / AgentEvent / AgentArtifact`, job RAG, evidence-based matching, structured long-term state and regression verification.

### 03 · AI Homework System — AI Infrastructure

Production-oriented AI workflow with AI-first grading, teacher final review, Redis asynchronous workers, MinIO private object storage, Theia + Judge0 and Docker/private deployment.

### 04 · Interactive Avatar — Multimodal Realtime

Text/image/preset → 3D avatar, assisted 8-point rigging, Three.js / React Three Fiber, realtime voice over WebSocket, MediaPipe gesture events and persistent session history.

## Evidence Assets V4

Repository-grounded explanatory assets live under:

```text
assets/evidence/
├── multirank-architecture.svg
├── multirank-ablation.svg
├── multirank-evidence-node.svg
├── kongming-agent-flow.svg
├── homework-infrastructure.svg
└── avatar-realtime-flow.svg
```

Implemented by:

```text
styles-evidence-v4.css
evidence-v4.js
```

These are explanatory diagrams derived from public repository documentation, not fabricated product screenshots.

## Project Showcase V5

V5 distinguishes three evidence types explicitly:

1. **REAL PRODUCT SCREEN** — an actual UI screenshot already published in the source repository.
2. **PROJECT ASSET** — a genuine repository visual asset, explicitly labeled as not being a UI screenshot.
3. **RUNTIME / SOURCE PROOF** — direct links to experiment runners, services, protocols, components or documentation.

### MultiRank-RAG
Uses research/runtime proof instead of manufactured UI screenshots.

### Kongming
Uses genuine product assets plus direct links to:

```text
src/lib/agentRuntime.ts
src/lib/agents.ts
src/lib/matchEngine.ts
docs/08-multi-agent-multimodal-architecture.md
```

### AI Homework System
Uses real product screenshots published in the project README: platform overview, teacher workspace, AI grading + teacher review and teaching assistant.

### Interactive Avatar
Uses real product screens under:

```text
frontend/public/intro-real/
```

covering Create, Rig Assist, Scene, Realtime Interact and Dashboard.

V5 implementation:

```text
styles-showcase-v5.css
showcase-v5.js
showcase-v5-guard.js
```

## Final Portfolio QA V6

V6 is a reduction and publishing pass rather than a new content layer.

Changes include:

- stronger **MultiRank-RAG** flagship hierarchy
- desktop screenshot **proof rails** for AI Homework and Interactive Avatar
- single-column mobile proofs to avoid nested horizontal-gesture conflicts
- reduced repeated homepage copy on short laptop screens and phones
- retirement of the legacy petal / click-ink visual direction
- compatibility suppression of the old petal RAF loop
- runtime repair for legacy visible typos and malformed bilingual attributes
- page-specific descriptions, Open Graph metadata, Twitter summary metadata and `Person` JSON-LD
- keyboard-access improvements and safer external links
- `robots.txt`

V6 implementation:

```text
styles-final-v6.css
final-v6.js
robots.txt
```

## Styling / runtime architecture

```text
styles.css              # stable layout / typography / shared components
styles-ai.css           # LLM Systems visual identity
styles-ai-v2.css        # semantic trace / research-console motion
styles-content-v3.css   # research narrative / case-study hierarchy
styles-evidence-v4.css  # architecture / benchmark / evidence visuals
styles-showcase-v5.css  # real screens / runtime proof
styles-final-v6.css     # final hierarchy / reduction / publishing QA
```

```text
script-core.js
script.js
content-v3-fixes.js
cyy-ai-v2.js
evidence-v4.js
showcase-v5.js
showcase-v5-guard.js
final-v6.js
```

## CYY Research Assistant

The companion remains under:

```text
assets/cys-pet/
```

Research Assistant 2.0 performs deterministic local Top-K retrieval over portfolio knowledge and exposes evidence cards, match scores and project/page routing without requiring an external model API.

## Run locally

No build step is required.

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

Use **Ctrl + F5** after pulling changes if cached CSS or JavaScript is still visible.

## Deploy

Static deployment works with GitHub Pages, Vercel, Netlify or Cloudflare Pages.

For GitHub Pages:

**Settings → Pages → Deploy from a branch → `main` → `/ (root)`**

## Public-content note

Before public deployment, verify that `3138402129@qq.com` is the intended public email address. Team-project descriptions should continue to distinguish personal contribution from whole-system capability.
