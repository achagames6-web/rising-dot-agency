'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Bell, LogOut, Search, MessageSquare, UserPlus, FileText, Check, X } from 'lucide-react';

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

interface Notification {
  id: string;
  type: 'contact' | 'user' | 'content' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'contact',
    title: 'New Contact Submission',
    message: 'John Doe submitted a contact form',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'user',
    title: 'New User Registration',
    message: 'Sarah Wilson joined as an editor',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'content',
    title: 'Content Updated',
    message: 'Homepage hero section was modified',
    time: '2 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    message: 'Database backup completed successfully',
    time: '1 day ago',
    read: true,
  },
];

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <MessageSquare className="w-4 h-4 text-[#37AFE1]" />;
      case 'user':
        return <UserPlus className="w-4 h-4 text-green-400" />;
      case 'content':
        return <FileText className="w-4 h-4 text-[#F58122]" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <header className="bg-[#1E293B] border-b border-slate-700 px-6 py-4 h-[73px] flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#37AFE1] focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#1E293B] border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#37AFE1] hover:text-[#37AFE1]/80 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                          !notification.read ? 'bg-slate-700/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-slate-700/50 rounded-lg">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-white text-sm font-medium truncate">
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-slate-400 hover:text-green-400 transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  onClick={() => removeNotification(notification.id)}
                                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                                  title="Remove"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-slate-400 text-xs mt-0.5 truncate">
                              {notification.message}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-slate-700">
                  <button className="w-full py-2 text-center text-sm text-[#37AFE1] hover:text-[#37AFE1]/80 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
