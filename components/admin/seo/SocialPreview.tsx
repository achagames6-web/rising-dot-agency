'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Facebook, Twitter, Linkedin, Globe } from 'lucide-react';

interface PageMeta {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export default function SocialPreview() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const siteDomain = siteUrl.replace(/^https?:\/\//, '');
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [previewType, setPreviewType] = useState<'facebook' | 'twitter' | 'linkedin' | 'google'>('facebook');

  const defaultPages = [
    { path: '/', label: 'Homepage' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
    { path: '/blog', label: 'Blog' },
  ];

  useEffect(() => {
    fetchMetaTags();
  }, []);

  const fetchMetaTags = async () => {
    try {
      const res = await fetch('/api/admin/seo/meta');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching meta tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentMeta = pages.find(p => p.path === selectedPage) || {
    path: selectedPage,
    title: 'Your Site',
    description: 'Your site description',
    ogTitle: '',
    ogDescription: '',
    ogImage: '/og-image.jpg',
  };

  const displayTitle = currentMeta.ogTitle || currentMeta.title;
  const displayDescription = currentMeta.ogDescription || currentMeta.description;
  const displayImage = currentMeta.ogImage || '/og-image.jpg';
  const displayUrl = `${siteDomain}${selectedPage}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page & Platform Selector */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Select Page</label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white"
          >
            {defaultPages.map(p => (
              <option key={p.path} value={p.path}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
          <div className="flex gap-2">
            {[
              { id: 'facebook', icon: Facebook, color: '#1877F2' },
              { id: 'twitter', icon: Twitter, color: '#1DA1F2' },
              { id: 'linkedin', icon: Linkedin, color: '#0A66C2' },
              { id: 'google', icon: Globe, color: '#4285F4' },
            ].map(({ id, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setPreviewType(id as any)}
                className={`p-3 rounded-lg transition-colors ${
                  previewType === id
                    ? 'bg-slate-700 ring-2 ring-[#37AFE1]'
                    : 'bg-[#1E293B] hover:bg-slate-700'
                }`}
                style={{ color: previewType === id ? color : '#94a3b8' }}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-white font-semibold mb-4 capitalize">{previewType} Preview</h3>
        
        {previewType === 'facebook' && (
          <div className="max-w-lg bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-[1.91/1] bg-slate-200 relative">
              {displayImage && (
                <img 
                  src={displayImage} 
                  alt="OG Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-og.jpg';
                  }}
                />
              )}
            </div>
            <div className="p-3 border-t">
              <p className="text-xs text-gray-500 uppercase">{displayUrl}</p>
              <p className="text-[#1d2129] font-semibold mt-1 line-clamp-2">{displayTitle}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{displayDescription}</p>
            </div>
          </div>
        )}

        {previewType === 'twitter' && (
          <div className="max-w-lg bg-white rounded-2xl overflow-hidden border border-gray-200">
            <div className="aspect-[2/1] bg-slate-200 relative">
              {displayImage && (
                <img 
                  src={displayImage} 
                  alt="Twitter Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-og.jpg';
                  }}
                />
              )}
            </div>
            <div className="p-3">
              <p className="text-[#0f1419] font-bold line-clamp-2">{displayTitle}</p>
              <p className="text-sm text-[#536471] mt-1 line-clamp-2">{displayDescription}</p>
              <p className="text-sm text-[#536471] mt-2 flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {displayUrl}
              </p>
            </div>
          </div>
        )}

        {previewType === 'linkedin' && (
          <div className="max-w-lg bg-white rounded-lg overflow-hidden border border-gray-300">
            <div className="aspect-[1.91/1] bg-slate-200 relative">
              {displayImage && (
                <img 
                  src={displayImage} 
                  alt="LinkedIn Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-og.jpg';
                  }}
                />
              )}
            </div>
            <div className="p-3 bg-[#f3f2ef]">
              <p className="text-[#000000e6] font-semibold line-clamp-2">{displayTitle}</p>
              <p className="text-xs text-[#00000099] mt-1">{displayUrl}</p>
            </div>
          </div>
        )}

        {previewType === 'google' && (
          <div className="max-w-2xl bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <img src="/favicon.ico" alt="" className="w-7 h-7 rounded-full" />
              <div>
                <p className="text-sm text-[#202124]">Rising Dot Agency</p>
                <p className="text-xs text-[#4d5156]">https://{displayUrl}</p>
              </div>
            </div>
            <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer mb-1">
              {displayTitle}
            </h3>
            <p className="text-sm text-[#4d5156] line-clamp-2">{displayDescription}</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-white font-semibold mb-4">Optimization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-[#0F172A] rounded-lg">
            <p className="text-[#37AFE1] font-medium mb-1">OG Image</p>
            <p className="text-slate-400">Recommended size: 1200x630px for best display across platforms</p>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-lg">
            <p className="text-[#37AFE1] font-medium mb-1">Title Length</p>
            <p className="text-slate-400">Keep under 60 characters for Google, 70 for social media</p>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-lg">
            <p className="text-[#37AFE1] font-medium mb-1">Description</p>
            <p className="text-slate-400">150-160 characters for Google, up to 200 for social</p>
          </div>
          <div className="p-3 bg-[#0F172A] rounded-lg">
            <p className="text-[#37AFE1] font-medium mb-1">Test Your Links</p>
            <p className="text-slate-400">Use Facebook Debugger and Twitter Card Validator to test</p>
          </div>
        </div>
      </div>
    </div>
  );
}
