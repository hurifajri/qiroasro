import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper: ({ children }) => (
      <article className="prose dark:prose-invert mx-auto px-6">
        {children}
      </article>
    ),
  };
}
