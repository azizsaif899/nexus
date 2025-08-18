/**
 * 📋 Interactive Kanban Board - TASK-006
 * لوحة كانبان تفاعلية مع السحب والإفلات
 */

import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { eventBus, EventTypes } from '../../../../packages/core-logic/src/event-bus';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  probability: number;
  stage: string;
  heatLevel: 'hot' | 'warm' | 'cold';
  nextAction: string;
  lastActivity: Date;
}

interface KanbanStage {
  id: string;
  title: string;
  color: string;
  deals: Deal[];
}

export const InteractiveKanban: React.FC = () => {
  const [stages, setStages] = useState<KanbanStage[]>([
    {
      id: 'new',
      title: 'جديد',
      color: 'bg-gray-100',
      deals: [
        {
          id: '1',
          title: 'نظام إدارة المخزون',
          company: 'شركة التقنية المتقدمة',
          value: 150000,
          probability: 20,
          stage: 'new',
          heatLevel: 'warm',
          nextAction: 'جدولة مكالمة تعريفية',
          lastActivity: new Date('2024-01-10')
        }
      ]
    },
    {
      id: 'qualified',
      title: 'مؤهل',
      color: 'bg-blue-100',
      deals: [
        {
          id: '2',
          title: 'حلول الذكاء الاصطناعي',
          company: 'مجموعة الابتكار',
          value: 300000,
          probability: 60,
          stage: 'qualified',
          heatLevel: 'hot',
          nextAction: 'إرسال عرض سعر مفصل',
          lastActivity: new Date('2024-01-12')
        }
      ]
    },
    {
      id: 'proposal',
      title: 'عرض سعر',
      color: 'bg-yellow-100',
      deals: [
        {
          id: '3',
          title: 'منصة التجارة الإلكترونية',
          company: 'شركة التجارة الذكية',
          value: 200000,
          probability: 75,
          stage: 'proposal',
          heatLevel: 'hot',
          nextAction: 'متابعة قرار الإدارة',
          lastActivity: new Date('2024-01-11')
        }
      ]
    },
    {
      id: 'won',
      title: 'مكتملة',
      color: 'bg-green-100',
      deals: []
    }
  ]);

  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  // الحصول على لون مؤشر الحرارة
  const getHeatColor = (level: string) => {
    switch (level) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-yellow-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // معالجة السحب والإفلات
  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
  };

  const handleDrop = async (targetStageId: string, deal: Deal) => {
    if (deal.stage === targetStageId) return;

    // تحديث الحالة محلياً (Optimistic Update)
    setStages(prev => prev.map(stage => ({
      ...stage,
      deals: stage.id === targetStageId 
        ? [...stage.deals, { ...deal, stage: targetStageId }]
        : stage.deals.filter(d => d.id !== deal.id)
    })));

    // إرسال التحديث للخادم
    try {
      await eventBus.publish({
        type: EventTypes.LEAD_STAGE_CHANGED,
        source: 'kanban-board',
        data: {
          dealId: deal.id,
          fromStage: deal.stage,
          toStage: targetStageId,
          dealValue: deal.value
        }
      });

      // عرض اقتراح ذكي بناءً على المرحلة الجديدة
      showSmartSuggestion(deal, targetStageId);
    } catch (error) {
      console.error('❌ Failed to update deal stage:', error);
      // إعادة الحالة السابقة في حالة الفشل
      setStages(prev => prev.map(stage => ({
        ...stage,
        deals: stage.id === deal.stage 
          ? [...stage.deals, deal]
          : stage.deals.filter(d => d.id !== deal.id)
      })));
    }
  };

  // عرض اقتراح ذكي
  const showSmartSuggestion = (deal: Deal, newStage: string) => {
    let suggestion = '';
    
    switch (newStage) {
      case 'qualified':
        suggestion = `ممتاز! هل تريد إرسال دراسة حالة متعلقة بقطاع ${deal.company}؟`;
        break;
      case 'proposal':
        suggestion = `هل تريد إنشاء عرض سعر تلقائي بناءً على المنتجات المناقشة؟`;
        break;
      case 'won':
        suggestion = `تهانينا! هل تريد إرسال رسالة شكر وبدء عملية التسليم؟`;
        break;
    }

    if (suggestion) {
      // عرض إشعار ذكي (سيتم تطويره في TASK-013)
      console.log('💡 Smart Suggestion:', suggestion);
    }
  };

  return (
    <div className="flex space-x-6 rtl:space-x-reverse overflow-x-auto pb-4">
      {stages.map(stage => (
        <div
          key={stage.id}
          className={`min-w-80 ${stage.color} rounded-lg p-4`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedDeal) {
              handleDrop(stage.id, draggedDeal);
            }
          }}
        >
          {/* عنوان المرحلة */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">{stage.title}</h3>
            <span className="bg-white px-2 py-1 rounded-full text-xs font-medium">
              {stage.deals.length}
            </span>
          </div>

          {/* قائمة الصفقات */}
          <Reorder.Group
            axis="y"
            values={stage.deals}
            onReorder={(newOrder) => {
              setStages(prev => prev.map(s => 
                s.id === stage.id ? { ...s, deals: newOrder } : s
              ));
            }}
            className="space-y-3"
          >
            {stage.deals.map(deal => (
              <Reorder.Item
                key={deal.id}
                value={deal}
                dragListener={false}
              >
                <motion.div
                  className="bg-white rounded-lg p-4 shadow-sm border cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={() => handleDragStart(deal)}
                  onDragEnd={handleDragEnd}
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05, rotate: 2 }}
                >
                  {/* مؤشر الحرارة */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-3 h-3 rounded-full ${getHeatColor(deal.heatLevel)}`}></div>
                    <span className="text-xs text-gray-500">
                      {deal.probability}% احتمالية
                    </span>
                  </div>

                  {/* تفاصيل الصفقة */}
                  <h4 className="font-medium text-gray-900 mb-1">{deal.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{deal.company}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-green-600">
                      {deal.value.toLocaleString('ar-SA')} ريال
                    </span>
                  </div>

                  {/* الإجراء التالي المقترح */}
                  <div className="bg-blue-50 rounded p-2">
                    <p className="text-xs text-blue-800">
                      💡 {deal.nextAction}
                    </p>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* منطقة الإفلات */}
          {draggedDeal && draggedDeal.stage !== stage.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 60 }}
              className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mt-3"
            >
              <span className="text-gray-500 text-sm">إفلات هنا</span>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};