import type { Edge } from '@xyflow/react';
import { createStore } from 'zustand/vanilla';
import { computeHighlight } from '../_lib/graph-traversal';
import type {
  EdgeShape,
  EdgeStyleOptions,
  HierarchyDirection,
  LayoutMode,
  ViewMode,
} from '../_schemas/graph';

interface PlaygroundState {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  selectedLetterId: number;
  selectedNodeId: string | null;
  edgeStyle: EdgeStyleOptions;
  isTraitVisible: boolean;
  isArticulationVisible: boolean;
  isFilterOpen: boolean;
  isLegendOpen: boolean;
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
  setIsTraitVisible: (isVisible: boolean) => void;
  setIsArticulationVisible: (isVisible: boolean) => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  setIsLegendOpen: (isOpen: boolean) => void;
  setIsFloating: (isFloating: boolean) => void;
  setIsAnimated: (isAnimated: boolean) => void;
  setEdgeShape: (shape: EdgeShape) => void;
  resetFilterSettings: () => void;
  getEffectiveEdgeType: () => string;
  // New: Update highlight state based on selected node and edges
  updateHighlight: (selectedNodeId: string | null, edges: Edge[]) => void;
}

export type PlaygroundStore = PlaygroundState & PlaygroundAction;

const INITIAL_FILTER_SETTINGS: Pick<
  PlaygroundState,
  | 'viewMode'
  | 'layoutMode'
  | 'hierarchyDirection'
  | 'selectedLetterId'
  | 'edgeStyle'
  | 'isTraitVisible'
  | 'isArticulationVisible'
> = {
  viewMode: 'letter',
  layoutMode: 'hierarchical',
  hierarchyDirection: 'horizontal',
  selectedLetterId: 1,
  edgeStyle: {
    isFloating: false,
    isAnimated: false,
    shape: 'default',
  },
  isTraitVisible: true,
  isArticulationVisible: true,
};

export function createPlaygroundStore() {
  return createStore<PlaygroundStore>()((set, get) => ({
    ...INITIAL_FILTER_SETTINGS,
    edgeStyle: { ...INITIAL_FILTER_SETTINGS.edgeStyle },
    selectedNodeId: null,
    isFilterOpen: true,
    isLegendOpen: true,
    connectedNodeIds: new Set<string>(),
    connectedEdgeIds: new Set<string>(),
    setViewMode: (mode) => {
      set({
        viewMode: mode,
        // Reset highlight state when viewMode changes
        selectedNodeId: null,
        connectedNodeIds: new Set<string>(),
        connectedEdgeIds: new Set<string>(),
      });
    },
    setLayoutMode: (mode) => set({ layoutMode: mode }),
    setHierarchyDirection: (direction) =>
      set({ hierarchyDirection: direction }),
    setSelectedLetterId: (id) =>
      set({
        selectedLetterId: id,
        selectedNodeId: null,
        connectedNodeIds: new Set<string>(),
        connectedEdgeIds: new Set<string>(),
      }),
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    setEdgeStyle: (style) =>
      set((state) => ({
        edgeStyle: { ...state.edgeStyle, ...style },
      })),
    setIsTraitVisible: (isTraitVisible) =>
      set({
        isTraitVisible,
        // Reset highlight state since hidden nodes can't stay selected
        selectedNodeId: null,
        connectedNodeIds: new Set<string>(),
        connectedEdgeIds: new Set<string>(),
      }),
    setIsArticulationVisible: (isArticulationVisible) =>
      set({
        isArticulationVisible,
        selectedNodeId: null,
        connectedNodeIds: new Set<string>(),
        connectedEdgeIds: new Set<string>(),
      }),
    setIsFilterOpen: (isFilterOpen) => set({ isFilterOpen }),
    setIsLegendOpen: (isLegendOpen) => set({ isLegendOpen }),
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
    resetFilterSettings: () => {
      const state = get();
      const isAlreadyDefault =
        state.viewMode === INITIAL_FILTER_SETTINGS.viewMode &&
        state.layoutMode === INITIAL_FILTER_SETTINGS.layoutMode &&
        state.hierarchyDirection ===
          INITIAL_FILTER_SETTINGS.hierarchyDirection &&
        state.selectedLetterId === INITIAL_FILTER_SETTINGS.selectedLetterId &&
        state.edgeStyle.isFloating ===
          INITIAL_FILTER_SETTINGS.edgeStyle.isFloating &&
        state.edgeStyle.isAnimated ===
          INITIAL_FILTER_SETTINGS.edgeStyle.isAnimated &&
        state.edgeStyle.shape === INITIAL_FILTER_SETTINGS.edgeStyle.shape &&
        state.isTraitVisible === INITIAL_FILTER_SETTINGS.isTraitVisible &&
        state.isArticulationVisible ===
          INITIAL_FILTER_SETTINGS.isArticulationVisible &&
        state.selectedNodeId === null;

      if (isAlreadyDefault) return;

      set({
        ...INITIAL_FILTER_SETTINGS,
        edgeStyle: { ...INITIAL_FILTER_SETTINGS.edgeStyle },
        selectedNodeId: null,
        connectedNodeIds: new Set<string>(),
        connectedEdgeIds: new Set<string>(),
      });
    },
    getEffectiveEdgeType: () => {
      const { edgeStyle } = get();
      return edgeStyle.isFloating ? 'floating' : edgeStyle.shape;
    },
    updateHighlight: (selectedNodeId, edges) => {
      const { connectedNodeIds, connectedEdgeIds } = computeHighlight(
        selectedNodeId,
        edges,
      );
      set({ selectedNodeId, connectedNodeIds, connectedEdgeIds });
    },
  }));
}
