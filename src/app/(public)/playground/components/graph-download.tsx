'use client';

import { getViewportForBounds, useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { DownloadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

export function GraphDownload() {
  const t = useTranslations('playground_page.download');
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

    const dataUrl = await toPng(viewportElement, {
      backgroundColor: 'transparent',
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      style: {
        width: `${IMAGE_WIDTH}px`,
        height: `${IMAGE_HEIGHT}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    });

    const a = document.createElement('a');
    a.setAttribute('download', `qiroasro-graph-${Date.now()}.png`);
    a.setAttribute('href', dataUrl);
    a.click();
    setIsDownloading(false);
  }

  return (
    <Button
      id="tour-download-image"
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
