// Per-project card/preview metadata (design: "Project Metadata & MDX",
// Data Models → ProjectMeta). Drives the three Homepage Project_Card previews,
// the shared-element navigation to each Project_Page, and the signature-motif
// assignment (Req 2.2, 2.6, 19.1, 19.2).
//
// Preview metrics use the site's real technical parameters, consistent with the
// Data_Thread metric set in `lib/dataThread.ts`: Jarvis → P95<200ms / 18 agents;
// My Heart → 9600 baud / H90,V120; ARF → 1kHz / jitter<100μs.

import type { ProjectMeta } from '@/lib/contentSchema';

/**
 * The three documented projects in Homepage order (01 → 03), each with route,
 * bilingual name/tagline, tech tags, ≥2 real preview metrics, and (for My Heart
 * and ARF) its signature motif.
 */
export const projectsMeta: ProjectMeta[] = [
  {
    id: 'jarvis',
    route: '/work/jarvis',
    index: '01',
    name: {
      zh: 'Jarvis',
      en: 'Jarvis',
    },
    tagline: {
      zh: '解耦大模型语义与任务执行的多智能体协同中枢',
      en: 'A multi-agent hub decoupling LLM semantics from task execution',
    },
    techTags: [
      'Python 3.11 asyncio',
      'FastAPI',
      'PostgreSQL JSONB',
      'Redis',
      'Prometheus',
      'Docker',
    ],
    previewMetrics: [
      {
        value: 'P95<200ms',
        label: { zh: 'P95 延迟目标', en: 'P95 latency target' },
      },
      {
        value: '18 agents',
        label: { zh: '领域智能体', en: 'Domain agents' },
      },
    ],
    // Jarvis has no signature motif (Req 19 assigns motifs to My Heart / ARF).
  },
  {
    id: 'my-heart',
    route: '/work/my-heart',
    index: '02',
    name: {
      zh: 'My Heart / Mochi',
      en: 'My Heart / Mochi',
    },
    tagline: {
      zh: '端侧「语音到动作」闭环的具身交互产品',
      en: 'An end-side voice-to-action closed-loop embodied interaction product',
    },
    techTags: [
      'Whisper ASR',
      'OpenAI-compatible LLM',
      'Edge TTS',
      'Arduino Nano',
      'SG90 · UART',
      'PyAudio · NumPy',
    ],
    previewMetrics: [
      {
        value: '9600 baud',
        label: { zh: 'UART 波特率', en: 'UART baud rate' },
      },
      {
        value: 'H90,V120',
        label: { zh: '双自由度指令', en: 'Dual-DOF command' },
      },
    ],
    signatureMotif: 'oscilloscope',
  },
  {
    id: 'arf',
    route: '/work/arf',
    index: '03',
    name: {
      zh: 'ARF / Ares Robotics Framework',
      en: 'ARF / Ares Robotics Framework',
    },
    tagline: {
      zh: '云边协同的通用机器人操作系统',
      en: 'A universal robot OS with a cloud-edge collaborative architecture',
    },
    techTags: [
      'PREEMPT_RT',
      'Rust / C++ HAL',
      'gRPC · ZeroMQ',
      'Go · Python DAG',
      'py_trees · PyTorch',
      'KubeEdge · Ray',
    ],
    previewMetrics: [
      {
        value: '1kHz',
        label: { zh: '实时调度频率', en: 'Real-time scheduling rate' },
      },
      {
        value: 'jitter<100μs',
        label: { zh: '调度抖动', en: 'Scheduling jitter' },
      },
    ],
    signatureMotif: 'exploded-view',
  },
];
