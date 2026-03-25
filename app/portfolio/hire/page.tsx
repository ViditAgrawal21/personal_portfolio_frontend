'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAbout } from '@/hooks/usePortfolio';

export default function HirePage() {
  const { about } = useAbout();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'fullstack',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Map projectType dropdown values to backend-expected techStack arrays
  const projectTypeToTechStack: Record<string, string[]> = {
    'fullstack': ['React', 'Node.js', 'MongoDB'],
    'architecture': ['System Design', 'Microservices', 'Cloud Architecture'],
    'consulting': ['Technical Consulting', 'Code Review', 'Best Practices'],
    'devops': ['Docker', 'CI/CD', 'Kubernetes', 'Cloud'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Backend POST /api/hire/request expects: projectName, techStack[], email, message
      const payload = {
        projectName: formData.company
          ? `${formData.company} – ${formData.projectType}`
          : `${formData.projectType} project`,
        techStack: projectTypeToTechStack[formData.projectType] ?? [formData.projectType],
        email: formData.email,
        message: [
          `From: ${formData.name}`,
          formData.budget ? `Budget: ${formData.budget}` : '',
          '',
          formData.message,
        ].filter(Boolean).join('\n'),
      };

      const response = await fetch('/api/proxy/hire/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', projectType: 'fullstack', budget: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-[#0a0a0a] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-3">Request Interview</h1>
          <p className="text-gray-400 text-lg">
            Let's discuss your project and see how we can work together
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Form Card */}
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitStatus === 'success' && (
                <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 text-green-400 text-sm font-semibold">
                  ✓ Interview request submitted! I'll get back to you within 24-48 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 text-red-400 text-sm font-semibold">
                  Submission failed. Please try again or reach out directly.
                </div>
              )}

              {/* Name and Email */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    email <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Company name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Company name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="Company name"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  projectType <span className="text-pink-400">*</span>
                </label>
                <select
                  required
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-pink-500 transition-colors"
                >
                  <option value="fullstack">Full-Stack Development</option>
                  <option value="architecture">System Architecture</option>
                  <option value="consulting">Technical Consulting</option>
                  <option value="devops">DevOps & CI/CD</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  budget
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="$10,000 - $50,000"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  message <span className="text-pink-400">*</span>
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Request Interview</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-6">
            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 ${about?.isAvailable ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`} />
                <h3 className="text-lg font-semibold text-white">
                  {about?.isAvailable ? 'Available for Hire' : 'Currently Unavailable'}
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {about?.availabilityStatus || 'Contact for availability details.'}
                {about?.hourlyRate && <span className="block mt-1 text-purple-400">Rate: {about.hourlyRate}/hr</span>}
              </p>
            </motion.div>

            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⚡</span>
                <h3 className="text-lg font-semibold text-white">Quick Response</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                I typically respond to all hire requests within 24-48 hours during business days.
              </p>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-pink-400 mb-2">What types of projects do you accept?</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Full-stack development, system architecture, technical consulting, and DevOps/CI-CD implementations.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-pink-400 mb-2">Do you work with startups?</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Yes! I work with startups, enterprises, and everything in between. Each project is evaluated individually.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-pink-400 mb-2">What is your typical engagement model?</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  I offer both project-based contracts and ongoing retainer arrangements depending on your needs.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
