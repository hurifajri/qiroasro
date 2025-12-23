import {
  ArrowDownIcon,
  ArrowRightIcon,
  CircleIcon,
  CompassIcon,
  FilterIcon,
  LayoutGridIcon,
  LinkIcon,
  NetworkIcon,
  SplineIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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

  const VIEW_MODE_LABELS: Record<ViewMode, string> = {
    all: t('view_mode.all'),
    articulation: t('view_mode.articulation'),
    trait: t('view_mode.trait'),
    letter: t('view_mode.letter'),
  };

  const EDGE_SHAPE_LABELS: Record<EdgeShape, string> = {
    default: t('edge.shape.default'),
    straight: t('edge.shape.straight'),
    step: t('edge.shape.step'),
    smoothstep: t('edge.shape.smoothstep'),
  };

  return (
    <header className="flex flex-col gap-2 border-border border-b p-2">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        {/* View Mode */}
        <div className="flex items-center gap-2">
          <FilterIcon className="size-4 text-muted-foreground" />
          <ButtonGroup className="flex-1">
            {(Object.keys(VIEW_MODE_LABELS) as ViewMode[]).map((mode) => (
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
                  'flex-1',
                  viewMode === mode
                    ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:text-white'
                    : 'text-muted-foreground',
                )}
              >
                {VIEW_MODE_LABELS[mode]}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* Divider */}
        <Separator orientation="vertical" className="hidden lg:block" />

        {/* Layout Mode */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <LayoutGridIcon className="size-4 text-muted-foreground" />
            <ButtonGroup className="flex-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLayoutModeChange('radial')}
                className={cn(
                  'flex-1',
                  layoutMode === 'radial'
                    ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:text-white'
                    : 'text-muted-foreground',
                )}
              >
                <CircleIcon className="size-4" />
                {t('layout_mode.radial')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLayoutModeChange('hierarchical')}
                className={cn(
                  'flex-1',
                  layoutMode === 'hierarchical'
                    ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:text-white'
                    : 'text-muted-foreground',
                )}
              >
                <NetworkIcon className="size-4" />
                {t('layout_mode.hierarchical')}
              </Button>
            </ButtonGroup>
          </div>

          {/* Hierarchy Direction Toggle (only visible in hierarchical mode) */}
          {layoutMode === 'hierarchical' && (
            <div className="flex items-center gap-2">
              <CompassIcon className="size-4 text-muted-foreground" />
              <ButtonGroup className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onHierarchyDirectionChange('vertical')}
                  className={cn(
                    'flex-1',
                    hierarchyDirection === 'vertical'
                      ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:text-white'
                      : 'text-muted-foreground',
                  )}
                  title="Vertikal (Atas ke Bawah)"
                >
                  <ArrowDownIcon className="size-4" />
                  {t('layout_mode.direction.vertical')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onHierarchyDirectionChange('horizontal')}
                  className={cn(
                    'flex-1',
                    hierarchyDirection === 'horizontal'
                      ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:text-white'
                      : 'text-muted-foreground',
                  )}
                  title="Horizontal (Kiri ke Kanan)"
                >
                  <ArrowRightIcon className="size-4" />
                  {t('layout_mode.direction.horizontal')}
                </Button>
              </ButtonGroup>
            </div>
          )}
        </div>

        {/* Divider */}
        <Separator orientation="vertical" className="hidden lg:block" />

        {/* Edge Type */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <LinkIcon className="size-4 text-muted-foreground" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdgeStyleChange({ isFloating: !edgeStyle.isFloating })}
              className={cn(
                'flex-1',
                edgeStyle.isFloating
                  ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:text-white'
                  : 'text-muted-foreground',
              )}
            >
              {t('edge.dynamic')}
            </Button>
          </div>

          {/* Edge Shape Selector - only visible when floating is OFF */}
          {!edgeStyle.isFloating && (
            <div className="flex items-center gap-2">
              <SplineIcon className="size-4 text-muted-foreground" />
              <Select
                value={EDGE_SHAPE_LABELS[edgeStyle.shape]}
                onValueChange={(value) => onEdgeStyleChange({ shape: value as EdgeShape })}
              >
                <SelectTrigger size="sm" className="flex-1 text-muted-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(EDGE_SHAPE_LABELS) as EdgeShape[]).map((shape) => (
                    <SelectItem key={shape} value={shape}>
                      {EDGE_SHAPE_LABELS[shape]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Letter Selector (only visible in letter mode) */}
      {viewMode === 'letter' && (
        <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
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
    </header>
  );
}
