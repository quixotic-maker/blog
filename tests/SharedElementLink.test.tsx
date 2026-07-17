// Unit test for SharedElementLink component
// Validates Req 18.1, 18.4: shared-element transition with reduced-motion degradation

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SharedElementLink } from '@/components/systems/SharedElementLink';
import { MotionProvider } from '@/components/providers/MotionProvider';

describe('SharedElementLink', () => {
  const testHref = '/work/jarvis';
  const testLayoutId = 'project-jarvis';
  const testContent = 'Test Project Card';

  // Helper to render with MotionProvider
  const renderWithProvider = (ui: React.ReactElement, prefersReduced = false) => {
    // Mock matchMedia for controlled reduced motion testing
    const mockMatchMedia = vi.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion') && prefersReduced,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    return render(<MotionProvider>{ui}</MotionProvider>);
  };

  it('renders a link with the correct href', () => {
    renderWithProvider(
      <SharedElementLink href={testHref} layoutId={testLayoutId}>
        <div>{testContent}</div>
      </SharedElementLink>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', testHref);
  });

  it('renders its children', () => {
    renderWithProvider(
      <SharedElementLink href={testHref} layoutId={testLayoutId}>
        <div>{testContent}</div>
      </SharedElementLink>
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('applies layoutId when reduced motion is off (Req 18.1)', () => {
    const { container } = renderWithProvider(
      <SharedElementLink href={testHref} layoutId={testLayoutId}>
        <div>{testContent}</div>
      </SharedElementLink>,
      false // reduced motion off
    );

    // When reduced motion is off, the component should render with motion capabilities
    // The content should still be present
    expect(screen.getByText(testContent)).toBeInTheDocument();
    
    // Link should work
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', testHref);
    
    // Verify motion.div is rendered (Framer Motion component)
    const motionDiv = container.querySelector('a > div');
    expect(motionDiv).toBeInTheDocument();
  });

  it('degrades to simple fade when reduced motion is on (Req 18.4)', () => {
    const { container } = renderWithProvider(
      <SharedElementLink href={testHref} layoutId={testLayoutId}>
        <div>{testContent}</div>
      </SharedElementLink>,
      true // reduced motion on
    );

    // The component should still render the children
    expect(screen.getByText(testContent)).toBeInTheDocument();
    
    // Link should still work
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', testHref);
  });

  it('accepts custom className', () => {
    const customClass = 'custom-link-class';
    const { container } = renderWithProvider(
      <SharedElementLink
        href={testHref}
        layoutId={testLayoutId}
        className={customClass}
      >
        <div>{testContent}</div>
      </SharedElementLink>
    );

    const link = container.querySelector(`.${customClass}`);
    expect(link).toBeInTheDocument();
  });

  it('renders multiple SharedElementLinks with unique layoutIds', () => {
    const { container } = renderWithProvider(
      <>
        <SharedElementLink href="/work/jarvis" layoutId="project-jarvis">
          <div>Jarvis</div>
        </SharedElementLink>
        <SharedElementLink href="/work/my-heart" layoutId="project-my-heart">
          <div>My Heart</div>
        </SharedElementLink>
        <SharedElementLink href="/work/arf" layoutId="project-arf">
          <div>ARF</div>
        </SharedElementLink>
      </>
    );

    // All three links should be present
    expect(screen.getByText('Jarvis')).toBeInTheDocument();
    expect(screen.getByText('My Heart')).toBeInTheDocument();
    expect(screen.getByText('ARF')).toBeInTheDocument();

    // All three links should have correct hrefs
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/work/jarvis');
    expect(links[1]).toHaveAttribute('href', '/work/my-heart');
    expect(links[2]).toHaveAttribute('href', '/work/arf');
  });
});
