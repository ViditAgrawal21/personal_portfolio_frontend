'use client';

import { useState } from 'react';
import { usePreferences, PersonalityMode } from '@/store/preferences-store';
import { ControlModule } from '@/components/admin/ui/ControlModule';
import { SystemButton } from '@/components/admin/ui/SystemButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnvironmentControlPanel() {
  const prefs = usePreferences();
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Real-time synchronization state indicator
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');

  const handleUpdate = (updater: () => void) => {
    setSyncStatus('syncing');
    updater();
    // Simulate network/persistence delay
    setTimeout(() => setSyncStatus('synced'), 600);
  };

  const getIframeDimensions = () => {
    switch (deviceView) {
      case 'mobile': return { width: '375px', height: '812px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      case 'desktop': return { width: '100%', height: '100%' };
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-theme(spacing.16))] bg-[#050505] p-4 lg:p-6 gap-6 overflow-y-auto lg:overflow-hidden">
      
      {/* Control Panel (Left) */}
      <div className="w-full lg:w-[320px] xl:w-[400px] flex-shrink-0 flex flex-col gap-6 lg:overflow-y-auto hide-scrollbar lg:pr-2 lg:pb-20 min-w-0">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl font-black text-white shrink-0">Environment Center</h1>
            <p className="text-xs font-mono text-gray-500 mt-1 shrink-0">DEV_OS // GLOBAL_CONFIG</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] rounded-full border border-gray-800 shrink-0 self-start sm:self-auto">
            <div className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 animate-pulse'}`} />
            <span className="text-xs font-mono text-gray-400">{syncStatus === 'synced' ? 'SYSTEM SYNCED' : 'UPDATING...'}</span>
          </div>
        </div>

        {/* Personality Mode Editor */}
        <ControlModule 
          title="Personality Interface" 
          icon="🧠" 
          statusLabel={prefs.personalityMode.toUpperCase()}
          statusColor="purple"
          onReset={() => handleUpdate(() => prefs.resetToDefaults())}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {(['hacker', 'chill', 'gamer', 'focus'] as PersonalityMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => handleUpdate(() => prefs.setPersonalityMode(mode))}
                  className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                    prefs.personalityMode === mode 
                      ? 'bg-[var(--accent-color)]/20 border-[var(--accent-color)] text-white shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]'
                      : 'bg-[#151515] border-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-gray-500 mb-2">
                <span>KINETIC MOTION</span>
                <span style={{ color: 'var(--accent-color)' }}>{Math.round(prefs.motionIntensity * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={prefs.motionIntensity}
                onChange={(e) => handleUpdate(() => prefs.setMotionIntensity(parseFloat(e.target.value)))}
                className="w-full h-1 bg-gray-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent-color)] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#111] rounded-lg border border-gray-800">
              <div>
                <h4 className="text-sm font-bold text-white">Global Hacker Overrides</h4>
                <p className="text-xs text-gray-500">Enable deep scanlines regardless of mode.</p>
              </div>
              <button 
                onClick={() => handleUpdate(() => prefs.toggleHackerMode())}
                className={`w-10 h-5 rounded-full p-1 transition-colors ${prefs.hackerModeActive ? 'bg-[var(--accent-color)]' : 'bg-gray-700'}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${prefs.hackerModeActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </ControlModule>

        {/* Global Asset Engine */}
        <ControlModule 
          title="Background Engine" 
          icon="🌌" 
          statusLabel={prefs.desktopBackgroundActive ? 'ACTIVE' : 'IDLE'}
          statusColor={prefs.desktopBackgroundActive ? 'green' : 'gray' as any}
        >
          <div className="space-y-6">
            <div className="flex gap-2">
              <SystemButton 
                variant={prefs.desktopBackgroundActive ? 'danger' : 'primary'} 
                className="w-full"
                onClick={() => handleUpdate(() => prefs.setDesktopBackgroundActive(!prefs.desktopBackgroundActive))}
              >
                {prefs.desktopBackgroundActive ? 'Disable Global Desktop' : 'Activate Hero Compositor'}
              </SystemButton>
            </div>

            {prefs.desktopBackgroundActive && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-mono text-gray-500 mb-2">
                    <span>PARALLAX DEPTH</span>
                    <span style={{ color: 'var(--accent-color)' }}>{Math.round(prefs.backgroundParallax * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={prefs.backgroundParallax}
                    onChange={(e) => handleUpdate(() => prefs.setBackgroundParallax(parseFloat(e.target.value)))}
                    className="w-full h-1 bg-gray-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent-color)] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-mono text-gray-500 mb-2">
                    <span>GAUSSIAN BLUR</span>
                    <span style={{ color: 'var(--accent-color)' }}>{Math.round(prefs.backgroundBlur * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={prefs.backgroundBlur}
                    onChange={(e) => handleUpdate(() => prefs.setBackgroundBlur(parseFloat(e.target.value)))}
                    className="w-full h-1 bg-gray-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent-color)] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-gray-500 mb-2">
                    <span>UI OPACITY OVERLAY</span>
                    <span style={{ color: 'var(--accent-color)' }}>{Math.round(prefs.backgroundOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={prefs.backgroundOpacity}
                    onChange={(e) => handleUpdate(() => prefs.setBackgroundOpacity(parseFloat(e.target.value)))}
                    className="w-full h-1 bg-gray-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--accent-color)] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </ControlModule>

        {/* Theme Synthesizer */}
        <ControlModule 
          title="Theme Synthesizer" 
          icon="🎨" 
        >
          <div className="space-y-6">
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-3">SYSTEM ACCENT</label>
              <div className="flex flex-wrap gap-3">
                {['#8b5cf6', '#10b981', '#3b82f6', '#ec4899', '#f97316', '#eab308'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleUpdate(() => prefs.setAccentColor(color))}
                    className={`w-8 h-8 rounded-full transition-all border-2 ${prefs.accentColor === color ? 'border-white scale-110 shadow-[0_0_15px_currentColor]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    style={{ backgroundColor: color, color: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </ControlModule>

      </div>

      {/* Simulator Portal (Right) */}
      <div className="w-full lg:flex-1 h-[600px] lg:h-auto bg-[#0a0a0c] border border-gray-800 rounded-2xl overflow-hidden flex flex-col relative min-w-0">
        {/* Portal Header */}
        <div className="p-3 bg-[#111] border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-500 bg-black px-2 py-1 rounded">LIVE PORTAL</span>
            <span className="text-xs font-mono text-gray-300 truncate max-w-[150px] sm:max-w-none">localhost:3000/portfolio</span>
          </div>
          
          <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-gray-800 self-start sm:self-auto overflow-x-auto max-w-full">
            {(['mobile', 'tablet', 'desktop'] as const).map(device => (
              <button
                key={device}
                onClick={() => setDeviceView(device)}
                className={`px-3 py-1 rounded text-xs font-bold capitalize transition-colors shrink-0 ${deviceView === device ? 'bg-[var(--accent-color)] text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {device}
              </button>
            ))}
          </div>
        </div>

        {/* Simulator Grid Background */}
        <div className="flex-1 flex items-center justify-center p-2 lg:p-6 overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at center, #1f2937 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          {/* Iframe Device Wrapper */}
          <motion.div 
            layout
            className="bg-black border border-gray-700 shadow-2xl overflow-hidden shrink-0 transition-all duration-300 relative"
            style={{ 
              width: getIframeDimensions().width, 
              height: getIframeDimensions().height,
              borderRadius: deviceView === 'desktop' ? '8px' : '36px',
            }}
          >
            {/* Device Glare (only for mobile/tablet) */}
            {deviceView !== 'desktop' && (
              <div className="absolute inset-0 pointer-events-none rounded-[36px] border-[6px] border-gray-900 z-50">
                <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 flex justify-center">
                  <div className="w-20 h-4 bg-black rounded-b-xl" />
                </div>
              </div>
            )}
            
            <iframe 
              src="/portfolio" 
              className="w-full h-full border-none outline-none"
              title="Portfolio Live Environment"
            />
          </motion.div>
        </div>
      </div>

    </div>
  );
}
