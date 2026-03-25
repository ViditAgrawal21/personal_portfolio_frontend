'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAbout } from '@/hooks/usePortfolio';

export default function IntroPage() {
  const router = useRouter();
  const { about } = useAbout();

  const slides = useMemo(() => [
    {
      id: 1,
      title: '01. STORY',
      hero: {
        line1: 'Bridging the gap',
        line2: 'between ',
        logic: 'logic',
        and: ' and',
        aesthetics: 'aesthetics',
        period: '.'
      },
      content: {
        left: `With over ${about?.yearsOfExp ?? 1.5}+ years in the industry, I specialize in building high-performance web applications that don't just work—they perform. My philosophy is rooted in brutalist minimalism: removing the noise to let the core functionality shine.`,
        right: 'Currently leading engineering teams to deploy scalable cloud architectures and interactive front-end experiences. I believe code is a medium for storytelling in the obsidian void.'
      }
    },
    {
      id: 2,
      title: '02. PHILOSOPHY',
      hero: {
        line1: 'Code is poetry,',
        line2: 'design is ',
        logic: 'emotion',
        and: '',
        aesthetics: 'captured',
        period: '.'
      },
      content: {
        left: 'Each line of code must have a specific function. I design systems that emphasize performance, maintainability, and user experience. My methodology integrates rigorous type-safety with the ability for swift iterations.',
        right: "From microservices to monolithic architectures, I've developed systems that can scale from zero to a multitude of users. The essential factor is comprehending trade-offs and making deliberate choices at every level of the stack."
      }
    },
    {
      id: 3,
      title: '03. APPROACH',
      hero: {
        line1: 'Building systems',
        line2: 'that ',
        logic: 'scale',
        and: ' and',
        aesthetics: 'inspire',
        period: '.'
      },
      content: {
        left: 'Modern web development/application devlopment requires balancing multiple concerns: performance, accessibility, maintainability, and user experience. I leverage cutting-edge tools like Rust and Next.js to deliver production-grade applications.',
        right: "My technical philosophy emphasizes developer experience as much as user experience. Clean code, comprehensive testing, and thorough documentation are not optional—they're essential."
      }
    }
  ], [about?.yearsOfExp]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) return;

      if (e.deltaY > 50) {
        // Scroll down
        if (currentSlide < slides.length - 1) {
          setIsTransitioning(true);
          setCurrentSlide(prev => prev + 1);
          setTimeout(() => setIsTransitioning(false), 800);
        } else {
          // Last slide completed - trigger IDE transition
          sessionStorage.setItem('fromIntro', 'true');
          router.push('/portfolio/about');
        }
      } else if (e.deltaY < -50) {
        // Scroll up
        if (currentSlide > 0) {
          setIsTransitioning(true);
          setCurrentSlide(prev => prev - 1);
          setTimeout(() => setIsTransitioning(false), 800);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSlide, isTransitioning, router]);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/30 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen"
        />
        {/* subtle grid overlay */}
        <div className="absolute inset-0 bg-[url('/assests/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
      </div>

      {/* Progress indicator */}
      <div className="fixed top-6 right-8 z-50 font-mono text-gray-500 text-sm">
        {currentSlide + 1}/{slides.length}
      </div>

      {/* Left sidebar icons */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
        <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </button>
      </div>

      {/* Vertical text */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <div className="text-gray-600 text-xs tracking-widest" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          {about?.fullName?.toUpperCase() || 'PORTFOLIO'} - {new Date().getFullYear()}
        </div>
      </div>

      {/* Email button */}
      <button className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-20 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl w-full"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-purple-500 text-sm font-mono mb-8 tracking-widest"
            >
              {slide.title}
            </motion.div>

            {/* Hero text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-16"
            >
              <h1 className="text-6xl font-bold leading-tight">
                <div>{slide.hero.line1}</div>
                <div>
                  {slide.hero.line2}
                  <span className="text-blue-400 italic">{slide.hero.logic}</span>
                  {slide.hero.and}
                </div>
                <div>
                  <span className="text-gray-500 italic">{slide.hero.aesthetics}</span>
                  {slide.hero.period}
                </div>
              </h1>
            </motion.div>

            {/* Two column content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-12 text-gray-400 leading-relaxed"
            >
              <p className="text-orange-300/80">{slide.content.left}</p>
              <p>{slide.content.right}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-900">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentSlide + 1) / 5) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Scroll indicator */}
      {currentSlide < slides.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 text-gray-600 text-xs font-mono flex flex-col items-center gap-2"
        >
          <span>SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
