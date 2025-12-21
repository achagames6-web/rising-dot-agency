'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Link2, AlertTriangle, ExternalLink, ArrowRight } from 'lucide-react';

interface LinkData {
  page: string;
  title: string;
  internalLinks: { url: string; text: string }[];
  externalLinks: { url: string; text: string }[];
  incomingLinks: number;
  outgoingLinks: number;
}

interface OrphanPage {
  url: string;
  title: string;
}

export default function InternalLinkAnalyzer() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [orphanPages, setOrphanPages] = useState<OrphanPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchLinkData();
  }, []);

  const fetchLinkData = async () => {
    try {
      const res = await fetch('/api/admin/seo/links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
        setOrphanPages(data.orphanPages || []);
      }
    } catch (error) {
      console.error('Error fetching link data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeLinks = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/admin/seo/links/analyze', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
        setOrphanPages(data.orphanPages || []);
        setMessage({ type: 'success', text: `Analyzed ${data.links?.length || 0} pages!` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to analyze links' });
    } finally {
      setAnalyzing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const totalInternalLinks = links.reduce((acc, l) => acc + l.internalLinks.length, 0);
  const totalExternalLinks = links.reduce((acc, l) => acc + l.externalLinks.length, 0);
  const avgLinksPerPage = links.length > 0 ? (totalInternalLinks / links.length).toFixed(1) : '0';

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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-white">{links.length}</p>
          <p className="text-sm text-slate-400">Pages Analyzed</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-[#37AFE1]">{totalInternalLinks}</p>
          <p className="text-sm text-slate-400">Internal Links</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-purple-400">{totalExternalLinks}</p>
          <p className="text-sm text-slate-400">External Links</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-white">{avgLinksPerPage}</p>
          <p className="text-sm text-slate-400">Avg Links/Page</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-amber-400">{orphanPages.length}</p>
          <p className="text-sm text-slate-400">Orphan Pages</p>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-end">
        <button
          onClick={analyzeLinks}
          disabled={analyzing}
          className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Analyzing...' : 'Analyze Site Links'}
        </button>
      </div>

      {/* Orphan Pages Warning */}
      {orphanPages.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Orphan Pages Found</h3>
          </div>
          <p className="text-sm text-amber-300 mb-3">These pages have no internal links pointing to them:</p>
          <div className="flex flex-wrap gap-2">
            {orphanPages.map((page) => (
              <span key={page.url} className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-sm">
                {page.url}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Link Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pages List */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Page Link Structure</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {links.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Click "Analyze Site Links" to scan your pages
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {links.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => setSelectedPage(selectedPage === link.page ? null : link.page)}
                    className={`w-full p-4 text-left hover:bg-slate-700/30 transition-colors ${selectedPage === link.page ? 'bg-slate-700/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{link.page}</p>
                        <p className="text-xs text-slate-400 mt-1">{link.title}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-[#37AFE1]">
                          <Link2 className="w-4 h-4" />
                          {link.internalLinks.length}
                        </span>
                        <span className="flex items-center gap-1 text-purple-400">
                          <ExternalLink className="w-4 h-4" />
                          {link.externalLinks.length}
                        </span>
                        <span className="flex items-center gap-1 text-green-400">
                          <ArrowRight className="w-4 h-4" />
                          {link.incomingLinks}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Link Details */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">
              {selectedPage ? `Links on ${selectedPage}` : 'Select a page to view links'}
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto p-4">
            {selectedPage ? (
              <>
                {(() => {
                  const pageData = links.find(l => l.page === selectedPage);
                  if (!pageData) return null;
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-[#37AFE1] mb-2">Internal Links ({pageData.internalLinks.length})</h4>
                        {pageData.internalLinks.length === 0 ? (
                          <p className="text-sm text-slate-400">No internal links</p>
                        ) : (
                          <div className="space-y-2">
                            {pageData.internalLinks.map((link, i) => (
                              <div key={i} className="p-2 bg-[#0F172A] rounded-lg">
                                <p className="text-sm text-white">{link.text || '(no anchor text)'}</p>
                                <p className="text-xs text-slate-400">{link.url}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-purple-400 mb-2">External Links ({pageData.externalLinks.length})</h4>
                        {pageData.externalLinks.length === 0 ? (
                          <p className="text-sm text-slate-400">No external links</p>
                        ) : (
                          <div className="space-y-2">
                            {pageData.externalLinks.map((link, i) => (
                              <div key={i} className="p-2 bg-[#0F172A] rounded-lg">
                                <p className="text-sm text-white">{link.text || '(no anchor text)'}</p>
                                <p className="text-xs text-slate-400 truncate">{link.url}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <Link2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a page from the list to view its links</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
