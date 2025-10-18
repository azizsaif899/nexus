import React, { useState } from 'react';
import { 
  CheckSquare, Calendar, Clock, User, Plus,
  Filter, Search, MoreVertical, Check, X
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
import { useTheme } from '../../ThemeProvider';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  relatedTo?: string;
}

function TasksManagement() {
  const { resolvedTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'متابعة مع شركة التقنية',
      description: 'الاتصال لمناقشة تفاصيل العرض',
      dueDate: '2025-10-16',
      priority: 'high',
      status: 'pending',
      assignee: 'أحمد',
      relatedTo: 'نظام ERP'
    },
    {
      id: '2',
      title: 'إعداد العرض التقديمي',
      description: 'تحضير presentation للعميل الجديد',
      dueDate: '2025-10-17',
      priority: 'high',
      status: 'in-progress',
      assignee: 'سارة',
      relatedTo: 'موقع إلكتروني'
    },
    {
      id: '3',
      title: 'مراجعة العقد',
      description: 'التأكد من جميع البنود القانونية',
      dueDate: '2025-10-18',
      priority: 'medium',
      status: 'pending',
      assignee: 'محمد',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'in-progress': return 'bg-primary/10 text-primary border-primary/20';
      case 'pending': return 'bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20';
      default: return '';
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        return { ...task, status: newStatus };
      }
      return task;
    }));
    toast.success('تم تحديث حالة المهمة');
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold mb-2" style={{ fontSize: '24px' }}>
            إدارة المهام
          </h2>
          <p className="text-foreground-muted">
            متابعة وإدارة المهام اليومية
          </p>
        </div>
        <Button className="glass-button-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          مهمة جديدة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-light p-4 cursor-pointer hover:glass-medium" onClick={() => setFilter('all')}>
          <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>الإجمالي</p>
          <p className="font-semibold" style={{ fontSize: '24px' }}>{tasks.length}</p>
        </Card>
        <Card className="glass-light p-4 cursor-pointer hover:glass-medium" onClick={() => setFilter('pending')}>
          <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>قيد الانتظار</p>
          <p className="font-semibold" style={{ fontSize: '24px' }}>
            {tasks.filter(t => t.status === 'pending').length}
          </p>
        </Card>
        <Card className="glass-light p-4 cursor-pointer hover:glass-medium" onClick={() => setFilter('in-progress')}>
          <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>قيد التنفيذ</p>
          <p className="font-semibold" style={{ fontSize: '24px' }}>
            {tasks.filter(t => t.status === 'in-progress').length}
          </p>
        </Card>
        <Card className="glass-light p-4 cursor-pointer hover:glass-medium" onClick={() => setFilter('completed')}>
          <p className="text-foreground-muted mb-1" style={{ fontSize: '13px' }}>مكتملة</p>
          <p className="font-semibold" style={{ fontSize: '24px' }}>
            {tasks.filter(t => t.status === 'completed').length}
          </p>
        </Card>
      </div>

      {/* Tasks List */}
      <Card className="glass-light p-6">
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-hover-bg transition-colors"
            >
              <Checkbox 
                checked={task.status === 'completed'}
                onCheckedChange={() => handleToggleTask(task.id)}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-foreground-muted" style={{ fontSize: '13px' }}>
                      {task.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority === 'high' ? 'عاجل' : task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status === 'completed' ? 'مكتمل' : task.status === 'in-progress' ? 'قيد التنفيذ' : 'معلق'}
                  </Badge>
                  <div className="flex items-center gap-1 text-foreground-muted" style={{ fontSize: '12px' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(task.dueDate).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-foreground-muted" style={{ fontSize: '12px' }}>
                    <User className="w-3.5 h-3.5" />
                    <span>{task.assignee}</span>
                  </div>
                  {task.relatedTo && (
                    <span className="text-foreground-muted" style={{ fontSize: '12px' }}>
                      متعلق بـ: {task.relatedTo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default TasksManagement;
