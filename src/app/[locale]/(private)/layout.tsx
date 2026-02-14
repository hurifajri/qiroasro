import { setRequestLocale } from 'next-intl/server';
import { Private } from './_components/private';

type PrivateLayoutProps = React.PropsWithChildren & {
  params: Promise<{ locale: string }>;
  header: React.ReactNode;
  sidebar: React.ReactNode;
};

export default async function PrivateLayout({
  children,
  params,
  header,
  sidebar,
}: PrivateLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Private header={header} sidebar={sidebar}>
      {children}
    </Private>
  );
}
