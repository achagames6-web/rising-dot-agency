'use client';

import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { AnimationPreset, ConditionConfig } from './AnimationPresetLibrary';

interface ConditionBuilderProps {
  preset: AnimationPreset;
  onChange: (preset: AnimationPreset) => void;
  onSave: (preset: AnimationPreset) => void;
}

const CONDITION_TYPES = [
  { value: 'viewport_width', label: 'Viewport Width', unit: 'px' },
  { value: 'viewport_height', label: 'Viewport Height', unit: 'px' },
  { value: 'device_type', label: 'Device Type', unit: '' },
  { value: 'scroll_position', label: 'Scroll Position', unit: 'px' },
  { value: 'time_of_day', label: 'Time of Day', unit: '' },
  { value: 'user_preference', label: 'User Preference', unit: '' },
  { value: 'battery_level', label: 'Battery Level', unit: '%' },
  { value: 'connection_speed', label: 'Connection Speed', unit: '' },
  { value: 'reduced_motion', label: 'Reduced Motion', unit: '' }
];

const OPERATORS = [
  { value: 'equals', label: 'Equals (=)' },
  { value: 'not_equals', label: 'Not Equals (≠)' },
  { value: 'greater_than', label: 'Greater Than (>)' },
  { value: 'less_than', label: 'Less Than (<)' },
  { value: 'greater_or_equal', label: 'Greater or Equal (≥)' },
  { value: 'less_or_equal', label: 'Less or Equal (≤)' }
];

export function ConditionBuilder({ preset, onChange, onSave }: ConditionBuilderProps) {
  const [conditions, setConditions] = useState<ConditionConfig>(
    preset.config.conditions || { operator: 'AND', conditions: [] }
  );

  const handleAddCondition = () => {
    const newCondition = {
      type: 'viewport_width',
      operator: 'greater_than',
      value: 768
    };

    const updatedConditions = {
      ...conditions,
      conditions: [...conditions.conditions, newCondition]
    };
    setConditions(updatedConditions);
    updatePreset(updatedConditions);
  };

  const handleDeleteCondition = (index: number) => {
    const updatedConditions = {
      ...conditions,
      conditions: conditions.conditions.filter((_, i) => i !== index)
    };
    setConditions(updatedConditions);
    updatePreset(updatedConditions);
  };

  const handleUpdateCondition = (index: number, field: string, value: any) => {
    const updatedConditions = {
      ...conditions,
      conditions: conditions.conditions.map((cond, i) =>
        i === index ? { ...cond, [field]: value } : cond
      )
    };
    setConditions(updatedConditions);
    updatePreset(updatedConditions);
  };

  const handleOperatorChange = (operator: 'AND' | 'OR') => {
    const updatedConditions = {
      ...conditions,
      operator
    };
    setConditions(updatedConditions);
    updatePreset(updatedConditions);
  };

  const updatePreset = (updatedConditions: ConditionConfig) => {
    const updatedPreset = {
      ...preset,
      config: {
        ...preset.config,
        conditions: updatedConditions
      }
    };
    onChange(updatedPreset);
  };

  const getConditionTypeInfo = (type: string) => {
    return CONDITION_TYPES.find(t => t.value === type) || CONDITION_TYPES[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Condition Builder</h2>
          <p className="text-sm text-slate-600 mt-1">
            Define conditions that must be met for the animation to trigger
          </p>
        </div>
        <button
          onClick={() => onSave(preset)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>

      {/* Logical Operator */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Logical Operator</h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleOperatorChange('AND')}
            className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
              conditions.operator === 'AND'
                ? 'border-[#2563EB] bg-[#2563EB] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="font-semibold text-lg">AND</div>
            <div className="text-sm mt-1 opacity-90">
              All conditions must be true
            </div>
          </button>
          <button
            onClick={() => handleOperatorChange('OR')}
            className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
              conditions.operator === 'OR'
                ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="font-semibold text-lg">OR</div>
            <div className="text-sm mt-1 opacity-90">
              At least one condition must be true
            </div>
          </button>
        </div>
      </div>

      {/* Conditions List */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Conditions ({conditions.conditions.length})
          </h3>
          <button
            onClick={handleAddCondition}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Condition
          </button>
        </div>

        {conditions.conditions.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <p className="text-slate-600">
              No conditions set. Animation will trigger without restrictions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conditions.conditions.map((condition, index) => {
              const typeInfo = getConditionTypeInfo(condition.type);
              
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Condition Number */}
                    <div className="flex-shrink-0 w-8 h-8 bg-[#2563EB] text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>

                    {/* Condition Fields */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Type */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Condition Type
                        </label>
                        <select
                          value={condition.type}
                          onChange={(e) => handleUpdateCondition(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                        >
                          {CONDITION_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Operator */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Operator
                        </label>
                        <select
                          value={condition.operator || 'equals'}
                          onChange={(e) => handleUpdateCondition(index, 'operator', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                        >
                          {OPERATORS.map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Value */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Value {typeInfo.unit && `(${typeInfo.unit})`}
                        </label>
                        {condition.type === 'device_type' ? (
                          <select
                            value={condition.value}
                            onChange={(e) => handleUpdateCondition(index, 'value', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                          >
                            <option value="mobile">Mobile</option>
                            <option value="tablet">Tablet</option>
                            <option value="desktop">Desktop</option>
                          </select>
                        ) : condition.type === 'reduced_motion' ? (
                          <select
                            value={condition.value}
                            onChange={(e) => handleUpdateCondition(index, 'value', e.target.value === 'true')}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                          >
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                          </select>
                        ) : condition.type === 'connection_speed' ? (
                          <select
                            value={condition.value}
                            onChange={(e) => handleUpdateCondition(index, 'value', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                          >
                            <option value="slow-2g">Slow 2G</option>
                            <option value="2g">2G</option>
                            <option value="3g">3G</option>
                            <option value="4g">4G</option>
                          </select>
                        ) : (
                          <input
                            type="number"
                            value={condition.value}
                            onChange={(e) => handleUpdateCondition(index, 'value', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-sm"
                          />
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteCondition(index)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Logical Operator Between Conditions */}
                  {index < conditions.conditions.length - 1 && (
                    <div className="mt-3 pt-3 border-t border-slate-300 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        conditions.operator === 'AND'
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#7C3AED] text-white'
                      }`}>
                        {conditions.operator}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Condition Summary */}
      {conditions.conditions.length > 0 && (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Condition Summary</h3>
          <div className="text-sm text-slate-700 space-y-1">
            <p className="font-medium">Animation will trigger when:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              {conditions.conditions.map((condition, index) => {
                const typeInfo = getConditionTypeInfo(condition.type);
                const operator = OPERATORS.find(o => o.value === condition.operator)?.label || condition.operator;
                return (
                  <li key={index}>
                    {typeInfo.label} {operator} {condition.value}{typeInfo.unit}
                    {index < conditions.conditions.length - 1 && (
                      <span className="font-semibold text-[#2563EB] ml-2">
                        {conditions.operator}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
