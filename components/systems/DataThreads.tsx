'use client';

import { useEffect, useState } from 'react';
import { useScroll, motion } from 'framer-motion';
import { activeMetrics, type SectionContext } from '@/lib/dataThread';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { resolveMotion } from '@/lib/motion';

/**
 * DataThreads renders the site-wide guiding motif: real project parameters
 * as monospace margin readouts layered on top of the Grid_Motif.
 *
 * Requirements:
 * - Req 6.1: render real project parameters as monospace margin readouts in amber
 * - Req 6.2: swap margin parameters to the active section's real metrics on scroll
 * - Req 6.3: render values in monospace typeface in amber accent color
 * - Req 6.6: render statically without scroll-driven switching animation under reduced motion
 *
 * The component observes global scroll progress and determines the current
 * section context, then calls `activeMetrics(sectionContext)` from lib/dataThread.ts
 * to get the metric set for the active section.
 */

export function DataThreads() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [currentContext, setCurrentContext] = useState<SectionContext>('baseline');
  const [metrics, setMetrics] = useState<readonly string[]>(activeMetrics('baseline'));

  // Determine section context based on scroll progress
  // This is a simplified mapping - in a real implementation you'd use
  // Intersection Observer or measure actual section positions
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      let newContext: SectionContext = 'baseline';

      // Map scroll progress to section contexts
      // These thresholds should align with actual section positions
      if (progress >= 0.25 && progress < 0.45) {
        newContext = 'jarvis';
      } else if (progress >= 0.45 && progress < 0.65) {
        newContext = 'my-heart';
      } else if (progress >= 0.65 && progress < 0.85) {
        newContext = 'arf';
      }

      if (newContext !== currentContext) {
        setCurrentContext(newContext);
        setMetrics(activeMetrics(newContext));
      }
    });

    return unsubscribe;
  }, [scrollYProgress, currentContext]);

  const motionConfig = resolveMotion('dataThread', reducedMotion);

  // Position metrics in margins (similar to coordinate readouts)
  // Distribute them vertically with spacing
  return (
    <div className="pointer-events-none fixed inset-0 z-10" aria-hidden="true">
      {/* Left margin readouts */}
      <div className="absolute left-4 top-1/4 flex flex-col gap-8">
        {metrics.slice(0, Math.ceil(metrics.length / 2)).map((metric, index) => (
          <MetricReadout
            key={`left-${metric}`}
            metric={metric}
            index={index}
            motionConfig={motionConfig}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      {/* Right margin readouts */}
      <div className="absolute right-4 top-1/3 flex flex-col gap-8">
        {metrics.slice(Math.ceil(metrics.length / 2)).map((metric, index) => (
          <MetricReadout
            key={`right-${metric}`}
            metric={metric}
            index={index + Math.ceil(metrics.length / 2)}
            motionConfig={motionConfig}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

interface MetricReadoutProps {
  metric: string;
  index: number;
  motionConfig: ReturnType<typeof resolveMotion>;
  reducedMotion: boolean;
}

function MetricReadout({ metric, index, motionConfig, reducedMotion }: MetricReadoutProps) {
  if (reducedMotion || motionConfig.kind === 'static') {
    // Render statically without animation (Req 6.6)
    return (
      <div
        className="font-mono text-sm"
        style={{ color: 'var(--color-accent)' }}
      >
        {metric}
      </div>
    );
  }

  // Animated version with staggered fade when metrics switch
  return (
    <motion.div
      key={metric}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{
        duration: motionConfig.durationMs / 1000,
        delay: motionConfig.staggerMs ? (index * motionConfig.staggerMs) / 1000 : 0,
        ease: 'easeOut',
      }}
      className="font-mono text-sm"
      style={{ color: 'var(--color-accent)' }}
    >
      {metric}
    </motion.div>
  );
}
