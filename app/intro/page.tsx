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
    let touchStartY = 0;

    const handleNext = () => {
      if (isTransitioning) return;
      if (currentSlide < slides.length - 1) {
        setIsTransitioning(true);
        setCurrentSlide(prev => prev + 1);
        setTimeout(() => setIsTransitioning(false), 800);
      } else {
        // Last slide completed - trigger IDE transition
        sessionStorage.setItem('fromIntro', 'true');
        router.push('/portfolio/about');
      }
    };

    const handlePrev = () => {
      if (isTransitioning) return;
      if (currentSlide > 0) {
        setIsTransitioning(true);
        setCurrentSlide(prev => prev - 1);
        setTimeout(() => setIsTransitioning(false), 800);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 50) {
        handleNext();
      } else if (e.deltaY < -50) {
        handlePrev();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      if (deltaY > 50) {
        // Swipe up (scroll down)
        handleNext();
      } else if (deltaY < -50) {
        // Swipe down (scroll up)
        handlePrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSlide, isTransitioning, router, slides.length]);

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

      {/* Left sidebar icons (Mobile Bottom Dock) */}
      <div className="fixed md:left-8 left-1/2 -translate-x-1/2 md:translate-x-0 bottom-8 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-50 flex flex-row md:flex-col gap-6 md:gap-6 bg-black/60 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none px-6 py-3 md:p-0 border border-gray-800 md:border-transparent rounded-full md:rounded-none shadow-2xl md:shadow-none">
        <button 
          onClick={() => { sessionStorage.setItem('fromIntro', 'true'); router.push('/portfolio/about'); }}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          title="About"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button 
          onClick={() => { sessionStorage.setItem('fromIntro', 'true'); router.push('/portfolio/resume'); }}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          title="Resume"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        <button 
          onClick={() => { sessionStorage.setItem('fromIntro', 'true'); router.push('/portfolio/stack'); }}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          title="Tech Stack"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <button 
          onClick={() => { sessionStorage.setItem('fromIntro', 'true'); router.push('/portfolio/projects'); }}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          title="Projects"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </button>
      </div>

      {/* Vertical text */}
      <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <div className="text-gray-600 text-xs tracking-widest" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          {about?.fullName?.toUpperCase() || 'PORTFOLIO'} - {new Date().getFullYear()}
        </div>
      </div>

      {/* Contact buttons */}
      <div className="fixed top-6 right-6 md:top-auto md:right-auto md:bottom-8 md:left-8 z-50 flex flex-col md:flex-col gap-4">
        {/* Email button */}
        <a 
          href="mailto:agrawalvidit656@gmail.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/40"
          title="Email Me"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
        
        {/* WhatsApp button */}
        <a 
          href="https://wa.me/918530567857" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#25D366]/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#25D366] transition-colors shadow-lg shadow-green-900/30"
          title="WhatsApp Me"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-6 md:px-20 relative z-10 pt-20 pb-28 md:py-0">
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
              className="text-purple-500 text-sm font-mono mb-4 md:mb-8 tracking-widest uppercase"
            >
              {slide.title}
            </motion.div>

            {/* Hero text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 md:mb-16"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                <div>{slide.hero.line1}</div>
                <div>
                  {slide.hero.line2}
                  <span className="text-blue-400 italic break-keep">{slide.hero.logic}</span>
                  {slide.hero.and}
                </div>
                <div>
                  <span className="text-gray-500 italic uppercase ml-1 md:ml-0 md:uppercase-none">{slide.hero.aesthetics}</span>
                  {slide.hero.period}
                </div>
              </h1>
            </motion.div>

            {/* Two column content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 text-gray-400 text-sm md:text-base leading-relaxed"
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
          className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-50 text-gray-600 text-xs font-mono flex flex-col items-center gap-2"
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
