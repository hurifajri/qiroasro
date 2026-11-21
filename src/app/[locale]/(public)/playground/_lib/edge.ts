import { type InternalNode, Position, type XYPosition } from '@xyflow/react';

/**
 * Get the intersection point of the line between the center of the intersection node
 * and the target node. This determines where the edge should connect to the node.
 */
function getNodeIntersection(
  intersectionNode: InternalNode,
  targetNode: InternalNode,
): XYPosition {
  const { internals: intersectionInternals } = intersectionNode;
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
    intersectionNode.measured ?? { width: 0, height: 0 };
  const { width: targetNodeWidth, height: targetNodeHeight } =
    targetNode.measured ?? { width: 0, height: 0 };
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = Math.max(0, (intersectionNodeWidth ?? 0) / 2);
  const h = Math.max(0, (intersectionNodeHeight ?? 0) / 2);
  const targetW = Math.max(0, (targetNodeWidth ?? 0) / 2);
  const targetH = Math.max(0, (targetNodeHeight ?? 0) / 2);

  const x2 = intersectionInternals.positionAbsolute.x + w;
  const y2 = intersectionInternals.positionAbsolute.y + h;
  const x1 = targetPosition.x + targetW;
  const y1 = targetPosition.y + targetH;

  if (w === 0 || h === 0) {
    return { x: x2, y: y2 };
  }

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const denom = Math.abs(xx1) + Math.abs(yy1);

  if (denom === 0) {
    return { x: x2, y: y2 };
  }

  const a = 1 / denom;
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

interface EdgeParams {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
}

/**
 * Returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) needed to create a floating edge.
 * These parameters are dynamically calculated based on the positions of the source and target nodes.
 */
export function getEdgeParams(
  source: InternalNode,
  target: InternalNode,
): EdgeParams {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

/**
 * Returns the position (top, right, bottom, or left) of the node
 * compared to the intersection point
 */
function getEdgePosition(
  node: InternalNode,
  intersectionPoint: XYPosition,
): Position {
  const nx = Math.round(node.internals.positionAbsolute.x);
  const ny = Math.round(node.internals.positionAbsolute.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + (node.measured?.width ?? 0) - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= ny + (node.measured?.height ?? 0) - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}
