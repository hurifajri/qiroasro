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
import { CircleHelpIcon, CircleQuestionMarkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WaitlistForm } from '@/components/common/waitlist-form';
import { FloatingConnectionLine } from '@/components/edges/floating-connection-line';
import { FloatingEdge } from '@/components/edges/floating-edge';
import { ArticulationAreaNode, ArticulationPointNode } from '@/components/nodes/articulation-node';
import { LetterNode } from '@/components/nodes/letter-node';
import { TraitGroupNode, TraitNode } from '@/components/nodes/trait-node';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { applyElkLayout, applyRadialLayout } from '@/lib/graph/elk-layout';
import { generateGraphFromData } from '@/lib/graph/utils';
import { useGlobalStore } from '@/providers/global';
import { getArticulationAreasOpt, getArticulationPointsOpt } from '@/queries/articulation';
import { getLetterArticulationsOpt, getLettersOpt, getLetterTraitsOpt } from '@/queries/letter';
import { getTraitGroupsOpt, getTraitsOpt } from '@/queries/trait';
import { usePlaygroundTour } from '../hooks/use-playground-tour';
import { usePlaygroundStore } from '../providers/playground';
import { GraphFilter } from './graph-filter';
import { GraphLegend } from './graph-legend';
import { GraphQuiz } from './graph-quiz';

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
  const { theme } = useGlobalStore((state) => state);
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
  } = usePlaygroundStore((state) => state);

  const { startTour } = usePlaygroundTour({ theme });

  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);

  // Show waitlist dialog after user explores for 60 seconds
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsWaitlistDialogOpen(true);
  //   }, 180 * 1000); // 60 seconds

  //   return () => clearTimeout(timer);
  // }, []);

  // ReactFlow state (local, managed by ReactFlow)
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  // Ref to access current edges without causing effect re-runs
  const edgesRef = useRef(edges);
  edgesRef.current = edges;

  const { data: letters = [] } = useQuery(getLettersOpt());
  const { data: letterArticulations = [] } = useQuery(getLetterArticulationsOpt());
  const { data: letterTraits = [] } = useQuery(getLetterTraitsOpt());
  const { data: articulationAreas = [] } = useQuery(getArticulationAreasOpt());
  const { data: articulationPoints = [] } = useQuery(getArticulationPointsOpt());
  const { data: traits = [] } = useQuery(getTraitsOpt());
  const { data: traitGroups = [] } = useQuery(getTraitGroupsOpt());

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
          // Use ELK for hierarchical layout
          layoutedNodes = await applyElkLayout(rawNodes, newEdges, {
            direction: hierarchyDirection,
            nodeSpacing: 60,
            layerSpacing: 120,
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
      <div id="tour-canvas" className="h-[calc(100dvh-85px)] sm:h-[calc(100dvh-49px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={edgeStyle.isFloating ? FloatingConnectionLine : undefined}
          colorMode={theme}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: computedEdgeType,
            animated: edgeStyle.isAnimated,
          }}
        >
          {/* Top Settings */}
          <div className="absolute top-0 left-0 flex w-full flex-col justify-between gap-2 p-3 sm:flex-row">
            {/* Graph Filter */}
            <Panel position="top-left" className="static! m-0!">
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
            </Panel>

            {/* Graph Legend */}
            <Panel
              position="top-right"
              className="static! m-0! flex flex-col gap-2 self-end sm:self-auto"
            >
              <GraphLegend viewMode={viewMode} />
              <GraphQuiz />
            </Panel>
          </div>

          {/* Bottom Settings */}
          <div className="absolute bottom-0 left-0 z-10 flex w-full items-end justify-between gap-2 p-3 sm:flex-row">
            {/* Help Button */}
            <Panel position="bottom-left" className="static! m-0!">
              <Button
                variant="outline"
                size="sm"
                onClick={startTour}
                className="gap-2 backdrop-blur-sm"
              >
                <CircleHelpIcon className="size-4" />
                {t('tour.help_button')}
              </Button>
            </Panel>

            <div id="tour-controls">
              <Controls position="bottom-right" className="static! m-0!" />
            </div>
          </div>

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

          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        </ReactFlow>
      </div>

      {isWaitlistDialogOpen && (
        <Dialog open={isWaitlistDialogOpen} onOpenChange={setIsWaitlistDialogOpen}>
          <DialogContent>
            <DialogHeader className="-mx-4 flex flex-row items-center gap-2 border-b px-4 pb-2">
              <CircleQuestionMarkIcon className="text-muted-foreground" />
              <DialogTitle>{t('development.is_beneficial')}</DialogTitle>
            </DialogHeader>
            <WaitlistForm source="playground_page" isPlain />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
