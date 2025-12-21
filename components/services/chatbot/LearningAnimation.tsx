'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
  id: string;
  x: number;
  y: number;
  layer: number;
}

interface Connection {
  from: string;
  to: string;
  active: boolean;
}

export const LearningAnimation: React.FC = () => {
  const [stage, setStage] = useState<'input' | 'processing' | 'output'>('input');
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Define neural network structure
  const layers = [
    { nodes: 4, label: 'Input', sublabel: 'User Query' },
    { nodes: 6, label: 'Hidden 1', sublabel: 'Understanding' },
    { nodes: 8, label: 'Hidden 2', sublabel: 'Processing' },
    { nodes: 6, label: 'Hidden 3', sublabel: 'Reasoning' },
    { nodes: 4, label: 'Output', sublabel: 'Response' },
  ];

  const nodes: Node[] = [];
  const connections: Connection[] = [];

  // Generate nodes
  layers.forEach((layer, layerIndex) => {
    const layerHeight = 280;
    const nodeSpacing = layerHeight / (layer.nodes + 1);
    
    for (let i = 0; i < layer.nodes; i++) {
      nodes.push({
        id: `${layerIndex}-${i}`,
        x: 80 + layerIndex * 160,
        y: 60 + nodeSpacing * (i + 1),
        layer: layerIndex,
      });
    }
  });

  // Generate connections
  layers.forEach((layer, layerIndex) => {
    if (layerIndex < layers.length - 1) {
      const currentLayerNodes = nodes.filter(n => n.layer === layerIndex);
      const nextLayerNodes = nodes.filter(n => n.layer === layerIndex + 1);
      
      currentLayerNodes.forEach(fromNode => {
        nextLayerNodes.forEach(toNode => {
          connections.push({
            from: fromNode.id,
            to: toNode.id,
            active: false,
          });
        });
      });
    }
  });

  // Animation cycle
  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage(prev => {
        if (prev === 'input') return 'processing';
        if (prev === 'processing') return 'output';
        return 'input';
      });
    }, 2500);

    return () => clearInterval(stageInterval);
  }, []);

  // Pulse animation through layers
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % layers.length);
    }, 500);

    return () => clearInterval(pulseInterval);
  }, [layers.length]);

  // Update active nodes based on pulse
  useEffect(() => {
    const layerNodes = nodes.filter(n => n.layer === pulseIndex).map(n => n.id);
    setActiveNodes(layerNodes);
  }, [pulseIndex]);

  const getNodeColor = (node: Node) => {
    if (node.layer === 0) return '#F58122'; // Input - Orange
    if (node.layer === layers.length - 1) return '#31A4DB'; // Output - Brand Cyan
    return '#37AFE1'; // Hidden - Brand Blue
  };

  const isNodeActive = (nodeId: string) => activeNodes.includes(nodeId);

  return (
    <div className="w-full">
      {/* Main visualization */}
      <div className="relative w-full h-[450px] bg-black rounded-2xl border border-[#37AFE1]/30 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(55, 175, 225, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(55, 175, 225, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* SVG for connections and nodes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 880 450">
          {/* Connections */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const isActive = isNodeActive(fromNode.id) || isNodeActive(toNode.id);
            
            return (
              <motion.line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isActive ? '#37AFE1' : '#37AFE1'}
                strokeWidth={isActive ? 2 : 0.5}
                strokeOpacity={isActive ? 0.8 : 0.15}
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  strokeOpacity: isActive ? 0.8 : 0.15,
                }}
                transition={{ duration: 0.3 }}
              />
            );
          })}

          {/* Data flow particles */}
          {connections.slice(0, 30).map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            if (fromNode.layer !== pulseIndex) return null;

            return (
              <motion.circle
                key={`particle-${idx}`}
                r={3}
                fill="#F58122"
                initial={{ cx: fromNode.x, cy: fromNode.y, opacity: 1 }}
                animate={{ cx: toNode.x, cy: toNode.y, opacity: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: idx * 0.02,
                  ease: 'easeOut'
                }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isActive = isNodeActive(node.id);
            const color = getNodeColor(node);
            
            return (
              <g key={node.id}>
                {/* Glow effect */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 20 : 12}
                  fill={color}
                  fillOpacity={isActive ? 0.3 : 0.1}
                  animate={{
                    r: isActive ? [12, 24, 12] : 12,
                    fillOpacity: isActive ? [0.1, 0.4, 0.1] : 0.1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: isActive ? Infinity : 0,
                  }}
                />
                {/* Main node */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 10 : 6}
                  fill={color}
                  stroke={color}
                  strokeWidth={2}
                  animate={{
                    r: isActive ? 10 : 6,
                    scale: isActive ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Layer labels */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-around px-8">
          {layers.map((layer, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              animate={{
                opacity: pulseIndex === idx ? 1 : 0.5,
                scale: pulseIndex === idx ? 1.1 : 1,
              }}
            >
              <div 
                className="text-sm font-semibold"
                style={{ color: idx === 0 ? '#F58122' : idx === layers.length - 1 ? '#31A4DB' : '#37AFE1' }}
              >
                {layer.label}
              </div>
              <div className="text-xs text-[#64748B]">{layer.sublabel}</div>
            </motion.div>
          ))}
        </div>

        {/* Stage indicator */}
        <div className="absolute top-4 left-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#37AFE1]/30"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: stage === 'input' ? '#F58122' : stage === 'processing' ? '#37AFE1' : '#31A4DB' 
                  }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-white text-sm font-medium">
                  {stage === 'input' && 'Receiving Input...'}
                  {stage === 'processing' && 'Processing Data...'}
                  {stage === 'output' && 'Generating Response...'}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Process steps */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className={`p-6 rounded-xl border transition-all ${
            stage === 'input'
              ? 'bg-[#F58122]/10 border-[#F58122] shadow-lg shadow-[#F58122]/20'
              : 'bg-black border-[#37AFE1]/20'
          }`}
          animate={{ scale: stage === 'input' ? 1.02 : 1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#F58122]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#F58122]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-[#F58122] font-semibold text-lg">Input Layer</div>
          </div>
          <p className="text-[#64748B] text-sm">
            User messages are tokenized and converted into numerical vectors for processing.
          </p>
        </motion.div>

        <motion.div
          className={`p-6 rounded-xl border transition-all ${
            stage === 'processing'
              ? 'bg-[#37AFE1]/10 border-[#37AFE1] shadow-lg shadow-[#37AFE1]/20'
              : 'bg-black border-[#37AFE1]/20'
          }`}
          animate={{ scale: stage === 'processing' ? 1.02 : 1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#37AFE1]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#37AFE1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="text-[#37AFE1] font-semibold text-lg">Hidden Layers</div>
          </div>
          <p className="text-[#64748B] text-sm">
            Multiple neural layers analyze context, intent, and generate intelligent understanding.
          </p>
        </motion.div>

        <motion.div
          className={`p-6 rounded-xl border transition-all ${
            stage === 'output'
              ? 'bg-[#31A4DB]/10 border-[#31A4DB] shadow-lg shadow-[#31A4DB]/20'
              : 'bg-black border-[#37AFE1]/20'
          }`}
          animate={{ scale: stage === 'output' ? 1.02 : 1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#31A4DB]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#31A4DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-[#31A4DB] font-semibold text-lg">Output Layer</div>
          </div>
          <p className="text-[#64748B] text-sm">
            Final layer produces natural language responses tailored to user queries.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
