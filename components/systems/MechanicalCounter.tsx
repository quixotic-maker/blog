'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { counterValue } from '@/lib/counter';
import { useReducedMotion } from '@/components/providers/MotionProvider';

/**
 * MechanicalCounter renders an odometer-style counter that counts up to a
 * target value when it scrolls into view.
 *
 * Requirements:
 * - Req 11.2: monospace digits
 * - Req 11.4: counterValue(target, progress) interpolation
 * - Req 11.5: reduced motion → render target immediately as static text
 */

interface MechanicalCounterProps {
  target: number;
  suffix?: string;
  className?: string;
}

export function MechanicalCounter({
  target,
  suffix = '',
  className = '',
}: MechanicalCounterProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // Trigger only once the counter is well inside the viewport:
  // the bottom 15% of the screen is treated as "not yet entered", so the
  // count-up starts when the number is genuinely on screen — not on page load.
  const isInView = useInView(ref, {
    once: true,
    margin: '0px 0px -15% 0px',
  });
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  // Count-up runs at 2s so the odometer effect reads clearly.
  const duration = 2;

  useEffect(() => {
    // Reduced motion: jump straight to the final value.
    if (reducedMotion) {
      setDisplay(target);
      return;
    }

    if (isInView && !started.current) {
      started.current = true;
      const controls = animate(0, 1, {
        duration,
        ease: 'easeOut',
        onUpdate: (p) => setDisplay(Math.round(counterValue(target, p))),
      });
      return () => controls.stop();
    }
  }, [isInView, reducedMotion, target, duration]);

  return (
    <span ref={ref} className={`font-mono tabular-nums ${className}`}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
