import '@/env';
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // output: 'standalone',
  // Add the packages in transpilePackages
  // transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],

  /* config options here */
  reactCompiler: true,

  // Enable source maps for better debugging
  productionBrowserSourceMaps: true,

  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  async headers() {
    return [
      {
        // Cache static assets (images, fonts) for 1 year
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      'remark-gfm',
      [
        'remark-toc',
        {
          heading:
            'table[ -]of[ -]contents?|toc|daftar[ -]isi|isi[ -]kandungan|kandungan|içindekiler|الفهرس|المحتويات',
        },
      ],
    ],
    rehypePlugins: [
      'rehype-slug',
      [
        'rehype-autolink-headings',
        {
          behavior: 'wrap',
          properties: {
            className: ['subheading-anchor'],
          },
        },
      ],
    ],
  },
});

export default withNextIntl(withMDX(nextConfig));
