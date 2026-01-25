'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PreferencesPage() {
  const [hackerMode, setHackerMode] = useState(true);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(16);
  const [motionIntensity, setMotionIntensity] = useState(75);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [gpuAcceleration, setGpuAcceleration] = useState(true);
  const [diagnosticOverlay, setDiagnosticOverlay] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('portfolioPreferences');
    if (savedPreferences) {
      const prefs = JSON.parse(savedPreferences);
      setHackerMode(prefs.hackerMode ?? true);
      setFontFamily(prefs.fontFamily ?? 'Inter');
      setFontSize(prefs.fontSize ?? 16);
      setMotionIntensity(prefs.motionIntensity ?? 75);
      setReducedMotion(prefs.reducedMotion ?? false);
      setGpuAcceleration(prefs.gpuAcceleration ?? true);
      setDiagnosticOverlay(prefs.diagnosticOverlay ?? false);
      
      // Apply preferences immediately
      applyPreferences(prefs);
    }
  }, []);

  const applyPreferences = (prefs: any) => {
    // Apply font family to document root
    document.documentElement.style.setProperty('--font-family', prefs.fontFamily === 'JetBrains Mono' ? '"JetBrains Mono", monospace' : '"Inter", sans-serif');
    
    // Apply font size
    document.documentElement.style.setProperty('--base-font-size', `${prefs.fontSize}px`);
    
    // Apply motion preferences
    if (prefs.reducedMotion) {
      document.documentElement.style.setProperty('--motion-duration', '0.01s');
    } else {
      const duration = `${0.3 * (prefs.motionIntensity / 100)}s`;
      document.documentElement.style.setProperty('--motion-duration', duration);
    }
    
    // Apply GPU acceleration
    if (prefs.gpuAcceleration) {
      document.documentElement.style.setProperty('transform', 'translateZ(0)');
    }
  };

  const handleApplyChanges = () => {
    const preferences = {
      hackerMode,
      fontFamily,
      fontSize,
      motionIntensity,
      reducedMotion,
      gpuAcceleration,
      diagnosticOverlay
    };
    
    // Save to localStorage
    localStorage.setItem('portfolioPreferences', JSON.stringify(preferences));
    
    // Apply preferences
    applyPreferences(preferences);
    
    // Show success message
    alert('Settings applied successfully! Your preferences will affect the entire site.');
  };

  const handleRestoreDefaults = () => {
    const defaults = {
      hackerMode: true,
      fontFamily: 'Inter',
      fontSize: 16,
      motionIntensity: 75,
      reducedMotion: false,
      gpuAcceleration: true,
      diagnosticOverlay: false
    };
    
    setHackerMode(defaults.hackerMode);
    setFontFamily(defaults.fontFamily);
    setFontSize(defaults.fontSize);
    setMotionIntensity(defaults.motionIntensity);
    setReducedMotion(defaults.reducedMotion);
    setGpuAcceleration(defaults.gpuAcceleration);
    setDiagnosticOverlay(defaults.diagnosticOverlay);
    
    // Save and apply defaults
    localStorage.setItem('portfolioPreferences', JSON.stringify(defaults));
    applyPreferences(defaults);
  };

  return (
    <div className="h-full bg-[#0a0a0a] overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
        
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">User Preferences</h1>
              <p className="text-gray-400 text-sm">Manage your IDE environment and interface behavior.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRestoreDefaults}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm transition-colors"
              >
                Restore Defaults
              </button>
              <button
                onClick={handleApplyChanges}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded text-sm font-semibold transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>

          {/* Hacker Mode */}
          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-600/30 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💻</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Hacker Mode</h3>
                    <span className="px-2 py-0.5 bg-pink-600/30 text-pink-400 text-xs rounded border border-pink-600/50">
                      NEON AI
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">Activate custom neon themes and glitch effects for a high-intensity coding experience.</p>
                </div>
              </div>
              <button
                onClick={() => setHackerMode(!hackerMode)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  hackerMode ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    hackerMode ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Typography */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🔤</span> Typography
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Font Family</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFontFamily('Inter')}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      fontFamily === 'Inter'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    Inter
                  </button>
                  <button
                    onClick={() => setFontFamily('JetBrains Mono')}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      fontFamily === 'JetBrains Mono'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    JetBrains Mono
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Base Font Size</label>
                  <span className="text-purple-400 text-sm font-mono">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>

            {/* Visual Effects */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>✨</span> Visual Effects
              </h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Motion Intensity</label>
                  <span className="text-purple-400 text-sm">Dynamic</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={motionIntensity}
                  onChange={(e) => setMotionIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Reduced Motion</h4>
                  <p className="text-xs text-gray-500">Disable heavy UI transitions</p>
                </div>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    reducedMotion ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      reducedMotion ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <div className="bg-[#1a2332] border border-cyan-900/30 rounded-lg overflow-hidden mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] border-b border-cyan-900/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <span className="text-xs text-gray-500 ml-2">TERMINAL PREVIEW - MAIN.JS</span>
            </div>
            <div className="p-4 font-mono text-sm">
              <div className="space-y-1">
                <div><span className="text-blue-400">import</span> {'{ '}<span className="text-cyan-400">Head</span> {'}'} <span className="text-blue-400">from</span> <span className="text-green-400">'@ide/themes'</span>;</div>
                <div className="text-gray-600">// Apply custom user preferences</div>
                <div><span className="text-purple-400">const</span> config = {'{'}</div>
                <div className="ml-4"><span className="text-cyan-400">hackerMode</span>: <span className="text-pink-400">{hackerMode ? 'true' : 'false'}</span>,</div>
                <div className="ml-4"><span className="text-cyan-400">intensity</span>: <span className="text-orange-400">{(motionIntensity / 100).toFixed(2)}</span>,</div>
                <div className="ml-4"><span className="text-cyan-400">font</span>: <span className="text-green-400">'{fontFamily}'</span></div>
                <div>{'};'}</div>
              </div>
            </div>
          </div>

          {/* Optimization */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>⚡</span> Optimization
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">GPU Acceleration</h4>
                  <p className="text-xs text-gray-500">Use graphics hardware for rendering</p>
                </div>
                <button
                  onClick={() => setGpuAcceleration(!gpuAcceleration)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    gpuAcceleration ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      gpuAcceleration ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Diagnostic Overlay</h4>
                  <p className="text-xs text-gray-500">Show FPS and memory usage</p>
                </div>
                <button
                  onClick={() => setDiagnosticOverlay(!diagnosticOverlay)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    diagnosticOverlay ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      diagnosticOverlay ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
