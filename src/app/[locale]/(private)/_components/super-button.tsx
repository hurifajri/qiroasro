import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SuperButtonProps = React.PropsWithChildren & {
  onClick: () => void;
  className?: string;
};

export function SuperButton({
  children,
  onClick,
  className,
}: SuperButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'w-full bg-linear-to-r from-violet-500 to-fuchsia-500 font-bold text-white hover:from-violet-600 hover:to-fuchsia-600',
        className,
      )}
    >
      {children}
    </Button>
  );
}
