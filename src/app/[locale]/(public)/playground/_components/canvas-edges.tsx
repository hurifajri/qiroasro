'use client';

import { type Edge, useStoreApi } from '@xyflow/react';
import { useCallback, useEffect, useRef } from 'react';

import {
  buildCanvasEdgeItems,
  type CanvasEdgeItem,
  drawCanvasEdgeItems,
} from '../_lib/edge-canvas';

type CanvasEdgesProps = Readonly<{
  edges: Edge[];
}>;

const DEFAULT_EDGE_STROKE = '#b1b1b7';
const MAX_DPR = 2;

export function CanvasEdges({ edges }: CanvasEdgesProps) {
  const store = useStoreApi();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const edgesRef = useRef<Edge[]>(edges);
  const cachedItemsRef = useRef<CanvasEdgeItem[]>([]);
  const dashOffsetRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const syncCanvasSize = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const targetWidth = Math.max(1, Math.round(width * dpr));
      const targetHeight = Math.max(1, Math.round(height * dpr));

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      return dpr;
    },
    [],
  );

  const rebuildAndDraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { nodeLookup, transform, width, height } = store.getState();
    if (width <= 0 || height <= 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = syncCanvasSize(canvas, width, height);
    const items = buildCanvasEdgeItems(
      edgesRef.current,
      nodeLookup,
      DEFAULT_EDGE_STROKE,
    );
    cachedItemsRef.current = items;

    drawCanvasEdgeItems(ctx, items, {
      transform,
      width,
      height,
      dpr,
      dashOffset: dashOffsetRef.current,
    });
  }, [store, syncCanvasSize]);

  const drawOnly = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { transform, width, height } = store.getState();
    if (width <= 0 || height <= 0) return;

    const visibleEdgeCount = edgesRef.current.reduce(
      (count, edge) => (edge.hidden ? count : count + 1),
      0,
    );
    if (cachedItemsRef.current.length < visibleEdgeCount) {
      rebuildAndDraw();
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = syncCanvasSize(canvas, width, height);
    drawCanvasEdgeItems(ctx, cachedItemsRef.current, {
      transform,
      width,
      height,
      dpr,
      dashOffset: dashOffsetRef.current,
    });
  }, [store, syncCanvasSize, rebuildAndDraw]);

  useEffect(() => {
    rebuildAndDraw();

    return store.subscribe((state, prevState) => {
      if (state.width <= 0 || state.height <= 0) return;

      const isTransformOnly =
        state.transform !== prevState.transform &&
        state.nodes === prevState.nodes &&
        state.nodesInitialized === prevState.nodesInitialized &&
        state.width === prevState.width &&
        state.height === prevState.height;

      if (isTransformOnly) {
        drawOnly();
      } else {
        rebuildAndDraw();
      }
    });
  }, [store, rebuildAndDraw, drawOnly]);

  useEffect(() => {
    edgesRef.current = edges;
    rebuildAndDraw();

    const hasAnimatedEdges = edges.some((edge) => edge.animated);
    if (!hasAnimatedEdges) {
      dashOffsetRef.current = 0;
      return;
    }

    const animate = (timestamp: number) => {
      dashOffsetRef.current = 10 - ((timestamp / 500) % 1) * 10;
      drawOnly();
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [edges, rebuildAndDraw, drawOnly]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-1 h-full w-full"
    />
  );
}
