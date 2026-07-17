import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

/**
 * Maps MDX elements onto the "Engineering Editorial · Light" Visual_System.
 *
 * We deliberately avoid the Tailwind typography plugin (not installed) and
 * instead style each element by hand so the body copy matches the rest of the
 * site: display headings, monospace annotations, amber accents, generous
 * rhythm, and rule-separated sections.
 *
 * Requirements: 8 (typography), 18.3 (shared Visual_System), 22.3 (MDX).
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight mt-16 mb-6 first:mt-0">
        {children}
      </h1>
    ),

    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="group flex items-center gap-4 font-display text-2xl md:text-3xl font-bold text-ink leading-tight mt-16 mb-6">
        <span className="h-4 w-1 bg-accent flex-shrink-0" aria-hidden />
        {children}
      </h2>
    ),

    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="font-mono text-sm text-accent uppercase tracking-widest mt-12 mb-4">
        {children}
      </h3>
    ),

    h4: ({ children }: { children?: ReactNode }) => (
      <h4 className="font-display text-lg font-bold text-ink mt-8 mb-3">
        {children}
      </h4>
    ),

    p: ({ children }: { children?: ReactNode }) => (
      <p className="text-base md:text-lg text-gray leading-[1.8] mb-6 max-w-2xl">
        {children}
      </p>
    ),

    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="mb-8 space-y-2.5 max-w-2xl">{children}</ul>
    ),

    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="mb-8 space-y-2.5 max-w-2xl [counter-reset:item] list-none">
        {children}
      </ol>
    ),

    li: ({ children }: { children?: ReactNode }) => (
      <li className="relative pl-6 text-base text-gray leading-relaxed before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:bg-accent/70">
        {children}
      </li>
    ),

    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-bold text-ink">{children}</strong>
    ),

    em: ({ children }: { children?: ReactNode }) => (
      <em className="italic text-ink/80">{children}</em>
    ),

    a: ({ children, href }: { children?: ReactNode; href?: string }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent transition-colors"
      >
        {children}
      </a>
    ),

    code: ({ children }: { children?: ReactNode }) => (
      <code className="font-mono text-sm text-accent bg-grid/40 px-1.5 py-0.5 rounded">
        {children}
      </code>
    ),

    pre: ({ children }: { children?: ReactNode }) => (
      <pre className="font-mono text-sm text-ink bg-grid/30 border border-grid rounded-sm p-5 overflow-x-auto mb-8 leading-relaxed">
        {children}
      </pre>
    ),

    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-2 border-accent pl-6 my-8 text-ink/80 italic max-w-2xl">
        {children}
      </blockquote>
    ),

    hr: () => <hr className="border-0 border-t border-grid my-16" />,

    table: ({ children }: { children?: ReactNode }) => (
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse font-mono text-sm">
          {children}
        </table>
      </div>
    ),

    th: ({ children }: { children?: ReactNode }) => (
      <th className="border border-grid bg-grid/30 px-4 py-2 text-left text-ink font-bold">
        {children}
      </th>
    ),

    td: ({ children }: { children?: ReactNode }) => (
      <td className="border border-grid px-4 py-2 text-gray">{children}</td>
    ),
  };
}
