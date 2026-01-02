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
  const processedTimestampsRef = useRef<Set<number>>(new Set());

  // Add new animation to queue when lastPointChange changes
  useEffect(() => {
    if (lastPointChange && !processedTimestampsRef.current.has(lastPointChange.timestamp)) {
      processedTimestampsRef.current.add(lastPointChange.timestamp);
      const id = `${lastPointChange.timestamp}-${lastPointChange.value}`;
      setQueue((prev) => [...prev, { value: lastPointChange.value, id }]);

      // Cleanup old timestamps to prevent memory leak
      if (processedTimestampsRef.current.size > 100) {
        const arr = Array.from(processedTimestampsRef.current);
        processedTimestampsRef.current = new Set(arr.slice(-50));
      }
    }
  }, [lastPointChange]);

  // Remove animation from queue after it completes
  const handleAnimationComplete = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AnimatePresence>
      {queue.map((item, index) => (
        <motion.div
          key={item.id}
          className={cn(
            'pointer-events-none fixed z-50 font-bold text-3xl',
            item.value > 0 ? 'text-green-500' : 'text-red-500',
          )}
          style={{
            top: '50%',
            left: `calc(50% + ${index * 40}px)`,
          }}
          initial={{ opacity: 1, scale: 1.5, x: '-50%', y: '-50%' }}
          animate={{
            opacity: 0,
            scale: 0.5,
            y: '-150%',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onAnimationComplete={() => handleAnimationComplete(item.id)}
        >
          {item.value > 0 ? `+${item.value}` : item.value}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
