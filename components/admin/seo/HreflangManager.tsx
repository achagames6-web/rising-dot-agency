'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Globe, Languages } from 'lucide-react';

interface HreflangEntry {
  _id?: string;
  page: string;
  languages: {
    lang: string;
    region?: string;
    url: string;
  }[];
  xDefault?: string;
}

const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

const regionOptions = [
  { code: '', name: 'All Regions' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'MX', name: 'Mexico' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
];

export default function HreflangManager() {
  const [entries, setEntries] = useState<HreflangEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [currentEntry, setCurrentEntry] = useState<HreflangEntry>({
    page: '/',
    languages: [],
    xDefault: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pages = ['/', '/about', '/services', '/portfolio', '/contact', '/blog'];

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    const entry = entries.find(e => e.page === selectedPage);
    if (entry) {
      setCurrentEntry(entry);
    } else {
      setCurrentEntry({ page: selectedPage, languages: [], xDefault: '' });
    }
  }, [selectedPage, entries]);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/admin/seo/hreflang');
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching hreflang:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLanguage = () => {
    setCurrentEntry({
      ...currentEntry,
      languages: [...currentEntry.languages, { lang: 'en', region: '', url: '' }],
    });
  };

  const removeLanguage = (index: number) => {
    setCurrentEntry({
      ...currentEntry,
      languages: currentEntry.languages.filter((_, i) => i !== index),
    });
  };

  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...currentEntry.languages];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentEntry({ ...currentEntry, languages: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo/hreflang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEntry),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Hreflang tags saved!' });
        fetchEntries();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const generateCode = () => {
    if (currentEntry.languages.length === 0) return '';
    
    let code = '<!-- Hreflang Tags -->\n';
    currentEntry.languages.forEach(lang => {
      const hreflang = lang.region ? `${lang.lang}-${lang.region}` : lang.lang;
      code += `<link rel="alternate" hreflang="${hreflang}" href="${lang.url}" />\n`;
    });
    if (currentEntry.xDefault) {
      code += `<link rel="alternate" hreflang="x-default" href="${currentEntry.xDefault}" />\n`;
    }
    return code;
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

      {/* Info */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
        <div className="flex items-start gap-3">
          <Languages className="w-5 h-5 text-[#37AFE1] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-medium">What are Hreflang Tags?</h3>
            <p className="text-sm text-slate-400 mt-1">
              Hreflang tags tell search engines which language and regional versions of a page exist. 
              This helps serve the right content to users based on their language and location.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page Selector */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-white font-semibold mb-4">Select Page</h3>
          <div className="space-y-2">
            {pages.map((page) => {
              const hasEntry = entries.some(e => e.page === page && e.languages.length > 0);
              return (
                <button
                  key={page}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    selectedPage === page
                      ? 'bg-[#37AFE1]/20 text-[#37AFE1]'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{page === '/' ? 'Homepage' : page}</span>
                  {hasEntry && <Globe className="w-4 h-4 text-green-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Language Versions</h3>
              <button
                onClick={addLanguage}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80"
              >
                <Plus className="w-4 h-4" />
                Add Language
              </button>
            </div>

            {currentEntry.languages.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No language versions configured for this page</p>
            ) : (
              <div className="space-y-4">
                {currentEntry.languages.map((lang, index) => (
                  <div key={index} className="p-4 bg-[#0F172A] rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Language</label>
                        <select
                          value={lang.lang}
                          onChange={(e) => updateLanguage(index, 'lang', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                        >
                          {languageOptions.map(opt => (
                            <option key={opt.code} value={opt.code}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Region (Optional)</label>
                        <select
                          value={lang.region || ''}
                          onChange={(e) => updateLanguage(index, 'region', e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                        >
                          {regionOptions.map(opt => (
                            <option key={opt.code} value={opt.code}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2 flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-slate-400 mb-1">URL</label>
                          <input
                            type="url"
                            value={lang.url}
                            onChange={(e) => updateLanguage(index, 'url', e.target.value)}
                            placeholder="https://example.com/es/page"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                          />
                        </div>
                        <button
                          onClick={() => removeLanguage(index)}
                          className="self-end p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* x-default */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                x-default URL (fallback for unmatched languages)
              </label>
              <input
                type="url"
                value={currentEntry.xDefault || ''}
                onChange={(e) => setCurrentEntry({ ...currentEntry, xDefault: e.target.value })}
                placeholder="https://example.com/page"
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 flex items-center gap-2 px-6 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Hreflang Tags
            </button>
          </div>

          {/* Generated Code */}
          {currentEntry.languages.length > 0 && (
            <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-white font-semibold mb-4">Generated Code</h3>
              <pre className="p-4 bg-[#0F172A] rounded-lg overflow-x-auto">
                <code className="text-sm text-slate-300">{generateCode()}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
