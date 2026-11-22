import {
  type Edge,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  type Handle,
  type InternalNode,
  Position,
  type Transform,
  type XYPosition,
} from '@xyflow/react';

import { getEdgeParams } from './edge';

const DEFAULT_EDGE_STROKE = '#b1b1b7';
const ANIMATED_DASH_PATTERN = [5, 5];

export interface CanvasEdgeItem {
  path: Path2D;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  dashArray: number[] | null;
  isAnimated: boolean;
  isHighlighted: boolean;
}

interface DrawCanvasEdgeOptions {
  transform: Transform;
  width: number;
  height: number;
  dpr: number;
  dashOffset?: number;
  shouldClear?: boolean;
}

interface DrawEdgesOnCanvasParams extends DrawCanvasEdgeOptions {
  edges: Edge[];
  nodeLookup: Map<string, InternalNode>;
  defaultStroke?: string;
}

function getHandlePoint(
  node: InternalNode,
  handle: Handle | undefined,
  fallbackPosition: Position,
): XYPosition {
  const x = (handle?.x ?? 0) + node.internals.positionAbsolute.x;
  const y = (handle?.y ?? 0) + node.internals.positionAbsolute.y;
  const width = handle?.width ?? node.measured?.width ?? 0;
  const height = handle?.height ?? node.measured?.height ?? 0;
  const position = handle?.position ?? fallbackPosition;

  switch (position) {
    case Position.Top:
      return { x: x + width / 2, y };
    case Position.Right:
      return { x: x + width, y: y + height / 2 };
    case Position.Bottom:
      return { x: x + width / 2, y: y + height };
    case Position.Left:
      return { x, y: y + height / 2 };
  }
}

function getEdgePathString(
  edge: Edge,
  sourceNode: InternalNode,
  targetNode: InternalNode,
): string | null {
  if (
    !sourceNode.measured?.width ||
    !sourceNode.measured?.height ||
    !targetNode.measured?.width ||
    !targetNode.measured?.height
  ) {
    return null;
  }

  if (edge.type === 'floating') {
    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
      sourceNode,
      targetNode,
    );
    const [path] = getBezierPath({
      sourceX: sx,
      sourceY: sy,
      sourcePosition: sourcePos,
      targetX: tx,
      targetY: ty,
      targetPosition: targetPos,
    });
    return path;
  }

  const sourceHandle = sourceNode.internals.handleBounds?.source?.[0];
  const targetHandle = targetNode.internals.handleBounds?.target?.[0];
  if (!sourceHandle || !targetHandle) {
    return null;
  }

  const sourcePosition = sourceHandle.position;
  const targetPosition = targetHandle.position;
  const sourcePoint = getHandlePoint(sourceNode, sourceHandle, Position.Bottom);
  const targetPoint = getHandlePoint(targetNode, targetHandle, Position.Top);

  switch (edge.type) {
    case 'straight': {
      const [path] = getStraightPath({
        sourceX: sourcePoint.x,
        sourceY: sourcePoint.y,
        targetX: targetPoint.x,
        targetY: targetPoint.y,
      });
      return path;
    }
    case 'step': {
      const [path] = getSmoothStepPath({
        sourceX: sourcePoint.x,
        sourceY: sourcePoint.y,
        sourcePosition,
        targetX: targetPoint.x,
        targetY: targetPoint.y,
        targetPosition,
        borderRadius: 0,
      });
      return path;
    }
    case 'smoothstep': {
      const [path] = getSmoothStepPath({
        sourceX: sourcePoint.x,
        sourceY: sourcePoint.y,
        sourcePosition,
        targetX: targetPoint.x,
        targetY: targetPoint.y,
        targetPosition,
      });
      return path;
    }
    case undefined:
    default: {
      const [path] = getBezierPath({
        sourceX: sourcePoint.x,
        sourceY: sourcePoint.y,
        sourcePosition,
        targetX: targetPoint.x,
        targetY: targetPoint.y,
        targetPosition,
      });
      return path;
    }
  }
}

function parseDashArray(dasharray: unknown): number[] | null {
  if (typeof dasharray === 'string') {
    const values = dasharray
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((value) => Number.isFinite(value) && value > 0);
    return values.length > 0 ? values : null;
  }

  if (
    typeof dasharray === 'number' &&
    Number.isFinite(dasharray) &&
    dasharray > 0
  ) {
    return [dasharray];
  }

  return null;
}

function createCanvasEdgeItem(
  edge: Edge,
  nodeLookup: Map<string, InternalNode>,
  defaultStroke: string,
): CanvasEdgeItem | null {
  if (edge.hidden) return null;

  const sourceNode = nodeLookup.get(edge.source);
  const targetNode = nodeLookup.get(edge.target);
  if (!sourceNode || !targetNode) return null;

  const pathStr = getEdgePathString(edge, sourceNode, targetNode);
  if (!pathStr) return null;

  const stroke =
    typeof edge.style?.stroke === 'string' ? edge.style.stroke : defaultStroke;
  const strokeWidth =
    typeof edge.style?.strokeWidth === 'number' ? edge.style.strokeWidth : 1;
  const opacity =
    typeof edge.style?.opacity === 'number' ? edge.style.opacity : 1;

  return {
    path: new Path2D(pathStr),
    stroke,
    strokeWidth,
    opacity,
    dashArray: parseDashArray(edge.style?.strokeDasharray),
    isAnimated: Boolean(edge.animated),
    isHighlighted: strokeWidth > 1,
  };
}

export function buildCanvasEdgeItems(
  edges: Edge[],
  nodeLookup: Map<string, InternalNode>,
  defaultStroke = DEFAULT_EDGE_STROKE,
): CanvasEdgeItem[] {
  const normalItems: CanvasEdgeItem[] = [];
  const highlightedItems: CanvasEdgeItem[] = [];

  for (const edge of edges) {
    const item = createCanvasEdgeItem(edge, nodeLookup, defaultStroke);
    if (!item) continue;

    if (item.isHighlighted) {
      highlightedItems.push(item);
    } else {
      normalItems.push(item);
    }
  }

  return [...normalItems, ...highlightedItems];
}

export function drawCanvasEdgeItems(
  ctx: CanvasRenderingContext2D,
  items: CanvasEdgeItem[],
  options: DrawCanvasEdgeOptions,
): void {
  const {
    transform,
    width,
    height,
    dpr,
    dashOffset = 0,
    shouldClear = true,
  } = options;
  const [tx, ty, zoom] = transform;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (shouldClear) {
    ctx.clearRect(0, 0, Math.round(width * dpr), Math.round(height * dpr));
  }

  if (items.length === 0) {
    ctx.restore();
    return;
  }

  ctx.setTransform(zoom * dpr, 0, 0, zoom * dpr, tx * dpr, ty * dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const item of items) {
    ctx.strokeStyle = item.stroke;
    ctx.lineWidth = item.strokeWidth;
    ctx.globalAlpha = item.opacity;

    if (item.isAnimated) {
      ctx.setLineDash(ANIMATED_DASH_PATTERN);
      ctx.lineDashOffset = dashOffset;
    } else if (item.dashArray) {
      ctx.setLineDash(item.dashArray);
      ctx.lineDashOffset = 0;
    } else {
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    }

    ctx.stroke(item.path);
  }

  ctx.restore();
}

export function drawEdgesOnCanvas(
  ctx: CanvasRenderingContext2D,
  {
    edges,
    nodeLookup,
    defaultStroke = DEFAULT_EDGE_STROKE,
    transform,
    width,
    height,
    dpr,
    dashOffset,
    shouldClear,
  }: DrawEdgesOnCanvasParams,
): void {
  const items = buildCanvasEdgeItems(edges, nodeLookup, defaultStroke);
  drawCanvasEdgeItems(ctx, items, {
    transform,
    width,
    height,
    dpr,
    dashOffset,
    shouldClear,
  });
}
