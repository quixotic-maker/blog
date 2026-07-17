# Bilingual Component

The `Bilingual` component renders bilingual content according to the active locale or in editorial pairing mode.

## Usage

### Single Mode (Default)

Renders only the active-locale content using `resolveContent` from `lib/locale.ts`:

```tsx
import { Bilingual } from '@/components/ui/Bilingual';

function MyComponent() {
  const content = {
    zh: '欢迎来到我的网站',
    en: 'Welcome to my website',
  };

  return <Bilingual content={content} />;
  // Renders: "Welcome to my website" (if locale is 'en')
  // Renders: "欢迎来到我的网站" (if locale is 'zh')
}
```

### Paired Mode (Editorial Pairing)

Renders both zh and en content together, as required by Requirement 3.5:

```tsx
import { Bilingual } from '@/components/ui/Bilingual';

function IntroSection() {
  const heading = {
    zh: '项目介绍',
    en: 'Project Introduction',
  };

  return (
    <Bilingual 
      content={heading} 
      mode="paired"
      className="flex gap-4"
      as="div"
    />
  );
  // Renders both languages side-by-side
}
```

### With ReactNode Content

The component supports both string and ReactNode content:

```tsx
const content = {
  zh: <span className="font-zh">中文内容</span>,
  en: <span className="font-en">English content</span>,
};

<Bilingual content={content} />
```

## Props

- `content`: `Bilingual<string | ReactNode>` - The bilingual content to render
- `mode`: `'single' | 'paired'` - Rendering mode (default: 'single')
  - `'single'`: Render only the active-locale content
  - `'paired'`: Render both zh and en content together (Req 3.5)
- `className`: `string` - Optional className for the container (paired mode only)
- `as`: `'div' | 'span' | 'p'` - Optional wrapper component (paired mode only, default: 'div')

## Requirements

- **Requirement 3.1**: Presents all primary content in both Chinese and English
- **Requirement 3.5**: Supports editorial pairing where both languages are displayed together

## Dependencies

- `lib/locale.ts`: Provides `Locale`, `Bilingual` types and `resolveContent` function
- `LocaleProvider`: (Task 8.2, concurrent) Provides the current locale via `useLocale()` hook

## Notes

The component includes a placeholder `useLocale()` hook that will be replaced when `LocaleProvider` from task 8.2 is implemented. The placeholder safely defaults to English and attempts to read from localStorage as a fallback.
