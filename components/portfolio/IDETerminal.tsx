'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const logs = [
  '[info] System initialized. Portfolio components loaded successfully.',
  '[info] Production server ready on personal-portfolio-frontend-henna.vercel.app',
  '[info] Hydrating \'projects.json\' into UI components... Done.',
  '> sh coreComponents.prod',
  'Last login: Wed Oct 23 14:02:11 2024 from 192.168.1.1'
];

export function IDETerminal({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  useEffect(() => {
    // Stagger log appearance
    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
      }, index * 200);
    });
  }, []);

  useEffect(() => {
    // Add route change log
    if (pathname) {
      const fileName = pathname.split('/').pop() || 'about';
      setTerminalLogs(prev => [...prev, `[info] Request: GET /${fileName}.${getFileExtension(fileName)}`]);
    }
  }, [pathname]);

  const getFileExtension = (fileName: string) => {
    const map: Record<string, string> = {
      about: 'sh',
      projects: 'json',
      stack: 'yml',
      services: 'md',
      hire: 'api'
    };
    return map[fileName] || 'txt';
  };

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-48 bg-[#1e1e1e] border-t border-gray-800"
    >
      {/* Terminal tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-[#252526] text-gray-300 text-xs flex items-center gap-2 border-b-2 border-purple-500">
            <span className="uppercase font-semibold">TERMINAL</span>
          </button>
          <button className="px-3 py-1 text-gray-500 hover:text-gray-300 text-xs uppercase">
            OUTPUT
          </button>
          <button className="px-3 py-1 text-gray-500 hover:text-gray-300 text-xs uppercase">
            DEBUG CONSOLE
          </button>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <button 
            onClick={onClose}
            className="hover:text-gray-400 transition-colors"
            title="Minimize"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={onClose}
            className="hover:text-gray-400 transition-colors"
            title="Close"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-4 font-mono text-xs text-gray-300 overflow-y-auto h-[calc(100%-40px)]">
        {terminalLogs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-1"
          >
            {log.includes('[info]') && (
              <span className="text-green-400">{log}</span>
            )}
            {log.includes('[debug]') && (
              <span className="text-blue-400">{log}</span>
            )}
            {!log.includes('[info]') && !log.includes('[debug]') && (
              <span className="text-gray-400">{log}</span>
            )}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-terminal-accent"
        >
          ▮
        </motion.span>
      </div>
    </motion.div>
  );
}
