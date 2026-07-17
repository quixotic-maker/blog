// Ordered Chapter_Transition phrases (design: "Homepage Sections",
// Req 6.4, 6.5). These bilingual phrases are interleaved between Homepage
// sections in a fixed sequence to narrate the arc from semantic understanding
// (Hero) → agent orchestration (Jarvis) → driving the physical world
// (My Heart) → unifying all robots (ARF).
//
// The array order IS the required display order; consumers render the phrases
// in sequence without re-sorting.

import type { ChapterPhrase } from '@/lib/contentSchema';

/**
 * The four Chapter_Transition phrases in required order:
 * Hero → Jarvis → My Heart → ARF (Req 6.5).
 */
export const chapters: ChapterPhrase[] = [
  {
    zh: '从理解语义开始…',
    en: 'It begins with understanding meaning…',
  },
  {
    zh: '…到调度智能体…',
    en: '…to orchestrating intelligent agents…',
  },
  {
    zh: '…再到驱动物理世界…',
    en: '…then to driving the physical world…',
  },
  {
    zh: '…最终，统一所有机器人。',
    en: '…and finally, unifying all robots.',
  },
];
