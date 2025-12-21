'use client';

import { useEffect, useState } from 'react';
import { Layers, MessageSquare, Briefcase, Eye, RefreshCw } from 'lucide-react';

interface Stats {
  projects: number;
  contacts: number;
  newContacts: number;
  services: number;
  pageViews?: number;
  activeUsers?: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      // Fetch both stats and analytics in parallel
      const [statsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/analytics?range=7d'),
      ]);
      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();
      
      setStats({
        ...statsData.stats,
        pageViews: analyticsData.overview?.totalVisits || 0,
        activeUsers: analyticsData.realTimeMetrics?.activeUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statItems = [
    {
      name: 'Total Projects',
      value: stats?.projects || 0,
      change: 'Portfolio items',
      icon: Layers,
      color: 'bg-[#2563EB]',
    },
    {
      name: 'Contact Messages',
      value: stats?.contacts || 0,
      change: `${stats?.newContacts || 0} new`,
      icon: MessageSquare,
      color: 'bg-[#37AFE1]',
    },
    {
      name: 'Services',
      value: stats?.services || 0,
      change: 'Active services',
      icon: Briefcase,
      color: 'bg-[#F97316]',
    },
    {
      name: 'Page Views',
      value: stats?.pageViews?.toLocaleString() || 0,
      change: `${stats?.activeUsers || 0} active now`,
      icon: Eye,
      color: 'bg-[#31A4DB]',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-24 mb-4" />
            <div className="h-8 bg-slate-700 rounded w-16 mb-2" />
            <div className="h-3 bg-slate-700 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
