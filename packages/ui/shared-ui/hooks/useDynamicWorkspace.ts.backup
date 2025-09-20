/**
 * 🎨 Dynamic Workspace Hook - TASK-012
 * مساحة العمل التي تتكيف مع المستخدم
 */

import { useState, useEffect } from 'react';
import { eventBus, EventTypes } from '../../../../packages/core-logic/src/event-bus';

interface WorkspaceItem {
  id: string;
  title: string;
  icon: string;
  path: string;
  category: string;
  usage: number;
  lastUsed: Date;
  visible: boolean;
}

interface UserPreferences {
  userId: string;
  role: string;
  frequentItems: string[];
  hiddenItems: string[];
  customOrder: string[];
}

export const useDynamicWorkspace = (userId?: string) => {
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([
    {
      id: 'dashboard',
      title: 'لوحة التحكم',
      icon: '🏠',
      path: '/dashboard',
      category: 'main',
      usage: 0,
      lastUsed: new Date(),
      visible: true
    },
    {
      id: 'crm-leads',
      title: 'العملاء المحتملون',
      icon: '👥',
      path: '/crm/leads',
      category: 'crm',
      usage: 0,
      lastUsed: new Date(),
      visible: true
    },
    {
      id: 'crm-pipeline',
      title: 'خط الأنابيب',
      icon: '📊',
      path: '/crm/pipeline',
      category: 'crm',
      usage: 0,
      lastUsed: new Date(),
      visible: true
    },
    {
      id: 'accounting',
      title: 'المحاسبة',
      icon: '💰',
      path: '/accounting',
      category: 'finance',
      usage: 0,
      lastUsed: new Date(),
      visible: true
    },
    {
      id: 'sales-report',
      title: 'تقرير المبيعات',
      icon: '📈',
      path: '/reports/sales',
      category: 'reports',
      usage: 0,
      lastUsed: new Date(),
      visible: false
    },
    {
      id: 'ai-insights',
      title: 'رؤى الذكاء الاصطناعي',
      icon: '🧠',
      path: '/ai/insights',
      category: 'ai',
      usage: 0,
      lastUsed: new Date(),
      visible: false
    }
  ]);

  const [preferences, setPreferences] = useState<UserPreferences>({
    userId: userId || 'default',
    role: 'manager',
    frequentItems: [],
    hiddenItems: [],
    customOrder: []
  });

  const [isLearning, setIsLearning] = useState(true);

  // تتبع استخدام العناصر
  const trackUsage = async (itemId: string) => {
    setWorkspaceItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, usage: item.usage + 1, lastUsed: new Date() }
        : item
    ));

    await eventBus.publish({
      type: EventTypes.USER_ACTION,
      source: 'dynamic-workspace',
      data: { action: 'item-used', itemId, userId }
    });
  };

  // تحليل أنماط الاستخدام وتكييف الواجهة
  const adaptWorkspace = () => {
    setWorkspaceItems(prev => {
      const updated = [...prev];
      
      // إظهار العناصر المستخدمة بكثرة
      updated.forEach(item => {
        if (item.usage >= 5 && !item.visible) {
          item.visible = true;
          // Removed console.log
        }
        
        // إخفاء العناصر غير المستخدمة
        if (item.usage === 0 && item.category !== 'main') {
          const daysSinceLastUse = (Date.now() - item.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceLastUse > 7) {
            item.visible = false;
            // Removed console.log
          }
        }
      });

      // ترتيب حسب الاستخدام
      return updated.sort((a, b) => {
        if (a.category === 'main') return -1;
        if (b.category === 'main') return 1;
        return b.usage - a.usage;
      });
    });
  };

  // تخصيص حسب الدور
  const customizeByRole = (role: string) => {
    const roleConfigs = {
      'sales-manager': {
        prioritize: ['crm-leads', 'crm-pipeline', 'sales-report'],
        hide: ['accounting']
      },
      'accountant': {
        prioritize: ['accounting', 'dashboard'],
        hide: ['crm-leads', 'crm-pipeline']
      },
      'ceo': {
        prioritize: ['dashboard', 'ai-insights', 'sales-report'],
        hide: []
      }
    };

    const config = roleConfigs[role as keyof typeof roleConfigs];
    if (config) {
      setWorkspaceItems(prev => prev.map(item => ({
        ...item,
        visible: !config.hide.includes(item.id),
        usage: config.prioritize.includes(item.id) ? item.usage + 10 : item.usage
      })));
    }
  };

  // حفظ التفضيلات
  const savePreferences = async () => {
    const newPreferences = {
      ...preferences,
      frequentItems: workspaceItems
        .filter(item => item.usage >= 5)
        .map(item => item.id),
      hiddenItems: workspaceItems
        .filter(item => !item.visible)
        .map(item => item.id)
    };

    setPreferences(newPreferences);
    localStorage.setItem('workspace-preferences', JSON.stringify(newPreferences));
  };

  // تحميل التفضيلات المحفوظة
  const loadPreferences = () => {
    const saved = localStorage.getItem('workspace-preferences');
    if (saved) {
      const savedPrefs = JSON.parse(saved);
      setPreferences(savedPrefs);
      
      // تطبيق التفضيلات المحفوظة
      setWorkspaceItems(prev => prev.map(item => ({
        ...item,
        visible: !savedPrefs.hiddenItems.includes(item.id),
        usage: savedPrefs.frequentItems.includes(item.id) ? item.usage + 5 : item.usage
      })));
    }
  };

  // تشغيل التكيف التلقائي
  useEffect(() => {
    loadPreferences();
    
    const interval = setInterval(() => {
      if (isLearning) {
        adaptWorkspace();
        savePreferences();
      }
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, [isLearning]);

  // الاستماع لتغييرات الدور
  useEffect(() => {
    const handleRoleChange = (event: any) => {
      if (event.data.role) {
        customizeByRole(event.data.role);
        setPreferences(prev => ({ ...prev, role: event.data.role }));
      }
    };

    eventBus.subscribe('user.role.changed', handleRoleChange);
    return () => eventBus.unsubscribe('user.role.changed', handleRoleChange);
  }, []);

  return {
    workspaceItems: workspaceItems.filter(item => item.visible),
    allItems: workspaceItems,
    preferences,
    isLearning,
    trackUsage,
    setLearning: setIsLearning,
    customizeByRole,
    resetWorkspace: () => {
      localStorage.removeItem('workspace-preferences');
      window.location.reload();
    }
  };
};