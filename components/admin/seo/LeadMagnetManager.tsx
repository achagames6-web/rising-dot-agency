'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Download, Eye, FileText, Link2 } from 'lucide-react';

interface LeadMagnet {
  _id?: string;
  title: string;
  description: string;
  type: 'ebook' | 'checklist' | 'template' | 'guide' | 'webinar' | 'other';
  fileUrl: string;
  thumbnailUrl?: string;
  landingPage?: string;
  downloads: number;
  conversions: number;
  enabled: boolean;
  createdAt?: string;
}

export default function LeadMagnetManager() {
  const [magnets, setMagnets] = useState<LeadMagnet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LeadMagnet>({
    title: '',
    description: '',
    type: 'ebook',
    fileUrl: '',
    thumbnailUrl: '',
    landingPage: '',
    downloads: 0,
    conversions: 0,
    enabled: true,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchMagnets();
  }, []);

  const fetchMagnets = async () => {
    try {
      const res = await fetch('/api/admin/seo/lead-magnets');
      if (res.ok) {
        const data = await res.json();
        setMagnets(data);
      }
    } catch (error) {
      console.error('Error fetching lead magnets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.fileUrl) {
      setMessage({ type: 'error', text: 'Title and file URL are required' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/seo/lead-magnets/${editingId}` : '/api/admin/seo/lead-magnets';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `Lead magnet ${editingId ? 'updated' : 'created'}!` });
        fetchMagnets();
        resetForm();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead magnet?')) return;

    try {
      const res = await fetch(`/api/admin/seo/lead-magnets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Lead magnet deleted!' });
        fetchMagnets();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggle = async (magnet: LeadMagnet) => {
    try {
      const res = await fetch(`/api/admin/seo/lead-magnets/${magnet._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...magnet, enabled: !magnet.enabled }),
      });
      if (res.ok) fetchMagnets();
    } catch (error) {
      console.error('Error toggling:', error);
    }
  };

  const startEdit = (magnet: LeadMagnet) => {
    setEditingId(magnet._id || null);
    setFormData(magnet);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      type: 'ebook',
      fileUrl: '',
      thumbnailUrl: '',
      landingPage: '',
      downloads: 0,
      conversions: 0,
      enabled: true,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ebook': return '📚';
      case 'checklist': return '✅';
      case 'template': return '📋';
      case 'guide': return '📖';
      case 'webinar': return '🎥';
      default: return '📄';
    }
  };

  const totalDownloads = magnets.reduce((acc, m) => acc + m.downloads, 0);
  const totalConversions = magnets.reduce((acc, m) => acc + m.conversions, 0);
  const avgConversionRate = totalDownloads > 0 ? ((totalConversions / totalDownloads) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-white">{magnets.length}</p>
          <p className="text-sm text-slate-400">Lead Magnets</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-[#37AFE1]">{totalDownloads.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Total Downloads</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-green-400">{totalConversions.toLocaleString()}</p>
          <p className="text-sm text-slate-400">Conversions</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-purple-400">{avgConversionRate}%</p>
          <p className="text-sm text-slate-400">Conversion Rate</p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80"
        >
          <Plus className="w-5 h-5" />
          Add Lead Magnet
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">
              {editingId ? 'Edit Lead Magnet' : 'Add New Lead Magnet'}
            </h3>
            <button onClick={resetForm} className="p-1 hover:bg-slate-700 rounded">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Ultimate SEO Checklist"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              >
                <option value="ebook">📚 eBook</option>
                <option value="checklist">✅ Checklist</option>
                <option value="template">📋 Template</option>
                <option value="guide">📖 Guide</option>
                <option value="webinar">🎥 Webinar</option>
                <option value="other">📄 Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what users will get..."
                rows={2}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">File URL *</label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://example.com/file.pdf"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Thumbnail URL</label>
              <input
                type="url"
                value={formData.thumbnailUrl || ''}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Landing Page URL</label>
              <input
                type="url"
                value={formData.landingPage || ''}
                onChange={(e) => setFormData({ ...formData, landingPage: e.target.value })}
                placeholder="https://example.com/download-ebook"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1]"
                />
                <span className="text-slate-300">Enabled</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
            <button onClick={resetForm} className="px-4 py-2 text-slate-400 hover:text-white">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {/* Lead Magnets List */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
        {magnets.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Lead Magnets</h3>
            <p className="text-slate-400">Create your first lead magnet to start capturing leads</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {magnets.map((magnet) => (
              <div key={magnet._id} className={`p-4 hover:bg-slate-700/30 ${!magnet.enabled ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getTypeIcon(magnet.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{magnet.title}</h4>
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs capitalize">
                        {magnet.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">{magnet.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-slate-400">
                        <Download className="w-4 h-4 inline mr-1" />
                        {magnet.downloads} downloads
                      </span>
                      <span className="text-green-400">
                        {magnet.conversions} conversions
                      </span>
                      {magnet.landingPage && (
                        <a href={magnet.landingPage} target="_blank" rel="noopener noreferrer" className="text-[#37AFE1] hover:underline">
                          <Link2 className="w-4 h-4 inline mr-1" />
                          Landing Page
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(magnet)}
                      className={`w-10 h-5 rounded-full transition-colors ${magnet.enabled ? 'bg-green-500' : 'bg-slate-600'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${magnet.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                    <button
                      onClick={() => startEdit(magnet)}
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(magnet._id!)}
                      className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
