'use client';

import { motion, type Variants } from 'framer-motion';
import { siteContent } from '@/content/site';
import { Bilingual } from '@/components/ui/Bilingual';
import { useReducedMotion } from '@/components/providers/MotionProvider';

/**
 * ExperienceSection — parallel, equal-weight peer entries (no timeline).
 * Requirements: 15.1, 15.2, 15.3, 23.1, 23.2
 */
export function ExperienceSection() {
  const reduced = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const card: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };

  return (
    <section
      className="relative py-24 px-6 bg-paper"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto">

        {/* Label + rule */}
        <div className="flex items-center gap-4 mb-12">
          <h2 id="experience-heading" className="font-mono text-xs text-gray uppercase tracking-widest whitespace-nowrap">
            <Bilingual content={{ en: 'Experience', zh: '经历' }} mode="single" />
          </h2>
          <span className="flex-1 h-px bg-grid" />
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-grid border border-grid"
          initial={!reduced ? 'hidden' : undefined}
          whileInView={!reduced ? 'visible' : undefined}
          viewport={{ once: true, amount: 0.25 }}
          variants={!reduced ? container : undefined}
        >
          {siteContent.experience.map((entry, i) => (
            <motion.div
              key={i}
              className="group flex flex-col gap-5 p-8 md:p-10 bg-paper hover:bg-grid/20 transition-colors duration-300"
              variants={!reduced ? card : undefined}
            >
              {/* Accent dot */}
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />

              {/* Title */}
              <h3 className="font-display text-xl md:text-2xl font-bold text-ink leading-snug">
                <Bilingual content={entry.title} mode="single" />
              </h3>

              {/* Detail */}
              <p className="text-sm md:text-base text-gray leading-relaxed">
                <Bilingual content={entry.detail} mode="single" />
              </p>

              {/* Bottom rule that expands on hover */}
              <span className="mt-auto block h-px w-8 bg-accent transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
