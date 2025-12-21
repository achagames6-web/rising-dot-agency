'use client';

import { useState, useEffect } from 'react';
import { Activity, Filter, Calendar, User, FileText } from 'lucide-react';

interface ActivityLog {
  id: number;
  user_id: number | null;
  user_name: string | null;
  user_email: string | null;
  action: string;
  resource_type: string | null;
  resource_id: number | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface ActivityLogViewerProps {
  userId?: number;
}

export default function ActivityLogViewer({ userId }: ActivityLogViewerProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, resourceFilter, page, userId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (userId) params.append('userId', userId.toString());
      if (actionFilter) params.append('action', actionFilter);
      if (resourceFilter) params.append('resourceType', resourceFilter);

      const response = await fetch(`/api/admin/activity-log?${params}`);
      const data = await response.json();

      if (response.ok) {
        setLogs(data.logs);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: 'Logged in',
      logout: 'Logged out',
      create_user: 'Created user',
      update_user: 'Updated user',
      delete_user: 'Deleted user',
      enable_2fa: 'Enabled 2FA',
      disable_2fa: 'Disabled 2FA',
      create_page: 'Created page',
      update_page: 'Updated page',
      delete_page: 'Deleted page',
      create_project: 'Created project',
      update_project: 'Updated project',
      delete_project: 'Deleted project',
      create_service: 'Created service',
      update_service: 'Updated service',
      delete_service: 'Deleted service',
      upload_media: 'Uploaded media',
      delete_media: 'Deleted media',
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    if (action.startsWith('create')) return 'text-green-400 bg-green-500/20';
    if (action.startsWith('update')) return 'text-[#37AFE1] bg-[#37AFE1]/20';
    if (action.startsWith('delete')) return 'text-red-400 bg-red-500/20';
    if (action.includes('2fa')) return 'text-purple-400 bg-purple-500/20';
    return 'text-slate-400 bg-slate-700';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const uniqueActions = Array.from(
    new Set(logs.map((log) => log.action))
  ).sort();
  const uniqueResources = Array.from(
    new Set(logs.map((log) => log.resource_type).filter(Boolean))
  ).sort();

  return (
    <div className="space-y-4">
      {/* Filters */}
      {!userId && (
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
          >
            <option value="">All Actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {getActionLabel(action)}
              </option>
            ))}
          </select>
          <select
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
          >
            <option value="">All Resources</option>
            {uniqueResources.map((resource) => (
              <option key={resource} value={resource || ''}>
                {resource}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400">Loading activity logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No activity logs
            </h3>
            <p className="text-slate-400">
              {actionFilter || resourceFilter
                ? 'Try adjusting your filters'
                : 'Activity will appear here as users interact with the system'}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-700">
              {logs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-700/30">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.resource_type === 'user' ? (
                          <User className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">
                          {log.user_name || 'System'}
                        </span>
                        <span className="text-slate-300">
                          {getActionLabel(log.action)}
                        </span>
                        {log.resource_type && (
                          <span className="text-slate-400">
                            {log.resource_type}
                            {log.resource_id && ` #${log.resource_id}`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(log.created_at)}
                        </span>
                        {log.user_email && (
                          <span className="truncate">{log.user_email}</span>
                        )}
                      </div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-sm text-slate-400 cursor-pointer hover:text-white">
                            View details
                          </summary>
                          <pre className="mt-2 p-2 bg-[#0F172A] rounded text-xs overflow-x-auto text-slate-300">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
