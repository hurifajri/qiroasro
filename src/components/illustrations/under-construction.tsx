'use client';

import { motion } from 'framer-motion';

interface UnderConstructionIllustrationProps {
  className?: string;
}

export function UnderConstructionIllustration({ className }: UnderConstructionIllustrationProps) {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <title>Under Construction</title>
      {/* Background gradient circles */}
      <motion.circle
        cx="200"
        cy="150"
        r="120"
        fill="url(#bgGradient1)"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      <motion.circle
        cx="200"
        cy="150"
        r="90"
        fill="url(#bgGradient2)"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Floating particles */}
      {[
        { cx: 80, cy: 80, r: 4, delay: 0 },
        { cx: 320, cy: 60, r: 3, delay: 0.3 },
        { cx: 350, cy: 200, r: 5, delay: 0.6 },
        { cx: 60, cy: 220, r: 3, delay: 0.9 },
        { cx: 150, cy: 50, r: 4, delay: 1.2 },
        { cx: 280, cy: 240, r: 3, delay: 1.5 },
      ].map((particle, i) => (
        <motion.circle
          key={i}
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

      {/* Main gear - large center */}
      <motion.g
        initial={{ rotate: 0, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 360, opacity: 1, scale: 1 }}
        transition={{
          rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
          opacity: { duration: 0.8 },
          scale: { duration: 0.8 },
        }}
        style={{ transformOrigin: '200px 150px' }}
      >
        <path
          d="M200 100 L206 100 L208 110 C216 112 224 116 230 122 L240 118 L244 124 L236 132 C240 140 242 148 242 156 L252 158 L252 164 L242 166 C242 174 240 182 236 190 L244 198 L240 204 L230 200 C224 206 216 210 208 212 L206 222 L200 222 L194 222 L192 212 C184 210 176 206 170 200 L160 204 L156 198 L164 190 C160 182 158 174 158 166 L148 164 L148 158 L158 156 C158 148 160 140 164 132 L156 124 L160 118 L170 122 C176 116 184 112 192 110 L194 100 Z"
          fill="url(#gearGradient1)"
          stroke="url(#gearStroke)"
          strokeWidth="2"
        />
        <circle cx="200" cy="156" r="20" fill="var(--background)" />
      </motion.g>

      {/* Secondary gear - top right */}
      <motion.g
        initial={{ rotate: 0, opacity: 0, scale: 0.8 }}
        animate={{ rotate: -360, opacity: 1, scale: 1 }}
        transition={{
          rotate: { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
          opacity: { duration: 0.8, delay: 0.3 },
          scale: { duration: 0.8, delay: 0.3 },
        }}
        style={{ transformOrigin: '280px 90px' }}
      >
        <path
          d="M280 60 L284 60 L285 66 C290 67 295 70 299 74 L305 71 L308 75 L303 80 C306 85 307 90 307 96 L313 97 L313 101 L307 102 C307 108 306 113 303 118 L308 123 L305 127 L299 124 C295 128 290 131 285 132 L284 138 L280 138 L276 138 L275 132 C270 131 265 128 261 124 L255 127 L252 123 L257 118 C254 113 253 108 253 102 L247 101 L247 97 L253 96 C253 90 254 85 257 80 L252 75 L255 71 L261 74 C265 70 270 67 275 66 L276 60 Z"
          fill="url(#gearGradient2)"
          stroke="#0EA5E9"
          strokeWidth="1.5"
        />
        <circle cx="280" cy="96" r="12" fill="var(--background)" />
      </motion.g>

      {/* Tertiary gear - bottom left */}
      <motion.g
        initial={{ rotate: 0, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 360, opacity: 1, scale: 1 }}
        transition={{
          rotate: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
          opacity: { duration: 0.8, delay: 0.5 },
          scale: { duration: 0.8, delay: 0.5 },
        }}
        style={{ transformOrigin: '130px 200px' }}
      >
        <path
          d="M130 175 L133 175 L134 179 C138 180 141 182 144 185 L148 183 L150 186 L147 190 C149 193 150 197 150 201 L154 202 L154 205 L150 206 C150 210 149 214 147 217 L150 221 L148 224 L144 222 C141 225 138 227 134 228 L133 232 L130 232 L127 232 L126 228 C122 227 119 225 116 222 L112 224 L110 221 L113 217 C111 214 110 210 110 206 L106 205 L106 202 L110 201 C110 197 111 193 113 190 L110 186 L112 183 L116 185 C119 182 122 180 126 179 L127 175 Z"
          fill="url(#gearGradient3)"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
        <circle cx="130" cy="201" r="10" fill="var(--background)" />
      </motion.g>

      {/* Construction cone */}
      <motion.g
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <path
          d="M200 200 L180 260 L220 260 Z"
          fill="url(#coneGradient)"
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <rect x="175" y="260" width="50" height="10" rx="2" fill="#1f2937" />
        <rect x="188" y="215" width="24" height="8" fill="var(--background)" opacity="0.8" />
        <rect x="184" y="235" width="32" height="8" fill="var(--background)" opacity="0.8" />
      </motion.g>

      {/* Wrench tool */}
      <motion.g
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9, type: 'spring', stiffness: 100 }}
        style={{ transformOrigin: '280px 200px' }}
      >
        <path
          d="M280 180 L295 195 L280 210 L270 200 L260 240 L265 245 L275 205 L285 215 L300 200 L285 185 Z"
          fill="url(#toolGradient)"
          stroke="#8B5CF6"
          strokeWidth="1.5"
        />
      </motion.g>

      {/* Code brackets */}
      <motion.text
        x="70"
        y="155"
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
        x="315"
        y="155"
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
        <linearGradient id="gearGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="gearGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="gearGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="gearStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="coneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="toolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}
