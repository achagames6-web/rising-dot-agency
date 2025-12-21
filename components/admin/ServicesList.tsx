'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: number;
  slug: string;
  name: string;
  description: string;
  hero_animation: string;
  updated_at: string;
}

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.services);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      fetchServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete service');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {services.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No services yet
          </h3>
          <p className="text-slate-600 mb-4">
            Create your first service to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/services/${service.id}`}
                    className="text-[#2563EB] hover:text-[#1d4ed8] p-1"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <code className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded block mb-3">
                /{service.slug}
              </code>
              
              {service.description && (
                <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                  {service.description}
                </p>
              )}
              
              {service.hero_animation && (
                <div className="text-xs text-slate-500">
                  Animation: {service.hero_animation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
