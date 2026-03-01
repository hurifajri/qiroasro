'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge as FlowEdge,
  type Node as FlowNode,
  // MiniMap,
  type NodeTypes,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import dynamic from 'next/dynamic';
import '@xyflow/react/dist/style.css';
import { CircleHelpIcon, TrophyIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global';
import { usePlaygroundParams } from '../_hooks/use-playground-params';
import { usePlaygroundTour } from '../_hooks/use-playground-tour';
import { generateGraphFromData } from '../_lib/graph-generator';
import {
  applyHierarchicalLayout,
  applyRadialLayout,
} from '../_lib/graph-layout';
import { usePlaygroundStore } from '../_providers/playground';
import { useQuizStore } from '../_providers/quiz';
import { getPlaygroundDataOpt } from '../_queries/playground';
import { GraphFilter } from './graph-filter';
import { GraphLegend } from './graph-legend';
import { MobileUnsupported } from './mobile-unsupported';
import {
  ArticulationAreaNode,
  ArticulationPointNode,
} from './node-articulation';
import { LetterNode } from './node-letter';
import { TraitGroupNode, TraitNode } from './node-trait';

/**
 * Lazy load Quiz component - only shown when dialog is open
 */
const Quiz = dynamic(() => import('./quiz').then((mod) => mod.Quiz), {
  ssr: false,
});

/**
 * Lazy load GraphDownload - not critical for initial render
 */
const GraphDownload = dynamic(
  () => import('./graph-download').then((mod) => mod.GraphDownload),
  { ssr: false },
);

// Register custom node types
const nodeTypes: NodeTypes = {
  letter: LetterNode,
  articulationArea: ArticulationAreaNode,
  articulationPoint: ArticulationPointNode,
  traitGroup: TraitGroupNode,
  trait: TraitNode,
};

export function Playground() {
  const t = useTranslations('playground_page');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const isMobile = useMobile();

  const theme = useGlobalStore((s) => s.theme);
  const { startTour } = usePlaygroundTour({ theme });

  const viewMode = usePlaygroundStore((s) => s.viewMode);
  const layoutMode = usePlaygroundStore((s) => s.layoutMode);
  const hierarchyDirection = usePlaygroundStore((s) => s.hierarchyDirection);
  const selectedLetterId = usePlaygroundStore((s) => s.selectedLetterId);
  const selectedNodeId = usePlaygroundStore((s) => s.selectedNodeId);
  const edgeStyle = usePlaygroundStore((s) => s.edgeStyle);
  const connectedNodeIds = usePlaygroundStore((s) => s.connectedNodeIds);
  const connectedEdgeIds = usePlaygroundStore((s) => s.connectedEdgeIds);
  const setViewMode = usePlaygroundStore((s) => s.setViewMode);
  const setLayoutMode = usePlaygroundStore((s) => s.setLayoutMode);
  const setHierarchyDirection = usePlaygroundStore(
    (s) => s.setHierarchyDirection,
  );
  const setSelectedLetterId = usePlaygroundStore((s) => s.setSelectedLetterId);
  const setEdgeStyle = usePlaygroundStore((s) => s.setEdgeStyle);
  const updateHighlight = usePlaygroundStore((s) => s.updateHighlight);

  // Sync playground settings with URL query params
  usePlaygroundParams({
    currentSettings: {
      viewMode,
      layoutMode,
      hierarchyDirection,
      edgeShape: edgeStyle.shape,
      selectedLetterId,
    },
    onViewModeChange: setViewMode,
    onLayoutModeChange: setLayoutMode,
    onHierarchyDirectionChange: setHierarchyDirection,
    onEdgeShapeChange: (shape) => setEdgeStyle({ shape }),
    onLetterSelect: setSelectedLetterId,
  });

  // Quiz state - to unmount playground canvas when quiz is active (performance optimization)
  const isQuizDialogOpen = useQuizStore((s) => s.isDialogOpen);
  const isQuizStarted = useQuizStore((s) => s.isStarted);
  const openQuizDialog = useQuizStore((s) => s.openDialog);

  const handleOpenQuizDialog = useCallback(() => {
    // trackEvent('quiz_dialog_opened', { locale, theme });
    openQuizDialog();
  }, [openQuizDialog]);

  // ReactFlow state (local, managed by ReactFlow)
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  // Fetch data from single consolidated query
  const { data: playgroundData } = useQuery(getPlaygroundDataOpt());
  const letters = playgroundData?.letters ?? [];
  const letterArticulations = playgroundData?.letterArticulations ?? [];
  const letterTraits = playgroundData?.letterTraits ?? [];
  const articulationAreas = playgroundData?.articulationAreas ?? [];
  const articulationPoints = playgroundData?.articulationPoints ?? [];
  const traits = playgroundData?.traits ?? [];
  const traitGroups = playgroundData?.traitGroups ?? [];

  // Update nodes/edges when data or filters change
  // Data comes from SSR, so it's always available
  // biome-ignore lint/correctness/useExhaustiveDependencies: <perf optimization>
  useEffect(() => {
    const data = {
      letters,
      letterArticulations,
      letterTraits,
      articulationAreas,
      articulationPoints,
      traits,
      traitGroups,
    };

    async function updateLayout() {
      // Generate nodes and edges (without positions)
      const { nodes: rawNodes, edges: newEdges } = generateGraphFromData(data, {
        viewMode,
        layoutMode,
        hierarchyDirection,
        selectedId: selectedLetterId,
      });

      // Apply layout based on mode
      // On mobile, use compact spacing to prevent browser crashes from large SVG viewports
      let layoutedNodes: FlowNode[];
      if (layoutMode === 'radial') {
        layoutedNodes = applyRadialLayout(rawNodes, 600, 400);
      } else {
        layoutedNodes = applyHierarchicalLayout(rawNodes, newEdges, {
          direction: hierarchyDirection,
          nodeSpacing: 30,
          layerSpacing: viewMode === 'letter' ? 200 : 600,
        });
      }

      // Calculate which nodes have source/target edges
      const nodesWithSourceEdge = new Set(newEdges.map((e) => e.source));
      const nodesWithTargetEdge = new Set(newEdges.map((e) => e.target));

      // Add layout info to node data for conditional handle rendering
      const nodesWithLayoutInfo = layoutedNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          layoutMode,
          hierarchyDirection,
          hasSourceEdge: nodesWithSourceEdge.has(node.id),
          hasTargetEdge: nodesWithTargetEdge.has(node.id),
        },
      }));

      // Apply edge type based on current edgeStyle
      const edgesWithStyle = newEdges.map((edge) => ({
        ...edge,
        type: edgeStyle.shape,
        animated: edgeStyle.isAnimated,
      }));

      setNodes(nodesWithLayoutInfo);
      setEdges(edgesWithStyle);

      setTimeout(() => {
        fitView({ padding: 0.2, duration: 300 });
      }, 50);
    }

    updateLayout();
  }, [
    viewMode,
    layoutMode,
    hierarchyDirection,
    edgeStyle.shape,
    selectedLetterId,
  ]);

  // Compute highlighted nodes - uses store-based connectedNodeIds (O(1) lookup)
  // Optimized: only create new objects when values actually change
  const highlightedNodes = useMemo(() => {
    return nodes.map((node) => {
      const isSelected = node.id === selectedNodeId;
      const isConnected = connectedNodeIds.has(node.id);
      const shouldHighlight = isSelected || isConnected;
      const shouldDim = selectedNodeId ? !shouldHighlight : false;

      // Only create new object if highlight/dim state changed
      const currentHighlight = node.data?.isHighlighted ?? false;
      const currentDim = node.data?.isDimmed ?? false;
      if (
        currentHighlight === shouldHighlight &&
        currentDim === shouldDim &&
        node.hidden !== true
      ) {
        return node;
      }

      return {
        ...node,
        hidden: false,
        data: {
          ...node.data,
          isHighlighted: shouldHighlight,
          isDimmed: shouldDim,
        },
      };
    });
  }, [nodes, connectedNodeIds, selectedNodeId]);

  // Compute highlighted edges - uses store-based connectedEdgeIds (O(1) lookup)
  // Optimized: only create new objects when values actually change
  const highlightedEdges = useMemo(() => {
    return edges.map((edge) => {
      const isConnected = connectedEdgeIds.has(edge.id);
      const targetStrokeWidth = isConnected ? 3 : 1;
      const targetOpacity = selectedNodeId ? (isConnected ? 1 : 0.2) : 1;
      const targetAnimated = isConnected ? true : edgeStyle.isAnimated;

      // Only create new object if style changed
      const currentStyle = edge.style as Record<string, unknown> | undefined;
      if (
        edge.hidden !== true &&
        currentStyle?.strokeWidth === targetStrokeWidth &&
        currentStyle?.opacity === targetOpacity &&
        edge.animated === targetAnimated
      ) {
        return edge;
      }

      return {
        ...edge,
        hidden: false,
        style: {
          ...edge.style,
          strokeWidth: targetStrokeWidth,
          opacity: targetOpacity,
        },
        animated: targetAnimated,
      };
    });
  }, [edges, connectedEdgeIds, selectedNodeId, edgeStyle.isAnimated]);

  // Debounce ref for highlight updates
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Handle node click - debounced to prevent rapid highlight recalculations
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      // Clear any pending highlight update
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      // Debounce highlight update (100ms)
      highlightTimeoutRef.current = setTimeout(() => {
        // Toggle selection: if same node clicked again, deselect
        const newSelectedId = selectedNodeId === node.id ? null : node.id;
        updateHighlight(newSelectedId, edges);
      }, 100);
    },
    [selectedNodeId, edges, updateHighlight],
  );

  // Handle pane click - debounced to clear selection
  const handlePaneClick = useCallback(() => {
    // Clear any pending highlight update
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    // Debounce highlight update (100ms)
    highlightTimeoutRef.current = setTimeout(() => {
      updateHighlight(null, edges);
    }, 100);
  }, [edges, updateHighlight]);

  // Memoized letters for filter
  const memoizedLetters = useMemo(() => letters, [letters]);

  // Memoize defaultEdgeOptions to prevent new object reference on every render
  const defaultEdgeOptions = useMemo(
    () => ({
      type: edgeStyle.shape,
      animated: edgeStyle.isAnimated,
    }),
    [edgeStyle.shape, edgeStyle.isAnimated],
  );

  const isUnsupportedMobileView = isMobile && viewMode !== 'letter';

  return (
    <>
      {/*
        Performance optimization: Unmount ReactFlow canvas when quiz is active.
        This prevents two ReactFlow instances from running simultaneously,
        which causes lag on mobile devices.
      */}
      {!isQuizStarted && (
        <div id="tour-canvas" className="h-[calc(100dvh-49px)]">
          <ReactFlow
            dir={dir}
            proOptions={{ hideAttribution: true }}
            colorMode={theme}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodes={isUnsupportedMobileView ? [] : highlightedNodes}
            edges={isUnsupportedMobileView ? [] : highlightedEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            defaultEdgeOptions={defaultEdgeOptions}
            onlyRenderVisibleElements
            edgesFocusable={false}
            zoomOnDoubleClick={false}
            autoPanOnNodeDrag={false}
            autoPanOnNodeFocus={false}
            minZoom={0.1}
          >
            <Panel
              position={dir === 'ltr' ? 'top-left' : 'top-right'}
              className={cn(
                'm-0! flex w-full flex-col gap-2 p-3 sm:w-auto',
                dir === 'rtl' && 'items-end',
              )}
            >
              <GraphFilter
                dir={dir}
                viewMode={viewMode}
                layoutMode={layoutMode}
                hierarchyDirection={hierarchyDirection}
                edgeStyle={edgeStyle}
                letters={memoizedLetters}
                selectedLetterId={selectedLetterId}
                onViewModeChange={setViewMode}
                onLayoutModeChange={setLayoutMode}
                onHierarchyDirectionChange={setHierarchyDirection}
                onEdgeStyleChange={setEdgeStyle}
                onLetterSelect={setSelectedLetterId}
              />

              {!isUnsupportedMobileView && (
                <GraphLegend dir={dir} viewMode={viewMode} />
              )}
            </Panel>

            {!isUnsupportedMobileView && (
              <>
                <Panel
                  position={dir === 'ltr' ? 'bottom-left' : 'bottom-right'}
                  className={cn(
                    'm-0! flex flex-col gap-2 p-3',
                    dir === 'ltr' ? 'items-start' : 'items-end',
                  )}
                >
                  <Button
                    id="tour-quiz"
                    dir={dir}
                    size="sm"
                    onClick={handleOpenQuizDialog}
                    className="bg-linear-to-r from-accent-sky to-accent-sky-dark text-white"
                  >
                    <TrophyIcon className="size-4" />
                    {t('quiz.trigger')}
                  </Button>
                  <GraphDownload />
                  <Button
                    id="tour-help"
                    dir={dir}
                    variant="outline"
                    size="sm"
                    onClick={startTour}
                    className="bg-background!"
                  >
                    <CircleHelpIcon className="size-4" />
                    {t('tour.help_button')}
                  </Button>
                </Panel>

                <Panel
                  id="tour-controls"
                  position={dir === 'ltr' ? 'bottom-right' : 'bottom-left'}
                  className="m-3!"
                >
                  <Controls className="static! m-0!" />
                </Panel>
              </>
            )}

            {/* <MiniMap
              position="bottom-left"
              nodeColor={(node) => {
                if (node.type === 'letter') {
                  return '#F59E0B';
                }

                if (node.type === 'articulationArea' || node.type === 'articulationPoint') {
                  return '#0EA5E9';
                }

                if (node.type === 'traitGroup' || node.type === 'trait') {
                  return '#8B5CF6';
                }

                return '#64748b';
              }}
              maskColor={theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
            /> */}

            <Background
              color="var(--flow-bg-pattern)"
              bgColor="var(--flow-bg-canvas)"
              className="rounded-lg"
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
            />

            {isUnsupportedMobileView && (
              <MobileUnsupported
                onSwitchToLetter={() => setViewMode('letter')}
              />
            )}
          </ReactFlow>
        </div>
      )}
      {/* Quiz component rendered outside ReactFlow so it's always accessible */}
      {isQuizDialogOpen && <Quiz />}
    </>
  );
}
