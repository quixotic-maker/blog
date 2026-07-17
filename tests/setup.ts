// Vitest setup file. Runs before each test file.
// - Registers jest-dom matchers (e.g. toBeInTheDocument, toHaveTextContent).
// - Cleans up the React Testing Library render tree after every test so DOM
//   state does not leak between cases.
// - Mocks IntersectionObserver for components that use Framer Motion's useInView
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

// Mock IntersectionObserver for Framer Motion's useInView hook
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  } as any;
});

afterEach(() => {
  cleanup();
});
