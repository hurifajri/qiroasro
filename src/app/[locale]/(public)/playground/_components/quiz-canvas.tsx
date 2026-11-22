'use client';

import {
  Background,
  type ColorMode,
  type Edge,
  type EdgeMouseHandler,
  type EdgeTypes,
  type IsValidConnection,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useEffect } from 'react';

import { useQuizStore } from '../_providers/quiz';
import { FloatingConnectionLine } from './ui/floating-connection-line';
import { FloatingEdge } from './ui/floating-edge';

const edgeTypes: EdgeTypes = { floating: FloatingEdge };
const defaultEdgeOptions = { type: 'floating' };
const PRO_OPTIONS = { hideAttribution: true };
const FIT_VIEW_OPTIONS = { padding: 0.2 };

type QuizCanvasProps = Readonly<{
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  theme: ColorMode;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  isValidConnection: IsValidConnection;
  height: number;
}>;

export function QuizCanvas({
  nodes,
  edges,
  nodeTypes,
  theme,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  height,
}: QuizCanvasProps) {
  const { fitView } = useReactFlow();

  const isChecked = useQuizStore((s) => s.isChecked);

  // Handle edge click to delete edge (only when not checked)
  const handleEdgeClick: EdgeMouseHandler = useCallback(
    (_, edge) => {
      if (isChecked) return;
      onEdgesChange([{ type: 'remove', id: edge.id }]);
    },
    [isChecked, onEdgesChange],
  );

  // Auto-fit only when the set of node IDs changes (new question loaded)
  const nodeIdsKey = nodes.map((n) => n.id).join(',');
  useEffect(() => {
    if (!nodeIdsKey) return;

    // Small delay to ensure nodes are rendered
    const timer = setTimeout(() => {
      void fitView({ padding: 0.2, duration: 200 });
    }, 50);
    return () => clearTimeout(timer);
  }, [nodeIdsKey, fitView]);

  return (
    <div style={{ height }}>
      <ReactFlow
        proOptions={PRO_OPTIONS}
        colorMode={theme}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineComponent={FloatingConnectionLine}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodesDraggable={false}
        nodesConnectable={!isChecked}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        autoPanOnConnect={false}
        connectOnClick={true}
        className="rounded-lg"
      >
        <Background
          color="var(--flow-bg-pattern)"
          bgColor="var(--flow-bg-canvas)"
          className="rounded-lg"
        />
      </ReactFlow>
    </div>
  );
}
