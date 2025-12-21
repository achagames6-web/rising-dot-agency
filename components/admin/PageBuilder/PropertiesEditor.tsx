'use client';

import { useState, useEffect } from 'react';
import type { PlacedComponent } from './GridCanvas';

interface PropertiesEditorProps {
  selectedComponent: PlacedComponent | null;
  onUpdate: (id: string, updates: Partial<PlacedComponent>) => void;
  onDelete: (id: string) => void;
}

export default function PropertiesEditor({
  selectedComponent,
  onUpdate,
  onDelete,
}: PropertiesEditorProps) {
  const [localProps, setLocalProps] = useState<Record<string, any>>({});

  useEffect(() => {
    if (selectedComponent) {
      setLocalProps(selectedComponent.props);
    }
  }, [selectedComponent]);

  if (!selectedComponent) {
    return (
      <div className="w-80 border-l border-slate-700 bg-[#1E293B] p-4">
        <div className="py-20 text-center text-slate-400">
          <p className="mb-2 text-lg">No component selected</p>
          <p className="text-sm">Click on a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);
    onUpdate(selectedComponent.id, { props: newProps });
  };

  const handleGridChange = (
    field: 'gridColumn' | 'gridRow' | 'gridColumnSpan',
    value: number
  ) => {
    onUpdate(selectedComponent.id, { [field]: value });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this component?')) {
      onDelete(selectedComponent.id);
    }
  };

  return (
    <div className="flex w-80 flex-col border-l border-slate-700 bg-[#1E293B]">
      {/* Header */}
      <div className="border-b border-slate-700 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Properties</h2>
          <button
            onClick={handleDelete}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {selectedComponent.componentDef.icon}
          </span>
          <span className="font-medium text-white">
            {selectedComponent.componentDef.name}
          </span>
        </div>
      </div>

      {/* Properties Form */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Grid Position */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Grid Position</h3>

          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Column (1-12)
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={selectedComponent.gridColumn}
              onChange={(e) =>
                handleGridChange('gridColumn', parseInt(e.target.value))
              }
              className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-400">Row</label>
            <input
              type="number"
              min="1"
              value={selectedComponent.gridRow}
              onChange={(e) =>
                handleGridChange('gridRow', parseInt(e.target.value))
              }
              className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Column Span (1-12)
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={selectedComponent.gridColumnSpan}
              onChange={(e) =>
                handleGridChange('gridColumnSpan', parseInt(e.target.value))
              }
              className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-[#2563EB] focus:outline-none"
            />
          </div>
        </div>

        {/* Component Properties */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">
            Component Properties
          </h3>

          {Object.entries(localProps).map(([key, value]) => (
            <div key={key}>
              <label className="mb-1 block text-xs capitalize text-slate-400">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>

              {typeof value === 'boolean' ? (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handlePropChange(key, e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-slate-300">Enabled</span>
                </label>
              ) : typeof value === 'number' ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    handlePropChange(key, parseFloat(e.target.value))
                  }
                  className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-[#2563EB] focus:outline-none"
                />
              ) : Array.isArray(value) ? (
                <textarea
                  value={JSON.stringify(value, null, 2)}
                  onChange={(e) => {
                    try {
                      handlePropChange(key, JSON.parse(e.target.value));
                    } catch (err) {
                      // Invalid JSON, don't update
                    }
                  }}
                  rows={4}
                  className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 font-mono text-xs text-white focus:border-[#2563EB] focus:outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handlePropChange(key, e.target.value)}
                  className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-[#2563EB] focus:outline-none"
                />
              )}
            </div>
          ))}

          {Object.keys(localProps).length === 0 && (
            <p className="text-sm text-slate-400">No properties available</p>
          )}
        </div>
      </div>
    </div>
  );
}
