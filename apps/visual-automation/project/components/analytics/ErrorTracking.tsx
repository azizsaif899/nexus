import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { AlertCircle, AlertTriangle, XCircle, TrendingDown, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '../ui/badge';

interface ErrorTrackingProps {
  executionHistory: any[];
  detailed?: boolean;
}

export function ErrorTracking({ executionHistory, detailed = false }: ErrorTrackingProps) {
  const errorMetrics = useMemo(() => {
    const totalExecutions = executionHistory.length;
    const failedExecutions = executionHistory.filter(e => e.status === 'failed');
    const errorRate = totalExecutions > 0 ? (failedExecutions.length / totalExecutions * 100) : 0;

    // تجميع الأخطاء حسب النوع
    const errorsByType = new Map<string, number>();
    const recentErrors: any[] = [];

    failedExecutions.forEach(exec => {
      if (exec.error) {
        const errorType = exec.error.type || 'Unknown Error';
        errorsByType.set(errorType, (errorsByType.get(errorType) || 0) + 1);
        recentErrors.push({
          id: exec.id,
          timestamp: exec.startTime,
          workflowName: exec.workflowName,
          errorType,
          message: exec.error.message,
          severity: exec.error.severity || 'medium'
        });
      }
    });

    // تحويل إلى مصفوفة للرسوم البيانية
    const errorTypeData = Array.from(errorsByType.entries())
      .map(([type, count]) => ({ type, count, percentage: (count / failedExecutions.length * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count);

    // اتجاه الأخطاء
    const errorTrend = executionHistory.slice(-20).map((exec, idx) => ({
      index: idx + 1,
      failed: exec.status === 'failed' ? 1 : 0,
      timestamp: new Date(exec.startTime).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }));

    return {
      totalErrors: failedExecutions.length,
      errorRate,
      errorsByType: errorTypeData,
      recentErrors: recentErrors.slice(0, 10).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      errorTrend,
      criticalErrors: recentErrors.filter(e => e.severity === 'critical').length
    };
  }, [executionHistory]);

  const COLORS = ['#d4183d', '#d97706', '#059669', '#2563eb', '#7c3aed'];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <AlertCircle className="w-4 h-4 text-foreground-muted" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-foreground-muted/10 text-foreground-muted border-foreground-muted/20';
    }
  };

  if (executionHistory.length === 0) {
    return (
      <Card className="p-6 glass-subtle text-center">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-success" />
        <p className="text-foreground-muted">لا توجد بيانات أخطاء</p>
        <p className="text-sm text-foreground-muted mt-1">سير العمل يعمل بشكل مثالي!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">إجمالي الأخطاء</span>
            <XCircle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-semibold text-destructive">{errorMetrics.totalErrors}</p>
          <p className="text-xs text-foreground-muted mt-1">من {executionHistory.length} تنفيذ</p>
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">معدل الفشل</span>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-semibold text-warning">{errorMetrics.errorRate.toFixed(1)}%</p>
          {errorMetrics.errorRate < 5 ? (
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3 text-success" />
              <span className="text-xs text-success">ممتاز</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 text-destructive" />
              <span className="text-xs text-destructive">يحتاج تحسين</span>
            </div>
          )}
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">أخطاء حرجة</span>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-semibold text-destructive">{errorMetrics.criticalErrors}</p>
          <p className="text-xs text-foreground-muted mt-1">تتطلب انتباه فوري</p>
        </Card>
      </div>

      {/* Error Distribution */}
      {detailed && errorMetrics.errorsByType.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="p-6 glass-subtle">
            <h3 className="text-h3 font-semibold text-foreground mb-4">توزيع الأخطاء</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={errorMetrics.errorsByType}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.percentage}%`}
                  labelLine={false}
                >
                  {errorMetrics.errorsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    direction: 'rtl'
                  }}
                />
                <Legend 
                  wrapperStyle={{ direction: 'rtl', fontSize: '12px' }}
                  formatter={(value) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Bar Chart */}
          <Card className="p-6 glass-subtle">
            <h3 className="text-h3 font-semibold text-foreground mb-4">أنواع الأخطاء</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={errorMetrics.errorsByType}>
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
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--background-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    direction: 'rtl'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#d4183d" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Recent Errors */}
      {detailed && errorMetrics.recentErrors.length > 0 && (
        <Card className="p-6 glass-subtle">
          <h3 className="text-h3 font-semibold text-foreground mb-4">الأخطاء الأخيرة</h3>
          <div className="space-y-3">
            {errorMetrics.recentErrors.map((error) => (
              <div 
                key={error.id}
                className="p-4 rounded-lg bg-background/50 border border-border hover:bg-hover-bg transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(error.severity)}
                    <span className="font-medium text-foreground">{error.errorType}</span>
                    <Badge className={getSeverityColor(error.severity)}>
                      {error.severity}
                    </Badge>
                  </div>
                  <span className="text-xs text-foreground-muted">
                    {new Date(error.timestamp).toLocaleString('ar-SA')}
                  </span>
                </div>
                <p className="text-sm text-foreground-secondary mb-1">{error.workflowName}</p>
                <p className="text-sm text-foreground-muted font-mono">{error.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* No Errors State */}
      {errorMetrics.totalErrors === 0 && (
        <Card className="p-8 glass-subtle text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-success" />
          <h3 className="text-h3 font-semibold text-foreground mb-2">لا توجد أخطاء!</h3>
          <p className="text-foreground-muted">جميع التنفيذات نجحت بشكل مثالي 🎉</p>
        </Card>
      )}
    </div>
  );
}
