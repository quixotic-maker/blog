// Content Schema — pure, framework-free type contracts + validation
// (design: "Bilingual Content Model" and "Project Metadata & MDX").
//
// This module owns the typed shapes for the bilingual Homepage content and the
// per-project metadata, plus `validateContent`, the build-time content
// integrity check (design: "Error Handling → Build-Time"). It is deliberately
// framework-free so the contract and its validation can be unit-tested in
// isolation and run during build/test.
//
// `Locale` and `Bilingual` are defined in `lib/locale.ts`; this module
// re-exports them so consumers have a single import surface for the content
// model without duplicating the definitions (Req 3.1).

import type { Bilingual, Locale } from './locale';

export type { Bilingual, Locale };

// -----------------------------------------------------------------------------
// Bilingual Content Model (design: "Bilingual Content Model")
// -----------------------------------------------------------------------------

/**
 * A headline number rendered by the MechanicalCounter with a bilingual caption
 * (Req 11.1, 11.2, 11.3).
 */
export interface HeadlineNumber {
  /** The final value the mechanical counter terminates on. */
  value: number;
  /** Optional unit / comparator suffix, e.g. "ms", "<". */
  suffix?: string;
  /** Bilingual caption for the number. */
  label: Bilingual;
}

/**
 * A single Experience_Section entry, presented as a parallel peer item with no
 * chronological ordering (Req 15).
 */
export interface ExperienceEntry {
  title: Bilingual;
  detail: Bilingual;
}

/**
 * A bilingual Chapter_Transition phrase shown between Homepage sections in a
 * fixed ordered sequence (Req 6.4, 6.5).
 */
export interface ChapterPhrase {
  zh: string;
  en: string;
}

/** An outbound contact link (Req 17.3, 17.4). */
export interface ContactLink {
  kind: 'github' | 'linkedin' | 'email';
  href: string;
}

/**
 * Site branding: the lowercase "quixoticmaker" Wordmark is the brand name and
 * tab title (Req 1.6–1.8); the real name appears only in the footer signature
 * (Req 17.1).
 */
export interface SiteBranding {
  /** "quixoticmaker" — brand name / tab title (Req 1.6–1.8). */
  wordmark: string;
  /**
   * Sub-positioning tagline accompanying the Wordmark: en
   * "AI PM · Hardware-AI Integration", zh "软硬一体 · 多智能体协同" (Req 1.9).
   */
  tagline: Bilingual;
  /** Footer sign-off "quixoticmaker — Yiheng Liu" (Req 17.1). */
  signature: string;
}

/** The full typed bilingual Homepage content contract. */
export interface SiteContent {
  /** Wordmark, tagline, signature (Req 1.6–1.9, 17.1). */
  branding: SiteBranding;
  hero: {
    /** AI PM positioning statement (Req 1.1). */
    positioning: Bilingual;
    /** Full-stack capability statement (Req 1.2). */
    capability: Bilingual;
    subtitle: Bilingual;
  };
  /** Approximately five headline numbers (Req 11.1). */
  dataAnchors: HeadlineNumber[];
  /** Parallel peer items, unordered (Req 15). */
  experience: ExperienceEntry[];
  philosophy: {
    vibecoding: Bilingual;
    aiNative: Bilingual;
    breathingRoom: Bilingual;
    skillRedefinition: Bilingual;
  };
  footer: {
    /** "quixoticmaker — Yiheng Liu" (Req 17.1). */
    signature: string;
    positioning: Bilingual;
    links: ContactLink[];
  };
  /** Ordered chapter-transition phrases (Req 6.5). */
  chapters: ChapterPhrase[];
}

// -----------------------------------------------------------------------------
// Project Metadata & MDX (design: "Project Metadata & MDX")
// -----------------------------------------------------------------------------

/** The three documented projects. */
export type ProjectId = 'jarvis' | 'my-heart' | 'arf';

/**
 * Per-project card/preview metadata used on the Homepage and to wire the
 * shared-element navigation to the Project_Page (Req 2.4, 2.6, 18).
 */
export interface ProjectMeta {
  id: ProjectId;
  route: `/work/${ProjectId}`;
  index: '01' | '02' | '03';
  name: Bilingual;
  tagline: Bilingual;
  techTags: string[];
  /** At least two key metrics revealed on hover (Req 2.6). */
  previewMetrics: { value: string; label: Bilingual }[];
  /** My Heart → oscilloscope, ARF → exploded-view (Req 19.1, 19.2). */
  signatureMotif?: 'oscilloscope' | 'exploded-view';
}

// -----------------------------------------------------------------------------
// Content integrity validation (design: "Error Handling → Build-Time")
// -----------------------------------------------------------------------------

/** The expected count band for `dataAnchors` ("approximately five", Req 11.1). */
const DATA_ANCHOR_MIN = 4;
const DATA_ANCHOR_MAX = 6;

/** The minimum number of preview metrics per project (Req 2.6). */
const MIN_PREVIEW_METRICS = 2;

/** A single content-integrity violation discovered by `validateContent`. */
export interface ContentIssue {
  /** Dotted path to the offending entry, e.g. "hero.positioning". */
  path: string;
  message: string;
}

/**
 * True when `entry` is a well-formed `Bilingual` with non-empty `zh` and `en`
 * string fields. Used to enforce bilingual parity (Req 3.1).
 */
function isCompleteBilingual(entry: unknown): entry is Bilingual {
  if (typeof entry !== 'object' || entry === null) {
    return false;
  }
  const { zh, en } = entry as { zh?: unknown; en?: unknown };
  return (
    typeof zh === 'string' &&
    zh.trim().length > 0 &&
    typeof en === 'string' &&
    en.trim().length > 0
  );
}

/**
 * Validate the bilingual content contract at build/test time.
 *
 * Fails (returns issues) when:
 * - any primary bilingual entry is missing a non-empty `zh` or `en` field
 *   (bilingual parity, Req 3.1);
 * - the `dataAnchors` count is outside the expected ~5 band (Req 11.1);
 * - any project's `previewMetrics` has fewer than two entries (Req 2.6).
 *
 * @param content  The Homepage `SiteContent` to validate.
 * @param projects The per-project `ProjectMeta` list to validate.
 * @returns The list of discovered issues; an empty list means the content is
 *          valid.
 */
export function validateContent(
  content: SiteContent,
  projects: ProjectMeta[] = [],
): ContentIssue[] {
  const issues: ContentIssue[] = [];

  const requireBilingual = (entry: unknown, path: string): void => {
    if (!isCompleteBilingual(entry)) {
      issues.push({
        path,
        message: `Missing or empty zh/en field at "${path}".`,
      });
    }
  };

  // Branding tagline (the wordmark/signature are single-language by design).
  requireBilingual(content.branding.tagline, 'branding.tagline');

  // Hero.
  requireBilingual(content.hero.positioning, 'hero.positioning');
  requireBilingual(content.hero.capability, 'hero.capability');
  requireBilingual(content.hero.subtitle, 'hero.subtitle');

  // Data anchors: count band + bilingual labels.
  if (
    content.dataAnchors.length < DATA_ANCHOR_MIN ||
    content.dataAnchors.length > DATA_ANCHOR_MAX
  ) {
    issues.push({
      path: 'dataAnchors',
      message: `Expected approximately 5 data anchors (${DATA_ANCHOR_MIN}–${DATA_ANCHOR_MAX}), found ${content.dataAnchors.length}.`,
    });
  }
  content.dataAnchors.forEach((anchor, i) => {
    requireBilingual(anchor.label, `dataAnchors[${i}].label`);
  });

  // Experience entries.
  content.experience.forEach((entry, i) => {
    requireBilingual(entry.title, `experience[${i}].title`);
    requireBilingual(entry.detail, `experience[${i}].detail`);
  });

  // Philosophy.
  requireBilingual(content.philosophy.vibecoding, 'philosophy.vibecoding');
  requireBilingual(content.philosophy.aiNative, 'philosophy.aiNative');
  requireBilingual(content.philosophy.breathingRoom, 'philosophy.breathingRoom');
  requireBilingual(
    content.philosophy.skillRedefinition,
    'philosophy.skillRedefinition',
  );

  // Footer.
  requireBilingual(content.footer.positioning, 'footer.positioning');

  // Chapters (ChapterPhrase carries zh/en directly).
  content.chapters.forEach((phrase, i) => {
    requireBilingual(phrase, `chapters[${i}]`);
  });

  // Project metadata.
  projects.forEach((project) => {
    requireBilingual(project.name, `projects.${project.id}.name`);
    requireBilingual(project.tagline, `projects.${project.id}.tagline`);

    if (project.previewMetrics.length < MIN_PREVIEW_METRICS) {
      issues.push({
        path: `projects.${project.id}.previewMetrics`,
        message: `Expected at least ${MIN_PREVIEW_METRICS} preview metrics, found ${project.previewMetrics.length}.`,
      });
    }
    project.previewMetrics.forEach((metric, i) => {
      requireBilingual(
        metric.label,
        `projects.${project.id}.previewMetrics[${i}].label`,
      );
    });
  });

  return issues;
}
