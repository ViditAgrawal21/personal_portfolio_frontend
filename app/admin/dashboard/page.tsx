'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { useStats } from '@/hooks/useStats';
import { useInquiries } from '@/hooks/useInquiries';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: recentInquiries } = useInquiries(1, 5);

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Overview" 
        description="Monitor your portfolio inquiries and lead acquisition"
      />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Inquiries"
            value={statsLoading ? '...' : ((stats?.inquiries?.total ?? 0).toLocaleString())}
            change="+12%"
            trend="up"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="New Requests"
            value={statsLoading ? '...' : ((stats?.inquiries?.byStatus?.NEW ?? 0).toString())}
            change="+8%"
            trend="up"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          />
          <StatCard
            title="Pending Follow-ups"
            value={statsLoading ? '...' : (((stats?.inquiries?.byStatus?.IN_PROGRESS ?? 0) + (stats?.inquiries?.byStatus?.CONTACTED ?? 0)).toString())}
            change="-2%"
            trend="down"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Conversion Rate"
            value={statsLoading ? '...' : `${(((stats?.inquiries?.byStatus?.CONVERTED ?? 0) / (stats?.inquiries?.total ?? 1)) * 100).toFixed(1)}%`}
            change="+3.2%"
            trend="up"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* Lead Velocity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1f2e] border border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Lead Velocity</h2>
              <p className="text-sm text-gray-400">Overview of monthly portfolio inquiries and lead acquisition</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">Monthly</button>
              <button className="px-4 py-2 bg-[#0f1419] text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors">Weekly</button>
              <button className="px-4 py-2 bg-[#0f1419] text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors">Daily</button>
            </div>
          </div>
          
          {/* Simple Chart Visualization */}
          <div className="h-64 flex items-end gap-4">
            {['JAN', 'MAR', 'MAY', 'JUL', 'SEP', 'NOV', 'DEC'].map((month, i) => {
              const heights = [40, 55, 65, 75, 60, 45, 80];
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heights[i]}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                      {Math.floor(heights[i] * 15)} inquiries
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-500">{month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Inquiries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-[#1a1f2e] border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Inquiries</h2>
              <Link href="/admin/inquiries" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-400 uppercase pb-3 border-b border-gray-800">
                <div className="col-span-3">Client</div>
                <div className="col-span-3">Project Type</div>
                <div className="col-span-2">Budget</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Time</div>
              </div>

              {/* Table Rows */}
              {recentInquiries?.data.slice(0, 3).map((inquiry) => (
                <div key={inquiry.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-800/50 hover:bg-[#0f1419] rounded-lg transition-colors px-2">
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-semibold text-sm">
                        {inquiry.clientName[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{inquiry.clientName}</p>
                        <p className="text-gray-500 text-xs">{inquiry.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs font-medium">
                      {inquiry.serviceType}
                    </span>
                  </div>
                  <div className="col-span-2 text-white text-sm">
                    {inquiry.budgetRange || 'N/A'}
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      inquiry.status === 'NEW' ? 'bg-green-600/20 text-green-400' :
                      inquiry.status === 'IN_PROGRESS' ? 'bg-yellow-600/20 text-yellow-400' :
                      inquiry.status === 'CONTACTED' ? 'bg-blue-600/20 text-blue-400' :
                      'bg-purple-600/20 text-purple-400'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-400 text-sm">
                    {formatDate(inquiry.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1f2e] border border-gray-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Action Items</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">Discovery Call</h3>
                    <p className="text-gray-400 text-xs">with John Doe @ 2:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">Send Proposal</h3>
                    <p className="text-gray-400 text-xs">Project due in 2 hrs 38 m</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">Follow up: Sarah</h3>
                    <p className="text-gray-400 text-xs">Sent 3 days ago</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Task
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
