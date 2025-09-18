'use client';

import React from 'react';
import FlowNode from './FlowNode';
import { Card, CardContent } from '@/components/ui/card';

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    title: 'When a new file is added to Drive',
    position: { x: 50, y: 150 },
    icon: 'FilePlus2',
  },
  {
    id: '2',
    type: 'action',
    title: 'Summarize content with Gemini',
    position: { x: 350, y: 250 },
    icon: 'BrainCircuit',
  },
  {
    id: '3',
    type: 'action',
    title: 'Save summary to Notion',
    position: { x: 650, y: 150 },
    icon: 'FileText',
  },
];

const FlowCanvas = () => {
  return (
    <Card className="flex-1 h-[600px] lg:h-auto">
      <CardContent className="p-0 h-full">
        <div className="h-full relative overflow-hidden bg-card rounded-lg">
          {/* Grid background */}
          <div className="absolute inset-0 z-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="smallGrid"
                  width="16"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r="1" fill="hsl(var(--border))" />
                </pattern>
                <pattern
                  id="grid"
                  width="64"
                  height="64"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="100%" height="100%" fill="url(#smallGrid)" />
                  <path
                    d="M 64 0 L 0 0 0 64"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Nodes */}
          <div className="relative z-10 w-full h-full">
            {initialNodes.map((node) => (
              <FlowNode
                key={node.id}
                id={node.id}
                type={node.type as 'trigger' | 'action'}
                title={node.title}
                position={node.position}
                icon={node.icon}
              />
            ))}

            {/* Connections (SVG lines) - Placeholder */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M 182 190 C 266 190, 266 290, 350 290" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
                <path d="M 482 290 C 566 290, 566 190, 650 190" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowCanvas;
