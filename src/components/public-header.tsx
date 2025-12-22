import { LocaleSelector } from '@/components/locale-selector';
import { ThemeSelector } from '@/components/theme-selector';
import { cn } from '@/lib/utils';
import { getPersistedGlobalStore } from '@/stores/global';

interface PublicHeaderProps {
  className?: string;
}

export async function PublicHeader({ className }: PublicHeaderProps) {
  const persistedState = await getPersistedGlobalStore();
  const { locale, theme } = persistedState;

  return (
    <header className={cn('flex items-center justify-end gap-2 p-2', className)}>
      <LocaleSelector locale={locale} />
      <ThemeSelector theme={theme} />
    </header>
  );
}
