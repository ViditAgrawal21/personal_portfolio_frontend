// Mobile-first media query hook
'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

// Predefined breakpoint hooks
export const useMobile = () => useMediaQuery('(max-width: 768px)');
export const useTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useDesktop = () => useMediaQuery('(min-width: 1025px)');
export const useTouch = () => useMediaQuery('(pointer: coarse)');