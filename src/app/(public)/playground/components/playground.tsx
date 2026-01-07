'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Background,
  BackgroundVariant,
  Controls,
  type EdgeTypes,
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
import '@xyflow/react/dist/style.css';
import { CircleHelpIcon, TrophyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FloatingConnectionLine } from '@/components/graph/floating-connection-line';
import { FloatingEdge } from '@/components/graph/floating-edge';
import { Button } from '@/components/ui/button';
import { isMobile } from '@/lib/device';
import { applyHierarchicalLayout, applyRadialLayout } from '@/lib/graph';
import { useGlobalStore } from '@/providers/global';
import { usePlaygroundTour } from '../hooks/use-playground-tour';
import { generateGraphFromData } from '../lib/graph';
import { usePlaygroundStore } from '../providers/playground';
import { useQuizStore } from '../providers/quiz';
import { getPlaygroundDataOpt } from '../queries/playground';
import { GraphDownload } from './graph-download';
import { GraphFilter } from './graph-filter';
import { GraphLegend } from './graph-legend';
import { ArticulationAreaNode, ArticulationPointNode } from './node-articulation';
import { LetterNode } from './node-letter';
import { TraitGroupNode, TraitNode } from './node-trait';
import { Quiz } from './quiz';

// Register custom node types
const nodeTypes: NodeTypes = {
  letter: LetterNode,
  articulationArea: ArticulationAreaNode,
  articulationPoint: ArticulationPointNode,
  traitGroup: TraitGroupNode,
  trait: TraitNode,
};

// Register custom edge types
const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
};

export function Playground() {
  const t = useTranslations('playground_page');

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
  const setHierarchyDirection = usePlaygroundStore((s) => s.setHierarchyDirection);
  const setSelectedLetterId = usePlaygroundStore((s) => s.setSelectedLetterId);
  const setEdgeStyle = usePlaygroundStore((s) => s.setEdgeStyle);
  const getEffectiveEdgeType = usePlaygroundStore((s) => s.getEffectiveEdgeType);
  const updateHighlight = usePlaygroundStore((s) => s.updateHighlight);

  // Quiz state - to unmount playground canvas when quiz is active (performance optimization)
  const isQuizDialogOpen = useQuizStore((s) => s.isDialogOpen);
  const isQuizStarted = useQuizStore((s) => s.isStarted);
  const openQuizDialog = useQuizStore((s) => s.openDialog);

  // ReactFlow state (local, managed by ReactFlow)
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  // Interaction state for dimming
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

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
      try {
        // Generate nodes and edges (without positions)
        const { nodes: rawNodes, edges: newEdges } = generateGraphFromData(data, {
          viewMode,
          layoutMode,
          hierarchyDirection,
          selectedId: selectedLetterId,
        });

        // Apply layout based on mode
        let layoutedNodes: FlowNode[];
        if (layoutMode === 'radial') {
          layoutedNodes = applyRadialLayout(rawNodes, 600, 400);
        } else {
          layoutedNodes = applyHierarchicalLayout(rawNodes, newEdges, {
            direction: hierarchyDirection,
            nodeSpacing: 60,
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
            isFloating: edgeStyle.isFloating,
            layoutMode,
            hierarchyDirection,
            hasSourceEdge: nodesWithSourceEdge.has(node.id),
            hasTargetEdge: nodesWithTargetEdge.has(node.id),
          },
        }));

        // Apply edge type based on current edgeStyle
        const effectiveEdgeType = getEffectiveEdgeType();
        const edgesWithStyle = newEdges.map((edge) => ({
          ...edge,
          type: effectiveEdgeType,
          animated: edgeStyle.isAnimated,
        }));

        setNodes(nodesWithLayoutInfo);
        setEdges(edgesWithStyle);

        // Fit view after layout - use requestAnimationFrame for visual transitions
        // requestAnimationFrame(() => {
        //   fitView({ padding: 0.2, duration: 300 });
        // });
        setTimeout(() => {
          fitView({ padding: 0.2, duration: 300 });
        }, 50);
      } catch (err) {
        // Report layout errors to Sentry for debugging
        if (typeof window !== 'undefined') {
          import('@sentry/nextjs').then((Sentry) => {
            Sentry.captureException(err, {
              tags: { component: 'playground', action: 'layout_update' },
              extra: { viewMode, layoutMode, hierarchyDirection, selectedLetterId },
            });
          });
        }
      }
    }

    updateLayout();
  }, [
    viewMode,
    layoutMode,
    hierarchyDirection,
    edgeStyle.isFloating,
    edgeStyle.shape,
    selectedLetterId,
  ]);

  // Compute highlighted nodes - uses store-based connectedNodeIds (O(1) lookup)
  const highlightedNodes = useMemo(() => {
    return nodes.map((node) => {
      // Hide during pan/zoom (mobile only for performance)
      if (isMobile() && isMoving && node.type !== 'letter') {
        return { ...node, hidden: true };
      }

      const isSelected = node.id === selectedNodeId;
      const isConnected = connectedNodeIds.has(node.id);
      const shouldHighlight = isSelected || isConnected;

      return {
        ...node,
        data: {
          ...node.data,
          isHighlighted: shouldHighlight,
          isConnectedToSelected: isConnected,
          isDimmed: selectedNodeId ? !shouldHighlight : false,
        },
      };
    });
  }, [nodes, connectedNodeIds, selectedNodeId, isMoving]);

  // Compute highlighted edges - uses store-based connectedEdgeIds (O(1) lookup)
  const highlightedEdges = useMemo(() => {
    return edges.map((edge) => {
      // Hide during pan/zoom (mobile only for performance)
      if (isMobile() && isMoving) {
        return { ...edge, hidden: true };
      }

      const isConnected = connectedEdgeIds.has(edge.id);

      return {
        ...edge,
        style: {
          ...edge.style,
          strokeWidth: isConnected ? 3 : 1,
          opacity: selectedNodeId ? (isConnected ? 1 : 0.2) : 1,
        },
        animated: isConnected ? true : edgeStyle.isAnimated,
      };
    });
  }, [edges, connectedEdgeIds, selectedNodeId, edgeStyle.isAnimated, isMoving]);

  // Debounce ref for highlight updates
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Handle node drag start
  const handleNodeDragStart = useCallback((_event: React.MouseEvent, node: FlowNode) => {
    setDraggingNodeId(node.id);
  }, []);

  // Handle node drag stop
  const handleNodeDragStop = useCallback(() => {
    setDraggingNodeId(null);
  }, []);

  // Handle pan/zoom start
  const handleMoveStart = useCallback(() => {
    setIsMoving(true);
  }, []);

  // Handle pan/zoom end
  const handleMoveEnd = useCallback(() => {
    setIsMoving(false);
  }, []);

  // Memoized letters for filter
  const memoizedLetters = useMemo(() => letters, [letters]);

  // Compute the edge type based on settings
  const computedEdgeType = useMemo(() => {
    return getEffectiveEdgeType();
  }, [getEffectiveEdgeType]);

  // Memoize defaultEdgeOptions to prevent new object reference on every render
  const defaultEdgeOptions = useMemo(
    () => ({
      type: computedEdgeType,
      animated: edgeStyle.isAnimated,
    }),
    [computedEdgeType, edgeStyle.isAnimated],
  );

  // Memoize connectionLineComponent to prevent new reference on every render
  const connectionLineComponent = useMemo(
    () => (edgeStyle.isFloating ? FloatingConnectionLine : undefined),
    [edgeStyle.isFloating],
  );

  return (
    <>
      {/*
        Performance optimization: Unmount ReactFlow canvas when quiz is active.
        This prevents two ReactFlow instances from running simultaneously,
        which causes lag on mobile devices.
      */}
      {!isQuizStarted && (
        <div id="tour-canvas" className="h-[calc(100dvh-85px)] sm:h-[calc(100dvh-49px)]">
          <ReactFlow
            proOptions={{ hideAttribution: true }}
            colorMode={theme}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodes={highlightedNodes}
            edges={highlightedEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            onNodeDragStart={handleNodeDragStart}
            onNodeDragStop={handleNodeDragStop}
            onMoveStart={handleMoveStart}
            onMoveEnd={handleMoveEnd}
            connectionLineComponent={connectionLineComponent}
            minZoom={0.1}
            maxZoom={1.5}
            defaultEdgeOptions={defaultEdgeOptions}
            onlyRenderVisibleElements
            edgesFocusable={false}
          >
            <Panel
              position="top-right"
              className="m-0! flex w-full flex-col items-end gap-2 p-3 sm:w-auto"
            >
              <GraphFilter
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
              <GraphLegend viewMode={viewMode} />
            </Panel>

            <Panel position="bottom-left" className="m-0! flex flex-col items-start gap-2 p-3">
              <Button
                id="tour-quiz"
                size="sm"
                onClick={openQuizDialog}
                className="bg-linear-to-r from-accent-sky to-accent-sky-dark text-white"
              >
                <TrophyIcon className="size-4" />
                {t('quiz.trigger')}
              </Button>
              <GraphDownload />
              <Button
                id="tour-help"
                variant="outline"
                size="sm"
                onClick={startTour}
                className="bg-background!"
              >
                <CircleHelpIcon className="size-4" />
                {t('tour.help_button')}
              </Button>
            </Panel>

            <Panel id="tour-controls" position="bottom-right" className="m-3!">
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
              color={theme === 'light' ? 'oklch(0.13 0.028 261.692)' : 'oklch(1 0 0)'}
              bgColor={theme === 'light' ? 'oklch(1 0 0)' : 'oklch(0.13 0.028 261.692)'}
              className="rounded-lg"
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
            />
          </ReactFlow>
        </div>
      )}
      {/* Quiz component rendered outside ReactFlow so it's always accessible */}
      {isQuizDialogOpen && <Quiz />}
    </>
  );
}
