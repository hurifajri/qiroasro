'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getArticulationAreasOpt,
  getArticulationPointsOpt,
} from '@/queries/articulation';
import {
  getLetterArticulationsOpt,
  getLettersOpt,
  getLetterTraitsOpt,
} from '@/queries/letter';
import { getTraitGroupsOpt, getTraitsOpt } from '@/queries/trait';
import { usePlaygroundStore } from '../providers/playground';
import { GraphFilter } from './graph-filter';

export function Playground() {
  const {
    viewMode,
    layoutMode,
    hierarchyDirection,
    selectedLetterId,
    edgeStyle,
    setViewMode,
    setLayoutMode,
    setHierarchyDirection,
    setSelectedLetterId,
    setEdgeStyle,
  } = usePlaygroundStore((state) => state);

  const { data: letters = [] } = useQuery(getLettersOpt());
  const { data: letterArticulations } = useQuery(getLetterArticulationsOpt());
  const { data: letterTraits } = useQuery(getLetterTraitsOpt());
  const { data: articulationAreas } = useQuery(getArticulationAreasOpt());
  const { data: articulationPoints } = useQuery(getArticulationPointsOpt());
  const { data: traits } = useQuery(getTraitsOpt());
  const { data: traitGroups } = useQuery(getTraitGroupsOpt());

  console.log('letters', letters);
  console.log('letterArticulations', letterArticulations);
  console.log('letterTraits', letterTraits);
  console.log('articulationAreas', articulationAreas);
  console.log('articulationPoints', articulationPoints);
  console.log('traits', traits);
  console.log('traitGroups', traitGroups);

  return (
    <div className="flex h-screen flex-col">
      <GraphFilter
        viewMode={viewMode}
        layoutMode={layoutMode}
        hierarchyDirection={hierarchyDirection}
        edgeStyle={edgeStyle}
        letters={letters}
        selectedLetterId={selectedLetterId}
        onViewModeChange={setViewMode}
        onLayoutModeChange={setLayoutMode}
        onHierarchyDirectionChange={setHierarchyDirection}
        onEdgeStyleChange={setEdgeStyle}
        onLetterSelect={setSelectedLetterId}
      />
    </div>
  );
}
