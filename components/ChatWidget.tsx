'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isHuman?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'form' | 'chat'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [status, setStatus] = useState<'ai' | 'waiting' | 'human' | 'resolved'>('ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Polling for new messages when in waiting/human mode
  useEffect(() => {
    if (conversationId && (status === 'waiting' || status === 'human')) {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/chat/message?conversationId=${conversationId}&lastCount=${messages.length}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.hasNewMessages && data.newMessages?.length > 0) {
              setMessages(prev => [...prev, ...data.newMessages]);
            }
            if (data.status) {
              setStatus(data.status);
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 3000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [conversationId, status, messages.length]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsStarting(true);
    try {
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        const data = await res.json();
        setConversationId(data.conversationId);
        setMessages([data.message]);
        setStep('chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conversationId || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: userMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.aiResponse) {
          setMessages(prev => [...prev, data.aiResponse]);
        }
        if (data.status) {
          setStatus(data.status);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setStep('form');
    setName('');
    setEmail('');
    setConversationId(null);
    setMessages([]);
    setStatus('ai');
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#F58122] text-white shadow-lg flex items-center justify-center hover:bg-[#e0741d] transition-colors ${isOpen ? 'hidden' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-[#0F172A] rounded-2xl shadow-2xl border border-[#37AFE1]/20 flex flex-col overflow-hidden"
          >
            {/* Header - Compact */}
            <div className="bg-gradient-to-r from-[#F58122] to-[#F97316] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bot className="w-6 h-6 text-white" />
                <span className="text-white text-sm font-medium">
                  {status === 'waiting'
                    ? 'Connecting...'
                    : status === 'human'
                    ? 'Live Agent'
                    : 'AI Assistant'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {step === 'form' ? (
              /* User Info Form */
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <h4 className="text-white text-lg font-semibold mb-2">
                    Welcome! 👋
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Please enter your details to start chatting
                  </p>
                </div>
                <form onSubmit={handleStartChat} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-2.5 bg-[#1E293B] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-2.5 bg-[#1E293B] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isStarting}
                    className="w-full py-3 bg-[#F58122] text-white rounded-lg font-semibold hover:bg-[#e0741d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isStarting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      'Start Chat'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Chat Messages */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          msg.role === 'user'
                            ? 'bg-[#F58122] text-white rounded-br-md'
                            : 'bg-[#1E293B] text-slate-200 rounded-bl-md'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1.5 mb-1">
                            {msg.isHuman ? (
                              <User className="w-3 h-3 text-[#37AFE1]" />
                            ) : (
                              <Bot className="w-3 h-3 text-[#37AFE1]" />
                            )}
                            <span className="text-xs text-[#37AFE1]">
                              {msg.isHuman ? 'Support Agent' : 'AI Assistant'}
                            </span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#1E293B] rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Status Banner */}
                {status === 'waiting' && (
                  <div className="px-4 py-2 bg-[#37AFE1]/20 border-t border-[#37AFE1]/30">
                    <p className="text-xs text-[#37AFE1] text-center">
                      🔔 A team member will join shortly...
                    </p>
                  </div>
                )}

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2.5 bg-[#1E293B] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#37AFE1] text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="px-4 py-2.5 bg-[#F58122] text-white rounded-lg hover:bg-[#e0741d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
