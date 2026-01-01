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
  useReactFlow,
} from '@xyflow/react';
import { useEffect } from 'react';
import type { QuizScore as QuizScoreType } from '../schemas/graph';
import { QuizScore } from './quiz-score';

interface QuizCanvasProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  theme: ColorMode;
  isChecked: boolean;
  score: QuizScoreType;
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
  score,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
}: QuizCanvasProps) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    // Small delay to ensure nodes are rendered before fitting
    const timeout = setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 50);
    return () => clearTimeout(timeout);
  }, [fitView]);

  return (
    <div className="relative h-100 overflow-hidden rounded-lg border bg-muted/30">
      {isChecked && <QuizScore score={score} />}
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
