import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Zap, Activity, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';

export function RealtimeMonitoring() {
  const [currentMetrics, setCurrentMetrics] = useState({
    runningExecutions: 0,
    queuedExecutions: 0,
    throughput: 0,
    avgLatency: 0,
    errorRate: 0,
    systemHealth: {
      cpu: 0,
      memory: 0,
      network: 0
    }
  });

  // محاكاة بيانات في الوقت الفعلي
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetrics({
        runningExecutions: Math.floor(Math.random() * 5),
        queuedExecutions: Math.floor(Math.random() * 10),
        throughput: Math.floor(Math.random() * 50) + 20,
        avgLatency: Math.floor(Math.random() * 200) + 50,
        errorRate: Math.random() * 5,
        systemHealth: {
          cpu: Math.floor(Math.random() * 40) + 20,
          memory: Math.floor(Math.random() * 50) + 30,
          network: Math.floor(Math.random() * 30) + 10
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (value: number) => {
    if (value < 50) return 'text-success';
    if (value < 75) return 'text-warning';
    return 'text-destructive';
  };

  const getHealthBgColor = (value: number) => {
    if (value < 50) return 'bg-success/10';
    if (value < 75) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-foreground-muted">قيد التنفيذ</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-primary" />
            </motion.div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-foreground">{currentMetrics.runningExecutions}</p>
            <span className="text-sm text-foreground-muted">عملية</span>
          </div>
          {currentMetrics.runningExecutions > 0 && (
            <div className="mt-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                نشط الآن
              </Badge>
            </div>
          )}
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-foreground-muted">في الانتظار</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-foreground">{currentMetrics.queuedExecutions}</p>
            <span className="text-sm text-foreground-muted">عملية</span>
          </div>
          {currentMetrics.queuedExecutions > 0 && (
            <div className="mt-2">
              <Badge className="bg-warning/10 text-warning border-warning/20">
                في الطابور
              </Badge>
            </div>
          )}
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 glass-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground-muted">الإنتاجية</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{currentMetrics.throughput}</p>
          <p className="text-xs text-foreground-muted mt-1">عملية/دقيقة</p>
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-success" />
            <span className="text-sm text-foreground-muted">زمن الاستجابة</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{currentMetrics.avgLatency}ms</p>
          <p className="text-xs text-foreground-muted mt-1">متوسط</p>
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-foreground-muted">معدل الخطأ</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{currentMetrics.errorRate.toFixed(1)}%</p>
          <p className="text-xs text-foreground-muted mt-1">آخر ساعة</p>
        </Card>
      </div>

      {/* System Health */}
      <Card className="p-6 glass-subtle">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-h3 font-semibold text-foreground">صحة النظام</h3>
        </div>
        
        <div className="space-y-4">
          {/* CPU */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">المعالج (CPU)</span>
              <span className={`text-sm font-semibold ${getHealthColor(currentMetrics.systemHealth.cpu)}`}>
                {currentMetrics.systemHealth.cpu}%
              </span>
            </div>
            <div className="h-2 bg-background-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getHealthBgColor(currentMetrics.systemHealth.cpu)}`}
                initial={{ width: 0 }}
                animate={{ width: `${currentMetrics.systemHealth.cpu}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Memory */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">الذاكرة (RAM)</span>
              <span className={`text-sm font-semibold ${getHealthColor(currentMetrics.systemHealth.memory)}`}>
                {currentMetrics.systemHealth.memory}%
              </span>
            </div>
            <div className="h-2 bg-background-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getHealthBgColor(currentMetrics.systemHealth.memory)}`}
                initial={{ width: 0 }}
                animate={{ width: `${currentMetrics.systemHealth.memory}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Network */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">الشبكة</span>
              <span className={`text-sm font-semibold ${getHealthColor(currentMetrics.systemHealth.network)}`}>
                {currentMetrics.systemHealth.network}%
              </span>
            </div>
            <div className="h-2 bg-background-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getHealthBgColor(currentMetrics.systemHealth.network)}`}
                initial={{ width: 0 }}
                animate={{ width: `${currentMetrics.systemHealth.network}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">النظام يعمل بشكل طبيعي</span>
          </div>
        </div>
      </Card>

      {/* Live Feed */}
      <Card className="p-6 glass-subtle">
        <h3 className="text-h3 font-semibold text-foreground mb-4">البث المباشر</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {currentMetrics.runningExecutions > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-background/50 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="flex-1">
                <p className="text-sm text-foreground">عملية قيد التنفيذ...</p>
                <p className="text-xs text-foreground-muted">
                  {new Date().toLocaleTimeString('ar-SA')}
                </p>
              </div>
            </motion.div>
          )}
          
          {currentMetrics.runningExecutions === 0 && currentMetrics.queuedExecutions === 0 && (
            <div className="text-center py-8 text-foreground-muted">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">لا توجد عمليات نشطة حالياً</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
