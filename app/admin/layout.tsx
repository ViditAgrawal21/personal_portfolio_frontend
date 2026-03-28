'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminStore } from '@/store/admin-store';
import { useUIStore } from '@/store/ui-store';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAdminStore();
  const { adminSidebarOpen, toggleAdminSidebar } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for hydration to complete
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Only redirect after hydration is complete
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading while hydrating or checking auth
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-purple-900/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>
      <AdminSidebar />
      <motion.main
        className="flex-1 overflow-auto w-full relative z-0 flex flex-col"
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-4 p-4 border-b border-purple-900/30 bg-[#0a0510]/95 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <button 
            onClick={toggleAdminSidebar}
            className="p-1.5 text-purple-400 hover:text-white hover:bg-purple-900/40 rounded-lg transition-colors border border-transparent hover:border-purple-500/30"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span className="text-white font-bold tracking-wide text-sm flex items-center gap-2">
            <div className="w-6 h-6 flex-shrink-0 rounded-md bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">V</span>
            </div>
            DevPort Admin
          </span>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
