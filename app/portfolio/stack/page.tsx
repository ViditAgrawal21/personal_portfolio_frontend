'use client';

import { motion } from 'framer-motion';
import { useTechStack } from '@/hooks/usePortfolio';
import { groupTechByCategory } from '@/lib/api';

// Helper to get emoji for category
const getCategoryEmoji = (category: string) => {
  const emojis: Record<string, string> = {
    'Frontend': '🎨',
    'Backend': '⚙️',
    'Database': '🗄️',
    'DevOps': '☁️',
    'Tools': '🔧',
    'Mobile': '📱',
    'AI/ML': '🤖',
    'Testing': '🧪',
  };
  return emojis[category] || '💎';
};

// Helper to get color for category
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Frontend': 'purple',
    'Backend': 'green',
    'Database': 'blue',
    'DevOps': 'orange',
    'Tools': 'pink',
    'Mobile': 'cyan',
    'AI/ML': 'red',
    'Testing': 'yellow',
  };
  return colors[category] || 'gray';
};

export default function StackPage() {
  const { techStack, loading, error } = useTechStack();

  if (loading) {
    return (
      <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-500 text-sm font-mono"
        >
          Loading tech stack...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-red-400 text-sm font-mono">
          Error loading tech stack: {error}
        </div>
      </div>
    );
  }

  const groupedTech = groupTechByCategory(techStack);
  return (
    <div className="h-full bg-[#1e1e1e] overflow-auto">
      {/* Editor content */}
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header */}
          <div className="mb-6">
            <p className="text-purple-400 font-mono text-sm mb-4">
              <span className="text-pink-500">❯</span> Parsing technology_stack...
            </p>
            <div className="flex items-baseline gap-3 mb-6">
              <h1 className="text-4xl font-bold text-white">Tech Stack</h1>
              <span className="text-2xl text-gray-600 font-light">/ core_competencies</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full border border-purple-600/30">
                ⚡ STATUS: EXPERT
              </span>
              <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700">
                ENVIRONMENT: PRODUCTION
              </span>
            </div>
          </div>

          {/* Tech grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {Object.entries(groupedTech).map(([category, techs], categoryIdx) => {
              const color = getCategoryColor(category);
              const emoji = getCategoryEmoji(category);
              
              return (
                <div key={category}>
                  <h3 className={`text-${color}-400 text-sm font-semibold mb-4 flex items-center gap-2`}>
                    <span>{emoji}</span> {String(categoryIdx + 1).padStart(2, '0')}. {category.toUpperCase()}
                  </h3>
                  <div className="space-y-3">
                    {techs.map((tech, idx) => (
                      <motion.div
                        key={tech._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * categoryIdx + 0.05 * idx }}
                        className={`bg-[#252526] border border-gray-800 rounded-lg p-4 hover:border-${color}-600/50 transition-colors`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {tech.icon && <span>{tech.icon}</span>}
                            <span className="text-white text-sm font-medium">{tech.name}</span>
                          </div>
                          <span className={`text-${color}-400 text-xs font-mono`}>
                            {tech.proficiency}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${tech.proficiency}%` }}
                            transition={{ duration: 1, delay: 0.2 + categoryIdx * 0.1 + idx * 0.05 }}
                            className={`h-full bg-gradient-to-r from-${color}-600 to-${color}-500`}
                            style={{
                              background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                              '--tw-gradient-from': `rgb(var(--color-${color}-600))`,
                              '--tw-gradient-to': `rgb(var(--color-${color}-500))`,
                            } as React.CSSProperties}
                          />
                        </div>
                        {tech.description && (
                          <p className="text-xs text-gray-500 mt-2">{tech.description}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technical Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-purple-900/20 to-transparent border border-gray-800 rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Technical Philosophy</h2>
            <div className="text-gray-400 leading-relaxed space-y-3">
              <p>
                I build for the long term. My approach combines the strict type-safety of{' '}
                <span className="text-orange-400 font-semibold">Rust</span> with the rapid iteration capabilities of{' '}
                <span className="text-blue-400 font-semibold">Next.js</span>. I believe in high-performance, resilient systems that can scale without technical debt.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <span className="text-sm text-gray-500">Performance-first architecture</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
