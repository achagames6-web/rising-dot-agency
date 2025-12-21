'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Eye, AlertTriangle } from 'lucide-react';

export default function RobotsEditor() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const defaultRobots = `# robots.txt
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Crawl delay (optional)
# Crawl-delay: 10
`;

  useEffect(() => {
    fetchRobots();
  }, []);

  const fetchRobots = async () => {
    try {
      const res = await fetch('/api/admin/seo/robots');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || defaultRobots);
      } else {
        setContent(defaultRobots);
      }
    } catch (error) {
      console.error('Error fetching robots.txt:', error);
      setContent(defaultRobots);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo/robots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'robots.txt saved successfully!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save robots.txt' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Reset to default robots.txt?')) {
      setContent(defaultRobots);
    }
  };

  // Parse and validate robots.txt
  const validateRobots = () => {
    const lines = content.split('\n');
    const warnings: string[] = [];
    let hasUserAgent = false;
    let hasSitemap = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('User-agent:')) hasUserAgent = true;
      if (trimmed.startsWith('Sitemap:')) hasSitemap = true;
      
      // Check for common issues
      if (trimmed === 'Disallow: /') {
        warnings.push(`Line ${index + 1}: "Disallow: /" blocks all crawlers from your entire site`);
      }
    });

    if (!hasUserAgent) {
      warnings.push('Missing User-agent directive');
    }
    if (!hasSitemap) {
      warnings.push('Consider adding a Sitemap directive');
    }

    return warnings;
  };

  const warnings = validateRobots();

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Edit robots.txt</h3>
            <div className="flex gap-2">
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
              >
                <Eye className="w-4 h-4" />
                View Live
              </a>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
              >
                Reset Default
              </button>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 px-4 py-3 bg-[#0F172A] border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#37AFE1] resize-none"
            spellCheck={false}
          />

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Warnings</span>
              </div>
              <ul className="text-sm text-amber-300 space-y-1">
                {warnings.map((warning, i) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex justify-end">
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
              Save robots.txt
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-white font-semibold mb-4">Directive Reference</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <code className="text-[#37AFE1]">User-agent: *</code>
              <p className="text-slate-400 mt-1">Applies rules to all crawlers. Use specific names like Googlebot for targeted rules.</p>
            </div>

            <div>
              <code className="text-[#37AFE1]">Allow: /path/</code>
              <p className="text-slate-400 mt-1">Explicitly allow crawling of a path (useful to override Disallow).</p>
            </div>

            <div>
              <code className="text-[#37AFE1]">Disallow: /path/</code>
              <p className="text-slate-400 mt-1">Block crawlers from accessing this path.</p>
            </div>

            <div>
              <code className="text-[#37AFE1]">Sitemap: URL</code>
              <p className="text-slate-400 mt-1">Tell crawlers where to find your XML sitemap.</p>
            </div>

            <div>
              <code className="text-[#37AFE1]">Crawl-delay: 10</code>
              <p className="text-slate-400 mt-1">Request crawlers wait N seconds between requests (not all respect this).</p>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-white font-medium mb-2">Common Patterns</h4>
              <div className="space-y-2 text-slate-400">
                <p><code className="text-slate-300">Disallow: /admin/</code> - Block admin area</p>
                <p><code className="text-slate-300">Disallow: /api/</code> - Block API routes</p>
                <p><code className="text-slate-300">Disallow: /*?*</code> - Block query strings</p>
                <p><code className="text-slate-300">Disallow: /*.pdf$</code> - Block PDF files</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
