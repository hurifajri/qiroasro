import {
  ArrowDownIcon,
  ArrowRightIcon,
  ChevronsUpDown,
  CircleIcon,
  CompassIcon,
  FilterIcon,
  LayoutGridIcon,
  LinkIcon,
  NetworkIcon,
  SplineIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EDGE_SHAPES, HIERARCHY_DIRECTIONS, LAYOUT_MODES, VIEW_MODES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { HierarchyDirection, LayoutMode, ViewMode } from '@/schemas/graph';
import type { Letter } from '@/schemas/letter';
import type { EdgeShape, EdgeStyleOptions } from '../schemas/playground';

interface GraphFilterProps {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  edgeStyle: EdgeStyleOptions;
  letters: Letter[];
  selectedLetterId?: number;
  onViewModeChange: (mode: ViewMode) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onHierarchyDirectionChange: (direction: HierarchyDirection) => void;
  onEdgeStyleChange: (style: Partial<EdgeStyleOptions>) => void;
  onLetterSelect: (id: number) => void;
}

export function GraphFilter({
  viewMode,
  layoutMode,
  hierarchyDirection,
  edgeStyle,
  letters,
  selectedLetterId,
  onViewModeChange,
  onLayoutModeChange,
  onHierarchyDirectionChange,
  onEdgeStyleChange,
  onLetterSelect,
}: GraphFilterProps) {
  const t = useTranslations('playground_page.filter');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      id="tour-graph-filter"
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 rounded-lg border backdrop-blur-sm sm:w-72"
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
              <FilterIcon className="size-4 text-muted-foreground" />
              <ButtonGroup className="flex-1">
                {VIEW_MODES.map((mode) => (
                  <Button
                    key={mode}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onViewModeChange(mode);
                      if (mode !== 'letter') {
                        onLetterSelect(1);
                      }
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

            {/* Layout Mode */}
            <li id="tour-layout-mode" className="flex items-center gap-2">
              <LayoutGridIcon className="size-4 text-muted-foreground" />
              <ButtonGroup className="flex-1">
                {LAYOUT_MODES.map((mode) => (
                  <Button
                    key={mode}
                    variant="outline"
                    size="sm"
                    onClick={() => onLayoutModeChange(mode)}
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
              <li id="tour-hierarchy-direction" className="flex items-center gap-2">
                <CompassIcon className="size-4 text-muted-foreground" />
                <ButtonGroup className="flex-1">
                  {HIERARCHY_DIRECTIONS.map((direction) => (
                    <Button
                      key={direction}
                      variant="outline"
                      size="sm"
                      onClick={() => onHierarchyDirectionChange(direction)}
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
            <li id="tour-edge-style" className="flex items-center gap-2">
              <LinkIcon className="size-4 text-muted-foreground" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdgeStyleChange({ isFloating: !edgeStyle.isFloating })}
                className={cn(
                  'flex-1 hover:bg-linear-to-r hover:from-amber-500 hover:to-amber-600 hover:text-white',
                  edgeStyle.isFloating
                    ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white'
                    : 'text-muted-foreground',
                )}
              >
                {t('edge.dynamic')}
              </Button>
            </li>

            {/* Edge Shape Selector - only visible when floating is OFF */}
            {!edgeStyle.isFloating && (
              <li id="tour-edge-shape" className="flex items-center gap-2">
                <SplineIcon className="size-4 text-muted-foreground" />
                <Select
                  value={t(`edge.shape.${edgeStyle.shape}`)}
                  onValueChange={(value) => onEdgeStyleChange({ shape: value as EdgeShape })}
                >
                  <SelectTrigger size="sm" className="flex-1 text-muted-foreground">
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

          {/* Letter Selector (only visible in letter mode) */}
          {viewMode === 'letter' && (
            <ScrollArea
              id="tour-letter-selector"
              className="w-full whitespace-nowrap rounded-lg border"
            >
              <div className="flex w-max items-center gap-2 p-4">
                {letters.map((letter) => (
                  <Button
                    key={letter.id}
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onLetterSelect(letter.id)}
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
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
