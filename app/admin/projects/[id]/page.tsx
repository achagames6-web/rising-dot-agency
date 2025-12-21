import ProjectEditor from '@/components/admin/ProjectEditor';

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {params.id === 'new' ? 'Create Project' : 'Edit Project'}
        </h1>
        <p className="text-slate-600 mt-1">
          {params.id === 'new' 
            ? 'Create a new portfolio project' 
            : 'Update project details'}
        </p>
      </div>

      <ProjectEditor projectId={params.id === 'new' ? undefined : params.id} />
    </div>
  );
}
