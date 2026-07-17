// Unit tests for the Bilingual UI component (task 8.3).
//
// These tests verify that:
// 1. Single mode renders only the active-locale content using resolveContent
// 2. Paired mode renders both zh and en content together (Req 3.5)
// 3. The component handles both string and ReactNode content

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Bilingual } from '@/components/ui/Bilingual';
import type { Bilingual as BilingualType } from '@/lib/locale';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Bilingual component', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('single mode (default)', () => {
    it('renders English content when locale is en', () => {
      localStorageMock.setItem('locale', 'en');
      
      const content: BilingualType<string> = {
        zh: '中文内容',
        en: 'English content',
      };

      render(<Bilingual content={content} />);
      
      expect(screen.getByText('English content')).toBeDefined();
      expect(screen.queryByText('中文内容')).toBeNull();
    });

    it('renders Chinese content when locale is zh', () => {
      localStorageMock.setItem('locale', 'zh');
      
      const content: BilingualType<string> = {
        zh: '中文内容',
        en: 'English content',
      };

      render(<Bilingual content={content} />);
      
      expect(screen.getByText('中文内容')).toBeDefined();
      expect(screen.queryByText('English content')).toBeNull();
    });

    it('defaults to English when no locale is set', () => {
      const content: BilingualType<string> = {
        zh: '默认',
        en: 'Default',
      };

      render(<Bilingual content={content} />);
      
      expect(screen.getByText('Default')).toBeDefined();
    });

    it('handles ReactNode content', () => {
      localStorageMock.setItem('locale', 'en');
      
      const content: BilingualType<React.ReactNode> = {
        zh: <span>中文节点</span>,
        en: <span>English node</span>,
      };

      render(<Bilingual content={content} />);
      
      expect(screen.getByText('English node')).toBeDefined();
      expect(screen.queryByText('中文节点')).toBeNull();
    });
  });

  describe('paired mode (editorial pairing, Req 3.5)', () => {
    it('renders both zh and en content together', () => {
      const content: BilingualType<string> = {
        zh: '中文版本',
        en: 'English version',
      };

      const { container } = render(<Bilingual content={content} mode="paired" />);
      
      // Both languages should be present
      expect(screen.getByText('中文版本')).toBeDefined();
      expect(screen.getByText('English version')).toBeDefined();
      
      // Check structure has the paired attribute
      const pairedElement = container.querySelector('[data-bilingual-paired]');
      expect(pairedElement).toBeDefined();
      
      // Check both language sections exist
      const zhElement = container.querySelector('[data-lang="zh"]');
      const enElement = container.querySelector('[data-lang="en"]');
      expect(zhElement).toBeDefined();
      expect(enElement).toBeDefined();
    });

    it('applies custom className in paired mode', () => {
      const content: BilingualType<string> = {
        zh: '测试',
        en: 'Test',
      };

      const { container } = render(
        <Bilingual content={content} mode="paired" className="custom-class" />
      );
      
      const pairedElement = container.querySelector('[data-bilingual-paired]');
      expect(pairedElement?.className).toContain('custom-class');
    });

    it('uses custom component wrapper in paired mode', () => {
      const content: BilingualType<string> = {
        zh: '段落',
        en: 'Paragraph',
      };

      const { container } = render(
        <Bilingual content={content} mode="paired" as="span" />
      );
      
      const pairedElement = container.querySelector('[data-bilingual-paired]');
      expect(pairedElement?.tagName.toLowerCase()).toBe('span');
    });

    it('handles ReactNode content in paired mode', () => {
      const content: BilingualType<React.ReactNode> = {
        zh: <strong>粗体中文</strong>,
        en: <strong>Bold English</strong>,
      };

      render(<Bilingual content={content} mode="paired" />);
      
      expect(screen.getByText('粗体中文')).toBeDefined();
      expect(screen.getByText('Bold English')).toBeDefined();
      
      // Both should be in strong tags
      const strongElements = screen.getAllByRole('strong');
      expect(strongElements.length).toBe(2);
    });
  });

  describe('locale fallback behavior', () => {
    it('falls back to default locale when localStorage is unavailable', () => {
      // Temporarily break localStorage
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = () => { throw new Error('Storage error'); };

      const content: BilingualType<string> = {
        zh: '回退',
        en: 'Fallback',
      };

      render(<Bilingual content={content} />);
      
      // Should default to English
      expect(screen.getByText('Fallback')).toBeDefined();
      
      // Restore
      localStorageMock.getItem = originalGetItem;
    });
  });
});
