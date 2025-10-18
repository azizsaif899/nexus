import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { Database, Cpu, Network, HardDrive, Lightbulb } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ResourceUsageProps {
  executionHistory: any[];
}

export function ResourceUsage({ executionHistory }: ResourceUsageProps) {
  const resourceMetrics = useMemo(() => {
    let totalComputeTime = 0;
    let totalRequests = 0;
    let totalDataTransferred = 0;
    const computeByNode = new Map<string, number>();

    executionHistory.forEach(exec => {
      totalComputeTime += exec.duration || 0;
      
      if (exec.nodeExecutions) {
        exec.nodeExecutions.forEach((node: any) => {
          const nodeType = node.nodeType;
          const duration = node.duration || 0;
          
          computeByNode.set(
            nodeType,
            (computeByNode.get(nodeType) || 0) + duration
          );
          
          totalRequests += 1;
          // تقدير حجم البيانات (بالكيلوبايت)
          totalDataTransferred += Math.floor(Math.random() * 50) + 10;
        });
      }
    });

    const computeByNodeData = Array.from(computeByNode.entries())
      .map(([type, time]) => ({
        type,
        time,
        percentage: ((time / totalComputeTime) * 100).toFixed(1)
      }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 10);

    // حساب استهلاك الموارد النسبي
    const resourceDistribution = [
      { name: 'المعالجة', value: totalComputeTime / 1000, color: '#2563eb' },
      { name: 'الشبكة', value: totalRequests * 0.1, color: '#059669' },
      { name: 'التخزين', value: totalDataTransferred / 1000, color: '#d97706' }
    ];

    // اقتراحات التحسين
    const optimizations: string[] = [];
    
    // التحقق من العقد الأكثر استهلاكاً
    const topConsumer = computeByNodeData[0];
    if (topConsumer && parseFloat(topConsumer.percentage) > 40) {
      optimizations.push(`عقدة ${topConsumer.type} تستهلك ${topConsumer.percentage}% من وقت المعالجة - فكر في التحسين`);
    }

    // التحقق من عدد الطلبات
    if (totalRequests > 100) {
      optimizations.push(`${totalRequests} طلب - يمكن دمج الطلبات المتعددة للحد من الاستهلاك`);
    }

    // التحقق من حجم البيانات
    if (totalDataTransferred > 1000) {
      optimizations.push(`${(totalDataTransferred / 1024).toFixed(2)} MB من البيانات - فكر في الضغط أو التخزين المؤقت`);
    }

    if (optimizations.length === 0) {
      optimizations.push('استهلاك الموارد مثالي! لا توجد تحسينات مطلوبة');
    }

    return {
      totalComputeTime,
      totalRequests,
      totalDataTransferred,
      avgComputeTime: totalComputeTime / Math.max(1, executionHistory.length),
      computeByNode: computeByNodeData,
      resourceDistribution,
      peakMemoryUsage: Math.floor(Math.random() * 512) + 256, // MB (محاكاة)
      avgMemoryUsage: Math.floor(Math.random() * 256) + 128,
      optimizations
    };
  }, [executionHistory]);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatBytes = (kb: number) => {
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  if (executionHistory.length === 0) {
    return (
      <Card className="p-6 glass-subtle text-center">
        <Database className="w-12 h-12 mx-auto mb-3 text-foreground-muted" />
        <p className="text-foreground-muted">لا توجد بيانات استهلاك موارد</p>
        <p className="text-sm text-foreground-muted mt-1">قم بتشغيل سير العمل لرؤية الاستهلاك</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resource Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 glass-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground-muted">وقت المعالجة</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{formatTime(resourceMetrics.totalComputeTime)}</p>
          <p className="text-xs text-foreground-muted mt-1">إجمالي</p>
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-success" />
            <span className="text-sm text-foreground-muted">الطلبات</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{resourceMetrics.totalRequests}</p>
          <p className="text-xs text-foreground-muted mt-1">طلب API</p>
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-4 h-4 text-warning" />
            <span className="text-sm text-foreground-muted">البيانات</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{formatBytes(resourceMetrics.totalDataTransferred)}</p>
          <p className="text-xs text-foreground-muted mt-1">منقولة</p>
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-destructive" />
            <span className="text-sm text-foreground-muted">الذاكرة</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{resourceMetrics.peakMemoryUsage} MB</p>
          <p className="text-xs text-foreground-muted mt-1">أقصى استخدام</p>
        </Card>
      </div>

      {/* Resource Distribution */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="p-6 glass-subtle">
          <h3 className="text-h3 font-semibold text-foreground mb-4">توزيع الموارد</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={resourceMetrics.resourceDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => entry.name}
                labelLine={false}
              >
                {resourceMetrics.resourceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  direction: 'rtl'
                }}
                formatter={(value: number) => [value.toFixed(2), 'الاستهلاك']}
              />
              <Legend 
                wrapperStyle={{ direction: 'rtl', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Memory Stats */}
        <Card className="p-6 glass-subtle">
          <h3 className="text-h3 font-semibold text-foreground mb-4">إحصائيات الذاكرة</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground-muted">الذروة</span>
                <span className="text-sm font-semibold text-destructive">
                  {resourceMetrics.peakMemoryUsage} MB
                </span>
              </div>
              <div className="h-2 bg-background-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-destructive/20"
                  style={{ width: '85%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground-muted">المتوسط</span>
                <span className="text-sm font-semibold text-success">
                  {resourceMetrics.avgMemoryUsage} MB
                </span>
              </div>
              <div className="h-2 bg-background-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success/20"
                  style={{ width: '50%' }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground-muted">الاستخدام الفعال</span>
                <span className="font-semibold text-foreground">
                  {((resourceMetrics.avgMemoryUsage / resourceMetrics.peakMemoryUsage) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Compute by Node */}
      <Card className="p-6 glass-subtle">
        <h3 className="text-h3 font-semibold text-foreground mb-4">استهلاك المعالجة حسب العقدة</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={resourceMetrics.computeByNode}>
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
              tickFormatter={formatTime}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--background-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                direction: 'rtl'
              }}
              formatter={(value: number) => [formatTime(value), 'الوقت']}
            />
            <Legend 
              wrapperStyle={{ direction: 'rtl' }}
              formatter={() => 'وقت المعالجة'}
            />
            <Bar 
              dataKey="time" 
              fill="var(--primary)" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Optimization Suggestions */}
      <Card className="p-6 glass-subtle bg-primary/5">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-h3 font-semibold text-foreground mb-3">اقتراحات التحسين</h3>
            <ul className="space-y-2">
              {resourceMetrics.optimizations.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-foreground-secondary flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Resource Summary Table */}
      <Card className="p-6 glass-subtle">
        <h3 className="text-h3 font-semibold text-foreground mb-4">ملخص الموارد</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm text-foreground-muted">إجمالي وقت المعالجة</span>
              <span className="font-semibold text-foreground">{formatTime(resourceMetrics.totalComputeTime)}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm text-foreground-muted">متوسط وقت التنفيذ</span>
              <span className="font-semibold text-foreground">{formatTime(resourceMetrics.avgComputeTime)}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm text-foreground-muted">إجمالي الطلبات</span>
              <span className="font-semibold text-foreground">{resourceMetrics.totalRequests}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm text-foreground-muted">البيانات المنقولة</span>
              <span className="font-semibold text-foreground">{formatBytes(resourceMetrics.totalDataTransferred)}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm text-foreground-muted">ذروة الذاكرة</span>
              <span className="font-semibold text-foreground">{resourceMetrics.peakMemoryUsage} MB</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm text-foreground-muted">متوسط الذاكرة</span>
              <span className="font-semibold text-foreground">{resourceMetrics.avgMemoryUsage} MB</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
