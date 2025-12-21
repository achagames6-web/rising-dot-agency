'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Bot, TrendingUp, Clock, FileText, AlertTriangle } from 'lucide-react';

interface CrawlData {
  page: string;
  crawlCount: number;
  lastCrawled: string;
  avgCrawlTime: number;
  status: 'healthy' | 'over-crawled' | 'under-crawled';
  priority: 'high' | 'medium' | 'low';
}

interface CrawlStats {
  totalCrawls: number;
  avgCrawlsPerDay: number;
  mostCrawled: string;
  leastCrawled: string;
  crawlBudgetUsed: number;
}

export default function CrawlBudgetMonitor() {
  const [crawlData, setCrawlData] = useState<CrawlData[]>([]);
  const [stats, setStats] = useState<CrawlStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCrawlData();
  }, []);

  const fetchCrawlData = async () => {
    try {
      const res = await fetch('/api/admin/seo/crawl-budget');
      if (res.ok) {
        const data = await res.json();
        setCrawlData(data.pages || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Error fetching crawl data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/seo/crawl-budget/refresh', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setCrawlData(data.pages || []);
        setStats(data.stats || null);
        setMessage({ type: 'success', text: 'Data refreshed!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to refresh data' });
    } finally {
      setRefreshing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-400';
      case 'over-crawled': return 'bg-amber-500/20 text-amber-400';
      case 'under-crawled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-slate-400';
      default: return 'text-slate-400';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
          <Bot className="w-5 h-5 text-[#37AFE1] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-white font-medium">What is Crawl Budget?</h3>
            <p className="text-sm text-slate-400 mt-1">
              Crawl budget is the number of pages search engines will crawl on your site within a given timeframe. 
              Monitoring helps ensure important pages get crawled frequently while avoiding wasted crawls on low-value pages.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-[#37AFE1]" />
              <span className="text-xs text-slate-400">Total Crawls</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalCrawls.toLocaleString()}</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Avg/Day</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.avgCrawlsPerDay}</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Budget Used</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.crawlBudgetUsed}%</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Most Crawled</span>
            </div>
            <p className="text-sm font-medium text-white truncate">{stats.mostCrawled}</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">Least Crawled</span>
            </div>
            <p className="text-sm font-medium text-white truncate">{stats.leastCrawled}</p>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Crawl Data Table */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-white font-semibold">Page Crawl Activity</h3>
        </div>
        {crawlData.length === 0 ? (
          <div className="p-12 text-center">
            <Bot className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Crawl Data</h3>
            <p className="text-slate-400">Connect Google Search Console to see crawl data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0F172A] border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Page</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Crawl Count</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Last Crawled</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Avg Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {crawlData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-sm text-white">{item.page}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{item.crawlCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{formatDate(item.lastCrawled)}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{item.avgCrawlTime}ms</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium capitalize ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-white font-semibold mb-4">Optimization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-[#0F172A] rounded-lg">
            <p className="text-[#37AFE1] font-medium mb-1">Improve Crawl Efficiency</p>
            <p className="text-slate-400">Remove duplicate content and fix broken links to avoid wasting crawl budget</p>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-lg">
            <p className="text-[#37AFE1] font-medium mb-1">Prioritize Important Pages</p>
            <p className="text-slate-400">Use internal linking to signal which pages are most important</p>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-lg">
            <p className="text-[#37AFE1] font-medium mb-1">Update Sitemap</p>
            <p className="text-slate-400">Keep your sitemap updated with only indexable pages</p>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-lg">
            <p className="text-[#37AFE1] font-medium mb-1">Improve Page Speed</p>
            <p className="text-slate-400">Faster pages allow crawlers to process more pages in less time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
