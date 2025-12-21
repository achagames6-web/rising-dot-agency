'use client';

import { Play, Edit, Trash2, Copy } from 'lucide-react';
import { AnimationPreset } from './AnimationPresetLibrary';

interface PresetCardProps {
  preset: AnimationPreset;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isSelected: boolean;
}

export function PresetCard({
  preset,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  isSelected
}: PresetCardProps) {
  const typeColors = {
    scroll: 'bg-blue-100 text-blue-700',
    hover: 'bg-purple-100 text-purple-700',
    entrance: 'bg-teal-100 text-teal-700'
  };

  return (
    <div
      className={`bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
        isSelected ? 'border-[#2563EB] shadow-md' : 'border-slate-200'
      }`}
      onClick={onSelect}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{preset.name}</h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {preset.description || 'No description'}
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-medium capitalize ${
              typeColors[preset.preset_type]
            }`}
          >
            {preset.preset_type}
          </span>
        </div>

        {/* Config Preview */}
        <div className="bg-slate-50 rounded p-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-600">Duration:</span>
            <span className="font-medium text-slate-900">{preset.config.duration}ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Easing:</span>
            <span className="font-medium text-slate-900">{preset.config.easing}</span>
          </div>
          {preset.config.timeline && preset.config.timeline.length > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600">Keyframes:</span>
              <span className="font-medium text-slate-900">{preset.config.timeline.length}</span>
            </div>
          )}
          {preset.config.triggers && preset.config.triggers.length > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600">Triggers:</span>
              <span className="font-medium text-slate-900">{preset.config.triggers.length}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
