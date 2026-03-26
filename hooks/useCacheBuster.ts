'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Enhanced hook to completely clear all caches and force fresh data
 * Handles persistent browser cache issues that survive hard refresh
 */
export function useCacheBuster() {
  const queryClient = useQueryClient();

  const clearAllCaches = useCallback(async () => {
    try {
      // Clear React Query cache
      queryClient.clear();
      
      if (typeof window !== 'undefined') {
        // Preserve admin auth keys — clearing them would log the admin out
        const adminKeysToPreserve: Record<string, string | null> = {
          adminToken: localStorage.getItem('adminToken'),
          adminEmail: localStorage.getItem('adminEmail'),
          adminRole: localStorage.getItem('adminRole'),
          'admin-storage': localStorage.getItem('admin-storage'),
        };

        // Clear ALL localStorage
        localStorage.clear();

        // Restore admin auth keys
        Object.entries(adminKeysToPreserve).forEach(([key, value]) => {
          if (value !== null) localStorage.setItem(key, value);
        });
        
        // Clear sessionStorage (no auth keys stored there in primary flow)
        sessionStorage.clear();
        
        // Clear IndexedDB if available
        if ('indexedDB' in window) {
          try {
            const databases = await indexedDB.databases();
            databases.forEach(db => {
              if (db.name) {
                indexedDB.deleteDatabase(db.name);
              }
            });
          } catch (e) {
            console.log('IndexedDB clear error:', e);
          }
        }
        
        // Clear ALL service worker caches aggressively
        if ('caches' in window) {
          try {
            const cacheNames = await caches.keys();
            await Promise.all(
              cacheNames.map(cacheName => {
                console.log('Deleting cache:', cacheName);
                return caches.delete(cacheName);
              })
            );
          } catch (e) {
            console.log('Service worker cache clear error:', e);
          }
        }
        
        // Unregister ALL service workers
        if ('serviceWorker' in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(
              registrations.map(registration => {
                console.log('Unregistering service worker:', registration.scope);
                return registration.unregister();
              })
            );
          } catch (e) {
            console.log('Service worker unregister error:', e);
          }
        }
        
        console.log('🧹 ALL caches aggressively cleared');
      }
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }, [queryClient]);

  const forceHardRefresh = useCallback(async () => {
    await clearAllCaches();
    
    if (typeof window !== 'undefined') {
      // Force complete page refresh bypassing ALL caches
      const currentUrl = new URL(window.location.href);
      
      // Add multiple cache busting parameters
      currentUrl.searchParams.set('_cachebust', Date.now().toString());
      currentUrl.searchParams.set('_random', Math.random().toString());
      currentUrl.searchParams.set('_force', '1');
      
      // Force navigate to new URL (bypasses browser cache)
      window.location.href = currentUrl.toString();
    }
  }, [clearAllCaches]);

  const forceBrowserCacheBypass = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Force reload with cache bypass (Ctrl+F5 equivalent)
      window.location.reload();
    }
  }, []);

  // Emergency nuclear option - clear everything and start fresh
  const nuclearReset = useCallback(async () => {
    try {
      await clearAllCaches();
      
      if (typeof window !== 'undefined') {
        // Force complete page reload with timestamp
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        window.location.href = `${window.location.pathname}?_nuclear=${timestamp}&_id=${randomId}`;
      }
    } catch (error) {
      console.error('Nuclear reset error:', error);
    }
  }, [clearAllCaches]);

  return {
    clearAllCaches,
    forceHardRefresh,
    forceBrowserCacheBypass,
    nuclearReset,
  };
}