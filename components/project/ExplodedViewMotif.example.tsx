/**
 * Example usage of ExplodedViewMotif component.
 *
 * This example demonstrates how to use the ExplodedViewMotif in the ARF
 * project page to display the layered architecture assembly diagram.
 */

import { ExplodedViewMotif } from './ExplodedViewMotif';

export function ExplodedViewMotifExample() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="font-display text-3xl text-ink mb-8">
        ARF — Layered Architecture
      </h2>

      {/* Basic usage with default dimensions */}
      <ExplodedViewMotif className="mb-12" />

      {/* Custom dimensions */}
      <ExplodedViewMotif
        width={700}
        height={500}
      />
    </div>
  );
}
