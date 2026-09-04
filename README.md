# Yaoyang Chen · LLM Systems Portfolio

A bilingual personal website for **Yaoyang Chen / 陈耀洋**, focused on **LLM Systems, Multimodal RAG, Agentic Systems, Evaluation, and AI System Engineering**.

The site establishes a distinct **Editorial AI × Research Console** identity. It keeps a restrained warm-paper palette, serif/mono typography, and editorial spacing, but the visual language is built from **queries, retrieval traces, evidence graphs, ranking telemetry, system pipelines, and verification states** rather than legal/archive metaphors.

## Core identity

The site is organized around one technical axis:

**RETRIEVE · REASON · BUILD**

- **Retrieve** — multimodal retrieval, GraphRAG, hybrid search, reranking, evidence chains
- **Reason** — agent orchestration, explicit state, evidence-constrained decisions, memory and verification
- **Build** — FastAPI / React / WebSocket / async workers / deployment / realtime multimodal systems

The homepage positions the portfolio as **LLM Systems · RAG · Agent Engineering** rather than a generic AI application showcase.

## Visual direction

- `CYY / 26` as the personal system mark
- warm paper + muted teal + charcoal + restrained brass
- serif display typography for editorial hierarchy
- DM Mono for system labels, traces, metrics and metadata
- subtle technical grid instead of legal/case-document decoration
- homepage **LLM Research Dossier**:
  - Query
  - Retrieval / Graph nodes
  - Evidence
  - Rerank state
  - `VERIFIED` status
- system diagrams and metrics are part of the content, not decorative illustrations

The old floral drift and click-ink splash are hidden in the AI redesign. Motion is kept where it supports hierarchy, navigation, tracing, evidence flow, or continuity.

## Pages

### `index.html` — Home

One-screen positioning page with the animated intro and shared Research Dossier card.

The hero contains:

- LLM Systems · RAG · Agent Engineering
- Retrieve / Reason / Build
- four flagship-system count
- selected public MultiRank-RAG evidence:
  - FinQA `nDCG@5 = 0.878` for V5
  - MultiHop-RAG evidence-chain score `0.890`

The second-pass refinement adds a live-system framing around the dossier and animates the graph/evidence state as a trace rather than as decorative motion.

### `profile.html` — About

Personal positioning and systems mindset:

- 陈耀洋 / Yaoyang Chen
- 重庆邮电大学
- Intelligence Science & Technology + Mathematics and Applied Mathematics
- Evidence First
- Measure the Gain
- Ship the System
- current technical trajectory

### `experience.html` — Projects

Four flagship systems, each presented with its own technical pipeline, evidence, role and engineering emphasis:

1. **MultiRank-RAG** — research flagship
   - complex-PDF multimodal RAG
   - evidence nodes
   - GraphRAG
   - hybrid retrieval
   - MultiRank G0–G4
   - evidence-chain self-correction
   - public V0–V5 evaluation

2. **孔明职配 / Kongming Agentic Career System** — agent flagship
   - job knowledge RAG
   - six agent roles
   - shared AgentContext / AgentEvent / AgentArtifact
   - evidence-based matching and interview logic
   - long-term memory and verifiable growth loop

3. **AI Homework System** — production AI infrastructure
   - AI-first grading + teacher review
   - human-in-the-loop final control
   - Redis queue
   - default 8 AI workers
   - MinIO private object storage
   - Theia + Judge0 execution chain
   - Docker/private deployment

4. **Interactive Avatar** — realtime multimodal system
   - text/image/preset → 3D avatar
   - assisted 8-point rigging
   - Three.js / React Three Fiber
   - Qwen realtime voice over WebSocket
   - MediaPipe gesture interaction
   - session history and recordings

The project diagrams now animate as semantic traces: pipeline nodes enter in order, arrows pulse as information flow, core stages receive stronger emphasis, and metric cards resolve after the pipeline becomes active.

GROVE-AI and the AIMO interpretability work are not forced into the main project deck; they are used where they support the research narrative.

## `focus.html` — Research

The previous skill-oriented page is now a **research agenda** built around questions rather than technology labels:

1. **Multimodal RAG** — retrieval and grounding across text, tables, figures and cross-page relations
2. **Agentic Systems** — planning, tools, memory, state and controllability
3. **Evaluation & Interpretability** — ablation, robustness, uncertainty and reproducibility
4. **Multimodal Interaction** — speech, vision, 3D, gesture and realtime state

Each direction is visually centered on a **Research Question**, then expands into representation/method/verification blocks and project evidence. Slide activation replays the research hierarchy so the motion follows the argument rather than simply revealing cards.

## `education.html` — Academic

Academic identity is restored instead of treating toolchains as a substitute for education:

- 重庆邮电大学 / CQUPT
- 智能科学与技术
- 数学与应用数学
- four training axes:
  - Mathematics
  - LLM Systems
  - AI System Engineering
  - Research & Evaluation
- selected academic recognition

## `contact.html` — Contact

Dark-console ending page for research collaboration, AI engineering projects and internship opportunities.

Only the email route is exposed publicly; no phone or WeChat ID is shown.

## Motion system

The stable GSAP architecture remains the base layer:

1. **Reveal** — restrained vertical content entrance
2. **Clip** — masked title / intro reveals
3. **Shared object** — the same homepage dossier card travels from loader to final position
4. **Cover transition** — internal navigation continues across pages through `sessionStorage`
5. **Drift** — low-amplitude parallax only
6. **Slide deck** — project and research panels support click and pointer drag

The second-pass AI motion layer adds:

7. **Trace** — project pipeline nodes activate in execution order
8. **Signal** — arrows pulse to communicate information flow
9. **Verification** — evidence metrics and verified states resolve after the trace
10. **Research hierarchy** — research-question → method blocks → proof

Subpages use the local GSAP bundle with ScrollTrigger and SplitText. `prefers-reduced-motion` falls back to static content.

## Project evidence used on the site

MultiRank-RAG public ablation results are taken from the repository's reproducible benchmark report. Under a fixed BM25 candidate set:

- FinQA: V0 `nDCG@5 0.678` → V5 `0.878`
- MultiHop-RAG: V5 evidence-chain score `0.890`
- MultiHop-RAG: V5 gold-node coverage `0.730`

These metrics are shown as evidence of method behavior, not as generic marketing counters.

## Styling architecture

The visual system is layered so the stable site foundation stays separate from the evolving CYY AI language:

```text
styles.css          # base layout / typography / stable components
styles-ai.css       # first LLM Systems redesign layer
styles-ai-v2.css    # second-pass research-console refinement and semantic motion states
```

The corresponding semantic motion runtime is:

```text
cyy-ai-v2.js
```

It uses IntersectionObserver and lightweight DOM state rather than replacing the existing GSAP navigation system.

## CYY Research Assistant

The floating companion is now framed as a **CYY Research Assistant**, not an archive navigator.

The existing renderer and state machine are preserved under the legacy folder:

```text
assets/cys-pet/
```

The current product layer adds:

```text
assets/cys-pet/research-assistant.js
assets/cys-pet/research-greetings.js
```

The assistant is intentionally deterministic and local in this version. It answers from a compact portfolio knowledge base covering:

- MultiRank-RAG
- Kongming / Agentic Systems
- AI Homework System
- Interactive Avatar
- research interests
- academic background
- technology stack
- contact

A normal question produces a concise grounded answer. Navigation only occurs when the user explicitly asks to **open / show / take me to / 查看 / 带我去** a relevant section. This keeps the companion useful without turning every query into an automatic page jump.

The first-page greeting and legacy labels are also normalized to the Research Assistant identity.

## Runtime loading

`script.js` is the enhancement loader. It:

- enables AI mode and hides legacy decorative effects
- loads `styles-ai-v2.css`
- loads `cyy-ai-v2.js`
- preserves the existing companion renderer layers
- loads the Research Assistant knowledge and greeting layers last

No build system is required.

## Run locally

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Use `Ctrl + F5` after pulling changes to bypass cached CSS/JS.

## Deploy

The site is static and can be deployed directly to GitHub Pages, Vercel, Netlify, or Cloudflare Pages.

For GitHub Pages:

**Settings → Pages → Deploy from a branch → `main` → `/ (root)`**

## Public-content note

Before final public deployment, verify that `3138402129@qq.com` is the email address intended for public use. Team-project role descriptions on Kongming and Interactive Avatar should continue to be kept specific to the work actually owned by Yaoyang Chen.
