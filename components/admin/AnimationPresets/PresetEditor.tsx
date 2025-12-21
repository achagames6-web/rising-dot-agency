'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { AnimationPreset } from './AnimationPresetLibrary';

interface PresetEditorProps {
  preset: AnimationPreset;
  isOpen: boolean;
  onClose: () => void;
  onSave: (preset: AnimationPreset) => void;
}

export function PresetEditor({ preset, isOpen, onClose, onSave }: PresetEditorProps) {
  const [editedPreset, setEditedPreset] = useState<AnimationPreset>(preset);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedPreset);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {preset.id === 0 ? 'Create Preset' : 'Edit Preset'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preset Name
              </label>
              <input
                type="text"
                value={editedPreset.name}
                onChange={(e) =>
                  setEditedPreset({ ...editedPreset, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="Enter preset name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={editedPreset.description}
                onChange={(e) =>
                  setEditedPreset({ ...editedPreset, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                rows={3}
                placeholder="Describe this animation preset"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preset Type
              </label>
              <select
                value={editedPreset.preset_type}
                onChange={(e) =>
                  setEditedPreset({
                    ...editedPreset,
                    preset_type: e.target.value as 'scroll' | 'hover' | 'entrance'
                  })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                <option value="entrance">Entrance Effect</option>
                <option value="scroll">Scroll Effect</option>
                <option value="hover">Hover Effect</option>
              </select>
            </div>
          </div>

          {/* Animation Config */}
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900">Animation Configuration</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration (ms)
                </label>
                <input
                  type="number"
                  value={editedPreset.config.duration}
                  onChange={(e) =>
                    setEditedPreset({
                      ...editedPreset,
                      config: {
                        ...editedPreset.config,
                        duration: parseInt(e.target.value) || 0
                      }
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  min="0"
                  step="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Easing Function
                </label>
                <select
                  value={editedPreset.config.easing}
                  onChange={(e) =>
                    setEditedPreset({
                      ...editedPreset,
                      config: { ...editedPreset.config, easing: e.target.value }
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                >
                  <optgroup label="Power">
                    <option value="power1.in">Power 1 In</option>
                    <option value="power1.out">Power 1 Out</option>
                    <option value="power1.inOut">Power 1 InOut</option>
                    <option value="power2.in">Power 2 In</option>
                    <option value="power2.out">Power 2 Out</option>
                    <option value="power2.inOut">Power 2 InOut</option>
                    <option value="power3.in">Power 3 In</option>
                    <option value="power3.out">Power 3 Out</option>
                    <option value="power3.inOut">Power 3 InOut</option>
                  </optgroup>
                  <optgroup label="Back">
                    <option value="back.in">Back In</option>
                    <option value="back.out">Back Out</option>
                    <option value="back.inOut">Back InOut</option>
                    <option value="back.out(1.7)">Back Out (1.7)</option>
                  </optgroup>
                  <optgroup label="Elastic">
                    <option value="elastic.in">Elastic In</option>
                    <option value="elastic.out">Elastic Out</option>
                    <option value="elastic.inOut">Elastic InOut</option>
                  </optgroup>
                  <optgroup label="Bounce">
                    <option value="bounce.in">Bounce In</option>
                    <option value="bounce.out">Bounce Out</option>
                    <option value="bounce.inOut">Bounce InOut</option>
                  </optgroup>
                  <optgroup label="Sine">
                    <option value="sine.in">Sine In</option>
                    <option value="sine.out">Sine Out</option>
                    <option value="sine.inOut">Sine InOut</option>
                  </optgroup>
                  <optgroup label="Expo">
                    <option value="expo.in">Expo In</option>
                    <option value="expo.out">Expo Out</option>
                    <option value="expo.inOut">Expo InOut</option>
                  </optgroup>
                  <optgroup label="Circ">
                    <option value="circ.in">Circ In</option>
                    <option value="circ.out">Circ Out</option>
                    <option value="circ.inOut">Circ InOut</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Animation Properties */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Animation Properties (JSON)
              </label>
              <textarea
                value={JSON.stringify(editedPreset.config.properties, null, 2)}
                onChange={(e) => {
                  try {
                    const properties = JSON.parse(e.target.value);
                    setEditedPreset({
                      ...editedPreset,
                      config: { ...editedPreset.config, properties }
                    });
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent font-mono text-sm"
                rows={8}
                placeholder='{\n  "opacity": 1,\n  "y": 0,\n  "scale": 1\n}'
              />
              <p className="text-xs text-slate-500 mt-1">
                Common properties: opacity, x, y, scale, rotation, skewX, skewY
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Preset
          </button>
        </div>
      </div>
    </div>
  );
}
