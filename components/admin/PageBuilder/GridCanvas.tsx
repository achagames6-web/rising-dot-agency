'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import type { ComponentDefinition } from './ComponentPalette';

export interface PlacedComponent {
  id: string;
  componentDef: ComponentDefinition;
  gridColumn: number; // 1-12
  gridRow: number;
  gridColumnSpan: number; // 1-12
  props: Record<string, any>;
}

interface GridCanvasProps {
  components: PlacedComponent[];
  onComponentAdd: (component: PlacedComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<PlacedComponent>) => void;
  onComponentSelect: (id: string | null) => void;
  selectedComponentId: string | null;
  draggingComponent: ComponentDefinition | null;
}

const GRID_COLUMNS = 12;
const COLUMN_WIDTH = 80; // pixels
const ROW_HEIGHT = 100; // pixels

export default function GridCanvas({
  components,
  onComponentAdd,
  onComponentUpdate,
  onComponentSelect,
  selectedComponentId,
  draggingComponent,
}: GridCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOverPosition, setDragOverPosition] = useState<{ col: number; row: number } | null>(
    null
  );

  // Spring physics for dragging (0.3 strength as per requirements)
  const springConfig = { stiffness: 170, damping: 26, mass: 0.3 };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snap to 12-column grid
    const col = Math.max(1, Math.min(GRID_COLUMNS, Math.floor(x / COLUMN_WIDTH) + 1));
    const row = Math.max(1, Math.floor(y / ROW_HEIGHT) + 1);

    setDragOverPosition({ col, row });
  };

  const handleDragLeave = () => {
    setDragOverPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!dragOverPosition) return;

    try {
      const data = e.dataTransfer.getData('application/json');
      const componentDef: ComponentDefinition = JSON.parse(data);

      const newComponent: PlacedComponent = {
        id: `${componentDef.type}-${Date.now()}`,
        componentDef,
        gridColumn: dragOverPosition.col,
        gridRow: dragOverPosition.row,
        gridColumnSpan: 12, // Default to full width
        props: { ...componentDef.defaultProps },
      };

      onComponentAdd(newComponent);
    } catch (error) {
      console.error('Failed to parse dropped component:', error);
    }

    setDragOverPosition(null);
  };

  const handleComponentClick = (id: string) => {
    onComponentSelect(id);
  };

  return (
    <div className="flex-1 bg-slate-800 p-8 overflow-auto">
      <div
        ref={canvasRef}
        className="relative bg-slate-900 rounded-lg min-h-[800px]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(100, 116, 139, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 116, 139, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${COLUMN_WIDTH}px ${ROW_HEIGHT}px`,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Grid column indicators */}
        <div className="absolute top-0 left-0 right-0 h-8 flex">
          {Array.from({ length: GRID_COLUMNS }).map((_, i) => (
            <div
              key={i}
              className="flex-1 text-center text-xs text-slate-500 border-r border-slate-700"
              style={{ width: COLUMN_WIDTH }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Drag over indicator */}
        {dragOverPosition && (
          <div
            className="absolute bg-[#2563EB] bg-opacity-20 border-2 border-[#2563EB] rounded pointer-events-none"
            style={{
              left: (dragOverPosition.col - 1) * COLUMN_WIDTH,
              top: (dragOverPosition.row - 1) * ROW_HEIGHT + 32,
              width: COLUMN_WIDTH * 12,
              height: ROW_HEIGHT,
            }}
          />
        )}

        {/* Placed components */}
        <div className="relative pt-8">
          {components.map((component) => (
            <DraggableComponent
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              onClick={() => handleComponentClick(component.id)}
              onUpdate={(updates) => onComponentUpdate(component.id, updates)}
              springConfig={springConfig}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface DraggableComponentProps {
  component: PlacedComponent;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (updates: Partial<PlacedComponent>) => void;
  springConfig: { stiffness: number; damping: number; mass: number };
}

function DraggableComponent({
  component,
  isSelected,
  onClick,
  onUpdate,
  springConfig,
}: DraggableComponentProps) {
  const x = useMotionValue((component.gridColumn - 1) * COLUMN_WIDTH);
  const y = useMotionValue((component.gridRow - 1) * ROW_HEIGHT);

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, gridCol: 0, gridRow: 0 });

  useEffect(() => {
    x.set((component.gridColumn - 1) * COLUMN_WIDTH);
    y.set((component.gridRow - 1) * ROW_HEIGHT);
  }, [component.gridColumn, component.gridRow, x, y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();

    setIsDragging(true);
    onClick();

    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      gridCol: component.gridColumn,
      gridRow: component.gridRow,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      const newCol = Math.max(
        1,
        Math.min(GRID_COLUMNS, dragStartPos.current.gridCol + Math.round(deltaX / COLUMN_WIDTH))
      );
      const newRow = Math.max(1, dragStartPos.current.gridRow + Math.round(deltaY / ROW_HEIGHT));

      x.set((newCol - 1) * COLUMN_WIDTH);
      y.set((newRow - 1) * ROW_HEIGHT);
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      const finalCol = Math.max(
        1,
        Math.min(GRID_COLUMNS, Math.round(x.get() / COLUMN_WIDTH) + 1)
      );
      const finalRow = Math.max(1, Math.round(y.get() / ROW_HEIGHT) + 1);

      onUpdate({
        gridColumn: finalCol,
        gridRow: finalRow,
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, x, y, onUpdate]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        width: component.gridColumnSpan * COLUMN_WIDTH,
        minHeight: ROW_HEIGHT,
      }}
      className={`absolute cursor-move rounded-lg p-4 transition-colors ${
        isSelected
          ? 'bg-[#2563EB] bg-opacity-20 border-2 border-[#2563EB]'
          : 'bg-slate-700 border-2 border-slate-600 hover:border-slate-500'
      }`}
      onMouseDown={handleMouseDown}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{component.componentDef.icon}</span>
          <span className="text-white text-sm font-medium">{component.componentDef.name}</span>
        </div>
        <div className="text-xs text-slate-400">
          Col {component.gridColumn}, Row {component.gridRow}
        </div>
      </div>
      <div className="text-slate-300 text-xs">
        {JSON.stringify(component.props, null, 2).slice(0, 100)}...
      </div>
    </motion.div>
  );
}
