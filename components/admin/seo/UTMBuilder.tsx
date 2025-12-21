'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Plus, Trash2, Link2, ExternalLink } from 'lucide-react';

interface SavedUTM {
  _id?: string;
  name: string;
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  fullUrl: string;
  clicks: number;
  createdAt: string;
}

export default function UTMBuilder() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const [savedLinks, setSavedLinks] = useState<SavedUTM[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    url: siteUrl,
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });

  const commonSources = ['google', 'facebook', 'twitter', 'linkedin', 'instagram', 'email', 'newsletter'];
  const commonMediums = ['cpc', 'social', 'email', 'banner', 'affiliate', 'organic'];

  useEffect(() => {
    fetchSavedLinks();
  }, []);

  const fetchSavedLinks = async () => {
    try {
      const res = await fetch('/api/admin/seo/utm');
      if (res.ok) {
        const data = await res.json();
        setSavedLinks(data);
      }
    } catch (error) {
      console.error('Error fetching UTM links:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateUrl = () => {
    const params = new URLSearchParams();
    if (formData.source) params.append('utm_source', formData.source);
    if (formData.medium) params.append('utm_medium', formData.medium);
    if (formData.campaign) params.append('utm_campaign', formData.campaign);
    if (formData.term) params.append('utm_term', formData.term);
    if (formData.content) params.append('utm_content', formData.content);
    
    const queryString = params.toString();
    return queryString ? `${formData.url}?${queryString}` : formData.url;
  };

  const fullUrl = generateUrl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.source || !formData.medium || !formData.campaign) {
      setMessage({ type: 'error', text: 'Please fill in name, source, medium, and campaign' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const res = await fetch('/api/admin/seo/utm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fullUrl }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'UTM link saved!' });
        fetchSavedLinks();
        setFormData({
          name: '',
          url: siteUrl,
          source: '',
          medium: '',
          campaign: '',
          term: '',
          content: '',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this UTM link?')) return;
    
    try {
      const res = await fetch(`/api/admin/seo/utm/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSavedLinks();
      }
    } catch (error) {
      console.error('Error deleting:', error);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-white font-semibold mb-4">Build UTM Link</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Link Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Facebook Holiday Campaign"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Website URL *</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://yourdomain.com"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Campaign Source * (utm_source)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., google, facebook, newsletter"
                  className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
                />
                <select
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
                >
                  <option value="">Quick</option>
                  {commonSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Campaign Medium * (utm_medium)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.medium}
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  placeholder="e.g., cpc, social, email"
                  className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
                />
                <select
                  onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  className="px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
                >
                  <option value="">Quick</option>
                  {commonMediums.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Campaign Name * (utm_campaign)</label>
              <input
                type="text"
                value={formData.campaign}
                onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                placeholder="e.g., spring_sale, product_launch"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Campaign Term (utm_term)</label>
              <input
                type="text"
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                placeholder="e.g., running+shoes (for paid search)"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Campaign Content (utm_content)</label>
              <input
                type="text"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="e.g., logolink, textlink (for A/B testing)"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Generated URL */}
          <div className="mt-6 p-4 bg-[#0F172A] rounded-lg">
            <label className="block text-sm font-medium text-slate-300 mb-2">Generated URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fullUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80"
          >
            <Plus className="w-5 h-5" />
            Save UTM Link
          </button>
        </div>

        {/* Saved Links */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Saved UTM Links</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {savedLinks.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Link2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No saved UTM links yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {savedLinks.map((link) => (
                  <div key={link._id} className="p-4 hover:bg-slate-700/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium">{link.name}</p>
                        <p className="text-xs text-slate-400 mt-1 truncate font-mono">{link.fullUrl}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-[#37AFE1]/20 text-[#37AFE1] rounded text-xs">{link.source}</span>
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">{link.medium}</span>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">{link.campaign}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(link.fullUrl);
                            setMessage({ type: 'success', text: 'Copied!' });
                            setTimeout(() => setMessage(null), 2000);
                          }}
                          className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={link.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(link._id!)}
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
      </div>
    </div>
  );
}
