import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { TrendingUp, TrendingDown, Clock, Zap, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceAnalyticsProps {
  executionHistory: any[];
  detailed?: boolean;
}

export function PerformanceAnalytics({ executionHistory, detailed = false }: PerformanceAnalyticsProps) {
  // حساب المؤشرات
  const metrics = useMemo(() => {
    if (executionHistory.length === 0) {
      return {
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        trend: 0,
        fastestNode: null,
        slowestNode: null,
        performanceTrend: [],
        nodePerformance: []
      };
    }

    const durations = executionHistory.map(e => e.duration || 0).sort((a, b) => a - b);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    // Percentiles
    const p50 = durations[Math.floor(durations.length * 0.5)];
    const p95 = durations[Math.floor(durations.length * 0.95)];
    const p99 = durations[Math.floor(durations.length * 0.99)];

    // اتجاه الأداء
    const recentAvg = executionHistory.slice(-10).reduce((sum, e) => sum + (e.duration || 0), 0) / Math.min(10, executionHistory.length);
    const trend = ((avgDuration - recentAvg) / avgDuration) * 100;

    // بيانات الرسم البياني للاتجاه
    const performanceTrend = executionHistory.slice(-20).map((exec, idx) => ({
      index: idx + 1,
      duration: exec.duration || 0,
      timestamp: new Date(exec.startTime).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }));

    // أداء العقد
    const nodeStats = new Map<string, { total: number; count: number; type: string }>();
    executionHistory.forEach(exec => {
      if (exec.nodeExecutions) {
        exec.nodeExecutions.forEach((node: any) => {
          const key = node.nodeType;
          if (!nodeStats.has(key)) {
            nodeStats.set(key, { total: 0, count: 0, type: key });
          }
          const stats = nodeStats.get(key)!;
          stats.total += node.duration || 0;
          stats.count += 1;
        });
      }
    });

    const nodePerformance = Array.from(nodeStats.entries())
      .map(([type, stats]) => ({
        type,
        avgDuration: stats.total / stats.count,
        count: stats.count
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration);

    return {
      avgDuration,
      minDuration,
      maxDuration,
      p50,
      p95,
      p99,
      trend,
      fastestNode: nodePerformance[nodePerformance.length - 1],
      slowestNode: nodePerformance[0],
      performanceTrend,
      nodePerformance: nodePerformance.slice(0, 10)
    };
  }, [executionHistory]);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  if (executionHistory.length === 0) {
    return (
      <Card className="p-6 glass-subtle text-center">
        <Activity className="w-12 h-12 mx-auto mb-3 text-foreground-muted" />
        <p className="text-foreground-muted">لا توجد بيانات أداء متاحة</p>
        <p className="text-sm text-foreground-muted mt-1">قم بتشغيل سير العمل لرؤية التحليلات</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">متوسط الوقت</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{formatDuration(metrics.avgDuration)}</p>
          {metrics.trend !== 0 && (
            <div className="flex items-center gap-1 mt-1">
              {metrics.trend > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">+{metrics.trend.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-destructive" />
                  <span className="text-xs text-destructive">{metrics.trend.toFixed(1)}%</span>
                </>
              )}
            </div>
          )}
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">أسرع تنفيذ</span>
            <Zap className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-semibold text-success">{formatDuration(metrics.minDuration)}</p>
          <p className="text-xs text-foreground-muted mt-1">P50: {formatDuration(metrics.p50)}</p>
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">أبطأ تنفيذ</span>
            <Activity className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-semibold text-warning">{formatDuration(metrics.maxDuration)}</p>
          <p className="text-xs text-foreground-muted mt-1">P95: {formatDuration(metrics.p95)}</p>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      {detailed && metrics.performanceTrend.length > 0 && (
        <Card className="p-6 glass-subtle">
          <h3 className="text-h3 font-semibold text-foreground mb-4">اتجاه الأداء</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics.performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="timestamp" 
                stroke="var(--foreground-muted)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--foreground-muted)"
                style={{ fontSize: '12px' }}
                tickFormatter={formatDuration}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  direction: 'rtl'
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: number) => [formatDuration(value), 'المدة']}
              />
              <Legend 
                wrapperStyle={{ direction: 'rtl' }}
                formatter={() => 'وقت التنفيذ'}
              />
              <Line 
                type="monotone" 
                dataKey="duration" 
                stroke="var(--primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--primary)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Node Performance */}
      {detailed && metrics.nodePerformance.length > 0 && (
        <Card className="p-6 glass-subtle">
          <h3 className="text-h3 font-semibold text-foreground mb-4">أداء العقد</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.nodePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="type" 
                stroke="var(--foreground-muted)"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="var(--foreground-muted)"
                style={{ fontSize: '12px' }}
                tickFormatter={formatDuration}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  direction: 'rtl'
                }}
                formatter={(value: number) => [formatDuration(value), 'متوسط الوقت']}
              />
              <Legend 
                wrapperStyle={{ direction: 'rtl' }}
                formatter={() => 'متوسط وقت التنفيذ'}
              />
              <Bar 
                dataKey="avgDuration" 
                fill="var(--primary)" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Percentiles Summary */}
      {detailed && (
        <Card className="p-6 glass-subtle">
          <h3 className="text-h3 font-semibold text-foreground mb-4">ملخص الأداء</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">الحد الأدنى</span>
                <span className="font-semibold text-success">{formatDuration(metrics.minDuration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">P50 (الوسيط)</span>
                <span className="font-semibold text-foreground">{formatDuration(metrics.p50)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">P95</span>
                <span className="font-semibold text-warning">{formatDuration(metrics.p95)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">P99</span>
                <span className="font-semibold text-warning">{formatDuration(metrics.p99)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">الحد الأقصى</span>
                <span className="font-semibold text-destructive">{formatDuration(metrics.maxDuration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">المتوسط</span>
                <span className="font-semibold text-primary">{formatDuration(metrics.avgDuration)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
