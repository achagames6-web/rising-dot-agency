'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  MousePointer,
  Eye,
  BarChart3,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  ExternalLink,
  Link as LinkIcon,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchConsoleData {
  connected: boolean;
  siteUrl?: string;
  overview?: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    clicksChange: number;
    impressionsChange: number;
  };
  topQueries?: {
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  topPages?: {
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  devicePerformance?: {
    device: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  countryPerformance?: {
    country: string;
    clicks: number;
    impressions: number;
    ctr: number;
  }[];
  dailyData?: {
    date: string;
    clicks: number;
    impressions: number;
  }[];
  indexingStatus?: {
    indexed: number;
    notIndexed: number;
    errors: number;
  };
  crawlErrors?: {
    type: string;
    count: number;
    severity: 'error' | 'warning';
  }[];
}

export default function SearchConsolePage() {
  const [data, setData] = useState<SearchConsoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '28d' | '90d'>('28d');
  const [showSetup, setShowSetup] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'queries' | 'pages'>('queries');

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(`/api/admin/analytics/search-console?range=${timeRange}`);
      const result = await response.json();
      setData(result);
      if (result.siteUrl) {
        setSiteUrl(result.siteUrl);
      }
    } catch (error) {
      console.error('Failed to fetch Search Console data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/analytics/search-console/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl }),
      });
      if (response.ok) {
        setShowSetup(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Search className="w-8 h-8 text-[#37AFE1]" />
            Google Search Console
          </h1>
          <p className="text-slate-400 mt-1">
            {data?.connected 
              ? `Monitoring: ${data.siteUrl}` 
              : 'Connect your Search Console property to monitor search performance'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSetup(true)}
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {(['7d', '28d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#37AFE1] text-white'
                  : 'bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '28d' ? '28 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Search Console Setup</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Site URL
                </label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://yourdomain.com"
                  className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter your verified Search Console property URL
                </p>
              </div>
              <div className="bg-[#0F172A] rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-medium text-white mb-2">Setup Instructions:</h3>
                <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                  <li>Go to Google Search Console</li>
                  <li>Add and verify your property</li>
                  <li>Copy your property URL</li>
                  <li>Paste it above and save</li>
                </ol>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSetup(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saving || !siteUrl}
                  className="px-4 py-2 rounded-lg bg-[#37AFE1] text-white font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not Connected State */}
      {!data?.connected && (
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-12 text-center">
          <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect Search Console</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Enter your Search Console property URL to monitor your search performance, 
            keywords, and indexing status.
          </p>
          <button
            onClick={() => setShowSetup(true)}
            className="px-6 py-3 rounded-lg bg-[#37AFE1] text-white font-medium hover:bg-[#37AFE1]/90 transition-colors"
          >
            Connect Search Console
          </button>
        </div>
      )}

      {/* Connected State - Show Data */}
      {data?.connected && (
        <>
          {/* Connection Status */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-400">Connected to Search Console</span>
            <a
              href={`https://search.google.com/search-console?resource_id=${encodeURIComponent(data.siteUrl || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
            >
              Open in Search Console <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Overview Stats */}
          {data.overview && (
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                icon={<MousePointer className="w-5 h-5" />}
                label="Total Clicks"
                value={data.overview.totalClicks.toLocaleString()}
                change={data.overview.clicksChange}
                color="text-[#37AFE1]"
              />
              <StatCard
                icon={<Eye className="w-5 h-5" />}
                label="Total Impressions"
                value={data.overview.totalImpressions.toLocaleString()}
                change={data.overview.impressionsChange}
                color="text-[#F58122]"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Average CTR"
                value={`${data.overview.avgCtr.toFixed(2)}%`}
                color="text-green-400"
              />
              <StatCard
                icon={<BarChart3 className="w-5 h-5" />}
                label="Average Position"
                value={data.overview.avgPosition.toFixed(1)}
                color="text-purple-400"
              />
            </div>
          )}

          {/* Performance Chart */}
          {data.dailyData && (
            <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Search Performance</h3>
              <div className="h-64 flex items-end gap-1">
                {data.dailyData.map((day, index) => {
                  const maxClicks = Math.max(...data.dailyData!.map(d => d.clicks), 1);
                  const maxImpressions = Math.max(...data.dailyData!.map(d => d.impressions), 1);
                  const clicksHeight = (day.clicks / maxClicks) * 100;
                  const impressionsHeight = (day.impressions / maxImpressions) * 50;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${impressionsHeight}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        className="w-full bg-[#F58122]/30 rounded-t"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${clicksHeight}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        className="w-full bg-[#37AFE1] rounded-t"
                      />
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-16 bg-slate-800 px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10">
                        <div>{day.clicks} clicks</div>
                        <div>{day.impressions} impressions</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{data.dailyData[0]?.date}</span>
                <span>{data.dailyData[data.dailyData.length - 1]?.date}</span>
              </div>
              <div className="flex gap-4 mt-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#37AFE1] rounded" />
                  <span className="text-sm text-slate-400">Clicks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#F58122]/30 rounded" />
                  <span className="text-sm text-slate-400">Impressions</span>
                </div>
              </div>
            </div>
          )}

          {/* Tabs for Queries/Pages */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab('queries')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'queries'
                    ? 'bg-[#0F172A] text-white border-b-2 border-[#37AFE1]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Top Queries
              </button>
              <button
                onClick={() => setActiveTab('pages')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'pages'
                    ? 'bg-[#0F172A] text-white border-b-2 border-[#37AFE1]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Top Pages
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'queries' && data.topQueries && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                        <th className="pb-3 font-medium">Query</th>
                        <th className="pb-3 font-medium text-right">Clicks</th>
                        <th className="pb-3 font-medium text-right">Impressions</th>
                        <th className="pb-3 font-medium text-right">CTR</th>
                        <th className="pb-3 font-medium text-right">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topQueries.map((query, index) => (
                        <tr key={index} className="border-b border-slate-700/50 last:border-0">
                          <td className="py-3 text-white">{query.query}</td>
                          <td className="py-3 text-right text-[#37AFE1] font-semibold">{query.clicks.toLocaleString()}</td>
                          <td className="py-3 text-right text-slate-400">{query.impressions.toLocaleString()}</td>
                          <td className="py-3 text-right text-green-400">{query.ctr.toFixed(2)}%</td>
                          <td className="py-3 text-right text-slate-300">{query.position.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'pages' && data.topPages && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                        <th className="pb-3 font-medium">Page</th>
                        <th className="pb-3 font-medium text-right">Clicks</th>
                        <th className="pb-3 font-medium text-right">Impressions</th>
                        <th className="pb-3 font-medium text-right">CTR</th>
                        <th className="pb-3 font-medium text-right">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topPages.map((page, index) => (
                        <tr key={index} className="border-b border-slate-700/50 last:border-0">
                          <td className="py-3 text-white truncate max-w-[300px]">{page.page}</td>
                          <td className="py-3 text-right text-[#37AFE1] font-semibold">{page.clicks.toLocaleString()}</td>
                          <td className="py-3 text-right text-slate-400">{page.impressions.toLocaleString()}</td>
                          <td className="py-3 text-right text-green-400">{page.ctr.toFixed(2)}%</td>
                          <td className="py-3 text-right text-slate-300">{page.position.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Device & Country Performance */}
          <div className="grid grid-cols-2 gap-6">
            {/* Device Performance */}
            {data.devicePerformance && (
              <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Device Performance</h3>
                <div className="space-y-4">
                  {data.devicePerformance.map((device) => (
                    <div key={device.device} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                      <div className="flex items-center gap-3">
                        {device.device === 'DESKTOP' && <Monitor className="w-5 h-5 text-slate-400" />}
                        {device.device === 'MOBILE' && <Smartphone className="w-5 h-5 text-slate-400" />}
                        {device.device === 'TABLET' && <Smartphone className="w-5 h-5 text-slate-400" />}
                        <span className="text-slate-300 capitalize">{device.device.toLowerCase()}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-white">{device.clicks.toLocaleString()}</span>
                        <span className="text-slate-500 text-sm ml-2">clicks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indexing Status */}
            {data.indexingStatus && (
              <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Indexing Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-500/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{data.indexingStatus.indexed}</div>
                    <div className="text-sm text-slate-400">Indexed</div>
                  </div>
                  <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{data.indexingStatus.notIndexed}</div>
                    <div className="text-sm text-slate-400">Not Indexed</div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">{data.indexingStatus.errors}</div>
                    <div className="text-sm text-slate-400">Errors</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Crawl Errors */}
          {data.crawlErrors && data.crawlErrors.length > 0 && (
            <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Crawl Issues
              </h3>
              <div className="space-y-3">
                {data.crawlErrors.map((error, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      error.severity === 'error' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${error.severity === 'error' ? 'text-red-500' : 'text-yellow-500'}`} />
                      <span className="text-slate-300">{error.type}</span>
                    </div>
                    <span className={`font-semibold ${error.severity === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {error.count} issues
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  color = 'text-white',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
  color?: string;
}) {
  return (
    <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {change !== undefined && (
        <div className={`text-sm font-medium mt-1 flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
