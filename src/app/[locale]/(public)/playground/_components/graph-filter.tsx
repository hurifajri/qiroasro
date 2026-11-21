import {
  ArrowDownIcon,
  ArrowRightIcon,
  ChevronsUpDown,
  CircleIcon,
  CompassIcon,
  EyeIcon,
  FilterIcon,
  LayoutGridIcon,
  NetworkIcon,
  SplineIcon,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type {
  EdgeShape,
  EdgeStyleOptions,
  HierarchyDirection,
  LayoutMode,
  ViewMode,
} from '../_schemas/graph';
import {
  EDGE_SHAPES,
  HIERARCHY_DIRECTIONS,
  LAYOUT_MODES,
  PARAM_DIRECTION,
  PARAM_LAYOUT,
  PARAM_LETTER,
  PARAM_SHAPE,
  PARAM_VIEW,
  VIEW_MODES,
} from '../_schemas/graph';
import type { Letter } from '../_schemas/letter';

type GraphFilterProps = Readonly<{
  dir: 'ltr' | 'rtl';
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  edgeStyle: EdgeStyleOptions;
  isArticulationVisible: boolean;
  isTraitVisible: boolean;
  letters: Letter[];
  selectedLetterId: number;
  onViewModeChange: (mode: ViewMode) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onHierarchyDirectionChange: (direction: HierarchyDirection) => void;
  onEdgeStyleChange: (style: Partial<EdgeStyleOptions>) => void;
  onArticulationVisibleChange: (isVisible: boolean) => void;
  onTraitVisibleChange: (isVisible: boolean) => void;
  onLetterSelect: (id: number) => void;
}>;

export function GraphFilter({
  dir,
  viewMode,
  layoutMode,
  hierarchyDirection,
  edgeStyle,
  isArticulationVisible,
  isTraitVisible,
  letters,
  selectedLetterId,
  onViewModeChange,
  onLayoutModeChange,
  onHierarchyDirectionChange,
  onEdgeStyleChange,
  onArticulationVisibleChange,
  onTraitVisibleChange,
  onLetterSelect,
}: GraphFilterProps) {
  const t = useTranslations('playground_page.filter');
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update query params and clean up dependent params
  const updateQueryParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      // Clean up dependent params based on what's being changed
      if (name === PARAM_VIEW) {
        if (value === 'letter') {
          // Auto-set letter=1 when switching to letter view
          params.set(PARAM_LETTER, '1');
        } else {
          // Remove letter param when switching away from letter view
          params.delete(PARAM_LETTER);
        }
      }

      if (name === PARAM_LAYOUT) {
        // Auto-set direction when switching to hierarchical layout
        if (value === 'hierarchical') {
          params.set(PARAM_DIRECTION, 'vertical');
        } else {
          // Remove direction param when switching to radial layout
          params.delete(PARAM_DIRECTION);
        }
      }

      return params.toString();
    },
    [searchParams],
  );

  const visibilityToggles = [
    {
      key: 'articulation',
      isVisible: isArticulationVisible,
      onChange: onArticulationVisibleChange,
    },
    {
      key: 'trait',
      isVisible: isTraitVisible,
      onChange: onTraitVisibleChange,
    },
  ] as const;

  return (
    <Collapsible
      id="tour-graph-filter"
      dir={dir}
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 rounded-lg border bg-background sm:w-96"
    >
      <CollapsibleTrigger
        className={cn(
          'flex items-center justify-between gap-2 p-2 text-left font-semibold text-muted-foreground text-xs',
          isOpen ? 'border-b' : '',
        )}
      >
        {t('title')}
        <ChevronsUpDown className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-2 pt-0">
        <div className="flex flex-col gap-2">
          <ul className="flex flex-col gap-2">
            {/* View Mode */}
            <li id="tour-view-mode" className="flex items-center gap-2">
              <FilterIcon className="size-4 shrink-0 text-muted-foreground" />
              <ButtonGroup dir={dir} className="flex-1">
                {VIEW_MODES.map((mode) => (
                  <Button
                    key={mode}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onViewModeChange(mode);
                      if (mode !== 'letter') onLetterSelect(1);
                      router.push(
                        `${pathname}?${updateQueryParams(PARAM_VIEW, mode)}`,
                      );
                    }}
                    className={cn(
                      'flex-1 hover:bg-linear-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white',
                      viewMode === mode
                        ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white'
                        : 'text-muted-foreground',
                    )}
                  >
                    {t(`view_mode.${mode}`)}
                  </Button>
                ))}
              </ButtonGroup>
            </li>

            {/* Letter Selector (only visible in letter mode) */}
            {viewMode === 'letter' && (
              <li id="tour-letter-selector">
                <ScrollArea
                  dir={dir}
                  className="w-full whitespace-nowrap rounded-lg border"
                >
                  <div className="flex w-max items-center gap-2 p-4">
                    {letters.map((letter) => (
                      <Button
                        key={letter.id}
                        variant="outline"
                        size="icon-sm"
                        onClick={() => {
                          onLetterSelect(letter.id);
                          router.push(
                            `${pathname}?${updateQueryParams(PARAM_LETTER, letter.id.toString())}`,
                          );
                        }}
                        className={cn(
                          'rounded-full',
                          selectedLetterId === letter.id
                            ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:text-white'
                            : 'text-muted-foreground',
                        )}
                      >
                        {letter.symbol}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </li>
            )}

            {/* Visibility toggles (hide/unhide articulation & traits) */}
            <li id="tour-visibility-filter" className="flex items-center gap-2">
              <EyeIcon className="size-4 shrink-0 text-muted-foreground" />
              <ButtonGroup dir={dir} className="flex-1">
                {visibilityToggles.map((toggle) => (
                  <Button
                    key={toggle.key}
                    variant="outline"
                    size="sm"
                    aria-pressed={toggle.isVisible}
                    onClick={() => toggle.onChange(!toggle.isVisible)}
                    className={cn(
                      'flex-1 hover:bg-linear-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white',
                      toggle.isVisible
                        ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white'
                        : 'text-muted-foreground',
                    )}
                  >
                    {t(`visibility.${toggle.key}`)}
                  </Button>
                ))}
              </ButtonGroup>
            </li>

            {/* Layout Mode */}
            <li id="tour-layout-mode" className="flex items-center gap-2">
              <LayoutGridIcon className="size-4 text-muted-foreground" />
              <ButtonGroup dir={dir} className="flex-1">
                {LAYOUT_MODES.map((mode) => (
                  <Button
                    key={mode}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onLayoutModeChange(mode);
                      if (mode !== 'hierarchical')
                        onHierarchyDirectionChange('vertical');
                      router.push(
                        `${pathname}?${updateQueryParams(PARAM_LAYOUT, mode)}`,
                      );
                    }}
                    className={cn(
                      'flex-1 hover:bg-linear-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white',
                      layoutMode === mode
                        ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white'
                        : 'text-muted-foreground',
                    )}
                  >
                    {mode === 'radial' ? (
                      <CircleIcon className="size-4" />
                    ) : (
                      <NetworkIcon className="size-4" />
                    )}
                    {t(`layout_mode.${mode}`)}
                  </Button>
                ))}
              </ButtonGroup>
            </li>

            {/* Hierarchy Direction Toggle (only visible in hierarchical mode) */}
            {layoutMode === 'hierarchical' && (
              <li
                id="tour-hierarchy-direction"
                className="flex items-center gap-2"
              >
                <CompassIcon className="size-4 text-muted-foreground" />
                <ButtonGroup dir={dir} className="flex-1">
                  {HIERARCHY_DIRECTIONS.map((direction) => (
                    <Button
                      key={direction}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onHierarchyDirectionChange(direction);
                        router.push(
                          `${pathname}?${updateQueryParams(PARAM_DIRECTION, direction)}`,
                        );
                      }}
                      className={cn(
                        'flex-1 hover:bg-linear-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white',
                        hierarchyDirection === direction
                          ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white'
                          : 'text-muted-foreground',
                      )}
                    >
                      {direction === 'vertical' ? (
                        <ArrowDownIcon className="size-4" />
                      ) : (
                        <ArrowRightIcon className="size-4" />
                      )}
                      {t(`layout_mode.direction.${direction}`)}
                    </Button>
                  ))}
                </ButtonGroup>
              </li>
            )}

            {/* Edge Type */}
            {/* <li id="tour-edge-style" className="flex items-center gap-2">
              <LinkIcon className="size-4 text-muted-foreground" />
              <Button
                dir={dir}
                variant="outline"
                size="sm"
                onClick={() =>
                  onEdgeStyleChange({ isFloating: !edgeStyle.isFloating })
                }
                className={cn(
                  'flex-1 hover:bg-linear-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white',
                  edgeStyle.isFloating
                    ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white'
                    : 'text-muted-foreground',
                )}
              >
                {t('edge.dynamic')}
              </Button>
            </li> */}

            {/* Edge Shape Selector - only visible when floating is OFF */}
            {!edgeStyle.isFloating && (
              <li id="tour-edge-shape" className="flex items-center gap-2">
                <SplineIcon className="size-4 text-muted-foreground" />
                <Select
                  dir={dir}
                  value={edgeStyle.shape}
                  onValueChange={(value) => {
                    onEdgeStyleChange({ shape: value as EdgeShape });
                    router.push(
                      `${pathname}?${updateQueryParams(PARAM_SHAPE, value)}`,
                    );
                  }}
                >
                  <SelectTrigger
                    size="sm"
                    className="flex-1 text-muted-foreground"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EDGE_SHAPES.map((shape) => (
                      <SelectItem key={shape} value={shape}>
                        {t(`edge.shape.${shape}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
            )}
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
