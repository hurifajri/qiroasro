'use client';

import '@xyflow/react/dist/style.css';

import { useQuery } from '@tanstack/react-query';
import {
  Background,
  BackgroundVariant,
  type ColorMode,
  Controls,
  type Edge as FlowEdge,
  type Node as FlowNode,
  // MiniMap,
  Panel,
  ReactFlow,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { CircleHelpIcon, TrophyIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CanvasEdges } from '@/features/tajweed-graph/components/canvas-edges';
import { TAJWEED_NODE_TYPES } from '@/features/tajweed-graph/components/tajweed-graph-nodes';
import {
  applyEdgesHighlight,
  applyNodesHighlight,
  buildLayoutedGraph,
} from '@/features/tajweed-graph/lib/graph-highlight';
import { getRootLetters } from '@/features/tajweed-graph/lib/letter';
import { getPlaygroundDataOpt } from '@/features/tajweed-graph/queries/tajweed-graph';
import { useMounted } from '@/hooks/use-mounted';
import { getLocaleDir } from '@/i18n/locale';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

import { usePlaygroundParams } from '../_hooks/use-playground-params';
import { usePlaygroundTour } from '../_hooks/use-playground-tour';
import { usePlaygroundStore } from '../_providers/playground';
import { useQuizStore } from '../_providers/quiz';
import { GraphFilter } from './graph-filter';
import { GraphLegend } from './graph-legend';

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

const EMPTY_EDGES: FlowEdge[] = [];
const PRO_OPTIONS = { hideAttribution: true };
const FIT_VIEW_OPTIONS = { padding: 0.2 };

export function Playground() {
  const t = useTranslations('playground_page');
  const locale = useLocale() as Locale;
  const dir = getLocaleDir(locale);
  const { theme } = useTheme();
  const { isMounted } = useMounted();
  const colorMode = (isMounted ? theme : 'light') as ColorMode;

  const viewMode = usePlaygroundStore((s) => s.viewMode);
  const layoutMode = usePlaygroundStore((s) => s.layoutMode);
  const hierarchyDirection = usePlaygroundStore((s) => s.hierarchyDirection);
  const selectedLetterId = usePlaygroundStore((s) => s.selectedLetterId);
  const selectedNodeId = usePlaygroundStore((s) => s.selectedNodeId);
  const edgeStyle = usePlaygroundStore((s) => s.edgeStyle);
  const isTraitVisible = usePlaygroundStore((s) => s.isTraitVisible);
  const isArticulationVisible = usePlaygroundStore(
    (s) => s.isArticulationVisible,
  );
  const isFilterOpen = usePlaygroundStore((s) => s.isFilterOpen);
  const isLegendOpen = usePlaygroundStore((s) => s.isLegendOpen);
  const connectedNodeIds = usePlaygroundStore((s) => s.connectedNodeIds);
  const connectedEdgeIds = usePlaygroundStore((s) => s.connectedEdgeIds);
  const setViewMode = usePlaygroundStore((s) => s.setViewMode);
  const setLayoutMode = usePlaygroundStore((s) => s.setLayoutMode);
  const setHierarchyDirection = usePlaygroundStore(
    (s) => s.setHierarchyDirection,
  );
  const setSelectedLetterId = usePlaygroundStore((s) => s.setSelectedLetterId);
  const setEdgeStyle = usePlaygroundStore((s) => s.setEdgeStyle);
  const setIsTraitVisible = usePlaygroundStore((s) => s.setIsTraitVisible);
  const setIsArticulationVisible = usePlaygroundStore(
    (s) => s.setIsArticulationVisible,
  );
  const setIsFilterOpen = usePlaygroundStore((s) => s.setIsFilterOpen);
  const setIsLegendOpen = usePlaygroundStore((s) => s.setIsLegendOpen);
  const resetFilterSettings = usePlaygroundStore((s) => s.resetFilterSettings);
  const updateHighlight = usePlaygroundStore((s) => s.updateHighlight);

  // Sync playground settings with URL query params
  const { clearPlaygroundParams } = usePlaygroundParams({
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

  const handleBeforeTourStart = useCallback(() => {
    setIsFilterOpen(true);
    setIsLegendOpen(true);
    resetFilterSettings();
    clearPlaygroundParams();
  }, [
    setIsFilterOpen,
    setIsLegendOpen,
    resetFilterSettings,
    clearPlaygroundParams,
  ]);

  const { startTour } = usePlaygroundTour({
    theme: colorMode,
    onBeforeStart: handleBeforeTourStart,
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
  const [edges, setEdges] = useState<FlowEdge[]>([]);

  // Fetch data from single consolidated query
  const { data: playgroundData } = useQuery(getPlaygroundDataOpt());
  const letters = useMemo(
    () => playgroundData?.letters ?? [],
    [playgroundData?.letters],
  );

  // Update nodes/edges when data or filters change
  // Data comes from SSR, so it's always available

  useEffect(() => {
    const data = {
      letters: playgroundData?.letters ?? [],
      letterArticulations: playgroundData?.letterArticulations ?? [],
      letterTraits: playgroundData?.letterTraits ?? [],
      articulationAreas: playgroundData?.articulationAreas ?? [],
      articulationPoints: playgroundData?.articulationPoints ?? [],
      traits: playgroundData?.traits ?? [],
      traitGroups: playgroundData?.traitGroups ?? [],
    };

    function updateLayout() {
      const { nodes: nodesWithLayoutInfo, edges: newEdges } =
        buildLayoutedGraph(data, {
          viewMode,
          layoutMode,
          hierarchyDirection,
          selectedLetterId,
          isTraitVisible,
          isArticulationVisible,
          isFloating: edgeStyle.isFloating,
        });

      setNodes(nodesWithLayoutInfo);
      setEdges(newEdges);

      return setTimeout(() => {
        void fitView({ padding: 0.2, duration: 300 });
      }, 50);
    }

    const timer = updateLayout();
    return () => clearTimeout(timer);
  }, [
    playgroundData,
    viewMode,
    layoutMode,
    hierarchyDirection,
    edgeStyle.isFloating,
    selectedLetterId,
    isTraitVisible,
    isArticulationVisible,
    fitView,
    setNodes,
  ]);

  const highlightedNodes = useMemo(
    () => applyNodesHighlight(nodes, selectedNodeId, connectedNodeIds),
    [nodes, connectedNodeIds, selectedNodeId],
  );

  const highlightedEdges = useMemo(
    () =>
      applyEdgesHighlight(edges, {
        selectedNodeId,
        connectedEdgeIds,
        edgeStyle,
      }),
    [edges, connectedEdgeIds, selectedNodeId, edgeStyle],
  );

  // Debounce ref for highlight updates
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

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

  // Letter selector lists the 29 root letters (waw/ya show both variants)
  const memoizedLetters = useMemo(() => getRootLetters(letters), [letters]);

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
            proOptions={PRO_OPTIONS}
            colorMode={colorMode}
            fitView
            fitViewOptions={FIT_VIEW_OPTIONS}
            nodes={highlightedNodes}
            edges={EMPTY_EDGES}
            onNodesChange={onNodesChange}
            nodeTypes={TAJWEED_NODE_TYPES}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            nodeDragThreshold={5}
            nodesConnectable={false}
            nodesFocusable={false}
            edgesFocusable={false}
            selectNodesOnDrag={false}
            elevateNodesOnSelect={false}
            elevateEdgesOnSelect={false}
            zoomOnDoubleClick={false}
            autoPanOnNodeDrag={false}
            autoPanOnNodeFocus={false}
            minZoom={0.1}
            maxZoom={2}
          >
            <CanvasEdges edges={highlightedEdges} />
            <Panel
              position={dir === 'ltr' ? 'top-left' : 'top-right'}
              className={cn(
                'm-0! flex w-full flex-col gap-2 p-3 sm:w-auto',
                dir === 'rtl' && 'items-end',
              )}
            >
              <GraphFilter
                dir={dir}
                isOpen={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                viewMode={viewMode}
                layoutMode={layoutMode}
                hierarchyDirection={hierarchyDirection}
                edgeStyle={edgeStyle}
                isTraitVisible={isTraitVisible}
                isArticulationVisible={isArticulationVisible}
                letters={memoizedLetters}
                selectedLetterId={selectedLetterId}
                onViewModeChange={setViewMode}
                onLayoutModeChange={setLayoutMode}
                onHierarchyDirectionChange={setHierarchyDirection}
                onEdgeStyleChange={setEdgeStyle}
                onTraitVisibleChange={setIsTraitVisible}
                onArticulationVisibleChange={setIsArticulationVisible}
                onLetterSelect={setSelectedLetterId}
              />

              <GraphLegend
                dir={dir}
                isOpen={isLegendOpen}
                onOpenChange={setIsLegendOpen}
                isTraitVisible={isTraitVisible}
                isArticulationVisible={isArticulationVisible}
              />
            </Panel>

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
              <GraphDownload edges={highlightedEdges} />
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
              gap={viewMode === 'all' ? 50 : 20}
              size={viewMode === 'all' ? 2 : 1}
            />
          </ReactFlow>
        </div>
      )}
      {/* Quiz component rendered outside ReactFlow so it's always accessible */}
      {isQuizDialogOpen && <Quiz />}
    </>
  );
}
