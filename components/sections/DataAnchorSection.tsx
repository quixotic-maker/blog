'use client';

import { motion, type Variants } from 'framer-motion';
import { siteContent } from '@/content/site';
import { MechanicalCounter } from '@/components/systems/MechanicalCounter';
import { Bilingual } from '@/components/ui/Bilingual';
import { useReducedMotion } from '@/components/providers/MotionProvider';

/**
 * DataAnchorSection — ~5 headline numbers with bilingual labels, each animated
 * by MechanicalCounter on viewport entry.
 *
 * Layout: the first anchor is featured large (spanning two columns on desktop);
 * the remaining four sit in a tidy grid, so there is never an empty cell.
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 23.1, 23.2
 */
export function DataAnchorSection() {
  const reduced = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  const [featured, ...rest] = siteContent.dataAnchors;

  return (
    <section
      className="relative py-24 px-6 bg-paper"
      aria-labelledby="data-anchors-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Label + rule */}
        <div className="flex items-center gap-4 mb-12">
          <h2
            id="data-anchors-heading"
            className="font-mono text-xs text-gray uppercase tracking-widest whitespace-nowrap"
          >
            <Bilingual content={{ en: 'By the Numbers', zh: '关键数据' }} mode="single" />
          </h2>
          <span className="flex-1 h-px bg-grid" />
        </div>

        <motion.div
          className="border border-grid"
          initial={!reduced ? 'hidden' : undefined}
          whileInView={!reduced ? 'visible' : undefined}
          viewport={{ once: true, amount: 0.2 }}
          variants={!reduced ? container : undefined}
        >
          {/* Featured anchor — full-width banner row */}
          <motion.div
            className="group flex flex-col justify-center gap-4 p-8 md:p-12 bg-paper hover:bg-grid/20 transition-colors duration-300 border-b border-grid"
            variants={!reduced ? item : undefined}
          >
            <div className="flex items-end gap-6 flex-wrap">
              <div className="text-6xl md:text-8xl font-bold text-ink tabular-nums leading-none">
                <MechanicalCounter target={featured.value} suffix={featured.suffix} className="text-inherit" />
              </div>
              <div className="text-base text-gray leading-relaxed max-w-xs mb-2">
                <Bilingual content={featured.label} mode="single" />
              </div>
            </div>
          </motion.div>

          {/* Remaining four anchors — exactly fill a 2×2 / 4-col grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-grid">
            {rest.map((anchor, i) => (
              <motion.div
                key={i}
                className="group flex flex-col gap-3 p-6 md:p-8 bg-paper hover:bg-grid/20 transition-colors duration-300"
                variants={!reduced ? item : undefined}
              >
                <div className="text-3xl md:text-5xl font-bold text-ink tabular-nums leading-none">
                  <MechanicalCounter target={anchor.value} suffix={anchor.suffix} className="text-inherit" />
                </div>
                <span className="block h-px w-8 bg-accent transition-all duration-300 group-hover:w-14" />
                <div className="text-xs text-gray leading-relaxed">
                  <Bilingual content={anchor.label} mode="single" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
