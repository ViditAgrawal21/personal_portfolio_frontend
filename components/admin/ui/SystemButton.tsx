'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

interface SystemButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function SystemButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  className = '',
  ...props
}: SystemButtonProps) {
  
  const baseClasses = 'relative inline-flex items-center justify-center gap-2 font-bold transition-all overflow-hidden';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-5 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  const variantClasses = {
    primary: 'text-white bg-[var(--accent-color)] shadow-[0_4px_14px_-2px_color-mix(in_srgb,var(--accent-color)_50%,transparent)] hover:shadow-[0_6px_20px_color-mix(in_srgb,var(--accent-color)_40%,transparent)]',
    secondary: 'text-gray-300 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-gray-700 hover:border-gray-500 hover:text-white',
    danger: 'text-red-400 bg-red-900/20 border border-red-900/40 hover:bg-red-900/40 hover:border-red-500/50 hover:text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.05)] hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${isLoading ? 'opacity-80 pointer-events-none' : ''}`}
      {...props}
    >
      {/* Subtle overlay glow for primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 pointer-events-none bg-white mix-blend-overlay opacity-0 hover:opacity-10 transition-opacity" />
      )}
      
      {isLoading ? (
        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-1" />
      ) : icon ? (
        <span className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`}>{icon}</span>
      ) : null}
      
      <span className="relative z-10">{children as React.ReactNode}</span>
    </motion.button>
  );
}
