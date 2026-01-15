'use client';

import type {
  ColorMode,
  Edge,
  IsValidConnection,
  Node,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { QuizMode } from '../schemas/quiz';
import { QuizCanvas } from './quiz-canvas';

interface QuizContentProps {
  mode: QuizMode;
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  theme: ColorMode;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  isValidConnection: IsValidConnection;
  headerContent?: React.ReactNode;
  /** Extra top offset for elements outside QuizContent (e.g., ChallengeProgress) */
  extraTopOffset?: number;
}

export function QuizContent({
  mode,
  nodes,
  edges,
  nodeTypes,
  theme,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  headerContent,
  extraTopOffset = 0,
}: QuizContentProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);

  const calculateHeight = useCallback(() => {
    const headerHeight = headerRef.current?.offsetHeight ?? 0;

    // Get dialog header and footer heights by measuring DOM
    // Uses data-slot attributes from dialog.tsx
    const dialogHeader = document.querySelector('[data-slot="dialog-header"]');
    const dialogFooter = document.querySelector('[data-slot="dialog-footer"]');

    const dialogHeaderHeight =
      dialogHeader?.getBoundingClientRect().height ?? 0;
    const dialogFooterHeight =
      dialogFooter?.getBoundingClientRect().height ?? 0;

    // Calculate available height
    const viewportHeight = window.innerHeight;
    const gap = extraTopOffset ? 74 : 58;

    const availableHeight =
      viewportHeight -
      dialogHeaderHeight -
      dialogFooterHeight -
      headerHeight -
      extraTopOffset -
      gap;

    setCanvasHeight(availableHeight);
  }, [extraTopOffset]);

  useEffect(() => {
    // Calculate on mount
    calculateHeight();

    // Get dialog footer element
    const dialogFooter = document.querySelector('[data-slot="dialog-footer"]');

    // ResizeObserver for header and footer size changes
    const resizeObserver = new ResizeObserver(calculateHeight);

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }
    if (dialogFooter) {
      resizeObserver.observe(dialogFooter);
    }

    // MutationObserver to detect DOM changes (e.g., instruction show/hide)
    const mutationObserver = new MutationObserver(calculateHeight);
    if (dialogFooter) {
      mutationObserver.observe(dialogFooter, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    window.addEventListener('resize', calculateHeight);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', calculateHeight);
    };
  }, [calculateHeight]);

  return (
    <div className="flex flex-col gap-2 rounded-lg border">
      <div
        ref={headerRef}
        className={cn(
          'flex h-12 items-center justify-between gap-2 px-2',
          mode === 'practice' && 'self-end',
        )}
      >
        {headerContent}
      </div>
      <QuizCanvas
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        theme={theme}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        height={canvasHeight}
      />
    </div>
  );
}
