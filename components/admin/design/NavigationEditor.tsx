'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, ChevronDown, ChevronRight, ExternalLink, Eye, EyeOff } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  target?: '_blank' | '_self';
  visible: boolean;
  children?: NavItem[];
}

interface NavigationConfig {
  header: NavItem[];
  footer: {
    columns: {
      title: string;
      links: NavItem[];
    }[];
    bottomLinks: NavItem[];
  };
}

const defaultNavigation: NavigationConfig = {
  header: [
    { id: '1', label: 'Home', href: '/', visible: true },
    { id: '2', label: 'About', href: '/about', visible: true },
    { id: '3', label: 'Services', href: '/services', visible: true, children: [
      { id: '3-1', label: 'Chatbot Development', href: '/services/chatbot', visible: true },
      { id: '3-2', label: 'SEO Services', href: '/services/seo', visible: true },
      { id: '3-3', label: 'Shopify Development', href: '/services/shopify', visible: true },
      { id: '3-4', label: 'WordPress Development', href: '/services/wordpress', visible: true },
      { id: '3-5', label: 'Web Design', href: '/services/webdesign', visible: true },
      { id: '3-6', label: 'N8N Automations', href: '/services/n8n', visible: true },
      { id: '3-7', label: 'SaaS Solutions', href: '/services/saas', visible: true },
    ]},
    { id: '4', label: 'Portfolio', href: '/portfolio', visible: true },
    { id: '5', label: 'Blog', href: '/blog', visible: true },
    { id: '6', label: 'Contact', href: '/contact', visible: true },
  ],
  footer: {
    columns: [
      {
        title: 'Services',
        links: [
          { id: 'f1', label: 'Chatbot Development', href: '/services/chatbot', visible: true },
          { id: 'f2', label: 'SEO Services', href: '/services/seo', visible: true },
          { id: 'f3', label: 'Web Design', href: '/services/webdesign', visible: true },
        ]
      },
      {
        title: 'Company',
        links: [
          { id: 'f4', label: 'About Us', href: '/about', visible: true },
          { id: 'f5', label: 'Portfolio', href: '/portfolio', visible: true },
          { id: 'f6', label: 'Contact', href: '/contact', visible: true },
        ]
      },
      {
        title: 'Resources',
        links: [
          { id: 'f7', label: 'Blog', href: '/blog', visible: true },
          { id: 'f8', label: 'Privacy Policy', href: '/privacy', visible: true },
          { id: 'f9', label: 'Terms of Service', href: '/terms', visible: true },
        ]
      }
    ],
    bottomLinks: [
      { id: 'b1', label: 'Privacy Policy', href: '/privacy', visible: true },
      { id: 'b2', label: 'Terms of Service', href: '/terms', visible: true },
    ]
  }
};

export default function NavigationEditor() {
  const [navigation, setNavigation] = useState<NavigationConfig>(defaultNavigation);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'header' | 'footer'>('header');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      const res = await fetch('/api/admin/design/navigation');
      if (res.ok) {
        const data = await res.json();
        if (data) setNavigation({ ...defaultNavigation, ...data });
      }
    } catch (error) {
      console.error('Error fetching navigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/design/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(navigation),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Navigation saved!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save navigation' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addHeaderItem = () => {
    setNavigation(prev => ({
      ...prev,
      header: [...prev.header, { id: generateId(), label: 'New Link', href: '/', visible: true }]
    }));
  };

  const updateHeaderItem = (id: string, updates: Partial<NavItem>) => {
    setNavigation(prev => ({
      ...prev,
      header: prev.header.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const deleteHeaderItem = (id: string) => {
    setNavigation(prev => ({
      ...prev,
      header: prev.header.filter(item => item.id !== id)
    }));
  };

  const addSubItem = (parentId: string) => {
    setNavigation(prev => ({
      ...prev,
      header: prev.header.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), { id: generateId(), label: 'New Sub Link', href: '/', visible: true }]
          };
        }
        return item;
      })
    }));
  };

  const updateSubItem = (parentId: string, childId: string, updates: Partial<NavItem>) => {
    setNavigation(prev => ({
      ...prev,
      header: prev.header.map(item => {
        if (item.id === parentId && item.children) {
          return {
            ...item,
            children: item.children.map(child =>
              child.id === childId ? { ...child, ...updates } : child
            )
          };
        }
        return item;
      })
    }));
  };

  const deleteSubItem = (parentId: string, childId: string) => {
    setNavigation(prev => ({
      ...prev,
      header: prev.header.map(item => {
        if (item.id === parentId && item.children) {
          return {
            ...item,
            children: item.children.filter(child => child.id !== childId)
          };
        }
        return item;
      })
    }));
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const updateFooterColumn = (colIndex: number, title: string) => {
    setNavigation(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col, i) =>
          i === colIndex ? { ...col, title } : col
        )
      }
    }));
  };

  const updateFooterLink = (colIndex: number, linkId: string, updates: Partial<NavItem>) => {
    setNavigation(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col, i) =>
          i === colIndex ? {
            ...col,
            links: col.links.map(link =>
              link.id === linkId ? { ...link, ...updates } : link
            )
          } : col
        )
      }
    }));
  };

  const addFooterLink = (colIndex: number) => {
    setNavigation(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col, i) =>
          i === colIndex ? {
            ...col,
            links: [...col.links, { id: generateId(), label: 'New Link', href: '/', visible: true }]
          } : col
        )
      }
    }));
  };

  const deleteFooterLink = (colIndex: number, linkId: string) => {
    setNavigation(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        columns: prev.footer.columns.map((col, i) =>
          i === colIndex ? {
            ...col,
            links: col.links.filter(link => link.id !== linkId)
          } : col
        )
      }
    }));
  };

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

      {/* Section Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('header')}
            className={`px-4 py-2 rounded-lg font-medium ${activeSection === 'header' ? 'bg-[#37AFE1] text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            Header Navigation
          </button>
          <button
            onClick={() => setActiveSection('footer')}
            className={`px-4 py-2 rounded-lg font-medium ${activeSection === 'footer' ? 'bg-[#37AFE1] text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            Footer Navigation
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {activeSection === 'header' ? (
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Header Menu Items</h3>
            <button
              onClick={addHeaderItem}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {navigation.header.map((item) => (
              <div key={item.id} className="bg-[#0F172A] rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-slate-500 cursor-move" />
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateHeaderItem(item.id, { label: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => updateHeaderItem(item.id, { href: e.target.value })}
                    className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm font-mono"
                    placeholder="/path"
                  />
                  <button
                    onClick={() => updateHeaderItem(item.id, { visible: !item.visible })}
                    className={`p-1.5 rounded ${item.visible ? 'text-green-400' : 'text-slate-500'}`}
                  >
                    {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  {item.children && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      {expandedItems.includes(item.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => addSubItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-[#37AFE1]"
                    title="Add submenu"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHeaderItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.children && expandedItems.includes(item.id) && (
                  <div className="mt-3 ml-8 space-y-2 border-l-2 border-slate-700 pl-4">
                    {item.children.map((child) => (
                      <div key={child.id} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={child.label}
                          onChange={(e) => updateSubItem(item.id, child.id, { label: e.target.value })}
                          className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={child.href}
                          onChange={(e) => updateSubItem(item.id, child.id, { href: e.target.value })}
                          className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm font-mono"
                          placeholder="/path"
                        />
                        <button
                          onClick={() => updateSubItem(item.id, child.id, { visible: !child.visible })}
                          className={`p-1.5 rounded ${child.visible ? 'text-green-400' : 'text-slate-500'}`}
                        >
                          {child.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteSubItem(item.id, child.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {navigation.footer.columns.map((column, colIndex) => (
            <div key={colIndex} className="bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
              <input
                type="text"
                value={column.title}
                onChange={(e) => updateFooterColumn(colIndex, e.target.value)}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white font-semibold mb-4"
                placeholder="Column Title"
              />
              <div className="space-y-2">
                {column.links.map((link) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateFooterLink(colIndex, link.id, { label: e.target.value })}
                      className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateFooterLink(colIndex, link.id, { href: e.target.value })}
                      className="flex-1 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm font-mono"
                      placeholder="/path"
                    />
                    <button
                      onClick={() => deleteFooterLink(colIndex, link.id)}
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addFooterLink(colIndex)}
                className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
