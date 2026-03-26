'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin-store';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, token, checkAuth, logout } = useAdminStore();
  const [isChecking, setIsChecking] = useState(true);
  const hasVerified = useRef(false);

  useEffect(() => {
    // Only run once per true mount — not on every tab switch or re-render
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyAuth = async () => {
      try {
        setIsChecking(true);

        const isValid = checkAuth();
        const currentToken = token || localStorage.getItem('adminToken');

        if (!isValid || !currentToken) {
          logout();
          router.replace('/admin/login');
          return;
        }

        // Token exists in localStorage — session is valid, no server ping needed
      } catch (error) {
        console.error('Auth guard error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  if (!isAuthenticated || (!token && !storedToken)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Authentication required</p>
          <button
            onClick={() => router.replace('/admin/login')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function useAuthStatus() {
  const { isAuthenticated, token, checkAuth } = useAdminStore();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const valid = checkAuth() && !!token;
    setIsValid(valid);
    setIsLoading(false);
  }, [isAuthenticated, token, checkAuth]);

  return { isValid, isLoading, isAuthenticated: isValid };
}