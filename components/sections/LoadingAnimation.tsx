'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { resolveMotion } from '@/lib/motion';
import { activeMetrics } from '@/lib/dataThread';
import { counterValue } from '@/lib/counter';

/**
 * LoadingAnimation establishes the coordinate Grid_Motif and then rapidly
 * counts/calibrates the key real Data_Thread parameters from initial to final
 * values with a mechanical odometer feel (line-scan / calibration style, NOT
 * a spinner).
 *
 * Requirements:
 * - Req 4.1: display before Homepage content is revealed on first load
 * - Req 4.2: establish the coordinate Grid_Motif and then rapidly count the
 *   key real Data_Thread parameters as they calibrate from initial to final
 *   values with a mechanical odometer feel
 * - Req 4.3: use a line-scan or calibration style rather than a rotating spinner
 * - Req 4.4: render the amber accent color on the off-white paper background
 * - Req 4.5: complete within 800-1200ms
 * - Req 4.6: reveal the Hero_Section content on completion
 * - Req 4.7: exclude AI-aesthetic elements (pulsing glowing dots, shimmer
 *   skeletons, gradient progress rings, breathing glow orbs)
 * - Req 4.8: degrade to a simple fade under reduced motion
 * - Req 9.1, 9.2, 9.3: consistent with anti-AI-aesthetic constraint
 */

interface LoadingAnimationProps {
  /** Callback fired when the loading animation completes */
  onComplete: () => void;
}

export function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const reducedMotion = useReducedMotion();
  const motionConfig = resolveMotion('loading', reducedMotion);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-complete after the configured duration
    const timer = setTimeout(() => {
      setVisible(false);
      // Allow exit animation to complete before calling onComplete
      setTimeout(onComplete, reducedMotion ? 300 : 400);
    }, motionConfig.durationMs);

    return () => clearTimeout(timer);
  }, [motionConfig.durationMs, onComplete, reducedMotion]);

  // Reduced motion: simple fade (Req 4.8)
  if (reducedMotion) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-paper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="font-mono text-accent">Loading...</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Full animation: Grid establishment + calibration sequence
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 bg-paper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CalibrationSequence duration={motionConfig.durationMs} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * CalibrationSequence implements the line-scan/calibration style animation:
 * 1. First establishes the coordinate Grid_Motif (shows the baseline grid)
 * 2. Then rapidly counts/calibrates the key real Data_Thread parameters
 *    from initial to final values with a mechanical odometer feel
 *
 * Styled amber on off-white paper, NO AI-aesthetic elements.
 */
interface CalibrationSequenceProps {
  duration: number;
}

function CalibrationSequence({ duration }: CalibrationSequenceProps) {
  const [progress, setProgress] = useState(0);
  const baselineMetrics = activeMetrics('baseline');

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [duration]);

  // Grid establishment phase: first 30% of duration
  const gridPhase = Math.min(progress / 0.3, 1);
  
  // Calibration phase: remaining 70% of duration
  const calibrationPhase = progress > 0.3 ? (progress - 0.3) / 0.7 : 0;

  return (
    <div className="relative h-full w-full">
      {/* Step 1: Establish the coordinate Grid_Motif */}
      <GridEstablishment opacity={gridPhase} />

      {/* Step 2: Calibrate the key real Data_Thread parameters */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-4">
          {/* Coordinate system label */}
          <motion.div
            className="font-mono text-xs text-gray uppercase tracking-wider text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: gridPhase }}
            transition={{ duration: 0.3 }}
          >
            System Calibration
          </motion.div>

          {/* Calibration readouts - line-scan style */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-3">
            {baselineMetrics.map((metric, index) => (
              <CalibrationReadout
                key={metric}
                metric={metric}
                progress={calibrationPhase}
                delay={index * 0.08}
              />
            ))}
          </div>

          {/* Calibration progress indicator - horizontal line scan */}
          <motion.div
            className="mt-8 h-px bg-accent/30 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: progress > 0.3 ? '240px' : 0 }}
            transition={{ duration: duration * 0.0007, ease: 'linear' }}
          />
          
          {/* Completion indicator */}
          {calibrationPhase >= 0.95 && (
            <motion.div
              className="font-mono text-xs text-accent text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              ✓ Ready
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * GridEstablishment shows the coordinate grid being established.
 * Renders horizontal baseline grid lines in a line-scan reveal pattern.
 */
interface GridEstablishmentProps {
  opacity: number;
}

function GridEstablishment({ opacity }: GridEstablishmentProps) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity }}
    >
      {/* Baseline grid - matches GridStage pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent calc(1.5rem - 1px),
            var(--color-grid) calc(1.5rem - 1px),
            var(--color-grid) 1.5rem
          )`,
        }}
      />
      
      {/* Corner coordinate markers */}
      <div className="absolute top-4 left-4 font-mono text-xs text-grid">
        [0,0]
      </div>
      <div className="absolute top-4 right-4 font-mono text-xs text-grid">
        [100,0]
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-xs text-grid">
        [0,100]
      </div>
    </motion.div>
  );
}

/**
 * CalibrationReadout shows a single metric calibrating from initial to final
 * value with a mechanical odometer feel. This is the line-scan/calibration
 * style (NOT a spinner).
 */
interface CalibrationReadoutProps {
  metric: string;
  progress: number;
  delay: number;
}

function CalibrationReadout({ metric, progress, delay }: CalibrationReadoutProps) {
  // Stagger the calibration start for each metric
  const adjustedProgress = Math.max(0, Math.min((progress - delay) / (1 - delay), 1));
  
  // Parse numeric value from metric string if present
  const numericMatch = metric.match(/\d+/);
  const hasNumeric = numericMatch !== null;
  
  if (!hasNumeric) {
    // Non-numeric metrics just fade in
    return (
      <motion.div
        className="font-mono text-sm text-accent tabular-nums"
        style={{ opacity: adjustedProgress }}
      >
        {metric}
      </motion.div>
    );
  }

  // Numeric metrics count up using counterValue for mechanical feel
  const targetValue = parseInt(numericMatch[0], 10);
  const currentValue = Math.round(counterValue(targetValue, adjustedProgress));
  const displayMetric = metric.replace(/\d+/, currentValue.toString());

  return (
    <motion.div
      className="font-mono text-sm text-accent tabular-nums"
      initial={{ opacity: 0, x: -4 }}
      animate={{ 
        opacity: adjustedProgress > 0 ? 1 : 0,
        x: adjustedProgress > 0 ? 0 : -4,
      }}
      transition={{ duration: 0.2 }}
    >
      {displayMetric}
      {adjustedProgress < 1 && (
        <span className="inline-block w-2 ml-1 animate-pulse">_</span>
      )}
    </motion.div>
  );
}
