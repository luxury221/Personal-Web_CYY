# Yaoyang Chen · Personal Website

A bilingual personal website for Yaoyang Chen, designed as an **Editorial AI × Personal Archive** portfolio rather than a conventional resume page. Built from the same design system as the CYS reference site (Personal-Web-cys), re-themed for an AI engineering direction.

## Current visual direction

- `CYY / 26` as the personal monogram
- The same warm-paper background with muted teal, charcoal ink, and restrained brass details
- Serif display typography + neutral sans-serif body + mono archive metadata
- Paper layers, grid, seal (「智」), and archival composition instead of generic cards
- No portrait image is required in the current version

## Motion system

The site intentionally uses only a small set of motion patterns:

1. **Reveal** — text and content enter with restrained vertical movement
2. **Clip** — archive/paper details reveal through masked motion
3. **Shared** — the exact same CYY archive card used in the loader moves into the homepage position
4. **Cover** — internal-page navigation uses a muted-teal archive cover transition; the cover **continues** onto the destination subpage and slides away (via a `sessionStorage` handoff flag, key `cyy-cover-label`), so internal navigation reads as one continuous motion
5. **Drift** — the homepage archive visual and the contact watermark have only 1–8 px of pointer parallax

The intro sequence is approximately three seconds:

`ARCHIVE → 智 → YAOYANG CHEN → RETRIEVE / REASON / BUILD → CYY archive card → seal stamp → shared-card move → homepage`

The intro intentionally **plays every time `index.html` is entered or refreshed**. The `SKIP` control immediately reveals the homepage.

## Scroll narrative (GSAP ScrollTrigger + SplitText)

Subpages load the local GSAP bundle (`assets/vendor/gsap.bundle.min.js`, core + ScrollTrigger + SplitText):

- **Split titles & leads** — the subpage title splits by character and the lead by line, each rising out of an overflow mask. Splits are reverted and rebuilt on every language toggle.
- **Scroll reveals** — content blocks, case-card heads, case-grid cells, course rows, and rails reveal as they enter the viewport (`once: true`).
- **Rule lines** — the 1 px separator above content blocks and case cards draws in left-to-right through a `--rule` CSS variable.
- **Metric count-up** — the training page repository metric counts up on first view.

All scroll narrative waits for the actual webfont faces with a hard timeout, a post-load failsafe force-reveals any element still hidden, and everything degrades to static content under `prefers-reduced-motion`. After pulling or editing, hard-refresh with `Ctrl + F5` to bypass cached CSS/JS.

## Micro-interactions

- **Mono metadata decode** — `.decode` labels resolve through a short character scramble on entrance
- **Seal stamp** — the archive seal is pressed onto the card (scale 1.24 → 1)
- **Copy email** — the contact page copies the address to the clipboard and flashes `COPIED ✓`
- **Ink splash** — every click presses teal-ink droplets and an expanding ring into the page
- **Language toggle stagger** — swapped strings re-enter with a light stagger; split titles re-split afterwards
- **Custom cursor** — hovering links and buttons raises crop-mark corners around the target
- **Water ripple** — a two-buffer wave simulation rendered as faint wet-ink shading (energy-tracking, sleeps when settled)
- **Magnetic nav** — nav links lean up to 6 px toward the pointer

## Shared archive card

The built-in CSS archive card carries the AI-direction labels: document lines `RETRIEVAL-AUGMENTED GENERATION / LLM AGENT SYSTEMS / MODEL EVALUATION & INTERPRETABILITY`, watermark 智, seal `VERITAS · RATIO · ARCHIVE`, monogram `CYY`, and axis `RETRIEVE / REASON / BUILD`. Dropping an image at `assets/archive-card.webp` (1.2:1, site palette) re-enables the optional picture card on loader, transition, and homepage at once; delete the file to return to the built-in card.

The primary navigation includes 首页 / Home (`00`) alongside the five section pages (`01`–`05`), with the active page underlined.

## Pages

- `index.html` — animated intro + one-screen homepage
- `profile.html` — profile and positioning (Retrieve / Reason / Build), with an at-a-glance archive rail and an archive timeline
- `experience.html` — full-width case deck with four AI projects: `01` 孔明职配 (student job-matching agent), `02` Interactive Avatar (digital human), `03` GROVE-AI (Anker-track evidence-driven product definition), `04` AIMO Interpretability Challenge; switchable by tab click or pointer drag
- `education.html` — project-driven training archive: repository metric and a four-group toolchain list (Retrieval & RAG / Agents & Backend / Frontend & Interaction / Modeling & Evaluation)
- `focus.html` — the slide-deck pattern for Retrieve / Reason / Build with keyword tags per panel
- `contact.html` — minimal contact page over a grid-and-watermark texture with a slow marquee

Experience and focus share the reusable **slide-deck component** (`[data-deck]`). The archive companion pet (`assets/cys-pet/`, folder name kept from the shared asset pipeline) speaks page-specific greetings in both languages and routes keyword questions to the right page.

## Performance

- **Self-hosted Latin fonts** ship from `assets/fonts/`; CJK loads from Google Fonts asynchronously with system-font fallbacks.
- **Local GSAP bundles** replace CDN requests.
- **Water ripple sleeps** once the field settles.

## Run locally

No build step is required.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

This is a static site and can be deployed directly to GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static host. For GitHub Pages: **Settings → Pages → Deploy from a branch**, select `main`, use `/ (root)`.

## Content note — verify before public deployment

- **Chinese name characters** — the site currently uses the pinyin name “Yaoyang Chen”; the official Chinese characters are not yet filed.
- **Education** — school, program, degree, and GPA are not yet filed (the Training page is intentionally project-driven until confirmed).
- **Contact email** — `3138402129@qq.com` was taken from the local git identity; confirm it is the address you want public.
- **City/base** — currently shown as “中国 / China”; replace with the city you want public.
- **Project roles and dates** — Kongming and Interactive Avatar are team projects; the exact individual roles and start/end dates are placeholders to confirm. MultiRank-RAG and ai-homework-system are private or inaccessible and therefore not yet featured as cases.
- The public UI shows only the email as the contact route; no phone or WeChat ID is exposed.
