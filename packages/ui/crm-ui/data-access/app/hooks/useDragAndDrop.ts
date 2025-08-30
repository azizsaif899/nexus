'use client';

import { useState, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { Deal } from '../types/kanban';

interface UseDragAndDropProps {
  deals: Deal[];
  onDealMove: (dealId: string, newStage: string) => void;
  onSmartSuggestion?: (dealId: string, fromStage: string, toStage: string) => void;
}

export function useDragAndDrop({ 
  deals, 
  onDealMove, 
  onSmartSuggestion 
}: UseDragAndDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const handleDragStart = useCallback((event: any) => {
    const dealId = event.active.id as string;
    const deal = deals.find(d => d.id === dealId);
    
    setActiveId(dealId);
    setDraggedDeal(deal || null);
  }, [deals]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !draggedDeal) {
      setActiveId(null);
      setDraggedDeal(null);
      return;
    }

    const dealId = active.id as string;
    const newStage = over.id as string;
    const oldStage = draggedDeal.stage;

    if (oldStage !== newStage) {
      onDealMove(dealId, newStage);
      
      // Trigger smart suggestions
      if (onSmartSuggestion) {
        onSmartSuggestion(dealId, oldStage, newStage);
      }
    }

    setActiveId(null);
    setDraggedDeal(null);
  }, [draggedDeal, onDealMove, onSmartSuggestion]);

  const getSmartDropSuggestion = useCallback((dealId: string, targetStage: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return null;

    const suggestions: Record<string, string> = {
      'qualified': 'هل تريد إنشاء عرض سعر تلقائي بناءً على المنتجات المناقشة؟',
      'proposal': 'هل تريد إرسال تذكير للعميل بمراجعة العرض؟',
      'negotiation': 'هل تريد جدولة مكالمة للمفاوضة النهائية؟',
      'won': 'تهانينا! هل تريد إرسال رسالة شكر وبدء عملية التسليم؟',
      'lost': 'هل تريد إرسال استبيان لمعرفة أسباب عدم إتمام الصفقة؟'
    };

    return suggestions[targetStage] || null;
  }, [deals]);

  return {
    activeId,
    draggedDeal,
    handleDragStart,
    handleDragEnd,
    getSmartDropSuggestion
  };
}