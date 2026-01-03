'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface PointAnimationProps {
  lastPointChange: { value: number; timestamp: number } | null;
}

interface AnimationItem {
  value: number;
  id: string;
}

export function PointAnimation({ lastPointChange }: PointAnimationProps) {
  const [queue, setQueue] = useState<AnimationItem[]>([]);
  const lastProcessedTimestamp = useRef<number>(0);

  // Add new animation to queue when lastPointChange changes
  useEffect(() => {
    if (lastPointChange && lastPointChange.timestamp > lastProcessedTimestamp.current) {
      lastProcessedTimestamp.current = lastPointChange.timestamp;
      const id = `${lastPointChange.timestamp}-${Math.random()}`;
      setQueue((prev) => [...prev, { value: lastPointChange.value, id }]);
    }
  }, [lastPointChange]);

  // Auto-cleanup after animation duration
  useEffect(() => {
    if (queue.length > 0) {
      const timer = setTimeout(() => {
        setQueue((prev) => prev.slice(1));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [queue.length]);

  if (queue.length === 0) return null;

  return (
    <AnimatePresence mode="popLayout">
      {queue.slice(0, 5).map((item, index) => (
        <motion.div
          key={item.id}
          className={cn(
            'pointer-events-none fixed z-50 font-bold text-3xl',
            item.value > 0 ? 'text-green-500' : 'text-red-500',
          )}
          style={{
            top: '45%',
            left: `calc(50% + ${(index - 2) * 50}px)`,
          }}
          initial={{ opacity: 1, scale: 1.5, y: 0 }}
          animate={{
            opacity: 0,
            scale: 0.8,
            y: -80,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {item.value > 0 ? `+${item.value}` : item.value}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
