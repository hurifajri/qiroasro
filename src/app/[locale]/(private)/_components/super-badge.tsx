import { SparklesIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export function SuperBadge() {
  return (
    <Badge className="border-none bg-linear-to-r from-violet-500 to-fuchsia-500 font-bold">
      <SparklesIcon />
      SUPER
    </Badge>
  );
}
