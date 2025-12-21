'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, FileText, Image, Link2, Type } from 'lucide-react';

interface AuditResult {
  page: string;
  score: number;
  issues: {
    type: 'error' | 'warning' | 'success';
    category: string;
    message: string;
    details?: string;
  }[];
  checks: {
    title: { status: 'pass' | 'fail' | 'warning'; value: string; length: number };
    description: { status: 'pass' | 'fail' | 'warning'; value: string; length: number };
    h1: { status: 'pass' | 'fail' | 'warning'; count: number; values: string[] };
    images: { total: number; withAlt: number; withoutAlt: string[] };
    internalLinks: number;
    externalLinks: number;
    wordCount: number;
  };
}

export default function SEOAudit() {
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pages = ['/', '/about', '/services', '/portfolio', '/contact', '/blog'];

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const res = await fetch('/api/admin/seo/audit');
      if (res.ok) {
        const data = await res.json();
        setAudits(data);
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async (page?: string) => {
    setAuditing(true);
    try {
      const res = await fetch('/api/admin/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
      });

      if (res.ok) {
        const data = await res.json();
        setAudits(data);
        setMessage({ type: 'success', text: 'Audit complete!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to run audit' });
    } finally {
      setAuditing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-amber-500/20 border-amber-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const avgScore = audits.length > 0 
    ? Math.round(audits.reduce((acc, a) => acc + a.score, 0) / audits.length) 
    : 0;

  const totalIssues = audits.reduce((acc, a) => acc + a.issues.filter(i => i.type !== 'success').length, 0);
  const errorCount = audits.reduce((acc, a) => acc + a.issues.filter(i => i.type === 'error').length, 0);
  const warningCount = audits.reduce((acc, a) => acc + a.issues.filter(i => i.type === 'warning').length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  const selectedAudit = audits.find(a => a.page === selectedPage);

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-xl border p-4 ${getScoreBg(avgScore)}`}>
          <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</p>
          <p className="text-sm text-slate-400">Average Score</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-white">{totalIssues}</p>
          <p className="text-sm text-slate-400">Total Issues</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <p className="text-2xl font-bold text-red-400">{errorCount}</p>
          </div>
          <p className="text-sm text-slate-400">Errors</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <p className="text-2xl font-bold text-amber-400">{warningCount}</p>
          </div>
          <p className="text-sm text-slate-400">Warnings</p>
        </div>
      </div>

      {/* Audit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => runAudit()}
          disabled={auditing}
          className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${auditing ? 'animate-spin' : ''}`} />
          {auditing ? 'Auditing...' : 'Run Full Audit'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pages List */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">Page Scores</h3>
          </div>
          <div className="divide-y divide-slate-700">
            {pages.map((page) => {
              const audit = audits.find(a => a.page === page);
              return (
                <button
                  key={page}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full p-4 text-left hover:bg-slate-700/30 transition-colors ${selectedPage === page ? 'bg-slate-700/50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">{page === '/' ? 'Homepage' : page}</span>
                    {audit ? (
                      <span className={`text-lg font-bold ${getScoreColor(audit.score)}`}>
                        {audit.score}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-sm">Not audited</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audit Details */}
        <div className="lg:col-span-2 bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-semibold">
              {selectedPage ? `Audit: ${selectedPage}` : 'Select a page'}
            </h3>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {selectedAudit ? (
              <div className="space-y-6">
                {/* Score Circle */}
                <div className="flex items-center gap-6">
                  <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${getScoreBg(selectedAudit.score)}`}>
                    <span className={`text-3xl font-bold ${getScoreColor(selectedAudit.score)}`}>
                      {selectedAudit.score}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">SEO Score</p>
                    <p className="text-sm text-slate-400">
                      {selectedAudit.score >= 80 ? 'Good' : selectedAudit.score >= 60 ? 'Needs Improvement' : 'Poor'}
                    </p>
                  </div>
                </div>

                {/* Checks */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#0F172A] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Type className="w-4 h-4 text-[#37AFE1]" />
                      <span className="text-sm text-slate-300">Title</span>
                    </div>
                    <p className="text-white text-sm truncate">{selectedAudit.checks.title.value || 'Missing'}</p>
                    <p className="text-xs text-slate-400">{selectedAudit.checks.title.length} characters</p>
                  </div>
                  <div className="p-3 bg-[#0F172A] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-[#37AFE1]" />
                      <span className="text-sm text-slate-300">Description</span>
                    </div>
                    <p className="text-white text-sm truncate">{selectedAudit.checks.description.value || 'Missing'}</p>
                    <p className="text-xs text-slate-400">{selectedAudit.checks.description.length} characters</p>
                  </div>
                  <div className="p-3 bg-[#0F172A] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="w-4 h-4 text-[#37AFE1]" />
                      <span className="text-sm text-slate-300">Images</span>
                    </div>
                    <p className="text-white">{selectedAudit.checks.images.withAlt}/{selectedAudit.checks.images.total} with alt</p>
                  </div>
                  <div className="p-3 bg-[#0F172A] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4 text-[#37AFE1]" />
                      <span className="text-sm text-slate-300">Links</span>
                    </div>
                    <p className="text-white">{selectedAudit.checks.internalLinks} internal, {selectedAudit.checks.externalLinks} external</p>
                  </div>
                </div>

                {/* Issues */}
                <div>
                  <h4 className="text-white font-medium mb-3">Issues & Recommendations</h4>
                  <div className="space-y-2">
                    {selectedAudit.issues.map((issue, i) => (
                      <div 
                        key={i} 
                        className={`p-3 rounded-lg flex items-start gap-3 ${
                          issue.type === 'error' ? 'bg-red-500/10 border border-red-500/30' :
                          issue.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/30' :
                          'bg-green-500/10 border border-green-500/30'
                        }`}
                      >
                        {issue.type === 'error' ? (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        ) : issue.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        )}
                        <div>
                          <p className={`text-sm ${
                            issue.type === 'error' ? 'text-red-300' :
                            issue.type === 'warning' ? 'text-amber-300' :
                            'text-green-300'
                          }`}>
                            {issue.message}
                          </p>
                          {issue.details && (
                            <p className="text-xs text-slate-400 mt-1">{issue.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a page to view its SEO audit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
