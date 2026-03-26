'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { techStackAPI } from '@/lib/adminApi';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useCacheBuster } from '@/hooks/useCacheBuster';
import { useAdminStore } from '@/store/admin-store';
import type { TechStack } from '@/types/portfolio';

interface TechStackWithOrder extends TechStack {
  displayOrder: number;
}

// Renders an icon — shows <img> for URLs, emoji/text otherwise
function TechIcon({ icon, name, size = 32 }: { icon?: string; name: string; size?: number }) {
  if (!icon) return <span className="text-2xl">⚡</span>;
  if (icon.startsWith('http') || icon.startsWith('/')) {
    return (
      <img
        src={icon}
        alt={name}
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const fallback = document.createElement('span');
          fallback.textContent = '⚡';
          fallback.className = 'text-2xl';
          e.currentTarget.parentNode?.appendChild(fallback);
        }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.75 }}>{icon}</span>;
}

function TechStackManagementContent() {
  const { clearAllCaches } = useCacheBuster();
  const { token, checkAuth } = useAdminStore();
  const [techStack, setTechStack] = useState<TechStackWithOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTech, setEditingTech] = useState<TechStackWithOrder | null>(null);

  useEffect(() => {
    if (checkAuth() && token) {
      fetchTechStack();
    } else {
      setError('Authentication required');
      setLoading(false);
    }
  }, [checkAuth, token]);

  const fetchTechStack = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await techStackAPI.getAll();
      const sorted = (response.data || [])
        .map((tech: TechStack, index: number) => ({
          ...tech,
          displayOrder: tech.displayOrder ?? index,
        }))
        .sort((a: TechStackWithOrder, b: TechStackWithOrder) => a.displayOrder - b.displayOrder);
      setTechStack(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tech stack');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!checkAuth() || !token) { setError('Authentication expired.'); return; }
    setEditingTech(null);
    setShowModal(true);
  };

  const handleEdit = (tech: TechStackWithOrder) => {
    if (!checkAuth() || !token) { setError('Authentication expired.'); return; }
    setEditingTech(tech);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!checkAuth() || !token) { setError('Authentication expired.'); return; }
    if (!confirm('Delete this technology?')) return;
    try {
      await techStackAPI.delete(id);
      await clearAllCaches();
      await fetchTechStack();
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : err}`);
    }
  };

  const handleSave = async (data: any) => {
    if (!checkAuth() || !token) { setError('Authentication expired.'); return; }
    try {
      if (editingTech) {
        await techStackAPI.update(editingTech.id, data);
      } else {
        await techStackAPI.create(data);
      }
      await clearAllCaches();
      await fetchTechStack();
      setShowModal(false);
    } catch (err) {
      alert(`Failed to save: ${err instanceof Error ? err.message : err}`);
    }
  };

  const saveOrder = async () => {
    if (!checkAuth() || !token) { setError('Authentication expired.'); return; }
    try {
      await Promise.all(
        techStack.map((tech, index) =>
          techStackAPI.update(tech.id, { ...tech, displayOrder: index })
        )
      );
      await clearAllCaches();
      alert('Order saved!');
      await fetchTechStack();
    } catch (err) {
      alert(`Failed to save order: ${err instanceof Error ? err.message : err}`);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Frontend:  'bg-blue-600/20 text-blue-400 border-blue-600/30',
      Backend:   'bg-green-600/20 text-green-400 border-green-600/30',
      Database:  'bg-purple-600/20 text-purple-400 border-purple-600/30',
      DevOps:    'bg-orange-600/20 text-orange-400 border-orange-600/30',
      Tools:     'bg-pink-600/20 text-pink-400 border-pink-600/30',
    };
    return colors[category] || 'bg-gray-600/20 text-gray-400 border-gray-600/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading tech stack...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <AdminHeader title="Tech Stack Management" description="Manage your technologies" />
        <div className="p-8 max-w-xl mx-auto">
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6 text-center">
            <p className="text-red-300 mb-4">{error}</p>
            <button onClick={fetchTechStack} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AdminHeader
        title="Tech Stack Management"
        description="Manage your technologies and skills. First 3 items appear on about dashboard."
        actions={
          <div className="flex gap-3">
            <button
              onClick={saveOrder}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              💾 Save Order
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Technology
            </button>
          </div>
        }
      />

      <div className="p-8 max-w-7xl mx-auto">
        {/* Top 3 Preview */}
        <div className="mb-8 p-6 bg-[#111111] rounded-xl border border-gray-800 border-l-4 border-l-purple-600">
          <h3 className="text-base font-semibold text-white mb-4">🎯 About Dashboard Preview (Top 3)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {techStack.slice(0, 3).map((tech, index) => (
              <div key={tech.id} className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center w-14 h-14 bg-[#0f0f1a] rounded-xl mx-auto mb-3">
                  <TechIcon icon={tech.icon} name={tech.name} size={36} />
                </div>
                <p className="text-white font-semibold text-sm">{tech.name}</p>
                <p className="text-gray-500 text-xs mt-1">#{index + 1} • {tech.category}</p>
              </div>
            ))}
            {techStack.length < 3 &&
              Array.from({ length: 3 - techStack.length }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-[#1a1a2e]/40 border border-dashed border-gray-700 rounded-lg p-4 flex items-center justify-center">
                  <p className="text-gray-600 text-xs">Empty slot</p>
                </div>
              ))}
          </div>
        </div>

        {/* Drag Instructions */}
        <div className="mb-6 p-4 bg-blue-900/10 border border-blue-800/30 rounded-lg flex items-start gap-3">
          <span className="text-blue-400 text-lg mt-0.5">☰</span>
          <div>
            <p className="text-blue-300 font-medium text-sm">Drag &amp; Drop Instructions</p>
            <p className="text-blue-200/70 text-xs mt-0.5">
              Drag technologies to reorder them. The first three will appear on your about dashboard. Click "Save Order" when finished.
            </p>
          </div>
        </div>

        {/* Draggable Grid */}
        <Reorder.Group axis="y" values={techStack} onReorder={setTechStack} className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {techStack.map((tech, index) => (
              <Reorder.Item
                key={tech.id}
                value={tech}
                className={`bg-[#111111] border rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none ${
                  index < 3 ? 'border-purple-600/40' : 'border-gray-800'
                }`}
                whileDrag={{ scale: 1.01, boxShadow: '0 8px 32px rgba(139,92,246,0.25)', zIndex: 50 }}
                layout
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Drag handle + position */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-gray-600 pointer-events-none">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                      </svg>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      index < 3 ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon box */}
                  <div className="w-12 h-12 bg-[#1a1a2e] rounded-lg flex items-center justify-center shrink-0">
                    <TechIcon icon={tech.icon} name={tech.name} size={28} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-white font-semibold text-sm">{tech.name}</span>
                      {index < 3 && (
                        <span className="px-2 py-0.5 bg-purple-600/20 text-purple-300 rounded-full text-xs">Dashboard</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${getCategoryColor(tech.category)}`}>
                        {tech.category}
                      </span>
                      <span className="text-gray-400 text-xs">{tech.proficiency}% proficient</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden w-full max-w-xs">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all"
                        style={{ width: `${tech.proficiency}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(tech)}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tech.id)}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {techStack.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No technologies added yet.</p>
            <button onClick={handleCreate} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors">
              Add Your First Technology
            </button>
          </div>
        )}
      </div>

      <TechModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editingTech={editingTech}
      />
    </div>
  );
}

// ── Tech Modal ────────────────────────────────────────────────────────────────
function TechModal({
  isOpen,
  onClose,
  onSave,
  editingTech,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingTech: TechStackWithOrder | null;
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 50,
    icon: '',
    description: '',
  });

  useEffect(() => {
    if (editingTech) {
      setFormData({
        name: editingTech.name || '',
        category: editingTech.category || 'Frontend',
        proficiency: editingTech.proficiency || 50,
        icon: editingTech.icon || '',
        description: editingTech.description || '',
      });
    } else {
      setFormData({ name: '', category: 'Frontend', proficiency: 50, icon: '', description: '' });
    }
  }, [editingTech, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'range' ? parseInt(value) || 0 : value }));
  };

  const isUrl = formData.icon.startsWith('http') || formData.icon.startsWith('/');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#111111] border border-gray-800 rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            {editingTech ? 'Edit Technology' : 'Add Technology'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Name *</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category *</label>
            <select
              name="category" value={formData.category} onChange={handleChange}
              className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none text-sm"
            >
              {['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Icon URL or Emoji */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Icon URL or Emoji</label>
            <div className="flex items-center gap-3">
              <input
                type="text" name="icon" value={formData.icon} onChange={handleChange}
                placeholder="https://... or paste an emoji like ⚡"
                className="flex-1 p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none text-sm"
              />
              {formData.icon && (
                <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center shrink-0">
                  {isUrl ? (
                    <img src={formData.icon} alt="preview" width={28} height={28} className="object-contain" />
                  ) : (
                    <span className="text-xl">{formData.icon}</span>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-600 text-xs mt-1">Paste a CDN URL (e.g. simple-icons) or type an emoji</p>
          </div>

          {/* Proficiency */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-300">Proficiency</label>
              <span className="text-purple-400 text-sm font-medium">{formData.proficiency}%</span>
            </div>
            <input
              type="range" name="proficiency" value={formData.proficiency} onChange={handleChange}
              min="0" max="100"
              className="w-full accent-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea
              name="description" value={formData.description} onChange={handleChange} rows={2}
              className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors">
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function TechStackManagementPage() {
  return (
    <AdminAuthGuard>
      <TechStackManagementContent />
    </AdminAuthGuard>
  );
}