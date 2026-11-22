'use client';

import { type ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import {
  EDGE_SHAPES,
  type EdgeShape,
  HIERARCHY_DIRECTIONS,
  type HierarchyDirection,
  LAYOUT_MODES,
  type LayoutMode,
  PARAM_DIRECTION,
  PARAM_LAYOUT,
  PARAM_LETTER,
  PARAM_SHAPE,
  PARAM_VIEW,
  VIEW_MODES,
  type ViewMode,
} from '@/features/tajweed-graph/schemas/graph';
import { usePathname, useRouter } from '@/i18n/navigation';

const PLAYGROUND_QUERY_PARAMS = [
  PARAM_VIEW,
  PARAM_LAYOUT,
  PARAM_DIRECTION,
  PARAM_SHAPE,
  PARAM_LETTER,
] as const;

// Type guards for validation
function isValidViewMode(value: string | null): value is ViewMode {
  return value !== null && VIEW_MODES.includes(value as ViewMode);
}

function isValidLayoutMode(value: string | null): value is LayoutMode {
  return value !== null && LAYOUT_MODES.includes(value as LayoutMode);
}

function isValidHierarchyDirection(
  value: string | null,
): value is HierarchyDirection {
  return (
    value !== null && HIERARCHY_DIRECTIONS.includes(value as HierarchyDirection)
  );
}

function isValidEdgeShape(value: string | null): value is EdgeShape {
  return value !== null && EDGE_SHAPES.includes(value as EdgeShape);
}

function isValidLetterId(value: string | null): boolean {
  if (value === null) return false;
  const num = Number.parseInt(value, 10);
  return !Number.isNaN(num) && num > 0;
}

export interface PlaygroundSettings {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  edgeShape: EdgeShape;
  selectedLetterId: number;
}

export interface UsePlaygroundParamsOptions {
  /** Current values from store */
  currentSettings: PlaygroundSettings;
  /** Callbacks to update store */
  onViewModeChange: (mode: ViewMode) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onHierarchyDirectionChange: (direction: HierarchyDirection) => void;
  onEdgeShapeChange: (shape: EdgeShape) => void;
  onLetterSelect: (id: number) => void;
}

function syncEnumPlaygroundParams(
  searchParams: ReadonlyURLSearchParams,
  {
    currentSettings,
    onViewModeChange,
    onLayoutModeChange,
    onHierarchyDirectionChange,
    onEdgeShapeChange,
  }: UsePlaygroundParamsOptions,
) {
  const viewParam = searchParams.get(PARAM_VIEW);
  if (isValidViewMode(viewParam) && viewParam !== currentSettings.viewMode) {
    onViewModeChange(viewParam);
  }

  const layoutParam = searchParams.get(PARAM_LAYOUT);
  if (
    isValidLayoutMode(layoutParam) &&
    layoutParam !== currentSettings.layoutMode
  ) {
    onLayoutModeChange(layoutParam);
  }

  const directionParam = searchParams.get(PARAM_DIRECTION);
  if (
    isValidHierarchyDirection(directionParam) &&
    directionParam !== currentSettings.hierarchyDirection
  ) {
    onHierarchyDirectionChange(directionParam);
  }

  const shapeParam = searchParams.get(PARAM_SHAPE);
  if (
    isValidEdgeShape(shapeParam) &&
    shapeParam !== currentSettings.edgeShape
  ) {
    onEdgeShapeChange(shapeParam);
  }
}

function syncLetterPlaygroundParam(
  searchParams: ReadonlyURLSearchParams,
  currentLetterId: number,
  onLetterSelect: (id: number) => void,
) {
  const letterParam = searchParams.get(PARAM_LETTER);
  if (!isValidLetterId(letterParam)) return;

  const letterId = Number.parseInt(letterParam!, 10);
  if (letterId !== currentLetterId) {
    onLetterSelect(letterId);
  }
}

/**
 * Hook to sync playground settings with URL query params.
 * - On mount: reads query params and updates store if valid
 */
export function usePlaygroundParams(options: UsePlaygroundParamsOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const clearPlaygroundParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    let hasPlaygroundParams = false;

    for (const key of PLAYGROUND_QUERY_PARAMS) {
      if (params.has(key)) {
        params.delete(key);
        hasPlaygroundParams = true;
      }
    }

    if (!hasPlaygroundParams) return;

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  // Read from URL and update store on mount
  useEffect(() => {
    syncEnumPlaygroundParams(searchParams, options);
    syncLetterPlaygroundParam(
      searchParams,
      options.currentSettings.selectedLetterId,
      options.onLetterSelect,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read URL params once on mount
  }, []);

  return { clearPlaygroundParams };
}
