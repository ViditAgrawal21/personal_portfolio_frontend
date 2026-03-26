'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin-store';
import { authHelpers } from '@/lib/adminApi';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, token, checkAuth, logout } = useAdminStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('Verifying admin authentication...');

      try {
        setIsChecking(true);

        const isValid = checkAuth();
        const hasToken = authHelpers.isAuthenticated();

        console.log('Auth Status:', {
          storeAuth: isAuthenticated,
          hasToken,
          isValid,
          tokenExists: !!token,
        });

        if (!isValid || !hasToken || !token) {
          console.log('Authentication failed - redirecting to login');
          logout();
          router.replace('/admin/login');
          return;
        }

        try {
          const response = await fetch('/api/proxy/admin/test-auth', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Token validation failed');
          }

          console.log('Token is valid');
        } catch (tokenError) {
          console.error('Token validation failed:', tokenError);
          logout();
          router.replace('/admin/login');
          return;
        }

        console.log('Authentication verified successfully');
      } catch (error) {
        console.error('Authentication verification error:', error);
        logout();
        router.replace('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, token, checkAuth, logout, router]);

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

  if (!isAuthenticated || !token || !authHelpers.isAuthenticated()) {
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
    const verify = () => {
      const valid = checkAuth() && authHelpers.isAuthenticated() && !!token;
      setIsValid(valid);
      setIsLoading(false);
    };

    verify();
  }, [isAuthenticated, token, checkAuth]);

  return { isValid, isLoading, isAuthenticated: isValid };
}