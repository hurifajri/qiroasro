import { type EdgeProps, getBezierPath, useStore } from '@xyflow/react';
import type { CSSProperties } from 'react';
import { getEdgeParams } from '@/lib/graph-floating-edge';

/**
 * Floating Edge component - dynamically calculates edge connection points
 * based on the positions of source and target nodes. The edge "floats" around
 * the nodes, connecting at the closest points rather than fixed handles.
 */
export function FloatingEdge({ id, source, target, style, markerEnd }: EdgeProps) {
  const { sourceNode, targetNode } = useStore((s) => {
    const sourceNode = s.nodeLookup.get(source);
    const targetNode = s.nodeLookup.get(target);

    return { sourceNode, targetNode };
  });

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [path] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <g className="react-flow__connection">
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        style={style as CSSProperties}
        markerEnd={markerEnd}
      />
    </g>
  );
}
