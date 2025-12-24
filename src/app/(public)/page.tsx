'use client';

import { motion } from 'framer-motion';
import { MailIcon, RocketIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UnderDevelopmentIllustration } from '@/components/illustrations/under-development';
import { buttonVariants } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';

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
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function HomePage() {
  const router = useRouter();

  const handleClickExplore = () => {
    router.push('/playground');
  };

  return (
    <motion.div
      className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 p-4 sm:mt-32 sm:flex-row"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SVG Illustration */}
      <motion.div
        variants={itemVariants}
        className="flex flex-1 shrink-0 items-center justify-center"
      >
        <UnderDevelopmentIllustration className="h-auto w-full max-w-md md:max-w-none" />
      </motion.div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-12">
        <div className="flex flex-col items-start gap-4">
          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="bg-linear-to-r from-[#8B5CF6] via-[#0EA5E9] to-[#F59E0B] bg-clip-text font-bold text-4xl text-transparent"
          >
            Sedang Dalam Pengembangan
          </motion.h2>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
            Kami sedang mengembangkan aplikasi pembelajaran tajwid interaktif. Mohon doanya semoga
            Allah mudahkan. <br />
            Aamiin Allahumma Aamiin... 🤲
          </motion.p>

          {/* Playground Button */}
          <motion.button
            onClick={handleClickExplore}
            variants={itemVariants}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 cursor-pointer bg-linear-to-r from-[#8B5CF6] to-[#6D28D9] px-6 text-base text-white shadow-[#8B5CF6]/25 shadow-lg transition-all hover:shadow-[#8B5CF6]/30 hover:shadow-xl',
            )}
          >
            <RocketIcon className="size-5" />
            Lihat Contohnya
          </motion.button>
        </div>

        <div className="flex flex-col gap-2">
          {/* Additional decorative elements */}
          <motion.div
            className="flex items-center gap-2 text-muted-foreground"
            variants={itemVariants}
          >
            <motion.span
              className="inline-block size-2 rounded-full bg-[#F59E0B] text-lg"
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
            Ingatkan saya ketika aplikasi sudah siap.
          </motion.div>

          {/* Reminder Form */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2 sm:flex-row">
            <InputGroup className="h-12 sm:max-w-96">
              <InputGroupAddon>
                <MailIcon className="size-5 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Email"
                className="h-12 placeholder:text-muted-foreground"
              />
            </InputGroup>
            <motion.button
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 cursor-pointer bg-linear-to-r from-[#0EA5E9] to-[#0284C7] px-6 text-base text-white shadow-[#0EA5E9]/25 shadow-lg transition-all hover:shadow-[#0EA5E9]/30 hover:shadow-xl',
              )}
            >
              Ingatkan Saya
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
