'use client';

import {
  type Edge,
  getViewportForBounds,
  useReactFlow,
  useStoreApi,
} from '@xyflow/react';
import { DownloadIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';

import { drawEdgesOnCanvas } from '../_lib/edge-canvas';

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;
const MAX_EXPORT_DPR = 2;

type GraphDownloadProps = Readonly<{
  edges: Edge[];
}>;

function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function GraphDownload({ edges }: GraphDownloadProps) {
  const t = useTranslations('playground_page.download');
  const { resolvedTheme } = useTheme();
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);

  const store = useStoreApi();
  const { getNodes, getNodesBounds } = useReactFlow();
  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadImage() {
    const nodes = getNodes();
    if (nodes.length === 0) return;

    // Get the viewport element
    const viewportElement = document.querySelector<HTMLElement>(
      '.react-flow__viewport',
    );
    if (!viewportElement) return;

    setIsDownloading(true);

    try {
      await waitForNextPaint();

      // Calculate the bounds of all nodes
      const nodesBounds = getNodesBounds(nodes);
      const viewport = getViewportForBounds(
        nodesBounds,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        0.1, // min zoom
        2, // max zoom
        0.2, // padding
      );

      const exportDpr = Math.min(window.devicePixelRatio || 1, MAX_EXPORT_DPR);
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = IMAGE_WIDTH * exportDpr;
      exportCanvas.height = IMAGE_HEIGHT * exportDpr;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      const backgroundColor =
        resolvedTheme === 'light'
          ? 'oklch(1 0 0)'
          : 'oklch(0.13 0.028 261.692)';

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      drawEdgesOnCanvas(ctx, {
        edges,
        nodeLookup: store.getState().nodeLookup,
        transform: [viewport.x, viewport.y, viewport.zoom],
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        dpr: exportDpr,
        shouldClear: false,
      });

      // Lazy load html-to-image to capture DOM nodes layer cleanly
      const { toCanvas } = await import('html-to-image');

      const nodesCanvas = await toCanvas(viewportElement, {
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        pixelRatio: exportDpr,
        style: {
          width: `${IMAGE_WIDTH}px`,
          height: `${IMAGE_HEIGHT}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(nodesCanvas, 0, 0, exportCanvas.width, exportCanvas.height);

      const a = document.createElement('a');
      a.setAttribute('download', `qiroasro-graph-${Date.now()}.png`);
      a.setAttribute('href', exportCanvas.toDataURL('image/png'));
      a.click();
    } finally {
      setIsDownloading(false);
    }
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
