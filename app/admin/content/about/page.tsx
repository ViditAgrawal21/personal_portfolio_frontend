'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { aboutAPI } from '@/lib/adminApi';
import { motion } from 'framer-motion';
import { useCacheBuster } from '@/hooks/useCacheBuster';
import { useAdminStore } from '@/store/admin-store';

function AboutManagementContent() {
  const { clearAllCaches } = useCacheBuster();
  const { isAuthenticated, token, checkAuth } = useAdminStore();
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    profileImageUrl: '',
    yearsOfExp: 0,
    availabilityStatus: '',
    hourlyRate: '',
    isAvailable: false,
  });

  useEffect(() => {
    // Verify authentication before making API calls
    if (checkAuth() && token) {
      fetchAbout();
    } else {
      setError('Authentication required');
      setLoading(false);
    }
  }, [checkAuth, token]);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching about data...');
      const response = await aboutAPI.get();
      console.log('✅ About data fetched:', response);
      
      setAbout(response.data);
      if (response.data) {
        setFormData({
          fullName: response.data.fullName || '',
          title: response.data.title || '',
          bio: response.data.bio || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          resumeUrl: response.data.resumeUrl || '',
          githubUrl: response.data.githubUrl || '',
          linkedinUrl: response.data.linkedinUrl || '',
          twitterUrl: response.data.twitterUrl || '',
          profileImageUrl: response.data.profileImageUrl || '',
          yearsOfExp: response.data.yearsOfExp || 0,
          availabilityStatus: response.data.availabilityStatus || '',
          hourlyRate: response.data.hourlyRate || '',
          isAvailable: response.data.isAvailable ?? false,
        });
      }
    } catch (error) {
      console.error('❌ Failed to fetch about:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch about data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify authentication before saving
    if (!checkAuth() || !token) {
      setError('Authentication expired. Please log in again.');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      console.log('💾 Saving about data...', formData);
      await aboutAPI.update(formData);
      
      // Clear cache so changes appear immediately on public site
      await clearAllCaches();
      
      console.log('✅ About data saved successfully');
      alert('About section updated successfully!');
      await fetchAbout();
    } catch (error) {
      console.error('❌ Failed to save about data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes';
      setError(errorMessage);
      alert(`Failed to save changes: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? parseInt(value) || 0 
              : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading about data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <AdminHeader 
          title="About Management" 
          description="Manage your personal profile information"
        />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6 text-center">
              <div className="text-red-400 text-lg mb-4">❌ Error</div>
              <p className="text-red-300 mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={fetchAbout}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => window.location.href = '/admin/login'}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Login Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminHeader 
        title="About Management" 
        description="Manage your personal profile information"
      />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Basic Information Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111] border border-purple-600/20 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                👤 Basic Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Bio / Description
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                    placeholder="Tell a bit about yourself and your expertise..."
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    name="profileImageUrl"
                    value={formData.profileImageUrl}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
              </div>
            </motion.section>

            {/* Contact Information */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111] border border-purple-600/20 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                📧 Contact Information  
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </motion.section>

            {/* Professional Links */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#111] border border-purple-600/20 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                🔗 Professional Links
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Twitter/X URL
                  </label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="https://example.com/your-resume.pdf"
                  />
                </div>
              </div>
            </motion.section>

            {/* Availability & Pricing */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#111] border border-purple-600/20 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                💼 Availability & Pricing
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExp"
                    value={formData.yearsOfExp}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Hourly Rate
                  </label>
                  <input
                    type="text"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="$50/hour"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Availability Status
                  </label>
                  <select
                    name="availabilityStatus"
                    value={formData.availabilityStatus}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select availability</option>
                    <option value="Available for hire">Available for hire</option>
                    <option value="Available for freelance">Available for freelance</option>
                    <option value="Open to opportunities">Open to opportunities</option>
                    <option value="Busy">Busy</option>
                    <option value="Not available">Not available</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600 bg-[#1a1a1a] border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">Currently Available</span>
                  </label>
                </div>
              </div>
            </motion.section>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end pt-6"
            >
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    💾 Save Changes
                  </>
                )}
              </button>
            </motion.div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

// Main component with authentication guard
export default function AboutManagementPage() {
  return (
    <AdminAuthGuard>
      <AboutManagementContent />
    </AdminAuthGuard>
  );
}
