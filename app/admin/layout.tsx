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
  const { adminSidebarOpen } = useUIStore();
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
        className="flex-1 overflow-auto w-full relative z-0"
      >
        {children}
      </motion.main>
    </div>
  );
}
