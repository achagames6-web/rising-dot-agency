'use client';

/**
 * Session Timeout Warning Component
 * Displays a warning when session is about to expire
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { createSessionTimeout } from '@/lib/security/sessionTimeout';

export function SessionTimeoutWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Create session timeout manager
    const sessionTimeout = createSessionTimeout({
      onWarning: () => {
        setShowWarning(true);
      },
      onTimeout: async () => {
        // Sign out and redirect to login
        await signOut({ redirect: false });
        router.push('/auth/signin?timeout=true');
      },
      onExtend: () => {
        setShowWarning(false);
      },
    });

    // Update remaining time every second when warning is shown
    const interval = setInterval(() => {
      if (showWarning) {
        const remaining = Math.ceil(sessionTimeout.getRemainingTime() / 1000);
        setRemainingSeconds(remaining);

        if (remaining <= 0) {
          setShowWarning(false);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      sessionTimeout.destroy();
    };
  }, [showWarning, router]);

  const handleExtendSession = () => {
    // Any user activity will extend the session
    // The session timeout manager will handle this automatically
    setShowWarning(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  if (!showWarning) {
    return null;
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-lg bg-[#1E293B] shadow-2xl border border-[#F59E0B]/20 p-6">
        {/* Warning Icon */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-[#F59E0B]/10 p-3">
            <svg
              className="h-8 w-8 text-[#F59E0B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Session Expiring Soon
          </h3>
          <p className="text-sm text-[#64748B] mb-4">
            Your session will expire due to inactivity. You will be automatically
            logged out in:
          </p>
          <div className="text-3xl font-bold text-[#F59E0B] font-mono">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#64748B] hover:bg-[#475569] rounded-lg transition-colors"
          >
            Logout Now
          </button>
          <button
            onClick={handleExtendSession}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#37AFE1] rounded-lg transition-colors"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
