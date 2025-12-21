'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  User,
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: 'ai' | 'waiting' | 'human' | 'resolved';
  messageCount: number;
  lastMessage: string;
  lastMessageTime: string;
  createdAt: string;
}

const statusConfig = {
  ai: { label: 'AI Handling', color: 'bg-blue-500/20 text-blue-400', icon: Bot },
  waiting: { label: 'Waiting', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertCircle },
  human: { label: 'Human Agent', color: 'bg-green-500/20 text-green-400', icon: User },
  resolved: { label: 'Resolved', color: 'bg-slate-500/20 text-slate-400', icon: CheckCircle },
};

export default function LiveChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [hasNewWaiting, setHasNewWaiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousWaitingCount = useRef(0);

  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio('/notification.mp3');
    fetchConversations();

    // Poll for new conversations every 5 seconds
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/admin/chat?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);

        // Check for new waiting conversations and play sound
        const waitingCount = data.filter((c: Conversation) => c.status === 'waiting').length;
        if (waitingCount > previousWaitingCount.current && previousWaitingCount.current > 0) {
          setHasNewWaiting(true);
          audioRef.current?.play().catch(() => {});
        }
        previousWaitingCount.current = waitingCount;
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const res = await fetch(`/api/admin/chat/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/chat/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchConversations();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const waitingCount = conversations.filter(c => c.status === 'waiting').length;

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-[#F58122]" />
            Live Chat
            {waitingCount > 0 && (
              <span className="px-2 py-1 text-sm bg-yellow-500/20 text-yellow-400 rounded-full animate-pulse">
                {waitingCount} waiting
              </span>
            )}
          </h1>
          <p className="text-slate-400 mt-1">Manage customer conversations</p>
        </div>
        <button
          onClick={fetchConversations}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'waiting', 'ai', 'human', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filter === status
                ? 'bg-[#F58122] text-white'
                : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Conversations List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl text-slate-400">No conversations yet</h3>
          <p className="text-slate-500 mt-2">
            Conversations will appear here when visitors start chatting
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => {
            const StatusIcon = statusConfig[conv.status].icon;
            return (
              <div
                key={conv.id}
                className={`bg-[#1E293B] rounded-xl p-4 border transition-all hover:border-[#37AFE1]/50 ${
                  conv.status === 'waiting'
                    ? 'border-yellow-500/50'
                    : 'border-slate-700/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0F172A] flex items-center justify-center text-[#F58122] font-semibold text-lg">
                      {conv.visitorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-semibold">{conv.visitorName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${statusConfig[conv.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[conv.status].label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{conv.visitorEmail}</p>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-slate-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(conv.lastMessageTime)}
                      </p>
                      <p className="text-slate-600 text-xs mt-1">
                        {conv.messageCount} messages
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/live-chat/${conv.id}`}
                        className="px-3 py-1.5 bg-[#F58122] text-white text-sm rounded-lg hover:bg-[#e0741d] transition-colors"
                      >
                        {conv.status === 'waiting' ? 'Reply' : 'View'}
                      </a>
                      {conv.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(conv.id, 'resolved')}
                          className="p-1.5 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Mark as resolved"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(conv.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
