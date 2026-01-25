'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '@/store/admin-store';
import { useUIStore } from '@/store/ui-store';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminStore();
  const { adminSidebarOpen, toggleAdminSidebar } = useUIStore();
  const router = useRouter();

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Inquiries',
      href: '/admin/inquiries',
      badge: '32',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Hire Requests',
      href: '/admin/hire-requests',
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
    <motion.aside
      animate={{ width: adminSidebarOpen ? 256 : 64 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-[#1a1625] border-r border-gray-800 flex flex-col h-screen relative"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleAdminSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-[#1a1625] border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all z-10"
      >
        <motion.svg
          animate={{ rotate: adminSidebarOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </motion.svg>
      </button>

      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
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
                <div className="h-px bg-gray-800 mx-2"></div>
              </div>
            );
          }
          
          const isActive = pathname === item.href;
          return (
            <div key={item.href} className="relative group">
              <Link
                href={item.href!}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#2a2534]'
                } ${!adminSidebarOpen ? 'justify-center px-2' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-purple-600 rounded-lg"
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
    </motion.aside>
  );
}
