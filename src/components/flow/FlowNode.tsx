'use client';
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

const nodeVariants = cva(
  'absolute group w-64 rounded-lg border-2 bg-card shadow-lg transition-all duration-300 hover:shadow-primary/20',
  {
    variants: {
      variant: {
        trigger: 'border-green-500/80 hover:border-green-500',
        action: 'border-blue-500/80 hover:border-blue-500',
        logic: 'border-yellow-500/80 hover:border-yellow-500',
        ai: 'border-purple-500/80 hover:border-purple-500',
      },
    },
    defaultVariants: {
      variant: 'action',
    },
  }
);

export interface FlowNodeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof nodeVariants> {
  id: string;
  title: string;
  Icon: React.ElementType;
  initialPosition: { x: number; y: number };
  type: 'trigger' | 'action' | 'logic' | 'ai';
}

const FlowNode = React.forwardRef<HTMLDivElement, FlowNodeProps>(
  ({ className, title, Icon, initialPosition, type, ...props }, ref) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData('application/reactflow', e.currentTarget.id);
      e.dataTransfer.effectAllowed = 'move';
    };

    return (
      <div
        ref={ref}
        id={props.id}
        className={cn(nodeVariants({ variant: type, className }))}
        style={{ top: initialPosition.y, left: initialPosition.x }}
        draggable
        onDragStart={handleDragStart}
      >
        {/* Input port */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-border border-2 border-card group-hover:bg-primary transition-colors" />

        <div className="flex items-center gap-3 p-3 border-b border-border">
            <div className="handle cursor-move text-muted-foreground hover:text-foreground">
                <GripVertical className="h-5 w-5" />
            </div>
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground truncate">{title}</h3>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
            Node content goes here.
        </div>
        
        {/* Output port */}
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-border border-2 border-card group-hover:bg-primary transition-colors" />
      </div>
    );
  }
);
FlowNode.displayName = 'FlowNode';

export default FlowNode;
