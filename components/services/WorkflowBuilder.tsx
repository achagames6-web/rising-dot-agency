'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  WorkflowNode,
  NodeTypeColors,
  defaultNodeColors,
  getNodeColorFromMapping,
} from './workflowBuilderUtils';

// Re-export types for external use
export type { WorkflowNode, NodeTypeColors };
export { getNodeColorFromMapping };

interface Connection {
  from: string;
  to: string;
  isValid: boolean;
}

interface Particle {
  id: string;
  connectionId: string;
  progress: number;
}

// Props interface for CMS integration - Requirements: 2.1, 2.2, 2.3
export interface WorkflowBuilderProps {
  /** Initial nodes configuration from CMS */
  initialNodes?: WorkflowNode[];
  /** Node type color mapping from CMS */
  nodeColors?: NodeTypeColors;
}

const GRID_SIZE = 20;

// Real N8N-style nodes with icons
const n8nNodeIcons: Record<string, string> = {
  'webhook': '🔗',
  'http': '🌐',
  'gmail': '📧',
  'slack': '💬',
  'sheets': '📊',
  'code': '💻',
  'if': '🔀',
  'merge': '🔄',
  'set': '📝',
  'function': '⚡',
  'schedule': '⏰',
  'google': '📊',
  'discord': '🎮',
  'telegram': '✈️',
  'airtable': '📋',
  'notion': '📓',
};

// Default N8N-style nodes - positioned in center of canvas
const defaultN8NNodes: WorkflowNode[] = [
  { id: 'webhook-1', type: 'trigger', label: 'Webhook', x: 60, y: 180, connections: ['http-1'] },
  { id: 'http-1', type: 'action', label: 'HTTP Request', x: 240, y: 180, connections: ['if-1'] },
  { id: 'if-1', type: 'condition', label: 'IF', x: 420, y: 180, connections: ['gmail-1', 'slack-1'] },
  { id: 'gmail-1', type: 'output', label: 'Gmail', x: 600, y: 100, connections: [] },
  { id: 'slack-1', type: 'output', label: 'Slack', x: 600, y: 260, connections: [] },
];

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  initialNodes,
  nodeColors,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Use props with fallback to defaults - Requirements: 2.3
  const effectiveNodeColors = nodeColors || defaultNodeColors;
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes || defaultN8NNodes);
  
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Get connections from nodes
  const connections: Connection[] = nodes.flatMap(node =>
    node.connections.map(targetId => ({
      from: node.id,
      to: targetId,
      isValid: true, // All connections are valid in this demo
    }))
  );

  // Particle animation for connections
  useEffect(() => {
    const interval = setInterval(() => {
      if (connections.length > 0) {
        // Add new particles
        const newParticles: Particle[] = [];
        connections.forEach(conn => {
          if (Math.random() < 0.3) {
            newParticles.push({
              id: `particle-${Date.now()}-${Math.random()}`,
              connectionId: `${conn.from}-${conn.to}`,
              progress: 0,
            });
          }
        });
        
        setParticles(prev => [...prev, ...newParticles]);
      }
      
      // Update particle positions
      setParticles(prev => 
        prev
          .map(p => ({ ...p, progress: p.progress + 0.03 }))
          .filter(p => p.progress < 1)
      );
    }, 100);
    
    return () => clearInterval(interval);
  }, [connections.length]);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setDraggingNode(nodeId);
    // Store offset from node position to mouse position
    setDragStart({ x: mouseX - node.x, y: mouseY - node.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingNode || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate new position maintaining the offset
    const newX = Math.max(20, Math.min(mouseX - dragStart.x, rect.width - 160));
    const newY = Math.max(20, Math.min(mouseY - dragStart.y, rect.height - 90));
    
    setNodes(prev =>
      prev.map(node =>
        node.id === draggingNode
          ? { ...node, x: newX, y: newY }
          : node
      )
    );
  }, [draggingNode, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (draggingNode) {
      // Snap to grid on release
      setNodes(prev =>
        prev.map(node =>
          node.id === draggingNode
            ? { 
                ...node, 
                x: Math.round(node.x / GRID_SIZE) * GRID_SIZE, 
                y: Math.round(node.y / GRID_SIZE) * GRID_SIZE 
              }
            : node
        )
      );
    }
    setDraggingNode(null);
  }, [draggingNode]);

  useEffect(() => {
    if (draggingNode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingNode, handleMouseMove, handleMouseUp]);

  // Use color mapping from props or defaults - Requirements: 2.2
  const getNodeColor = (type: WorkflowNode['type']) => {
    return getNodeColorFromMapping(type, effectiveNodeColors);
  };

  // Get icon for node based on label
  const getNodeIcon = (label: string) => {
    const key = label.toLowerCase().split(' ')[0];
    return n8nNodeIcons[key] || '⚙️';
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-[500px] bg-[#1a1a2e] rounded-2xl border border-[#37AFE1]/20 overflow-hidden select-none"
      style={{ cursor: draggingNode ? 'grabbing' : 'default' }}
    >
      {/* Grid background - N8N style dots */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern id="n8n-grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <circle cx={GRID_SIZE / 2} cy={GRID_SIZE / 2} r="1" fill="#37AFE1" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#n8n-grid)" />
      </svg>

      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((conn) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          
          if (!fromNode || !toNode) return null;
          
          const fromX = fromNode.x + 140;
          const fromY = fromNode.y + 35;
          const toX = toNode.x;
          const toY = toNode.y + 35;
          
          // Bezier curve control points
          const controlX1 = fromX + 60;
          const controlX2 = toX - 60;
          
          return (
            <g key={`${conn.from}-${conn.to}`}>
              {/* Connection line with gradient */}
              <defs>
                <linearGradient id={`gradient-${conn.from}-${conn.to}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#37AFE1" />
                  <stop offset="100%" stopColor="#F58122" />
                </linearGradient>
              </defs>
              <path
                d={`M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`}
                stroke={`url(#gradient-${conn.from}-${conn.to})`}
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
              
              {/* Particles flowing along connections */}
              {particles
                .filter(p => p.connectionId === `${conn.from}-${conn.to}`)
                .map(particle => {
                  const t = particle.progress;
                  // Cubic bezier calculation
                  const mt = 1 - t;
                  const x = mt*mt*mt*fromX + 3*mt*mt*t*controlX1 + 3*mt*t*t*controlX2 + t*t*t*toX;
                  const y = mt*mt*mt*fromY + 3*mt*mt*t*fromY + 3*mt*t*t*toY + t*t*t*toY;
                  
                  return (
                    <circle
                      key={particle.id}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#37AFE1"
                      opacity={0.9 - particle.progress * 0.5}
                    >
                      <animate
                        attributeName="r"
                        values="3;5;3"
                        dur="0.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })}
            </g>
          );
        })}
      </svg>

      {/* Nodes - N8N style */}
      {nodes.map(node => (
        <motion.div
          key={node.id}
          className="absolute cursor-grab active:cursor-grabbing"
          style={{
            left: node.x,
            top: node.y,
            width: 140,
            height: 70,
            zIndex: draggingNode === node.id ? 50 : 10,
          }}
          onMouseDown={(e) => handleMouseDown(e, node.id)}
          animate={{
            scale: draggingNode === node.id ? 1.05 : 1,
            boxShadow: draggingNode === node.id 
              ? '0 20px 40px rgba(55, 175, 225, 0.3)' 
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        >
          {/* Node card - N8N style */}
          <div
            className="w-full h-full rounded-xl flex flex-col items-center justify-center text-white shadow-lg border-2 transition-all duration-200"
            style={{
              backgroundColor: '#2a2a4a',
              borderColor: draggingNode === node.id ? '#37AFE1' : getNodeColor(node.type),
            }}
          >
            {/* Icon circle */}
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mb-1"
              style={{ backgroundColor: getNodeColor(node.type) }}
            >
              {getNodeIcon(node.label)}
            </div>
            {/* Label */}
            <span className="text-xs font-medium text-white/90">{node.label}</span>
            {/* Type badge */}
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full mt-1"
              style={{ 
                backgroundColor: `${getNodeColor(node.type)}30`,
                color: getNodeColor(node.type),
              }}
            >
              {node.type}
            </span>
          </div>
          
          {/* Connection ports */}
          {node.type !== 'trigger' && (
            <div 
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
              style={{ 
                backgroundColor: '#1a1a2e',
                borderColor: getNodeColor(node.type),
              }}
            />
          )}
          {node.connections.length > 0 && (
            <div 
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
              style={{ 
                backgroundColor: '#1a1a2e',
                borderColor: getNodeColor(node.type),
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Add node button */}
      <motion.button
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#37AFE1]/20 border border-[#37AFE1]/50 text-[#37AFE1] text-sm font-medium flex items-center gap-2 hover:bg-[#37AFE1]/30 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">+</span>
        Add Node
      </motion.button>

      {/* Instructions */}
      <div className="absolute top-4 right-4 text-xs text-white/50 bg-black/30 px-3 py-2 rounded-lg">
        Drag nodes to reposition
      </div>
    </div>
  );
};
