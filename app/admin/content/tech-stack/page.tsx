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

function TechStackManagementContent() {
  const { clearAllCaches } = useCacheBuster();
  const { isAuthenticated, token, checkAuth } = useAdminStore();
  const [techStack, setTechStack] = useState<TechStackWithOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTech, setEditingTech] = useState<TechStackWithOrder | null>(null);
  const [draggedItem, setDraggedItem] = useState<TechStackWithOrder | null>(null);

  useEffect(() => {
    // Verify authentication before making API calls
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
      
      console.log('ðŸ”„ Fetching tech stack data...');
      const response = await techStackAPI.getAll();
      console.log('âœ… Tech stack data fetched:', response);
      
      // Sort by displayOrder if available, otherwise by creation order
      const sortedTechStack = (response.data || [])
        .map((tech: TechStack, index: number) => ({
          ...tech,
          displayOrder: tech.displayOrder ?? index
        }))
        .sort((a: TechStackWithOrder, b: TechStackWithOrder) => a.displayOrder - b.displayOrder);
      
      setTechStack(sortedTechStack);
    } catch (error) {
      console.error('âŒ Failed to fetch tech stack:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tech stack data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    // Verify authentication before allowing creation
    if (!checkAuth() || !token) {
      setError('Authentication expired. Please log in again.');
      return;
    }
    
    setEditingTech(null);
    setShowModal(true);
  };

  const handleEdit = (tech: TechStackWithOrder) => {
    // Verify authentication before allowing edit
    if (!checkAuth() || !token) {
      setError('Authentication expired. Please log in again.');
      return;
    }
    
    setEditingTech(tech);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    // Verify authentication before allowing delete
    if (!checkAuth() || !token) {
      setError('Authentication expired. Please log in again.');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this technology?')) return;
    
    try {
      setError(null);
      
      console.log('ðŸ—‘ï¸ Deleting technology...', id);
      await techStackAPI.delete(id);
      await clearAllCaches(); // Clear cache so changes reflect immediately
      
      console.log('âœ… Technology deleted successfully');
      await fetchTechStack();
    } catch (error) {
      console.error('âŒ Failed to delete technology:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete technology';
      setError(errorMessage);
      alert(`Failed to delete technology: ${errorMessage}`);
    }
  };

  const handleSave = async (data: any) => {
    // Verify authentication before saving
    if (!checkAuth() || !token) {
      setError('Authentication expired. Please log in again.');
      return;
    }
    
    try {
      setError(null);
      
      console.log('ðŸ’¾ Saving technology...', data);
      
      if (editingTech) {
        await techStackAPI.update(editingTech.id, data);
      } else {
        await techStackAPI.create(data);
      }
      await clearAllCaches(); // Clear cache so changes reflect immediately
      
      console.log('âœ… Technology saved successfully');
      await fetchTechStack();
      setShowModal(false);
    } catch (error) {
      console.error('âŒ Failed to save technology:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save technology';
      setError(errorMessage);
      alert(`Failed to save technology: ${errorMessage}`);
    }
  };

  const handleReorder = (newOrder: TechStackWithOrder[]) => {
    setTechStack(newOrder);
  };

  const saveOrder = async () => {
    // Verify authentication before saving order
    if (!checkAuth() || !token) {
      setError('Authentication expired. Please log in again.');
      return;
    }
    
    try {
      setError(null);
      
      console.log('ðŸ’¾ Saving tech stack order...');
      
      // Update the displayOrder for each tech item
      const updatePromises = techStack.map((tech, index) => 
        techStackAPI.update(tech.id, { ...tech, displayOrder: index })
      );
      
      await Promise.all(updatePromises);
      await clearAllCaches(); // Clear cache so changes reflect immediately
      
      console.log('âœ… Tech stack order saved successfully');
      alert('Order saved successfully!');
      await fetchTechStack();
    } catch (error) {
      console.error('âŒ Failed to save tech stack order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save order';
      setError(errorMessage);
      alert(`Failed to save order: ${errorMessage}`);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      'Frontend': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
      'Backend': 'bg-green-600/20 text-green-400 border-green-600/30',
      'Database': 'bg-purple-600/20 text-purple-400 border-purple-600/30',
      'DevOps': 'bg-orange-600/20 text-orange-400 border-orange-600/30',
      'Tools': 'bg-pink-600/20 text-pink-400 border-pink-600/30',
    };
    return colors[category] || 'bg-gray-600/20 text-gray-400 border-gray-600/30';
  };

  // Handle native HTML5 drag and drop as fallback
  const handleDragStart = (e: React.DragEvent, tech: TechStackWithOrder) => {
    setDraggedItem(tech);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTech: TechStackWithOrder) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetTech.id) return;

    const newTechStack = [...techStack];
    const draggedIndex = newTechStack.findIndex(tech => tech.id === draggedItem.id);
    const targetIndex = newTechStack.findIndex(tech => tech.id === targetTech.id);

    // Remove dragged item and insert at target position
    const [removed] = newTechStack.splice(draggedIndex, 1);
    newTechStack.splice(targetIndex, 0, removed);

    setTechStack(newTechStack);
    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tech stack...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <AdminHeader 
          title="Tech Stack Management" 
          description="Manage the order and visibility of your tech stack"
        />
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6 text-center">
              <div className="text-red-400 text-lg mb-4">âŒ Error</div>
              <p className="text-red-300 mb-4">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={fetchTechStack}
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
        title="Tech Stack Management" 
        description="Manage your technologies and skills. First 3 items appear on about dashboard."
        actions={
          <div className="flex gap-3">
            <button
              onClick={saveOrder}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              ðŸ’¾ Save Order
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

      <div className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Top 3 Preview */}
            <div className="mb-8 p-6 bg-[#1a1a1a] rounded-lg border-l-4 border-purple-600">
              <h3 className="text-lg font-semibold text-white mb-4">
                ðŸŽ¯ About Dashboard Preview (Top 3)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {techStack.slice(0, 3).map((tech, index) => (
                  <div key={tech.id} className="bg-[#2a2a2a] p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl mb-2">{tech.icon}</div>
                      <h4 className="text-white font-medium">{tech.name}</h4>
                      <div className={`inline-block px-2 py-1 rounded text-xs mt-2 ${getCategoryColor(tech.category)}`}>
                        #{index + 1} â€¢ {tech.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {techStack.length < 3 && (
                <p className="text-gray-400 mt-4 text-sm">
                  Add more technologies to fill all 3 spots on the about dashboard
                </p>
              )}
            </div>

            {/* Drag Instructions */}
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-blue-400 mt-1">â„¹ï¸</div>
                <div>
                  <h4 className="text-blue-300 font-medium mb-1">Drag & Drop Instructions</h4>
                  <p className="text-blue-200 text-sm">
                    Drag technologies to reorder them. The first three will appear on your about dashboard. 
                    Click "Save Order" when finished.
                  </p>
                </div>
              </div>
            </div>

            {/* Draggable Tech Stack List */}
            <Reorder.Group 
              axis="y" 
              values={techStack} 
              onReorder={handleReorder}
              className="space-y-4"
            >
              <AnimatePresence>
                {techStack.map((tech, index) => (
                  <Reorder.Item 
                    key={tech.id} 
                    value={tech}
                    className={`bg-[#1a1a1a] rounded-lg p-6 cursor-move hover:bg-[#2a2a2a] transition-colors border-l-4 ${
                      index < 3 ? 'border-purple-600' : 'border-gray-600'
                    }`}
                    drag
                    dragMomentum={false}
                    whileDrag={{ scale: 1.02, zIndex: 10 }}
                    layout
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Drag Handle */}
                        <div className="text-gray-500 cursor-grab active:cursor-grabbing">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>

                        {/* Position indicator */}
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          index < 3 ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {index + 1}
                        </div>

                        {/* Tech Info */}
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{tech.icon}</span>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{tech.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(tech.category)}`}>
                                {tech.category}
                              </span>
                              <span className="text-gray-400 text-sm">
                                {tech.proficiency}% proficient
                              </span>
                              {index < 3 && (
                                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs">
                                  Dashboard
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(tech)}
                          className="px-3 py-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tech.id)}
                          className="px-3 py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all" 
                          style={{ width: `${tech.proficiency}%` }}
                        />
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {techStack.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No technologies added yet</p>
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  Add Your First Technology
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        <TechModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editingTech={editingTech}
        />
      </div>
    </div>
  );
}

// Tech Stack Modal Component
function TechModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingTech 
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
    icon: 'âš¡',
    description: '',
  });

  useEffect(() => {
    if (editingTech) {
      setFormData({
        name: editingTech.name || '',
        category: editingTech.category || 'Frontend',
        proficiency: editingTech.proficiency || 50,
        icon: editingTech.icon || 'âš¡',
        description: editingTech.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Frontend',
        proficiency: 50,
        icon: 'âš¡',
        description: '',
      });
    }
  }, [editingTech, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full"
      >
        <h2 className="text-xl font-semibold text-white mb-6">
          {editingTech ? 'Edit Technology' : 'Add Technology'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
              <option value="Tools">Tools</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon/Emoji
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proficiency ({formData.proficiency}%)
            </label>
            <input
              type="range"
              name="proficiency"
              value={formData.proficiency}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Main component with authentication guard
export default function TechStackManagementPage() {
  return (
    <AdminAuthGuard>
      <TechStackManagementContent />
    </AdminAuthGuard>
  );
}
