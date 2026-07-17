// Smoke test: confirms the Vitest runner, the jsdom environment, React Testing
// Library (with jest-dom matchers), and fast-check are all wired up and
// executing. This is infrastructure verification, not feature coverage.
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';

describe('testing framework smoke test', () => {
  it('runs Vitest', () => {
    expect(1 + 1).toBe(2);
  });

  it('renders a component in jsdom with jest-dom matchers', () => {
    render(<p>hello world</p>);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('executes fast-check properties', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a;
      }),
      { numRuns: 100 },
    );
  });
});
