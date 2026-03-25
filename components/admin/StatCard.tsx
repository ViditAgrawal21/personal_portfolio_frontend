'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

export function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f0f0f]/80 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 relative overflow-hidden group"
    >
      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-colors"></div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          {change && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {change}
              </span>
              <svg 
                className={`w-4 h-4 ${trend === 'up' ? 'text-green-400' : 'text-red-400 rotate-180'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-3 bg-purple-600/10 rounded-lg text-purple-400">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
