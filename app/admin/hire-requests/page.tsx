'use client';

// Hire Requests Management Page - Updated
import { useState } from 'react';
import { useHireRequests, useUpdateHireStatus } from '@/hooks/useHireRequests';
import { useStats } from '@/hooks/useStats';
import { HireStatus, HireRequest } from '@/types/api';
import { motion } from 'framer-motion';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { API_ENDPOINTS } from '@/config/api';
import { getInitials, formatDate } from '@/lib/utils';

function HireRequestsContent() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | HireStatus>('all');
  const [viewingRequest, setViewingRequest] = useState<HireRequest | null>(null);
  const [replyingToRequest, setReplyingToRequest] = useState<HireRequest | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);
  
  // Get auth token from localStorage or your auth context
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const { data, isLoading } = useHireRequests(page, 10);
  const { data: statsData } = useStats();
  const updateStatus = useUpdateHireStatus();

  // CSV Export Function - Uses Backend API
  const exportToCSV = async () => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.hireRequestsExport, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const today = new Date();
      const dateStr = today.getFullYear() + '-' + 
        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
        String(today.getDate()).padStart(2, '0');
      link.download = `hire-requests-${dateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('Failed to export CSV');
    }
  };

  // PDF Download Function - Uses Backend API
  const downloadHireRequestPDF = (request: HireRequest) => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    const url = `${API_ENDPOINTS.hireRequestPdf(request.id)}?token=${encodeURIComponent(token)}`;
    window.open(url, '_blank');
  };

  // Send Reply Email Function
  const sendReplyEmail = async (requestId: string, message: string) => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    setReplySending(true);
    try {
      const response = await fetch(API_ENDPOINTS.hireRequestReply(requestId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Reply sent successfully!');
        setReplyingToRequest(null);
        setReplyMessage('');
        // Refresh the data to show updated status
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    } finally {
      setReplySending(false);
    }
  };

  const stats = {
    totalActiveLeads: statsData?.hireRequests?.total ?? data?.pagination?.total ?? 0,
    openRequests: (statsData?.hireRequests?.byStatus?.NEW ?? 0) + (statsData?.hireRequests?.byStatus?.REVIEWING ?? 0),
    closureRate: statsData?.hireRequests?.total && statsData?.hireRequests?.byStatus?.ACCEPTED ? 
      ((statsData.hireRequests.byStatus.ACCEPTED / statsData.hireRequests.total) * 100).toFixed(1) : 
      '0.0',
  };

  const statusColors = {
    NEW: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    REVIEWING: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
    ACCEPTED: 'bg-green-600/20 text-green-400 border-green-600/30',
    DECLINED: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
  };

  const handleStatusChange = async (id: string, newStatus: HireStatus) => {
    await updateStatus.mutateAsync({ id, payload: { status: newStatus } });
  };

  const filteredData = data?.data.filter(req => {
    if (selectedFilter !== 'all' && req.status !== selectedFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return req.candidateName?.toLowerCase().includes(query) || 
             req.companyName?.toLowerCase().includes(query) ||
             req.email?.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a1220]">
      <AdminHeader
        title="Hire Requests"
        description="Review and manage high-intent developer hiring leads."
        actions={
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-[#0d1117] hover:bg-[#1a1f2e] text-white rounded-lg text-sm font-medium transition-colors border border-gray-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Lead
            </button>
          </div>
        }
      />

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Total Active Leads</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white">{stats.totalActiveLeads.toLocaleString()}</h3>
                <span className="text-green-400 text-sm font-medium">+14%</span>
              </div>
            </div>
            <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Open Requests</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white">{stats.openRequests}</h3>
                <span className="text-green-400 text-sm font-medium">+5%</span>
              </div>
            </div>
            <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-2">Closure Rate</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-white">{stats.closureRate}%</h3>
                <span className="text-green-400 text-sm font-medium">{statsData?.hireRequests?.byStatus?.ACCEPTED || 0} accepted</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-[#0d1117] text-gray-400 hover:text-white'
                }`}
              >
                All Statuses
              </button>
              <button
                onClick={() => setSelectedFilter('NEW')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedFilter === 'NEW' ? 'bg-blue-600 text-white' : 'bg-[#0d1117] text-gray-400 hover:text-white'
                }`}
              >
                New
                <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs">
                  {data?.data.filter(r => r.status === 'NEW').length || 0}
                </span>
              </button>
              <button
                onClick={() => setSelectedFilter('REVIEWING')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'REVIEWING' ? 'bg-blue-600 text-white' : 'bg-[#0d1117] text-gray-400 hover:text-white'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setSelectedFilter('ACCEPTED')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'ACCEPTED' ? 'bg-blue-600 text-white' : 'bg-[#0d1117] text-gray-400 hover:text-white'
                }`}
              >
                Interviewing
              </button>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#0d1117] hover:bg-[#1a1f2e] text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort By: Date
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Lead
              </button>
            </div>
          </div>

          {/* Hire Requests Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Message Preview
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading requests...
                      </div>
                    </td>
                  </tr>
                ) : filteredData?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No hire requests found
                    </td>
                  </tr>
                ) : (
                  filteredData?.map((request) => {
                    const colors = ['from-purple-500 to-blue-500', 'from-green-500 to-emerald-500', 'from-orange-500 to-yellow-500', 'from-blue-500 to-cyan-500'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    
                    return (
                      <tr key={request.id} className="hover:bg-[#0a1220] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-br ${randomColor} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
                              {getInitials(request.candidateName)}
                            </div>
                            <div>
                              <p className="text-white font-medium">{request.companyName}</p>
                              <p className="text-gray-400 text-sm">{request.email?.includes('@') ? request.email.split('@')[1] : 'No domain'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white">{request.roleType}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-400 text-sm truncate max-w-md">
                            {request.message}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={request.status}
                            onChange={(e) => handleStatusChange(request.id, e.target.value as HireStatus)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                              statusColors[request.status]
                            } focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="NEW">New</option>
                            <option value="REVIEWING">In Progress</option>
                            <option value="ACCEPTED">Interviewing</option>
                            <option value="DECLINED">Archived</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingRequest(request)}
                              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => downloadHireRequestPDF(request)}
                              className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                              title="Download PDF"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* View Details Modal */}
        {viewingRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewingRequest(null)}
          >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f1419] border border-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#0f1419] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Hire Request Details</h2>
                <p className="text-sm text-gray-400 mt-1">ID: {viewingRequest?.id}</p>
              </div>
              <button
                onClick={() => setViewingRequest(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Information */}
              <div className="bg-[#1a1625] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Project Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Candidate Name</label>
                    <p className="text-white font-medium text-lg">{viewingRequest.candidateName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Company</label>
                    <p className="text-white font-medium">{viewingRequest.companyName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Contact Email</label>
                    <p className="text-white font-medium">{viewingRequest.email}</p>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-[#1a1625] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Tech Stack Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full text-sm font-medium">
                    {viewingRequest.roleType}
                  </span>
                  {viewingRequest.salaryOffer && (
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded-full text-sm font-medium">
                      {viewingRequest.salaryOffer}
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="bg-[#1a1625] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Message
                </h3>
                <p className="text-white whitespace-pre-wrap">{viewingRequest.message}</p>
              </div>

              {/* Status & Timeline */}
              <div className="bg-[#1a1625] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status & Timeline
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Current Status</label>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-xs font-medium border ${statusColors[viewingRequest.status as keyof typeof statusColors]}`}>
                      {viewingRequest.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Received</label>
                    <p className="text-white">{viewingRequest.createdAt ? new Date(viewingRequest.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Last Updated</label>
                    <p className="text-white">{viewingRequest.updatedAt ? new Date(viewingRequest.updatedAt).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              {viewingRequest.internalNotes && (
                <div className="bg-[#1a1625] border border-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Internal Notes
                  </h3>
                  <p className="text-white whitespace-pre-wrap">{viewingRequest.internalNotes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => downloadHireRequestPDF(viewingRequest)}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    setViewingRequest(null);
                    setReplyingToRequest(viewingRequest);
                    setReplyMessage('');
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Reply
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reply Email Modal */}
      {replyingToRequest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setReplyingToRequest(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f1419] border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#0f1419] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Send Reply</h2>
                <p className="text-sm text-gray-400 mt-1">To: {replyingToRequest.email}</p>
                <p className="text-sm text-gray-400">From: {replyingToRequest.candidateName}, {replyingToRequest.companyName}</p>
              </div>
              <button
                onClick={() => setReplyingToRequest(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Reply Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={`Hi ${replyingToRequest.candidateName},\n\nThank you for your interest in working together.\n\nI've reviewed your request for a ${replyingToRequest.roleType} role and I'd be happy to discuss this opportunity further.\n\nWould you like to schedule a call to discuss the details?\n\nBest regards`}
                  className="w-full h-64 px-4 py-3 bg-[#1a1625] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => sendReplyEmail(replyingToRequest.id, replyMessage)}
                  disabled={replySending || !replyMessage.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {replySending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Reply
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setReplyingToRequest(null);
                    setReplyMessage('');
                  }}
                  disabled={replySending}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Main component with authentication guard
export default function HireRequestsPage() {
  return (
    <AdminAuthGuard>
      <HireRequestsContent />
    </AdminAuthGuard>
  );
}

