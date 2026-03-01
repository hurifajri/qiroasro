'use client';

import { getViewportForBounds, useReactFlow } from '@xyflow/react';
import { DownloadIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

export function GraphDownload() {
  const t = useTranslations('playground_page.download');
  const { resolvedTheme } = useTheme();
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);

  const { getNodes, getNodesBounds } = useReactFlow();
  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadImage() {
    setIsDownloading(true);

    const nodes = getNodes();
    if (nodes.length === 0) return;

    // Get the viewport element
    const viewportElement = document.querySelector(
      '.react-flow__viewport',
    ) as HTMLElement;
    if (!viewportElement) {
      setIsDownloading(false);
      return;
    }

    // Calculate the bounds of all nodes
    const nodesBounds = getNodesBounds(nodes);
    const viewport = getViewportForBounds(
      nodesBounds,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
      0.5, // min zoom
      2, // max zoom
      0.2, // padding
    );

    // Lazy load html-to-image
    const { toPng } = await import('html-to-image');

    const dataUrl = await toPng(viewportElement, {
      backgroundColor:
        resolvedTheme === 'light'
          ? 'oklch(1 0 0)'
          : 'oklch(0.13 0.028 261.692)',
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      style: {
        width: `${IMAGE_WIDTH}px`,
        height: `${IMAGE_HEIGHT}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    });

    // Track download with graph settings snapshot
    // trackEvent('graph_downloaded', {
    //   locale,
    //   theme,
    //   view_mode: viewMode,
    //   layout_mode: layoutMode,
    //   hierarchy_direction:
    //     layoutMode === 'hierarchical' ? hierarchyDirection : null,
    //   edge_type: edgeStyle.isFloating ? 'floating' : 'fixed',
    //   edge_shape: !edgeStyle.isFloating ? edgeStyle.shape : null,
    //   edge_animated: edgeStyle.isAnimated,
    // });

    const a = document.createElement('a');
    a.setAttribute('download', `qiroasro-graph-${Date.now()}.png`);
    a.setAttribute('href', dataUrl);
    a.click();
    setIsDownloading(false);
  }

  return (
    <Button
      id="tour-download-image"
      dir={dir}
      variant="outline"
      size="sm"
      onClick={downloadImage}
      disabled={isDownloading}
      className="bg-background!"
    >
      <DownloadIcon className="size-4" />
      {isDownloading ? t('downloading') : t('trigger')}
    </Button>
  );
}
