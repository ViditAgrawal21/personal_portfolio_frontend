'use client';

import { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { useInquiries, useUpdateInquiryStatus, useExportInquiries } from '@/hooks/useInquiries';
import { useStats } from '@/hooks/useStats';
import { InquiryStatus, ServiceInquiry } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/config/api';

function ServiceInquiriesContent() {
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [viewingInquiry, setViewingInquiry] = useState<ServiceInquiry | null>(null);
  const [replyingToInquiry, setReplyingToInquiry] = useState<ServiceInquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);
  
  // Get auth token from localStorage or your auth context
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const { data, isLoading } = useInquiries(page, 10, selectedStatus);
  const { data: stats } = useStats();
  const updateStatus = useUpdateInquiryStatus();
  // Remove the old hook - we'll use direct API calls
  // const exportInquiries = useExportInquiries();

  // CSV Export Function - Uses Backend API
  const exportToCSV = async () => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.inquiriesExport, {
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
      link.download = `service-inquiries-${dateStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('XLSX export failed:', error);
      alert('Failed to export XLSX');
    }
  };

  const downloadInquiryPDF = async (inquiry: ServiceInquiry) => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.inquiryPdf(inquiry.id), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('PDF download failed');
      }

      const blob = await response.blob();
      // Handle json error responses that got caught as blob accidentally (if backend returns 200 json by mistake)
      if (blob.type === 'application/json') {
        const text = await blob.text();
        console.error('Backend returned JSON instead of PDF:', text);
        throw new Error('Invalid response format');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Default to a safe filename
      const safeName = (inquiry.clientName || 'client').replace(/[^a-z0-9]/gi, '-').toLowerCase();
      link.download = `inquiry-${safeName}-${inquiry.id.substring(0, 6)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download failed:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  // Send Reply Email Function
  const sendReplyEmail = async (inquiryId: string, message: string) => {
    if (!token) {
      alert('Authentication required');
      return;
    }

    setReplySending(true);
    try {
      const response = await fetch(API_ENDPOINTS.inquiryReply(inquiryId), {
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
        setReplyingToInquiry(null);
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

  const statusColors = {
    NEW: 'bg-blue-600/20 text-blue-400',
    IN_PROGRESS: 'bg-yellow-600/20 text-yellow-400',
    CONTACTED: 'bg-purple-600/20 text-purple-400',
    CONVERTED: 'bg-green-600/20 text-green-400',
    REJECTED: 'bg-gray-600/20 text-gray-400',
  };

  const serviceTypeColors = {
    Mobile: 'bg-blue-600/20 text-blue-400',
    Backend: 'bg-purple-600/20 text-purple-400',
    Fullstack: 'bg-green-600/20 text-green-400',
    'Web Development': 'bg-cyan-600/20 text-cyan-400',
    Infrastructure: 'bg-gray-600/20 text-gray-400',
  };

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    await updateStatus.mutateAsync({ id, payload: { status: newStatus } });
  };

  const filteredData = data?.data.filter(inquiry => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inquiry.clientName?.toLowerCase().includes(q) ||
      (inquiry.companyName?.toLowerCase().includes(q) ?? false) ||
      inquiry.email?.toLowerCase().includes(q) ||
      inquiry.serviceType?.toLowerCase().includes(q)
    );
  });

  const toggleSelectInquiry = (id: string) => {
    setSelectedInquiries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedInquiries.length === data?.data.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(data?.data.map(i => i.id) || []);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1220]">
      <AdminHeader
        title="Service Inquiries"
        description="Track and manage project leads from your portfolio."
        actions={
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-[#1a1f2e] hover:bg-[#232936] text-white rounded-lg text-sm font-medium transition-colors border border-gray-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export XLSX
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Inquiry
            </button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Total Inquiries</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-white">{stats?.inquiries?.total ?? data?.pagination?.total ?? 0}</h3>
              <span className="text-green-400 text-sm font-medium">All Time</span>
            </div>
          </div>
          <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">New This Month</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-white">{stats?.inquiries?.thisMonth ?? 0}</h3>
              <span className="text-blue-400 text-sm font-medium">+{stats?.inquiries?.thisMonth && stats?.inquiries?.total ? Math.floor((stats.inquiries.thisMonth / stats.inquiries.total) * 100) : 0}%</span>
            </div>
          </div>
          <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Conversion Rate</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-white">
                {stats?.inquiries?.total && stats?.inquiries?.byStatus?.CONVERTED ? ((stats.inquiries.byStatus.CONVERTED / stats.inquiries.total) * 100).toFixed(1) : '0.0'}%
              </h3>
              <span className="text-purple-400 text-sm font-medium">
                {stats?.inquiries?.byStatus?.CONVERTED ?? 0} converted
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search inquiries by name, company or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-[#0f1419] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus(undefined)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedStatus ? 'bg-blue-600 text-white' : 'bg-[#0f1419] text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('NEW' as InquiryStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'NEW' ? 'bg-blue-600 text-white' : 'bg-[#0f1419] text-gray-400 hover:text-white'
              }`}
            >
              New
            </button>
            <button
              onClick={() => setSelectedStatus('IN_PROGRESS' as InquiryStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'IN_PROGRESS' ? 'bg-yellow-600 text-white' : 'bg-[#0f1419] text-gray-400 hover:text-white'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setSelectedStatus('CONTACTED' as InquiryStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'CONTACTED' ? 'bg-purple-600 text-white' : 'bg-[#0f1419] text-gray-400 hover:text-white'
              }`}
            >
              Contacted
            </button>
            <button
              onClick={() => setSelectedStatus('CONVERTED' as InquiryStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'CONVERTED' ? 'bg-green-600 text-white' : 'bg-[#0f1419] text-gray-400 hover:text-white'
              }`}
            >
              Converted
            </button>
            <button className="px-4 py-2 bg-[#0f1419] hover:bg-[#1a1f2e] text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f1419] border border-gray-800 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInquiries.length === data?.data.length && data?.data.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading inquiries...
                      </div>
                    </td>
                  </tr>
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  filteredData?.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-[#1a1f2e] transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedInquiries.includes(inquiry.id)}
                          onChange={() => toggleSelectInquiry(inquiry.id)}
                          className="w-4 h-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{inquiry.clientName}</p>
                          <p className="text-gray-400 text-sm">{inquiry.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white text-sm">
                          {inquiry.companyName || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">
                        {inquiry.budgetRange || 'Not specified'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value as InquiryStatus)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                            statusColors[inquiry.status]
                          } focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="NEW">New</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="CONVERTED">Converted</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingInquiry(inquiry)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => downloadInquiryPDF(inquiry)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                Showing <span className="font-medium text-white">{((page - 1) * 10) + 1}</span> to{' '}
                <span className="font-medium text-white">{Math.min(page * 10, data.pagination.total)}</span> of{' '}
                <span className="font-medium text-white">{data.pagination.total}</span> inquiries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-[#1a1f2e] hover:bg-[#232936] text-gray-400 hover:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded transition-colors ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#1a1f2e] hover:bg-[#232936] text-gray-400 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                {data.pagination.pages > 5 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <button
                      onClick={() => setPage(data.pagination.pages)}
                      className="px-4 py-2 bg-[#1a1f2e] hover:bg-[#232936] text-gray-400 hover:text-white rounded transition-colors"
                    >
                      {data.pagination.pages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                  disabled={page === data.pagination.pages}
                  className="px-3 py-1 bg-[#1a1f2e] hover:bg-[#232936] text-gray-400 hover:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* View Details Modal */}
      {viewingInquiry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setViewingInquiry(null)}
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
                <h2 className="text-2xl font-bold text-white">Inquiry Details</h2>
                <p className="text-sm text-gray-400 mt-1">ID: {viewingInquiry.id}</p>
              </div>
              <button
                onClick={() => setViewingInquiry(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Information */}
              <div className="bg-[#1a1625] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Client Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-white font-medium">{viewingInquiry.clientName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white font-medium">{viewingInquiry.email}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-[#1a1625] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Service Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Company</label>
                    <p className="text-white font-medium">{viewingInquiry.companyName || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Phone Number</label>
                    <p className="text-white font-medium">{viewingInquiry.phoneNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Budget Range</label>
                    <p className="text-white font-medium">{viewingInquiry.budgetRange || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Timeline</label>
                    <p className="text-white font-medium">{viewingInquiry.timeline || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Project Details</label>
                    <p className="text-white whitespace-pre-wrap">{viewingInquiry.projectDetails}</p>
                  </div>
                </div>
              </div>

              {/* Status & Timeline */}
              <div className="bg-[#1a1625] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status & Timeline
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Current Status</label>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[viewingInquiry.status as keyof typeof statusColors]}`}>
                      {viewingInquiry.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Received</label>
                    <p className="text-white">{formatDate(viewingInquiry.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Last Updated</label>
                    <p className="text-white">{formatDate(viewingInquiry.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              {viewingInquiry.internalNotes && (
                <div className="bg-[#1a1625] border border-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Internal Notes
                  </h3>
                  <p className="text-white whitespace-pre-wrap">{viewingInquiry.internalNotes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => downloadInquiryPDF(viewingInquiry)}
                  className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    setViewingInquiry(null);
                    setReplyingToInquiry(viewingInquiry);
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
      {replyingToInquiry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setReplyingToInquiry(null)}
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
                <p className="text-sm text-gray-400 mt-1">To: {replyingToInquiry.email}</p>
                <p className="text-sm text-gray-400">Client: {replyingToInquiry.clientName}</p>
                <p className="text-sm text-gray-400">Company: {replyingToInquiry.companyName || '—'}</p>
              </div>
              <button
                onClick={() => setReplyingToInquiry(null)}
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
                  placeholder={`Hi ${replyingToInquiry.clientName},\n\nThank you for reaching out about your project.\n\nI'd be happy to discuss your requirements in detail. Based on what you've shared, I believe I can help you within your budget range of ${replyingToInquiry.budgetRange || 'your specified budget'}.\n\nWould you like to schedule a call to discuss the project timeline and next steps?\n\nBest regards`}
                  className="w-full h-64 px-4 py-3 bg-[#1a1625] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => sendReplyEmail(replyingToInquiry.id, replyMessage)}
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
                    setReplyingToInquiry(null);
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
export default function ServiceInquiriesPage() {
  return (
    <AdminAuthGuard>
      <ServiceInquiriesContent />
    </AdminAuthGuard>
  );
}
