'use client';

import { motion } from 'framer-motion';

interface UnderConstructionIllustrationProps {
  className?: string;
}

export function UnderConstructionIllustration({ className }: UnderConstructionIllustrationProps) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <title>Under Construction</title>

      {/* Floating particles */}
      {[
        { cx: 80, cy: 80, r: 4, delay: 0 },
        { cx: 320, cy: 60, r: 3, delay: 0.3 },
        { cx: 350, cy: 200, r: 5, delay: 0.6 },
        { cx: 60, cy: 220, r: 3, delay: 0.9 },
        { cx: 150, cy: 50, r: 4, delay: 1.2 },
        { cx: 280, cy: 240, r: 3, delay: 1.5 },
      ].map((particle) => (
        <motion.circle
          key={`particle-${particle.cx}-${particle.cy}`}
          cx={particle.cx}
          cy={particle.cy}
          r={particle.r}
          fill="url(#particleGradient)"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [20, -20, 20],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Loading circle container with water fill effect */}
      <g>
        {/* Define clip path for the circle */}
        <defs>
          <clipPath id="loadingCircleClip">
            <circle cx="200" cy="150" r="54" />
          </clipPath>
        </defs>

        {/* Outer circle border */}
        <motion.circle
          cx="200"
          cy="150"
          r="55"
          fill="none"
          stroke="url(#loadingStroke)"
          strokeWidth="4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Inner circle background */}
        <circle cx="200" cy="150" r="55" fill="var(--background)" opacity="0.9" />

        {/* Water fill with wave animation - clipped to circle */}
        <g clipPath="url(#loadingCircleClip)">
          {/* Back wave (lighter, moves slower) */}
          <motion.path
            d="M 130 150 Q 155 140, 180 150 T 230 150 T 280 150 L 280 350 L 130 350 Z"
            fill="url(#waterGradient2)"
            opacity="0.7"
            initial={{ y: 60 }}
            animate={{
              y: [60, -60, -60],
              d: [
                'M 130 150 Q 155 140, 180 150 T 230 150 T 280 150 L 280 350 L 130 350 Z',
                'M 130 150 Q 155 160, 180 150 T 230 150 T 280 150 L 280 350 L 130 350 Z',
                'M 130 150 Q 155 140, 180 150 T 230 150 T 280 150 L 280 350 L 130 350 Z',
              ],
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              },
              d: {
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              },
            }}
          />

          {/* Front wave (main wave, darker) */}
          <motion.path
            d="M 130 150 Q 165 135, 200 150 T 270 150 L 270 350 L 130 350 Z"
            fill="url(#waterGradient1)"
            initial={{ y: 60 }}
            animate={{
              y: [60, -60, -60],
              d: [
                'M 130 150 Q 165 135, 200 150 T 270 150 L 270 350 L 130 350 Z',
                'M 130 150 Q 165 165, 200 150 T 270 150 L 270 350 L 130 350 Z',
                'M 130 150 Q 165 135, 200 150 T 270 150 L 270 350 L 130 350 Z',
              ],
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              },
              d: {
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              },
            }}
          />
        </g>
      </g>

      {/* Code brackets */}
      <motion.text
        x="105"
        y="165"
        fontSize="40"
        fontFamily="monospace"
        fontWeight="bold"
        fill="url(#textGradient)"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        {'<'}
      </motion.text>
      <motion.text
        x="265"
        y="165"
        fontSize="40"
        fontFamily="monospace"
        fontWeight="bold"
        fill="url(#textGradient)"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        {'/>'}
      </motion.text>

      {/* Gradients definitions */}
      <defs>
        <linearGradient id="bgGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient id="bgGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        {/* Loading circle stroke gradient */}
        <linearGradient id="loadingStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        {/* Water gradient - main wave */}
        <linearGradient id="waterGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        {/* Water gradient - back wave (lighter) */}
        <linearGradient id="waterGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
