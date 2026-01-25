import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Mobile-first breakpoints
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        terminal: {
          bg: '#0a0a0a',
          surface: '#151515',
          border: '#2a2a2a',
          text: '#e0e0e0',
          muted: '#808080',
          accent: '#00ff41',
          error: '#ff4444',
          warning: '#ffaa00',
          info: '#00aaff',
        },
        admin: {
          bg: '#0f1419',
          surface: '#1a1f2e',
          border: '#2d3748',
          text: '#e2e8f0',
          muted: '#a0aec0',
          primary: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Mobile-optimized spacing
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Responsive font sizes
      fontSize: {
        'xs-responsive': 'clamp(0.75rem, 2vw, 0.875rem)',
        'sm-responsive': 'clamp(0.875rem, 2.5vw, 1rem)',
        'base-responsive': 'clamp(1rem, 3vw, 1.125rem)',
        'lg-responsive': 'clamp(1.125rem, 4vw, 1.5rem)',
        'xl-responsive': 'clamp(1.25rem, 5vw, 2rem)',
        '2xl-responsive': 'clamp(1.5rem, 6vw, 3rem)',
        '3xl-responsive': 'clamp(1.875rem, 8vw, 4rem)',
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'scan-line': 'scan 8s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'bounce-gentle': 'bounce 2s infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      // Touch-friendly tap targets
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      // Mobile-optimized grid
      gridTemplateColumns: {
        'auto-fit-xs': 'repeat(auto-fit, minmax(150px, 1fr))',
        'auto-fit-sm': 'repeat(auto-fit, minmax(200px, 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [
    // Add custom utilities for mobile optimization
    function({ addUtilities }: any) {
      const newUtilities = {
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.backface-hidden': {
          '-webkit-backface-visibility': 'hidden',
          'backface-visibility': 'hidden',
        },
        '.transform-gpu': {
          'transform': 'translateZ(0)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
};

export default config;
