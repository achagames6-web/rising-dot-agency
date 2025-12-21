'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Menu,
  LayoutGrid,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  TikTokIcon,
  YouTubeIcon,
  LinkedInIcon,
  TelegramIcon,
  DiscordIcon,
  PinterestIcon,
  GitHubIcon,
} from '@/components/ui/social-icons';

interface NavLink {
  href: string;
  label: string;
  enabled: boolean;
  hasDropdown?: boolean;
  order: number;
}

interface FooterColumn {
  title: string;
  links: { href: string; label: string; enabled: boolean }[];
}

interface SocialLink {
  url: string;
  enabled: boolean;
}

interface NavigationSettings {
  header: {
    logo: string;
    ctaButton: {
      label: string;
      href: string;
      enabled: boolean;
    };
    navLinks: NavLink[];
    serviceLinks: NavLink[];
  };
  footer: {
    logo: string;
    description: string;
    copyrightText: string;
    showNewsletter: boolean;
    columns: FooterColumn[];
  };
  social: {
    facebook: SocialLink;
    instagram: SocialLink;
    twitter: SocialLink;
    tiktok: SocialLink;
    youtube: SocialLink;
    linkedin: SocialLink;
    telegram: SocialLink;
    discord: SocialLink;
    pinterest: SocialLink;
    github: SocialLink;
  };
}

const defaultSettings: NavigationSettings = {
  header: {
    logo: '/logo.png',
    ctaButton: { label: 'Get Started', href: '/contact', enabled: true },
    navLinks: [
      { href: '/', label: 'Home', enabled: true, order: 0 },
      { href: '/services', label: 'Services', enabled: true, hasDropdown: true, order: 1 },
      { href: '/portfolio', label: 'Portfolio', enabled: true, order: 2 },
      { href: '/blog', label: 'Blog', enabled: true, order: 3 },
      { href: '/about', label: 'About', enabled: true, order: 4 },
      { href: '/contact', label: 'Contact', enabled: true, order: 5 },
    ],
    serviceLinks: [],
  },
  footer: {
    logo: '/logo.png',
    description: '',
    copyrightText: '© {year} Rising Dot Agency. All rights reserved.',
    showNewsletter: true,
    columns: [],
  },
  social: {
    facebook: { url: '', enabled: true },
    instagram: { url: '', enabled: true },
    twitter: { url: '', enabled: true },
    tiktok: { url: '', enabled: true },
    youtube: { url: '', enabled: true },
    linkedin: { url: '', enabled: true },
    telegram: { url: '', enabled: true },
    discord: { url: '', enabled: true },
    pinterest: { url: '', enabled: true },
    github: { url: '', enabled: true },
  },
};

// Social platforms config
const socialPlatforms = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon, color: '#1877F2', placeholder: 'https://facebook.com/...' },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon, color: '#E4405F', placeholder: 'https://instagram.com/...' },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokIcon, color: '#000000', placeholder: 'https://tiktok.com/@...' },
  { key: 'youtube', label: 'YouTube', Icon: YouTubeIcon, color: '#FF0000', placeholder: 'https://youtube.com/@...' },
  { key: 'twitter', label: 'Twitter / X', Icon: TwitterIcon, color: '#000000', placeholder: 'https://twitter.com/...' },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon, color: '#0A66C2', placeholder: 'https://linkedin.com/company/...' },
  { key: 'telegram', label: 'Telegram', Icon: TelegramIcon, color: '#0088CC', placeholder: 'https://t.me/...' },
  { key: 'discord', label: 'Discord', Icon: DiscordIcon, color: '#5865F2', placeholder: 'https://discord.gg/...' },
  { key: 'pinterest', label: 'Pinterest', Icon: PinterestIcon, color: '#E60023', placeholder: 'https://pinterest.com/...' },
  { key: 'github', label: 'GitHub', Icon: GitHubIcon, color: '#181717', placeholder: 'https://github.com/...' },
];

export default function NavigationPage() {
  const [settings, setSettings] = useState<NavigationSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'social'>('header');
  const [expandedSections, setExpandedSections] = useState<string[]>(['navLinks', 'ctaButton']);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/navigation');
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data, social: { ...defaultSettings.social, ...data?.social } });
      }
    } catch (error) {
      console.error('Error fetching navigation settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setToast({ type: 'success', message: 'Navigation settings saved successfully!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving navigation settings:', error);
      setToast({ type: 'error', message: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const addNavLink = () => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: [...prev.header.navLinks, { href: '/', label: 'New Link', enabled: true, order: prev.header.navLinks.length }],
      },
    }));
  };

  const removeNavLink = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      header: { ...prev.header, navLinks: prev.header.navLinks.filter((_, i) => i !== index) },
    }));
  };

  const updateNavLink = (index: number, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navLinks: prev.header.navLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
      },
    }));
  };

  const addServiceLink = () => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        serviceLinks: [...prev.header.serviceLinks, { href: '/services/', label: 'New Service', enabled: true, order: prev.header.serviceLinks.length }],
      },
    }));
  };

  const removeServiceLink = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      header: { ...prev.header, serviceLinks: prev.header.serviceLinks.filter((_, i) => i !== index) },
    }));
  };

  const updateServiceLink = (index: number, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        serviceLinks: prev.header.serviceLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
      },
    }));
  };

  const addFooterColumn = () => {
    setSettings((prev) => ({
      ...prev,
      footer: { ...prev.footer, columns: [...prev.footer.columns, { title: 'New Column', links: [] }] },
    }));
  };

  const removeFooterColumn = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      footer: { ...prev.footer, columns: prev.footer.columns.filter((_, i) => i !== index) },
    }));
  };

  const addFooterLink = (columnIndex: number) => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col, i) =>
          i === columnIndex ? { ...col, links: [...col.links, { href: '/', label: 'New Link', enabled: true }] } : col
        ),
      },
    }));
  };

  const removeFooterLink = (columnIndex: number, linkIndex: number) => {
    setSettings((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col, i) =>
          i === columnIndex ? { ...col, links: col.links.filter((_, li) => li !== linkIndex) } : col
        ),
      },
    }));
  };

  const updateSocialLink = (platform: string, field: 'url' | 'enabled', value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: { ...prev.social[platform as keyof typeof prev.social], [field]: value },
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Navigation Settings</h1>
          <p className="text-slate-400 mt-1">Manage header, footer, and social links</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-[#F58122] text-white rounded-lg hover:bg-[#e0741d] transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'header' ? 'bg-[#37AFE1] text-white' : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Menu className="w-4 h-4" />
          Header
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'footer' ? 'bg-[#37AFE1] text-white' : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Footer
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'social' ? 'bg-[#37AFE1] text-white' : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Globe className="w-4 h-4" />
          Social Links
        </button>
      </div>

      {/* Header Tab */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          {/* Logo Settings */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Logo</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Logo Path</label>
              <input
                type="text"
                value={settings.header.logo}
                onChange={(e) => setSettings((prev) => ({ ...prev, header: { ...prev.header, logo: e.target.value } }))}
                className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                placeholder="/logo.png"
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
            <button onClick={() => toggleSection('ctaButton')} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors">
              <h3 className="text-lg font-semibold text-white">CTA Button</h3>
              {expandedSections.includes('ctaButton') ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {expandedSections.includes('ctaButton') && (
              <div className="p-4 pt-0 space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.header.ctaButton.enabled}
                    onChange={(e) => setSettings((prev) => ({ ...prev, header: { ...prev.header, ctaButton: { ...prev.header.ctaButton, enabled: e.target.checked } } }))}
                    className="w-4 h-4 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                  />
                  <span className="text-slate-300">Show CTA Button</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Button Label</label>
                    <input
                      type="text"
                      value={settings.header.ctaButton.label}
                      onChange={(e) => setSettings((prev) => ({ ...prev, header: { ...prev.header, ctaButton: { ...prev.header.ctaButton, label: e.target.value } } }))}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Button Link</label>
                    <input
                      type="text"
                      value={settings.header.ctaButton.href}
                      onChange={(e) => setSettings((prev) => ({ ...prev, header: { ...prev.header, ctaButton: { ...prev.header.ctaButton, href: e.target.value } } }))}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
            <button onClick={() => toggleSection('navLinks')} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors">
              <h3 className="text-lg font-semibold text-white">Navigation Links</h3>
              {expandedSections.includes('navLinks') ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {expandedSections.includes('navLinks') && (
              <div className="p-4 pt-0 space-y-3">
                {settings.header.navLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-lg">
                    <GripVertical className="w-4 h-4 text-slate-500 cursor-move" />
                    <input type="text" value={link.label} onChange={(e) => updateNavLink(index, 'label', e.target.value)} className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-[#37AFE1]" placeholder="Label" />
                    <input type="text" value={link.href} onChange={(e) => updateNavLink(index, 'href', e.target.value)} className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-[#37AFE1]" placeholder="/path" />
                    <label className="flex items-center gap-1 text-xs text-slate-400">
                      <input type="checkbox" checked={link.hasDropdown || false} onChange={(e) => updateNavLink(index, 'hasDropdown', e.target.checked)} className="w-3 h-3 rounded border-slate-600" />
                      Dropdown
                    </label>
                    <button onClick={() => updateNavLink(index, 'enabled', !link.enabled)} className={`p-1.5 rounded ${link.enabled ? 'text-green-400' : 'text-slate-500'}`}>
                      {link.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => removeNavLink(index)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addNavLink} className="flex items-center gap-2 px-4 py-2 text-[#37AFE1] hover:bg-[#37AFE1]/10 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Navigation Link
                </button>
              </div>
            )}
          </div>

          {/* Service Dropdown Links */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
            <button onClick={() => toggleSection('serviceLinks')} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors">
              <h3 className="text-lg font-semibold text-white">Services Dropdown Links</h3>
              {expandedSections.includes('serviceLinks') ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            {expandedSections.includes('serviceLinks') && (
              <div className="p-4 pt-0 space-y-3">
                <p className="text-sm text-slate-400 mb-3">These links appear in the Services dropdown menu</p>
                {settings.header.serviceLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-lg">
                    <GripVertical className="w-4 h-4 text-slate-500 cursor-move" />
                    <input type="text" value={link.label} onChange={(e) => updateServiceLink(index, 'label', e.target.value)} className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-[#37AFE1]" placeholder="Service Name" />
                    <input type="text" value={link.href} onChange={(e) => updateServiceLink(index, 'href', e.target.value)} className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-[#37AFE1]" placeholder="/services/..." />
                    <button onClick={() => updateServiceLink(index, 'enabled', !link.enabled)} className={`p-1.5 rounded ${link.enabled ? 'text-green-400' : 'text-slate-500'}`}>
                      {link.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => removeServiceLink(index)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addServiceLink} className="flex items-center gap-2 px-4 py-2 text-[#37AFE1] hover:bg-[#37AFE1]/10 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Service Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Footer Logo Path</label>
              <input type="text" value={settings.footer.logo} onChange={(e) => setSettings((prev) => ({ ...prev, footer: { ...prev.footer, logo: e.target.value } }))} className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]" placeholder="/logo.png" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea value={settings.footer.description} onChange={(e) => setSettings((prev) => ({ ...prev, footer: { ...prev.footer, description: e.target.value } }))} rows={3} className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]" placeholder="Company description..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Copyright Text</label>
              <input type="text" value={settings.footer.copyrightText} onChange={(e) => setSettings((prev) => ({ ...prev, footer: { ...prev.footer, copyrightText: e.target.value } }))} className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]" placeholder="© {year} Company Name. All rights reserved." />
              <p className="text-xs text-slate-500 mt-1">Use {'{year}'} to auto-insert current year</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={settings.footer.showNewsletter} onChange={(e) => setSettings((prev) => ({ ...prev, footer: { ...prev.footer, showNewsletter: e.target.checked } }))} className="w-4 h-4 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]" />
              <span className="text-slate-300">Show Newsletter Subscription</span>
            </label>
          </div>

          {/* Footer Columns */}
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Footer Link Columns</h3>
              <button onClick={addFooterColumn} className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#37AFE1] hover:bg-[#37AFE1]/10 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                Add Column
              </button>
            </div>
            <div className="p-4 space-y-4">
              {settings.footer.columns.map((column, colIndex) => (
                <div key={colIndex} className="bg-[#0F172A] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      value={column.title}
                      onChange={(e) => {
                        const newColumns = [...settings.footer.columns];
                        newColumns[colIndex].title = e.target.value;
                        setSettings((prev) => ({ ...prev, footer: { ...prev.footer, columns: newColumns } }));
                      }}
                      className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white font-medium focus:outline-none focus:border-[#37AFE1]"
                      placeholder="Column Title"
                    />
                    <button onClick={() => removeFooterColumn(colIndex)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 ml-4">
                    {column.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const newColumns = [...settings.footer.columns];
                            newColumns[colIndex].links[linkIndex].label = e.target.value;
                            setSettings((prev) => ({ ...prev, footer: { ...prev.footer, columns: newColumns } }));
                          }}
                          className="flex-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-[#37AFE1]"
                          placeholder="Link Label"
                        />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => {
                            const newColumns = [...settings.footer.columns];
                            newColumns[colIndex].links[linkIndex].href = e.target.value;
                            setSettings((prev) => ({ ...prev, footer: { ...prev.footer, columns: newColumns } }));
                          }}
                          className="flex-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-[#37AFE1]"
                          placeholder="/path"
                        />
                        <button
                          onClick={() => {
                            const newColumns = [...settings.footer.columns];
                            newColumns[colIndex].links[linkIndex].enabled = !link.enabled;
                            setSettings((prev) => ({ ...prev, footer: { ...prev.footer, columns: newColumns } }));
                          }}
                          className={`p-1 rounded ${link.enabled ? 'text-green-400' : 'text-slate-500'}`}
                        >
                          {link.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>
                        <button onClick={() => removeFooterLink(colIndex, linkIndex)} className="p-1 text-red-400 hover:bg-red-500/20 rounded">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addFooterLink(colIndex)} className="flex items-center gap-1 px-2 py-1 text-xs text-[#37AFE1] hover:bg-[#37AFE1]/10 rounded transition-colors">
                      <Plus className="w-3 h-3" />
                      Add Link
                    </button>
                  </div>
                </div>
              ))}
              {settings.footer.columns.length === 0 && <p className="text-center text-slate-500 py-4">No footer columns. Click "Add Column" to create one.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Social Media Links</h3>
            <p className="text-sm text-slate-400 mb-6">Configure your social media links. Toggle visibility and add URLs for each platform.</p>

            <div className="space-y-4">
              {socialPlatforms.map(({ key, label, Icon, color, placeholder }) => {
                const socialData = settings.social[key as keyof typeof settings.social];
                return (
                  <div key={key} className="flex items-center gap-4 p-4 bg-[#0F172A] rounded-lg">
                    {/* Icon */}
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${color}20` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>

                    {/* Platform Name */}
                    <div className="w-28">
                      <span className="text-white font-medium">{label}</span>
                    </div>

                    {/* URL Input */}
                    <div className="flex-1">
                      <input
                        type="url"
                        value={socialData?.url || ''}
                        onChange={(e) => updateSocialLink(key, 'url', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#37AFE1]"
                        placeholder={placeholder}
                      />
                    </div>

                    {/* Show/Hide Toggle */}
                    <button
                      onClick={() => updateSocialLink(key, 'enabled', !socialData?.enabled)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        socialData?.enabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {socialData?.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span className="text-sm">{socialData?.enabled ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
            <p className="text-sm text-slate-400 mb-4">This is how your social links will appear in the footer:</p>
            <div className="flex items-center gap-3 flex-wrap">
              {socialPlatforms
                .filter(({ key }) => {
                  const data = settings.social[key as keyof typeof settings.social];
                  return data?.url && data?.enabled;
                })
                .map(({ key, label, Icon, color }) => (
                  <a
                    key={key}
                    href={settings.social[key as keyof typeof settings.social]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0F172A] border border-[#37AFE1]/30 text-[#F58122] hover:text-[#37AFE1] hover:border-[#37AFE1] transition-colors"
                    title={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              {socialPlatforms.every(({ key }) => {
                const data = settings.social[key as keyof typeof settings.social];
                return !data?.url || !data?.enabled;
              }) && <p className="text-slate-500 text-sm">No social links visible. Add URLs and enable platforms above.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
