'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';

export function LogoutButton() {
  const t = useTranslations('global.private_layout');
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    try {
      setIsPending(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/');
            router.refresh();
          },
        },
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isPending}>
      {t('logout')}
    </Button>
  );
}
