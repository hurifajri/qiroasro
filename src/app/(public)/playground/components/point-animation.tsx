'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface PointAnimationProps {
  challengeLastPointChange: { value: number; timestamp: number } | null;
}

interface AnimationItem {
  value: number;
  id: string;
}

export function PointAnimation({ challengeLastPointChange }: PointAnimationProps) {
  const [queue, setQueue] = useState<AnimationItem[]>([]);
  const lastProcessedTimestamp = useRef<number>(0);

  // Add new animation to queue when challengeLastPointChange changes
  useEffect(() => {
    if (
      challengeLastPointChange &&
      challengeLastPointChange.timestamp > lastProcessedTimestamp.current
    ) {
      lastProcessedTimestamp.current = challengeLastPointChange.timestamp;
      const id = `${challengeLastPointChange.timestamp}-${Math.random()}`;
      setQueue((prev) => [...prev, { value: challengeLastPointChange.value, id }]);
    }
  }, [challengeLastPointChange]);

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
