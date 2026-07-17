'use client';

/**
 * Per-project loading animations — each one echoes the project's own domain.
 *
 * - JarvisLoader:   terminal boot log, agents registering line by line
 * - MyHeartLoader:  VAD waveform calibration + UART baud handshake
 * - ArfLoader:      six-layer architecture stacking up from HAL → App
 *
 * All share the "Engineering Editorial · Light" palette (amber on paper,
 * monospace) and call `onComplete` when their sequence finishes. `onComplete`
 * is injected by ProjectPage via cloneElement. Reduced-motion callers skip
 * these entirely (handled by ProjectPage).
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';

interface LoaderProps {
  /** Injected by ProjectPage via cloneElement when the sequence should end. */
  onComplete?: () => void;
}

const shell =
  'fixed inset-0 z-[60] bg-paper flex flex-col items-center justify-center gap-6 px-6';

/* ─────────────────────────────────────────────────────────────
 * Jarvis — terminal boot log
 * ───────────────────────────────────────────────────────────── */
export function JarvisLoader({ onComplete }: LoaderProps) {
  const lines = [
    '$ jarvis --boot',
    'loading agent registry ...',
    '  ├─ nlu.agent          [ok]',
    '  ├─ scheduler.agent    [ok]',
    '  ├─ memory.agent       [ok]',
    '  └─ 15 more            [ok]',
    'priority queue online · 10 workers',
    'P95 target < 200ms · ready',
  ];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= lines.length) {
      const t = setTimeout(() => onComplete?.(), 320);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((n) => n + 1), 130);
    return () => clearTimeout(t);
  }, [shown, lines.length, onComplete]);

  return (
    <motion.div className={shell} exit={{ opacity: 0, transition: { duration: 0.4 } }}>
      <div className="w-full max-w-md font-mono text-xs md:text-sm leading-relaxed">
        {lines.slice(0, shown).map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className={l.includes('[ok]') ? 'text-gray' : 'text-ink'}
          >
            {l.replace('[ok]', '')}
            {l.includes('[ok]') && <span className="text-accent">ok</span>}
          </motion.div>
        ))}
        {shown < lines.length && (
          <motion.span
            className="inline-block w-2 h-4 bg-accent align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * My Heart — VAD waveform calibration + UART handshake
 * ───────────────────────────────────────────────────────────── */
export function MyHeartLoader({ onComplete }: LoaderProps) {
  const { locale } = useLocale();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const dur = 1400;
    let raf: number;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => onComplete?.(), 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  // Build a waveform whose amplitude grows with progress.
  const width = 320;
  const height = 80;
  const mid = height / 2;
  const pts: string[] = [];
  const samples = 64;
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * width;
    const env = Math.sin((i / samples) * Math.PI); // envelope
    const amp = 30 * env * progress;
    const y = mid + Math.sin((i / samples) * Math.PI * 8) * amp;
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return (
    <motion.div className={shell} exit={{ opacity: 0, transition: { duration: 0.4 } }}>
      <svg width={width} height={height} className="overflow-visible">
        <line
          x1="0"
          y1={mid}
          x2={width}
          y2={mid}
          stroke="var(--color-grid)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
        <path d={pts.join(' ')} fill="none" stroke="var(--color-accent)" strokeWidth="2" />
      </svg>
      <div className="font-mono text-xs text-gray tracking-widest uppercase">
        {locale === 'zh' ? 'VAD 校准中' : 'VAD calibrating'} · {Math.round(progress * 9600)} baud
      </div>
      <div className="h-px bg-accent" style={{ width: `${progress * 240}px` }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * ARF — six-layer architecture stacking up
 * ───────────────────────────────────────────────────────────── */
export function ArfLoader({ onComplete }: LoaderProps) {
  const { locale } = useLocale();
  const layers = ['HAL', 'RTS', 'DMS', 'ACR', 'DIL', 'App'];
  const [built, setBuilt] = useState(0);

  useEffect(() => {
    if (built >= layers.length) {
      const t = setTimeout(() => onComplete?.(), 360);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBuilt((n) => n + 1), 160);
    return () => clearTimeout(t);
  }, [built, layers.length, onComplete]);

  return (
    <motion.div className={shell} exit={{ opacity: 0, transition: { duration: 0.4 } }}>
      <div className="flex flex-col-reverse gap-1.5">
        {layers.map((layer, i) => (
          <motion.div
            key={layer}
            initial={{ opacity: 0, y: 12, scaleX: 0.9 }}
            animate={
              i < built
                ? { opacity: 1, y: 0, scaleX: 1 }
                : { opacity: 0, y: 12, scaleX: 0.9 }
            }
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="flex items-center justify-between gap-6 border border-accent/70 px-5 py-2 w-56"
          >
            <span className="font-mono text-sm text-ink font-bold">{layer}</span>
            <span className="font-mono text-[10px] text-accent">L{i}</span>
          </motion.div>
        ))}
      </div>
      <div className="font-mono text-xs text-gray tracking-widest uppercase">
        {locale === 'zh' ? '装配边缘侧' : 'assembling edge-plane'} · {Math.min(built, layers.length)}/6
      </div>
    </motion.div>
  );
}
