'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification token has expired or has already been used.',
    Default: 'An error occurred during authentication.',
  };

  const message = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] via-[#2563EB] to-[#37AFE1] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Authentication Error
          </h1>

          <p className="text-slate-600 text-center mb-6">{message}</p>

          <Link
            href="/auth/signin"
            className="block w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#37AFE1] text-white font-medium rounded-lg text-center hover:shadow-lg transition-all duration-200"
          >
            Try Again
          </Link>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
