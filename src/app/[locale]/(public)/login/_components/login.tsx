import { useTranslations } from 'next-intl';
import { LoginButton } from './login-button';

export function Login() {
  const t = useTranslations('auth_page');

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        <LoginButton
          text={t('login_with_google')}
          errorTitle={t('error_title')}
          errorDesc={t('error_description')}
        />

        <p className="text-center text-muted-foreground text-xs">
          {t('terms')}
        </p>
      </div>
    </div>
  );
}
