'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { useMotionContext } from '@/components/providers/MotionProvider';
import { siteContent } from '@/content/site';
import { resolveContent } from '@/lib/locale';
import { motion, type Variants } from 'framer-motion';
import { SystemDiagram } from './SystemDiagram';

/**
 * HeroSection renders the first Homepage section: the AI PM positioning
 * statement, the full-stack capability statement, and the SystemDiagram.
 *
 * Motion: a refined mask-reveal entry — each line rises from below a clipping
 * container with an easeOutExpo-style curve, staggered for editorial rhythm.
 * Under reduced motion everything renders statically (Req 21.2).
 *
 * Requirements: 1.1, 1.2, 10.1, 10.2, 10.3, 21.2, 23.2, 23.3
 */
export function HeroSection() {
  const { locale } = useLocale();
  const { prefersReducedMotion } = useMotionContext();

  const positioning = resolveContent(siteContent.hero.positioning, locale);
  const capability = resolveContent(siteContent.hero.capability, locale);
  const subtitle = resolveContent(siteContent.hero.subtitle, locale);

  // Editorial easing (easeOutExpo-ish) for a confident settle.
  const ease = [0.16, 1, 0.3, 1] as const;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  // Each line lives inside an overflow-hidden mask and rises into view.
  const line: Variants = {
    hidden: { y: '110%' },
    visible: {
      y: '0%',
      transition: { duration: 0.9, ease },
    },
  };

  const fade: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  };

  // Reduced motion: skip transforms, render immediately.
  if (prefersReducedMotion) {
    return (
      <section
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 md:py-24 bg-paper"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-5xl w-full">
          <p className="font-mono text-xs text-gray uppercase tracking-widest mb-6 md:mb-8">
            {subtitle}
          </p>
          <h1
            id="hero-heading"
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-ink leading-tight mb-8 md:mb-12"
          >
            {positioning}
          </h1>
          <p className="font-body text-xl md:text-2xl text-gray leading-relaxed mb-12 md:mb-16 max-w-3xl">
            {capability}
          </p>
          <SystemDiagram />
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 md:py-24 bg-paper"
      aria-labelledby="hero-heading"
    >
      <motion.div
        className="max-w-5xl w-full"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* Subtitle */}
        <div className="overflow-hidden mb-6 md:mb-8">
          <motion.p
            variants={line}
            className="font-mono text-xs text-gray uppercase tracking-widest"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Positioning statement — mask reveal (Req 1.1, 10.1) */}
        <div className="overflow-hidden mb-8 md:mb-12 pb-2">
          <motion.h1
            id="hero-heading"
            variants={line}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-ink leading-tight"
          >
            {positioning}
          </motion.h1>
        </div>

        {/* Capability statement (Req 1.2) */}
        <motion.p
          variants={fade}
          className="font-body text-xl md:text-2xl text-gray leading-relaxed mb-12 md:mb-16 max-w-3xl"
        >
          {capability}
        </motion.p>

        {/* SystemDiagram (Req 10.2, 10.3) */}
        <motion.div variants={fade}>
          <SystemDiagram />
        </motion.div>
      </motion.div>
    </section>
  );
}
