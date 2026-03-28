'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { PreferencesProvider } from '@/components/providers/PreferencesProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // No caching
        gcTime: 0, // No cache retention (renamed from cacheTime)
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: false, // No retries to see errors immediately
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        {children}
      </PreferencesProvider>
    </QueryClientProvider>
  );
}
