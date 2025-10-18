import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Square, 
  Save, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Settings,
  Eye,
  Activity,
  RotateCcw,
  Type,
  Palette,
  Sparkles,
  Award,
  Shapes,
  FileDown,
  Share2,
  BarChart3,
  Bell,
  Search,
  Users,
  Maximize2,
  Network,
  Pause,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { AdvancedExportTools } from './AdvancedExportTools';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { ThemeToggle } from './ui/theme-toggle';
import { ProgressIndicator } from './ui/progress-indicator';
import { SmartNotifications } from './SmartNotifications';

interface WorkflowToolbarProps {
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: (format: string, settings: any) => Promise<void>;
  nodes?: any[];
  connections?: any[];
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onTogglePreview: () => void;
  onSearch?: () => void;
  onShare?: () => void;
  onCollaboration?: () => void;
  onShowAll?: () => void;
  onAutoLayout?: () => void;
  onShowTypography?: () => void;
  onShowDesignSystem?: () => void;
  onShowVisualStyles?: () => void;
  onShowDemo?: () => void;
  onShowCompliance?: () => void;
  onShowAdvanced?: () => void;
  onShowIcons?: () => void;
  onShowAnalytics?: () => void;
  onShowDashboard?: () => void;
  onShowTemplates?: () => void;
  onReset?: () => void;
  onActivePiecesSetup?: () => void;
  isActivePiecesConnected?: boolean;
  canUndo: boolean;
  canRedo: boolean;
  zoomLevel: number;
  nodeCount: number;
  executionTime?: number;
  executionProgress?: number;
  // Smart Notifications props
  notificationUnreadCount?: number;
  notificationUrgentCount?: number;
  onNotificationClick?: () => void;
}

export function WorkflowToolbarEnhanced({
  isRunning,
  onRun,
  onStop,
  onSave,
  onLoad,
  onExport,
  nodes = [],
  connections = [],
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetView,
  onTogglePreview,
  onSearch,
  onShare,
  onCollaboration,
  onShowAll,
  onAutoLayout,
  onShowTypography,
  onShowDesignSystem,
  onShowVisualStyles,
  onShowDemo,
  onShowCompliance,
  onShowAdvanced,
  onShowIcons,
  onShowAnalytics,
  onShowDashboard,
  onShowTemplates,
  onReset,
  onActivePiecesSetup,
  isActivePiecesConnected = false,
  canUndo,
  canRedo,
  zoomLevel,
  nodeCount,
  executionTime,
  executionProgress = 0,
  notificationUnreadCount = 0,
  notificationUrgentCount = 0,
  onNotificationClick
}: WorkflowToolbarProps) {
  return (
    <motion.div 
      className="flex items-center justify-between p-3 glass border-b border-border shadow-sm relative overflow-hidden"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 opacity-0 z-0"
        animate={{ opacity: isRunning ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Execution Progress Bar */}
      {isRunning && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent z-0"
          initial={{ width: 0 }}
          animate={{ width: `${executionProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="relative z-10 flex items-center justify-center w-full">
        {/* All controls in single row with logical grouping */}
        <div className="flex items-center gap-1">
          {/* 1. عدد العقد */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                key={nodeCount}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                className="rounded-md px-2.5 py-1.5 min-w-[36px] flex items-center justify-center cursor-default bg-background-elevated border border-border"
              >
                <span className="font-mono text-xs font-semibold text-foreground">
                  {nodeCount}
                </span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>عدد العقد</TooltipContent>
          </Tooltip>

          {/* 2. تشغيل */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRun}
                disabled={isRunning}
                variant="ghost"
                size="sm"
                className="interactive focus-ring p-2 h-8 w-8"
              >
                <Play className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>تشغيل</TooltipContent>
          </Tooltip>

          {/* 3. إيقاف */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onStop}
                disabled={!isRunning}
                variant="ghost"
                size="sm"
                className="interactive focus-ring p-2 h-8 w-8"
              >
                {isRunning ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRunning ? 'إيقاف' : 'متوقف'}</TooltipContent>
          </Tooltip>

          {/* فاصل 1 */}
          <div className="w-px h-6 bg-border-strong opacity-60 mx-3"></div>

          {/* 5. حفظ */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onSave} className="interactive focus-ring p-2 h-8 w-8">
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>حفظ</TooltipContent>
          </Tooltip>

          {/* 6. استيراد */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onLoad} className="interactive focus-ring p-2 h-8 w-8">
                <Upload className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>فتح</TooltipContent>
          </Tooltip>

          {/* فاصل 2 */}
          <div className="w-px h-6 bg-border-strong opacity-60 mx-3"></div>

          {/* 8. تراجع */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onUndo}
                disabled={!canUndo}
                className="interactive focus-ring disabled:opacity-50 p-2 h-8 w-8"
              >
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>تراجع</TooltipContent>
          </Tooltip>

          {/* 9. تقدم */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRedo}
                disabled={!canRedo}
                className="interactive focus-ring disabled:opacity-50 p-2 h-8 w-8"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>إعادة</TooltipContent>
          </Tooltip>

          {/* فاصل 3 */}
          <div className="w-px h-6 bg-border-strong opacity-60 mx-3"></div>

          {/* 11. هيكلة */}
          {onAutoLayout && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onAutoLayout} className="interactive focus-ring p-2 h-8 w-8">
                  <Network className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>تخطيط تلقائي</TooltipContent>
            </Tooltip>
          )}

          {/* 12. معاينة */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onTogglePreview} className="interactive focus-ring p-2 h-8 w-8">
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>معاينة</TooltipContent>
          </Tooltip>

          {/* 13. بحث */}
          {onSearch && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onSearch} className="interactive focus-ring p-2 h-8 w-8">
                  <Search className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>بحث</TooltipContent>
            </Tooltip>
          )}

          {/* فاصل 4 */}
          <div className="w-px h-6 bg-border-strong opacity-60 mx-3"></div>

          {/* === مجموعة التعاون والمشاركة - Independent Group === */}
          <div className="flex items-center gap-1 px-2 rounded-lg bg-background-secondary/50 border border-border/30">
            {/* 15. المشاركة */}
            {onShare && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onShare} className="interactive focus-ring p-2 h-8 w-8">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>مشاركة سير العمل</TooltipContent>
              </Tooltip>
            )}

            {/* 16. التعاون */}
            {onCollaboration && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onCollaboration} className="interactive focus-ring p-2 h-8 w-8">
                    <Users className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>إظهار/إخفاء لوحة التعاون</TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* فاصل 5 - بعد مجموعة التعاون */}
          <div className="w-px h-6 bg-border-strong opacity-60 mx-3"></div>

          {/* 17. لوحة المعلومات */}
          {onShowDashboard && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onShowDashboard} className="interactive focus-ring p-2 h-8 w-8">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>لوحة المعلومات</TooltipContent>
            </Tooltip>
          )}

          {/* 17b. مكتبة القوالب */}
          {onShowTemplates && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onShowTemplates} className="interactive focus-ring p-2 h-8 w-8">
                  <Sparkles className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>مكتبة القوالب (Ctrl+Shift+T)</TooltipContent>
            </Tooltip>
          )}

          {/* 18. التنبيهات - مع Popover */}
          {onNotificationClick && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  title="الإشعارات"
                  className="relative p-2 h-8 w-8 hover:bg-hover-bg interactive focus-ring"
                >
                  <Bell className="w-4 h-4" />
                  <AnimatePresence>
                    {notificationUnreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          notificationUrgentCount > 0 
                            ? 'bg-destructive text-destructive-foreground animate-pulse' 
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {notificationUnreadCount > 9 ? '9+' : notificationUnreadCount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[420px] p-0 border-border bg-background-elevated" 
                align="end"
                sideOffset={8}
              >
                <SmartNotifications
                  userId="current-user"
                  workflowId="workflow-demo"
                  onNotificationAction={(notificationId, action) => {
                    // Handle notification action
                  }}
                  onClose={() => {}}
                />
              </PopoverContent>
            </Popover>
          )}

          {/* فاصل 6 - قبل الإعدادات */}
          <div className="w-px h-6 bg-border-strong opacity-60 mx-3"></div>

          {/* 19. الوضع الليلي */}
          <ThemeToggle />

          {/* 20. الإعدادات */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="interactive focus-ring p-2 h-8 w-8">
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>الإعدادات</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
}