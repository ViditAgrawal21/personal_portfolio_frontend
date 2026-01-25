'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useServices } from '@/hooks/usePortfolio';

const categories = [
  { id: 'all', name: 'All Extensions', icon: '🔌' },
  { id: 'infrastructure', name: 'Infrastructure', icon: '☁️' },
  { id: 'frontend', name: 'Frontend Ops', icon: '💻' },
  { id: 'design', name: 'Design Systems', icon: '🎨' },
  { id: 'security', name: 'Security Audits', icon: '🔒' },
];

const statusFilters = [
  { id: 'available', name: 'Available for Hire', color: 'text-green-400' },
  { id: 'maintenance', name: 'In Maintenance', color: 'text-orange-400' },
];

export default function ServicesPage() {
  const { services, loading, error } = useServices();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [installedServices, setInstalledServices] = useState<string[]>([]);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (loading) {
    return (
      <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-500 text-sm font-mono"
        >
          Loading services...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-red-400 text-sm font-mono">
          Error loading services: {error}
        </div>
      </div>
    );
  }

  const filteredServices = services.filter(service => {
    const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
    return categoryMatch;
  });

  const handleOpenInquiryForm = (service: any) => {
    setSelectedService(service);
    setShowInquiryForm(true);
    setSubmitStatus('idle');
  };

  const handleCloseForm = () => {
    setShowInquiryForm(false);
    setSelectedService(null);
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      budget: '',
      timeline: ''
    });
    setSubmitStatus('idle');
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API call to submit service inquiry
      const response = await fetch('/api/service-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceId: selectedService?.id,
          serviceName: selectedService?.name,
          serviceCategory: selectedService?.category,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setInstalledServices([...installedServices, selectedService!._id]);
        setTimeout(() => {
          handleCloseForm();
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-[#0a0a0a] overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">🛒</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Service Extensions</h1>
              <p className="text-gray-500 text-sm">Vetted Service Modules</p>
            </div>
          </div>
          <p className="text-gray-400">
            Browse and install production-grade service modules
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-300 border border-gray-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredServices.map((service, index) => {
            const getCategoryGradient = (category?: string) => {
              const gradients: Record<string, string> = {
                'infrastructure': 'from-purple-600/20 to-blue-600/20',
                'frontend': 'from-orange-600/20 to-red-600/20',
                'design': 'from-cyan-600/20 to-blue-600/20',
                'security': 'from-green-600/20 to-emerald-600/20',
                'backend': 'from-pink-600/20 to-purple-600/20',
              };
              return category && gradients[category] || 'from-gray-600/20 to-slate-600/20';
            };

            const getCategoryIcon = (category?: string) => {
              const icons: Record<string, string> = {
                'infrastructure': '☁️',
                'frontend': '💻',
                'design': '🎨',
                'security': '🔒',
                'backend': '⚙️',
              };
              return category && icons[category] || '🔌';
            };

            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className={`bg-gradient-to-br ${getCategoryGradient(service.category)} border border-gray-700 rounded-lg p-6`}
              >
                {/* Service Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{service.icon || getCategoryIcon(service.category)}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{service.name}</h3>
                      <span className="text-xs text-gray-500 font-mono">
                        {service.pricing?.type ? `${service.pricing.type} - ${service.pricing.amount}` : 'Custom Pricing'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Tags */}
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-purple-600/30 border border-purple-600/50 rounded text-xs text-purple-300 font-semibold"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* Deliverables count */}
                <div className="flex items-center gap-4 mb-4">
                  {service.deliverables && service.deliverables.length > 0 ? (
                    <span className="text-sm text-gray-400">
                      {service.deliverables.length} deliverables included
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Custom deliverables</span>
                  )}
                  {service.timeline && (
                    <span className="text-sm text-gray-500">
                      {service.timeline}
                    </span>
                  )}
                </div>

                {/* Install Button */}
                {installedServices.includes(service._id) ? (
                  <button
                    disabled
                    className="w-full py-2 bg-green-600/20 border border-green-600/50 rounded text-sm text-green-400 font-semibold cursor-not-allowed"
                  >
                    ✓ Inquiry Sent
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenInquiryForm(service)}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 border border-purple-500 rounded text-sm text-white font-semibold transition-colors"
                  >
                    Request Service
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Service Inquiry Modal */}
        <AnimatePresence>
          {showInquiryForm && selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseForm}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-[#1a1a1a] border border-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-[#1a1a1a] border-b border-gray-800 p-6 flex items-start justify-between z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedService.icon || '🔌'}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedService.name}</h2>
                      <p className="text-sm text-gray-400">Service Inquiry Form</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitInquiry} className="p-6 space-y-5">
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 flex items-center gap-3"
                    >
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-green-400 font-semibold">Inquiry Submitted Successfully!</p>
                        <p className="text-green-300 text-sm">We'll get back to you within 24 hours.</p>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 flex items-center gap-3"
                    >
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-red-400 font-semibold">Submission Failed</p>
                        <p className="text-red-300 text-sm">Please try again or contact us directly.</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Full Name <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Email <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Budget Range
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded text-white focus:border-purple-500 focus:outline-none transition-colors"
                      >
                        <option value="">Select budget</option>
                        <option value="<5k">Less than $5,000</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k+">$50,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded text-white focus:border-purple-500 focus:outline-none transition-colors"
                      >
                        <option value="">Select timeline</option>
                        <option value="urgent">Urgent (1-2 weeks)</option>
                        <option value="short">Short term (1 month)</option>
                        <option value="medium">Medium term (2-3 months)</option>
                        <option value="long">Long term (3+ months)</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Project Details <span className="text-pink-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                      placeholder="Describe your project requirements, goals, and any specific needs..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || submitStatus === 'success'}
                      className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded text-sm font-semibold transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : submitStatus === 'success' ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Submitted!
                        </>
                      ) : (
                        'Submit Inquiry'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
