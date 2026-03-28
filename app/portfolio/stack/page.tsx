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

// Helper to get color classes for category to prevent Tailwind purge issues
const getCategoryStyles = (category: string) => {
  const styles: Record<string, { text: string; hoverBorder: string; bgFrom: string; bgTo: string }> = {
    'Frontend': { text: 'text-purple-400', hoverBorder: 'hover:border-purple-500/50', bgFrom: '#9333ea', bgTo: '#a855f7' },
    'Backend': { text: 'text-green-400', hoverBorder: 'hover:border-green-500/50', bgFrom: '#16a34a', bgTo: '#22c55e' },
    'Database': { text: 'text-blue-400', hoverBorder: 'hover:border-blue-500/50', bgFrom: '#2563eb', bgTo: '#3b82f6' },
    'DevOps': { text: 'text-orange-400', hoverBorder: 'hover:border-orange-500/50', bgFrom: '#ea580c', bgTo: '#f97316' },
    'Tools': { text: 'text-pink-400', hoverBorder: 'hover:border-pink-500/50', bgFrom: '#db2777', bgTo: '#ec4899' },
    'Mobile': { text: 'text-cyan-400', hoverBorder: 'hover:border-cyan-500/50', bgFrom: '#0891b2', bgTo: '#06b6d4' },
    'AI/ML': { text: 'text-red-400', hoverBorder: 'hover:border-red-500/50', bgFrom: '#dc2626', bgTo: '#ef4444' },
    'Testing': { text: 'text-yellow-400', hoverBorder: 'hover:border-yellow-500/50', bgFrom: '#ca8a04', bgTo: '#eab308' },
  };
  return styles[category] || { text: 'text-gray-400', hoverBorder: 'hover:border-gray-500/50', bgFrom: '#4b5563', bgTo: '#6b7280' };
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Object.entries(groupedTech).map(([category, techs], categoryIdx) => {
              const styles = getCategoryStyles(category);
              const emoji = getCategoryEmoji(category);

              return (
                <div key={category}>
                  <h3 className={`${styles.text} text-sm font-semibold mb-4 flex items-center gap-2`}>
                    <span>{emoji}</span> {String(categoryIdx + 1).padStart(2, '0')}. {category.toUpperCase()}
                  </h3>
                  <div className="space-y-3">
                    {techs.map((tech, idx) => (
                      <motion.div
                        key={tech.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * categoryIdx + 0.05 * idx }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className={`bg-[#252526]/80 backdrop-blur-sm border border-gray-800 rounded-lg p-4 ${styles.hoverBorder} transition-all duration-300 shadow-lg`}
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
                          <span className={`${styles.text} text-xs font-mono font-bold`}>
                            {tech.proficiency}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${tech.proficiency}%` }}
                            transition={{ duration: 1, delay: 0.2 + categoryIdx * 0.1 + idx * 0.05, ease: "easeOut" }}
                            style={{
                              height: '100%',
                              background: `linear-gradient(90deg, ${styles.bgFrom}, ${styles.bgTo})`,
                              boxShadow: `0 0 10px ${styles.bgFrom}60`
                            }}
                          />
                        </div>
                        {tech.description && !/^https?:\/\//.test(tech.description.trim()) && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{tech.description}</p>
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
