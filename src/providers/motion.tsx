'use client';

import { LazyMotion } from 'motion/react';

const features = () =>
  import('@/lib/motion-features.js').then((res) => res.default);

export function MotionProvider({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <LazyMotion features={features} strict>
      {children}
    </LazyMotion>
  );
}
