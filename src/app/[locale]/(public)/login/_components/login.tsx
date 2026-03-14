import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginButton } from './login-button';

export function Login() {
  const t = useTranslations('auth_page');

  return (
    <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 p-4 sm:mt-32 sm:max-w-md sm:flex-row">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={null}>
            <LoginButton
              text={t('login_with_google')}
              errorTitle={t('error_title')}
              errorDesc={t('error_description')}
            />
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-muted-foreground text-xs">
            {t('terms')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
