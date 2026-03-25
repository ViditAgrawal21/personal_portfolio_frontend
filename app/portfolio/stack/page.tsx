'use client';

import { motion } from 'framer-motion';
import { useTechStack } from '@/hooks/usePortfolio';
import { groupTechByCategory } from '@/lib/api';

// If the name field from the backend accidentally contains a URL,
// extract a human-readable label from the filename/path segment.
const sanitizeName = (name: string): string => {
  if (!name) return 'Unknown';
  if (!/^https?:\/\//.test(name)) return name;
  try {
    const url = new URL(name);
    // grab last path segment, strip extension
    const segment = url.pathname.split('/').filter(Boolean).pop() || '';
    const base = segment.replace(/\.[^/.]+$/, ''); // remove extension
    // convert camelCase / hyphens / underscores to spaced words
    return base
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
      .trim() || 'Unknown';
  } catch {
    return 'Unknown';
  }
};

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
                        key={tech.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * categoryIdx + 0.05 * idx }}
                        className={`bg-[#252526] border border-gray-800 rounded-lg p-4 hover:border-${color}-600/50 transition-colors`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {tech.icon && (() => {
                              const icon = tech.icon!.trim();
                              const isUrl = /^https?:\/\//.test(icon) || icon.startsWith('/');
                              return isUrl ? (
                                <img
                                  src={icon}
                                  alt={tech.name}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 object-contain"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              ) : (
                                <span>{icon}</span>
                              );
                            })()}
                            <span className="text-white text-sm font-medium">{sanitizeName(tech.name)}</span>
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
                        {tech.description && !/^https?:\/\//.test(tech.description.trim()) && (
                          <p className="text-xs text-gray-500 mt-2">{tech.description}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>


        </motion.div>
      </div>
    </div>
  );
}
