import { ReferenceLayoutWrapper } from './_components/reference-layout-wrapper';

export default function ReferenceLayout({ children }: React.PropsWithChildren) {
  return <ReferenceLayoutWrapper>{children}</ReferenceLayoutWrapper>;
}
