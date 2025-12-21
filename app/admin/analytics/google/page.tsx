'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Clock,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Settings,
  ExternalLink,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface GAData {
  connected: boolean;
  propertyId?: string;
  overview?: {
    users: number;
    newUsers: number;
    sessions: number;
    pageviews: number;
    avgSessionDuration: number;
    bounceRate: number;
    usersChange: number;
    sessionsChange: number;
    pageviewsChange: number;
  };
  realtime?: {
    activeUsers: number;
    pageviews: number;
  };
  topPages?: { page: string; views: number; avgTime: number }[];
  topSources?: { source: string; users: number; sessions: number }[];
  deviceBreakdown?: { device: string; users: number; percentage: number }[];
  countryData?: { country: string; users: number; sessions: number }[];
  dailyData?: { date: string; users: number; sessions: number; pageviews: number }[];
}

export default function GoogleAnalyticsPage() {
  const [data, setData] = useState<GAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [showSetup, setShowSetup] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(`/api/admin/analytics/google?range=${timeRange}`);
      const result = await response.json();
      setData(result);
      if (result.propertyId) {
        setPropertyId(result.propertyId);
      }
    } catch (error) {
      console.error('Failed to fetch GA data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/analytics/google/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
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
            <BarChart3 className="w-8 h-8 text-[#F58122]" />
            Google Analytics
          </h1>
          <p className="text-slate-400 mt-1">
            {data?.connected 
              ? `Connected to property: ${data.propertyId}` 
              : 'Connect your Google Analytics 4 property to view detailed insights'}
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
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#F58122] text-white'
                  : 'bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Google Analytics Setup</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  GA4 Property ID (Measurement ID)
                </label>
                <input
                  type="text"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#F58122]"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Find this in GA4 → Admin → Data Streams → Your Stream
                </p>
              </div>
              <div className="bg-[#0F172A] rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-medium text-white mb-2">Setup Instructions:</h3>
                <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                  <li>Go to Google Analytics 4</li>
                  <li>Navigate to Admin → Data Streams</li>
                  <li>Copy your Measurement ID (starts with G-)</li>
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
                  disabled={saving || !propertyId}
                  className="px-4 py-2 rounded-lg bg-[#F58122] text-white font-medium disabled:opacity-50"
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
          <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Connect Google Analytics</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Enter your GA4 Measurement ID to view detailed analytics data including traffic sources, 
            user behavior, and conversion metrics.
          </p>
          <button
            onClick={() => setShowSetup(true)}
            className="px-6 py-3 rounded-lg bg-[#F58122] text-white font-medium hover:bg-[#F58122]/90 transition-colors"
          >
            Connect Google Analytics
          </button>
        </div>
      )}

      {/* Connected State - Show Data */}
      {data?.connected && (
        <>
          {/* Connection Status */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-400">Connected to Google Analytics 4</span>
            <a
              href={`https://analytics.google.com/analytics/web/#/p${data.propertyId?.replace('G-', '')}/reports/intelligenthome`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
            >
              Open in GA4 <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Real-Time Metrics */}
          {data.realtime && (
            <div className="bg-gradient-to-r from-[#F58122] to-[#F97316] rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <h2 className="text-xl font-semibold">Real-Time</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold">{data.realtime.activeUsers}</div>
                  <div className="text-orange-100">Active Users Now</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">{data.realtime.pageviews}</div>
                  <div className="text-orange-100">Pageviews (30 min)</div>
                </div>
              </div>
            </div>
          )}

          {/* Overview Stats */}
          {data.overview && (
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Users"
                value={data.overview.users.toLocaleString()}
                change={data.overview.usersChange}
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="New Users"
                value={data.overview.newUsers.toLocaleString()}
              />
              <StatCard
                icon={<MousePointer className="w-5 h-5" />}
                label="Sessions"
                value={data.overview.sessions.toLocaleString()}
                change={data.overview.sessionsChange}
              />
              <StatCard
                icon={<BarChart3 className="w-5 h-5" />}
                label="Pageviews"
                value={data.overview.pageviews.toLocaleString()}
                change={data.overview.pageviewsChange}
              />
              <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="Avg. Duration"
                value={formatDuration(data.overview.avgSessionDuration)}
              />
              <StatCard
                icon={<TrendingDown className="w-5 h-5" />}
                label="Bounce Rate"
                value={`${data.overview.bounceRate.toFixed(1)}%`}
              />
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Traffic Over Time */}
            {data.dailyData && (
              <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Traffic Over Time</h3>
                <div className="h-64 flex items-end gap-1">
                  {data.dailyData.map((day, index) => {
                    const maxUsers = Math.max(...data.dailyData!.map(d => d.users), 1);
                    const height = (day.users / maxUsers) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: index * 0.02 }}
                          className="w-full bg-gradient-to-t from-[#F58122] to-[#F97316] rounded-t cursor-pointer hover:from-[#F97316] hover:to-[#FB923C]"
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 px-2 py-1 rounded text-xs text-white">
                          {day.users} users
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>{data.dailyData[0]?.date}</span>
                  <span>{data.dailyData[data.dailyData.length - 1]?.date}</span>
                </div>
              </div>
            )}

            {/* Device Breakdown */}
            {data.deviceBreakdown && (
              <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Device Breakdown</h3>
                <div className="space-y-4">
                  {data.deviceBreakdown.map((device) => (
                    <div key={device.device}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-slate-300">
                          {device.device === 'desktop' && <Monitor className="w-5 h-5" />}
                          {device.device === 'mobile' && <Smartphone className="w-5 h-5" />}
                          {device.device === 'tablet' && <Tablet className="w-5 h-5" />}
                          <span className="capitalize">{device.device}</span>
                        </div>
                        <span className="text-white font-semibold">{device.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${device.percentage}%` }}
                          transition={{ duration: 0.8 }}
                          className="bg-[#F58122] h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Top Pages */}
            {data.topPages && (
              <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {data.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-sm w-5">{index + 1}.</span>
                        <span className="text-slate-300 text-sm truncate max-w-[200px]">{page.page}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-white">{page.views.toLocaleString()}</span>
                        <span className="text-slate-500 text-xs ml-2">({formatDuration(page.avgTime)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traffic Sources */}
            {data.topSources && (
              <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
                <div className="space-y-3">
                  {data.topSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300 text-sm">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-white">{source.users.toLocaleString()}</span>
                        <span className="text-slate-500 text-xs ml-2">users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Countries */}
          {data.countryData && (
            <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Countries</h3>
              <div className="grid grid-cols-5 gap-4">
                {data.countryData.slice(0, 10).map((country) => (
                  <div key={country.country} className="bg-[#0F172A] rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{country.users.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">{country.country}</div>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
}) {
  return (
    <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change !== undefined && (
        <div className={`text-sm font-medium mt-1 flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </div>
      )}
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}
