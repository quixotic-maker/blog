'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { type Locale } from '@/lib/locale';

/**
 * LocaleProvider — React context provider for the Locale System.
 *
 * Holds the current `Locale` ('zh' or 'en') in state, persists the choice to
 * `localStorage` (wrapped in try/catch with in-memory fallback if localStorage
 * is unavailable), and provides a `useLocale()` hook so consumers can read and
 * change the active locale. Uses `toggleLocale` from `lib/locale.ts` when
 * toggling. Applies changes globally — all consumers of the context see the new
 * locale immediately (Req 3.4).
 *
 * Requirements: 3.2, 3.3, 3.4
 */

const LOCALE_STORAGE_KEY = 'quixoticmaker-locale';
const DEFAULT_LOCALE: Locale = 'zh';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

/**
 * Hook to access the current locale and setLocale function.
 * Must be used within a LocaleProvider.
 */
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  // Always start with DEFAULT_LOCALE on both server and client so that the
  // first render matches and hydration succeeds. We sync from localStorage
  // in a useEffect (client-only), which runs after hydration.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Read persisted locale once after hydration (client-only).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === 'zh' || stored === 'en') {
        setLocaleState(stored);
      }
    } catch {
      // localStorage unavailable — keep in-memory default
    }
  }, []);

  // Persist locale changes to localStorage (with try/catch for safety)
  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch (error) {
      // localStorage unavailable — no-op, continue with in-memory state
      console.warn('Failed to persist locale to localStorage:', error);
    }
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
