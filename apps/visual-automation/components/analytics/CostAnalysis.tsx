import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { DollarSign, TrendingUp, Lightbulb, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CostAnalysisProps {
  executionHistory: any[];
}

export function CostAnalysis({ executionHistory }: CostAnalysisProps) {
  const costMetrics = useMemo(() => {
    // تكلفة افتراضية لكل API call (يمكن تخصيصها)
    const API_COSTS = {
      'HTTP Request': 0.0001,
      'Email': 0.001,
      'Database': 0.0005,
      'AI/ML': 0.01,
      'Webhook': 0.0002,
      'Scheduler': 0.00005,
      'Transform': 0.00001,
      'Filter': 0.00001,
      'Delay': 0.00001,
      'Logger': 0.00001,
      'Condition': 0.00001,
      'Loop': 0.00002,
      'Error Handler': 0.00001
    };

    let totalCost = 0;
    const costByService = new Map<string, { calls: number; cost: number }>();
    const dailyCosts: any[] = [];

    // حساب التكاليف
    executionHistory.forEach(exec => {
      if (exec.nodeExecutions) {
        const date = new Date(exec.startTime).toLocaleDateString('ar-SA');
        
        exec.nodeExecutions.forEach((node: any) => {
          const nodeType = node.nodeType;
          const cost = API_COSTS[nodeType as keyof typeof API_COSTS] || 0.0001;
          
          totalCost += cost;
          
          // تجميع حسب الخدمة
          if (!costByService.has(nodeType)) {
            costByService.set(nodeType, { calls: 0, cost: 0 });
          }
          const service = costByService.get(nodeType)!;
          service.calls += 1;
          service.cost += cost;
          
          // تجميع حسب التاريخ
          const dayIndex = dailyCosts.findIndex(d => d.date === date);
          if (dayIndex === -1) {
            dailyCosts.push({ date, cost: cost, calls: 1 });
          } else {
            dailyCosts[dayIndex].cost += cost;
            dailyCosts[dayIndex].calls += 1;
          }
        });
      }
    });

    // تحويل إلى مصفوفات
    const costByServiceData = Array.from(costByService.entries())
      .map(([service, data]) => ({
        service,
        calls: data.calls,
        cost: data.cost,
        avgCost: data.cost / data.calls
      }))
      .sort((a, b) => b.cost - a.cost);

    // التوقعات (بناءً على المعدل الحالي)
    const avgDailyCost = totalCost / Math.max(1, dailyCosts.length);
    const projectedMonthlyCost = avgDailyCost * 30;

    // اقتراحات التوفير
    const suggestions: string[] = [];
    costByServiceData.forEach(service => {
      if (service.service === 'AI/ML' && service.cost > totalCost * 0.3) {
        suggestions.push(`تحسين استخدام ${service.service}: يستهلك ${((service.cost / totalCost) * 100).toFixed(1)}% من التكلفة`);
      }
      if (service.service === 'Email' && service.calls > 100) {
        suggestions.push(`تجميع رسائل ${service.service}: ${service.calls} مكالمة - يمكن دمجها`);
      }
    });

    if (suggestions.length === 0) {
      suggestions.push('الاستخدام الحالي مثالي! لا توجد توصيات');
    }

    return {
      totalCost,
      totalCalls: Array.from(costByService.values()).reduce((sum, s) => sum + s.calls, 0),
      costByService: costByServiceData,
      dailyCosts: dailyCosts.slice(-30),
      projectedMonthlyCost,
      avgCostPerExecution: totalCost / Math.max(1, executionHistory.length),
      suggestions
    };
  }, [executionHistory]);

  const formatCost = (cost: number) => {
    if (cost < 0.01) return `$${(cost * 1000).toFixed(2)}k`;
    return `$${cost.toFixed(4)}`;
  };

  if (executionHistory.length === 0) {
    return (
      <Card className="p-6 glass-subtle text-center">
        <DollarSign className="w-12 h-12 mx-auto mb-3 text-foreground-muted" />
        <p className="text-foreground-muted">لا توجد بيانات تكلفة</p>
        <p className="text-sm text-foreground-muted mt-1">قم بتشغيل سير العمل لتتبع التكاليف</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cost Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">التكلفة الإجمالية</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{formatCost(costMetrics.totalCost)}</p>
          <p className="text-xs text-foreground-muted mt-1">{costMetrics.totalCalls} مكالمة API</p>
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">متوسط التكلفة</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-semibold text-success">{formatCost(costMetrics.avgCostPerExecution)}</p>
          <p className="text-xs text-foreground-muted mt-1">لكل تنفيذ</p>
        </Card>

        <Card className="p-4 glass-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground-muted">التوقع الشهري</span>
            <AlertCircle className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-semibold text-warning">{formatCost(costMetrics.projectedMonthlyCost)}</p>
          <p className="text-xs text-foreground-muted mt-1">بناءً على المعدل الحالي</p>
        </Card>
      </div>

      {/* Cost by Service */}
      <Card className="p-6 glass-subtle">
        <h3 className="text-h3 font-semibold text-foreground mb-4">التكلفة حسب الخدمة</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costMetrics.costByService}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="service" 
              stroke="var(--foreground-muted)"
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="var(--foreground-muted)"
              style={{ fontSize: '12px' }}
              tickFormatter={formatCost}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--background-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                direction: 'rtl'
              }}
              formatter={(value: number) => [formatCost(value), 'التكلفة']}
            />
            <Legend 
              wrapperStyle={{ direction: 'rtl' }}
              formatter={() => 'التكلفة الإجمالية'}
            />
            <Bar 
              dataKey="cost" 
              fill="var(--primary)" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Daily Cost Trend */}
      {costMetrics.dailyCosts.length > 1 && (
        <Card className="p-6 glass-subtle">
          <h3 className="text-h3 font-semibold text-foreground mb-4">اتجاه التكلفة اليومية</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={costMetrics.dailyCosts}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--foreground-muted)"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="var(--foreground-muted)"
                style={{ fontSize: '12px' }}
                tickFormatter={formatCost}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--background-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  direction: 'rtl'
                }}
                formatter={(value: number) => [formatCost(value), 'التكلفة']}
              />
              <Legend 
                wrapperStyle={{ direction: 'rtl' }}
                formatter={() => 'التكلفة اليومية'}
              />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="var(--primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--primary)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Cost Breakdown Table */}
      <Card className="p-6 glass-subtle">
        <h3 className="text-h3 font-semibold text-foreground mb-4">تفصيل التكاليف</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-right p-3 text-sm font-medium text-foreground-muted">الخدمة</th>
                <th className="text-right p-3 text-sm font-medium text-foreground-muted">المكالمات</th>
                <th className="text-right p-3 text-sm font-medium text-foreground-muted">التكلفة</th>
                <th className="text-right p-3 text-sm font-medium text-foreground-muted">متوسط/مكالمة</th>
                <th className="text-right p-3 text-sm font-medium text-foreground-muted">النسبة</th>
              </tr>
            </thead>
            <tbody>
              {costMetrics.costByService.map((service, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-hover-bg transition-colors">
                  <td className="p-3 text-foreground">{service.service}</td>
                  <td className="p-3 text-foreground-muted">{service.calls}</td>
                  <td className="p-3 font-medium text-foreground">{formatCost(service.cost)}</td>
                  <td className="p-3 text-foreground-muted">{formatCost(service.avgCost)}</td>
                  <td className="p-3 text-foreground-muted">
                    {((service.cost / costMetrics.totalCost) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Savings Suggestions */}
      <Card className="p-6 glass-subtle bg-primary/5">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-h3 font-semibold text-foreground mb-3">اقتراحات التوفير</h3>
            <ul className="space-y-2">
              {costMetrics.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-foreground-secondary flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
