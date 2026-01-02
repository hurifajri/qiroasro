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
import type { QuizMode } from '../schemas/quiz';
import { QuizCanvas } from './quiz-canvas';
import { QuizInstruction } from './quiz-instruction';

interface QuizContentProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  theme: ColorMode;
  isChecked: boolean;
  isInstructionShown: boolean;
  mode: QuizMode | null;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  isValidConnection: IsValidConnection;
  onInstructionClose: () => void;
  headerContent?: React.ReactNode;
}

export function QuizContent({
  nodes,
  edges,
  nodeTypes,
  theme,
  isChecked,
  isInstructionShown = false,
  mode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  onInstructionClose,
  headerContent,
}: QuizContentProps) {
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden rounded-lg border">
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
      {isInstructionShown && mode && (
        <QuizInstruction quizMode={mode} onClose={onInstructionClose} />
      )}
    </div>
  );
}
