import type { ColorMode, EdgeTypes, IsValidConnection } from '@xyflow/react';
import {
  type Edge,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react';
import { useEffect } from 'react';
import { FloatingConnectionLine } from '@/components/graph/floating-connection-line';
import { FloatingEdge } from '@/components/graph/floating-edge';

const edgeTypes: EdgeTypes = { floating: FloatingEdge };
const defaultEdgeOptions = { type: 'floating' };

interface QuizCanvasProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  theme: ColorMode;
  isChecked: boolean;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  isValidConnection: IsValidConnection;
  height: number;
}

export function QuizCanvas({
  nodes,
  edges,
  nodeTypes,
  theme,
  isChecked,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  height,
}: QuizCanvasProps) {
  const { fitView } = useReactFlow();

  // Auto-fit when nodes change (new question loaded)
  useEffect(() => {
    if (nodes.length > 0) {
      // Small delay to ensure nodes are rendered
      const timer = setTimeout(() => {
        fitView({ padding: 0.2, duration: 200 });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [nodes, fitView]);

  return (
    <div style={{ height }}>
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
        connectOnClick={true}
      >
        {/* <Background variant={BackgroundVariant.Dots} gap={20} size={1} /> */}
      </ReactFlow>
    </div>
  );
}
