import { type ConnectionLineComponentProps, getBezierPath, type InternalNode } from '@xyflow/react';
import { getEdgeParams } from '@/lib/graph/floating-edge';

/**
 * Floating Connection Line component - shows a dynamic line while connecting nodes.
 * The line floats from the source node to the cursor position.
 */
export function FloatingConnectionLine({
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
}: ConnectionLineComponentProps) {
  if (!fromNode) {
    return null;
  }

  // Create a virtual target node at the cursor position
  const targetNode = {
    id: 'connection-target',
    width: 1,
    height: 1,
    position: { x: toX, y: toY },
    internals: {
      positionAbsolute: { x: toX, y: toY },
    },
    measured: { width: 1, height: 1 },
  } as InternalNode;

  const { sx, sy } = getEdgeParams(fromNode, targetNode);

  const [path] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path fill="none" stroke="#94a3b8" strokeWidth={2} className="animated" d={path} />
      <circle cx={toX} cy={toY} fill="#1e293b" r={4} stroke="#94a3b8" strokeWidth={2} />
    </g>
  );
}
