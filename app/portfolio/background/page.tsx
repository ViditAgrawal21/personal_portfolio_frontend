'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePreferences } from '@/store/preferences-store';
import { playSound } from '@/lib/audio';
import { useState } from 'react';

export default function BackgroundControlPanel() {
  const prefs = usePreferences();
  const [isBooting, setIsBooting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleSetBackground = () => {
    playSound('switch');
    setIsBooting(true);

    // Boot sequence
    setTimeout(() => {
      playSound('glitch');
      prefs.setDesktopBackgroundActive(true);
      setShowNotification(true);
      setIsBooting(false);
      
      setTimeout(() => setShowNotification(false), 3000);
    }, 1500);
  };

  const handleDisableBackground = () => {
    playSound('toggle');
    prefs.setDesktopBackgroundActive(false);
  };

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    icon 
  }: { 
    label: string, 
    value: number, 
    onChange: (val: number) => void,
    icon: string
  }) => (
    <div className="bg-[#111] p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <span>{icon}</span> {label}
        </label>
        <span className="text-xs font-mono" style={{ color: 'var(--accent-color)' }}>
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => {
          onChange(parseFloat(e.target.value));
          playSound('typing');
        }}
        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer hover:h-2 transition-all"
        style={{
          background: `linear-gradient(to right, var(--accent-color) ${value * 100}%, #1f2937 ${value * 100}%)`
        }}
      />
    </div>
  );

  return (
    <div className="h-full bg-transparent overflow-auto text-gray-200 hide-scrollbar transition-colors duration-[var(--motion-duration)]">
      
      <AnimatePresence>
        {isBooting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono"
          >
            <motion.div 
              className="text-2xl font-bold tracking-widest animate-pulse mb-8"
              style={{ color: 'var(--accent-color)', textShadow: '0 0 20px currentColor' }}
            >
              INITIALIZING ENVIRONMENT
            </motion.div>
            <div className="w-64 h-1 bg-gray-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full"
                style={{ backgroundColor: 'var(--accent-color)' }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 right-8 z-[90] bg-[#111] border border-gray-800 shadow-2xl rounded-lg p-4 flex items-start gap-4"
          >
            <div className="text-2xl" style={{ color: 'var(--accent-color)' }}>✓</div>
            <div>
              <h4 className="font-bold text-white text-sm">Environment Applied</h4>
              <p className="text-gray-400 text-xs mt-1 max-w-[200px]">Background engine is actively managing global viewport visuals.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Environment Control</h1>
            <p className="text-gray-400 text-sm">Calibrate the global spatial depth and ambient foundation of DEV_OS.</p>
          </div>
          <div className="hidden md:block">
            <span className="px-3 py-1 rounded-full text-xs font-mono border" style={{ color: 'var(--accent-color)', borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)', backgroundColor: 'color-mix(in srgb, var(--accent-color) 10%, transparent)' }}>
              MODE: {prefs.personalityMode.toUpperCase()}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Visualizer (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111] border rounded-xl overflow-hidden relative group"
              style={{ borderColor: prefs.desktopBackgroundActive ? 'color-mix(in srgb, var(--accent-color) 50%, gray)' : '#1f2937' }}
            >
              {/* Image Preview Window */}
              <div className="relative aspect-video bg-black overflow-hidden pointer-events-none border-b border-gray-800">
                <motion.div
                  className="absolute inset-[-5%] w-[110%] h-[110%] bg-cover bg-center transition-all duration-[var(--motion-duration)]"
                  style={{ 
                    backgroundImage: "url('/assests/png_5.png')",
                    filter: `blur(${prefs.backgroundBlur * 15}px) ${prefs.personalityMode === 'focus' ? 'grayscale(80%)' : ''}`,
                    scale: 1 + (prefs.backgroundParallax * 0.1)
                  }}
                />
                <div 
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ backgroundColor: 'black', opacity: prefs.backgroundOpacity }}
                />
                
                {/* Simulated UI Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center opacity-60">
                    <div className="w-24 h-4 bg-gray-500 rounded" />
                    <div className="flex gap-2">
                       <div className="w-8 h-4 bg-gray-500 rounded" />
                       <div className="w-8 h-4 bg-gray-500 rounded" />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="w-3/4 h-8 bg-gray-200 rounded mb-2" />
                    <div className="w-full h-16 bg-gray-500/50 rounded" />
                  </div>
                </div>

                {/* Status Badge */}
                {prefs.desktopBackgroundActive && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded bg-black/60 backdrop-blur-md border text-xs font-bold animate-pulse" style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}>
                    LIVE ACTIVE
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="bg-[#151515] p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">Hero_Composition_01.png</h3>
                  <div className="text-xs text-gray-500 font-mono mt-1 flex gap-3">
                    <span>4K RESOLUTION</span>
                    <span>16:9 ASPECT</span>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  {prefs.desktopBackgroundActive ? (
                    <button 
                      onClick={handleDisableBackground}
                      className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-800 hover:bg-red-900/40 hover:text-red-400 hover:border-red-900/50 rounded-lg text-sm font-bold text-white transition-all border border-gray-700"
                    >
                      Disable Global Layer
                    </button>
                  ) : (
                    <button 
                      onClick={handleSetBackground}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      style={{ 
                        backgroundColor: 'var(--accent-color)',
                        boxShadow: '0 4px 14px -2px color-mix(in srgb, var(--accent-color) 50%, transparent)' 
                      }}
                    >
                      Compile & Set Global
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Engine Parameters (Right Column) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-[#151515] p-5 rounded-xl border border-gray-800">
              <h2 className="text-white font-bold mb-5 flex items-center gap-2">
                <span style={{ color: 'var(--accent-color)' }}>⚡</span> Kinetic Parameters
              </h2>
              
              <div className="space-y-4">
                <SliderControl 
                  label="Parallax Depth" 
                  icon="🕹️"
                  value={prefs.backgroundParallax} 
                  onChange={prefs.setBackgroundParallax} 
                />
                
                <SliderControl 
                  label="Gaussian Blur" 
                  icon="🌫️"
                  value={prefs.backgroundBlur} 
                  onChange={prefs.setBackgroundBlur} 
                />
                
                <SliderControl 
                  label="Ambient Darkness" 
                  icon="🌑"
                  value={prefs.backgroundOpacity} 
                  onChange={prefs.setBackgroundOpacity} 
                />
              </div>

              <div className="mt-6 p-4 rounded-lg bg-[#111] border border-gray-800">
                <h4 className="text-xs text-gray-500 font-bold mb-2 uppercase tracking-wider">Engine Status</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Memory Load:</span>
                  <span className="text-gray-200">24MB (Texture Map)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Compositor:</span>
                  <span style={{ color: 'var(--accent-color)' }} className="font-mono">GPU Accelerated</span>
                </div>
              </div>
            </div>

            {/* Smart Behavior Hint */}
            <div className="bg-gradient-to-br from-[#151515] to-[#111] p-5 rounded-xl border border-gray-800 text-sm leading-relaxed text-gray-400">
              <strong style={{ color: 'var(--accent-color)' }}>Smart Injection:</strong> Engine dynamically alters background behavior based on current personality mode. Switching to Hacker overrides blur; switching to Gamer injects RGB lighting.
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
