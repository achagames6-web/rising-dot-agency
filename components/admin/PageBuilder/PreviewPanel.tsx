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
    <div className="flex w-96 flex-col border-l border-slate-700 bg-[#1E293B]">
      {/* Header */}
      <div className="border-b border-slate-700 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`rounded px-3 py-1 text-sm transition-colors ${
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
              className={`flex-1 rounded px-3 py-2 text-sm capitalize transition-colors ${
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

        <div className="mt-2 text-center text-xs text-slate-400">
          {dimensions.label}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-slate-800 p-4">
        <motion.div
          className="mx-auto overflow-hidden rounded-lg bg-white shadow-xl"
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
              <div className="py-20 text-center text-slate-400">
                <p className="mb-2 text-lg">No components yet</p>
                <p className="text-sm">
                  Drag components from the palette to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {components
                  .sort((a, b) => a.gridRow - b.gridRow)
                  .map((component) => (
                    <PreviewComponent
                      key={component.id}
                      component={component}
                    />
                  ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Info Panel */}
      <div className="border-t border-slate-700 p-4">
        <div className="text-xs text-slate-400">
          <div className="mb-2">
            <span className="font-semibold">Components:</span>{' '}
            {components.length}
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xl">{componentDef.icon}</span>
        <span className="font-semibold text-slate-800">
          {componentDef.name}
        </span>
      </div>

      {/* Render based on component type */}
      {componentDef.type === 'hero' && (
        <div className="rounded bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h1 className="mb-2 text-3xl font-bold">
            {props.title || 'Hero Title'}
          </h1>
          <p className="text-lg">{props.subtitle || 'Hero Subtitle'}</p>
        </div>
      )}

      {componentDef.type === 'text' && (
        <div className="prose">
          <p>{props.content || 'Text content'}</p>
        </div>
      )}

      {componentDef.type === 'image' && (
        <div className="flex h-48 items-center justify-center rounded bg-slate-200">
          {props.src ? (
            <img src={props.src} alt={props.alt} className="max-h-full" />
          ) : (
            <span className="text-slate-400">🖼️ Image placeholder</span>
          )}
        </div>
      )}

      {componentDef.type === 'cta' && (
        <div className="rounded bg-blue-600 p-6 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">
            {props.title || 'Call to Action'}
          </h2>
          <button className="rounded bg-white px-6 py-2 font-semibold text-blue-600">
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
