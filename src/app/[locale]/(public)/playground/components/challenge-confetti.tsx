'use client';

import { AnimatePresence, motion } from 'framer-motion';
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

interface ConfettiParticleProps {
  delay: number;
  x: number;
  color: string;
  rotation: number;
}

function ConfettiParticle({
  delay,
  x,
  color,
  rotation,
}: ConfettiParticleProps) {
  return (
    <motion.div
      className="pointer-events-none fixed z-50"
      initial={{ y: -20, x, opacity: 1, rotate: 0 }}
      animate={{
        y: '100vh',
        x: x + (Math.random() - 0.5) * 200,
        opacity: 0,
        rotate: rotation,
      }}
      transition={{ duration: 3 + Math.random() * 2, delay, ease: 'easeOut' }}
      style={{ left: x }}
    >
      <div className="size-3 rounded-sm" style={{ backgroundColor: color }} />
    </motion.div>
  );
}

function useConfettiParticles() {
  const width = window !== undefined ? window.innerWidth : 500;
  const confettiParticles = Array.from({ length: CONFETTI_COUNT }).map(
    (_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
      x: Math.random() * width,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 720 - 360,
    }),
  );

  return confettiParticles;
}

export function ChallengeConfetti() {
  const [showConfetti, setShowConfetti] = useState(true);
  const particles = useConfettiParticles();

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
            color={p.color}
            rotation={p.rotation}
          />
        ))}
    </AnimatePresence>
  );
}
