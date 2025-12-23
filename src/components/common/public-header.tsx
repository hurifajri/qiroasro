import { LocaleSelector } from '@/components/common/locale-selector';
import { ThemeSelector } from '@/components/common/theme-selector';
import { cn } from '@/lib/utils';
import { getPersistedGlobalStore } from '@/stores/global';

interface PublicHeaderProps {
  className?: string;
}

export async function PublicHeader({ className }: PublicHeaderProps) {
  const persistedState = await getPersistedGlobalStore();
  const { locale, theme } = persistedState;

  return (
    <header className={cn('flex items-center justify-between gap-2 border-b px-4 py-2', className)}>
      <span className="font-semibold text-xl">QiroAsro</span>
      <div className="flex items-center gap-2">
        <LocaleSelector locale={locale} />
        <ThemeSelector theme={theme} />
      </div>
    </header>
  );
}
