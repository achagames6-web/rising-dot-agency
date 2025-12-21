import ServiceEditor from '@/components/admin/ServiceEditor';

export default function EditServicePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {params.id === 'new' ? 'Create Service' : 'Edit Service'}
        </h1>
        <p className="text-slate-600 mt-1">
          {params.id === 'new' 
            ? 'Create a new service offering' 
            : 'Update service details'}
        </p>
      </div>

      <ServiceEditor serviceId={params.id === 'new' ? undefined : params.id} />
    </div>
  );
}
