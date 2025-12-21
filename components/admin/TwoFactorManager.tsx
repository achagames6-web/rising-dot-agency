'use client';

import { useState, useEffect } from 'react';
import { X, Shield, ShieldCheck, Copy, Check } from 'lucide-react';
import Image from 'next/image';

interface User {
  id: number;
  email: string;
  name: string;
  two_factor_enabled: boolean;
}

interface TwoFactorManagerProps {
  user: User | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function TwoFactorManager({
  user,
  onClose,
  onUpdate,
}: TwoFactorManagerProps) {
  const [step, setStep] = useState<'initial' | 'setup' | 'verify'>('initial');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      setStep('initial');
      setSecret('');
      setQrCode('');
      setToken('');
      setError('');
    }
  }, [user]);

  const handleGenerateSecret = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/users/${user.id}/two-factor`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate 2FA secret');
      }

      setSecret(data.secret);
      setQrCode(data.qrCode);
      setStep('setup');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!user || !secret || !token) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/users/${user.id}/two-factor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'enable',
          secret,
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enable 2FA');
      }

      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!user || !token) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/users/${user.id}/two-factor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'disable',
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to disable 2FA');
      }

      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E293B] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {user.two_factor_enabled ? (
              <ShieldCheck className="w-6 h-6 text-green-400" />
            ) : (
              <Shield className="w-6 h-6 text-slate-400" />
            )}
            <h2 className="text-xl font-semibold text-white">
              Two-Factor Authentication
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="text-sm text-slate-400">
            <p className="font-medium text-white mb-1">{user.name}</p>
            <p>{user.email}</p>
          </div>

          {step === 'initial' && (
            <div className="space-y-4">
              {user.two_factor_enabled ? (
                <>
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="font-medium">2FA is enabled</span>
                    </div>
                    <p className="text-sm text-green-300">
                      This user's account is protected with two-factor
                      authentication.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                      Enter verification code to disable 2FA
                    </label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      placeholder="000000"
                      className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#37AFE1] text-center text-2xl tracking-widest"
                    />
                    <button
                      onClick={handleDisable2FA}
                      disabled={loading || token.length !== 6}
                      className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Disabling...' : 'Disable 2FA'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-[#0F172A] border border-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-300 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">2FA is not enabled</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Enable two-factor authentication to add an extra layer of
                      security to this account.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateSecret}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Generating...' : 'Enable 2FA'}
                  </button>
                </>
              )}
            </div>
          )}

          {step === 'setup' && (
            <div className="space-y-4">
              <div className="text-sm text-slate-400 space-y-2">
                <p className="font-medium text-white">
                  Step 1: Scan QR Code
                </p>
                <p>
                  Scan this QR code with your authenticator app (Google
                  Authenticator, Authy, etc.)
                </p>
              </div>

              {qrCode && (
                <div className="flex justify-center p-4 bg-white border border-slate-700 rounded-lg">
                  <Image
                    src={qrCode}
                    alt="2FA QR Code"
                    width={200}
                    height={200}
                  />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-300">
                  Or enter this code manually:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-sm font-mono text-slate-300">
                    {secret}
                  </code>
                  <button
                    onClick={copySecret}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep('verify')}
                className="w-full px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors"
              >
                Continue to Verification
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <div className="text-sm text-slate-400 space-y-2">
                <p className="font-medium text-white">
                  Step 2: Verify Code
                </p>
                <p>
                  Enter the 6-digit code from your authenticator app to complete
                  setup.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#37AFE1] text-center text-2xl tracking-widest"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('setup')}
                    className="flex-1 px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleEnable2FA}
                    disabled={loading || token.length !== 6}
                    className="flex-1 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Enable 2FA'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
