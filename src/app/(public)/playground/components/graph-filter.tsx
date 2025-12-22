import type { ColorMode } from '@xyflow/react';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  CircleIcon,
  FilterIcon,
  LayoutGridIcon,
  LinkIcon,
  SplineIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Letter } from '@/schemas/letter';
import type {
  EdgeShape,
  EdgeStyleOptions,
  HierarchyDirection,
  LayoutMode,
  ViewMode,
} from '../stores/playground';

interface GraphFilterProps {
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  hierarchyDirection: HierarchyDirection;
  edgeStyle: EdgeStyleOptions;
  letters: Letter[];
  selectedLetterId?: number;
  colorMode: ColorMode;
  onViewModeChange: (mode: ViewMode) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onHierarchyDirectionChange: (direction: HierarchyDirection) => void;
  onEdgeStyleChange: (style: Partial<EdgeStyleOptions>) => void;
  onLetterSelect: (id: number | undefined) => void;
  onColorModeChange: (mode: ColorMode) => void;
}

const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  all: 'Semua',
  'by-articulation': 'Artikulasi',
  'by-trait': 'Sifat',
  'by-letter': 'Huruf',
};

const EDGE_SHAPE_LABELS: Record<EdgeShape, string> = {
  default: 'Bezier',
  straight: 'Lurus',
  step: 'Langkah',
  smoothstep: 'Halus',
};

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
  return (
    <header className="flex flex-col gap-3 border-border border-b bg-background/80 p-3 backdrop-blur-sm sm:p-4">
      {/* First Row: View Mode and Letter Selector */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-2">
          <FilterIcon className="hidden h-4 w-4 text-muted-foreground sm:block" />
          <ButtonGroup className="rounded-lg bg-muted/50 p-0.5">
            {(Object.keys(VIEW_MODE_LABELS) as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onViewModeChange(mode);
                  if (mode !== 'by-letter') {
                    onLetterSelect(undefined);
                  }
                }}
                className={cn(
                  'px-2 text-xs sm:px-3 sm:text-sm',
                  viewMode === mode
                    ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {VIEW_MODE_LABELS[mode]}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* Letter Selector (only visible in by-letter mode) */}
        {viewMode === 'by-letter' && (
          <div className="flex items-center gap-2">
            <Label className="hidden text-muted-foreground text-sm sm:block">
              Pilih Huruf:
            </Label>
            <div className="flex max-w-xs flex-wrap gap-1 sm:max-w-md">
              {letters.map((letter) => (
                <Button
                  key={letter.id}
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onLetterSelect(letter.id)}
                  className={cn(
                    'h-7 w-7 rounded-full p-0 font-bold text-base sm:h-8 sm:w-8 sm:text-lg',
                    selectedLetterId === letter.id
                      ? 'scale-110 bg-amber-500 text-white shadow-lg hover:bg-amber-600'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80',
                  )}
                  title={letter.slug}
                >
                  {letter.symbol}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Second Row: Layout and Edge Controls */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Layout Mode Toggle */}
        <div className="flex items-center gap-2">
          <Label className="hidden text-muted-foreground text-sm sm:block">
            Layout:
          </Label>
          <ButtonGroup className="rounded-lg bg-muted/50 p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLayoutModeChange('radial')}
              className={cn(
                'gap-1 px-2 text-xs sm:px-3 sm:text-sm',
                layoutMode === 'radial'
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              title="Radial Layout"
            >
              <CircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Radial</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLayoutModeChange('hierarchical')}
              className={cn(
                'gap-1 px-2 text-xs sm:px-3 sm:text-sm',
                layoutMode === 'hierarchical'
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              title="Hierarchical Layout"
            >
              <LayoutGridIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Hirarki</span>
            </Button>
          </ButtonGroup>
        </div>

        {/* Hierarchy Direction Toggle (only visible in hierarchical mode) */}
        {layoutMode === 'hierarchical' && (
          <div className="flex items-center gap-2">
            <Label className="hidden text-muted-foreground text-sm sm:block">
              Arah:
            </Label>
            <ButtonGroup className="rounded-lg bg-muted/50 p-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onHierarchyDirectionChange('vertical')}
                className={cn(
                  'gap-1 px-2 text-xs sm:px-3 sm:text-sm',
                  hierarchyDirection === 'vertical'
                    ? 'bg-violet-500 text-white hover:bg-violet-600'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                title="Vertikal (Atas ke Bawah)"
              >
                <ArrowDownIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Vertikal</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onHierarchyDirectionChange('horizontal')}
                className={cn(
                  'gap-1 px-2 text-xs sm:px-3 sm:text-sm',
                  hierarchyDirection === 'horizontal'
                    ? 'bg-violet-500 text-white hover:bg-violet-600'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                title="Horizontal (Kiri ke Kanan)"
              >
                <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Horizontal</span>
              </Button>
            </ButtonGroup>
          </div>
        )}

        {/* Divider */}
        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        {/* Edge Style Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Floating Edge Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onEdgeStyleChange({ isFloating: !edgeStyle.isFloating })
            }
            className={cn(
              'gap-1 px-2 text-xs sm:px-3 sm:text-sm',
              edgeStyle.isFloating
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
            )}
            title="Toggle floating edges"
          >
            <LinkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Floating</span>
          </Button>

          {/* Edge Shape Selector - only visible when floating is OFF */}
          {!edgeStyle.isFloating && (
            <div className="flex items-center gap-2">
              <SplineIcon className="hidden h-4 w-4 text-muted-foreground sm:block" />
              <Select
                value={edgeStyle.shape}
                onValueChange={(value) =>
                  onEdgeStyleChange({ shape: value as EdgeShape })
                }
              >
                <SelectTrigger
                  size="sm"
                  className="w-24 border-border bg-muted text-foreground text-xs sm:w-28 sm:text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  {(Object.keys(EDGE_SHAPE_LABELS) as EdgeShape[]).map(
                    (shape) => (
                      <SelectItem
                        key={shape}
                        value={shape}
                        className="text-xs sm:text-sm"
                      >
                        {EDGE_SHAPE_LABELS[shape]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
