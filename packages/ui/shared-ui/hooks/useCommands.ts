import { useState, useEffect, useCallback } from 'react';

interface Command {
  id: string;
  title: string;
  description: string;
  category: 'navigation' | 'action' | 'query' | 'automation';
  shortcut?: string;
  priority: number;
  execute: () => Promise<void>;
}

export const useCommands = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);

  // تحميل الأوامر المتاحة
  const loadCommands = useCallback(async () => {
    setLoading(true);
    try {
      // أوامر افتراضية
      setCommands(getDefaultCommands());
    } catch (error) {
      console.error('Error loading commands:', error);
      setCommands(getDefaultCommands());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCommands();
  }, [loadCommands]);

  // الأوامر الافتراضية
  const getDefaultCommands = (): Command[] => [
    {
      id: 'nav-dashboard',
      title: 'الذهاب إلى لوحة التحكم',
      description: 'عرض لوحة التحكم الرئيسية مع الإحصائيات والرؤى',
      category: 'navigation',
      shortcut: 'Ctrl+D',
      priority: 10,
      execute: async () => {
        window.location.href = '/crm/dashboard';
      }
    },
    {
      id: 'nav-leads',
      title: 'عرض العملاء المحتملين',
      description: 'قائمة جميع العملاء المحتملين مع إمكانية الفلترة',
      category: 'navigation',
      shortcut: 'Ctrl+L',
      priority: 9,
      execute: async () => {
        window.location.href = '/crm/leads';
      }
    },
    {
      id: 'action-create-lead',
      title: 'إنشاء عميل محتمل جديد',
      description: 'إضافة عميل محتمل جديد إلى النظام',
      category: 'action',
      shortcut: 'Ctrl+N',
      priority: 10,
      execute: async () => {
        window.open('/crm/leads/new', '_blank');
      }
    },
    {
      id: 'query-hot-leads',
      title: 'العملاء الحارين',
      description: 'عرض العملاء المحتملين عالي الأولوية',
      category: 'query',
      priority: 9,
      execute: async () => {
        window.location.href = '/crm/leads?filter=hot';
      }
    },
    {
      id: 'auto-qualify-leads',
      title: 'تأهيل العملاء تلقائياً',
      description: 'تشغيل وكيل تأهيل العملاء المحتملين',
      category: 'automation',
      priority: 8,
      execute: async () => {
        const response = await fetch('/api/agents/lead-qualification', {
          method: 'POST'
        });
        if (response.ok) {
          alert('تم تشغيل وكيل التأهيل بنجاح');
        }
      }
    }
  ];

  // تنفيذ أمر محدد
  const executeCommand = useCallback(async (commandId: string) => {
    const command = commands.find(cmd => cmd.id === commandId);
    if (command) {
      await command.execute();
    }
  }, [commands]);

  return {
    commands: commands.sort((a, b) => b.priority - a.priority),
    executeCommand,
    loading,
    reload: loadCommands
  };
};