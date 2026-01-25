// Touch-optimized button component
'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface TouchButtonProps extends Omit<HTMLMotionProps<'button'>, 'whileTap'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    children, 
    className = '',
    disabled,
    ...restProps 
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 ease-in-out
      touch-manipulation
      min-h-touch min-w-touch
      focus:outline-none focus:ring-2 focus:ring-offset-2
      active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 focus:ring-gray-500 border border-gray-600',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantClass = variants[variant];
    const sizeClass = sizes[size];

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
        disabled={disabled || loading}
        {...restProps}
      >
        {loading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

TouchButton.displayName = 'TouchButton';