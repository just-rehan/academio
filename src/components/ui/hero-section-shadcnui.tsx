import { Button } from "@/src/components/ui/button";
import { motion, type Variants } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onStart?: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center px-4 sm:px-6 py-5 sm:py-16 md:py-24 text-center w-full max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-2.5 sm:mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-sm font-medium text-gray-600">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-black shrink-0" />
          CareSync Hackathon 2026
        </span>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="mb-2.5 sm:mb-6 text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black leading-[1.1] text-balance break-words"
      >
        Scan. Access.
        <br />
        <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
          Care.
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mb-4 sm:mb-8 max-w-2xl text-xs sm:text-lg text-gray-500 px-2 leading-relaxed font-normal"
      >
        A QR-based portable health system with AI summaries and smart 
        medication tracking. Built for fast, reliable, and secure patient care.
      </motion.p>

      {onStart && (
        <motion.div variants={itemVariants} className="mb-4 sm:mb-8 w-full sm:w-auto">
          <button
            onClick={onStart}
            className="w-full sm:w-auto min-h-[42px] sm:min-h-[48px] px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-black text-white font-bold text-xs sm:text-base flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-md sm:shadow-xl shadow-black/10 active:scale-98 mx-auto"
          >
            Explore Platform
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        className="mt-3 sm:mt-10 flex items-center justify-center gap-3 sm:gap-8 text-xs sm:text-sm text-gray-400"
      >
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-black tabular-nums">
            1k+
          </div>
          <div className="text-[10px] sm:text-xs">Patients</div>
        </div>
        <div className="h-5 sm:h-8 w-px bg-gray-200" />
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-black tabular-nums">24/7</div>
          <div className="text-[10px] sm:text-xs">Access</div>
        </div>
        <div className="h-5 sm:h-8 w-px bg-gray-200" />
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-black tabular-nums">
            100%
          </div>
          <div className="text-[10px] sm:text-xs">Secure</div>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="pt-4 sm:pt-16 flex flex-col items-center gap-2 sm:gap-3"
      >
        <p className="text-[9px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Scroll down to reveal
        </p>
        <div className="w-[1px] h-6 sm:h-14 bg-gradient-to-b from-gray-300 to-transparent" />
      </motion.div>
    </motion.div>
  );
}
