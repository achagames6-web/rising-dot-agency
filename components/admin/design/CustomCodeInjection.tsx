'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Code, FileCode, Globe, AlertTriangle } from 'lucide-react';

interface CodeSnippet {
  _id?: string;
  name: string;
  type: 'css' | 'js';
  code: string;
  location: 'head' | 'body-start' | 'body-end';
  pages: string[]; // empty = all pages, or specific paths
  enabled: boolean;
  createdAt?: string;
}

const defaultPages = [
  { value: '', label: 'All Pages' },
  { value: '/', label: 'Homepage' },
  { value: '/about', label: 'About' },
  { value: '/services', label: 'Services' },
  { value: '/services/chatbot', label: 'Chatbot Service' },
  { value: '/services/seo', label: 'SEO Service' },
  { value: '/services/shopify', label: 'Shopify Service' },
  { value: '/services/wordpress', label: 'WordPress Service' },
  { value: '/services/webdesign', label: 'Web Design Service' },
  { value: '/services/n8n', label: 'N8N Service' },
  { value: '/services/saas', label: 'SaaS Service' },
  { value: '/portfolio', label: 'Portfolio' },
  { value: '/blog', label: 'Blog' },
  { value: '/contact', label: 'Contact' },
];

export default function CustomCodeInjection() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CodeSnippet>({
    name: '',
    type: 'css',
    code: '',
    location: 'head',
    pages: [],
    enabled: true,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const res = await fetch('/api/admin/design/code');
      if (res.ok) {
        const data = await res.json();
        setSnippets(data);
      }
    } catch (error) {
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      setMessage({ type: 'error', text: 'Name and code are required' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/design/code/${editingId}` : '/api/admin/design/code';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `Code snippet ${editingId ? 'updated' : 'created'}!` });
        fetchSnippets();
        resetForm();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save code snippet' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this code snippet?')) return;

    try {
      const res = await fetch(`/api/admin/design/code/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Code snippet deleted!' });
        fetchSnippets();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggle = async (snippet: CodeSnippet) => {
    try {
      const res = await fetch(`/api/admin/design/code/${snippet._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...snippet, enabled: !snippet.enabled }),
      });
      if (res.ok) fetchSnippets();
    } catch (error) {
      console.error('Error toggling:', error);
    }
  };

  const startEdit = (snippet: CodeSnippet) => {
    setEditingId(snippet._id || null);
    setFormData(snippet);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: '',
      type: 'css',
      code: '',
      location: 'head',
      pages: [],
      enabled: true,
    });
  };

  const togglePage = (page: string) => {
    if (page === '') {
      setFormData(prev => ({ ...prev, pages: [] }));
    } else {
      setFormData(prev => ({
        ...prev,
        pages: prev.pages.includes(page)
          ? prev.pages.filter(p => p !== page)
          : [...prev.pages, page]
      }));
    }
  };

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

      {/* Warning */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-400 font-medium">Use with caution</p>
          <p className="text-amber-400/70 text-sm">Custom code can affect site performance and functionality. Test thoroughly before enabling on all pages.</p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80"
        >
          <Plus className="w-5 h-5" />
          Add Code Snippet
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">
              {editingId ? 'Edit Code Snippet' : 'Add New Code Snippet'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white">×</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Google Analytics, Custom Styles"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'css' | 'js' })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
                >
                  <option value="css">CSS</option>
                  <option value="js">JavaScript</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
                >
                  <option value="head">Head (recommended for CSS)</option>
                  <option value="body-start">Body Start</option>
                  <option value="body-end">Body End (recommended for JS)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">Code *</label>
            <textarea
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder={formData.type === 'css' 
                ? '/* Your CSS code here */\n.custom-class {\n  color: #fff;\n}'
                : '// Your JavaScript code here\nconsole.log("Hello!");'
              }
              rows={10}
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white font-mono text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Apply to Pages</label>
            <div className="flex flex-wrap gap-2">
              {defaultPages.map((page) => (
                <button
                  key={page.value}
                  onClick={() => togglePage(page.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    (page.value === '' && formData.pages.length === 0) || formData.pages.includes(page.value)
                      ? 'bg-[#37AFE1] text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1]"
              />
              <span className="text-slate-300">Enabled</span>
            </label>
            <div className="flex gap-3">
              <button onClick={resetForm} className="px-4 py-2 text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
              >
                <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snippets List */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
        {snippets.length === 0 ? (
          <div className="p-12 text-center">
            <Code className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Code Snippets</h3>
            <p className="text-slate-400">Add custom CSS or JavaScript to your pages</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {snippets.map((snippet) => (
              <div key={snippet._id} className={`p-4 hover:bg-slate-700/30 ${!snippet.enabled ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${snippet.type === 'css' ? 'bg-purple-500/20' : 'bg-amber-500/20'}`}>
                    {snippet.type === 'css' ? (
                      <FileCode className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Code className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium">{snippet.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${snippet.type === 'css' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {snippet.type.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                        {snippet.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-400">
                        {snippet.pages.length === 0 ? 'All pages' : snippet.pages.join(', ')}
                      </span>
                    </div>
                    <pre className="mt-2 p-2 bg-[#0F172A] rounded text-xs text-slate-400 font-mono overflow-x-auto max-h-20">
                      {snippet.code.substring(0, 200)}{snippet.code.length > 200 ? '...' : ''}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(snippet)}
                      className={`w-10 h-5 rounded-full transition-colors ${snippet.enabled ? 'bg-green-500' : 'bg-slate-600'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${snippet.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                    <button
                      onClick={() => startEdit(snippet)}
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(snippet._id!)}
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
