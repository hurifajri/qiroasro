import { type EdgeProps, getBezierPath, useStore } from '@xyflow/react';
import { memo } from 'react';

import { getEdgeParams } from '../lib/edge';

/**
 * Floating Edge component - dynamically calculates edge connection points
 * based on the positions of source and target nodes. The edge "floats" around
 * the nodes, connecting at the closest points rather than fixed handles.
 */
export const FloatingEdge = memo(function FloatingEdge({
  id,
  source,
  target,
  style,
  markerEnd,
  interactionWidth = 20,
}: EdgeProps) {
  // Use equality function to prevent re-renders when positions haven't changed
  const { sourceNode, targetNode } = useStore(
    (s) => {
      const sourceNode = s.nodeLookup.get(source);
      const targetNode = s.nodeLookup.get(target);
      return { sourceNode, targetNode };
    },
    (prev, next) => {
      // Re-render when node positions or measured dimensions change
      const prevSourcePos = prev.sourceNode?.internals?.positionAbsolute;
      const nextSourcePos = next.sourceNode?.internals?.positionAbsolute;
      const prevTargetPos = prev.targetNode?.internals?.positionAbsolute;
      const nextTargetPos = next.targetNode?.internals?.positionAbsolute;

      return (
        prevSourcePos?.x === nextSourcePos?.x &&
        prevSourcePos?.y === nextSourcePos?.y &&
        prevTargetPos?.x === nextTargetPos?.x &&
        prevTargetPos?.y === nextTargetPos?.y &&
        prev.sourceNode?.measured?.width === next.sourceNode?.measured?.width &&
        prev.sourceNode?.measured?.height ===
          next.sourceNode?.measured?.height &&
        prev.targetNode?.measured?.width === next.targetNode?.measured?.width &&
        prev.targetNode?.measured?.height === next.targetNode?.measured?.height
      );
    },
  );

  if (
    !sourceNode?.measured?.width ||
    !sourceNode?.measured?.height ||
    !targetNode?.measured?.width ||
    !targetNode?.measured?.height
  ) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [path] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <g className="react-flow__edge">
      {/* Invisible wider path for easier click interaction */}
      {interactionWidth > 0 && (
        <path
          d={path}
          fill="none"
          strokeWidth={interactionWidth}
          stroke="transparent"
          style={{ pointerEvents: 'stroke' }}
          className="react-flow__edge-interaction"
        />
      )}
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        style={style}
        markerEnd={markerEnd}
      />
    </g>
  );
});
