'use client';

import { useState, useEffect } from 'react';
import ComponentPalette, { type ComponentDefinition } from './ComponentPalette';
import GridCanvas, { type PlacedComponent } from './GridCanvas';
import PreviewPanel from './PreviewPanel';
import PropertiesEditor from './PropertiesEditor';
import { useUndoRedo } from './useUndoRedo';

interface PageBuilderProps {
  pageId?: string;
  initialComponents?: PlacedComponent[];
  onSave?: (components: PlacedComponent[]) => Promise<void>;
}

export default function PageBuilder({
  pageId,
  initialComponents = [],
  onSave,
}: PageBuilderProps) {
  const {
    state: components,
    setState: setComponents,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  } = useUndoRedo<PlacedComponent[]>(initialComponents);

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [draggingComponent, setDraggingComponent] = useState<ComponentDefinition | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load initial components
  useEffect(() => {
    if (initialComponents.length > 0) {
      reset(initialComponents);
    }
  }, [pageId, initialComponents, reset]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }

      // Redo: Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        if (canRedo) redo();
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId) {
        e.preventDefault();
        handleComponentDelete(selectedComponentId);
      }

      // Deselect: Escape
      if (e.key === 'Escape') {
        setSelectedComponentId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, selectedComponentId]);

  const handleComponentAdd = (component: PlacedComponent) => {
    setComponents([...components, component]);
    setSelectedComponentId(component.id);
  };

  const handleComponentUpdate = (id: string, updates: Partial<PlacedComponent>) => {
    setComponents(
      components.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleComponentDelete = (id: string) => {
    setComponents(components.filter((c) => c.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(components);
      alert('Page saved successfully!');
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('Failed to save page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedComponent = components.find((c) => c.id === selectedComponentId) || null;

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Toolbar */}
      <div className="bg-[#1E293B] border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Visual Page Builder</h1>
          {pageId && <span className="text-sm text-slate-400">Page ID: {pageId}</span>}
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`px-3 py-2 rounded text-sm transition-colors ${
              canUndo
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className={`px-3 py-2 rounded text-sm transition-colors ${
              canRedo
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Shift+Z)"
          >
            ↷ Redo
          </button>

          <div className="w-px h-6 bg-slate-600 mx-2" />

          {/* Save Button */}
          {onSave && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                isSaving
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Page'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Palette */}
        <ComponentPalette onDragStart={setDraggingComponent} />

        {/* Canvas */}
        <GridCanvas
          components={components}
          onComponentAdd={handleComponentAdd}
          onComponentUpdate={handleComponentUpdate}
          onComponentSelect={setSelectedComponentId}
          selectedComponentId={selectedComponentId}
          draggingComponent={draggingComponent}
        />

        {/* Preview Panel */}
        <PreviewPanel components={components} />

        {/* Properties Editor */}
        <PropertiesEditor
          selectedComponent={selectedComponent}
          onUpdate={handleComponentUpdate}
          onDelete={handleComponentDelete}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-[#1E293B] border-t border-slate-700 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>{components.length} components</span>
          {selectedComponentId && <span>Selected: {selectedComponent?.componentDef.name}</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>Keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Shift+Z (Redo), Delete (Remove)</span>
        </div>
      </div>
    </div>
  );
}
