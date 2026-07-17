import type { Config } from 'tailwindcss';

/**
 * Tailwind theme wired to the "Engineering Editorial · Light" design tokens.
 * The concrete palette / font values live as CSS custom properties in
 * styles/tokens.css (task 1.2); here we reference them so the constrained
 * token set (Req 8/9) is the single source of truth.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx,md,mdx}',
    './components/**/*.{ts,tsx,js,jsx,md,mdx}',
    './content/**/*.{ts,tsx,js,jsx,md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        ink: 'var(--color-ink)',
        gray: 'var(--color-gray)',
        accent: 'var(--color-accent)',
        grid: 'var(--color-grid)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body-en)',
        mono: 'var(--font-mono)',
        zh: 'var(--font-zh)',
      },
      fontWeight: {
        light: 'var(--fw-light)',
        normal: 'var(--fw-regular)',
        bold: 'var(--fw-bold)',
      },
    },
  },
  plugins: [],
};

export default config;
