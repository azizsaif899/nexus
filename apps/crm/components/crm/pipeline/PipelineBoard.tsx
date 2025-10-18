import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  DollarSign, Calendar, User, Phone, Mail, 
  MoreVertical, Eye, Edit, Trash2, Plus, TrendingUp
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { useTheme } from '../../ThemeProvider';
import { toast } from 'sonner';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  probability: number;
  contact: string;
  email: string;
  phone: string;
  closeDate: string;
  stage: string;
  priority: 'high' | 'medium' | 'low';
}

interface Stage {
  id: string;
  name: string;
  deals: Deal[];
  color: string;
}

const ItemType = 'DEAL';

interface DealCardProps {
  deal: Deal;
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
}

function DealCard({ deal, onView, onEdit, onDelete }: DealCardProps) {
  const { resolvedTheme } = useTheme();
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: deal.id, stage: deal.stage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return '';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'عاجل';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return priority;
    }
  };

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`
        glass-light p-4 rounded-xl cursor-move hover:glass-medium transition-all
        ${isDragging ? 'rotate-2' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium mb-1">{deal.title}</h4>
          <p className="text-foreground-muted" style={{ fontSize: '13px' }}>
            {deal.company}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(deal)}>
              <Eye className="w-4 h-4 ml-2" />
              عرض التفاصيل
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(deal)}>
              <Edit className="w-4 h-4 ml-2" />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(deal.id)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-foreground-muted" style={{ fontSize: '12px' }}>
          <DollarSign className="w-3.5 h-3.5" />
          <span className="font-medium text-foreground">
            {deal.value.toLocaleString('ar-SA')} ر.س
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-foreground-muted" style={{ fontSize: '12px' }}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>احتمالية: {deal.probability}%</span>
        </div>

        <div className="flex items-center gap-2 text-foreground-muted" style={{ fontSize: '12px' }}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(deal.closeDate).toLocaleDateString('ar-SA')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full glass-medium flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-foreground-muted" style={{ fontSize: '12px' }}>
            {deal.contact}
          </span>
        </div>
        
        <Badge className={getPriorityColor(deal.priority)}>
          {getPriorityText(deal.priority)}
        </Badge>
      </div>
    </div>
  );
}

interface StageColumnProps {
  stage: Stage;
  onDrop: (dealId: string, targetStage: string) => void;
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
  onAddDeal: (stageId: string) => void;
}

function StageColumn({ stage, onDrop, onView, onEdit, onDelete, onAddDeal }: StageColumnProps) {
  const { resolvedTheme } = useTheme();
  
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    drop: (item: { id: string; stage: string }) => {
      if (item.stage !== stage.id) {
        onDrop(item.id, stage.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const totalValue = stage.deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div 
      ref={drop}
      className={`
        flex-shrink-0 w-80 glass-light rounded-xl p-4 transition-all
        ${isOver ? 'ring-2 ring-primary' : ''}
      `}
    >
      {/* Stage Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color }}
            ></div>
            <h3 className="font-semibold">{stage.name}</h3>
            <Badge variant="outline" className="rounded-full">
              {stage.deals.length}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAddDeal(stage.id)}
            className="h-7 w-7 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-foreground-muted" style={{ fontSize: '12px' }}>
          {totalValue.toLocaleString('ar-SA')} ر.س
        </p>
      </div>

      {/* Deals List */}
      <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto">
        {stage.deals.length === 0 ? (
          <div className="text-center py-8 text-foreground-muted">
            <p style={{ fontSize: '13px' }}>لا توجد صفقات</p>
          </div>
        ) : (
          stage.deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PipelineBoard() {
  const { resolvedTheme } = useTheme();
  
  const [stages, setStages] = useState<Stage[]>([
    {
      id: 'prospect',
      name: 'عميل محتمل',
      color: '#667781',
      deals: [
        {
          id: '1',
          title: 'نظام ERP للمصنع',
          company: 'مصنع الرياض للصناعات',
          value: 450000,
          probability: 20,
          contact: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+966 50 123 4567',
          closeDate: '2025-12-15',
          stage: 'prospect',
          priority: 'high'
        },
        {
          id: '2',
          title: 'موقع إلكتروني تجاري',
          company: 'متجر النخبة',
          value: 85000,
          probability: 15,
          contact: 'سارة خالد',
          email: 'sara@example.com',
          phone: '+966 55 234 5678',
          closeDate: '2025-11-30',
          stage: 'prospect',
          priority: 'medium'
        },
      ],
    },
    {
      id: 'qualified',
      name: 'مؤهل',
      color: '#d97706',
      deals: [
        {
          id: '3',
          title: 'نظام CRM سحابي',
          company: 'شركة التسويق الذكي',
          value: 280000,
          probability: 40,
          contact: 'محمد علي',
          email: 'mohammed@example.com',
          phone: '+966 50 345 6789',
          closeDate: '2025-11-20',
          stage: 'qualified',
          priority: 'high'
        },
      ],
    },
    {
      id: 'proposal',
      name: 'عرض مقدم',
      color: '#059669',
      deals: [
        {
          id: '4',
          title: 'تطبيق موبايل للتوصيل',
          company: 'خدمات التوصيل السريع',
          value: 320000,
          probability: 60,
          contact: 'فاطمة حسن',
          email: 'fatima@example.com',
          phone: '+966 55 456 7890',
          closeDate: '2025-11-10',
          stage: 'proposal',
          priority: 'high'
        },
        {
          id: '5',
          title: 'نظام إدارة المخزون',
          company: 'مستودعات المدينة',
          value: 195000,
          probability: 55,
          contact: 'عمر يوسف',
          email: 'omar@example.com',
          phone: '+966 50 567 8901',
          closeDate: '2025-11-25',
          stage: 'proposal',
          priority: 'medium'
        },
      ],
    },
    {
      id: 'negotiation',
      name: 'مفاوضات',
      color: '#030213',
      deals: [
        {
          id: '6',
          title: 'منصة تعليمية إلكترونية',
          company: 'أكاديمية المستقبل',
          value: 540000,
          probability: 80,
          contact: 'نورة أحمد',
          email: 'noura@example.com',
          phone: '+966 55 678 9012',
          closeDate: '2025-11-05',
          stage: 'negotiation',
          priority: 'high'
        },
      ],
    },
    {
      id: 'won',
      name: 'مغلقة',
      color: '#059669',
      deals: [
        {
          id: '7',
          title: 'نظام المحاسبة',
          company: 'مكتب الخبراء',
          value: 125000,
          probability: 100,
          contact: 'خالد سعيد',
          email: 'khaled@example.com',
          phone: '+966 50 789 0123',
          closeDate: '2025-10-28',
          stage: 'won',
          priority: 'low'
        },
      ],
    },
  ]);

  const handleDrop = useCallback((dealId: string, targetStage: string) => {
    setStages(prevStages => {
      const newStages = [...prevStages];
      let movedDeal: Deal | null = null;
      let sourceStageIndex = -1;

      // Find and remove deal from source stage
      newStages.forEach((stage, index) => {
        const dealIndex = stage.deals.findIndex(d => d.id === dealId);
        if (dealIndex !== -1) {
          movedDeal = { ...stage.deals[dealIndex], stage: targetStage };
          stage.deals = stage.deals.filter(d => d.id !== dealId);
          sourceStageIndex = index;
        }
      });

      // Add deal to target stage
      if (movedDeal) {
        const targetStageIndex = newStages.findIndex(s => s.id === targetStage);
        if (targetStageIndex !== -1) {
          newStages[targetStageIndex].deals.push(movedDeal);
          toast.success('تم نقل الصفقة بنجاح');
        }
      }

      return newStages;
    });
  }, []);

  const handleViewDeal = (deal: Deal) => {
    toast.info(`عرض تفاصيل: ${deal.title}`);
  };

  const handleEditDeal = (deal: Deal) => {
    toast.info(`تعديل: ${deal.title}`);
  };

  const handleDeleteDeal = (id: string) => {
    setStages(prevStages => {
      return prevStages.map(stage => ({
        ...stage,
        deals: stage.deals.filter(d => d.id !== id)
      }));
    });
    toast.success('تم حذف الصفقة');
  };

  const handleAddDeal = (stageId: string) => {
    toast.info(`إضافة صفقة جديدة في: ${stages.find(s => s.id === stageId)?.name}`);
  };

  const totalPipelineValue = stages.reduce((sum, stage) => {
    return sum + stage.deals.reduce((stageSum, deal) => stageSum + deal.value, 0);
  }, 0);

  const totalDeals = stages.reduce((sum, stage) => sum + stage.deals.length, 0);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="font-semibold mb-2" style={{ fontSize: '24px' }}>
            خط المبيعات
          </h2>
          <p className="text-foreground-muted">
            إدارة الصفقات عبر مراحل البيع المختلفة
          </p>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>
                  إجمالي الصفقات
                </p>
                <p className="font-semibold" style={{ fontSize: '24px' }}>
                  {totalDeals}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="glass-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>
                  القيمة الإجمالية
                </p>
                <p className="font-semibold" style={{ fontSize: '24px' }}>
                  {(totalPipelineValue / 1000).toFixed(1)}M
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="glass-light p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>
                  معدل التحويل
                </p>
                <p className="font-semibold" style={{ fontSize: '24px' }}>
                  24.8%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl glass-medium flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </Card>
        </div>

        {/* Pipeline Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {stages.map((stage) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                onDrop={handleDrop}
                onView={handleViewDeal}
                onEdit={handleEditDeal}
                onDelete={handleDeleteDeal}
                onAddDeal={handleAddDeal}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default PipelineBoard;
