'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BackgroundPage() {
  return (
    <div className="h-full bg-[#0a0a0a] overflow-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🎨</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Hero Background</h1>
              <p className="text-gray-500 text-sm">Composition_01</p>
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            High-end abstract digital artwork and featuring portrait integration with Gaussian depth and neon mesh effects.
          </p>
        </motion.div>

        {/* Image Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden"
        >
          {/* Image Container */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Main content with fallback */}
              <div className="text-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/assests/png_5.png"
                    alt="Vidit Agrawal"
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold text-white">
                    Hero Background
                  </h2>
                  <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
                    Composition_01
                  </p>
                  <p className="text-gray-400 max-w-md mx-auto mt-4">
                    High-end abstract digital artwork and featuring portrait integration with Gaussian depth and neon mesh effects.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Zoom indicator */}
            <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1.5 rounded text-white text-sm font-mono">
              zoom_in 100% (1:1)
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bg-[#252526] border-t border-gray-800 p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">DIMENSIONS</span>
                <span className="text-white font-mono">3840 x 2160 (4K)</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">FILE SIZE</span>
                <span className="text-white font-mono">4.2 MB</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">FORMAT</span>
                <span className="text-white font-mono">Portable Network Graphics (.png)</span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded text-white text-sm font-semibold transition-all">
                SET AS DESKTOP BACKGROUND
              </button>
              <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-gray-300 text-sm font-semibold transition-colors">
                DOWNLOAD RAW ASSET
              </button>
            </div>
          </div>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 bg-[#1a1a1a] border border-gray-800 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">METADATA</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Last Modified:</span>
              <span className="text-gray-300 ml-2">Oct 24, 2023 • 14:02</span>
            </div>
            <div>
              <span className="text-gray-500">Color Space:</span>
              <span className="text-gray-300 ml-2">sRGB IEC61966-2.1</span>
            </div>
            <div>
              <span className="text-gray-500">Bit Depth:</span>
              <span className="text-gray-300 ml-2">24-bit RGB</span>
            </div>
            <div>
              <span className="text-gray-500">Compression:</span>
              <span className="text-gray-300 ml-2">Deflate/Inflate</span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-600/30 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-purple-400 mb-2">About this Asset</h3>
          <p className="text-gray-400 leading-relaxed">
            This high-resolution composition features a stylized portrait illustration with abstract gradient backgrounds and modern design elements. Perfect for hero sections, portfolio headers, and modern web applications seeking a contemporary aesthetic.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
