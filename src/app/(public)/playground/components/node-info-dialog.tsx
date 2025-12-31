import { CircleQuestionMarkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type NodeInfoDialogProps = {
  label: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Reusable dialog component for displaying node information.
 * Used by TraitNode and ArticulationPointNode.
 */
export function NodeInfoDialog({ label, description, open, onOpenChange }: NodeInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="-mx-4 flex flex-row items-center gap-2 border-b px-4 pb-2 capitalize">
          <CircleQuestionMarkIcon className="text-muted-foreground" />
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <p>{description}</p>
      </DialogContent>
    </Dialog>
  );
}
