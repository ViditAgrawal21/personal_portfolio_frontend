'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAbout, useTechStack, useProjects } from '@/hooks/usePortfolio';
import Link from 'next/link';

export default function AboutPage() {
  const { about, loading: aboutLoading } = useAbout();
  const { techStack, loading: techLoading } = useTechStack();
  const { projects, loading: projectsLoading } = useProjects();

  useEffect(() => {
    sessionStorage.setItem('fromIntro', 'true');
  }, []);

  const featuredProjects = projects?.filter((p: any) => p.isFeatured).slice(0, 3) || [];
  const topTechnologies = techStack?.slice(0, 3) || [];

  if (aboutLoading || techLoading || projectsLoading) {
    return (
      <div className="h-full bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent overflow-auto relative">
      <div className="max-w-7xl mx-auto px-8 py-16">
        
        {/* Pseudo-code header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-sm mb-12"
        >
          <span className="text-gray-500">#!/bin/bash</span><br/>
          <span className="text-gray-500"># ==========================================</span><br/>
          <span className="text-gray-500"># File: about.sh</span><br/>
          <span className="text-gray-500"># Description: System architect profile</span><br/>
          <span className="text-gray-500"># Author: <span className="text-green-400">{about?.fullName || 'Root'}</span></span><br/>
          <span className="text-gray-500"># ==========================================</span><br/>
          <br/>
          <span className="text-purple-400">echo</span> <span className="text-green-300">"Initializing profile sequence..."</span>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24"
        >
          {/* Left Side - Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-purple-400 uppercase tracking-wider mb-4">
                {about?.title || 'PRINCIPAL ARCHITECT'}
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Crafting Digital
                <br />
                <span className="text-purple-400">Masterpieces.</span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                {about?.bio || 'Transforming complex challenges into elegant, scalable solutions with a decade of expertise in full-stack engineering.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              {about?.resumeUrl ? (
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
                >
                  Download CV
                </a>
              ) : (
                <span className="px-6 py-3 bg-purple-600/40 text-white/50 rounded-lg font-medium cursor-not-allowed">
                  Download CV
                </span>
              )}
              <a
                href={about?.githubUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-transparent border border-gray-700 hover:border-purple-500 text-white rounded-lg transition-colors font-medium"
              >
                View Github
              </a>
            </motion.div>
          </div>

          {/* Right Side - Profile Image */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 rounded-2xl overflow-hidden aspect-[3/4] max-w-md mx-auto">
              <img
                src="/assests/profile_photo.png"
                alt={about?.fullName || 'Profile'}
                className="w-full h-full object-cover"
              />
              {about?.isAvailable && (
                <div className="absolute bottom-6 left-6 bg-green-500/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span className="text-white text-sm font-medium">
                    {about?.availabilityStatus || 'AVAILABLE FOR HIRE'}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-300 text-lg font-medium">
                Based in {about?.location || 'Pune, Maharashtra'}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          <div className="bg-[#1a1625] border border-gray-800 rounded-xl p-6 text-center hover:border-purple-600/50 transition-all">
            <div className="text-5xl mb-3">🎯</div>
            <div className="text-3xl font-bold text-white mb-2">{about?.yearsOfExp ? `${about.yearsOfExp}+` : '—'}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</div>
          </div>

          <div className="bg-[#1a1625] border border-gray-800 rounded-xl p-6 text-center hover:border-purple-600/50 transition-all">
            <div className="text-5xl mb-3">🚀</div>
            <div className="text-3xl font-bold text-white mb-2">30+</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Deployments</div>
          </div>

          <div className="bg-[#1a1625] border border-gray-800 rounded-xl p-6 text-center hover:border-purple-600/50 transition-all">
            <div className="text-5xl mb-3">💼</div>
            <div className="text-3xl font-bold text-white mb-2">30+</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">Projects</div>
          </div>

          <div className="bg-[#0f0f0f]/80 backdrop-blur-md border border-gray-800/80 rounded-xl p-6 text-center shadow-lg hover:border-purple-600/50 hover:shadow-purple-500/10 transition-all group">
            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">⭐</div>
            <div className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 group-hover:from-purple-400 group-hover:to-pink-400">100%</div>
            <div className="text-sm text-gray-500 font-mono tracking-wider">Client Satisfaction</div>
          </div>
        </motion.div>

        {/* Technical Proficiency */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-sm text-purple-400 uppercase tracking-[0.2em] font-semibold mb-6">
                  Technical Proficiency
                </p>
              </div>
              <div className="space-y-8">
                {topTechnologies.length > 0 ? (
                  topTechnologies.map((tech: any, index: number) => (
                    <motion.div
                      key={`tech-item-${index}`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-semibold text-lg">{tech.name}</span>
                        <span className="text-purple-400 font-bold text-sm">{tech.proficiency}%</span>
                      </div>
                      <div className="relative h-3 bg-[#1a1625] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tech.proficiency}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 1.2, ease: "easeOut" }}
                          className="absolute h-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/30"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">
                    No technologies added yet.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative"
              >
                <div className="relative w-72 h-72">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="#1a1625"
                      strokeWidth="18"
                    />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="url(#skillGradient)"
                      strokeWidth="18"
                      strokeLinecap="round"
                      strokeDasharray="534"
                      initial={{ strokeDashoffset: 534 }}
                      animate={{ strokeDashoffset: 80 }}
                      transition={{ delay: 0.9, duration: 2.5, ease: "easeInOut" }}
                      filter="url(#glow)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                      className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-xl"
                    >
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                      </svg>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 }}
                      className="mt-4 text-center"
                    >
                      <div className="text-white font-bold text-xl tracking-wider">USE SKILL BASE</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                Featured Projects
              </h2>
              <p className="text-gray-400 text-lg">Selected work from 2022 - 2026</p>
            </div>
            <Link
              href="/portfolio/projects"
              className="text-purple-400 hover:text-purple-300 flex items-center gap-2 group font-medium"
            >
              <span>View All Case Studies</span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project: any, index: number) => (
              <motion.div
                key={project.id || `featured-project-${index}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.15, duration: 0.6 }}
                className="group relative"
              >
                <div className="relative bg-[#1a1625] border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="relative">
                          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl opacity-20"></div>
                          <svg className="w-16 h-16 text-gray-600 absolute inset-0 m-auto" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1625] via-transparent to-transparent opacity-60"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(project.techStack || []).slice(0, 4).map((tech: string, i: number) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 bg-purple-600/10 border border-purple-600/20 text-purple-400 text-xs font-medium rounded-full hover:bg-purple-600/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.techStack || []).length > 4 && (
                        <span className="px-3 py-1.5 bg-gray-800 text-gray-400 text-xs font-medium rounded-full">
                          +{(project.techStack || []).length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-purple-600 p-2 rounded-full shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {featuredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative overflow-hidden"
            >
              <div className="bg-gradient-to-br from-[#1a1625] to-[#0f1419] border border-gray-800 rounded-2xl p-16 text-center">
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    className="inline-block mb-6"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Featured Projects Yet</h3>
                  {/* <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Start showcasing your best work by marking projects as featured in the admin panel.
                  </p> */}
                  {/* <Link
                    href="/admin/content/projects"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Projects
                  </Link> */}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5"></div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
