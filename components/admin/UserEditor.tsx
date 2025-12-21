'use client';

import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';

interface User {
  id?: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  password?: string;
}

interface UserEditorProps {
  user: User | null;
  onClose: () => void;
  onSave: () => void;
}

export default function UserEditor({ user, onClose, onSave }: UserEditorProps) {
  const [formData, setFormData] = useState<User>({
    email: '',
    name: '',
    role: 'viewer',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '',
      });
    } else {
      setFormData({
        email: '',
        name: '',
        role: 'viewer',
        password: '',
      });
    }
    setError('');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = user?.id
        ? `/api/admin/users/${user.id}`
        : '/api/admin/users';
      const method = user?.id ? 'PUT' : 'POST';

      const body: any = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
      };

      // Only include password if it's set
      if (formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save user');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user && user !== null) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E293B] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {user?.id ? 'Edit User' : 'Create User'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#37AFE1]"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#37AFE1]"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'admin' | 'editor' | 'viewer',
                })
              }
              required
              className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-1 text-xs text-slate-400">
              {formData.role === 'admin' &&
                'Full access to all features and settings'}
              {formData.role === 'editor' &&
                'Can create and edit content, but cannot manage users'}
              {formData.role === 'viewer' &&
                'Read-only access to content'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Password {user?.id && '(leave blank to keep current)'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!user?.id}
                className="w-full px-3 py-2 pr-10 bg-[#0F172A] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#37AFE1]"
                placeholder={user?.id ? 'Leave blank to keep current' : '••••••••'}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {!user?.id && (
              <p className="mt-1 text-xs text-slate-400">
                Minimum 8 characters
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {user?.id ? 'Update' : 'Create'} User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
