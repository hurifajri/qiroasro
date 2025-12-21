import type { RemoteTrait, RemoteTraitGroup } from '@/schemas/trait';

function transformRemoteTrait(remoteTrait: RemoteTrait) {
  return {
    id: remoteTrait.id,
    groupId: remoteTrait.group_id,
    isMiddleTrait: remoteTrait.is_middle_trait,
    slug: remoteTrait.slug,
    sortOrder: remoteTrait.sort_order,
  };
}

export function transformRemoteTraits(remoteTraits: RemoteTrait[]) {
  return remoteTraits.map((trait) => transformRemoteTrait(trait));
}

function transformRemoteTraitGroup(remoteTraitGroup: RemoteTraitGroup) {
  return {
    id: remoteTraitGroup.id,
    isLazimah: remoteTraitGroup.is_lazimah,
    hasMiddleTrait: remoteTraitGroup.has_middle_trait,
    slug: remoteTraitGroup.slug,
    sortOrder: remoteTraitGroup.sort_order,
  };
}

export function transformRemoteTraitGroups(
  remoteTraitGroups: RemoteTraitGroup[],
) {
  return remoteTraitGroups.map((traitGroup) =>
    transformRemoteTraitGroup(traitGroup),
  );
}
