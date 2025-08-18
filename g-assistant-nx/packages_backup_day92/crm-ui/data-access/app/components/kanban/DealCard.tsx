'use client';

import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, User, Zap } from 'lucide-react';
import { Deal } from '../../types/kanban';

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

export function DealCard({ deal, isDragging = false }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: deal.id,
  });

  const getHeatColor = (level: string) => {
    switch (level) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-yellow-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getHeatIcon = (level: string) => {
    switch (level) {
      case 'hot': return '🔥';
      case 'warm': return '⚡';
      case 'cold': return '❄️';
      default: return '⚪';
    }
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white border rounded-lg p-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 rotate-5' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
          {deal.title}
        </h4>
        <div className="flex items-center space-x-1">
          <span className="text-xs">{getHeatIcon(deal.heatLevel)}</span>
          <div className={`w-2 h-2 rounded-full ${getHeatColor(deal.heatLevel)}`}></div>
        </div>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <User className="w-3 h-3" />
          <span>{deal.customer}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <DollarSign className="w-3 h-3" />
          <span className="font-medium text-green-600">
            {deal.value.toLocaleString('ar-SA')} ريال
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-3 h-3" />
          <span>{new Date(deal.lastActivity).toLocaleDateString('ar-SA')}</span>
        </div>
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded-md border-r-2 border-blue-400">
        <div className="flex items-start space-x-2">
          <Zap className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800 leading-relaxed">
            {deal.nextAction}
          </p>
        </div>
      </div>
    </motion.div>
  );
}