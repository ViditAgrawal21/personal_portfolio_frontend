'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePreferences, PersonalityMode, FontType } from '@/store/preferences-store';
import { playSound } from '@/lib/audio';
import { useState } from 'react';

const PRESET_COLORS = [
  { name: 'Neon Purple', value: '#8b5cf6' },
  { name: 'Matrix Green', value: '#10b981' },
  { name: 'Cyber Blue', value: '#3b82f6' },
  { name: 'Hacker Pink', value: '#ec4899' },
  { name: 'Warning Orange', value: '#f97316' },
  { name: 'Terminal Yellow', value: '#eab308' }
];

const FONTS: { label: string; value: FontType }[] = [
  { label: 'Inter', value: 'Inter' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono' },
  { label: 'Fira Code', value: 'Fira Code' },
  { label: 'System', value: 'System' },
];

export default function PreferencesPage() {
  const prefs = usePreferences();
  const [clickCount, setClickCount] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  const handlePersonalityClick = (mode: PersonalityMode) => {
    playSound('switch');
    prefs.setPersonalityMode(mode);
    
    // Easter Egg logic
    if (mode === 'hacker') {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount === 5 && !prefs.matrixRainUnlocked) {
        prefs.unlockMatrixRain();
        playSound('glitch');
      }
    } else {
      setClickCount(0);
    }
  };

  const handleToggle = (key: 'hackerModeActive' | 'reducedMotion' | 'soundEnabled') => {
    playSound('toggle');
    if (key === 'hackerModeActive') prefs.toggleHackerMode();
    if (key === 'reducedMotion') prefs.toggleReducedMotion();
    if (key === 'soundEnabled') prefs.toggleSound();
  };

  const interactiveClasses = "transition-all duration-[var(--motion-duration)] ease-out";

  return (
    <div className={`h-full bg-[#0a0a0a] overflow-y-auto text-gray-200 ${interactiveClasses} hide-scrollbar`} style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-6xl mx-auto p-4 md:p-8 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefs.reducedMotion ? 0 : 0.4 }}>
        
          {/* Easter Egg Banner */}
          <AnimatePresence>
            {prefs.matrixRainUnlocked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 rounded-lg bg-green-900/40 border border-green-500/50 text-green-400 font-mono text-sm flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.3)] overflow-hidden"
              >
                <span>ACCESS GRANTED: MATRIX RAIN PROTOCOL UNLOCKED.</span>
                <button onClick={() => playSound('glitch')} className="px-3 py-1 bg-green-500/20 hover:bg-green-500/40 rounded transition-colors whitespace-nowrap ml-4 border border-green-500/30">ACTIVATE</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Global Preferences</h1>
              <p className="text-gray-400 text-sm">Every change reflects instantly across your entire IDE experience.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { playSound('click'); prefs.resetToDefaults(); }}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm transition-colors border border-gray-700 self-start md:self-auto whitespace-nowrap"
            >
              Restore Defaults
            </motion.button>
          </div>

          {/* Personality Modes */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span style={{ color: 'var(--accent-color)' }}>01.</span> Personality Modes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'hacker', icon: '⚡', title: 'Hacker Mode', desc: 'Neon, fast transitions, glowing borders.' },
                { id: 'chill', icon: '🌊', title: 'Chill Mode', desc: 'Pastel accents, slow smooth motion.' },
                { id: 'gamer', icon: '🎮', title: 'Gamer Mode', desc: 'RGB aesthetics, reactive trails.' },
                { id: 'focus', icon: '🧠', title: 'Focus Mode', desc: 'Minimalist, zero distractions, dim.' }
              ].map((mode) => {
                const isActive = prefs.personalityMode === mode.id;
                return (
                  <motion.div
                    key={mode.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePersonalityClick(mode.id as PersonalityMode)}
                    className={`cursor-pointer rounded-xl p-5 border backdrop-blur-md relative overflow-hidden transition-all duration-[var(--motion-duration)] ${
                      isActive 
                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 shadow-[0_0_20px_var(--accent-color)] shadow-[var(--accent-color)]/20' 
                        : 'border-gray-800 bg-[#151515] hover:border-gray-600'
                    }`}
                  >
                    {isActive && (
                      <motion.div layoutId="activePersonality" className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)]/20 to-transparent pointer-events-none" />
                    )}
                    <span className="text-3xl mb-3 block">{mode.icon}</span>
                    <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>{mode.title}</h3>
                    <p className="text-xs text-gray-500">{mode.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
            {/* Visual Engine */}
            <section className="bg-[#151515] border border-gray-800 rounded-xl p-5 md:p-6 relative overflow-hidden group hover:border-gray-700 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)]/5 rounded-full blur-3xl group-hover:bg-[var(--accent-color)]/10 transition-colors pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span style={{ color: 'var(--accent-color)' }}>02.</span> Visual Engine
              </h2>
              
              {/* Color Picker */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-3">System Accent Color</label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_COLORS.map(color => (
                    <motion.button
                      key={color.value}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { playSound('click'); prefs.setAccentColor(color.value); }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${prefs.accentColor === color.value ? 'border-white scale-110 shadow-[0_0_15px_currentColor]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: color.value, color: color.value }}
                      title={color.name}
                    />
                  ))}
                  <div className="relative w-10 h-10 rounded-full border border-gray-700 overflow-hidden flex items-center justify-center bg-[#222] group-hover:border-gray-500 transition-colors">
                    <input 
                      type="color" 
                      value={prefs.accentColor}
                      onChange={(e) => prefs.setAccentColor(e.target.value)}
                      className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer opacity-0"
                      title="Custom Color"
                    />
                    <span className="text-xs">🎨</span>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-3">Terminal Typography</label>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map(font => (
                    <button
                      key={font.value}
                      onClick={() => { playSound('click'); prefs.setFontFamily(font.value); }}
                      className={`px-3 py-2.5 rounded-lg text-sm md:text-sm text-xs transition-all duration-[var(--motion-duration)] ${
                        prefs.fontFamily === font.value
                          ? 'bg-[var(--accent-color)] text-white font-bold shadow-[0_0_10px_var(--accent-color)] shadow-[var(--accent-color)]/30'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                      style={{ fontFamily: font.value === 'System' ? 'system-ui' : `"${font.value}", sans-serif` }}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Interaction & Motion */}
            <section className="bg-[#151515] border border-gray-800 rounded-xl p-5 md:p-6 relative overflow-hidden group hover:border-gray-700 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)]/5 rounded-full blur-3xl group-hover:bg-[var(--accent-color)]/10 transition-colors pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span style={{ color: 'var(--accent-color)' }}>03.</span> Interaction & Motion
              </h2>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-300">Motion Intensity</label>
                  <span className="text-sm font-mono" style={{ color: 'var(--accent-color)' }}>{Math.round(prefs.motionIntensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={prefs.motionIntensity}
                  onChange={(e) => {
                    prefs.setMotionIntensity(parseFloat(e.target.value));
                    playSound('typing'); // Soft ticking
                  }}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--accent-color) ${prefs.motionIntensity * 100}%, #1f2937 ${prefs.motionIntensity * 100}%)`
                  }}
                />
              </div>

              <div className="space-y-4">
                {[
                  { id: 'hackerModeActive', label: 'Global Hacker Mode', desc: 'Enables CRT scanlines and neon borders' },
                  { id: 'reducedMotion', label: 'Reduced Motion', desc: 'Disables all non-essential animations' },
                  { id: 'soundEnabled', label: 'UI Sound Effects', desc: 'Mechanical keyboard clicks and synth feedback' }
                ].map(toggle => {
                  const isActive = prefs[toggle.id as keyof typeof prefs] as boolean;
                  return (
                    <div key={toggle.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-gray-800" onClick={() => handleToggle(toggle.id as any)}>
                      <div className="pr-4">
                        <h4 className="text-sm font-bold text-white mb-0.5">{toggle.label}</h4>
                        <p className="text-xs text-gray-500 leading-tight">{toggle.desc}</p>
                      </div>
                      <motion.div 
                        className={`w-12 h-6 rounded-full p-1 flex items-center shadow-inner transition-colors flex-shrink-0 ${isActive ? 'bg-[var(--accent-color)]' : 'bg-gray-700'}`}
                        style={{ backgroundColor: isActive ? 'var(--accent-color)' : '' }}
                      >
                        <motion.div 
                          layout
                          className="w-4 h-4 rounded-full bg-white shadow-md relative z-10"
                          animate={{ x: isActive ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Interactive Playground */}
          <section className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 relative">
            
            <AnimatePresence>
              {isExecuting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center font-mono flex-col border-2"
                  style={{ borderColor: 'var(--accent-color)' }}
                >
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-t-4 border-r-4 border-transparent shadow-[0_0_15px_currentColor]"
                    style={{ borderTopColor: 'var(--accent-color)', borderRightColor: 'var(--accent-color)' }} 
                  />
                  <div className="mt-6 font-bold tracking-widest animate-pulse text-lg" style={{ color: 'var(--accent-color)', textShadow: '0 0 10px currentColor' }}>
                    EXECUTING PROTOCOL...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 px-4 py-3 bg-[#151515] border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors cursor-pointer" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors cursor-pointer" />
                <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors cursor-pointer" />
              </div>
              <span className="text-xs text-gray-500 ml-2 font-mono flex-1 text-center mr-12 hidden xs:block">live_preview.ts</span>
            </div>
            <div className="p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto" style={{ fontFamily: 'var(--font-mono)' }}>
              <motion.div 
                whileHover={{ x: 5 }} 
                className="p-4 rounded border mb-4 shadow-sm"
                style={{
                  borderColor: 'color-mix(in srgb, var(--accent-color) 30%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--accent-color) 5%, transparent)',
                }}
              >
                <div><span className="text-blue-400">import</span> {'{'} <span className="text-green-300">PreferencesEngine</span> {'}'} <span className="text-blue-400">from</span> <span className="text-orange-300">'@portfolio/core'</span>;</div>
                <br/>
                <div className="text-gray-500 italic">// This component reacts instantly to your changes above.</div>
                <div className="text-gray-500 italic">// Try changing the accent color or personality mode!</div>
                <br/>
                <div><span className="text-purple-400">const</span> currentConfig = {'{'}</div>
                <div className="ml-4 flex items-center gap-2 mb-1">
                  <span className="text-blue-300">themeMode</span>: 
                  <span className="text-green-300 animate-pulse">'{prefs.personalityMode}'</span>,
                </div>
                <div className="ml-4 flex items-center gap-2 mb-1">
                  <span className="text-blue-300">accentColor</span>: 
                  <span className="px-2 py-0.5 rounded shadow-sm" style={{ backgroundColor: prefs.accentColor, color: '#fff' }}>'{prefs.accentColor}'</span>,
                </div>
                <div className="ml-4">
                  <span className="text-blue-300">motionEnabled</span>: 
                  <span className="text-pink-400">{(!prefs.reducedMotion).toString()}</span>,
                </div>
                <div>{'};'}</div>
              </motion.div>
              
              <div className="flex flex-col xs:flex-row justify-end gap-3 mt-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playSound('click')}
                  className="px-6 py-2 rounded font-bold border-2 border-transparent bg-gray-800 hover:bg-gray-700 transition-colors w-full xs:w-auto"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: `0 0 15px var(--accent-color)` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isExecuting) return;
                    playSound('glitch');
                    setIsExecuting(true);
                    setTimeout(() => setIsExecuting(false), 2000);
                  }}
                  className="px-6 py-2 rounded font-bold transition-all text-white w-full xs:w-auto shadow-md"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                >
                  {isExecuting ? 'Running...' : 'Execute Routine'}
                </motion.button>
              </div>
            </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
}
