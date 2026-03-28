'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '@/store/admin-store';
import { useUIStore } from '@/store/ui-store';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStats } from '@/hooks/useStats';
import { useState, useEffect } from 'react';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminStore();
  const { adminSidebarOpen, toggleAdminSidebar } = useUIStore();
  const router = useRouter();
  const { data: stats } = useStats();

  const inquiryCount = stats?.inquiries?.total;
  const hireRequestCount = stats?.hireRequests?.total;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      label: 'Dashboard',
      href: '/admin/dashboard',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      label: 'Environment',
      href: '/admin/environment',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Inquiries',
      href: '/admin/inquiries',
      badge: inquiryCount != null ? String(inquiryCount) : undefined,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Hire Requests',
      href: '/admin/hire-requests',
      badge: hireRequestCount != null ? String(hireRequestCount) : undefined,
    },
    {
      label: 'CONTENT',
      isHeader: true,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'About',
      href: '/admin/content/about',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Services',
      href: '/admin/content/services',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      label: 'Projects',
      href: '/admin/content/projects',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      label: 'Tech Stack',
      href: '/admin/content/tech-stack',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Experience',
      href: '/admin/content/experience',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      label: 'Education',
      href: '/admin/content/education',
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && adminSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleAdminSidebar}
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ width: isMobile ? (adminSidebarOpen ? 280 : 0) : (adminSidebarOpen ? 256 : 64) }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`bg-[#0a0510]/80 backdrop-blur-xl border-r border-purple-900/30 flex flex-col h-screen z-50 shadow-[4px_0_24px_rgba(0,0,0,0.5)] ${
          isMobile ? 'fixed inset-y-0 left-0' : 'relative shrink-0'
        }`}
      >
      {/* Toggle Button removed - now controlled by header or logo click */}

      <div className={`flex flex-col h-full w-full ${isMobile ? 'overflow-hidden' : ''}`}>
      {/* Logo */}
      <div 
        className={`p-6 border-b border-purple-900/30 flex items-center ${adminSidebarOpen ? 'justify-between' : 'justify-center cursor-pointer'} transition-all group`}
        onClick={!adminSidebarOpen ? toggleAdminSidebar : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] flex-shrink-0 group-hover:scale-105 transition-transform">
            A
          </div>
          <motion.div
            animate={{ opacity: adminSidebarOpen ? 1 : 0, x: adminSidebarOpen ? 0 : -20 }}
            transition={{ duration: 0.3, delay: adminSidebarOpen ? 0.1 : 0 }}
            style={{ display: adminSidebarOpen ? 'block' : 'none' }}
          >
            <h1 className="text-white font-bold">DevPort</h1>
            <p className="text-xs text-gray-400">ADMIN PANEL</p>
          </motion.div>
        </div>
        
        {adminSidebarOpen && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleAdminSidebar();
            }} 
            className="hidden lg:flex p-1.5 text-purple-400 hover:text-white rounded-md transition-colors hover:bg-purple-900/40"
            title="Collapse Sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          if (item.isHeader) {
            return adminSidebarOpen ? (
              <div key={index} className="pt-4 pb-2 px-4">
                <motion.p
                  animate={{ opacity: adminSidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: adminSidebarOpen ? 0.2 : 0 }}
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {item.label}
                </motion.p>
              </div>
            ) : (
              <div key={index} className="pt-4 pb-2 px-2">
                <div className="h-px bg-purple-900/30 mx-2"></div>
              </div>
            );
          }
          
          const isActive = pathname === item.href;
          return (
            <div key={item.href} className="relative group">
              <Link
                href={item.href!}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${
                  isActive
                    ? 'text-white shadow-[0_4px_20px_rgba(168,85,247,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                } ${!adminSidebarOpen ? 'justify-center px-2' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${!adminSidebarOpen ? 'flex items-center justify-center' : ''}`}>
                  {item.icon}
                </span>
                <motion.span
                  animate={{ opacity: adminSidebarOpen ? 1 : 0, x: adminSidebarOpen ? 0 : -20 }}
                  transition={{ duration: 0.3, delay: adminSidebarOpen ? 0.1 : 0 }}
                  className={`relative z-10 font-medium ${!adminSidebarOpen ? 'sr-only' : ''}`}
                >
                  {item.label}
                </motion.span>
                {item.badge && adminSidebarOpen && (
                  <motion.span
                    animate={{ opacity: adminSidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: adminSidebarOpen ? 0.2 : 0 }}
                    className="relative z-10 ml-auto px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </Link>
              
              {/* Tooltip for collapsed state */}
              {!adminSidebarOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <div className="relative group">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all ${
              !adminSidebarOpen ? 'justify-center px-2' : ''
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <motion.span
              animate={{ opacity: adminSidebarOpen ? 1 : 0, x: adminSidebarOpen ? 0 : -20 }}
              transition={{ duration: 0.3, delay: adminSidebarOpen ? 0.1 : 0 }}
              className={`font-medium ${!adminSidebarOpen ? 'sr-only' : ''}`}
            >
              Logout
            </motion.span>
          </button>
          
          {/* Tooltip for collapsed state */}
          {!adminSidebarOpen && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
              Logout
            </div>
          )}
        </div>
      </div>
      </div>
    </motion.aside>
    </>
  );
}
