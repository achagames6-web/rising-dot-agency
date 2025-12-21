'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Home, Info, FolderOpen, Bot, Search as SearchIcon, ShoppingBag, Code, Palette, Workflow, RefreshCw, Save } from 'lucide-react';

interface PageSection {
  _id: string;
  page: string;
  section: string;
  content: Record<string, any>;
  updatedAt: string;
}

// Page structure for display
const pages = [
  { id: 'home', label: 'Homepage', icon: Home, description: 'Main landing page with hero, services, testimonials', sections: 13 },
  { id: 'about', label: 'About Page', icon: Info, description: 'Company info, team, timeline, skills', sections: 7 },
  { id: 'portfolio', label: 'Portfolio Page', icon: FolderOpen, description: 'Projects, case studies, featured work', sections: 6 },
  { id: 'contact', label: 'Contact Page', icon: FileText, description: 'Contact form, info, map, social links', sections: 5 },
  { id: 'blog', label: 'Blog Page', icon: FileText, description: 'Blog listing page settings', sections: 2 },
];

const servicePages = [
  { id: 'services-chatbot', label: 'Chatbot Development', icon: Bot, description: 'AI chatbot service page', sections: 7 },
  { id: 'services-seo', label: 'SEO Services', icon: SearchIcon, description: 'Search engine optimization page', sections: 8 },
  { id: 'services-shopify', label: 'Shopify Services', icon: ShoppingBag, description: 'E-commerce development page', sections: 8 },
  { id: 'services-wordpress', label: 'WordPress Services', icon: Code, description: 'WordPress development page', sections: 7 },
  { id: 'services-webdesign', label: 'Web Design', icon: Palette, description: 'Web design service page', sections: 8 },
  { id: 'services-n8n', label: 'N8N Automations', icon: Workflow, description: 'Workflow automation page', sections: 8 },
];

export default function PagesAdminPage() {
  const [content, setContent] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      setContent(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedContent = async () => {
    setLoading(true);
    try {
      await fetch('/api/seed/all');
      setMessage({ type: 'success', text: 'All content seeded successfully!' });
      await fetchContent();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to seed content' });
    } finally {
      setLoading(false);
    }
  };

  const getConfiguredSections = (pageId: string) => {
    return content.filter(c => c.page === pageId).length;
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Page Content</h1>
          <p className="text-slate-400 mt-1">Manage content for all website pages</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchContent}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          {content.length === 0 && (
            <button
              onClick={seedContent}
              className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors"
            >
              <Save className="w-4 h-4" />
              Seed All Content
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex justify-between items-center ${
          message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="text-xl leading-none">&times;</button>
        </div>
      )}

      {/* Main Pages */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Main Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => {
            const Icon = page.icon;
            const configured = getConfiguredSections(page.id);
            
            return (
              <Link
                key={page.id}
                href={`/admin/pages/${page.id}`}
                className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/50 hover:border-[#37AFE1]/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-700 rounded-lg group-hover:bg-[#37AFE1]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#37AFE1]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold group-hover:text-[#37AFE1] transition-colors">{page.label}</h3>
                    <p className="text-slate-400 text-sm mt-1">{page.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs px-2 py-1 bg-[#37AFE1]/20 text-[#37AFE1] rounded">
                        {page.sections} sections
                      </span>
                      {configured > 0 && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          {configured} configured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Service Pages */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Service Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicePages.map((page) => {
            const Icon = page.icon;
            const configured = getConfiguredSections(page.id);
            
            return (
              <Link
                key={page.id}
                href={`/admin/pages/${page.id}`}
                className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/50 hover:border-[#37AFE1]/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-700 rounded-lg group-hover:bg-[#37AFE1]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#37AFE1]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold group-hover:text-[#37AFE1] transition-colors">{page.label}</h3>
                    <p className="text-slate-400 text-sm mt-1">{page.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs px-2 py-1 bg-[#37AFE1]/20 text-[#37AFE1] rounded">
                        {page.sections} sections
                      </span>
                      {configured > 0 && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          {configured} configured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
