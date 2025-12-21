'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Save, RefreshCw, AlertTriangle, CheckCircle, Search } from 'lucide-react';

interface ImageData {
  _id?: string;
  src: string;
  alt: string;
  page: string;
  hasAlt: boolean;
  updatedAt?: string;
}

export default function ImageAltManager() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'missing' | 'has'>('all');
  const [search, setSearch] = useState('');
  const [editedAlts, setEditedAlts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/seo/images');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const scanImages = async () => {
    setScanning(true);
    try {
      const res = await fetch('/api/admin/seo/images/scan', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setImages(data);
        setMessage({ type: 'success', text: `Found ${data.length} images!` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to scan images' });
    } finally {
      setScanning(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAltChange = (src: string, newAlt: string) => {
    setEditedAlts(prev => ({ ...prev, [src]: newAlt }));
  };

  const saveAltTags = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedAlts).map(([src, alt]) => ({ src, alt }));
      
      const res = await fetch('/api/admin/seo/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Alt tags saved!' });
        setEditedAlts({});
        fetchImages();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save alt tags' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredImages = images.filter(img => {
    if (filter === 'missing' && img.hasAlt) return false;
    if (filter === 'has' && !img.hasAlt) return false;
    if (search && !img.src.toLowerCase().includes(search.toLowerCase()) && !img.alt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const missingCount = images.filter(i => !i.hasAlt).length;
  const hasAltCount = images.filter(i => i.hasAlt).length;
  const hasChanges = Object.keys(editedAlts).length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <p className="text-2xl font-bold text-white">{images.length}</p>
          <p className="text-sm text-slate-400">Total Images</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-2xl font-bold text-green-400">{hasAltCount}</p>
          </div>
          <p className="text-sm text-slate-400">With Alt Text</p>
        </div>
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <p className="text-2xl font-bold text-amber-400">{missingCount}</p>
          </div>
          <p className="text-sm text-slate-400">Missing Alt Text</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'missing', 'has'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm ${filter === f ? 'bg-[#37AFE1] text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                {f === 'all' ? 'All' : f === 'missing' ? 'Missing Alt' : 'Has Alt'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={scanImages}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${scanning ? 'animate-spin' : ''}`} />
            Scan Site
          </button>
          {hasChanges && (
            <button
              onClick={saveAltTags}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Save Changes ({Object.keys(editedAlts).length})
            </button>
          )}
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
        {filteredImages.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No images found</h3>
            <p className="text-slate-400">Click "Scan Site" to find images</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredImages.map((img) => (
              <div key={img.src} className="p-4 hover:bg-slate-700/30">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={img.src}
                      alt={img.alt || 'No alt text'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {img.hasAlt ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                      <span className="text-xs text-slate-400">{img.page}</span>
                    </div>
                    <p className="text-sm text-slate-400 truncate mb-2">{img.src}</p>
                    <input
                      type="text"
                      value={editedAlts[img.src] ?? img.alt}
                      onChange={(e) => handleAltChange(img.src, e.target.value)}
                      placeholder="Enter alt text..."
                      className={`w-full px-3 py-2 bg-[#0F172A] border rounded-lg text-white text-sm ${
                        editedAlts[img.src] !== undefined ? 'border-[#37AFE1]' : 'border-slate-700'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
