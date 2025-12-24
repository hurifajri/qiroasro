'use client';

import { motion } from 'framer-motion';
import { Mail, Rocket } from 'lucide-react';
import Link from 'next/link';
import { UnderDevelopmentIllustration } from '@/components/illustrations/under-development';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
    },
  },
};

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Main content */}
      <motion.div
        className="relative z-10 flex max-w-2xl flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* SVG Illustration */}
        <UnderDevelopmentIllustration className="h-auto w-full" />

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="mb-4 bg-gradient-to-r from-[#8B5CF6] via-[#0EA5E9] to-[#F59E0B] bg-clip-text font-bold text-4xl text-transparent sm:text-5xl md:text-6xl"
        >
          Sedang Dalam Pengembangan
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mb-10 max-w-lg text-lg text-muted-foreground sm:text-xl"
        >
          Kami sedang mempersiapkan sesuatu yang istimewa untuk Anda. Tetap pantau untuk pembaruan
          atau jelajahi playground kami!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Feedback Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              className="h-12 min-w-[180px] bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] px-6 text-base text-white shadow-[#8B5CF6]/25 shadow-lg transition-all hover:shadow-[#8B5CF6]/30 hover:shadow-xl"
            >
              <a href="mailto:tes@gmail.com">
                <Mail data-icon="inline-start" className="mr-2 size-5" />
                Kirim Masukan
              </a>
            </Button>
          </motion.div>

          {/* Playground Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              className="h-12 min-w-[180px] bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] px-6 text-base text-white shadow-[#0EA5E9]/25 shadow-lg transition-all hover:shadow-[#0EA5E9]/30 hover:shadow-xl"
            >
              <Link href="/playground">
                <Rocket data-icon="inline-start" className="mr-2 size-5" />
                Jelajahi Playground
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Additional decorative elements */}
        <motion.div
          className="mt-16 flex items-center gap-2 text-muted-foreground text-sm"
          variants={itemVariants}
        >
          <motion.span
            className="inline-block size-2 rounded-full bg-[#F59E0B]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <span>Pengembangan aktif sedang berlangsung</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
