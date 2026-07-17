/**
 * ExplodedViewMotif — exploded-view assembly diagram for the ARF project.
 *
 * Renders ARF's six-layer edge-plane architecture as a centered stack of
 * plates. Layer name sits centered inside each plate; the layer index (L0–L5)
 * sits inside the plate near the right edge so nothing is ever clipped. Plates
 * fade/rise into place on entry and breathe subtly under normal motion; under
 * reduced motion everything renders statically (Req 19.2, 19.3, 19.5).
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/providers/MotionProvider';

export interface ExplodedViewMotifProps {
  className?: string;
}

interface Layer {
  id: string;
  label: string;
  index: string;
  desc: string;
}

/** Bottom (HAL) → top (App). Rendered bottom-up. */
const ARF_LAYERS: Layer[] = [
  { id: 'hal', label: 'HAL', index: 'L0', desc: 'Hardware Abstraction' },
  { id: 'rts', label: 'RTS', index: 'L1', desc: 'Real-Time Scheduling' },
  { id: 'dms', label: 'DMS', index: 'L2', desc: 'Data Management' },
  { id: 'acr', label: 'ACR', index: 'L3', desc: 'Algorithm Container' },
  { id: 'dil', label: 'DIL', index: 'L4', desc: 'Decision Intelligence' },
  { id: 'app', label: 'App', index: 'L5', desc: 'Application Layer' },
];

// Plate widths narrow as they go up, keeping the centered "exploded" look.
const WIDTHS = [92, 86, 80, 74, 68, 62]; // % of container, index 0 = HAL (bottom)

export function ExplodedViewMotif({ className = '' }: ExplodedViewMotifProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`relative ${className}`}>
      <div className="relative bg-paper border border-grid rounded-sm px-4 py-10 md:px-10 overflow-hidden">
        {/* Center assembly axis */}
        <div
          className="pointer-events-none absolute top-6 bottom-6 left-1/2 -translate-x-1/2 border-l border-dashed border-grid"
          aria-hidden
        />

        {/* Plates, top (App) to bottom (HAL) */}
        <div className="relative flex flex-col items-center gap-2.5">
          {[...ARF_LAYERS].reverse().map((layer, i) => {
            // reversed index: 0 = App (top). Map back to width array.
            const originalIdx = ARF_LAYERS.length - 1 - i;
            const w = WIDTHS[originalIdx];

            return (
              <motion.div
                key={layer.id}
                className="relative flex items-center border-2 border-accent/80 bg-paper"
                style={{ width: `${w}%`, height: 52 }}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={reduced ? undefined : { scale: 1.015 }}
              >
                {/* Layer name — centered */}
                <span className="absolute left-1/2 -translate-x-1/2 font-mono text-base font-bold text-ink">
                  {layer.label}
                </span>

                {/* Description — left, hidden on small plates/screens */}
                <span className="hidden md:block pl-5 font-mono text-xs text-gray truncate">
                  {layer.desc}
                </span>

                {/* Layer index — inside, right edge */}
                <span className="absolute right-4 font-mono text-xs text-accent">
                  {layer.index}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Caption */}
      <p className="mt-3 text-xs text-gray font-mono text-center tracking-wide">
        ARF Edge-Plane · six-layer assembly (HAL → App)
      </p>
    </div>
  );
}
