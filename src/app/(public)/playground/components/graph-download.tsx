'use client';

import { getViewportForBounds, useReactFlow } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { DownloadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

export function GraphDownload() {
  const t = useTranslations('playground_page');
  const { getNodes, getNodesBounds } = useReactFlow();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = useCallback(() => {
    const nodes = getNodes();
    if (nodes.length === 0) return;

    setIsDownloading(true);

    // Get the viewport element
    const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
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

    toPng(viewportElement, {
      backgroundColor: 'transparent',
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      style: {
        width: `${IMAGE_WIDTH}px`,
        height: `${IMAGE_HEIGHT}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    })
      .then((dataUrl) => {
        const a = document.createElement('a');
        a.setAttribute('download', `qiroasro-graph-${Date.now()}.png`);
        a.setAttribute('href', dataUrl);
        a.click();
        setIsDownloading(false);
      })
      .catch(() => {
        setIsDownloading(false);
      });
  }, [getNodes, getNodesBounds]);

  return (
    <Button
      id="tour-download-image"
      variant="outline"
      size="sm"
      onClick={downloadImage}
      disabled={isDownloading}
    >
      <DownloadIcon className="size-4" />
      {isDownloading ? t('download.downloading') : t('download.trigger')}
    </Button>
  );
}
