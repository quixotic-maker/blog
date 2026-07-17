# Implementation Plan: personal-brand-website

## Overview

This plan converts the "Engineering Editorial · Light" design into incremental, code-focused steps for a Next.js (App Router, static export) + TypeScript + Tailwind CSS site. It builds bottom-up: project scaffolding and design tokens first, then the pure, framework-free logic layer under `lib/` (covered by fast-check property tests for the 9 correctness properties), then the typed bilingual content model and validation, then the shared immersion systems (Parallax, Grid, Motion, Data Threads, counters, shared-element navigation), then the Header and Homepage sections in required order, then the three MDX Project_Pages with their signature motifs, and finally reduced-motion/responsive polish and static-export/deployment wiring. Each step builds on prior steps and ends wired into the page tree, leaving no orphaned code.

Property-based tests use `fast-check`, run a minimum of 100 iterations, and are tagged `// Feature: personal-brand-website, Property N: <property text>`.

## Tasks

- [x] 1. Scaffold project, tooling, and design tokens
  - [x] 1.1 Initialize Next.js App Router project with static export and TypeScript
    - Create the Next.js app skeleton with `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`
    - Configure `next.config.mjs` with `output: 'export'` and MDX support; add `tailwind.config.ts` and PostCSS config
    - Add `package.json` scripts for build, lint, and test
    - _Requirements: 22.1, 22.2, 22.3_
  - [x] 1.2 Define the Visual_System design tokens and Tailwind wiring
    - Create `styles/tokens.css` with CSS custom properties: `--color-paper #F5F3EE`, `--color-ink #1C1C1C`, `--color-gray #6B6B6B`, `--color-accent #D97706`, `--color-grid #E5E2DC`, three font weights (light/regular/bold), and display/body-en/mono/zh font variables
    - Wire the tokens into `tailwind.config.ts` theme (colors, fontFamily, fontWeight) and import `tokens.css` from `globals.css`
    - Configure display (grotesque/serif, not Inter), clean sans body, monospace, and Source Han Sans/Serif fonts
    - _Requirements: 8.1, 8.3, 8.4, 8.5, 8.6, 8.7, 9.4_
  - [x] 1.3 Set up the testing framework
    - Configure Vitest with jsdom, React Testing Library, and `fast-check`
    - Add a `tests/` directory and a sample smoke test to confirm the runner executes
    - _Requirements: 22.1_

- [x] 2. Implement the pure logic layer: parallax math
  - [x] 2.1 Implement `lib/parallax.ts` offset functions
    - Implement `layerOffset(pointer, depthIndex, maxDepth, reduced)` returning a `{x,y}` clamped to the [4,12]px band, magnitude monotonically increasing with depth, and zero when `reduced`
    - Implement `scrollOffset(progress, depthIndex, maxDepth, reduced)` returning ordered vertical parallax translation, background moving least, zero when `reduced`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 21.2_
  - [x] 2.2 Write property test for parallax offset band
    - **Property 1: Parallax offsets stay within the depth band**
    - **Validates: Requirements 5.3**
  - [x] 2.3 Write property test for parallax depth ordering
    - **Property 2: Parallax offset magnitude increases with depth**
    - **Validates: Requirements 5.2**
  - [x] 2.4 Write property test for reduced-motion parallax zeroing
    - **Property 3: Reduced motion zeroes parallax**
    - **Validates: Requirements 5.6, 21.2**

- [x] 3. Implement the pure logic layer: motion config resolver
  - [x] 3.1 Implement `lib/motion.ts` `resolveMotion`
    - Map each `MotionIntent` (`sectionEnter`, `stagger`, `counter`, `parallax`, `dataThread`, `sharedElement`, `loading`) to a `ResolvedMotion` with `durationMs` in the correct band (section/element 400–600ms, loading 800–1200ms), `staggerMs` in 50–100ms where applicable, and `kind` of `align`
    - When `reduced` is true, collapse every intent to `kind` `fade` or `static`
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 4.4, 21.2_
  - [x] 3.2 Write property test for non-reduced motion duration bands
    - **Property 4: Non-reduced motion durations fall in the specified bands**
    - **Validates: Requirements 20.1, 20.2, 4.4**
  - [x] 3.3 Write property test for reduced-motion collapse
    - **Property 5: Reduced motion collapses every intent to fade or static**
    - **Validates: Requirements 21.2, 4.6, 6.6, 11.5, 18.4, 19.5**

- [x] 4. Implement the pure logic layer: counter interpolation
  - [x] 4.1 Implement `lib/counter.ts` `counterValue`
    - Implement `counterValue(target, progress)` mapping progress 0→1 to a monotonic non-decreasing displayed value that terminates exactly at `target` when progress is 1
    - _Requirements: 11.4_
  - [x] 4.2 Write property test for counter monotonicity and termination
    - **Property 6: Counter output is monotonic and terminates at the target**
    - **Validates: Requirements 11.4**

- [x] 5. Implement the pure logic layer: locale + Data_Thread resolvers
  - [x] 5.1 Implement `lib/locale.ts` toggle and content resolution
    - Implement `toggleLocale(current)` as a pure switch between `'zh'` and `'en'`
    - Implement `resolveContent<T>(entry, locale)` returning the active-locale field
    - _Requirements: 3.1, 3.3, 3.4, 3.5_
  - [x] 5.2 Write property test for locale toggle involution
    - **Property 7: Locale toggle is an involution over two languages**
    - **Validates: Requirements 3.3**
  - [x] 5.3 Implement `lib/dataThread.ts` `activeMetrics`
    - Implement a pure, deterministic mapping from section context to the fixed real metric set (Jarvis → "P95<200ms","18 agents"; My Heart → "9600 baud","H90,V120"; ARF → "1kHz","jitter<100μs"), with a baseline set for non-project context
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 5.4 Write property test for Data_Thread section mapping
    - **Property 9: Data_Thread maps each section context to its real metrics deterministically**
    - **Validates: Requirements 6.2**

- [x] 6. Define the bilingual content model, dictionaries, and validation
  - [x] 6.1 Implement `lib/contentSchema.ts` types and `validateContent`
    - Define `Locale`, `Bilingual<T>`, `HeadlineNumber`, `ExperienceEntry`, `ChapterPhrase`, `ContactLink`, `SiteBranding`, `SiteContent`, `ProjectId`, and `ProjectMeta`
    - Implement `validateContent` failing when any primary entry is missing a `zh`/`en` field, when `dataAnchors` count is outside ~5, or when any `previewMetrics` has fewer than 2 entries
    - _Requirements: 2.6, 3.1, 11.1_
  - [x] 6.2 Author `content/site.ts` bilingual homepage content
    - Populate branding (wordmark "quixoticmaker", tagline en "AI PM · Hardware-AI Integration" / zh "软硬一体 · 多智能体协同", signature "quixoticmaker — Yiheng Liu"), hero positioning + full-stack capability statement, ~5 data anchors with bilingual labels, parallel experience entries (BAAI; competition lead), philosophy entries, and footer positioning + GitHub/LinkedIn/Email links
    - Exclude OPC content and hype terms ("颠覆","革命性","最","唯一")
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.9, 11.1, 11.3, 15.1, 15.2, 16.1, 16.2, 16.3, 16.4, 17.1, 17.2, 17.3_
  - [x] 6.3 Author `content/chapters.ts` and `content/projectsMeta.ts`
    - Add ordered chapter phrases (Hero「从理解语义开始…」→ Jarvis「…到调度智能体…」→ My Heart「…再到驱动物理世界…」→ ARF「…最终，统一所有机器人。」)
    - Add `ProjectMeta` for jarvis/my-heart/arf with routes, index, bilingual name/tagline, techTags, ≥2 preview metrics each, and motif assignment (my-heart → oscilloscope, arf → exploded-view)
    - _Requirements: 2.2, 2.6, 6.5, 19.1, 19.2_
  - [x] 6.4 Write property test for content resolution and bilingual parity
    - **Property 8: Content resolution always yields the active-locale field**
    - **Validates: Requirements 3.1, 3.4, 3.5**
  - [x] 6.5 Write content lint unit test
    - Assert no hype terms ("颠覆","革命性","最","唯一") and no OPC content in dictionaries; assert `validateContent` passes for the authored content
    - _Requirements: 1.3, 1.5_

- [x] 7. Checkpoint - logic layer and content
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement providers and the Locale UI
  - [x] 8.1 Implement `MotionProvider` reading `prefers-reduced-motion`
    - Read `matchMedia('(prefers-reduced-motion)')` once, default to reduced motion when `matchMedia` is unavailable, and expose reduced state via context consumed by all animated components
    - _Requirements: 21.1, 21.3_
  - [x] 8.2 Implement `LocaleProvider` and `LocaleToggle`
    - Hold current locale in context, persist to `localStorage` inside try/catch with in-memory fallback, and apply changes globally; `LocaleToggle` calls `toggleLocale`
    - _Requirements: 3.2, 3.3, 3.4_
  - [x] 8.3 Implement the `Bilingual` UI component
    - Render paired zh/en content where editorial pairing is required and single active-locale content elsewhere, using `resolveContent`
    - _Requirements: 3.1, 3.5_
  - [x] 8.4 Write unit tests for providers and toggle
    - Test reduced-motion default when `matchMedia` is missing, locale persistence fallback, and global toggle behavior
    - _Requirements: 3.3, 3.4, 21.3_

- [x] 9. Implement the shared immersion systems
  - [x] 9.1 Implement `GridStage` and `MarginReadout`
    - `GridStage` renders the baseline grid using `--color-grid` as the layout stage behind content; `MarginReadout` renders monospace coordinate/page/column readouts in the margins in `--color-accent`
    - _Requirements: 7.1, 7.3, 7.4_
  - [x] 9.2 Implement `ParallaxLayer` consuming `lib/parallax.ts`
    - Organize content into 3–4 depth layers; apply pointer- and scroll-driven offsets via `transform: translate3d(...)` only; render statically under reduced motion; resolve pointer offset to zero when no pointer is present
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6_
  - [x] 9.3 Implement `DataThreads` scroll-switched margin readouts
    - Observe global scroll progress and swap rendered margin parameters to `activeMetrics` for the section in context; render values monospace in amber on the Grid_Motif; render statically without switching animation under reduced motion
    - _Requirements: 6.1, 6.2, 6.3, 6.6_
  - [x] 9.4 Implement `ChapterTransition`
    - Render bilingual chapter-intro phrases between sections in the fixed ordered sequence from `content/chapters.ts`
    - _Requirements: 6.4, 6.5_
  - [x] 9.5 Implement `MechanicalCounter` consuming `lib/counter.ts`
    - Render split-flap/odometer monospace digits triggered on viewport entry; render `target` immediately as static text under reduced motion
    - _Requirements: 11.2, 11.4, 11.5_
  - [x] 9.6 Implement `SharedElementLink`
    - Wrap a Project_Card as navigation to its Project_Page using Framer Motion `layoutId` shared-element transition; degrade to a simple fade navigation under reduced motion
    - _Requirements: 18.1, 18.4_
  - [x] 9.7 Write unit/snapshot tests for shared systems
    - Test `ParallaxLayer` static render under reduced motion, `DataThreads` static readout under reduced motion, `MechanicalCounter` static target under reduced motion, `GridStage`/`MarginReadout` monospace+amber output, and `ChapterTransition` ordering
    - _Requirements: 5.6, 6.6, 7.3, 7.4, 11.5_

- [x] 10. Implement the Header/Wordmark and root layout wiring
  - [x] 10.1 Implement `Header` and set the tab title
    - Render the lowercase "quixoticmaker" wordmark top-left with the bilingual sub-positioning tagline and `LocaleToggle`; set the browser tab title to "quixoticmaker" via root layout metadata
    - Wire `MotionProvider`, `LocaleProvider`, `GridStage`, and `Header` into `app/layout.tsx`
    - _Requirements: 1.6, 1.7, 1.8, 1.9, 3.2_
  - [x] 10.2 Write unit test for Header and metadata
    - Assert wordmark placement, bilingual tagline switching, and tab title equals "quixoticmaker"
    - _Requirements: 1.6, 1.7, 1.8, 1.9_

- [x] 11. Implement Homepage sections
  - [x] 11.1 Implement `LoadingAnimation`
    - Establish the coordinate Grid_Motif then odometer-calibrate the key real Data_Thread parameters (line-scan/calibration style, not a spinner), amber on paper, 800–1200ms, then reveal Hero on completion; exclude AI-aesthetic elements (pulsing glowing dots, shimmer skeletons, gradient progress rings, breathing glow orbs); degrade to a simple fade under reduced motion
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 9.1, 9.2, 9.3_
  - [x] 11.2 Implement `HeroSection` and `SystemDiagram`
    - Render the AI PM positioning statement and full-stack capability statement; render `SystemDiagram` for the semantic → decoupling → action flow using boxes, connectors, and monospace protocol annotations (not illustrative artwork)
    - _Requirements: 1.1, 1.2, 1.4, 10.1, 10.2, 10.3_
  - [x] 11.3 Implement `DataAnchorSection`
    - Render ~5 headline numbers in monospace with bilingual labels, each animated by `MechanicalCounter` on viewport entry, static final text under reduced motion
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  - [x] 11.4 Implement `ProjectCard` (×3) with hover metric preview
    - Render Jarvis/My Heart/ARF preview cards; reveal ≥2 key metrics on hover; wrap in `SharedElementLink` to navigate to the correct `/work/*` route
    - _Requirements: 2.4, 2.6, 18.1_
  - [x] 11.5 Implement `ExperienceSection`
    - Render BAAI internship (LLM capability boundaries; Robocoin, RoboxStudio) and competition team lead (创赛挑杯, Robocon) as parallel, equal-weight peer items with no time axis or chronological ordering
    - _Requirements: 15.1, 15.2, 15.3_
  - [x] 11.6 Implement `PhilosophySection`
    - Render Vibecoding, AI-Native/Agentic UX/Generative UI, "Breathing Room", and the redefinition of "Skill"
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  - [x] 11.7 Implement `FooterSection`
    - Render the "quixoticmaker — Yiheng Liu" signature sign-off (only place the real name appears), AI PM positioning, and GitHub/LinkedIn/Email links with gray→amber hover opening their destinations with `rel="noopener noreferrer"`
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_
  - [x] 11.8 Write unit tests for Homepage sections
    - Test Loading reveals Hero and uses line-scan (not spinner); Hero renders positioning + capability + box/connector diagram; Data_Anchor renders ~5 monospace numbers with bilingual labels; Project_Card hover reveals ≥2 metrics and navigates to the correct route; Footer links target GitHub/LinkedIn/Email with gray→amber hover
    - _Requirements: 4.2, 4.5, 10.1, 10.3, 11.1, 2.4, 2.6, 17.3, 17.4_

- [x] 12. Assemble the Homepage
  - [x] 12.1 Compose `app/page.tsx` in required order
    - Assemble sections top-to-bottom: LoadingAnimation, HeroSection, DataAnchorSection, three ProjectCard previews, ExperienceSection, PhilosophySection, FooterSection, with ChapterTransition phrases interleaved in sequence and DataThreads/ParallaxLayer wrapping the content
    - _Requirements: 2.1, 2.3, 6.4, 6.5_
  - [x] 12.2 Write integration test for Homepage order
    - Assert the sections render in the required top-to-bottom order and chapter phrases appear in sequence
    - _Requirements: 2.3, 6.5_

- [x] 13. Checkpoint - Homepage complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement Project_Page shell and signature motifs
  - [x] 14.1 Implement `ProjectPage` shell and building blocks
    - Implement `ProjectPage` (shared Visual_System, back-to-Homepage control, shared-element target), `ProjectHeader`, `MetricGrid`, `TechStackList`, and `AnnotationStamp` (annotation/stamp styling for credibility)
    - _Requirements: 2.5, 18.2, 18.3, 19.4_
  - [x] 14.2 Implement `OscilloscopeMotif` (My Heart) and `ExplodedViewMotif` (ARF)
    - Implement the matte oscilloscope/waveform motif (VAD/RMS) and the exploded-view assembly motif; render numeric values monospace; render as static graphics under reduced motion
    - _Requirements: 19.1, 19.2, 19.3, 19.5_
  - [x] 14.3 Write snapshot tests for motifs and stamps
    - Structural snapshots for `OscilloscopeMotif`, `ExplodedViewMotif`, and `AnnotationStamp`; assert static render under reduced motion
    - _Requirements: 19.1, 19.2, 19.5_

- [x] 15. Author Project_Page MDX content and routes
  - [x] 15.1 Author `content/projects/jarvis.mdx` and `app/work/jarvis/page.tsx`
    - Author full Jarvis technical content: multi-agent hub decoupling LLM semantics; two-stage intent recognition (keyword-first, LLM fallback below 0.8 confidence); Redis md5 semantic cache TTL 3600s; asyncio priority queue (CRITICAL/HIGH/NORMAL/LOW, 10 workers, semaphore 100, 60s global timeout); BaseAgent/AgentRegistry 18 agents with hot-reload and fallback; retry 3× with 0/2/4s backoff and sub-200ms P95; tech stack (Python 3.11 asyncio, FastAPI, PostgreSQL JSONB, Redis, Prometheus, Docker); value statement
    - Wire the MDX into the `ProjectPage` shell at `/work/jarvis`
    - _Requirements: 2.2, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 22.3, 18.2, 18.3_
  - [x] 15.2 Author `content/projects/my-heart.mdx` and `app/work/my-heart/page.tsx`
    - Author full My Heart (Mochi) content: end-side voice-to-action closed loop; state machine (IDLE/LISTENING/PROCESSING/SPEAKING→IDLE, ERROR); eight-node data flow (VAD RMS+silence, local Whisper ASR, 10-turn sliding window, OpenAI-compatible LLM one-YAML-line swap, gesture keyword routing, UART "H90,V120\n" ASCII at 9600 baud, Arduino per-degree 15ms interpolation, dual-DOF SG90 + Edge TTS); abstract-factory ASR/LLM/TTS decoupling; jitter suppression via firmware interpolation + VAD segmentation; honest roadmap (TTS placeholder, serial action/speech); tech stack; value statement; embed `OscilloscopeMotif`
    - Wire the MDX into the `ProjectPage` shell at `/work/my-heart`
    - _Requirements: 2.2, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 22.3, 18.2, 18.3, 19.1_
  - [x] 15.3 Author `content/projects/arf.mdx` and `app/work/arf/page.tsx`
    - Author full ARF content: universal robot OS with cloud-edge collaborative architecture; edge-plane layers (HAL drivers-as-service over gRPC, Rust/C++ crash isolation; RTS lock-free SPSC 1kHz jitter<100μs on PREEMPT_RT; DMS Redis/ZeroMQ pub-sub ring-buffer recorder + Parquet sync; ACR Go runtime + Python DAG zero-copy; DIL world model + py_trees behavior tree + safety monitor + mode manager + LLM planner; App FastAPI/React); cloud-plane components (Iceberg, Argo, Kubeflow/Ray Sim2Real + federated, Isaac Sim, Evaluation, Harbor Marketplace, KubeEdge OTA A/B); DIL L1/L2/L3 composable architecture; value statement; architecture diagrams (system, task sequence/data flywheel, DIL layers); embed `ExplodedViewMotif`
    - Wire the MDX into the `ProjectPage` shell at `/work/arf`
    - _Requirements: 2.2, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 22.3, 18.2, 18.3, 19.2_
  - [x] 15.4 Write content lint + smoke tests for Project_Pages
    - Assert MDX compiles for all three routes, no hype terms present, and each page renders full required content and applies the shared Visual_System
    - _Requirements: 1.5, 18.3, 22.3_

- [x] 16. Reduced-motion and responsive adaptation
  - [x] 16.1 Wire reduced-motion degradation end-to-end
    - Ensure parallax, Data_Thread scroll switching, counters, shared-element transitions, chapter transitions, loading animation, and signature motifs all consume `MotionProvider` and degrade to fade/static while keeping all content readable and reachable
    - _Requirements: 21.1, 21.2, 21.3, 4.6, 5.6, 6.6, 11.5, 18.4, 19.5_
  - [x] 16.2 Implement responsive/mobile adaptation
    - Stack side-by-side layouts vertically at mobile width, simplify Motion_System animations relative to desktop, and preserve readability of all primary content
    - _Requirements: 23.1, 23.2, 23.3_
  - [x] 16.3 Write integration tests for reduced-motion and responsive behavior
    - With `prefers-reduced-motion: reduce`, assert parallax/Data_Thread/counter/transitions render static/fade and content is reachable; at mobile width assert side-by-side layouts stack and content remains readable
    - _Requirements: 21.2, 21.3, 23.1, 23.3_

- [x] 17. Static export and deployment configuration
  - [x] 17.1 Finalize static export configuration and paper texture asset
    - Confirm `output: 'export'` generates `/`, `/work/jarvis`, `/work/my-heart`, `/work/arf`; add `public/textures/paper.png` referenced from typed constants; ensure texture load failure falls back to paper background color
    - _Requirements: 22.1, 22.2_
  - [x] 17.2 Add Vercel deployment configuration
    - Add repository/Vercel config so the site builds from GitHub, serves over HTTPS on a custom domain via CDN, and auto-deploys on push (config only; platform verification is manual)
    - _Requirements: 24.1, 24.2, 24.3, 24.4_
  - [x] 17.3 Write static-export smoke test
    - Assert the export produces all four routes and Project_Pages compile from MDX
    - _Requirements: 22.1, 22.2, 22.3_

- [x] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP; core implementation tasks are never optional.
- Each task references specific granular requirements for traceability.
- Property tests (Properties 1–9) target the pure `lib/` logic layer, run a minimum of 100 iterations with `fast-check`, and carry the `// Feature: personal-brand-website, Property N: ...` tag.
- Checkpoints ensure incremental validation at logic-layer, Homepage, and final stages.
- The visual/interaction layer (layout, texture, typography, motif rendering) is validated by unit/snapshot/integration tests rather than property tests, per the design's testing strategy.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "3.1", "4.1", "5.1", "5.3", "6.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "3.2", "3.3", "4.2", "5.2", "5.4", "6.2", "6.3"] },
    { "id": 4, "tasks": ["6.4", "6.5", "8.1", "8.2", "8.3"] },
    { "id": 5, "tasks": ["8.4", "9.1", "9.2", "9.3", "9.4", "9.5", "9.6"] },
    { "id": 6, "tasks": ["9.7", "10.1", "14.1", "14.2"] },
    { "id": 7, "tasks": ["10.2", "11.1", "11.2", "11.3", "11.4", "11.5", "11.6", "11.7", "14.3"] },
    { "id": 8, "tasks": ["11.8", "12.1", "15.1", "15.2", "15.3"] },
    { "id": 9, "tasks": ["12.2", "15.4", "16.1", "16.2", "17.1", "17.2"] },
    { "id": 10, "tasks": ["16.3", "17.3"] }
  ]
}
```
