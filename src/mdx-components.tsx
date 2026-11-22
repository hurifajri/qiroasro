import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ children }) => (
      <article className="mx-auto prose px-6 text-xl dark:prose-invert">
        {children}
      </article>
    ),
    // Component for Arabic text in the middle of a sentence (inline)
    Arabic: ({ children }) => (
      <span lang="ar" dir="rtl" className="font-arabic">
        {children}
      </span>
    ),
    // Component for Arabic text in a paragraph/quote (block)
    ArabicBlock: ({ children }) => (
      <blockquote
        lang="ar"
        dir="rtl"
        className="font-arabic text-2xl leading-loose"
      >
        <p>{children}</p>
      </blockquote>
    ),
  };
}
