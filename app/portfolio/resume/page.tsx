'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ResumePage() {
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/assests/vidit_agrawal_1.pdf';
    link.setAttribute('download', 'Vidit_Agrawal_Resume.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full bg-[#0a0a0a] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#1a1a1a] border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-gray-300 text-sm transition-colors"
          >
            −
          </button>
          <span className="text-gray-300 font-mono text-sm">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-gray-300 text-sm transition-colors"
          >
            +
          </button>
          <span className="text-gray-500 text-sm ml-4">Page 1 / 1</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded text-white text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            DOWNLOAD PDF
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Resume Content */}
          <div className="p-12 bg-white text-black">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-600">
                    <img 
                      src="/assests/png_5.png" 
                      alt="Vidit Agrawal" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-1">Vidit Agrawal</h1>
                    <p className="text-xl text-purple-600 font-semibold uppercase tracking-wide">
                      Software Developer
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>agrawalvidit656@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+91 8530567856</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-purple-600 mb-6"></div>

            {/* Professional Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-600 uppercase tracking-wide mb-4">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Software Developer with hands-on experience in building high-performance mobile and web applications using React Native, Flutter, and .NET. Proven ability to design clean UI systems, integrate real-time APIs, and deliver scalable solutions across platforms. Strong foundation in data structures, IoT integrations, and system optimization, with a track record of improving performance, usability, and deployment efficiency. Passionate about writing maintainable code and solving real-world problems through technology.
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-600 uppercase tracking-wide mb-4">
                Experience
              </h2>

              {/* Job 1 */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Software Developer</h3>
                    <p className="text-purple-600 font-semibold">Synept Labs — Oct 2025 – Present</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Developed cross-platform React Native applications with smoother animations, reduced input latency, and enhanced UI rendering for Android and iOS.</li>
                  <li>Designed minimal, user-centric UI systems improving visual clarity and navigation efficiency.</li>
                  <li>Implemented REST API integrations and optimized state management, reducing data load times and improving synchronization reliability.</li>
                  <li>Managed complete mobile app lifecycle including secure authentication, caching, debugging, and production deployment.</li>
                </ul>
              </div>

              {/* Job 2 */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Software Engineer</h3>
                    <p className="text-purple-600 font-semibold">Technowings Automation Pvt. Ltd. — May 2025 – Oct 2025</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Built an Air Leak Tester Flutter application that reduced industrial testing time by 60% through real-time IoT monitoring.</li>
                  <li>Integrated Thinger.io APIs and WebSocket streams achieving sub-100ms live telemetry across 15+ device endpoints.</li>
                  <li>Implemented secure authentication, custom-branded PDF report generation, and optimized cross-platform builds, cutting deployment overhead by 40%.</li>
                </ul>
              </div>

              {/* Job 3 */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Web Development Intern</h3>
                    <p className="text-purple-600 font-semibold">Maxgen Pvt. Ltd. — Aug 2023 – Nov 2023</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Improved frontend performance through component refactoring and UI enhancements.</li>
                  <li>Contributed to code reviews and collaborated on feature improvements following best development practices.</li>
                </ul>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-600 uppercase tracking-wide mb-4">
                Technical Skills
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Programming Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">C++</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">Dart</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">JavaScript</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">SQL</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Mobile Development</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">Flutter</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">React Native</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">Firebase</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">BLE</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">REST APIs</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Web & Backend</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">.NET 8</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">WPF</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">Entity Framework Core</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Databases & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">MySQL</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">Git</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">Docker</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">Linux</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Core Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">Data Structures & Algorithms</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">OOP</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">Problem Solving</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-semibold text-gray-800">System Design</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-600 uppercase tracking-wide mb-4">
                Education
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">B.Tech in Electronics & Telecommunication</h3>
                  <p className="text-purple-600 font-semibold">Pimpri Chinchwad College of Engineering — 2024</p>
                  <p className="text-gray-600">CGPA: 7.5 / 10</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">HSC</h3>
                  <p className="text-purple-600 font-semibold">Brijlal Biyani College — 2020</p>
                  <p className="text-gray-600">81%</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">SSC</h3>
                  <p className="text-purple-600 font-semibold">Dnyanmata High School — 2018</p>
                  <p className="text-gray-600">90%</p>
                </div>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-600 uppercase tracking-wide mb-4">
                Key Achievements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-2">HackerRank</h3>
                  <p className="text-sm text-gray-700">C++ ⭐⭐⭐⭐ (4 Stars)</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-2">LeetCode</h3>
                  <p className="text-sm text-gray-700">Solved 200+ problems</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-2">GeeksforGeeks</h3>
                  <p className="text-sm text-gray-700">Solved 200+ problems</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-2">GFG Certification</h3>
                  <p className="text-sm text-gray-700">Self-Paced C++ Course</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 col-span-2">
                  <h3 className="font-bold text-gray-900 mb-2">Enterprise System</h3>
                  <p className="text-sm text-gray-700">Designed systems generating 100k+ records in under 5 seconds for enterprise reporting</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
