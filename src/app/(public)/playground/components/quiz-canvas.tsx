import type { ColorMode, IsValidConnection } from '@xyflow/react';
import {
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
} from '@xyflow/react';

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
}: QuizCanvasProps) {
  return (
    <div className="relative h-100 overflow-hidden rounded-lg border bg-muted/30">
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
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
