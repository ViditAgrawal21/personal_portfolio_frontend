'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useProjects } from '@/hooks/usePortfolio';

// Project image mapping - maps project titles/keywords to image filenames
const getProjectImage = (title: string, projectImage?: string): string | undefined => {
  // If project already has an image URL, use it
  if (projectImage) return projectImage;
  
  // Normalize title for matching
  const normalizedTitle = title.toLowerCase().replace(/[_\s-]+/g, '_');
  
  // Map project keywords to image filenames in /public/assests/projects/
  const imageMap: Record<string, string> = {
    'miniminds': '/assests/projects/miniminds.jpeg',
    'account_deletion': '/assests/projects/miniminds.jpeg',
    'thoughtpro': '/assests/projects/b2b_ui.png',
    'b2b': '/assests/projects/b2b_ui.png',
    'air_leak': '/assests/projects/air_leak_app.jpeg',
    'apple_vision': '/assests/projects/apple_vision.jpeg',
    'dsa': '/assests/projects/dsa.png',
    'data_structure': '/assests/projects/dsa.png',
    'electronic_stock': '/assests/projects/electroninc_stock_managment.jpg',
    'stock_management': '/assests/projects/electroninc_stock_managment.jpg',
    'heat_stroke': '/assests/projects/heat_stroke.png',
    'huffman': '/assests/projects/huffman.jpeg',
    'hydra': '/assests/projects/hydra8.png',
    'patrol_planet': '/assests/projects/patrol_planet.png',
    'paylist': '/assests/projects/paylist_system.jpg',
    'payment': '/assests/projects/payments.png',
    'portfolio': '/assests/projects/portfolio.jpeg',
    'syncsocial': '/assests/projects/syncsocial_logo.jpeg',
    'web_scraping': '/assests/projects/web_scraping.jpeg',
    'scraping': '/assests/projects/web_scraping.jpeg',
    'wedding': '/assests/projects/wedding_website.jpeg',
  };
  
  // Try to find matching image
  for (const [keyword, imagePath] of Object.entries(imageMap)) {
    if (normalizedTitle.includes(keyword)) {
      return imagePath;
    }
  }
  
  return undefined;
};

// Helper to generate gradient colors based on category
const getCategoryGradient = (category?: string) => {
  const gradients: Record<string, string> = {
    'AI/ML': 'from-purple-900/30 to-blue-900/30',
    'Web Development': 'from-blue-900/30 to-cyan-900/30',
    'Mobile': 'from-green-900/30 to-emerald-900/30',
    'DevOps': 'from-orange-900/30 to-red-900/30',
    'Data Science': 'from-pink-900/30 to-purple-900/30',
    'Design': 'from-yellow-900/30 to-orange-900/30',
  };
  return category && gradients[category] || 'from-gray-900/30 to-slate-900/30';
};

// Helper to get emoji based on category
const getCategoryEmoji = (category?: string) => {
  const emojis: Record<string, string> = {
    'AI/ML': '🤖',
    'Web Development': '🚀',
    'Mobile': '📱',
    'DevOps': '☁️',
    'Data Science': '🔍',
    'Design': '🎨',
  };
  return category && emojis[category] || '⚡';
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all');
  const { projects: backendProjects, loading, error } = useProjects();
  
  // Use only curated backend projects (no GitHub repo mixing)
  const allProjects = backendProjects;
  
  const filteredProjects = filter === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.category === filter);

  // Derive unique categories for filter buttons
  const categories = Array.from(new Set(allProjects.map(p => p.category).filter(Boolean))) as string[];

  if (loading) {
    return (
      <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-500 text-sm font-mono"
        >
          Loading projects...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-red-400 text-sm font-mono">
          Error loading projects: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent overflow-auto relative">

      {/* Editor content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Pseudo-code header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-sm mb-12"
        >
          <span className="text-gray-500">{'{'}</span><br/>
          <span className="text-gray-500 ml-4">"file": <span className="text-green-300">"projects.json"</span>,</span><br/>
          <span className="text-gray-500 ml-4">"description": <span className="text-green-300">"Featured portfolio works"</span>,</span><br/>
          <span className="text-gray-500 ml-4">"data": [</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header with filters */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Featured Projects</h1>
              <p className="text-gray-400 font-mono text-sm">
                <span className="font-bold" style={{ color: 'var(--accent-color)' }}>const</span> <span className="text-blue-300">projects</span> = <span className="text-green-300">fetch</span>(<span className="text-orange-300">'/api/projects'</span>);
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  filter === 'all' 
                    ? 'text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                style={filter === 'all' ? { backgroundColor: 'var(--accent-color)', boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.3)' } : {}}
              >
                All ({allProjects.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    filter === cat
                      ? 'text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                  style={filter === cat ? { backgroundColor: 'var(--accent-color)', boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.3)' } : {}}
                >
                  {cat} ({allProjects.filter(p => p.category === cat).length})
                </button>
              ))}
            </div>
          </div>

          {/* Projects grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project.id || project.title}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    rotateX: 2,
                    rotateY: -2,
                    boxShadow: '0 20px 40px -10px color-mix(in srgb, var(--accent-color) 20%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--accent-color) 40%, transparent)'
                  }}
                  className="backdrop-blur-md border border-gray-800/80 rounded-xl overflow-hidden group flex flex-col h-full"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--bg-color) 80%, black)', transformPerspective: 1000 }}
                >
                  <div className="p-6 flex flex-col flex-1">
                    {/* Project image/icon */}
                    <div className={`aspect-video w-full bg-gradient-to-br ${getCategoryGradient(project.category)} rounded-lg flex items-center justify-center mb-4 group-hover:scale-[1.03] transition-transform duration-500 overflow-hidden relative shadow-inner`}>
                      {(() => {
                        const imageUrl = getProjectImage(project.title, project.imageUrl);
                        return imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{getCategoryEmoji(project.category)}</span>
                        );
                      })()}
                      
                      {/* Hover subtle glaze */}
                      <div className="absolute inset-0 bg-white mix-blend-overlay opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-[var(--accent-color)] transition-colors">{project.title}</h3>
                      {project.isFeatured && (
                        <span className="px-2 py-1 flex-shrink-0 text-[10px] uppercase tracking-wider font-bold rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.techStack || []).slice(0, 4).map((tech, techIdx) => (
                        <span
                          key={tech || `tech-${techIdx}`}
                          className="px-2 py-1 bg-[#111] border border-gray-800 text-gray-400 text-[10px] font-mono rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.techStack || []).length > 4 && (
                        <span className="px-2 py-1 bg-[#111] border border-gray-800 text-gray-500 text-[10px] font-mono rounded">
                          +{(project.techStack || []).length - 4}
                        </span>
                      )}
                    </div>

                    {/* Stats and actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-auto">
                      <div className="flex items-center gap-4 text-xs font-mono">
                        {project.category && (
                          <span style={{ color: 'var(--accent-color)' }} className="font-bold">
                            {project.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-[#111] border border-gray-800 hover:border-gray-500 rounded text-gray-400 hover:text-white transition-all"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 0a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7C4.73 17.89 4.14 16 4.14 16A2.65 2.65 0 003 14.46c-.91-.62.07-.61.07-.61a2.1 2.1 0 011.53 1 2.13 2.13 0 002.91.83 2.14 2.14 0 01.63-1.34c-2.22-.25-4.56-1.11-4.56-4.95a3.87 3.87 0 011-2.68 3.59 3.59 0 01.1-2.64s.84-.27 2.75 1a9.46 9.46 0 015 0c1.91-1.29 2.75-1 2.75-1a3.59 3.59 0 01.1 2.64 3.87 3.87 0 011 2.68c0 3.85-2.34 4.7-4.57 4.95a2.4 2.4 0 01.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0010 0z" />
                            </svg>
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded text-xs font-bold text-white transition-all shadow-md group-hover:shadow-[0_0_15px_color-mix(in_srgb,var(--accent-color)_50%,transparent)]"
                            style={{ backgroundColor: 'var(--accent-color)' }}
                          >
                            Execute
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          <div className="font-mono text-sm mt-12 text-gray-500">
            <span className="ml-4">]</span><br/>
            <span>{'}'}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
