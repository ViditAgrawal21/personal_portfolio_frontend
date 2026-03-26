'use client';

import { useCacheBuster } from '@/hooks/useCacheBuster';
import { useState } from 'react';

interface CacheControlPanelProps {
  showPanel?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Emergency cache control panel for manual cache clearing
 * Use this when automatic cache clearing isn't working
 */
export function CacheControlPanel({ 
  showPanel = true, 
  position = 'bottom-right' 
}: CacheControlPanelProps) {
  const { clearAllCaches, forceHardRefresh, forceBrowserCacheBypass, nuclearReset } = useCacheBuster();
  const [isOpen, setIsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async (action: () => Promise<void> | void) => {
    setIsClearing(true);
    try {
      await action();
    } catch (error) {
      console.error('Cache clear error:', error);
    } finally {
      setTimeout(() => setIsClearing(false), 1000);
    }
  };

  if (!showPanel) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg transition-colors"
        title="Cache Control"
      >
        {isClearing ? '🔄' : '🧹'} Cache
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-black border border-gray-600 rounded-lg p-4 min-w-[280px] shadow-xl">
          <h3 className="text-white font-bold mb-3 text-sm">🚨 Cache Control Panel</h3>
          
          <div className="space-y-2">
            <button
              onClick={() => handleClearCache(clearAllCaches)}
              disabled={isClearing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white text-xs px-3 py-2 rounded transition-colors"
            >
              Clear All Caches
            </button>
            
            <button
              onClick={() => handleClearCache(forceBrowserCacheBypass)}
              disabled={isClearing}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-500 text-white text-xs px-3 py-2 rounded transition-colors"
            >
              Force Browser Refresh
            </button>
            
            <button
              onClick={() => handleClearCache(forceHardRefresh)}
              disabled={isClearing}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-500 text-white text-xs px-3 py-2 rounded transition-colors"
            >
              Hard Refresh + Clear
            </button>
            
            <button
              onClick={() => handleClearCache(nuclearReset)}
              disabled={isClearing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white text-xs px-3 py-2 rounded transition-colors"
            >
              💥 Nuclear Reset
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-600">
            <p className="text-gray-300 text-xs mb-2">If changes aren't visible:</p>
            <ol className="text-gray-400 text-xs space-y-1">
              <li>1. Try "Hard Refresh + Clear"</li>
              <li>2. If still stuck, use "Nuclear Reset"</li>
              <li>3. Check in different browser</li>
            </ol>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Simplified cache reset button for development
 */
export function DevCacheResetButton() {
  const { nuclearReset } = useCacheBuster();
  
  const handleDevReset = async () => {
    if (confirm('This will clear ALL caches and force reload. Continue?')) {
      await nuclearReset();
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={handleDevReset}
      className="fixed top-4 left-4 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-50"
      title="DEV: Nuclear Cache Reset"
    >
      🧹 Dev Reset
    </button>
  );
}