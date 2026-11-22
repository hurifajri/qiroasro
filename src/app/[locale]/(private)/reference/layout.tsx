import { ReferenceLayoutWrapper } from './_components/reference-layout-wrapper';

export default function ReferenceLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return <ReferenceLayoutWrapper>{children}</ReferenceLayoutWrapper>;
}
