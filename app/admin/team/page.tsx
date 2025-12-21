'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  order: number;
  published: boolean;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    order: 0,
    published: true,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMember 
        ? `/api/admin/team/${editingMember._id}` 
        : '/api/admin/team';
      const method = editingMember ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        fetchMembers();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const togglePublish = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/admin/team/${member._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !member.published }),
      });
      if (res.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      image: member.image,
      order: member.order,
      published: member.published,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      image: '',
      order: members.length,
      published: true,
    });
  };

  return (
    <div className="min-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Members</h1>
          <p className="text-slate-400 mt-1">Manage your team displayed on the website</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 bg-[#1E293B] rounded-xl border border-slate-700/50">
          <p className="text-slate-400">No team members yet. Add your first team member!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-[#1E293B] rounded-xl p-4 flex items-center gap-4 border border-slate-700/50"
            >
              <GripVertical className="w-5 h-5 text-slate-500 cursor-grab" />
              
              <div className="w-16 h-16 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">{member.name}</h3>
                <p className="text-slate-400 text-sm">{member.role}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  member.published 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-slate-600/50 text-slate-400'
                }`}>
                  {member.published ? 'Published' : 'Draft'}
                </span>
                
                <button
                  onClick={() => togglePublish(member)}
                  className={`p-2 rounded-lg transition-colors ${
                    member.published 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-slate-700 text-slate-400 hover:text-green-400'
                  }`}
                >
                  {member.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => openEditModal(member)}
                  className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-[#37AFE1] hover:text-white transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                  placeholder="e.g., CEO, Lead Developer"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Image Path</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                  placeholder="/team/member-name.png"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Add image to public/team/ folder and enter path here
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#37AFE1]"
                />
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                />
                <span className="text-slate-300">Published</span>
              </label>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#37AFE1] text-white rounded-lg hover:bg-[#37AFE1]/80 transition-colors"
                >
                  {editingMember ? 'Update' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
