'use client';

import { useEffect, useState } from 'react';
import { usePreferences } from '@/store/preferences-store';
import { motion, AnimatePresence } from 'framer-motion';

function GlobalClickRipple() {
  const { reducedMotion, accentColor } = usePreferences();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (reducedMotion) return;
    const handleClick = (e: MouseEvent) => {
      // Don't ripple on inputs or buttons if we want to selectively avoid, but global is cooler
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(r => [...r, newRipple]);
      setTimeout(() => setRipples(r => r.filter(rip => rip.id !== newRipple.id)), 600);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {ripples.map(rip => (
          <motion.div
            key={rip.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-12 h-12 rounded-full border border-solid"
            style={{ 
              left: rip.x - 24, 
              top: rip.y - 24,
              borderColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}` 
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function GlobalBackground() {
  const { 
    personalityMode, 
    reducedMotion, 
    desktopBackgroundActive,
    backgroundParallax,
    backgroundBlur,
    backgroundOpacity,
  } = usePreferences();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion || !desktopBackgroundActive || backgroundParallax === 0) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 2, 
        y: (e.clientY / window.innerHeight - 0.5) * 2 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion, desktopBackgroundActive, backgroundParallax]);

  if (!desktopBackgroundActive) return null;

  const xOffset = mousePos.x * backgroundParallax * -30;
  const yOffset = mousePos.y * backgroundParallax * -30;

  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden bg-black pointer-events-none">
      <AnimatePresence>
        <motion.div
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ 
             opacity: 1, 
             scale: 1.05,
             x: xOffset,
             y: yOffset
           }}
           transition={{ 
             opacity: { duration: 1.5, ease: "easeOut" },
             x: { type: 'spring', damping: 30, stiffness: 50 },
             y: { type: 'spring', damping: 30, stiffness: 50 },
           }}
           className="absolute inset-[-5%] w-[110%] h-[110%] bg-cover bg-center rounded-none"
           style={{ 
             backgroundImage: "url('/assests/png_5.png')",
             filter: `blur(${backgroundBlur * 20}px) ${personalityMode === 'focus' ? 'grayscale(80%) brightness(0.5)' : ''}`,
           }}
        />
      </AnimatePresence>
      
      {/* Opacity Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{ 
          backgroundColor: personalityMode === 'focus' ? 'black' : 'var(--bg-color)',
          opacity: backgroundOpacity 
        }} 
      />
    </div>
  );
}

function GlobalEffects() {
  const { personalityMode, hackerModeActive, reducedMotion, accentColor } = usePreferences();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion || personalityMode !== 'gamer') return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [personalityMode, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-screen">
      <AnimatePresence>
        {/* Hacker Mode Effects */}
        {(hackerModeActive || personalityMode === 'hacker') && (
          <motion.div 
            key="hacker-effect"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
              backgroundSize: '100% 2px',
              animation: 'scan-line 10s linear infinite',
            }}
          />
        )}

        {/* Chill Mode Effects */}
        {personalityMode === 'chill' && (
          <motion.div 
            key="chill-effect"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div 
              animate={{ 
                x: [0, 100, -50, 0], 
                y: [0, -50, 100, 0],
                scale: [1, 1.2, 0.8, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-20"
              style={{ backgroundColor: accentColor }}
            />
            <motion.div 
              animate={{ 
                x: [0, -100, 50, 0], 
                y: [0, 100, -50, 0],
                scale: [1, 0.8, 1.2, 1]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-10"
              style={{ backgroundColor: accentColor, filter: 'hue-rotate(90deg)' }}
            />
          </motion.div>
        )}

        {/* Gamer Mode Effects */}
        {personalityMode === 'gamer' && (
          <motion.div 
            key="gamer-effect"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-50"
          >
            <div 
              className="absolute inset-x-0 top-0 h-1 opacity-50 shadow-[0_0_15px_currentColor]"
              style={{ background: `linear-gradient(to right, ${accentColor}, transparent)`, color: accentColor }}
            />
            <motion.div
              className="absolute w-32 h-32 rounded-full blur-[60px] opacity-40 mix-blend-screen"
              animate={{ x: mousePos.x - 64, y: mousePos.y - 64 }}
              transition={{ type: 'spring', damping: 40, stiffness: 200, mass: 0.5 }}
              style={{ backgroundColor: accentColor }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { 
    personalityMode, 
    accentColor, 
    fontFamily, 
    motionIntensity, 
    reducedMotion,
    hackerModeActive,
    desktopBackgroundActive
  } = usePreferences();

  useEffect(() => {
    const root = document.documentElement;

    const fontStr = fontFamily === 'System' 
      ? 'system-ui, sans-serif' 
      : `"${fontFamily}", sans-serif`;
    root.style.setProperty('--font-sans', fontStr);
    
    if (fontFamily !== 'System') {
      root.style.setProperty('--font-mono', fontStr);
    } else {
      root.style.setProperty('--font-mono', 'monospace');
    }

    root.style.setProperty('--accent-color', accentColor);
    
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    };
    
    const rgb = hexToRgb(accentColor);
    if (rgb) {
        root.style.setProperty('--accent-rgb', rgb);
    }

    if (reducedMotion) {
      root.style.setProperty('--motion-duration', '0s');
    } else {
      const duration = 0.5 * (1.1 - motionIntensity); 
      root.style.setProperty('--motion-duration', `${duration}s`);
    }

    root.className = root.className.replace(/theme-[a-z]+/g, '');
    root.classList.add(`theme-${personalityMode}`);

    if (hackerModeActive) {
      root.classList.add('hacker-mode-active');
    } else {
      root.classList.remove('hacker-mode-active');
    }

    if (desktopBackgroundActive) {
      root.classList.add('desktop-bg-active');
    } else {
      root.classList.remove('desktop-bg-active');
    }

  }, [personalityMode, accentColor, fontFamily, motionIntensity, reducedMotion, hackerModeActive, desktopBackgroundActive]);

  return (
    <>
      <GlobalBackground />
      <GlobalEffects />
      <GlobalClickRipple />
      {children}
    </>
  );
}
