import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Private } from './_components/private';

type PrivateLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PrivateLayout({
  children,
  params,
}: PrivateLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Private>{children}</Private>;
}
