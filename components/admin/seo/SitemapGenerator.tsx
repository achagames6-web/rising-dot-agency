'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Download, Globe, Check, X, ExternalLink, Clock } from 'lucide-react';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  included: boolean;
}

interface SitemapConfig {
  autoGenerate: boolean;
  includeImages: boolean;
  excludePatterns: string[];
  customUrls: { url: string; priority: number; changefreq: string }[];
  lastGenerated: string | null;
}

export default function SitemapGenerator() {
  const [urls, setUrls] = useState<SitemapUrl[]>([]);
  const [config, setConfig] = useState<SitemapConfig>({
    autoGenerate: true,
    includeImages: true,
    excludePatterns: ['/admin/*', '/api/*'],
    customUrls: [],
    lastGenerated: null,
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newExclude, setNewExclude] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState({ url: '', priority: 0.5, changefreq: 'weekly' });

  useEffect(() => {
    fetchSitemapData();
  }, []);

  const fetchSitemapData = async () => {
    try {
      const res = await fetch('/api/admin/seo/sitemap');
      if (res.ok) {
        const data = await res.json();
        setUrls(data.urls || []);
        setConfig(data.config || config);
      }
    } catch (error) {
      console.error('Error fetching sitemap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSitemap = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/seo/sitemap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ type: 'success', text: `Sitemap generated with ${data.urlCount} URLs!` });
        fetchSitemapData();
      } else {
        throw new Error('Failed to generate');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate sitemap' });
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const saveConfig = async () => {
    try {
      const res = await fetch('/api/admin/seo/sitemap/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Configuration saved!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const addExcludePattern = () => {
    if (newExclude && !config.excludePatterns.includes(newExclude)) {
      setConfig({
        ...config,
        excludePatterns: [...config.excludePatterns, newExclude],
      });
      setNewExclude('');
    }
  };

  const removeExcludePattern = (pattern: string) => {
    setConfig({
      ...config,
      excludePatterns: config.excludePatterns.filter(p => p !== pattern),
    });
  };

  const addCustomUrl = () => {
    if (newCustomUrl.url) {
      setConfig({
        ...config,
        customUrls: [...config.customUrls, newCustomUrl],
      });
      setNewCustomUrl({ url: '', priority: 0.5, changefreq: 'weekly' });
    }
  };

  const removeCustomUrl = (url: string) => {
    setConfig({
      ...config,
      customUrls: config.customUrls.filter(u => u.url !== url),
    });
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

      {/* Status Card */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Sitemap Status</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {urls.length} URLs indexed
              </span>
              {config.lastGenerated && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last generated: {new Date(config.lastGenerated).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
            >
              <ExternalLink className="w-4 h-4" />
              View Sitemap
            </a>
            <button
              onClick={generateSitemap}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Generate Sitemap
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-white font-semibold mb-4">Configuration</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoGenerate}
                onChange={(e) => setConfig({ ...config, autoGenerate: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1]"
              />
              <div>
                <span className="text-white">Auto-generate on content changes</span>
                <p className="text-xs text-slate-400">Automatically update sitemap when pages are added/modified</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeImages}
                onChange={(e) => setConfig({ ...config, includeImages: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1]"
              />
              <div>
                <span className="text-white">Include image sitemap</span>
                <p className="text-xs text-slate-400">Add image URLs for Google Image search</p>
              </div>
            </label>

            <div className="pt-4 border-t border-slate-700">
              <label className="block text-sm font-medium text-slate-300 mb-2">Exclude Patterns</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newExclude}
                  onChange={(e) => setNewExclude(e.target.value)}
                  placeholder="/admin/*, /api/*"
                  className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white text-sm"
                />
                <button
                  onClick={addExcludePattern}
                  className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.excludePatterns.map((pattern) => (
                  <span
                    key={pattern}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm"
                  >
                    {pattern}
                    <button onClick={() => removeExcludePattern(pattern)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={saveConfig}
              className="w-full mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
            >
              Save Configuration
            </button>
          </div>
        </div>

        {/* Custom URLs */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-white font-semibold mb-4">Custom URLs</h3>
          <p className="text-sm text-slate-400 mb-4">Add external or special URLs to your sitemap</p>

          <div className="space-y-3 mb-4">
            <input
              type="text"
              value={newCustomUrl.url}
              onChange={(e) => setNewCustomUrl({ ...newCustomUrl, url: e.target.value })}
              placeholder="https://example.com/page"
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white text-sm"
            />
            <div className="flex gap-2">
              <select
                value={newCustomUrl.priority}
                onChange={(e) => setNewCustomUrl({ ...newCustomUrl, priority: parseFloat(e.target.value) })}
                className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white text-sm"
              >
                <option value={1.0}>Priority: 1.0 (Highest)</option>
                <option value={0.8}>Priority: 0.8</option>
                <option value={0.5}>Priority: 0.5 (Default)</option>
                <option value={0.3}>Priority: 0.3</option>
                <option value={0.1}>Priority: 0.1 (Lowest)</option>
              </select>
              <select
                value={newCustomUrl.changefreq}
                onChange={(e) => setNewCustomUrl({ ...newCustomUrl, changefreq: e.target.value })}
                className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white text-sm"
              >
                <option value="always">Always</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="never">Never</option>
              </select>
            </div>
            <button
              onClick={addCustomUrl}
              className="w-full px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80"
            >
              Add Custom URL
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {config.customUrls.map((item) => (
              <div
                key={item.url}
                className="flex items-center justify-between p-2 bg-[#0F172A] rounded-lg"
              >
                <div className="text-sm">
                  <div className="text-white truncate max-w-[200px]">{item.url}</div>
                  <div className="text-slate-400 text-xs">
                    Priority: {item.priority} | {item.changefreq}
                  </div>
                </div>
                <button
                  onClick={() => removeCustomUrl(item.url)}
                  className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* URL List */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-white font-semibold">Indexed URLs</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[#0F172A] sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">URL</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Priority</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Frequency</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Last Modified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {urls.map((url, index) => (
                <tr key={index} className="hover:bg-slate-700/30">
                  <td className="px-4 py-2 text-sm text-slate-300">{url.loc}</td>
                  <td className="px-4 py-2 text-sm text-slate-400">{url.priority}</td>
                  <td className="px-4 py-2 text-sm text-slate-400">{url.changefreq}</td>
                  <td className="px-4 py-2 text-sm text-slate-400">
                    {url.lastmod ? new Date(url.lastmod).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
