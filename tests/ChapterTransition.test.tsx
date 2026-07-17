// Unit test for ChapterTransition component
// Validates Req 6.4, 6.5: bilingual chapter phrases displayed in fixed order

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChapterTransition } from '@/components/systems/ChapterTransition';
import type { ChapterPhrase } from '@/lib/contentSchema';

describe('ChapterTransition', () => {
  const samplePhrase: ChapterPhrase = {
    zh: '从理解语义开始…',
    en: 'It begins with understanding semantics…',
  };

  it('renders the ChapterTransition component', () => {
    const { container } = render(<ChapterTransition phrase={samplePhrase} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders both Chinese and English text in paired mode', () => {
    render(<ChapterTransition phrase={samplePhrase} />);
    
    // Check that both language versions are present
    expect(screen.getByText('从理解语义开始…')).toBeInTheDocument();
    expect(screen.getByText('It begins with understanding semantics…')).toBeInTheDocument();
  });

  it('renders with bilingual paired mode (both languages visible)', () => {
    const { container } = render(<ChapterTransition phrase={samplePhrase} />);
    
    // Check for bilingual paired data attribute
    const bilingualContainer = container.querySelector('[data-bilingual-paired]');
    expect(bilingualContainer).toBeInTheDocument();
  });

  it('applies the chapter transition section aria-label', () => {
    const { container } = render(<ChapterTransition phrase={samplePhrase} />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-label', 'Chapter transition');
  });

  it('accepts custom className prop', () => {
    const { container } = render(
      <ChapterTransition phrase={samplePhrase} className="custom-class" />
    );
    const section = container.querySelector('section');
    expect(section?.className).toContain('custom-class');
  });

  it('renders all four chapter phrases correctly', () => {
    const phrases: ChapterPhrase[] = [
      { zh: '从理解语义开始…', en: 'It begins with understanding semantics…' },
      { zh: '…到调度智能体…', en: '…to orchestrating agents…' },
      { zh: '…再到驱动物理世界…', en: '…then to driving the physical world…' },
      { zh: '…最终，统一所有机器人。', en: '…and finally, to unifying every robot.' },
    ];

    phrases.forEach((phrase) => {
      const { unmount } = render(<ChapterTransition phrase={phrase} />);
      expect(screen.getByText(phrase.zh)).toBeInTheDocument();
      expect(screen.getByText(phrase.en)).toBeInTheDocument();
      unmount();
    });
  });
});
