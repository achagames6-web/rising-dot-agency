'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Testimonial {
  _id: string;
  name: string;
  email?: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
  results: string[];
  featured: boolean;
  published: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  order: number;
  submittedAt?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    avatar: '',
    text: '',
    rating: 5,
    results: '',
    featured: false,
    published: true,
    order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem 
        ? `/api/admin/testimonials/${editingItem._id}` 
        : '/api/admin/testimonials';
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          results: formData.results.split(',').map(r => r.trim()).filter(Boolean),
        }),
      });
      
      if (res.ok) {
        fetchTestimonials();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const togglePublish = async (item: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const toggleFeatured = async (item: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !item.featured }),
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const approveTestimonial = async (item: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', published: true }),
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error approving testimonial:', error);
    }
  };

  const rejectTestimonial = async (item: Testimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', published: false }),
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
    }
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      company: item.company,
      avatar: item.avatar,
      text: item.text,
      rating: item.rating,
      results: item.results?.join(', ') || '',
      featured: item.featured,
      published: item.published,
      order: item.order,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: '',
      company: '',
      avatar: '',
      text: '',
      rating: 5,
      results: '',
      featured: false,
      published: true,
      order: testimonials.length,
    });
  };

  const pendingCount = testimonials.filter(t => t.status === 'pending').length;
  const filteredTestimonials = activeTab === 'pending' 
    ? testimonials.filter(t => t.status === 'pending')
    : testimonials.filter(t => t.status !== 'pending');

  return (
    <div className="min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Testimonials</h1>
          <p className="text-slate-400 mt-1">Manage client testimonials</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-[#37AFE1] text-white'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-[#F58122] text-white'
              : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending Review
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{pendingCount}</span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-[#1E293B] rounded-xl border border-slate-700/50">
          <p className="text-slate-400">
            {activeTab === 'pending' 
              ? 'No pending testimonials to review.' 
              : 'No testimonials yet. Add your first testimonial!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTestimonials.map((item) => (
            <div
              key={item._id}
              className={`bg-[#1E293B] rounded-xl p-4 flex items-start gap-4 border ${
                item.status === 'pending' 
                  ? 'border-[#F58122]/50' 
                  : 'border-slate-700/50'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
                {item.avatar && (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">{item.name}</h3>
                  {item.featured && (
                    <Star className="w-4 h-4 text-[#F58122] fill-[#F58122]" />
                  )}
                  {item.status === 'pending' && (
                    <span className="px-2 py-0.5 bg-[#F58122]/20 text-[#F58122] text-xs rounded-full">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">
                  {item.role} {item.company && `at ${item.company}`}
                  {item.email && <span className="text-slate-500"> • {item.email}</span>}
                </p>
                <p className="text-slate-300 text-sm mt-2 line-clamp-2">{item.text}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {item.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => approveTestimonial(item)}
                      className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => rejectTestimonial(item)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleFeatured(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.featured 
                          ? 'bg-[#F58122]/20 text-[#F58122]' 
                          : 'bg-slate-700 text-slate-400 hover:text-[#F58122]'
                      }`}
                      title={item.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => togglePublish(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.published 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {item.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </>
                )}
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-[#37AFE1] hover:text-white transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    placeholder="e.g., CEO, CTO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Avatar Image Path</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                  placeholder="/media/home/testimonials/name.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Testimonial Text</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Results (comma separated)</label>
                <input
                  type="text"
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                  placeholder="300% traffic increase, 45% conversion boost"
                />
              </div>
              
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 text-[#F58122] focus:ring-[#F58122]"
                  />
                  <span className="text-slate-300">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-slate-300">Published</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors"
                >
                  {editingItem ? 'Update' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
