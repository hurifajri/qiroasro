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
  ReactFlowProvider,
} from '@xyflow/react';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { QuizScore } from '../hooks/use-quiz-generator';

interface QuizCanvasProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  theme: ColorMode;
  isChecked: boolean;
  score: QuizScore;
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
  const t = useTranslations('playground_page.quiz');

  return (
    <>
      {isChecked && (
        <div className="absolute flex w-full items-center justify-center gap-2 rounded-lg bg-transparent p-3">
          {score.correct === score.total ? (
            <CheckCircle2Icon className="text-green-500" />
          ) : (
            <XCircleIcon className="text-red-500" />
          )}
          <span className="font-semibold text-lg">
            {t('score', { correct: score.correct, total: score.total })}
          </span>
        </div>
      )}

      <div className="h-100 overflow-hidden rounded-lg border bg-muted/30">
        <ReactFlowProvider>
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
        </ReactFlowProvider>
      </div>
    </>
  );
}
