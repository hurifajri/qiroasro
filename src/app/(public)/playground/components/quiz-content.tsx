'use client';

import type {
  ColorMode,
  Edge,
  IsValidConnection,
  Node,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react';
import { QuizCanvas } from './quiz-canvas';

interface QuizContentProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  theme: ColorMode;
  isChecked: boolean;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  isValidConnection: IsValidConnection;
  headerContent?: React.ReactNode;
}

export function QuizContent({
  nodes,
  edges,
  nodeTypes,
  theme,
  isChecked,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  headerContent,
}: QuizContentProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border">
      {headerContent}
      <QuizCanvas
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        theme={theme}
        isChecked={isChecked}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      />
    </div>
  );
}
