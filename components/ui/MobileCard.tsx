// Mobile-optimized card component
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MobileCard = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'md',
  rounded = 'lg'
}: MobileCardProps) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { 
        y: -2, 
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3)' 
      } : undefined}
      className={`
        bg-terminal-surface border border-terminal-border
        ${paddingClasses[padding]} ${roundedClasses[rounded]}
        transition-all duration-200 ease-in-out
        touch-manipulation
        ${hover ? 'hover:bg-terminal-surface/80 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};