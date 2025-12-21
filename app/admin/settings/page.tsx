'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, Bell, Shield, Palette, Database, Mail, Save, 
  Search, Share2, Wrench, Link, Phone, MapPin, Clock,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Github,
  RefreshCw, Download, Upload, Trash2, HardDrive, Zap
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // General Settings
  const [siteName, setSiteName] = useState('Rising Dot Agency');
  const [siteDescription, setSiteDescription] = useState('Digital Excellence Delivered');
  const [siteUrl, setSiteUrl] = useState('https://risingdot.agency');
  const [contactEmail, setContactEmail] = useState('hello@risingdot.agency');
  const [contactPhone, setContactPhone] = useState('+1 (555) 123-4567');
  const [address, setAddress] = useState('123 Digital Street, Tech City, TC 12345');
  const [timezone, setTimezone] = useState('UTC');
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  // SEO Settings
  const [metaTitle, setMetaTitle] = useState('Rising Dot Agency | Digital Excellence Delivered');
  const [metaDescription, setMetaDescription] = useState('We create stunning digital experiences that drive results. Web design, development, and digital marketing services.');
  const [metaKeywords, setMetaKeywords] = useState('web design, web development, digital marketing, SEO, branding');
  const [ogImage, setOgImage] = useState('/media/og-image.jpg');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleTagManagerId, setGoogleTagManagerId] = useState('');
  const [robotsTxt, setRobotsTxt] = useState('User-agent: *\nAllow: /');

  // Social Media Settings
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/risingdot');
  const [twitterUrl, setTwitterUrl] = useState('https://twitter.com/risingdot');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/risingdot');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/company/risingdot');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('https://github.com/risingdot');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newContactNotify, setNewContactNotify] = useState(true);
  const [newProjectNotify, setNewProjectNotify] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [slackIntegration, setSlackIntegration] = useState(false);
  const [slackWebhook, setSlackWebhook] = useState('');

  // Appearance Settings
  const [primaryColor, setPrimaryColor] = useState('#37AFE1');
  const [accentColor, setAccentColor] = useState('#F58122');
  const [darkMode, setDarkMode] = useState(true);
  const [logoUrl, setLogoUrl] = useState('/media/logo.png');
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
  const [fontFamily, setFontFamily] = useState('Inter');

  // Integrations
  const [resendApiKey, setResendApiKey] = useState('');
  const [stripePublicKey, setStripePublicKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState('');
  const [cloudinaryApiKey, setCloudinaryApiKey] = useState('');

  // Maintenance
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('We are currently performing scheduled maintenance. Please check back soon.');

  // Load settings from database on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          
          // Load social links
          if (data.social_links) {
            setFacebookUrl(data.social_links.facebook || '');
            setTwitterUrl(data.social_links.twitter || '');
            setInstagramUrl(data.social_links.instagram || '');
            setLinkedinUrl(data.social_links.linkedin || '');
            setYoutubeUrl(data.social_links.youtube || '');
            setGithubUrl(data.social_links.github || '');
          }
          
          // Load general settings
          if (data.general) {
            setSiteName(data.general.siteName || 'Rising Dot Agency');
            setSiteDescription(data.general.siteDescription || 'Digital Excellence Delivered');
            setSiteUrl(data.general.siteUrl || 'https://risingdot.agency');
            setContactEmail(data.general.contactEmail || 'hello@risingdot.agency');
            setContactPhone(data.general.contactPhone || '+1 (555) 123-4567');
            setAddress(data.general.address || '123 Digital Street, Tech City, TC 12345');
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save social links
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'social_links',
          value: {
            facebook: facebookUrl,
            twitter: twitterUrl,
            instagram: instagramUrl,
            linkedin: linkedinUrl,
            youtube: youtubeUrl,
            github: githubUrl,
          }
        })
      });

      // Save general settings
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'general',
          value: {
            siteName,
            siteDescription,
            siteUrl,
            contactEmail,
            contactPhone,
            address,
          }
        })
      });

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  ];

  return (
    <div className="min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Configure your dashboard preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mb-6 p-4 rounded-lg bg-[#1E293B] border border-slate-700/50 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
          <span className="text-slate-400">Loading settings...</span>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex justify-between items-center ${
          message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="text-xl leading-none">&times;</button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#37AFE1] text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Site Name</label>
                      <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Site URL</label>
                      <input
                        type="url"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Site Description</label>
                    <textarea
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Business Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Asia/Dubai">Dubai</option>
                        <option value="Australia/Sydney">Sydney</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="pt">Portuguese</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Date Format</label>
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">SEO Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                    <p className="text-xs text-slate-500 mt-1">{metaTitle.length}/60 characters recommended</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Meta Description</label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                    <p className="text-xs text-slate-500 mt-1">{metaDescription.length}/160 characters recommended</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Meta Keywords</label>
                    <input
                      type="text"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Open Graph Image URL</label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="/media/og-image.jpg"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                    <p className="text-xs text-slate-500 mt-1">Recommended size: 1200x630 pixels</p>
                  </div>

                  {/* Google Tools Section */}
                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-medium text-white mb-4">Google Tools Integration</h3>
                    
                    {/* Google Analytics */}
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <Search className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Google Analytics 4</p>
                          <p className="text-xs text-slate-400">Track website traffic and user behavior</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Measurement ID</label>
                        <input
                          type="text"
                          value={googleAnalyticsId}
                          onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                          placeholder="G-XXXXXXXXXX"
                          className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          <span className="text-[#37AFE1]">How to get:</span> Go to{' '}
                          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-[#37AFE1] hover:underline">
                            analytics.google.com
                          </a>
                          {' → Admin → Data Streams → Select your stream → Copy Measurement ID'}
                        </p>
                      </div>
                    </div>

                    {/* Google Search Console */}
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Google Search Console</p>
                          <p className="text-xs text-slate-400">Monitor search performance and indexing</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-[#1E293B] rounded-lg">
                          <p className="text-sm text-slate-300 mb-2">To connect your site to Google Search Console:</p>
                          <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside">
                            <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-[#37AFE1] hover:underline">search.google.com/search-console</a></li>
                            <li>Click "Add Property" and enter your site URL</li>
                            <li>Choose "HTML tag" verification method</li>
                            <li>Copy the meta tag content value and paste below</li>
                            <li>Click "Verify" in Search Console</li>
                          </ol>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Verification Code</label>
                          <input
                            type="text"
                            placeholder="Enter verification code from meta tag"
                            className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Google Tag Manager */}
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Google Tag Manager</p>
                          <p className="text-xs text-slate-400">Manage all your tracking tags in one place</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Container ID</label>
                        <input
                          type="text"
                          value={googleTagManagerId}
                          onChange={(e) => setGoogleTagManagerId(e.target.value)}
                          placeholder="GTM-XXXXXXX"
                          className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          <span className="text-[#37AFE1]">How to get:</span> Go to{' '}
                          <a href="https://tagmanager.google.com" target="_blank" rel="noopener noreferrer" className="text-[#37AFE1] hover:underline">
                            tagmanager.google.com
                          </a>
                          {' → Create/Select container → Copy Container ID from top right'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Robots.txt Content</label>
                    <textarea
                      value={robotsTxt}
                      onChange={(e) => setRobotsTxt(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>

                  {/* Additional SEO Tools */}
                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-medium text-white mb-4">Additional SEO Tools</h3>
                    
                    {/* Sitemap */}
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">XML Sitemap</p>
                            <p className="text-xs text-slate-400">Auto-generated sitemap for search engines</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Active</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={`${siteUrl}/sitemap.xml`}
                          readOnly
                          className="flex-1 px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-slate-400 text-sm"
                        />
                        <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                          Regenerate
                        </button>
                      </div>
                    </div>

                    {/* Structured Data */}
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Structured Data (Schema.org)</p>
                          <p className="text-xs text-slate-400">Rich snippets for better search results</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                          <span className="text-sm text-slate-300">Organization schema</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                          <span className="text-sm text-slate-300">Local business schema</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                          <span className="text-sm text-slate-300">Breadcrumb schema</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                          <span className="text-sm text-slate-300">FAQ schema</span>
                        </label>
                      </div>
                    </div>

                    {/* Social Preview */}
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700 mb-4">
                      <p className="text-white font-medium mb-3">Social Media Preview</p>
                      <div className="bg-[#1E293B] rounded-lg overflow-hidden">
                        <div className="h-32 bg-gradient-to-br from-[#37AFE1]/20 to-[#F58122]/20 flex items-center justify-center">
                          <span className="text-slate-500 text-sm">OG Image Preview</span>
                        </div>
                        <div className="p-3">
                          <p className="text-white font-medium text-sm truncate">{metaTitle || 'Page Title'}</p>
                          <p className="text-slate-400 text-xs mt-1 line-clamp-2">{metaDescription || 'Page description will appear here...'}</p>
                          <p className="text-[#37AFE1] text-xs mt-1">{siteUrl}</p>
                        </div>
                      </div>
                    </div>

                    {/* Canonical URL */}
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <Link className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Canonical URL Settings</p>
                          <p className="text-xs text-slate-400">Prevent duplicate content issues</p>
                        </div>
                      </div>
                      <label className="flex items-center gap-3 mb-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                        <span className="text-sm text-slate-300">Auto-generate canonical URLs</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                        <span className="text-sm text-slate-300">Force trailing slash</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Social Media Links</h2>
                
                {/* Info Box */}
                <div className="p-4 bg-[#37AFE1]/10 border border-[#37AFE1]/30 rounded-lg">
                  <p className="text-[#37AFE1] font-medium mb-1">✓ Frontend Integration Active</p>
                  <p className="text-sm text-slate-300">
                    These social media links are automatically displayed in the website footer, contact page, about page, and other sections. 
                    Save your changes to update the links across the entire site instantly.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      <Facebook className="w-4 h-4 inline mr-2 text-blue-500" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      <Twitter className="w-4 h-4 inline mr-2 text-sky-400" />
                      Twitter / X
                    </label>
                    <input
                      type="url"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://twitter.com/yourhandle"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      <Instagram className="w-4 h-4 inline mr-2 text-pink-500" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/yourhandle"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      <Linkedin className="w-4 h-4 inline mr-2 text-blue-600" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      <Youtube className="w-4 h-4 inline mr-2 text-red-500" />
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      <Github className="w-4 h-4 inline mr-2 text-slate-300" />
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/yourorg"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>

                  {/* Additional Social Platforms */}
                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-medium text-white mb-4">Additional Platforms</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">TikTok</label>
                        <input
                          type="url"
                          placeholder="https://tiktok.com/@yourhandle"
                          className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Pinterest</label>
                        <input
                          type="url"
                          placeholder="https://pinterest.com/yourprofile"
                          className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Dribbble</label>
                        <input
                          type="url"
                          placeholder="https://dribbble.com/yourprofile"
                          className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Behance</label>
                        <input
                          type="url"
                          placeholder="https://behance.net/yourprofile"
                          className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-sm text-slate-400">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div>
                      <p className="text-white font-medium">Browser Notifications</p>
                      <p className="text-sm text-slate-400">Show desktop notifications in browser</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={browserNotifications}
                      onChange={(e) => setBrowserNotifications(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div>
                      <p className="text-white font-medium">New Contact Submissions</p>
                      <p className="text-sm text-slate-400">Get notified when someone submits a contact form</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={newContactNotify}
                      onChange={(e) => setNewContactNotify(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div>
                      <p className="text-white font-medium">New Project Updates</p>
                      <p className="text-sm text-slate-400">Get notified about project changes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={newProjectNotify}
                      onChange={(e) => setNewProjectNotify(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div>
                      <p className="text-white font-medium">Weekly Report</p>
                      <p className="text-sm text-slate-400">Receive a weekly summary of activity</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={weeklyReport}
                      onChange={(e) => setWeeklyReport(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                    />
                  </label>
                  
                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-medium text-white mb-4">Slack Integration</h3>
                    
                    {/* Slack Info Box */}
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                        </svg>
                        <p className="text-purple-400 font-medium">What is Slack Integration?</p>
                      </div>
                      <p className="text-sm text-slate-300">
                        Get instant notifications in your Slack workspace when someone submits a contact form, 
                        a new project is added, or other important events occur on your website.
                      </p>
                    </div>

                    <label className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-700 mb-4">
                      <div>
                        <p className="text-white font-medium">Enable Slack Notifications</p>
                        <p className="text-sm text-slate-400">Send notifications to a Slack channel</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={slackIntegration}
                        onChange={(e) => setSlackIntegration(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                      />
                    </label>
                    
                    {slackIntegration && (
                      <div className="space-y-4">
                        {/* Setup Guide */}
                        <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                          <p className="text-white font-medium mb-3">How to Create a Slack Webhook</p>
                          <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
                            <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-[#37AFE1] hover:underline">api.slack.com/apps</a></li>
                            <li>Click "Create New App" → "From scratch"</li>
                            <li>Name your app (e.g., "Rising Dot Notifications") and select your workspace</li>
                            <li>In the left sidebar, click "Incoming Webhooks"</li>
                            <li>Toggle "Activate Incoming Webhooks" to ON</li>
                            <li>Click "Add New Webhook to Workspace"</li>
                            <li>Select the channel where you want notifications (e.g., #website-alerts)</li>
                            <li>Copy the Webhook URL and paste it below</li>
                          </ol>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Slack Webhook URL</label>
                          <input
                            type="url"
                            value={slackWebhook}
                            onChange={(e) => setSlackWebhook(e.target.value)}
                            placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                            className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                          />
                          <p className="text-xs text-slate-500 mt-1">Your webhook URL starts with https://hooks.slack.com/services/</p>
                        </div>

                        {/* Notification Types */}
                        <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                          <p className="text-white font-medium mb-3">Notification Types</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3">
                              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                              <span className="text-sm text-slate-300">New contact form submissions</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                              <span className="text-sm text-slate-300">New project inquiries</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                              <span className="text-sm text-slate-300">Weekly analytics summary</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-[#37AFE1]" />
                              <span className="text-sm text-slate-300">Error alerts</span>
                            </label>
                          </div>
                        </div>

                        <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                          Test Slack Connection
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Appearance Settings</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Logo URL</label>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="/media/logo.png"
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Favicon URL</label>
                      <input
                        type="text"
                        value={faviconUrl}
                        onChange={(e) => setFaviconUrl(e.target.value)}
                        placeholder="/favicon.ico"
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Lato">Lato</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-12 rounded-lg border border-slate-700 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-12 h-12 rounded-lg border border-slate-700 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="flex-1 px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div>
                      <p className="text-white font-medium">Dark Mode</p>
                      <p className="text-sm text-slate-400">Use dark theme for admin dashboard</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                    />
                  </label>
                  
                  {/* Color Preview */}
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <p className="text-white font-medium mb-3">Color Preview</p>
                    <div className="flex gap-4">
                      <div className="flex-1 p-4 rounded-lg text-white text-center font-medium" style={{ backgroundColor: primaryColor }}>
                        Primary
                      </div>
                      <div className="flex-1 p-4 rounded-lg text-white text-center font-medium" style={{ backgroundColor: accentColor }}>
                        Accent
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">API Integrations</h2>
                <div className="space-y-4">
                  {/* Resend Email Integration */}
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Resend (Email Service)</p>
                          <p className="text-sm text-slate-400">Transactional email for contact forms</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Connected</span>
                    </div>
                    <div className="p-3 bg-[#1E293B] rounded-lg mb-3">
                      <p className="text-xs text-slate-400 mb-2">
                        <span className="text-[#37AFE1]">Current Status:</span> Resend is configured via environment variable (RESEND_API_KEY)
                      </p>
                      <p className="text-xs text-slate-400">
                        Emails are sent to: <span className="text-white">achagames6@gmail.com</span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">API Key (from .env)</label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value="re_••••••••••••••••••••"
                          readOnly
                          className="flex-1 px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                        />
                        <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                          Test Email
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        <span className="text-[#37AFE1]">To update:</span> Edit RESEND_API_KEY in your .env file. Get your API key from{' '}
                        <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-[#37AFE1] hover:underline">
                          resend.com/api-keys
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Stripe (Payments)</p>
                        <p className="text-sm text-slate-400">Payment processing</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Public Key</label>
                        <input
                          type="text"
                          value={stripePublicKey}
                          onChange={(e) => setStripePublicKey(e.target.value)}
                          placeholder="pk_live_xxxxxxxxxx"
                          className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Secret Key</label>
                        <input
                          type="password"
                          value={stripeSecretKey}
                          onChange={(e) => setStripeSecretKey(e.target.value)}
                          placeholder="sk_live_xxxxxxxxxx"
                          className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <HardDrive className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Cloudinary (Media)</p>
                        <p className="text-sm text-slate-400">Image and video management</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Cloud Name</label>
                        <input
                          type="text"
                          value={cloudinaryCloudName}
                          onChange={(e) => setCloudinaryCloudName(e.target.value)}
                          placeholder="your-cloud-name"
                          className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">API Key</label>
                        <input
                          type="password"
                          value={cloudinaryApiKey}
                          onChange={(e) => setCloudinaryApiKey(e.target.value)}
                          placeholder="xxxxxxxxxx"
                          className="w-full px-4 py-2 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-400">Add an extra layer of security</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Enabled</span>
                    </div>
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                      Manage 2FA
                    </button>
                  </div>
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <p className="text-white font-medium mb-2">Change Password</p>
                    <p className="text-sm text-slate-400 mb-4">Update your account password</p>
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                      Change Password
                    </button>
                  </div>
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <p className="text-white font-medium mb-2">Active Sessions</p>
                    <p className="text-sm text-slate-400 mb-4">Manage your active login sessions</p>
                    <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                      Sign Out All Devices
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Email Settings (SMTP)</h2>
                
                {/* Info Box */}
                <div className="p-4 bg-[#37AFE1]/10 border border-[#37AFE1]/30 rounded-lg">
                  <p className="text-[#37AFE1] font-medium mb-2">When to use SMTP?</p>
                  <p className="text-sm text-slate-300">
                    SMTP is an alternative to Resend for sending emails. Use SMTP if you want to send emails through your own email provider 
                    (Gmail, Outlook, custom domain email). This is useful for newsletters, marketing emails, or if you prefer using your existing email infrastructure.
                  </p>
                </div>

                {/* Current Email Service */}
                <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">Current Email Service</p>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Resend API</span>
                  </div>
                  <p className="text-sm text-slate-400">Your site is currently using Resend for transactional emails. Configure SMTP below as a backup or alternative.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">SMTP Host</label>
                    <input
                      type="text"
                      placeholder="smtp.gmail.com or smtp.office365.com"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                    <p className="text-xs text-slate-500 mt-1">Common hosts: smtp.gmail.com, smtp.office365.com, smtp.mail.yahoo.com</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">SMTP Port</label>
                      <input
                        type="text"
                        placeholder="587"
                        className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                      />
                      <p className="text-xs text-slate-500 mt-1">587 (TLS) or 465 (SSL)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Encryption</label>
                      <select className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]">
                        <option value="tls">TLS (Recommended)</option>
                        <option value="ssl">SSL</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">SMTP Username</label>
                    <input
                      type="text"
                      placeholder="your-email@gmail.com"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">SMTP Password / App Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                    <p className="text-xs text-slate-500 mt-1">For Gmail: Use an App Password (not your regular password). Enable 2FA first, then create at myaccount.google.com/apppasswords</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">From Email Address</label>
                    <input
                      type="email"
                      placeholder="noreply@yourdomain.com"
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors">
                      Save SMTP Settings
                    </button>
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                      Send Test Email
                    </button>
                  </div>
                </div>

                {/* Gmail Setup Guide */}
                <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                  <p className="text-white font-medium mb-3">Gmail SMTP Quick Setup</p>
                  <div className="text-sm text-slate-400 space-y-2">
                    <p>1. Enable 2-Factor Authentication on your Google account</p>
                    <p>2. Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-[#37AFE1] hover:underline">myaccount.google.com/apppasswords</a></p>
                    <p>3. Create a new App Password for "Mail"</p>
                    <p>4. Use these settings: Host: smtp.gmail.com, Port: 587, Encryption: TLS</p>
                    <p>5. Username: your Gmail address, Password: the 16-character app password</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Database Settings</h2>
                <div className="space-y-4">
                  {/* Connection Status */}
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Database Status</p>
                          <p className="text-sm text-slate-400">MongoDB Atlas - rising-dot cluster</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Connected</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700">
                      <div>
                        <p className="text-xs text-slate-500">Connection String</p>
                        <p className="text-sm text-slate-300 font-mono">mongodb+srv://***@cluster0.xxxxx.mongodb.net</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Database Name</p>
                        <p className="text-sm text-slate-300 font-mono">risingdot</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-sm">Total Documents</p>
                      <p className="text-2xl font-bold text-white">1,234</p>
                    </div>
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-sm">Storage Used</p>
                      <p className="text-2xl font-bold text-white">45.2 MB</p>
                    </div>
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-sm">Collections</p>
                      <p className="text-2xl font-bold text-white">12</p>
                    </div>
                    <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                      <p className="text-slate-400 text-sm">Indexes</p>
                      <p className="text-2xl font-bold text-white">24</p>
                    </div>
                  </div>

                  {/* Collections Overview */}
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <p className="text-white font-medium mb-3">Collections Overview</p>
                    <div className="space-y-2">
                      {[
                        { name: 'contacts', docs: 156, size: '2.3 MB' },
                        { name: 'projects', docs: 24, size: '8.1 MB' },
                        { name: 'blogs', docs: 45, size: '12.4 MB' },
                        { name: 'team', docs: 8, size: '1.2 MB' },
                        { name: 'testimonials', docs: 12, size: '0.8 MB' },
                        { name: 'services', docs: 6, size: '0.5 MB' },
                        { name: 'settings', docs: 15, size: '0.1 MB' },
                        { name: 'users', docs: 3, size: '0.2 MB' },
                      ].map((col) => (
                        <div key={col.name} className="flex items-center justify-between py-2 px-3 bg-[#1E293B] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#37AFE1] rounded-full" />
                            <span className="text-sm text-slate-300 font-mono">{col.name}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-xs text-slate-500">{col.docs} docs</span>
                            <span className="text-xs text-slate-500 w-16 text-right">{col.size}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Backup & Restore */}
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <p className="text-white font-medium mb-2">Backup & Restore</p>
                    <p className="text-sm text-slate-400 mb-4">Export your data as JSON or restore from a backup file</p>
                    <div className="flex gap-3 mb-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                        <Download className="w-4 h-4" />
                        Export All Data
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                        <Upload className="w-4 h-4" />
                        Import Data
                      </button>
                    </div>
                    <div className="p-3 bg-[#1E293B] rounded-lg">
                      <p className="text-xs text-slate-400">Last backup: <span className="text-slate-300">December 18, 2025 at 10:30 AM</span></p>
                    </div>
                  </div>

                  {/* Cache Management */}
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <p className="text-white font-medium mb-2">Cache Management</p>
                    <p className="text-sm text-slate-400 mb-4">Manage application cache for better performance</p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-[#1E293B] rounded-lg text-center">
                        <p className="text-lg font-bold text-white">128</p>
                        <p className="text-xs text-slate-500">Cached Items</p>
                      </div>
                      <div className="p-3 bg-[#1E293B] rounded-lg text-center">
                        <p className="text-lg font-bold text-white">2.4 MB</p>
                        <p className="text-xs text-slate-500">Cache Size</p>
                      </div>
                      <div className="p-3 bg-[#1E293B] rounded-lg text-center">
                        <p className="text-lg font-bold text-green-400">94%</p>
                        <p className="text-xs text-slate-500">Hit Rate</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Refresh Cache
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Clear All Cache
                      </button>
                    </div>
                  </div>

                  {/* Seed Data */}
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <p className="text-white font-medium mb-2">Seed Data</p>
                    <p className="text-sm text-slate-400 mb-4">Populate database with sample data for testing and development</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button className="px-4 py-2 bg-[#37AFE1]/20 text-[#37AFE1] rounded-lg hover:bg-[#37AFE1]/30 transition-colors text-sm">
                        Seed Team Members
                      </button>
                      <button className="px-4 py-2 bg-[#37AFE1]/20 text-[#37AFE1] rounded-lg hover:bg-[#37AFE1]/30 transition-colors text-sm">
                        Seed Testimonials
                      </button>
                      <button className="px-4 py-2 bg-[#37AFE1]/20 text-[#37AFE1] rounded-lg hover:bg-[#37AFE1]/30 transition-colors text-sm">
                        Seed Blog Posts
                      </button>
                      <button className="px-4 py-2 bg-[#37AFE1]/20 text-[#37AFE1] rounded-lg hover:bg-[#37AFE1]/30 transition-colors text-sm">
                        Seed Services
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                        Seed All Data
                      </button>
                      <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                        Clear All Data
                      </button>
                    </div>
                  </div>

                  {/* Database Optimization */}
                  <div className="p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <p className="text-white font-medium mb-2">Database Optimization</p>
                    <p className="text-sm text-slate-400 mb-4">Optimize database performance and clean up unused data</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-lg">
                        <div>
                          <p className="text-sm text-slate-300">Compact Collections</p>
                          <p className="text-xs text-slate-500">Reclaim disk space from deleted documents</p>
                        </div>
                        <button className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600 transition-colors">
                          Run
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-lg">
                        <div>
                          <p className="text-sm text-slate-300">Rebuild Indexes</p>
                          <p className="text-xs text-slate-500">Optimize query performance</p>
                        </div>
                        <button className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600 transition-colors">
                          Run
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-lg">
                        <div>
                          <p className="text-sm text-slate-300">Clean Orphaned Files</p>
                          <p className="text-xs text-slate-500">Remove unused media references</p>
                        </div>
                        <button className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600 transition-colors">
                          Run
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Maintenance Mode</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-slate-700">
                    <div>
                      <p className="text-white font-medium">Enable Maintenance Mode</p>
                      <p className="text-sm text-slate-400">Show maintenance page to visitors</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                    />
                  </label>

                  {maintenanceMode && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-400 font-medium flex items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        Maintenance Mode is Active
                      </p>
                      <p className="text-sm text-yellow-300/70 mt-1">
                        Your site is currently showing the maintenance page to all visitors.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Maintenance Message</label>
                    <textarea
                      value={maintenanceMessage}
                      onChange={(e) => setMaintenanceMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-medium text-white mb-4">System Health</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg border border-slate-700">
                        <span className="text-slate-300">Database Connection</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Healthy</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg border border-slate-700">
                        <span className="text-slate-300">Email Service</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Connected</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg border border-slate-700">
                        <span className="text-slate-300">Storage</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">45.2 MB / 512 MB</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg border border-slate-700">
                        <span className="text-slate-300">API Rate Limit</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Normal</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-lg font-medium text-white mb-4">Danger Zone</h3>
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 font-medium mb-2">Reset Site</p>
                      <p className="text-sm text-slate-400 mb-4">
                        This will delete all content and reset the site to its default state. This action cannot be undone.
                      </p>
                      <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                        Reset Everything
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
