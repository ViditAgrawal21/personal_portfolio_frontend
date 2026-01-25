'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

const fileTree = [
  { name: 'about.sh', path: '/portfolio/about', icon: '📄', color: 'text-purple-400' },
  { name: 'projects.json', path: '/portfolio/projects', icon: '📋', color: 'text-blue-400' },
  { name: 'stack.yml', path: '/portfolio/stack', icon: '⚙️', color: 'text-yellow-400' },
  { name: 'services.md', path: '/portfolio/services', icon: '🔌', color: 'text-green-400' },
  { name: 'preferences.cfg', path: '/portfolio/preferences', icon: '⚙️', color: 'text-orange-400' },
  { name: 'contact.py', path: '/portfolio/hire', icon: '📧', color: 'text-cyan-400' },
];

const assetsFolder = [
  { name: 'hero_bg.png', path: '/portfolio/background', icon: '🖼️', color: 'text-pink-400' },
  { name: 'resume_2024.pdf', path: '/portfolio/resume', icon: '📄', color: 'text-red-400' },
];

export function IDESidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-64 bg-[#1e1e1e] border-r border-gray-800 flex flex-col h-screen"
    >
      {/* Explorer header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Explorer</span>
        <button className="text-gray-500 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Portfolio folder */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-800 rounded text-sm text-gray-300"
          >
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
            </svg>
            <span className="font-semibold">portfolio-v3</span>
          </button>

          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="ml-4 mt-1 space-y-0.5"
            >
              {fileTree.map((file, index) => {
                const isActive = pathname === file.path;
                return (
                  <motion.div
                    key={file.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link
                      href={file.path}
                      className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                      }`}
                    >
                      <span>{file.icon}</span>
                      <span className={file.color}>{file.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Assets folder */}
        <div className="p-2">
          <button className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-800 rounded text-sm text-gray-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
            </svg>
            <span className="uppercase text-xs text-gray-600 font-semibold tracking-wider">ASSETS</span>
          </button>
          <div className="ml-4 mt-1 space-y-0.5">
            {assetsFolder.map((file) => {
              const isActive = pathname === file.path;
              return (
                <Link
                  key={file.path}
                  href={file.path}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                  }`}
                >
                  <span>{file.icon}</span>
                  <span className={file.color}>{file.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-800 p-2 space-y-1">
        <button className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-800 rounded text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs">Search files</span>
        </button>
      </div>
    </motion.aside>
  );
}
