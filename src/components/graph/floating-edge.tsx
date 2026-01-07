import { type EdgeProps, getBezierPath, useStore } from '@xyflow/react';
import { type CSSProperties, memo } from 'react';
import { getEdgeParams } from '@/lib/graph';

/**
 * Floating Edge component - dynamically calculates edge connection points
 * based on the positions of source and target nodes. The edge "floats" around
 * the nodes, connecting at the closest points rather than fixed handles.
 */
export const FloatingEdge = memo(({ id, source, target, style, markerEnd }: EdgeProps) => {
  // Use equality function to prevent re-renders when positions haven't changed
  const { sourceNode, targetNode } = useStore(
    (s) => {
      const sourceNode = s.nodeLookup.get(source);
      const targetNode = s.nodeLookup.get(target);
      return { sourceNode, targetNode };
    },
    (prev, next) => {
      // Only re-render if node positions actually changed
      const prevSourcePos = prev.sourceNode?.internals?.positionAbsolute;
      const nextSourcePos = next.sourceNode?.internals?.positionAbsolute;
      const prevTargetPos = prev.targetNode?.internals?.positionAbsolute;
      const nextTargetPos = next.targetNode?.internals?.positionAbsolute;

      return (
        prevSourcePos?.x === nextSourcePos?.x &&
        prevSourcePos?.y === nextSourcePos?.y &&
        prevTargetPos?.x === nextTargetPos?.x &&
        prevTargetPos?.y === nextTargetPos?.y
      );
    },
  );

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
});
