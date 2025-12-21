'use client';

import { useState } from 'react';
import { RefreshCw, Gauge, Smartphone, Monitor, AlertTriangle, CheckCircle, XCircle, Globe } from 'lucide-react';

interface PageSpeedResult {
  url: string;
  device: 'mobile' | 'desktop';
  score: number;
  metrics: {
    fcp: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    lcp: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    cls: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    fid: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    ttfb: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    si: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
  };
  opportunities: { title: string; savings: string }[];
  diagnostics: { title: string; description: string }[];
}

export default function PageSpeedInsights() {
  const [results, setResults] = useState<PageSpeedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [urlType, setUrlType] = useState<'preset' | 'custom'>('preset');
  const [selectedUrl, setSelectedUrl] = useState(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com');
  const [customUrl, setCustomUrl] = useState('');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  const presetPages = [
    { url: siteUrl, label: 'Homepage' },
    { url: `${siteUrl}/about`, label: 'About' },
    { url: `${siteUrl}/services`, label: 'Services' },
    { url: `${siteUrl}/portfolio`, label: 'Portfolio' },
    { url: `${siteUrl}/contact`, label: 'Contact' },
    { url: `${siteUrl}/blog`, label: 'Blog' },
  ];

  const getTestUrl = () => {
    if (urlType === 'custom') {
      return customUrl;
    }
    return selectedUrl;
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const runTest = async () => {
    const testUrl = getTestUrl();
    
    if (!testUrl) {
      setMessage({ type: 'error', text: 'Please enter a URL' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (!validateUrl(testUrl)) {
      setMessage({ type: 'error', text: 'Please enter a valid URL (include https://)' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/pagespeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl, device }),
      });

      const data = await res.json();

      if (res.ok) {
        setResults(prev => {
          const filtered = prev.filter(r => !(r.url === data.url && r.device === data.device));
          return [...filtered, data];
        });
        setMessage({ type: 'success', text: 'Analysis complete!' });
      } else {
        throw new Error(data.error || 'Failed to analyze');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to run PageSpeed test' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const currentUrl = getTestUrl();
  const currentResult = results.find(r => r.url === currentUrl && r.device === device);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/50';
    if (score >= 50) return 'bg-amber-500/20 border-amber-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  const getMetricColor = (score: string) => {
    if (score === 'good') return 'text-green-400';
    if (score === 'needs-improvement') return 'text-amber-400';
    return 'text-red-400';
  };

  const getMetricIcon = (score: string) => {
    if (score === 'good') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (score === 'needs-improvement') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const formatMetricValue = (key: string, value: number) => {
    if (key === 'cls') return value.toFixed(3);
    if (key === 'fcp' || key === 'lcp' || key === 'fid' || key === 'ttfb' || key === 'si') {
      return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${value}ms`;
    }
    return value;
  };

  const metricLabels: Record<string, string> = {
    fcp: 'First Contentful Paint',
    lcp: 'Largest Contentful Paint',
    cls: 'Cumulative Layout Shift',
    fid: 'First Input Delay',
    ttfb: 'Time to First Byte',
    si: 'Speed Index',
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

      {/* Controls */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-white font-semibold mb-4">Page Speed Analysis</h3>
        
        {/* URL Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setUrlType('preset')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              urlType === 'preset'
                ? 'bg-[#37AFE1] text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Your Pages
          </button>
          <button
            onClick={() => setUrlType('custom')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              urlType === 'custom'
                ? 'bg-[#37AFE1] text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Custom URL
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {urlType === 'preset' ? 'Select Page' : 'Enter URL'}
            </label>
            {urlType === 'preset' ? (
              <select
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white"
              >
                {presetPages.map(p => (
                  <option key={p.url} value={p.url}>{p.label}</option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Device</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${device === 'mobile' ? 'bg-[#37AFE1] text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
              <button
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${device === 'desktop' ? 'bg-[#37AFE1] text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={runTest}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Analyzing...' : 'Run Test'}
            </button>
          </div>
        </div>

        {/* Current URL Display */}
        {currentUrl && (
          <div className="mt-4 p-3 bg-[#0F172A] rounded-lg">
            <p className="text-xs text-slate-400">Testing URL:</p>
            <p className="text-sm text-white font-mono truncate">{currentUrl}</p>
          </div>
        )}
      </div>

      {currentResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score */}
          <div className={`rounded-xl border-2 p-6 flex flex-col items-center justify-center ${getScoreBg(currentResult.score)}`}>
            <Gauge className={`w-12 h-12 mb-2 ${getScoreColor(currentResult.score)}`} />
            <p className={`text-5xl font-bold ${getScoreColor(currentResult.score)}`}>{currentResult.score}</p>
            <p className="text-slate-400 mt-2">Performance Score</p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{device}</p>
          </div>

          {/* Core Web Vitals */}
          <div className="lg:col-span-2 bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-white font-semibold mb-4">Core Web Vitals</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(currentResult.metrics).map(([key, metric]) => (
                <div key={key} className="p-3 bg-[#0F172A] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 uppercase">{key}</span>
                    {getMetricIcon(metric.score)}
                  </div>
                  <p className={`text-xl font-bold ${getMetricColor(metric.score)}`}>
                    {formatMetricValue(key, metric.value)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{metricLabels[key]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="lg:col-span-2 bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-white font-semibold mb-4">Opportunities</h3>
            {currentResult.opportunities.length === 0 ? (
              <p className="text-slate-400">No opportunities found - great job!</p>
            ) : (
              <div className="space-y-3">
                {currentResult.opportunities.map((opp, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                    <span className="text-slate-300">{opp.title}</span>
                    <span className="text-amber-400 text-sm">{opp.savings}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diagnostics */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
            <h3 className="text-white font-semibold mb-4">Diagnostics</h3>
            {currentResult.diagnostics.length === 0 ? (
              <p className="text-slate-400">No issues found</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {currentResult.diagnostics.map((diag, i) => (
                  <div key={i} className="p-3 bg-[#0F172A] rounded-lg">
                    <p className="text-slate-300 text-sm font-medium">{diag.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{diag.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-12 text-center">
          <Gauge className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
          <p className="text-slate-400">Select a page or enter a custom URL and click "Run Test" to analyze performance</p>
        </div>
      )}
    </div>
  );
}
