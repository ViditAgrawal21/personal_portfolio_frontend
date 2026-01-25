// Mobile-optimized portfolio layout
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IDESidebar } from '@/components/portfolio/IDESidebar';
import { IDETerminal } from '@/components/portfolio/IDETerminal';
import { IDETransition } from '@/components/portfolio/IDETransition';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '@/hooks/useMediaQuery';

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

export default function MobileOptimizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [showTransition, setShowTransition] = useState(true);
  const [openTabs, setOpenTabs] = useState<string[]>(['about']);
  const [terminalOpen, setTerminalOpen] = useState(!isMobile); // Closed by default on mobile
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Hidden by default on mobile

  useEffect(() => {
    const fromIntro = sessionStorage.getItem('fromIntro');
    if (!fromIntro) {
      setShowTransition(false);
    } else {
      sessionStorage.removeItem('fromIntro');
    }
  }, []);

  useEffect(() => {
    const currentPage = pathname?.split('/').pop() || 'about';
    if (!openTabs.includes(currentPage)) {
      setOpenTabs([...openTabs, currentPage]);
    }
  }, [pathname]);

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <>
      {showTransition && (
        <IDETransition onComplete={() => setShowTransition(false)} />
      )}

      <div className="flex h-screen bg-[#1e1e1e] text-white overflow-hidden relative">
        {/* Mobile overlay for sidebar */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - mobile optimized */}
        <div className={`
          ${isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'} 
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}>
          <IDESidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header with hamburger */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-12 bg-[#1e1e1e] border-b border-gray-800 flex items-center justify-between px-4"
          >
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 hover:bg-gray-800 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {/* Tab navigation - scrollable on mobile */}
            <div className="flex-1 flex items-center min-w-0">
              <div className={`flex ${isMobile ? 'overflow-x-auto scrollbar-hide' : 'overflow-hidden'} -mb-px`}>
                {openTabs.map((tab) => {
                  const isActive = pathname === `/portfolio/${tab}`;
                  const fileName = tab + (fileExtensions[tab] || '');
                  const icon = fileIcons[tab] || '📄';
                  const color = fileColors[tab] || 'text-gray-400';
                  
                  return (
                    <div key={tab} className="flex items-center flex-shrink-0">
                      <Link
                        href={`/portfolio/${tab}`}
                        className={`flex items-center gap-2 px-3 py-2 text-sm border-r border-gray-800 min-w-0 ${
                          isActive 
                            ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' 
                            : 'bg-[#2d2d2d] text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="flex-shrink-0">{icon}</span>
                        <span className={`${color} truncate ${isMobile ? 'max-w-[120px]' : 'max-w-[150px]'}`}>
                          {fileName}
                        </span>
                      </Link>
                      {openTabs.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const newTabs = openTabs.filter(t => t !== tab);
                            setOpenTabs(newTabs);
                            if (isActive && newTabs.length > 0) {
                              window.location.href = `/portfolio/${newTabs[0]}`;
                            }
                          }}
                          className="px-2 py-2 text-gray-500 hover:text-white hover:bg-red-600/20"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terminal toggle - mobile optimized */}
            <button
              onClick={() => setTerminalOpen(!terminalOpen)}
              className={`p-2 rounded hover:bg-gray-800 ${isMobile ? 'ml-2' : 'ml-4'}`}
              title="Toggle Terminal"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 0v12h12V4H4z" />
                <path d="M6 6h.01M8 6h.01M10 6h.01" />
              </svg>
            </button>
          </motion.div>

          {/* Content area - mobile optimized */}
          <div className={`flex flex-col flex-1 min-h-0 ${
            terminalOpen ? (isMobile ? 'pb-48' : 'pb-64') : 'pb-0'
          }`}>
            <div className="flex-1 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Terminal - mobile optimized */}
          <AnimatePresence>
            {terminalOpen && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-t border-gray-800 ${
                  isMobile ? 'h-48' : 'h-64'
                } flex-shrink-0`}
              >
                <IDETerminal />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}