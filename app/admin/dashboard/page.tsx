'use client';

import { useState } from 'react';
import { useStats } from '@/hooks/useStats';
import { useInquiries } from '@/hooks/useInquiries';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ControlModule } from '@/components/admin/ui/ControlModule';
import { InteractiveDataGrid } from '@/components/admin/ui/InteractiveDataGrid';
import { SystemButton } from '@/components/admin/ui/SystemButton';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: recentInquiries } = useInquiries(1, 10);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');

  // Trigger sync animation when clicking actions
  const triggerSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('synced'), 800);
  };

  const columns = [
    {
      key: 'clientName',
      header: 'Client / Contact',
      width: 'flex-[1.5]',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-xs ring-1 ring-purple-600/30">
            {row.clientName[0]}
          </div>
          <div>
            <p className="text-white font-bold">{row.clientName}</p>
            <p className="text-gray-500 text-xs font-mono">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'companyName',
      header: 'Organization',
      render: (row: any) => (
        <span className="px-2 py-1 bg-blue-900/40 text-blue-400 rounded text-xs font-bold font-mono border border-blue-500/20">
          {row.companyName || 'INDEPENDENT'}
        </span>
      )
    },
    {
      key: 'budgetRange',
      header: 'Est. Budget',
      render: (row: any) => <span className="font-mono text-green-400 text-sm">{row.budgetRange || 'TBD'}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => {
        const colors = {
          NEW: 'bg-green-900/40 text-green-400 border-green-500/30',
          IN_PROGRESS: 'bg-yellow-900/40 text-yellow-400 border-yellow-500/30',
          CONTACTED: 'bg-blue-900/40 text-blue-400 border-blue-500/30',
        } as any;
        return (
          <span className={`px-2 py-1 flex items-center gap-1.5 w-max rounded-full text-[10px] font-bold tracking-wider uppercase border ${colors[row.status] || 'bg-purple-900/40 text-purple-400 border-purple-500/30'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'NEW' ? 'animate-pulse bg-green-400' : 'bg-current'}`} />
            {row.status}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      header: 'Timestamp',
      render: (row: any) => <span className="text-gray-500 font-mono text-xs">{formatDate(row.createdAt)}</span>
    }
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Control Center</h1>
          <p className="text-sm font-mono text-gray-500 mt-1">DEV_OS_V3 // ACTIVE_SESSION</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111] rounded-full border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] ${syncStatus === 'synced' ? 'bg-green-500 text-green-500' : 'bg-yellow-500 text-yellow-500 animate-pulse'}`} />
            <span className="text-xs font-bold text-gray-300 font-mono tracking-wider">{syncStatus === 'synced' ? 'SYNCED' : 'SAVING...'}</span>
          </div>
          <SystemButton variant="primary" onClick={triggerSync}>Manual Sync</SystemButton>
        </div>
      </div>

      {/* Primary Metrics */}
      <ControlModule 
        title="Acquisition Metrics" 
        icon="📊"
        statusLabel="LIVE STREAM"
        statusColor="green"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#151515] p-5 rounded-xl border border-gray-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">📈</div>
            <p className="text-sm font-bold text-gray-500 mb-1">Total Inquiries</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-black text-white">{statsLoading ? '...' : (stats?.inquiries?.total ?? 0)}</h3>
              <span className="text-sm font-bold text-green-400 mb-1">+12%</span>
            </div>
          </div>
          <div className="bg-[#151515] p-5 rounded-xl border border-gray-800 relative overflow-hidden group">
            <p className="text-sm font-bold text-gray-500 mb-1">New Leads</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-black text-white">{statsLoading ? '...' : (stats?.inquiries?.byStatus?.NEW ?? 0)}</h3>
              <span className="text-sm font-bold text-green-400 mb-1">+8%</span>
            </div>
          </div>
          <div className="bg-[#151515] p-5 rounded-xl border border-gray-800 relative overflow-hidden group">
            <p className="text-sm font-bold text-gray-500 mb-1">Conversion Rate</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-black text-white">{statsLoading ? '...' : `${(((stats?.inquiries?.byStatus?.CONVERTED ?? 0) / (stats?.inquiries?.total ?? 1)) * 100).toFixed(1)}%`}</h3>
              <span className="text-sm font-bold text-blue-400 mb-1">Steady</span>
            </div>
          </div>
          <div className="bg-[#151515] p-5 rounded-xl border border-gray-800 relative overflow-hidden flex flex-col justify-center">
             <button className="w-full h-full py-2 bg-purple-900/20 text-purple-400 font-bold border border-purple-500/20 rounded-lg hover:bg-purple-900/40 transition-colors shadow-inner flex items-center justify-center gap-2">
               <span>+</span> Generate Report
             </button>
          </div>
        </div>
      </ControlModule>

      {/* Dual Layout: Data Grid + Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Interactive Data Grid Module */}
        <div className="xl:col-span-2">
          <ControlModule 
            title="Inquiry Databank" 
            icon="🗄️" 
            statusLabel={`${recentInquiries?.data?.length || 0} ACTIVE`}
            statusColor="blue"
            className="h-[600px] flex flex-col"
          >
            <div className="h-full flex flex-col -mx-6 -my-6">
              <InteractiveDataGrid 
                data={recentInquiries?.data || []}
                columns={columns}
                keyExtractor={(row: any) => row.id}
                searchTokens={(row: any) => `${row.clientName} ${row.email} ${row.companyName}`}
              />
            </div>
          </ControlModule>
        </div>

        {/* Action Items / Workflows */}
        <div className="space-y-8">
          <ControlModule title="Workflow Engine" icon="⚡" statusLabel="3 PENDING" statusColor="yellow">
            <div className="space-y-3">
              <div className="p-3 bg-purple-900/10 border border-purple-900/30 hover:border-purple-600/50 rounded-lg transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Discovery Call</h4>
                  <span className="text-xs font-mono bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">2:00 PM</span>
                </div>
                <p className="text-xs text-gray-500 font-mono">John Doe • System Integration</p>
              </div>

              <div className="p-3 bg-[#151515] border border-gray-800 hover:border-gray-600 rounded-lg transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Draft Proposal</h4>
                  <span className="text-xs font-mono bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">DUE 4H</span>
                </div>
                <p className="text-xs text-gray-500 font-mono">Acme Corp • Frontend Renewal</p>
              </div>

              <div className="p-3 bg-[#151515] border border-gray-800 hover:border-gray-600 rounded-lg transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">Client Follow-up</h4>
                  <span className="text-xs font-mono bg-green-900/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20">DUE SOON</span>
                </div>
                <p className="text-xs text-gray-500 font-mono">Sarah Tech • Waiting for docs</p>
              </div>

              <SystemButton variant="secondary" className="w-full mt-4" size="sm">
                + Create Workflow Node
              </SystemButton>
            </div>
          </ControlModule>
          
          <ControlModule title="System Log" icon="👁️" defaultExpanded={false}>
            <div className="space-y-2 font-mono text-xs p-2 bg-[#0a0a0c] border border-gray-800 rounded-lg shadow-inner">
               <div className="text-gray-500"><span className="text-green-500">2026-03-24</span> System Initialized via secure auth</div>
               <div className="text-gray-500"><span className="text-blue-500">2026-03-24</span> Sync: 4 changes pushed to cloud</div>
               <div className="text-gray-500"><span className="text-purple-500">2026-03-24</span> New Inquiry [ID:74892] detected</div>
            </div>
          </ControlModule>
        </div>

      </div>

    </div>
  );
}
