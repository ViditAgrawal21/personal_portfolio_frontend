'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface InteractiveDataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  searchPlaceholder?: string;
  searchTokens?: (row: T) => string; // Function returning a searchable string for the row
}

export function InteractiveDataGrid<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  searchPlaceholder = 'Search records...',
  searchTokens
}: InteractiveDataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | string, direction: 'asc' | 'desc' } | null>(null);

  // Filtering
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    if (searchTokens) {
      return searchTokens(row).toLowerCase().includes(searchTerm.toLowerCase());
    }
    // Fallback naive search across all string/number values
    return Object.values(row as any).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    // Naive sorting, can be extended for dates/custom types
    const valA = (a as any)[key];
    const valB = (b as any)[key];
    
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof T | string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') return { key, direction: 'desc' };
        return null; // toggle off
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#151515]">
        <div className="relative w-64">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-700 text-sm text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[var(--accent-color)] transition-colors placeholder-gray-600 font-mono"
          />
        </div>
        
        <div className="text-xs text-gray-500 font-mono flex gap-4">
          <span>{sortedData.length} RECORDS</span>
          {sortConfig && <span style={{ color: 'var(--accent-color)' }}>SORTED BY: {String(sortConfig.key).toUpperCase()}</span>}
        </div>
      </div>

      {/* Table Header */}
      <div className="flex px-6 py-3 bg-[#131313] border-b border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider select-none">
        {columns.map((col) => (
          <div 
            key={String(col.key)} 
            className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors flex-1 ${col.width || ''}`}
            onClick={() => handleSort(col.key)}
          >
            {col.header}
            {sortConfig?.key === col.key && (
              <span style={{ color: 'var(--accent-color)' }}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto hide-scrollbar">
        <AnimatePresence>
          {sortedData.map((row) => (
            <motion.div 
              key={keyExtractor(row)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={() => onRowClick?.(row)}
              className={`flex px-6 py-4 border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors items-center ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <div key={String(col.key)} className={`text-sm flex-1 ${col.width || ''}`}>
                  {col.render ? col.render(row) : String((row as any)[col.key] || '—')}
                </div>
              ))}
            </motion.div>
          ))}
          {sortedData.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-mono text-sm">
              NO RECORDS MATCHING QUERY
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
