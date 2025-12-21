'use client';

import { useState, useEffect } from 'react';
import { Activity, Eye, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';
import { AnimationPreset } from './AnimationPresetLibrary';

interface DebugModeProps {
  presets: AnimationPreset[];
}

interface DebugEvent {
  id: string;
  timestamp: number;
  presetName: string;
  triggerType: string;
  status: 'triggered' | 'blocked' | 'completed';
  details: string;
}

export function DebugMode({ presets }: DebugModeProps) {
  const [events, setEvents] = useState<DebugEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  useEffect(() => {
    if (isMonitoring) {
      // Simulate debug events for demonstration
      const interval = setInterval(() => {
        const randomPreset = presets[Math.floor(Math.random() * presets.length)];
        if (randomPreset) {
          const statuses: Array<'triggered' | 'blocked' | 'completed'> = ['triggered', 'blocked', 'completed'];
          const newEvent: DebugEvent = {
            id: `${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            presetName: randomPreset.name,
            triggerType: randomPreset.config.triggers?.[0]?.type || 'manual',
            status: statuses[Math.floor(Math.random() * statuses.length)],
            details: `Animation ${randomPreset.name} ${statuses[Math.floor(Math.random() * statuses.length)]}`
          };
          setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring, presets]);

  const filteredEvents = selectedPreset
    ? events.filter(e => e.presetName === selectedPreset)
    : events;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'triggered':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case 'blocked':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'blocked':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-900';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-900';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Debug Mode</h2>
          <p className="text-sm text-slate-600 mt-1">
            Monitor animation triggers and performance in real-time
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setEvents([])}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear Events
          </button>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isMonitoring
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#10B981] text-white hover:bg-[#059669]'
            }`}
          >
            <Activity className={`w-4 h-4 ${isMonitoring ? 'animate-pulse' : ''}`} />
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{events.length}</div>
              <div className="text-sm text-slate-600">Total Events</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {events.filter(e => e.status === 'triggered').length}
              </div>
              <div className="text-sm text-slate-600">Triggered</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {events.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-sm text-slate-600">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {events.filter(e => e.status === 'blocked').length}
              </div>
              <div className="text-sm text-slate-600">Blocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Filter by Preset
        </label>
        <select
          value={selectedPreset || ''}
          onChange={(e) => setSelectedPreset(e.target.value || null)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
        >
          <option value="">All Presets</option>
          {presets.map(preset => (
            <option key={preset.id} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Event Log */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Event Log</h3>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <Eye className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">
                {isMonitoring
                  ? 'Waiting for animation events...'
                  : 'Start monitoring to see animation events'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className={`p-4 border-l-4 ${getStatusColor(event.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(event.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{event.presetName}</span>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs rounded capitalize">
                            {event.triggerType}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{event.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatTime(event.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Visual Indicators Info */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Visual Indicators Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-slate-900">Triggered</div>
              <div className="text-sm text-slate-600">Animation trigger condition met</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-slate-900">Completed</div>
              <div className="text-sm text-slate-600">Animation finished successfully</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-slate-900">Blocked</div>
              <div className="text-sm text-slate-600">Condition not met or error occurred</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
