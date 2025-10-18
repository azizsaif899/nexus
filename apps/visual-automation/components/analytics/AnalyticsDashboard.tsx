import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  Clock,
  Database,
  Zap,
  BarChart3,
  X,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ExecutionHistory } from './ExecutionHistory';
import { PerformanceAnalytics } from './PerformanceAnalytics';
import { ErrorTracking } from './ErrorTracking';
import { CostAnalysis } from './CostAnalysis';
import { RealtimeMonitoring } from './RealtimeMonitoring';
import { ResourceUsage } from './ResourceUsage';
import { Card } from '../ui/card';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  executionHistory: any[];
  onRefresh?: () => void;
}

export function AnalyticsDashboard({
  isOpen,
  onClose,
  executionHistory,
  onRefresh
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // حساب المؤشرات الأساسية
  const metrics = useMemo(() => {
    const total = executionHistory.length;
    const successful = executionHistory.filter(e => e.status === 'success').length;
    const failed = executionHistory.filter(e => e.status === 'failed').length;
    const avgDuration = executionHistory.reduce((sum, e) => sum + (e.duration || 0), 0) / total || 0;
    
    return {
      totalExecutions: total,
      successRate: total > 0 ? (successful / total * 100).toFixed(1) : '0',
      failureRate: total > 0 ? (failed / total * 100).toFixed(1) : '0',
      avgDuration: avgDuration.toFixed(0)
    };
  }, [executionHistory]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    const data = JSON.stringify(executionHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-4 z-[9999] glass-intense rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg glass-medium flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-h2 font-semibold text-foreground">
                  لوحة التحليلات والمراقبة
                </h2>
                <p className="text-sm text-foreground-muted">
                  مراقبة شاملة لأداء النظام وسير العمل
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                تصدير
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
            <Card className="p-4 glass-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">إجمالي التنفيذات</p>
                  <p className="text-2xl font-semibold text-foreground">{metrics.totalExecutions}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 glass-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">معدل النجاح</p>
                  <p className="text-2xl font-semibold text-success">{metrics.successRate}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 glass-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">معدل الفشل</p>
                  <p className="text-2xl font-semibold text-destructive">{metrics.failureRate}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 glass-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">متوسط الوقت</p>
                  <p className="text-2xl font-semibold text-foreground">{metrics.avgDuration}ms</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="mx-6 mt-4 inline-flex w-auto">
                <TabsTrigger value="overview" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <Clock className="w-4 h-4" />
                  سجل التنفيذ
                </TabsTrigger>
                <TabsTrigger value="performance" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  الأداء
                </TabsTrigger>
                <TabsTrigger value="errors" className="gap-2">
                  <AlertCircle className="w-4 h-4" />
                  الأخطاء
                </TabsTrigger>
                <TabsTrigger value="costs" className="gap-2">
                  <DollarSign className="w-4 h-4" />
                  التكلفة
                </TabsTrigger>
                <TabsTrigger value="realtime" className="gap-2">
                  <Zap className="w-4 h-4" />
                  مباشر
                </TabsTrigger>
                <TabsTrigger value="resources" className="gap-2">
                  <Database className="w-4 h-4" />
                  الموارد
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto p-6">
                <TabsContent value="overview" className="mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <PerformanceAnalytics executionHistory={executionHistory} />
                    <ErrorTracking executionHistory={executionHistory} />
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <ExecutionHistory executionHistory={executionHistory} />
                </TabsContent>

                <TabsContent value="performance" className="mt-0">
                  <PerformanceAnalytics executionHistory={executionHistory} detailed />
                </TabsContent>

                <TabsContent value="errors" className="mt-0">
                  <ErrorTracking executionHistory={executionHistory} detailed />
                </TabsContent>

                <TabsContent value="costs" className="mt-0">
                  <CostAnalysis executionHistory={executionHistory} />
                </TabsContent>

                <TabsContent value="realtime" className="mt-0">
                  <RealtimeMonitoring />
                </TabsContent>

                <TabsContent value="resources" className="mt-0">
                  <ResourceUsage executionHistory={executionHistory} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
