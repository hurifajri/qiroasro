import { setRequestLocale } from 'next-intl/server';
import { Private } from './_components/private';

type PrivateLayoutProps = React.PropsWithChildren & {
  params: Promise<{ locale: string }>;
  sidebar: React.ReactNode;
};

export default async function PrivateLayout({
  children,
  params,
  sidebar,
}: PrivateLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Private sidebar={sidebar}>{children}</Private>;
}
