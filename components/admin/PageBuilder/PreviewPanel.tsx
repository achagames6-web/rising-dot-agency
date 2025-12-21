'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PlacedComponent } from './GridCanvas';

type DeviceView = 'desktop' | 'tablet' | 'mobile';

interface PreviewPanelProps {
  components: PlacedComponent[];
}

const DEVICE_DIMENSIONS = {
  desktop: { width: '100%', height: '100%', label: 'Desktop (1920px)' },
  tablet: { width: '768px', height: '1024px', label: 'Tablet (768px)' },
  mobile: { width: '375px', height: '667px', label: 'Mobile (375px)' },
};

export default function PreviewPanel({ components }: PreviewPanelProps) {
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const dimensions = DEVICE_DIMENSIONS[deviceView];

  return (
    <div className="w-96 bg-[#1E293B] border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              isPreviewMode
                ? 'bg-[#2563EB] text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
        </div>

        {/* Device Selector */}
        <div className="flex gap-2">
          {(['desktop', 'tablet', 'mobile'] as DeviceView[]).map((device) => (
            <button
              key={device}
              onClick={() => setDeviceView(device)}
              className={`flex-1 px-3 py-2 rounded text-sm capitalize transition-colors ${
                deviceView === device
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {device === 'desktop' && '🖥️'}
              {device === 'tablet' && '📱'}
              {device === 'mobile' && '📱'}
              <span className="ml-1">{device}</span>
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 mt-2 text-center">{dimensions.label}</div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-4 overflow-auto bg-slate-800">
        <motion.div
          className="mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
          style={{
            width: dimensions.width,
            minHeight: dimensions.height,
          }}
          initial={false}
          animate={{
            width: dimensions.width,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Preview Content */}
          <div className="p-4">
            {components.length === 0 ? (
              <div className="text-center text-slate-400 py-20">
                <p className="text-lg mb-2">No components yet</p>
                <p className="text-sm">Drag components from the palette to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {components
                  .sort((a, b) => a.gridRow - b.gridRow)
                  .map((component) => (
                    <PreviewComponent key={component.id} component={component} />
                  ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Info Panel */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          <div className="mb-2">
            <span className="font-semibold">Components:</span> {components.length}
          </div>
          <div className="text-[10px] text-slate-500">
            Real-time preview updates as you build
          </div>
        </div>
      </div>
    </div>
  );
}

interface PreviewComponentProps {
  component: PlacedComponent;
}

function PreviewComponent({ component }: PreviewComponentProps) {
  const { componentDef, props } = component;

  // Simplified preview rendering
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{componentDef.icon}</span>
        <span className="font-semibold text-slate-800">{componentDef.name}</span>
      </div>

      {/* Render based on component type */}
      {componentDef.type === 'hero' && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded">
          <h1 className="text-3xl font-bold mb-2">{props.title || 'Hero Title'}</h1>
          <p className="text-lg">{props.subtitle || 'Hero Subtitle'}</p>
        </div>
      )}

      {componentDef.type === 'text' && (
        <div className="prose">
          <p>{props.content || 'Text content'}</p>
        </div>
      )}

      {componentDef.type === 'image' && (
        <div className="bg-slate-200 h-48 rounded flex items-center justify-center">
          {props.src ? (
            <img src={props.src} alt={props.alt} className="max-h-full" />
          ) : (
            <span className="text-slate-400">🖼️ Image placeholder</span>
          )}
        </div>
      )}

      {componentDef.type === 'cta' && (
        <div className="bg-blue-600 text-white p-6 rounded text-center">
          <h2 className="text-2xl font-bold mb-4">{props.title || 'Call to Action'}</h2>
          <button className="bg-white text-blue-600 px-6 py-2 rounded font-semibold">
            {props.buttonText || 'Click Here'}
          </button>
        </div>
      )}

      {!['hero', 'text', 'image', 'cta'].includes(componentDef.type) && (
        <div className="text-sm text-slate-600">
          <pre className="text-xs">{JSON.stringify(props, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
