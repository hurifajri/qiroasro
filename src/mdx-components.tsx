import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ children }) => (
      <article className="prose dark:prose-invert mx-auto px-6 text-xl">
        {children}
      </article>
    ),
    // Component for Arabic text in the middle of a sentence (inline)
    Arabic: ({ children }) => (
      <span lang="ar" dir="rtl" className="font-arabic leading-normal">
        {children}
      </span>
    ),
    // Component for Arabic text in a paragraph/quote (block)
    ArabicBlock: ({ children }) => (
      <blockquote
        lang="ar"
        dir="rtl"
        className="text-right font-arabic text-xl leading-loose"
      >
        {children}
      </blockquote>
    ),
  };
}
