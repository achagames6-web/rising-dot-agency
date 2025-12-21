'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Eye, RefreshCw } from 'lucide-react';

interface PageMeta {
  _id?: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  updatedAt?: string;
}

const defaultPages = [
  { path: '/', label: 'Homepage' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/contact', label: 'Contact' },
  { path: '/blog', label: 'Blog' },
];

export default function MetaTagsEditor() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [formData, setFormData] = useState<PageMeta>({
    path: '/',
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonicalUrl: '',
    noIndex: false,
    noFollow: false,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchMetaTags();
  }, []);

  useEffect(() => {
    const page = pages.find(p => p.path === selectedPage);
    if (page) {
      setFormData(page);
    } else {
      setFormData({
        path: selectedPage,
        title: '',
        description: '',
        keywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCard: 'summary_large_image',
        canonicalUrl: '',
        noIndex: false,
        noFollow: false,
      });
    }
  }, [selectedPage, pages]);

  const fetchMetaTags = async () => {
    try {
      const res = await fetch('/api/admin/seo/meta');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching meta tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Meta tags saved successfully!' });
        fetchMetaTags();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save meta tags' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const characterCount = (text: string, max: number) => {
    const count = text.length;
    const color = count > max ? 'text-red-400' : count > max * 0.8 ? 'text-amber-400' : 'text-slate-400';
    return <span className={color}>{count}/{max}</span>;
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Selector */}
        <div className="lg:col-span-1">
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
            <h3 className="text-white font-semibold mb-4">Pages</h3>
            <div className="space-y-2">
              {defaultPages.map((page) => {
                const hasMeta = pages.some(p => p.path === page.path);
                return (
                  <button
                    key={page.path}
                    onClick={() => setSelectedPage(page.path)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedPage === page.path
                        ? 'bg-[#37AFE1]/20 text-[#37AFE1]'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{page.label}</span>
                    {hasMeta && <span className="w-2 h-2 bg-green-400 rounded-full" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">
                Edit Meta Tags: {defaultPages.find(p => p.path === selectedPage)?.label}
              </h3>
              <button
                onClick={() => setPreviewOpen(!previewOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-300">Page Title</label>
                  {characterCount(formData.title, 60)}
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Page title for search engines"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-slate-300">Meta Description</label>
                  {characterCount(formData.description, 160)}
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for search results"
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Keywords</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                />
              </div>

              {/* OG Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">OG Title (Social)</label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                  placeholder="Title for social media shares (defaults to page title)"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                />
              </div>

              {/* OG Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">OG Description (Social)</label>
                <textarea
                  value={formData.ogDescription}
                  onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                  placeholder="Description for social media shares"
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                />
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">OG Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.ogImage}
                    onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                    placeholder="https://example.com/image.jpg (1200x630 recommended)"
                    className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                  />
                </div>
              </div>

              {/* Twitter Card */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Twitter Card Type</label>
                <select
                  value={formData.twitterCard}
                  onChange={(e) => setFormData({ ...formData, twitterCard: e.target.value as 'summary' | 'summary_large_image' })}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                </select>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="https://example.com/page (leave empty for auto)"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                />
              </div>

              {/* Indexing Options */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.noIndex}
                    onChange={(e) => setFormData({ ...formData, noIndex: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1] focus:ring-[#37AFE1]"
                  />
                  <span className="text-sm text-slate-300">No Index</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.noFollow}
                    onChange={(e) => setFormData({ ...formData, noFollow: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1] focus:ring-[#37AFE1]"
                  />
                  <span className="text-sm text-slate-300">No Follow</span>
                </label>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Meta Tags
              </button>
            </div>
          </div>

          {/* Preview */}
          {previewOpen && (
            <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-white font-semibold mb-4">Search Result Preview</h3>
              <div className="bg-white rounded-lg p-4">
                <div className="text-[#1a0dab] text-xl hover:underline cursor-pointer">
                  {formData.title || 'Page Title'}
                </div>
                <div className="text-[#006621] text-sm mt-1">
                  {`${siteUrl}${formData.path}`}
                </div>
                <div className="text-[#545454] text-sm mt-1">
                  {formData.description || 'Meta description will appear here...'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
