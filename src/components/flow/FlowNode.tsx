'use client';

import {
  FilePlus2,
  BrainCircuit,
  FileText,
  LucideIcon,
  MousePointer,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// A mapping from icon names to component types
const icons: { [key: string]: LucideIcon } = {
  FilePlus2,
  BrainCircuit,
  FileText,
  MousePointer,
  Zap,
};

interface FlowNodeProps {
  id: string;
  type: 'trigger' | 'action';
  title: string;
  position: { x: number; y: number };
  icon: string;
}

const FlowNode = ({ id, type, title, position, icon }: FlowNodeProps) => {
  const IconComponent = icons[icon] || Zap;

  const nodeStyles = {
    trigger: {
      base: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-100',
      icon: 'bg-cyan-500/20 text-cyan-300',
      handle: 'bg-cyan-400',
    },
    action: {
      base: 'border-blue-500/50 bg-blue-950/30 text-blue-100',
      icon: 'bg-blue-500/20 text-blue-300',
      handle: 'bg-blue-400',
    },
  };

  const styles = nodeStyles[type];

  return (
    <div
      className={cn(
        'absolute w-72 rounded-lg border-2 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:scale-105',
        styles.base
      )}
      style={{ top: position.y, left: position.x }}
    >
      {/* Input Handle */}
      <div className={cn("absolute top-1/2 -left-2.5 h-4 w-4 rounded-full border-2 border-background transform -translate-y-1/2", styles.handle)}></div>

      <div className="flex items-center gap-4 p-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", styles.icon)}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
        </div>
      </div>

       {/* Output Handle */}
       <div className={cn("absolute top-1/2 -right-2.5 h-4 w-4 rounded-full border-2 border-background transform -translate-y-1/2", styles.handle)}></div>
    </div>
  );
};

export default FlowNode;
