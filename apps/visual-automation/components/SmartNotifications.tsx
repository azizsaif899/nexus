import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, X, Check, AlertCircle, Info, CheckCircle, 
  Clock, Users, MessageCircle, Activity, Settings,
  Volume2, VolumeX, Smartphone, Mail, Slack,
  Filter, MoreHorizontal, Star, Archive,
  Calendar, Zap, Target, TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { enhancedToast as toast } from './ui/enhanced-toast';

interface Notification {
  id: string;
  type: 'workflow' | 'collaboration' | 'system' | 'achievement' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  userId?: string;
  workflowId?: string;
  nodeId?: string;
  icon?: React.ReactNode;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'secondary' | 'destructive';
  }>;
  metadata?: Record<string, any>;
}

interface NotificationSettings {
  sound: boolean;
  desktop: boolean;
  email: boolean;
  slack: boolean;
  mobile: boolean;
  frequency: 'instant' | 'digest' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories: {
    workflow: boolean;
    collaboration: boolean;
    system: boolean;
    achievement: boolean;
    reminder: boolean;
  };
}

interface SmartNotificationsProps {
  userId: string;
  workflowId?: string;
  onNotificationAction?: (notificationId: string, action: string) => void;
  onClose?: () => void;
}

export function SmartNotifications({
  userId,
  workflowId,
  onNotificationAction,
  onClose
}: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif1',
      type: 'workflow',
      priority: 'high',
      title: 'نجح تشغيل سير العمل',
      description: 'تم تشغيل سير العمل "معالجة البيانات" بنجاح في 2.3 ثانية',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionable: true,
      workflowId: 'workflow1',
      icon: <CheckCircle className="w-4 h-4 text-success" />,
      actions: [
        { label: 'عرض التفاصيل', action: () => {}, variant: 'default' },
        { label: 'تشغيل مرة أخرى', action: () => {}, variant: 'secondary' }
      ]
    },
    {
      id: 'notif2',
      type: 'collaboration',
      priority: 'medium',
      title: 'تعليق جديد من فاطمة',
      description: 'أضافت تعليقاً على عقدة HTTP Request: "يمكن تحسين الأداء هنا"',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actionable: true,
      userId: 'user2',
      icon: <MessageCircle className="w-4 h-4 text-primary" />,
      actions: [
        { label: 'عرض التعليق', action: () => {}, variant: 'default' },
        { label: 'رد', action: () => {}, variant: 'secondary' }
      ]
    },
    {
      id: 'notif3',
      type: 'system',
      priority: 'low',
      title: 'تحديث النظام',
      description: 'تم تثبيت التحديث الأخير v2.1.0 بنجاح',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      actionable: false,
      icon: <Info className="w-4 h-4 text-foreground-muted" />
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'actionable'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    sound: true,
    desktop: true,
    email: false,
    slack: false,
    mobile: true,
    frequency: 'instant',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    categories: {
      workflow: true,
      collaboration: true,
      system: true,
      achievement: true,
      reminder: true
    }
  });

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    // Filter by read/unread/actionable
    if (filter === 'unread' && notif.read) return false;
    if (filter === 'actionable' && !notif.actionable) return false;
    
    // Filter by category
    if (selectedCategory !== 'all' && notif.type !== selectedCategory) return false;
    
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => !n.read && n.priority === 'urgent').length;

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    if (onNotificationAction) {
      onNotificationAction(id, 'read');
    }
  }, [onNotificationAction]);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success('تم تحديد جميع الإشعارات كمقروءة');
  }, []);

  const handleDeleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('تم حذف الإشعار');
    if (onNotificationAction) {
      onNotificationAction(id, 'delete');
    }
  }, [onNotificationAction]);

  const handleNotificationAction = useCallback((notification: Notification, actionIndex: number) => {
    const action = notification.actions?.[actionIndex];
    if (action) {
      action.action();
      handleMarkAsRead(notification.id);
    }
  }, [handleMarkAsRead]);

  const handleSettingsChange = useCallback((key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('تم حفظ الإعدادات');
  }, []);

  // Render component
  return (
    <div className="w-full p-0 overflow-hidden">
      {/* Header - Ultra Clean & Light */}
      <div className="p-4 pb-3 border-b border-border/30 bg-background/40 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium text-base text-foreground/90">الإشعارات</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-foreground-muted">
                {unreadCount} غير مقروءة
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="h-7 w-7 p-0 hover:bg-background-secondary/50 rounded-lg"
                >
                  <Settings className="w-3.5 h-3.5 text-foreground-muted" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>الإعدادات</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-7 w-7 p-0 hover:bg-background-secondary/50 rounded-lg disabled:opacity-40"
                  disabled={unreadCount === 0}
                >
                  <Check className="w-3.5 h-3.5 text-foreground-muted" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تحديد الكل كمقروء</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Filters - Soft Pills */}
        <div className="flex gap-1.5 mb-2.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-background-secondary/40 text-foreground-muted hover:bg-background-secondary/60 border border-transparent'
            }`}
          >
            الكل <span className="opacity-60">({notifications.length})</span>
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === 'unread'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-background-secondary/40 text-foreground-muted hover:bg-background-secondary/60 border border-transparent'
            }`}
          >
            غير مقروءة <span className="opacity-60">({unreadCount})</span>
          </button>
          <button
            onClick={() => setFilter('actionable')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === 'actionable'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-background-secondary/40 text-foreground-muted hover:bg-background-secondary/60 border border-transparent'
            }`}
          >
            تتطلب إجراء
          </button>
        </div>

        {/* Category Filter - Minimal Chips */}
        <div className="flex gap-1 flex-wrap">
          {['all', 'workflow', 'collaboration', 'system', 'achievement', 'reminder'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-background-secondary/60 text-foreground border border-border/50'
                  : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary/30'
              }`}
            >
              {category === 'all' ? 'الكل' :
               category === 'workflow' ? 'سير العمل' :
               category === 'collaboration' ? 'التعاون' :
               category === 'system' ? 'النظام' :
               category === 'achievement' ? 'الإنجازات' : 'التذكيرات'}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List - Ultra Clean & Soft */}
      <ScrollArea className="max-h-96">
        <div className="p-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-center py-12 px-4"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-background-secondary/30 flex items-center justify-center">
                  <Bell className="w-7 h-7 text-foreground-muted/40" />
                </div>
                <p className="text-sm text-foreground-muted/70 font-medium">لا توجد إشعارات</p>
                <p className="text-xs text-foreground-muted/50 mt-1">ستظهر إشعاراتك هنا</p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`group relative p-3 rounded-xl mb-2 transition-all duration-200 ${
                    notification.read 
                      ? 'bg-background-secondary/20 hover:bg-background-secondary/30' 
                      : 'bg-gradient-to-br from-background-elevated/80 to-background-elevated/60 hover:from-background-elevated/90 hover:to-background-elevated/70 border border-border/20'
                  }`}
                >
                  {/* Unread Indicator Dot */}
                  {!notification.read && (
                    <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon - Softer Colors */}
                    <div className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center ${
                      notification.read 
                        ? 'bg-background-secondary/40' 
                        : 'bg-primary/8'
                    }`}>
                      <div className={notification.read ? 'opacity-50' : 'opacity-80'}>
                        {notification.icon}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-[13px] font-medium leading-tight ${
                              notification.read ? 'text-foreground-muted/70' : 'text-foreground/90'
                            }`}>
                              {notification.title}
                            </h4>
                            
                            {/* Priority Badge - Softer */}
                            {notification.priority !== 'low' && (
                              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${
                                notification.priority === 'urgent' ? 'bg-destructive/10 text-destructive/80' :
                                notification.priority === 'high' ? 'bg-warning/10 text-warning/80' :
                                'bg-primary/10 text-primary/80'
                              }`}>
                                {notification.priority === 'urgent' ? 'عاجل' :
                                 notification.priority === 'high' ? 'مهم' : 'متوسط'}
                              </span>
                            )}
                          </div>

                          <p className={`text-[11px] leading-relaxed mb-2 ${
                            notification.read ? 'text-foreground-muted/60' : 'text-foreground-muted/80'
                          }`}>
                            {notification.description}
                          </p>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-foreground-muted/50 font-medium">
                              {notification.timestamp.toLocaleTimeString('ar', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>

                            {/* Action Buttons - Ultra Soft */}
                            {notification.actionable && notification.actions && (
                              <div className="flex gap-1.5">
                                {notification.actions.map((action, actionIndex) => (
                                  <button
                                    key={actionIndex}
                                    onClick={() => handleNotificationAction(notification, actionIndex)}
                                    className={`text-[10px] font-medium px-2.5 py-1 rounded-md transition-all ${
                                      action.variant === 'destructive'
                                        ? 'bg-destructive/10 text-destructive/80 hover:bg-destructive/15'
                                        : action.variant === 'secondary'
                                        ? 'bg-background-secondary/50 text-foreground-muted hover:bg-background-secondary/70'
                                        : 'bg-primary/10 text-primary/80 hover:bg-primary/15'
                                    }`}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons - Minimal & Clean */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-background-secondary/40 transition-colors"
                                >
                                  <Check className="w-3 h-3 text-foreground-muted/60" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>تحديد كمقروء</TooltipContent>
                            </Tooltip>
                          )}
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-destructive/10 transition-colors group/delete"
                              >
                                <X className="w-3 h-3 text-foreground-muted/60 group-hover/delete:text-destructive/70" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>حذف</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md glass-medium">
          <DialogHeader>
            <DialogTitle>إعدادات الإشعارات</DialogTitle>
            <DialogDescription className="sr-only">
              قم بتخصيص تفضيلات الإشعارات الخاصة بك
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-96">
            <div className="space-y-6 p-1">
              {/* Notification Channels */}
              <div>
                <h4 className="font-medium mb-3">قنوات الإشعار</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm">الصوت</span>
                    </div>
                    <Switch
                      checked={settings.sound}
                      onCheckedChange={(checked) => handleSettingsChange('sound', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <span className="text-sm">سطح المكتب</span>
                    </div>
                    <Switch
                      checked={settings.desktop}
                      onCheckedChange={(checked) => handleSettingsChange('desktop', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">البريد الإلكتروني</span>
                    </div>
                    <Switch
                      checked={settings.email}
                      onCheckedChange={(checked) => handleSettingsChange('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-sm">الهاتف المحمول</span>
                    </div>
                    <Switch
                      checked={settings.mobile}
                      onCheckedChange={(checked) => handleSettingsChange('mobile', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div>
                <h4 className="font-medium mb-3">أنواع الإشعارات</h4>
                <div className="space-y-3">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">
                        {category === 'workflow' ? 'سير العمل' :
                         category === 'collaboration' ? 'التعاون' :
                         category === 'system' ? 'النظام' :
                         category === 'achievement' ? 'الإنجازات' : 'التذكيرات'}
                      </span>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          handleSettingsChange('categories', { 
                            ...settings.categories, 
                            [category]: checked 
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Frequency */}
              <div>
                <h4 className="font-medium mb-3">تكرار الإشعارات</h4>
                <select
                  value={settings.frequency}
                  onChange={(e) => handleSettingsChange('frequency', e.target.value)}
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                >
                  <option value="instant">فوري</option>
                  <option value="digest">ملخص (كل ساعة)</option>
                  <option value="daily">يومي</option>
                  <option value="weekly">أسبوعي</option>
                </select>
              </div>

              <Separator />

              {/* Quiet Hours */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">ساعات الهدوء</h4>
                  <Switch
                    checked={settings.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      handleSettingsChange('quietHours', { 
                        ...settings.quietHours, 
                        enabled: checked 
                      })
                    }
                  />
                </div>

                {settings.quietHours.enabled && (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">من</label>
                      <input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => 
                          handleSettingsChange('quietHours', { 
                            ...settings.quietHours, 
                            start: e.target.value 
                          })
                        }
                        className="w-full p-2 border rounded bg-background text-foreground text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">إلى</label>
                      <input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => 
                          handleSettingsChange('quietHours', { 
                            ...settings.quietHours, 
                            end: e.target.value 
                          })
                        }
                        className="w-full p-2 border rounded bg-background text-foreground text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
