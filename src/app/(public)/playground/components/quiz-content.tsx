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
import { QuizCanvas } from './quiz-canvas';

interface QuizContentProps {
  isChallengeMode?: boolean;
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  theme: ColorMode;
  isChecked: boolean;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  isValidConnection: IsValidConnection;
  headerContent?: React.ReactNode;
  /** Extra top offset for elements outside QuizContent (e.g., ChallengeProgress) */
  extraTopOffset?: number;
}

export function QuizContent({
  isChallengeMode = false,
  nodes,
  edges,
  nodeTypes,
  theme,
  isChecked,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  headerContent,
  extraTopOffset = 0,
}: QuizContentProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number>(400);

  const calculateHeight = useCallback(() => {
    const headerHeight = headerRef.current?.offsetHeight ?? 48;

    // Get dialog header and footer heights by measuring DOM
    // Uses data-slot attributes from dialog.tsx
    const dialogHeader = document.querySelector('[data-slot="dialog-header"]');
    const dialogFooter = document.querySelector('[data-slot="dialog-footer"]');

    const dialogHeaderHeight = dialogHeader?.getBoundingClientRect().height ?? 42;
    const dialogFooterHeight = dialogFooter?.getBoundingClientRect().height ?? 185;

    // Calculate available height
    const viewportHeight = window.innerHeight;
    const dialogPadding = 16 * 2; // Dialog top/bottom padding
    const gap = extraTopOffset ? 42 : 26;

    const availableHeight =
      viewportHeight -
      dialogPadding -
      dialogHeaderHeight -
      dialogFooterHeight -
      headerHeight -
      extraTopOffset -
      gap;

    setCanvasHeight(Math.max(400, availableHeight));
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
          !isChallengeMode && 'self-end',
        )}
      >
        {headerContent}
      </div>
      <QuizCanvas
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        theme={theme}
        isChecked={isChecked}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        height={canvasHeight}
      />
    </div>
  );
}
