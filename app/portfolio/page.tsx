'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortfolioRoot() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to about page by default
    router.push('/portfolio/about');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-gray-500 text-sm font-mono"
      >
        Loading...
      </motion.div>
    </div>
  );
}
