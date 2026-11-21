'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useState } from 'react';

const CONFETTI_COLORS = [
  '#FFD700',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DFE6E9',
];
const CONFETTI_COUNT = 50;
const CONFETTI_DURATION_MS = 4000;

type ConfettiParticleData = Readonly<{
  id: number;
  delay: number;
  x: number;
  driftX: number;
  duration: number;
  color: string;
  rotation: number;
}>;

function ConfettiParticle({
  delay,
  x,
  driftX,
  duration,
  color,
  rotation,
}: Omit<ConfettiParticleData, 'id'>) {
  return (
    <m.div
      className="pointer-events-none fixed z-50"
      initial={{ y: -20, x, opacity: 1, rotate: 0 }}
      animate={{
        y: '100vh',
        x: x + driftX,
        opacity: 0,
        rotate: rotation,
      }}
      transition={{ duration, delay, ease: 'easeOut' }}
      style={{ left: x }}
    >
      <div className="size-3 rounded-sm" style={{ backgroundColor: color }} />
    </m.div>
  );
}

function createConfettiParticles(): ConfettiParticleData[] {
  const width = typeof window !== 'undefined' ? window.innerWidth : 500;
  return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    x: Math.random() * width,
    driftX: (Math.random() - 0.5) * 200,
    duration: 3 + Math.random() * 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 720 - 360,
  }));
}

export function ChallengeConfetti() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [particles] = useState<ConfettiParticleData[]>(createConfettiParticles);

  useEffect(() => {
    const timer = setTimeout(
      () => setShowConfetti(false),
      CONFETTI_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showConfetti &&
        particles.map((p) => (
          <ConfettiParticle
            key={p.id}
            delay={p.delay}
            x={p.x}
            driftX={p.driftX}
            duration={p.duration}
            color={p.color}
            rotation={p.rotation}
          />
        ))}
    </AnimatePresence>
  );
}
