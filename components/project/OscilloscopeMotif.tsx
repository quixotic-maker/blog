/**
 * OscilloscopeMotif — matte oscilloscope/waveform motif for My Heart project.
 *
 * This component renders a matte oscilloscope/waveform graphic representing
 * VAD/RMS energy detection, with numeric values displayed in monospace.
 * The waveform animates under normal motion, and renders statically when
 * reduced motion is active.
 *
 * Requirements:
 * - Req 19.1: present matte oscilloscope/waveform motif for My Heart (VAD/RMS)
 * - Req 19.3: render numeric values in monospace typeface
 * - Req 19.5: render as static graphic under reduced motion
 *
 * Task 14.2: Implement OscilloscopeMotif (My Heart) and ExplodedViewMotif (ARF)
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/providers/MotionProvider';
import { useMemo } from 'react';

export interface OscilloscopeMotifProps {
  /**
   * RMS energy level value (e.g., "0.45")
   */
  rmsValue?: string;

  /**
   * Sampling rate (e.g., "16kHz")
   */
  sampleRate?: string;

  /**
   * Optional className for additional styling
   */
  className?: string;

  /**
   * Width of the oscilloscope display (default: 600)
   */
  width?: number;

  /**
   * Height of the oscilloscope display (default: 200)
   */
  height?: number;
}

/**
 * Generate waveform path data for the oscilloscope.
 * Creates a simple sine-like waveform that represents VAD/RMS energy.
 */
function generateWaveformPath(
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  phase: number = 0
): string {
  const points: string[] = [];
  const centerY = height / 2;
  const samples = 100;

  for (let i = 0; i <= samples; i++) {
    // Use fixed precision to ensure SSR/client consistency
    const x = Number(((i / samples) * width).toFixed(2));
    const t = (i / samples) * frequency * Math.PI * 2 + phase;
    const y = Number((centerY + Math.sin(t) * amplitude).toFixed(2));
    points.push(i === 0 ? `M ${x},${y}` : `L ${x},${y}`);
  }

  return points.join(' ');
}

/**
 * OscilloscopeMotif displays a matte oscilloscope/waveform graphic for the
 * My Heart project, representing VAD/RMS energy detection. Numeric values
 * are rendered in monospace, and the waveform oscillates under normal motion
 * but renders statically under reduced motion.
 */
export function OscilloscopeMotif({
  rmsValue = '0.45',
  sampleRate = '16kHz',
  className = '',
  width = 600,
  height = 200,
}: OscilloscopeMotifProps) {
  const reducedMotion = useReducedMotion();

  // Generate three waveform paths with different frequencies for visual interest
  const waveforms = useMemo(() => {
    return [
      { amplitude: 40, frequency: 2, opacity: 0.8 },
      { amplitude: 25, frequency: 3, opacity: 0.5 },
      { amplitude: 15, frequency: 5, opacity: 0.3 },
    ];
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Oscilloscope container with matte background */}
      <div className="relative bg-paper border-2 border-grid rounded-sm overflow-hidden">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          aria-label="Oscilloscope waveform showing VAD/RMS energy detection"
        >
          {/* Grid lines for oscilloscope background */}
          <defs>
            <pattern
              id="osc-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="var(--color-grid)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          {/* Background grid */}
          <rect
            width={width}
            height={height}
            fill="url(#osc-grid)"
          />

          {/* Center horizontal reference line */}
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="var(--color-grid)"
            strokeWidth="1"
            strokeDasharray="5,5"
          />

          {/* Waveform paths */}
          {waveforms.map((waveform, index) => {
            const pathData = generateWaveformPath(
              width,
              height,
              waveform.amplitude,
              waveform.frequency,
              0
            );

            return reducedMotion ? (
              // Static waveform under reduced motion (Req 19.5)
              <path
                key={index}
                d={pathData}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                opacity={waveform.opacity}
              />
            ) : (
              // Animated waveform under normal motion
              <motion.path
                key={index}
                d={pathData}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                opacity={waveform.opacity}
                animate={{
                  d: [
                    pathData,
                    generateWaveformPath(
                      width,
                      height,
                      waveform.amplitude,
                      waveform.frequency,
                      Math.PI / 4
                    ),
                    generateWaveformPath(
                      width,
                      height,
                      waveform.amplitude,
                      waveform.frequency,
                      Math.PI / 2
                    ),
                    pathData,
                  ],
                }}
                transition={{
                  duration: 2 + index * 0.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            );
          })}
        </svg>

        {/* Numeric readouts in monospace (Req 19.3) */}
        <div className="absolute bottom-2 left-2 font-mono text-xs text-accent">
          <div className="flex gap-4">
            <span>RMS: {rmsValue}</span>
            <span>|</span>
            <span>RATE: {sampleRate}</span>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-2 text-xs text-gray font-mono text-center">
        VAD/RMS Energy Detection Waveform
      </div>
    </div>
  );
}
