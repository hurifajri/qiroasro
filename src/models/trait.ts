import type { RemoteTrait } from '@/schemas/trait';

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
