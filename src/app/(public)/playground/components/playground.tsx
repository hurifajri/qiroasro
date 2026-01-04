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
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FloatingConnectionLine } from '@/components/graph/floating-connection-line';
import { FloatingEdge } from '@/components/graph/floating-edge';
import { Button } from '@/components/ui/button';
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
  const {
    viewMode,
    layoutMode,
    hierarchyDirection,
    selectedLetterId,
    selectedNodeId,
    edgeStyle,
    setViewMode,
    setLayoutMode,
    setHierarchyDirection,
    setSelectedLetterId,
    setSelectedNodeId,
    setEdgeStyle,
    getEffectiveEdgeType,
  } = usePlaygroundStore(useShallow((s) => s));

  const { startTour } = usePlaygroundTour({ theme });

  // Quiz state - to unmount playground canvas when quiz is active (performance optimization)
  const isQuizStarted = useQuizStore((s) => s.isStarted);
  const openQuizDialog = useQuizStore((s) => s.openDialog);

  // ReactFlow state (local, managed by ReactFlow)
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  // Ref to access current edges without causing effect re-runs
  const edgesRef = useRef(edges);
  edgesRef.current = edges;

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

        // Fit view after layout
        setTimeout(() => {
          fitView({ padding: 0.2, duration: 300 });
        }, 50);
      } catch (err) {
        // TODO: handle error
        console.error('Layout error:', err);
      }
    }

    updateLayout();
  }, [
    letters,
    letterArticulations,
    letterTraits,
    articulationAreas,
    articulationPoints,
    traits,
    traitGroups,
    viewMode,
    layoutMode,
    hierarchyDirection,
    selectedLetterId,
    edgeStyle.isFloating,
    edgeStyle.isAnimated,
    setNodes,
    setEdges,
    getEffectiveEdgeType,
    fitView,
  ]);

  // Update edges when edge style changes (without full layout recalc)
  useEffect(() => {
    const effectiveEdgeType = getEffectiveEdgeType();
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        type: effectiveEdgeType,
        animated: edgeStyle.isAnimated,
      })),
    );
  }, [edgeStyle, setEdges, getEffectiveEdgeType]);

  // Update nodes with layout info for conditional handle rendering and positioning
  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isFloating: edgeStyle.isFloating,
          layoutMode,
          hierarchyDirection,
        },
      })),
    );
  }, [edgeStyle.isFloating, layoutMode, hierarchyDirection, setNodes]);

  // Highlight edges and nodes connected to selected node (2-level traversal with category filtering)
  useEffect(() => {
    const allEdges = edgesRef.current;
    const connectedNodeIds = new Set<string>();
    const connectedEdgeIds = new Set<string>();

    // Helper to get node type prefix
    const getNodeType = (nodeId: string): string => {
      if (nodeId.startsWith('letter-')) return 'letter';
      if (nodeId.startsWith('area-')) return 'area';
      if (nodeId.startsWith('point-')) return 'point';
      if (nodeId.startsWith('trait-group-')) return 'traitGroup';
      if (nodeId.startsWith('trait-')) return 'trait';
      return 'unknown';
    };

    // Helper to get category: articulation (area, point) vs trait (trait-group, trait) vs letter
    const getCategory = (nodeType: string): string => {
      if (nodeType === 'area' || nodeType === 'point') return 'articulation';
      if (nodeType === 'traitGroup' || nodeType === 'trait') return 'trait';
      return 'letter'; // letters are neutral, connect to both
    };

    if (selectedNodeId) {
      const selectedType = getNodeType(selectedNodeId);
      const selectedCategory = getCategory(selectedType);

      // Level 1: All direct connections (bidirectional)
      const level1Nodes = new Set<string>();
      for (const edge of allEdges) {
        if (edge.source === selectedNodeId) {
          level1Nodes.add(edge.target);
          connectedNodeIds.add(edge.target);
          connectedEdgeIds.add(edge.id);
        }
        if (edge.target === selectedNodeId) {
          level1Nodes.add(edge.source);
          connectedNodeIds.add(edge.source);
          connectedEdgeIds.add(edge.id);
        }
      }

      // Level 2: Connections of level 1 nodes
      // - EXCLUDE nodes of same type as selected
      // - If selected is point/trait, also EXCLUDE nodes from different category
      for (const nodeId of level1Nodes) {
        for (const edge of allEdges) {
          if (edge.source === nodeId && edge.target !== selectedNodeId) {
            const targetType = getNodeType(edge.target);
            const targetCategory = getCategory(targetType);

            // Skip same type
            if (targetType === selectedType) continue;

            // If selected is point or trait, only allow same category or letters
            if (selectedCategory !== 'letter') {
              if (targetCategory !== selectedCategory && targetCategory !== 'letter') continue;
            }

            connectedNodeIds.add(edge.target);
            connectedEdgeIds.add(edge.id);
          }
          if (edge.target === nodeId && edge.source !== selectedNodeId) {
            const sourceType = getNodeType(edge.source);
            const sourceCategory = getCategory(sourceType);

            // Skip same type
            if (sourceType === selectedType) continue;

            // If selected is point or trait, only allow same category or letters
            if (selectedCategory !== 'letter') {
              if (sourceCategory !== selectedCategory && sourceCategory !== 'letter') continue;
            }

            connectedNodeIds.add(edge.source);
            connectedEdgeIds.add(edge.id);
          }
        }
      }
    }

    // Update edge styles
    setEdges((currentEdges) =>
      currentEdges.map((edge) => {
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
      }),
    );

    // Update node styles for highlighting
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
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
      }),
    );
  }, [selectedNodeId, edgeStyle.isAnimated, setEdges, setNodes]);

  // Handle node click - highlight connected edges
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      // Toggle selection: if same node clicked again, deselect
      setSelectedNodeId(selectedNodeId === node.id ? null : node.id);
    },
    [selectedNodeId, setSelectedNodeId],
  );

  // Handle pane click - clear selection
  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // Memoized letters for filter
  const memoizedLetters = useMemo(() => letters, [letters]);

  // Compute the edge type based on settings
  const computedEdgeType = useMemo(() => {
    return getEffectiveEdgeType();
  }, [getEffectiveEdgeType]);

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
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            connectionLineComponent={edgeStyle.isFloating ? FloatingConnectionLine : undefined}
            minZoom={0.1}
            maxZoom={2}
            defaultEdgeOptions={{
              type: computedEdgeType,
              animated: edgeStyle.isAnimated,
            }}
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
      <Quiz />
    </>
  );
}
