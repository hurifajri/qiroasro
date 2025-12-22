import { createStore } from 'zustand/vanilla';
import type {
  HierarchyDirection,
  LayoutMode,
  ViewMode,
} from '@/schemas/common';
import type { EdgeShape, EdgeStyleOptions } from '../schemas/playground';

interface PlaygroundState {
  layoutLoading: boolean;
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  selectedLetterId: number | undefined;
  selectedNodeId: string | null;
  edgeStyle: EdgeStyleOptions;
}

interface PlaygroundAction {
  setLayoutLoading: (loading: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setHierarchyDirection: (direction: HierarchyDirection) => void;
  setSelectedLetterId: (id: number | undefined) => void;
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
    layoutLoading: false,
    viewMode: 'all',
    layoutMode: 'radial',
    hierarchyDirection: 'vertical',
    selectedLetterId: undefined,
    selectedNodeId: null,
    edgeStyle: {
      isFloating: false,
      isAnimated: false,
      shape: 'default',
    },
    setLayoutLoading: (loading) => set({ layoutLoading: loading }),
    setViewMode: (mode) => {
      set({ viewMode: mode });
      if (mode !== 'letter') {
        set({ selectedLetterId: undefined });
      }
    },
    setLayoutMode: (mode) => set({ layoutMode: mode }),
    setHierarchyDirection: (direction) =>
      set({ hierarchyDirection: direction }),
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
