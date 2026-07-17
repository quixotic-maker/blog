'use client';

import { motion, type Variants } from 'framer-motion';
import { siteContent } from '@/content/site';
import { Bilingual } from '@/components/ui/Bilingual';
import { useReducedMotion } from '@/components/providers/MotionProvider';

const ENTRIES = [
  { key: 'vibecoding',        labelEn: 'Vibecoding',         content: (s: typeof siteContent) => s.philosophy.vibecoding },
  { key: 'aiNative',          labelEn: 'AI-Native',          content: (s: typeof siteContent) => s.philosophy.aiNative },
  { key: 'breathingRoom',     labelEn: 'Breathing Room',     content: (s: typeof siteContent) => s.philosophy.breathingRoom },
  { key: 'skillRedefinition', labelEn: 'Skill Redefinition', content: (s: typeof siteContent) => s.philosophy.skillRedefinition },
] as const;

/**
 * PhilosophySection — four product philosophy cards.
 * Requirements: 16.1–16.4, 23.1, 23.2
 */
export function PhilosophySection() {
  const reduced = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09 } },
  };

  const card: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
  };

  return (
    <section
      className="relative py-24 px-6 bg-paper"
      aria-labelledby="philosophy-heading"
    >
      <div className="max-w-7xl mx-auto">

        {/* Label + rule */}
        <div className="flex items-center gap-4 mb-12">
          <h2 id="philosophy-heading" className="font-mono text-xs text-gray uppercase tracking-widest whitespace-nowrap">
            <Bilingual content={{ en: 'Philosophy', zh: '产品哲学' }} mode="single" />
          </h2>
          <span className="flex-1 h-px bg-grid" />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-grid border border-grid"
          initial={!reduced ? 'hidden' : undefined}
          whileInView={!reduced ? 'visible' : undefined}
          viewport={{ once: true, amount: 0.2 }}
          variants={!reduced ? container : undefined}
        >
          {ENTRIES.map((entry, i) => (
            <motion.div
              key={entry.key}
              className="group flex flex-col gap-4 p-8 md:p-10 bg-paper hover:bg-grid/20 transition-colors duration-300"
              variants={!reduced ? card : undefined}
            >
              {/* Entry index + label */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-accent tracking-widest">0{i + 1}</span>
                <span className="font-mono text-xs text-gray uppercase tracking-wider">{entry.labelEn}</span>
              </div>

              {/* Content */}
              <p className="text-sm md:text-base text-ink leading-relaxed">
                <Bilingual content={entry.content(siteContent)} mode="single" />
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
