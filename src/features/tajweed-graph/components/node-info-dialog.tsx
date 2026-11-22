import { CircleQuestionMarkIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type NodeInfoDialogProps = Readonly<{
  label: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

/**
 * Reusable dialog component for displaying node information.
 * Used by TraitNode, ArticulationPointNode, and TargetQuizNode.
 */
export function NodeInfoDialog({
  label,
  description,
  open,
  onOpenChange,
}: NodeInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="-mx-4 flex flex-row items-center gap-2 border-b px-4 pb-2 capitalize">
          <CircleQuestionMarkIcon className="text-muted-foreground" />
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        <p>{description}</p>
      </DialogContent>
    </Dialog>
  );
}
