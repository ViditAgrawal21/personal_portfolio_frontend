'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUIStore } from '@/store/ui-store';

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
  const { portfolioSidebarOpen, togglePortfolioSidebar } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isMobile && portfolioSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={togglePortfolioSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? (portfolioSidebarOpen ? 280 : 0) : (portfolioSidebarOpen ? 256 : 64),
        }}
        transition={{ 
          duration: 0.3, 
          ease: 'easeInOut',
        }}
        className={`border-r border-gray-800/60 flex flex-col h-screen z-50 shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-colors ${
          isMobile ? 'fixed inset-y-0 left-0 overflow-hidden' : 'relative shrink-0'
        }`}
        style={{ backgroundColor: 'color-mix(in srgb, var(--bg-color) 90%, black)' }}
      >
      {/* Toggle Button */}
      <button
        onClick={togglePortfolioSidebar}
        className="absolute -right-3 top-3 w-6 h-6 border rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all z-20 shadow-lg"
        style={{ 
          backgroundColor: 'color-mix(in srgb, var(--bg-color) 95%, black)',
          borderColor: 'color-mix(in srgb, var(--accent-color) 30%, gray)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-color)';
          e.currentTarget.style.borderColor = 'var(--accent-color)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--bg-color) 95%, black)';
          e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-color) 30%, gray)';
        }}
      >
        <motion.svg
          animate={{ rotate: portfolioSidebarOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </motion.svg>
      </button>

      {/* Explorer header */}
      <div className="px-4 py-3 border-b border-gray-800/60 flex items-center justify-between" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-color) 80%, black)' }}>
        <motion.span
          animate={{ opacity: portfolioSidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.3, delay: portfolioSidebarOpen ? 0.1 : 0 }}
          className={`text-gray-400 text-xs font-semibold uppercase tracking-wider ${!portfolioSidebarOpen ? 'sr-only' : ''}`}
        >
          Explorer
        </motion.span>
        {portfolioSidebarOpen && (
          <motion.button
            animate={{ opacity: portfolioSidebarOpen ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-gray-500 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {portfolioSidebarOpen ? (
            <>
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
                <motion.span
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="font-semibold"
                >
                  portfolio-v3
                </motion.span>
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
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all ${
                            isActive
                              ? 'text-white border'
                              : 'text-gray-400 border border-transparent hover:bg-white/5 hover:text-gray-200'
                          }`}
                          style={isActive ? {
                            backgroundColor: 'color-mix(in srgb, var(--accent-color) 15%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
                          } : {}}
                        >
                          <span>{file.icon}</span>
                          <span className={file.color}>{file.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </>
          ) : (
            /* Collapsed state - show only file icons */
            <div className="space-y-1">
              {fileTree.map((file, index) => {
                const isActive = pathname === file.path;
                return (
                  <div key={file.path} className="relative group">
                    <Link
                      href={file.path}
                      className={`flex items-center justify-center w-12 h-8 rounded-md transition-all ${
                        isActive
                          ? 'text-white border border-solid'
                          : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                      }`}
                      style={isActive ? {
                        backgroundColor: 'color-mix(in srgb, var(--accent-color) 20%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)'
                      } : {}}
                    >
                      <span className="text-sm">{file.icon}</span>
                    </Link>
                    
                    {/* Tooltip */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {file.name}
                    </div>
                  </div>
                );
              })}
              
              {/* Assets folder separator */}
              <div className="h-px bg-gray-800 mx-2 my-2"></div>
              
              {/* Assets files */}
              {assetsFolder.map((file) => {
                const isActive = pathname === file.path;
                return (
                  <div key={file.path} className="relative group">
                    <Link
                      href={file.path}
                      className={`flex items-center justify-center w-12 h-8 rounded transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{file.icon}</span>
                    </Link>
                    
                    {/* Tooltip */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {file.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {portfolioSidebarOpen && (
          /* Assets folder - only show when expanded */
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
        )}
      </div>

      {/* Bottom section */}
      {portfolioSidebarOpen ? (
        <div className="border-t border-gray-800 p-2 space-y-1">
          <motion.button
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-800 rounded text-sm text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs">Search files</span>
          </motion.button>
        </div>
      ) : (
        <div className="border-t border-gray-800 p-2">
          <div className="relative group">
            <button className="flex items-center justify-center w-12 h-8 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
              Search files
            </div>
          </div>
        </div>
      )}
    </motion.aside>
    </>
  );
}
