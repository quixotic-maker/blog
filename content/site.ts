// Bilingual Homepage content (design: "Bilingual Content Model").
//
// This module is the single source of truth for the typed `SiteContent` the
// Homepage sections consume. Every primary entry is authored in both Chinese
// and English so it can switch consistently site-wide (Req 3.1). The tone is
// calm and precise, arguing through facts and architecture decisions (Req 1.4);
// it excludes any One Person Company (OPC) emphasis (Req 1.3) and the hype
// terms "颠覆", "革命性", "最", and "唯一" (Req 1.5).
//
// The `chapters` field is populated inline here (the ordered Chapter_Transition
// phrases) so the Homepage has a complete `SiteContent` contract without a
// separate import.

import type { SiteContent } from '../lib/contentSchema';

/** The full bilingual Homepage content contract. */
export const siteContent: SiteContent = {
  // Branding: the lowercase wordmark is the brand name / tab title (Req 1.6–1.8),
  // the tagline is the sub-positioning line (Req 1.9), and the signature is the
  // footer sign-off — the only place the real name appears (Req 17.1).
  branding: {
    wordmark: 'quixoticmaker',
    tagline: {
      en: 'AI PM · Hardware-AI Integration',
      zh: '软硬一体 · 多智能体协同',
    },
    signature: 'quixoticmaker — Yiheng Liu',
  },

  // Hero: positioning as an AI Product Manager for hardware-AI integration and
  // multi-agent coordination (Req 1.1), plus the full-stack capability statement
  // spanning algorithm boundaries → hardware protocols → user experience (Req 1.2).
  hero: {
    positioning: {
      en: 'AI Product Manager for hardware-AI integration and multi-agent coordination.',
      zh: 'AI 产品经理，专注软硬一体与多智能体协同。',
    },
    capability: {
      en: 'I define products full-stack: from the boundaries of the underlying algorithms, through hardware and communication protocols, up to the top-level user experience.',
      zh: '我做全栈式的产品定义：从底层算法的能力边界，到硬件与通信协议，再到顶层的用户体验。',
    },
    subtitle: {
      en: 'From understanding semantics to driving the physical world.',
      zh: '从理解语义，到驱动物理世界。',
    },
  },

  // Data anchors: five headline numbers drawn from real project metrics
  // (Req 11.1), each with a bilingual label (Req 11.3). Values are rendered by
  // the MechanicalCounter; non-numeric context lives in the suffix/label.
  dataAnchors: [
    {
      value: 18,
      label: {
        en: 'domain agents coordinated',
        zh: '协同调度的领域智能体',
      },
    },
    {
      value: 200,
      suffix: 'ms P95',
      label: {
        en: 'task scheduling latency target (P95 < 200ms)',
        zh: '任务调度延迟目标（P95 < 200ms）',
      },
    },
    {
      value: 1,
      suffix: 'kHz',
      label: {
        en: 'real-time scheduling loop on PREEMPT_RT',
        zh: 'PREEMPT_RT 上的实时调度频率',
      },
    },
    {
      value: 100,
      suffix: 'μs',
      label: {
        en: 'scheduling jitter bound (jitter < 100μs)',
        zh: '调度抖动上界（jitter < 100μs）',
      },
    },
    {
      value: 9600,
      suffix: 'baud',
      label: {
        en: 'UART link driving the servos',
        zh: '驱动舵机的 UART 链路波特率',
      },
    },
  ],

  // Experience: parallel, equal-weight peer items with no time axis (Req 15).
  experience: [
    {
      title: {
        en: 'Algorithm Intern · Beijing Academy of Artificial Intelligence (BAAI)',
        zh: '算法实习生 · 北京智源人工智能研究院（BAAI）',
      },
      detail: {
        en: 'Built a grounded understanding of the capability boundaries of large language models, and made core contributions to the Robocoin and RoboxStudio projects.',
        zh: '扎实理解大语言模型的能力边界，并在 Robocoin 与 RoboxStudio 项目中做出核心贡献。',
      },
    },
    {
      title: {
        en: 'Team Lead · Innovation & Entrepreneurship Competitions',
        zh: '队长 · 创新创业竞赛',
      },
      detail: {
        en: 'Led the team for the 创赛挑杯 innovation and entrepreneurship competitions and for Robocon, owning direction, coordination, and delivery.',
        zh: '带队参加创赛挑杯创新创业竞赛与 Robocon，负责方向把控、团队协同与最终交付。',
      },
    },
  ],

  // Philosophy: the four articulated principles (Req 16.1–16.4).
  philosophy: {
    vibecoding: {
      en: 'Vibecoding — agile development driven by high-level aesthetic direction and AI-assisted generation, where taste sets the direction and generation fills in the detail.',
      zh: 'Vibecoding —— 由高层审美方向与 AI 辅助生成驱动的敏捷开发：审美决定方向，生成负责细节。',
    },
    aiNative: {
      en: 'AI-Native design, Agentic UX, and Generative UI — interfaces designed around agents that act on intent and surfaces generated to fit the moment.',
      zh: 'AI-Native 设计、Agentic UX 与 Generative UI —— 围绕能够依意图行动的智能体来设计界面，并按当下情境即时生成呈现。',
    },
    breathingRoom: {
      en: '"Breathing Room" — an essential product quality; whitespace, pacing, and restraint are features, not leftover space.',
      zh: '“留白” —— 一种必要的产品品质：空间、节奏与克制本身就是功能，而非多余的空白。',
    },
    skillRedefinition: {
      en: 'Redefining "Skill" — a skill is a capability a frontier AI agent possesses, not a traditional worker\'s professional craft.',
      zh: '重新定义“技能” —— 技能是前沿 AI Agent 所具备的能力，而非传统工种的职业手艺。',
    },
  },

  // Footer: signature sign-off (Req 17.1), AI PM positioning (Req 17.2), and
  // GitHub / LinkedIn / Email contact links (Req 17.3).
  footer: {
    signature: 'quixoticmaker — Yiheng Liu',
    positioning: {
      en: 'AI Product Manager · Hardware-AI Integration & Multi-Agent Coordination',
      zh: 'AI 产品经理 · 软硬一体与多智能体协同',
    },
    links: [
      { kind: 'github', href: 'https://github.com/quixotic-maker' },
      { kind: 'email', href: 'mailto:quixoticmaker@163.com' },
    ],
  },

  // Chapter_Transition phrases in the fixed ordered sequence (Req 6.5):
  // Hero → Jarvis → My Heart → ARF.
  chapters: [
    { zh: '从理解语义开始…', en: 'It begins with understanding semantics…' },
    { zh: '…到调度智能体…', en: '…to orchestrating agents…' },
    { zh: '…再到驱动物理世界…', en: '…then to driving the physical world…' },
    { zh: '最终，统一所有机器人。', en: 'And finally, to unifying every robot.' },
  ],
};

export default siteContent;
