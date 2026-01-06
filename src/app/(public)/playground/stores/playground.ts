import type { Edge } from '@xyflow/react';
import { createStore } from 'zustand/vanilla';
import type { HierarchyDirection, LayoutMode } from '@/schemas/graph';
import { computeHighlight } from '../lib/edge';
import type { EdgeShape, EdgeStyleOptions, ViewMode } from '../schemas/graph';

interface PlaygroundState {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  selectedLetterId: number | undefined;
  selectedNodeId: string | null;
  edgeStyle: EdgeStyleOptions;
  // Highlight state - computed once when selection changes
  connectedNodeIds: Set<string>;
  connectedEdgeIds: Set<string>;
}

interface PlaygroundAction {
  setViewMode: (mode: ViewMode) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setHierarchyDirection: (direction: HierarchyDirection) => void;
  setSelectedLetterId: (id: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  setEdgeStyle: (style: Partial<EdgeStyleOptions>) => void;
  setIsFloating: (isFloating: boolean) => void;
  setIsAnimated: (isAnimated: boolean) => void;
  setEdgeShape: (shape: EdgeShape) => void;
  getEffectiveEdgeType: () => string;
  // New: Update highlight state based on selected node and edges
  updateHighlight: (selectedNodeId: string | null, edges: Edge[]) => void;
}

export type PlaygroundStore = PlaygroundState & PlaygroundAction;

export function createPlaygroundStore() {
  return createStore<PlaygroundStore>()((set, get) => ({
    viewMode: 'all',
    layoutMode: 'radial',
    hierarchyDirection: 'vertical',
    selectedLetterId: 1,
    selectedNodeId: null,
    edgeStyle: {
      isFloating: true,
      isAnimated: false,
      shape: 'default',
    },
    connectedNodeIds: new Set<string>(),
    connectedEdgeIds: new Set<string>(),
    setViewMode: (mode) => {
      set({ viewMode: mode });
      if (mode !== 'letter') {
        set({ selectedLetterId: 1 });
      }
    },
    setLayoutMode: (mode) => set({ layoutMode: mode }),
    setHierarchyDirection: (direction) => set({ hierarchyDirection: direction }),
    setSelectedLetterId: (id) => set({ selectedLetterId: id }),
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    setEdgeStyle: (style) =>
      set((state) => ({
        edgeStyle: { ...state.edgeStyle, ...style },
      })),
    setIsFloating: (isFloating) =>
      set((state) => ({
        edgeStyle: { ...state.edgeStyle, isFloating },
      })),
    setIsAnimated: (isAnimated) =>
      set((state) => ({
        edgeStyle: { ...state.edgeStyle, isAnimated },
      })),
    setEdgeShape: (shape) =>
      set((state) => ({
        edgeStyle: { ...state.edgeStyle, shape },
      })),
    getEffectiveEdgeType: () => {
      const { edgeStyle } = get();
      return edgeStyle.isFloating ? 'floating' : edgeStyle.shape;
    },
    updateHighlight: (selectedNodeId, edges) => {
      const { connectedNodeIds, connectedEdgeIds } = computeHighlight(selectedNodeId, edges);
      set({ selectedNodeId, connectedNodeIds, connectedEdgeIds });
    },
  }));
}
