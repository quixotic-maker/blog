/**
 * Example usage of OscilloscopeMotif component.
 *
 * This example demonstrates how to use the OscilloscopeMotif in the My Heart
 * project page to display VAD/RMS energy detection waveform.
 */

import { OscilloscopeMotif } from './OscilloscopeMotif';

export function OscilloscopeMotifExample() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="font-display text-3xl text-ink mb-8">
        My Heart — Voice Activity Detection
      </h2>

      {/* Basic usage with default values */}
      <OscilloscopeMotif className="mb-12" />

      {/* Custom RMS and sample rate */}
      <OscilloscopeMotif
        rmsValue="0.72"
        sampleRate="16kHz"
        className="mb-12"
      />

      {/* Smaller display */}
      <OscilloscopeMotif
        rmsValue="0.38"
        sampleRate="8kHz"
        width={400}
        height={150}
      />
    </div>
  );
}
