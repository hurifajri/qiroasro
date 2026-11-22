'use client';

import '@xyflow/react/dist/style.css';

import { useQuery } from '@tanstack/react-query';
import {
  type ColorMode,
  type Edge as FlowEdge,
  type Node as FlowNode,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef } from 'react';

import { useMounted } from '@/hooks/use-mounted';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

import { useTajweedLetterCycle } from '../hooks/use-tajweed-letter-cycle';
import {
  applyEdgesHighlight,
  applyNodesHighlight,
  buildLayoutedGraph,
} from '../lib/graph-highlight';
import { computeHighlight } from '../lib/graph-traversal';
import { getRootLetters } from '../lib/letter';
import { getPlaygroundDataOpt } from '../queries/tajweed-graph';
import type { EdgeStyleOptions } from '../schemas/graph';
import { CanvasEdges } from './canvas-edges';
import { TAJWEED_NODE_TYPES } from './tajweed-graph-nodes';

type TajweedGraphShowcaseProps = Readonly<{
  activeLetterId?: number | null;
  intervalMs?: number;
  className?: string;
}>;

const EMPTY_EDGES: FlowEdge[] = [];
const PRO_OPTIONS = { hideAttribution: true };
const FIT_VIEW_OPTIONS = { padding: 0.05 };
const SHOWCASE_EDGE_STYLE: EdgeStyleOptions = {
  shape: 'default',
  isFloating: true,
  isAnimated: false,
};

function TajweedGraphShowcaseContent({
  activeLetterId,
  intervalMs = 2200,
  className,
}: TajweedGraphShowcaseProps) {
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const { resolvedTheme } = useTheme();
  const { isMounted } = useMounted();
  const colorMode = (
    isMounted ? (resolvedTheme ?? 'light') : 'light'
  ) as ColorMode;

  const { fitView } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);

  const { data: playgroundData } = useQuery(getPlaygroundDataOpt());

  const rootLetters = useMemo(
    () => getRootLetters(playgroundData?.letters ?? []),
    [playgroundData?.letters],
  );

  const isControlled = activeLetterId !== undefined;
  const internalLetterId = useTajweedLetterCycle(rootLetters, {
    intervalMs,
    isEnabled: !isControlled,
  });
  const resolvedLetterId = isControlled ? activeLetterId : internalLetterId;
  const selectedNodeId =
    resolvedLetterId !== null ? `letter-${resolvedLetterId}` : null;

  const baseGraph = useMemo(() => {
    if (!playgroundData || playgroundData.letters.length === 0) {
      return { nodes: [] as FlowNode[], edges: [] as FlowEdge[] };
    }

    return buildLayoutedGraph(playgroundData, {
      viewMode: 'all',
      layoutMode: 'radial',
      hierarchyDirection: 'horizontal',
      selectedLetterId: rootLetters[0]?.id ?? 1,
      isTraitVisible: true,
      isArticulationVisible: true,
      isFloating: true,
      isInteractive: false,
    });
  }, [playgroundData, rootLetters]);

  useEffect(() => {
    setNodes(baseGraph.nodes);
    if (baseGraph.nodes.length === 0) return;

    const timer = setTimeout(() => {
      void fitView(FIT_VIEW_OPTIONS);
    }, 50);

    return () => clearTimeout(timer);
  }, [baseGraph.nodes, fitView, setNodes]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || baseGraph.nodes.length === 0) return;

    const observer = new ResizeObserver(() => {
      void fitView(FIT_VIEW_OPTIONS);
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [baseGraph.nodes.length, fitView]);

  const { connectedNodeIds, connectedEdgeIds } = useMemo(() => {
    if (!selectedNodeId) {
      return {
        connectedNodeIds: new Set<string>(),
        connectedEdgeIds: new Set<string>(),
      };
    }
    return computeHighlight(selectedNodeId, baseGraph.edges);
  }, [selectedNodeId, baseGraph.edges]);

  const highlightedNodes = useMemo(
    () => applyNodesHighlight(nodes, selectedNodeId, connectedNodeIds),
    [nodes, selectedNodeId, connectedNodeIds],
  );

  const highlightedEdges = useMemo(
    () =>
      applyEdgesHighlight(baseGraph.edges, {
        selectedNodeId,
        connectedEdgeIds,
        edgeStyle: SHOWCASE_EDGE_STYLE,
      }),
    [baseGraph.edges, selectedNodeId, connectedEdgeIds],
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none relative h-90 w-full overflow-hidden select-none sm:h-110 lg:h-130',
        className,
      )}
    >
      {baseGraph.nodes.length > 0 && (
        <ReactFlow
          dir={dir}
          proOptions={PRO_OPTIONS}
          colorMode={colorMode}
          fitView
          fitViewOptions={FIT_VIEW_OPTIONS}
          nodes={highlightedNodes}
          edges={EMPTY_EDGES}
          onNodesChange={onNodesChange}
          nodeTypes={TAJWEED_NODE_TYPES}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          elevateNodesOnSelect={false}
          elevateEdgesOnSelect={false}
          autoPanOnNodeDrag={false}
          autoPanOnNodeFocus={false}
          minZoom={0.1}
          maxZoom={1}
          className="bg-transparent!"
        >
          <CanvasEdges edges={highlightedEdges} />
        </ReactFlow>
      )}
    </div>
  );
}

export function TajweedGraphShowcase(props: TajweedGraphShowcaseProps) {
  return (
    <ReactFlowProvider>
      <TajweedGraphShowcaseContent {...props} />
    </ReactFlowProvider>
  );
}
