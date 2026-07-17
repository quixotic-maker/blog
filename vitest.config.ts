import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Testing framework wiring (Req 22.1 tooling): Vitest + jsdom + React Testing
// Library + fast-check. The pure logic layer under `lib/` is covered by
// property-based tests; the component/interaction layer uses RTL in a jsdom
// environment. `setupFiles` registers jest-dom matchers and cleans up the DOM
// between tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{ts,tsx}', 'lib/**/*.{test,spec}.{ts,tsx}'],
    css: true,
  },
  resolve: {
    alias: {
      // Mirror the tsconfig `@/*` path alias so tests can import app modules.
      '@': resolve(__dirname, '.'),
    },
  },
});
