import type { MDXComponents } from 'mdx/types';

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-6 scroll-m-20 font-bold text-3xl tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 scroll-m-20 font-semibold text-2xl tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 scroll-m-20 font-semibold text-xl tracking-tight">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 mb-2 scroll-m-20 font-semibold text-lg tracking-tight">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="not-first:mt-4 mb-4 leading-7">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-6 list-disc space-y-2 [&>li]:mt-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 [&>li]:mt-2">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 mb-6 border-primary border-l-4 pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-border" />,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b bg-muted/50">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-muted/30">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="px-4 py-3">{children}</td>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
