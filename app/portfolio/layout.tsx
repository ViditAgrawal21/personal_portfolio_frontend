'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IDESidebar } from '@/components/portfolio/IDESidebar';
import { IDETerminal } from '@/components/portfolio/IDETerminal';
import { IDETransition } from '@/components/portfolio/IDETransition';
import { useUIStore } from '@/store/ui-store';
import { motion, AnimatePresence } from 'framer-motion';

const fileIcons: Record<string, string> = {
  about: '📄',
  projects: '📋',
  stack: '⚙️',
  services: '🔌',
  hire: '📡'
};

const fileColors: Record<string, string> = {
  about: 'text-purple-400',
  projects: 'text-blue-400',
  stack: 'text-yellow-400',
  services: 'text-green-400',
  hire: 'text-cyan-400'
};

const fileExtensions: Record<string, string> = {
  about: '.sh',
  projects: '.json',
  stack: '.yml',
  services: '.md',
  hire: '.api'
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showTransition, setShowTransition] = useState(true);
  const [openTabs, setOpenTabs] = useState<string[]>(['about']);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const { portfolioSidebarOpen } = useUIStore();

  useEffect(() => {
    // Check if coming from intro
    const fromIntro = sessionStorage.getItem('fromIntro');
    if (!fromIntro) {
      setShowTransition(false);
    } else {
      sessionStorage.removeItem('fromIntro');
    }
  }, []);

  useEffect(() => {
    // Add current page to tabs if not already open
    const currentPage = pathname?.split('/').pop() || 'about';
    if (!openTabs.includes(currentPage)) {
      setOpenTabs([...openTabs, currentPage]);
    }
  }, [pathname]);

  return (
    <>
      {showTransition && (
        <IDETransition onComplete={() => setShowTransition(false)} />
      )}

      <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden">
        {/* Sidebar */}
        <IDESidebar />

        {/* Main content area */}
        <motion.div
          animate={{ 
            width: `calc(100% - ${portfolioSidebarOpen ? '256px' : '64px'})`
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 flex flex-col"
        >
          {/* Top menu bar */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-12 bg-[#1e1e1e] border-b border-gray-800 flex items-center justify-between px-4"
          >
            {/* Left: Logo and menus */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="text-sm font-semibold text-gray-300">DEV_OS v3.0.1</span>
              </div>
              <div className="flex items-center gap-4 text-sm ml-4">
                <span className="text-gray-400 hover:text-white cursor-pointer">File</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Edit</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Selection</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Terminal</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Help</span>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search files or commands (⌘+K)"
                  className="w-full pl-10 pr-4 py-1.5 bg-[#2d2d2d] border border-gray-700 rounded text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Right: Stats and profile */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <span className="text-gray-600">UPTIME</span>
                  <span className="text-gray-400 ml-1">14hrs</span>
                </div>
                <div>
                  <span className="text-gray-600">MEM</span>
                  <span className="text-gray-400 ml-1">80.9%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* YouTube Play Icon - Replay intro animation */}
                <button
                  onClick={() => {
                    sessionStorage.setItem('fromIntro', 'true');
                    window.location.href = '/';
                  }}
                  className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-500 transition-all hover:scale-105 shadow-lg shadow-purple-600/30"
                  title="Replay intro animation"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                
                {/* Profile Image - Admin login */}
                <Link
                  href="/admin/login"
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 hover:border-purple-400 transition-all hover:scale-105 shadow-lg"
                  title="Admin login"
                >
                  <img 
                    src="/assests/png_5.png" 
                    alt="Admin" 
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Editor area with tab bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Tab bar */}
            <div className="flex items-center bg-[#1e1e1e] border-b border-gray-800">
              {openTabs.map((tab) => {
                const isActive = pathname?.includes(tab);
                return (
                  <Link
                    key={tab}
                    href={`/portfolio/${tab}`}
                    className={`flex items-center gap-2 px-4 py-2.5 border-r border-gray-700 group hover:bg-[#252526] transition-colors ${
                      isActive ? 'bg-[#252526] border-t-2 border-t-purple-500' : ''
                    }`}
                  >
                    <span className={fileColors[tab]}>{fileIcons[tab]}</span>
                    <span className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                      {tab}{fileExtensions[tab]}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const newTabs = openTabs.filter(t => t !== tab);
                        setOpenTabs(newTabs.length ? newTabs : ['about']);
                      }}
                      className="ml-1 text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                  </Link>
                );
              })}
              <div className="flex-1 flex items-center justify-end px-4">
                <button className="text-gray-600 hover:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </motion.div>

          {/* Terminal panel */}
          <AnimatePresence>
            {terminalOpen && <IDETerminal onClose={() => setTerminalOpen(false)} />}
          </AnimatePresence>

          {/* Status bar */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="h-6 bg-purple-600 flex items-center justify-between px-3 text-xs text-white"
          >
            <div className="flex items-center gap-4">
              <span className="font-semibold">next</span>
              <span>⚡ 0.1.11</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Spaces: 2</span>
              <span>UTF-8</span>
              <span>JavaScript React</span>
              <span>⚡ Prettier</span>
              <button
                onClick={() => setTerminalOpen(!terminalOpen)}
                className="flex items-center gap-1 hover:bg-purple-700 px-2 py-0.5 rounded transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
