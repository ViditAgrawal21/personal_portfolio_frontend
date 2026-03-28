'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ControlModuleProps {
  title: string;
  icon?: React.ReactNode;
  statusLabel?: string;
  statusColor?: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onReset?: () => void;
  actionNode?: React.ReactNode;
  className?: string;
}

const colorMap = {
  green: 'text-green-400 bg-green-900/20 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
  blue: 'text-blue-400 bg-blue-900/20 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
  yellow: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
  red: 'text-red-400 bg-red-900/20 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
  purple: 'text-purple-400 bg-purple-900/20 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]',
};

export function ControlModule({
  title,
  icon,
  statusLabel,
  statusColor = 'green',
  children,
  defaultExpanded = true,
  onReset,
  actionNode,
  className = ''
}: ControlModuleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-[#0f0f0f]/80 backdrop-blur-md border border-gray-800/80 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-colors hover:border-gray-700/80 ${className}`}>
      {/* Header */}
      <div 
        className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-800 flex items-center justify-between cursor-pointer select-none bg-[#151515]/50 hover:bg-[#1a1a1a]/50 transition-colors gap-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide truncate pr-2">{title}</h2>
          
          {statusLabel && (
            <span className={`px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] sm:text-xs font-mono border flex items-center gap-1 sm:gap-1.5 shrink-0 ${colorMap[statusColor]}`}>
              <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0`} />
              <span className="truncate max-w-[80px] sm:max-w-none">{statusLabel}</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          {actionNode}
          
          {onReset && (
            <button 
              onClick={onReset}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors font-mono uppercase tracking-wider px-2 py-1 rounded hover:bg-red-400/10"
              title="Reset to defaults"
            >
              Reset
            </button>
          )}

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
          >
            <motion.svg 
              animate={{ rotate: isExpanded ? 180 : 0 }} 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
