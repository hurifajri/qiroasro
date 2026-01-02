'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PointAnimationProps {
  lastPointChange: { value: number; timestamp: number } | null;
}

export function PointAnimation({ lastPointChange }: PointAnimationProps) {
  const [animation, setAnimation] = useState<{ value: number; key: number } | null>(null);

  useEffect(() => {
    if (lastPointChange) {
      setAnimation({ value: lastPointChange.value, key: lastPointChange.timestamp });
    }
  }, [lastPointChange]);

  return (
    <AnimatePresence>
      {animation && (
        <motion.div
          key={animation.key}
          className={cn(
            'pointer-events-none fixed top-1/2 left-1/2 z-50 font-bold text-3xl',
            animation.value > 0 ? 'text-green-500' : 'text-red-500',
          )}
          initial={{ opacity: 1, scale: 1.5, x: '-50%', y: '-50%' }}
          animate={{
            opacity: 0,
            scale: 0.5,
            y: '-150%',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          onAnimationComplete={() => setAnimation(null)}
        >
          {animation.value > 0 ? `+${animation.value}` : animation.value}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
