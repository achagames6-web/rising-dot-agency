'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Building, Clock, Trash2, Eye, Archive, CheckCircle } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`/api/admin/contacts?status=${filter}`);
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const statusColors = {
    new: 'bg-green-500/20 text-green-400',
    read: 'bg-[#37AFE1]/20 text-[#37AFE1]',
    replied: 'bg-purple-500/20 text-purple-400',
    archived: 'bg-slate-600/50 text-slate-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
          <p className="text-slate-400 mt-1">Manage inquiries from your contact form</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-[#37AFE1] text-white'
                : 'bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700/50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-1 bg-[#1E293B] rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No contacts found
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => {
                    setSelectedContact(contact);
                    if (contact.status === 'new') {
                      updateStatus(contact._id, 'read');
                    }
                  }}
                  className={`p-4 cursor-pointer hover:bg-slate-700/30 transition-colors ${
                    selectedContact?._id === contact._id ? 'bg-slate-700/50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{contact.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[contact.status]}`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 truncate">{contact.message}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Detail */}
        <div className="lg:col-span-2 bg-[#1E293B] rounded-xl border border-slate-700/50 p-6">
          {selectedContact ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedContact.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[selectedContact.status]}`}>
                    {selectedContact.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selectedContact._id, 'replied')}
                    className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg"
                    title="Mark as Replied"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => updateStatus(selectedContact._id, 'archived')}
                    className="p-2 text-slate-400 hover:bg-slate-700 rounded-lg"
                    title="Archive"
                  >
                    <Archive className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteContact(selectedContact._id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${selectedContact.email}`} className="hover:text-[#37AFE1]">
                    {selectedContact.email}
                  </a>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${selectedContact.phone}`} className="hover:text-[#37AFE1]">
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
                {selectedContact.company && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building className="w-4 h-4" />
                    {selectedContact.company}
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </div>
              </div>

              {selectedContact.service && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">Service Interested</h4>
                  <p className="text-white">{selectedContact.service}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-2">Message</h4>
                <div className="bg-[#0F172A] rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: Your inquiry to Rising Dot`}
                  className="px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500">
              Select a contact to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
