import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LocaleProvider, useLocale } from '../components/providers/LocaleProvider';
import { LocaleToggle } from '../components/ui/LocaleToggle';

/**
 * Test component that consumes the useLocale hook
 */
function TestConsumer() {
  const { locale, setLocale } = useLocale();
  return (
    <div>
      <div data-testid="current-locale">{locale}</div>
      <button onClick={() => setLocale('en')} data-testid="set-en">Set EN</button>
      <button onClick={() => setLocale('zh')} data-testid="set-zh">Set ZH</button>
    </div>
  );
}

describe('LocaleProvider', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Create a working localStorage mock
    localStorageMock = {};
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value;
        },
        removeItem: (key: string) => {
          delete localStorageMock[key];
        },
        clear: () => {
          localStorageMock = {};
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorageMock = {};
  });

  it('defaults to "zh" locale when localStorage is empty', () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>
    );

    expect(screen.getByTestId('current-locale').textContent).toBe('zh');
  });

  it('loads locale from localStorage if available', () => {
    localStorageMock['quixoticmaker-locale'] = 'en';

    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>
    );

    expect(screen.getByTestId('current-locale').textContent).toBe('en');
  });

  it('persists locale changes to localStorage (Req 3.2)', async () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>
    );

    fireEvent.click(screen.getByTestId('set-en'));

    // Wait for useEffect to run
    await waitFor(() => {
      expect(localStorageMock['quixoticmaker-locale']).toBe('en');
    });
    expect(screen.getByTestId('current-locale').textContent).toBe('en');
  });

  it('falls back to in-memory state when localStorage is unavailable (Req 3.2)', () => {
    // Mock localStorage.setItem to throw (simulating unavailable localStorage)
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => { throw new Error('localStorage is not available'); },
        setItem: () => { throw new Error('localStorage is not available'); },
        removeItem: () => { throw new Error('localStorage is not available'); },
        clear: () => { throw new Error('localStorage is not available'); },
      },
      writable: true,
    });

    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>
    );

    // Should still work with in-memory fallback
    fireEvent.click(screen.getByTestId('set-en'));
    expect(screen.getByTestId('current-locale').textContent).toBe('en');

    // Should have logged a warning
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it('applies locale changes globally across all consumers (Req 3.4)', () => {
    function MultiConsumer() {
      const { locale, setLocale } = useLocale();
      return (
        <div>
          <div data-testid="consumer-1">{locale}</div>
          <div data-testid="consumer-2">{locale}</div>
          <button onClick={() => setLocale('en')} data-testid="change-locale">
            Change
          </button>
        </div>
      );
    }

    render(
      <LocaleProvider>
        <MultiConsumer />
      </LocaleProvider>
    );

    expect(screen.getByTestId('consumer-1').textContent).toBe('zh');
    expect(screen.getByTestId('consumer-2').textContent).toBe('zh');

    fireEvent.click(screen.getByTestId('change-locale'));

    // Both consumers should see the change immediately
    expect(screen.getByTestId('consumer-1').textContent).toBe('en');
    expect(screen.getByTestId('consumer-2').textContent).toBe('en');
  });

  it('throws error when useLocale is used outside provider', () => {
    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useLocale must be used within a LocaleProvider');
  });
});

describe('LocaleToggle', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    localStorageMock = {};
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => localStorageMock[key] || null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value;
        },
        removeItem: (key: string) => {
          delete localStorageMock[key];
        },
        clear: () => {
          localStorageMock = {};
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorageMock = {};
  });

  it('displays the next locale as button text', () => {
    render(
      <LocaleProvider>
        <LocaleToggle />
      </LocaleProvider>
    );

    // Default is 'zh', so button should show 'EN' (the next locale)
    expect(screen.getByRole('button').textContent).toBe('EN');
  });

  it('calls toggleLocale and updates LocaleProvider state (Req 3.3)', () => {
    function TestWrapper() {
      const { locale } = useLocale();
      return (
        <div>
          <div data-testid="current-locale">{locale}</div>
          <LocaleToggle />
        </div>
      );
    }

    render(
      <LocaleProvider>
        <TestWrapper />
      </LocaleProvider>
    );

    expect(screen.getByTestId('current-locale').textContent).toBe('zh');
    expect(screen.getByRole('button').textContent).toBe('EN');

    // Click to toggle
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('current-locale').textContent).toBe('en');
    expect(screen.getByRole('button').textContent).toBe('中文');

    // Click again to toggle back
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('current-locale').textContent).toBe('zh');
    expect(screen.getByRole('button').textContent).toBe('EN');
  });

  it('has proper aria-label for accessibility', () => {
    render(
      <LocaleProvider>
        <LocaleToggle />
      </LocaleProvider>
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to English');

    fireEvent.click(button);
    expect(button.getAttribute('aria-label')).toBe('Switch to Chinese');
  });
});
