'use client';

import { motion } from 'framer-motion';

export function IDETransition({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      onAnimationComplete={onComplete}
    >
      {/* Glitch effect overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.3, 0, 0.5, 0],
        }}
        transition={{ duration: 0.8, times: [0, 0.2, 0.4, 0.6, 1] }}
        style={{
          background: 'repeating-linear-gradient(0deg, #00ff41 0px, transparent 1px, transparent 2px, #00ff41 3px)',
        }}
      />

      {/* Grid reveal */}
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          transformOrigin: 'top',
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Center logo/text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <motion.div
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4"
            animate={{
              textShadow: [
                '0 0 10px rgba(147, 51, 234, 0)',
                '0 0 20px rgba(147, 51, 234, 0.8)',
                '0 0 10px rgba(147, 51, 234, 0)',
              ]
            }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            INITIALIZING IDE
          </motion.div>
          <motion.div
            className="text-terminal-accent text-sm font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Loading workspace components...
          </motion.div>
        </motion.div>
      </div>

      {/* Horizontal scan lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ y: '-100%' }}
        animate={{ y: '100%' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <div className="h-2 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent blur-sm" />
      </motion.div>
    </motion.div>
  );
}
