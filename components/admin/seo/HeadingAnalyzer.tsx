'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Type, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface HeadingData {
  page: string;
  title: string;
  headings: {
    tag: string;
    text: string;
    level: number;
  }[];
  issues: {
    type: 'error' | 'warning';
    message: string;
  }[];
  score: number;
}

export default function HeadingAnalyzer() {
  const [pages, setPages] = useState<HeadingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchHeadings();
  }, []);

  const fetchHeadings = async () => {
    try {
      const res = await fetch('/api/admin/seo/headings');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching headings:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeHeadings = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/admin/seo/headings/analyze', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPages(data);
        setMessage({ type: 'success', text: 'Analysis complete!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to analyze headings' });
    } finally {
      setAnalyzing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'H1': return 'bg-[#37AFE1]/20 text-[#37AFE1]';
      case 'H2': return 'bg-purple-500/20 text-purple-400';
      case 'H3': return 'bg-green-500/20 text-green-400';
      case 'H4': return 'bg-amber-500/20 text-amber-400';
      case 'H5': return 'bg-pink-500/20 text-pink-400';
      case 'H6': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const selectedPageData = pages.find(p => p.page === selectedPage);
  const avgScore = pages.length > 0 ? Math.round(pages.reduce((acc, p) => acc + p.score, 0) / pages.length) : 0;
  const pagesWithIssues = pages.filter(p => p.issues.length > 0).length;

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
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-white">{pages.length}</p>
          <p className="text-sm text-slate-400">Pages Analyzed</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</p>
          <p className="text-sm text-slate-400">Average Score</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-amber-400">{pagesWithIssues}</p>
          <p className="text-sm text-slate-400">Pages with Issues</p>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-end">
        <button
          onClick={analyzeHeadings}
          disabled={analyzing}
          className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Analyzing...' : 'Analyze All Pages'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pages List */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Pages</h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-700">
            {pages.map((page) => (
              <button
                key={page.page}
                onClick={() => setSelectedPage(page.page)}
                className={`w-full p-4 text-left hover:bg-slate-700/30 ${selectedPage === page.page ? 'bg-slate-700/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{page.page}</p>
                    <p className="text-xs text-slate-400 mt-1">{page.headings.length} headings</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {page.issues.length > 0 && (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span className={`text-lg font-bold ${getScoreColor(page.score)}`}>{page.score}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Heading Structure */}
        <div className="lg:col-span-2 bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">
              {selectedPageData ? `Heading Structure: ${selectedPageData.page}` : 'Select a page'}
            </h3>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {selectedPageData ? (
              <div className="space-y-6">
                {/* Issues */}
                {selectedPageData.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Issues</h4>
                    {selectedPageData.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg flex items-start gap-2 ${
                          issue.type === 'error' ? 'bg-red-500/10 border border-red-500/30' : 'bg-amber-500/10 border border-amber-500/30'
                        }`}
                      >
                        {issue.type === 'error' ? (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${issue.type === 'error' ? 'text-red-300' : 'text-amber-300'}`}>
                          {issue.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Heading Tree */}
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Heading Hierarchy</h4>
                  <div className="space-y-2">
                    {selectedPageData.headings.map((heading, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                        style={{ paddingLeft: `${(heading.level - 1) * 20}px` }}
                      >
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${getTagColor(heading.tag)}`}>
                          {heading.tag}
                        </span>
                        <span className="text-slate-300 text-sm">{heading.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Practices */}
                <div className="p-4 bg-[#0F172A] rounded-lg">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Best Practices</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Use only one H1 per page</li>
                    <li>• Follow proper hierarchy (H1 → H2 → H3)</li>
                    <li>• Don't skip heading levels</li>
                    <li>• Keep headings descriptive and concise</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">
                <Type className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a page to view its heading structure</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
