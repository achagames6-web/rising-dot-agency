'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  User,
  Bot,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isHuman?: boolean;
}

interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  status: 'ai' | 'waiting' | 'human' | 'resolved';
  messages: Message[];
  createdAt: string;
}

const statusConfig = {
  ai: { label: 'AI Handling', color: 'bg-blue-500/20 text-blue-400', icon: Bot },
  waiting: { label: 'Waiting for Agent', color: 'bg-yellow-500/20 text-yellow-400', icon: AlertCircle },
  human: { label: 'Human Agent', color: 'bg-green-500/20 text-green-400', icon: User },
  resolved: { label: 'Resolved', color: 'bg-slate-500/20 text-slate-400', icon: CheckCircle },
};

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchConversation();

    // Poll for new messages every 3 seconds
    pollingRef.current = setInterval(fetchConversation, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/admin/chat/${id}`);
      if (res.ok) {
        const data = await res.json();
        setConversation(data);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/admin/chat/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (res.ok) {
        setReplyMessage('');
        fetchConversation();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      const res = await fetch(`/api/admin/chat/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchConversation();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Conversation not found</p>
        <button
          onClick={() => router.push('/admin/live-chat')}
          className="mt-4 text-[#37AFE1] hover:underline"
        >
          Back to conversations
        </button>
      </div>
    );
  }

  const StatusIcon = statusConfig[conversation.status].icon;

  return (
    <div className="min-h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/live-chat')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center text-[#F58122] font-semibold text-lg">
              {conversation.visitorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{conversation.visitorName}</h1>
              <p className="text-slate-400 text-sm">{conversation.visitorEmail}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 ${statusConfig[conversation.status].color}`}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig[conversation.status].label}
          </span>
          {conversation.status !== 'resolved' && (
            <button
              onClick={() => handleStatusChange('resolved')}
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Resolved
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-[#1E293B] rounded-xl border border-slate-700/50 flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {conversation.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[#0F172A] text-slate-200 rounded-bl-md'
                    : msg.isHuman
                    ? 'bg-[#F58122] text-white rounded-br-md'
                    : 'bg-[#37AFE1]/20 text-slate-200 rounded-br-md'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === 'user' ? (
                    <>
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-400">{conversation.visitorName}</span>
                    </>
                  ) : msg.isHuman ? (
                    <>
                      <User className="w-3 h-3 text-white/70" />
                      <span className="text-xs text-white/70">You (Agent)</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-[#37AFE1]" />
                      <span className="text-xs text-[#37AFE1]">AI Assistant</span>
                    </>
                  )}
                  <span className="text-xs text-slate-500 ml-auto">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input */}
        <div className="p-4 border-t border-slate-700/50">
          <form onSubmit={handleSendReply} className="flex gap-3">
            <input
              type="text"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 px-4 py-3 bg-[#0F172A] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#37AFE1]"
            />
            <button
              type="submit"
              disabled={!replyMessage.trim() || sending}
              className="px-6 py-3 bg-[#F58122] text-white rounded-lg hover:bg-[#e0741d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
