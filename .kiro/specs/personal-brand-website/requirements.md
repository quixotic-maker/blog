# Requirements Document

## Introduction

This document specifies the requirements for a personal brand and portfolio website for Yiheng Liu (刘一恒), a robotics and engineering sophomore positioning himself as an AI Product Manager focused on hardware-AI integration and multi-agent coordination. The primary audience is a startup founder Yiheng Liu is about to intern with; the website is intended to be listed on his resume. Secondary audiences are recruiters and potential collaborators.

The website presents the "quixoticmaker" wordmark as its brand identity, with the founder's real name reserved for the footer sign-off so the startup founder can match the brand to the person.

The website is a bilingual (Chinese and English) hybrid structure: a single long-scroll narrative homepage combined with separate dedicated project pages. The visual and interaction system is an "Engineering Editorial · Light" aesthetic — a precisely typeset engineering-journal look crossed with an architecture-studio portfolio, deliberately avoiding any generic "AI aesthetic." Immersion is achieved through 2.5D parallax layering, a coordinate/grid motif, a site-wide "Data Threads" guiding motif built from real project metrics rendered in the margins, and editorial typography, while motion is required to serve the narrative without ever slowing reading.

The visual/interaction walkthrough scratch file at `/home/liu/program/blog/website-visual-guide.md` is referenced background. Where this document and that scratch file differ (for example, the scratch file's single-page drawer model versus the settled hybrid structure with dedicated project pages), this document is authoritative.

## Glossary

- **Website**: The complete deployed personal brand website, including the homepage and all dedicated project pages.
- **Homepage**: The single long-scroll narrative page served at the site root, containing all core sections in vertical order.
- **Project_Page**: A dedicated page for a single core project, served at `/work/jarvis`, `/work/my-heart`, and `/work/arf`.
- **Loading_Animation**: The restrained engineering-style entry animation shown before Homepage content is revealed.
- **Parallax_System**: The 2.5D pseudo-3D depth-layering system that shifts visual layers in response to mouse movement and scroll position.
- **Wordmark**: The site brand name "quixoticmaker" (lowercase), which is Yiheng Liu's online identity and serves as the site title in place of the personal name.
- **Chapter_Transition**: A bilingual section-intro phrase displayed between Homepage sections, functioning like a magazine chapter heading.
- **Grid_Motif**: The coordinate/grid motif (motif B), including the visible baseline grid, element alignment-on-entry behavior, and monospace coordinate/page-number readouts in the margins.
- **Data_Thread**: The site-wide guiding motif composed of the user's real technical parameters, rendered in the monospace typeface in the page margins on top of the Grid_Motif, that acts as the narrative guide as the visitor scrolls.
- **Visual_System**: The combined color palette, typography, spacing, and grid rules defining the "Engineering Editorial · Light" aesthetic.
- **Hero_Section**: The first Homepage section containing the positioning statement and a minimal system diagram.
- **Data_Anchor_Section**: The Homepage section displaying approximately five headline numbers.
- **Project_Card**: A preview card on the Homepage representing one core project, linking to its Project_Page.
- **Experience_Section**: The Homepage section presenting Yiheng Liu's experience entries as parallel, peer items rather than as a time-ordered sequence.
- **Philosophy_Section**: The Homepage section presenting Yiheng Liu's product philosophy.
- **Footer_Section**: The final Homepage section containing contact links and sign-off.
- **Shared_Element_Transition**: The animated transition that visually connects a Project_Card on the Homepage to its corresponding Project_Page.
- **Signature_Motif**: A per-project distinctive visual/motion element on a Project_Page (oscilloscope/waveform for My Heart, exploded-view assembly diagram for ARF).
- **Motion_System**: The collection of all animations and transitions across the Website, governed by shared motion principles.
- **Reduced_Motion_Mode**: The degraded-motion behavior triggered when the user's environment requests reduced motion.
- **Language_Mode**: The currently active display language of the Website, either Chinese or English.
- **Locale_Toggle**: The control that switches Language_Mode.
- **Deployment_Platform**: The Vercel hosting environment serving the statically generated Website.
- **Viewport**: The browser rendering area, classified as desktop or mobile by width.

## Requirements

### Requirement 1: Site purpose and audience framing

**User Story:** As Yiheng Liu, I want the website to clearly communicate my positioning as an AI Product Manager for hardware-AI integration, so that the startup founder and recruiters immediately understand my value.

#### Acceptance Criteria

1. THE Website SHALL present Yiheng Liu's positioning as an AI Product Manager focused on hardware-AI integration and multi-agent coordination within the Hero_Section.
2. THE Website SHALL present a full-stack product definition capability statement spanning low-level algorithm boundaries, hardware protocols, and top-level user experience.
3. THE Website SHALL exclude any content that emphasizes the One Person Company (OPC) concept.
4. THE Website SHALL use a calm, precise tone that argues through facts and architecture decisions.
5. THE Website SHALL exclude hype terms including "颠覆", "革命性", "最", and "唯一" from all authored content.
6. THE Website SHALL use the Wordmark "quixoticmaker" as the site brand name in place of the personal name as the site title.
7. THE Website SHALL display the Wordmark in the top-left of the header.
8. THE Website SHALL set the browser tab title to the Wordmark "quixoticmaker".
9. THE Website SHALL display a sub-positioning tagline accompanying the Wordmark reading "AI PM · Hardware-AI Integration" in English Language_Mode and "软硬一体 · 多智能体协同" in Chinese Language_Mode.

### Requirement 2: Hybrid structure and navigation

**User Story:** As a visitor, I want a scrollable narrative homepage plus dedicated project pages, so that I can skim the overview quickly and dive deep into projects on demand.

#### Acceptance Criteria

1. THE Website SHALL provide a single long-scroll Homepage at the site root.
2. THE Website SHALL provide a dedicated Project_Page at `/work/jarvis`, at `/work/my-heart`, and at `/work/arf`.
3. THE Homepage SHALL order its sections top to bottom as follows: Loading_Animation, Hero_Section, Data_Anchor_Section, three Project_Card previews, Experience_Section, Philosophy_Section, Footer_Section.
4. WHEN a visitor activates a Project_Card, THE Website SHALL navigate to the corresponding Project_Page.
5. WHEN a visitor is on a Project_Page, THE Website SHALL provide a control that returns the visitor to the Homepage.
6. WHILE a pointer hovers over a Project_Card, THE Website SHALL reveal a preview of at least two key metrics for that project.

### Requirement 3: Bilingual support

**User Story:** As a bilingual audience member, I want the site in both Chinese and English, so that I can read it in my preferred language.

#### Acceptance Criteria

1. THE Website SHALL present all primary content in both Chinese and English.
2. THE Website SHALL provide a Locale_Toggle for switching Language_Mode.
3. WHEN a visitor activates the Locale_Toggle, THE Website SHALL switch the active Language_Mode to the other supported language.
4. WHEN Language_Mode changes, THE Website SHALL apply the change consistently across the Homepage and all Project_Pages.
5. WHERE bilingual editorial pairing is used, THE Website SHALL display the Chinese and English content of a section together rather than requiring navigation to access the second language.

### Requirement 4: Loading animation

**User Story:** As a first-time visitor, I want a brief, restrained entry animation, so that the site feels precise and engineered from the first moment.

#### Acceptance Criteria

1. WHEN the Homepage is first loaded, THE Loading_Animation SHALL display before Homepage content is revealed.
2. THE Loading_Animation SHALL establish the coordinate Grid_Motif and then rapidly count the key real Data_Thread parameters as they calibrate from initial to final values with a mechanical odometer feel.
3. THE Loading_Animation SHALL use a line-scan or calibration style rather than a rotating spinner.
4. THE Loading_Animation SHALL render the amber accent color on the off-white paper background.
5. THE Loading_Animation SHALL complete within a duration between 800 and 1200 milliseconds.
6. WHEN the Loading_Animation completes, THE Website SHALL reveal the Hero_Section content.
7. THE Loading_Animation SHALL exclude AI-aesthetic elements including pulsing glowing dots, shimmer skeletons, gradient progress rings, and breathing glow orbs, consistent with Requirement 9.
8. WHERE Reduced_Motion_Mode is active, THE Loading_Animation SHALL degrade to a simple fade.

### Requirement 5: 2.5D parallax immersion

**User Story:** As a visitor, I want subtle depth and layering, so that the page feels immersive like looking through layers of tracing paper without any WebGL-style effects.

#### Acceptance Criteria

1. THE Parallax_System SHALL organize page content into three to four discrete depth layers.
2. THE Parallax_System SHALL render the background grid as the slowest-moving layer and the foreground body/annotations as the layer that tracks pointer movement most.
3. WHEN the pointer moves, THE Parallax_System SHALL shift each depth layer by an offset between 4 and 12 pixels according to its assigned depth.
4. WHEN the visitor scrolls, THE Parallax_System SHALL apply layered parallax offsets across the depth layers.
5. THE Parallax_System SHALL produce depth using layer offsets and paper texture rather than WebGL rendering.
6. WHERE Reduced_Motion_Mode is active, THE Parallax_System SHALL disable pointer-driven and scroll-driven layer offsets.

### Requirement 6: Data Threads guiding motif and chapter transitions

**User Story:** As a visitor, I want the site's own real project metrics to guide me as I scroll, plus bilingual section intros, so that scrolling feels like reading a curated engineering narrative anchored in real data.

#### Acceptance Criteria

1. THE Data_Thread SHALL render real project parameters as monospace margin readouts on top of the Grid_Motif, including examples such as "18 agents", "9600 baud", "1kHz", "P95<200ms", "H90,V120", and "jitter<100μs".
2. WHEN the visitor scrolls into a project's section or context, THE Data_Thread SHALL switch the margin parameters to that project's real metrics, presenting Jarvis metrics such as "P95<200ms" and "18 agents", My Heart metrics such as "9600 baud" and "H90,V120", and ARF metrics such as "1kHz" and "jitter<100μs".
3. THE Data_Thread SHALL render its values in the monospace typeface in the amber accent color, consistent with the Grid_Motif margin readouts defined in Requirement 7.
4. THE Website SHALL display a bilingual Chapter_Transition phrase between Homepage sections.
5. THE Website SHALL sequence the Chapter_Transition phrases to introduce, in order, the Hero ("从理解语义开始…"), Jarvis ("…到调度智能体…"), My Heart ("…再到驱动物理世界…"), and ARF ("…最终，统一所有机器人。").
6. WHERE Reduced_Motion_Mode is active, THE Data_Thread SHALL render statically with parameters shown without scroll-driven switching animation while remaining readable.

### Requirement 7: Coordinate and grid motif

**User Story:** As a visitor, I want a visible precise grid with coordinate readouts, so that the site conveys engineering rigor.

#### Acceptance Criteria

1. THE Grid_Motif SHALL render a visible grid using the near-invisible grid line color as the layout stage.
2. WHEN a section element enters the Viewport, THE Grid_Motif SHALL align the element onto the grid as part of its entry.
3. THE Grid_Motif SHALL display monospace coordinate readouts, page numbers, or column numbers in the page margins.
4. THE Grid_Motif SHALL render the margin readouts in the amber accent color.

### Requirement 8: Editorial typography and color system

**User Story:** As Yiheng Liu, I want a restrained editorial type and color system, so that the site reads as a high-end engineering publication.

#### Acceptance Criteria

1. THE Visual_System SHALL use a warm off-white paper background of approximately #F5F3EE, ink-black text of approximately #1C1C1C, secondary gray of approximately #6B6B6B, a single amber/ember accent of approximately #D97706, and grid lines of approximately #E5E2DC.
2. THE Visual_System SHALL apply the amber accent color sparingly.
3. THE Visual_System SHALL use a display grotesque or serif typeface for English display text and SHALL NOT use Inter for display text.
4. THE Visual_System SHALL use a monospace typeface for technical annotations, numbers, and protocol frames.
5. THE Visual_System SHALL use a clean sans typeface for English body text.
6. THE Visual_System SHALL use Source Han Sans or Source Han Serif for Chinese text.
7. THE Visual_System SHALL limit the type system to three font weights.
8. THE Visual_System SHALL create visual hierarchy through size and whitespace rather than through color variation.
9. THE Visual_System SHALL apply a strict baseline grid, asymmetric layouts, large type-size contrast, page-edge marginalia, and generous whitespace.

### Requirement 9: Anti-AI-aesthetic constraint

**User Story:** As Yiheng Liu, I want the site to avoid generic AI visuals, so that it reads as a serious engineering portfolio rather than a SaaS template.

#### Acceptance Criteria

1. THE Website SHALL exclude purple and blue gradients from its visual design.
2. THE Website SHALL exclude glowing orbs, glassmorphism, neon, and particle-flow effects.
3. THE Website SHALL exclude generic SaaS-template visual patterns.
4. THE Website SHALL restrict color usage to the defined "Engineering Editorial · Light" palette.

### Requirement 10: Hero section content

**User Story:** As a visitor, I want an immediate positioning statement and a minimal system diagram, so that I grasp the core narrative within seconds.

#### Acceptance Criteria

1. THE Hero_Section SHALL display the positioning statement described in Requirement 1.
2. THE Hero_Section SHALL display a minimal system diagram representing the semantic-to-physical-execution flow.
3. THE Hero_Section SHALL render the system diagram in the restrained engineering style using boxes, connectors, and monospace protocol annotations rather than illustrative artwork.

### Requirement 11: Data anchor section

**User Story:** As a visitor, I want a set of headline numbers, so that I can quickly gauge the scale and rigor of the work.

#### Acceptance Criteria

1. THE Data_Anchor_Section SHALL display approximately five headline numbers.
2. THE Data_Anchor_Section SHALL render each headline number in the monospace typeface.
3. THE Data_Anchor_Section SHALL display a bilingual label for each headline number.
4. WHEN a headline number enters the Viewport, THE Data_Anchor_Section SHALL animate the number using a split-flap or odometer mechanical counter effect.
5. WHERE Reduced_Motion_Mode is active, THE Data_Anchor_Section SHALL display each headline number as static final text.

### Requirement 12: Jarvis project content

**User Story:** As the startup founder, I want the Jarvis project fully documented with real technical facts, so that I can evaluate Yiheng Liu's backend and multi-agent design ability.

#### Acceptance Criteria

1. THE Website SHALL describe Jarvis as a multi-agent coordination hub that decouples large-language-model semantics from complex task execution.
2. THE Website SHALL describe the two-stage intent recognition that uses keyword matching first and falls back to the large language model only when confidence is below 0.8.
3. THE Website SHALL describe the semantic caching implemented in Redis using an md5 key with a time-to-live of 3600 seconds.
4. THE Website SHALL describe the asynchronous task engine using an asyncio priority queue with four priority levels (CRITICAL, HIGH, NORMAL, LOW), ten worker coroutines, a semaphore limit of 100, and dual-layer timeout guardrails with a 60-second global timeout.
5. THE Website SHALL describe the unified BaseAgent abstraction and central AgentRegistry managing 18 domain agents with runtime hot-reload and automatic fallback.
6. THE Website SHALL describe the retry policy of three retries with 0-, 2-, and 4-second backoff and the sub-200-millisecond P95 latency target.
7. THE Website SHALL list the Jarvis technology stack including Python 3.11 asyncio, FastAPI, PostgreSQL with JSONB, Redis, Prometheus, and Docker.
8. THE Website SHALL present the Jarvis value statement that it turns conversational AI into reliable, trackable, and traceable task execution as an extensible capability hub with fault-tolerant scheduling.

### Requirement 13: My Heart / Mochi project content

**User Story:** As the startup founder, I want the My Heart project documented with its real embodied-interaction pipeline, so that I can evaluate Yiheng Liu's software-hardware integration ability.

#### Acceptance Criteria

1. THE Website SHALL describe My Heart (Mochi) as an end-side voice-to-action closed-loop embodied interaction product.
2. THE Website SHALL describe the state machine with states IDLE, LISTENING, PROCESSING, SPEAKING, returning to IDLE, and an ERROR state.
3. THE Website SHALL describe the eight-node data flow: microphone VAD using RMS energy and silence counting, local Whisper ASR, sliding-window context of the last 10 turns, an OpenAI-compatible large language model switchable via one YAML line, gesture keyword routing, a UART driver that limits and encodes commands such as "H90,V120\n" as ASCII at 9600 baud, Arduino firmware performing per-degree 15-millisecond step interpolation, and dual-DOF control of two SG90 servos with Edge TTS feedback.
4. THE Website SHALL describe the abstract-factory decoupling of heterogeneous ASR, LLM, and TTS services enabling a vendor swap through a single YAML line.
5. THE Website SHALL describe the physical jitter suppression achieved by pushing interpolation down to the firmware and the VAD-based automatic segmentation.
6. THE Website SHALL disclose the honest roadmap that TTS playback is currently a placeholder and that action and speech are currently serial rather than time-aligned.
7. THE Website SHALL list the My Heart technology stack including Python asyncio, Whisper, an OpenAI-compatible SDK, Edge TTS, PyAudio, NumPy, Arduino Nano ATmega328P, SG90 servos, pyserial, and UART.
8. THE Website SHALL present the My Heart value statement that it moves on-screen AI into the physical world and that software-hardware decoupling enables porting to museum-guide, child-companion, and elder-care use cases by swapping prompt and keywords.

### Requirement 14: ARF project content

**User Story:** As the startup founder, I want the ARF framework documented with its layered architecture, so that I can evaluate Yiheng Liu's systems-level product thinking.

#### Acceptance Criteria

1. THE Website SHALL describe ARF (Ares Robotics Framework) as a universal robot operating system with a cloud-edge collaborative architecture.
2. THE Website SHALL describe the edge-plane layers: HAL hardware abstraction with drivers-as-service over gRPC and crash isolation in Rust/C++, RTS real-time scheduling with a lock-free SPSC queue at 1 kHz with jitter under 100 microseconds on PREEMPT_RT, DMS data acquisition using Redis/ZeroMQ pub-sub with a ring-buffer event-triggered recorder and Parquet cloud sync, ACR algorithm container with a Go runtime and Python containers using DAG graph execution with zero-copy shared memory, and DIL decision intelligence in Python/PyTorch with a world model, a py_trees behavior tree, a highest-priority safety monitor, an autonomous-teleop mode manager, and an LLM task planner, plus an App layer built on FastAPI and React.
3. THE Website SHALL describe the cloud-plane components: Data Hub using an Iceberg lakehouse, Converter using Argo DAG, Training using Kubeflow/Ray with Sim2Real and federated learning, Isaac Sim, Evaluation, a Marketplace using Harbor, and Fleet Management using KubeEdge with OTA A/B deployment.
4. THE Website SHALL describe the DIL three-layer composable decision architecture: L1 atomic algorithm capabilities in ACR containers, L2 composable decision components including behavior-tree manager, vision search, and safety monitor, and L3 complete decision instances assembled by the developer.
5. THE Website SHALL present the ARF value statement that it solves fragmentation of low-level hardware and algorithms by providing a standardized universal control framework and ecosystem foundation.
6. THE Website SHALL present ARF architecture diagrams covering system architecture, task sequence / data flywheel, and DIL composable layers.

### Requirement 15: Experience section

**User Story:** As a recruiter, I want Yiheng Liu's experience entries presented as parallel peer items, so that I can assess his background and leadership without a chronological framing.

#### Acceptance Criteria

1. THE Experience_Section SHALL present the BAAI (Beijing Academy of AI) algorithm internship, including grounded understanding of large-language-model capability boundaries and core contributions to the Robocoin and RoboxStudio projects.
2. THE Experience_Section SHALL present Yiheng Liu's role as team lead for the innovation and entrepreneurship competitions 创赛挑杯 and Robocon.
3. THE Experience_Section SHALL present its entries as parallel, peer items without ordering them on a time axis or emphasizing chronological sequence.

### Requirement 16: Product philosophy section

**User Story:** As the startup founder, I want Yiheng Liu's product philosophy articulated, so that I understand how he thinks about building AI-native products.

#### Acceptance Criteria

1. THE Philosophy_Section SHALL present the Vibecoding approach of agile development driven by high-level aesthetic direction and AI-assisted generation.
2. THE Philosophy_Section SHALL present the concepts of AI-Native design, Agentic UX, and Generative UI.
3. THE Philosophy_Section SHALL present the "Breathing Room" principle as an essential product quality.
4. THE Philosophy_Section SHALL present the redefinition of "Skill" as the capabilities a frontier AI Agent possesses rather than a traditional worker's professional skill.

### Requirement 17: Footer and contact

**User Story:** As a visitor, I want a clear contact and sign-off area, so that I can reach Yiheng Liu.

#### Acceptance Criteria

1. THE Footer_Section SHALL display the Wordmark "quixoticmaker" together with "Yiheng Liu" as the sign-off, presenting the signature as "quixoticmaker — Yiheng Liu".
2. THE Footer_Section SHALL display the AI Product Manager positioning.
3. THE Footer_Section SHALL display contact links including GitHub, LinkedIn, and Email.
4. WHILE a pointer hovers over a contact link, THE Footer_Section SHALL change the link color from gray to the amber accent color.
5. WHEN a visitor activates a contact link, THE Website SHALL open the corresponding destination.

### Requirement 18: Dedicated project pages with shared-element transition

**User Story:** As a visitor, I want project pages to feel like a seamless expansion of their card, so that navigation feels continuous and spacious.

#### Acceptance Criteria

1. WHEN a visitor activates a Project_Card, THE Website SHALL perform a Shared_Element_Transition connecting the Project_Card to its Project_Page.
2. THE Project_Page SHALL present the full project content defined for that project in Requirements 12, 13, or 14.
3. THE Project_Page SHALL apply the same Visual_System defined in Requirement 8.
4. WHERE Reduced_Motion_Mode is active, THE Shared_Element_Transition SHALL degrade to a simple fade.

### Requirement 19: Per-project signature motifs

**User Story:** As a visitor, I want each project page to have a distinctive technical motif, so that each project's character is memorable and credible.

#### Acceptance Criteria

1. THE My Heart Project_Page SHALL present a matte oscilloscope/waveform Signature_Motif representing its VAD/RMS energy detection.
2. THE ARF Project_Page SHALL present an exploded-view assembly diagram Signature_Motif for its architecture.
3. WHERE a Signature_Motif conveys numeric values, THE Website SHALL render those values in the monospace typeface.
4. THE Website SHALL apply annotation and stamp styling to reinforce credibility on Project_Pages.
5. WHERE Reduced_Motion_Mode is active, THE Website SHALL render each Signature_Motif as a static graphic.

### Requirement 20: Motion principles and staggered entry

**User Story:** As a visitor, I want motion that guides without slowing me down, so that I can read at my own pace.

#### Acceptance Criteria

1. THE Motion_System SHALL complete section and element transitions within 400 to 600 milliseconds.
2. WHEN a group of elements enters the Viewport, THE Motion_System SHALL stagger their entry with an offset between 50 and 100 milliseconds and animate them aligning into place rather than uniformly fading.
3. WHILE the visitor scrolls, THE Motion_System SHALL allow scrolling to interrupt in-progress animations.
4. THE Motion_System SHALL scroll the page without scroll-jacking or scroll-locking.

### Requirement 21: Accessibility and reduced motion

**User Story:** As a visitor who prefers reduced motion, I want the site to respect that preference, so that I can use it comfortably.

#### Acceptance Criteria

1. WHEN the visitor's environment requests reduced motion, THE Website SHALL activate Reduced_Motion_Mode.
2. WHILE Reduced_Motion_Mode is active, THE Website SHALL replace parallax, Data_Thread scroll-driven switching, counter, and transition animations with simple fades or static rendering.
3. THE Website SHALL keep all content readable and reachable when Reduced_Motion_Mode is active.

### Requirement 22: Performance and static generation

**User Story:** As a visitor, I want the site to load fast, so that the experience feels immediate and polished.

#### Acceptance Criteria

1. THE Website SHALL be produced through static generation.
2. THE Website SHALL serve statically generated pages for the Homepage and all Project_Pages.
3. THE Website SHALL author Project_Page content in MDX.

### Requirement 23: Responsive and mobile adaptation

**User Story:** As a mobile visitor, I want the site adapted to a small screen with simplified motion, so that it remains readable and performant on a phone.

#### Acceptance Criteria

1. WHILE the Viewport is classified as mobile, THE Website SHALL stack side-by-side layouts vertically.
2. WHILE the Viewport is classified as mobile, THE Website SHALL simplify Motion_System animations relative to the desktop presentation.
3. WHILE the Viewport is classified as mobile, THE Website SHALL preserve readability of all primary content.

### Requirement 24: Deployment to Vercel with custom domain

**User Story:** As Yiheng Liu, I want the site deployed on Vercel with a custom domain, so that I can list a professional URL on my resume with automatic HTTPS and deploys.

#### Acceptance Criteria

1. THE Website SHALL be deployed to the Deployment_Platform (Vercel) from a GitHub repository.
2. THE Deployment_Platform SHALL serve the Website over HTTPS on a custom domain.
3. WHEN a commit is pushed to the connected GitHub repository, THE Deployment_Platform SHALL deploy the updated Website automatically.
4. THE Deployment_Platform SHALL serve the Website through a content delivery network.
