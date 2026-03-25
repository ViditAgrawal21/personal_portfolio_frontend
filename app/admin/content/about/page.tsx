'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { aboutAPI } from '@/lib/adminApi';
import { motion } from 'framer-motion';

export default function AboutManagementPage() {
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    availableForHire: false,
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await aboutAPI.get();
      setAbout(response.data);
      if (response.data) {
        setFormData({
          fullName: response.data.fullName || '',
          title: response.data.title || '',
          bio: response.data.bio || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          githubUrl: response.data.githubUrl || '',
          linkedinUrl: response.data.linkedinUrl || '',
          twitterUrl: response.data.twitterUrl || '',
          availableForHire: response.data.availableForHire ?? false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch about:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await aboutAPI.update(formData);
      alert('About section updated successfully!');
      await fetchAbout();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="About Section" 
        description="Manage your personal information"
      />

      <div className="p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSave} className="bg-[#1a1625] border border-gray-800 rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Title/Role</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
              rows={6}
              className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Twitter URL</label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[#0f1419] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center gap-4">
              <label className="text-gray-300 text-sm font-medium">Available for Hire</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, availableForHire: !formData.availableForHire })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formData.availableForHire ? 'bg-green-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.availableForHire ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${
                formData.availableForHire ? 'text-green-400' : 'text-gray-500'
              }`}>
                {formData.availableForHire ? 'Open to opportunities' : 'Not available'}
              </span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
