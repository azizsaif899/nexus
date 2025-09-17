import React from 'react';
import { 
  Home,
  Users,
  UserPlus,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  Activity,
  Calendar,
  FileText,
  Inbox,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
/* NX_STRUCTURE: Consider using path mapping */ import { Button } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { Badge } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { Separator } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { ScrollArea } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../;
/* NX_STRUCTURE: Consider using path mapping */ import { useTheme } from '../../../;
import { ModuleId } from '../../types/app.types';

interface ModuleSidebarProps {
  currentModule: ModuleId;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface SidebarSection {
  title: string;
  titleEn: string;
  items: SidebarItem[];
}

interface SidebarItem {
  id: string;
  label: string;
  labelEn: string;
  icon: React.ElementType;
  badge?: string | number;
  isActive?: boolean;
  onClick?: () => void;
}

// تكوين القوائم حسب الوحدة
const getModuleSidebarConfig = (moduleId: ModuleId): SidebarSection[] => {
  switch (moduleId) {
    case ModuleId.DASHBOARD:
      return [
        {
          title: 'نظرة عامة',
          titleEn: 'Overview',
          items: [
            { id: 'home', label: 'الرئيسية', labelEn: 'Home', icon: Home, isActive: true },
            { id: 'activity', label: 'النشاطات', labelEn: 'Activity', icon: Activity, badge: 5 },
            { id: 'analytics', label: 'الإحصائيات', labelEn: 'Analytics', icon: BarChart3 }
          ]
        },
        {
          title: 'الوصول السريع',
          titleEn: 'Quick Access',
          items: [
            { id: 'customers', label: 'العملاء', labelEn: 'Customers', icon: Users },
            { id: 'messages', label: 'الرسائل', labelEn: 'Messages', icon: MessageSquare, badge: 12 },
            { id: 'calendar', label: 'التقويم', labelEn: 'Calendar', icon: Calendar }
          ]
        }
      ];

    case ModuleId.ADMIN:
      return [
        {
          title: 'إدارة النظام',
          titleEn: 'System Management',
          items: [
            { id: 'dashboard', label: 'لوحة الإدارة', labelEn: 'Admin Dashboard', icon: Home, isActive: true },
            { id: 'users', label: 'المستخدمين', labelEn: 'Users', icon: Users },
            { id: 'settings', label: 'الإعدادات', labelEn: 'Settings', icon: Settings },
            { id: 'reports', label: 'التقارير', labelEn: 'Reports', icon: FileText }
          ]
        },
        {
          title: 'المراقبة',
          titleEn: 'Monitoring',
          items: [
            { id: 'activity', label: 'سجل النشاطات', labelEn: 'Activity Log', icon: Activity },
            { id: 'analytics', label: 'تحليلات النظام', labelEn: 'System Analytics', icon: BarChart3 }
          ]
        }
      ];

    case ModuleId.CRM:
      return [
        {
          title: 'إدارة العملاء',
          titleEn: 'Customer Management',
          items: [
            { id: 'dashboard', label: 'لوحة CRM', labelEn: 'CRM Dashboard', icon: Home, isActive: true },
            { id: 'customers', label: 'قائمة العملاء', labelEn: 'Customers', icon: Users, badge: '1.2K' },
            { id: 'leads', label: 'العملاء المحتملين', labelEn: 'Leads', icon: UserPlus, badge: 45 },
            { id: 'deals', label: 'الصفقات', labelEn: 'Deals', icon: Star, badge: 12 }
          ]
        },
        {
          title: 'التقارير والتحليل',
          titleEn: 'Reports & Analytics',
          items: [
            { id: 'sales-report', label: 'تقرير المبيعات', labelEn: 'Sales Report', icon: BarChart3 },
            { id: 'pipeline', label: 'مسار المبيعات', labelEn: 'Sales Pipeline', icon: Activity },
            { id: 'forecast', label: 'التوقعات', labelEn: 'Forecast', icon: FileText }
          ]
        }
      ];

    case ModuleId.CHATBOT:
      return [
        {
          title: 'المحادثات',
          titleEn: 'Conversations',
          items: [
            { id: 'dashboard', label: 'لوحة المحادثات', labelEn: 'Chat Dashboard', icon: Home, isActive: true },
            { id: 'active', label: 'المحادثات النشطة', labelEn: 'Active Chats', icon: MessageSquare, badge: 8 },
            { id: 'inbox', label: 'صندوق الوارد', labelEn: 'Inbox', icon: Inbox, badge: 23 },
            { id: 'history', label: 'سجل المحادثات', labelEn: 'Chat History', icon: FileText }
          ]
        },
        {
          title: 'الإعدادات',
          titleEn: 'Configuration',
          items: [
            { id: 'bot-settings', label: 'إعدادات البوت', labelEn: 'Bot Settings', icon: Settings },
            { id: 'responses', label: 'الردود التلقائية', labelEn: 'Auto Responses', icon: MessageSquare },
            { id: 'analytics', label: 'تحليل المحادثات', labelEn: 'Chat Analytics', icon: BarChart3 }
          ]
        }
      ];

    case ModuleId.ANALYTICS:
      return [
        {
          title: 'التحليلات',
          titleEn: 'Analytics',
          items: [
            { id: 'dashboard', label: 'لوحة التحليلات', labelEn: 'Analytics Dashboard', icon: Home, isActive: true },
            { id: 'overview', label: 'نظرة شاملة', labelEn: 'Overview', icon: BarChart3 },
            { id: 'performance', label: 'الأداء', labelEn: 'Performance', icon: Activity },
            { id: 'reports', label: 'التقارير', labelEn: 'Reports', icon: FileText }
          ]
        },
        {
          title: 'البيانات',
          titleEn: 'Data',
          items: [
            { id: 'users', label: 'تحليل المستخدمين', labelEn: 'User Analytics', icon: Users },
            { id: 'sales', label: 'تحليل المبيعات', labelEn: 'Sales Analytics', icon: BarChart3 },
            { id: 'custom', label: 'تقارير مخصصة', labelEn: 'Custom Reports', icon: Settings }
          ]
        }
      ];

    case ModuleId.AUTOMATION:
      return [
        {
          title: 'الأتمتة',
          titleEn: 'Automation',
          items: [
            { id: 'dashboard', label: 'لوحة الأتمتة', labelEn: 'Automation Dashboard', icon: Home, isActive: true },
            { id: 'workflows', label: 'سير العمل', labelEn: 'Workflows', icon: Activity, badge: 15 },
            { id: 'triggers', label: 'المحفزات', labelEn: 'Triggers', icon: Star },
            { id: 'history', label: 'سجل التنفيذ', labelEn: 'Execution Log', icon: FileText }
          ]
        },
        {
          title: 'الإعدادات',
          titleEn: 'Configuration',
          items: [
            { id: 'rules', label: 'القواعد', labelEn: 'Rules', icon: Settings },
            { id: 'conditions', label: 'الشروط', labelEn: 'Conditions', icon: HelpCircle }
          ]
        }
      ];

    default:
      return [];
  }
};

export const ModuleSidebar: React.FC<ModuleSidebarProps> = ({ 
  currentModule, 
  isCollapsed = false,
  onToggle 
}) => {
  const { language } = useTheme();
  const sidebarConfig = getModuleSidebarConfig(currentModule);

  return (
    <div className={`relative flex flex-col bg-card border-r transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Toggle Button */}
      {onToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      )}

      <ScrollArea className="flex-1 px-3 py-6">
        <div className="space-y-6">
          {sidebarConfig.map((section, index) => (
            <div key={index}>
              {!isCollapsed && (
                <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {language === 'ar' ? section.title : section.titleEn}
                </h3>
              )}
              
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={item.isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        isCollapsed ? 'px-2' : 'px-3'
                      } ${item.isActive ? 'shadow-sm' : ''}`}
                      onClick={item.onClick}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">
                            {language === 'ar' ? item.label : item.labelEn}
                          </span>
                          {item.badge && (
                            <Badge 
                              variant={item.isActive ? "default" : "secondary"}
                              className="h-5 px-1.5 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  );
                })}
              </div>
              
              {index < sidebarConfig.length - 1 && !isCollapsed && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Help Section */}
      {!isCollapsed && (
        <div className="border-t p-3">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <HelpCircle className="h-4 w-4" />
            <span>{language === 'ar' ? 'المساعدة' : 'Help & Support'}</span>
          </Button>
        </div>
      )}
    </div>
  );
};