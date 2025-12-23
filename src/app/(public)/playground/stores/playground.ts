import { createStore } from 'zustand/vanilla';
import type { HierarchyDirection, LayoutMode, ViewMode } from '@/schemas/graph';
import type { EdgeShape, EdgeStyleOptions } from '../schemas/playground';

interface PlaygroundState {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  selectedLetterId: number | undefined;
  selectedNodeId: string | null;
  edgeStyle: EdgeStyleOptions;
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
  }));
}
