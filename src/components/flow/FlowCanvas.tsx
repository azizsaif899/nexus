'use client';

import React from 'react';
import FlowNode from './FlowNode';
import { Zap, MessageSquare, GitBranch, BrainCircuit } from 'lucide-react';

const initialNodes = [
  { id: '1', type: 'trigger', title: 'Webhook Trigger', icon: Zap, position: { x: 100, y: 200 } },
  { id: '2', type: 'action', title: 'Send Message', icon: MessageSquare, position: { x: 400, y: 150 } },
  { id: '3', type: 'logic', title: 'Condition', icon: GitBranch, position: { x: 400, y: 350 } },
  { id: '4', type: 'ai', title: 'Analyze Sentiment', icon: BrainCircuit, position: { x: 700, y: 150 } },
];


const FlowCanvas = () => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 h-full w-full bg-background">
        <div 
          className="absolute inset-0 z-0 h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.4) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        ></div>
         <div 
          className="absolute inset-0 z-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.05), transparent 30%), radial-gradient(circle at 75% 75%, hsl(var(--primary) / 0.05), transparent 30%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 h-full w-full">
        {initialNodes.map(node => (
          <FlowNode
            key={node.id}
            id={node.id}
            title={node.title}
            type={node.type as 'trigger' | 'action' | 'logic' | 'ai'}
            Icon={node.icon}
            initialPosition={node.position}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowCanvas;
