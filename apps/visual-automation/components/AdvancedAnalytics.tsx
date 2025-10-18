import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, PieChart, TrendingUp, Activity, 
  Clock, Zap, AlertTriangle, CheckCircle,
  Target, Users, Share2, Calendar,
  Filter, Download, Settings, Maximize2
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface AnalyticsData {
  nodes: Node[];
  connections: Connection[];
  executionHistory: ExecutionRecord[];
  collaborationData: CollaborationRecord[];
}

interface ExecutionRecord {
  id: string;
  timestamp: number;
  duration: number;
  status: 'success' | 'error' | 'partial';
  nodesExecuted: number;
  errorNodes: string[];
}

interface CollaborationRecord {
  user: string;
  action: 'create' | 'edit' | 'delete' | 'comment';
  nodeId?: string;
  timestamp: number;
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData;
  isVisible: boolean;
  onClose: () => void;
}

// Analytics Cards Component
const AnalyticsCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}> = ({ title, value, change, icon, color = 'primary' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-4 rounded-xl border border-border"
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center`}>
        {icon}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${
          change >= 0 ? 'text-success' : 'text-destructive'
        }`}>
          <TrendingUp className="w-3 h-3" />
          {change >= 0 ? '+' : ''}{change}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-foreground-muted">{title}</div>
    </div>
  </motion.div>
);

// Workflow Complexity Analysis
const ComplexityAnalysis: React.FC<{ nodes: Node[]; connections: Connection[] }> = ({ 
  nodes, 
  connections 
}) => {
  const analysis = useMemo(() => {
    const nodeTypes = nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const complexity = nodes.length + connections.length * 1.5;
    const branchingFactor = connections.length / Math.max(nodes.length, 1);
    
    // Calculate depth
    const depths = new Map<string, number>();
    const visited = new Set<string>();
    
    // Find root nodes (no incoming connections)
    const rootNodes = nodes.filter(node => 
      !connections.some(conn => conn.target === node.id)
    );
    
    const calculateDepth = (nodeId: string, currentDepth = 0): number => {
      if (visited.has(nodeId)) return depths.get(nodeId) || 0;
      
      visited.add(nodeId);
      depths.set(nodeId, currentDepth);
      
      const children = connections
        .filter(conn => conn.source === nodeId)
        .map(conn => conn.target);
      
      let maxChildDepth = currentDepth;
      children.forEach(childId => {
        const childDepth = calculateDepth(childId, currentDepth + 1);
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      });
      
      return maxChildDepth;
    };
    
    const maxDepth = Math.max(...rootNodes.map(node => calculateDepth(node.id)), 0);
    
    return {
      complexity: Math.round(complexity),
      branchingFactor: Math.round(branchingFactor * 100) / 100,
      maxDepth,
      nodeTypes,
      cyclomaticComplexity: connections.length - nodes.length + 2 // McCabe's formula adapted
    };
  }, [nodes, connections]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsCard
          title="مؤشر التعقيد"
          value={analysis.complexity}
          icon={<BarChart3 className="w-5 h-5 text-primary" />}
          color="primary"
        />
        <AnalyticsCard
          title="عامل التفرع"
          value={analysis.branchingFactor}
          icon={<Activity className="w-5 h-5 text-warning" />}
          color="warning"
        />
        <AnalyticsCard
          title="أقصى عمق"
          value={analysis.maxDepth}
          icon={<TrendingUp className="w-5 h-5 text-success" />}
          color="success"
        />
        <AnalyticsCard
          title="التعقيد الدوري"
          value={analysis.cyclomaticComplexity}
          icon={<Target className="w-5 h-5 text-destructive" />}
          color="destructive"
        />
      </div>
      
      {/* Node Type Distribution */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-primary" />
          توزيع أنواع العقد
        </h4>
        <div className="space-y-2">
          {Object.entries(analysis.nodeTypes).map(([type, count]) => {
            const percentage = (count / nodes.length) * 100;
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    type.includes('trigger') ? 'bg-success' :
                    type.includes('condition') ? 'bg-warning' :
                    'bg-primary'
                  }`} />
                  <span className="text-sm text-foreground">{type.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{count}</span>
                  <div className="w-16">
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// Performance Analytics Component
const PerformanceAnalytics: React.FC<{ 
  executionHistory: ExecutionRecord[] 
}> = ({ executionHistory }) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  
  const filteredHistory = useMemo(() => {
    const now = Date.now();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    return executionHistory.filter(record => 
      now - record.timestamp <= ranges[timeRange]
    );
  }, [executionHistory, timeRange]);

  const stats = useMemo(() => {
    if (filteredHistory.length === 0) {
      return {
        totalExecutions: 0,
        successRate: 0,
        avgDuration: 0,
        totalDuration: 0,
        errorRate: 0
      };
    }

    const successful = filteredHistory.filter(r => r.status === 'success').length;
    const totalDuration = filteredHistory.reduce((sum, r) => sum + r.duration, 0);
    
    return {
      totalExecutions: filteredHistory.length,
      successRate: Math.round((successful / filteredHistory.length) * 100),
      avgDuration: Math.round(totalDuration / filteredHistory.length),
      totalDuration,
      errorRate: Math.round(((filteredHistory.length - successful) / filteredHistory.length) * 100)
    };
  }, [filteredHistory]);

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">تحليل الأداء</h3>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">آخر ساعة</SelectItem>
            <SelectItem value="24h">آخر 24 ساعة</SelectItem>
            <SelectItem value="7d">آخر 7 أيام</SelectItem>
            <SelectItem value="30d">آخر 30 يوم</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <AnalyticsCard
          title="إجمالي التشغيلات"
          value={stats.totalExecutions}
          icon={<Activity className="w-5 h-5 text-primary" />}
        />
        <AnalyticsCard
          title="معدل النجاح"
          value={`${stats.successRate}%`}
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          color="success"
        />
        <AnalyticsCard
          title="متوسط المدة"
          value={`${stats.avgDuration}ms`}
          icon={<Clock className="w-5 h-5 text-warning" />}
          color="warning"
        />
        <AnalyticsCard
          title="معدل الأخطاء"
          value={`${stats.errorRate}%`}
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
          color="destructive"
        />
        <AnalyticsCard
          title="الوقت الإجمالي"
          value={`${Math.round(stats.totalDuration / 1000)}s`}
          icon={<Zap className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Execution Timeline */}
      {filteredHistory.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">الخط الزمني للتشغيلات</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredHistory.slice(0, 10).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    record.status === 'success' ? 'bg-success' :
                    record.status === 'error' ? 'bg-destructive' :
                    'bg-warning'
                  }`} />
                  <span className="text-sm text-foreground">
                    {new Date(record.timestamp).toLocaleTimeString('ar')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={record.status === 'success' ? 'default' : 'destructive'}>
                    {record.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {record.duration}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// Collaboration Analytics Component
const CollaborationAnalytics: React.FC<{ 
  collaborationData: CollaborationRecord[] 
}> = ({ collaborationData }) => {
  const stats = useMemo(() => {
    const users = new Set(collaborationData.map(r => r.user));
    const actions = collaborationData.reduce((acc, record) => {
      acc[record.action] = (acc[record.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const last24h = collaborationData.filter(
      r => Date.now() - r.timestamp <= 24 * 60 * 60 * 1000
    );

    return {
      totalUsers: users.size,
      totalActions: collaborationData.length,
      actionsLast24h: last24h.length,
      actions,
      activeUsers: users
    };
  }, [collaborationData]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AnalyticsCard
          title="المستخدمون النشطون"
          value={stats.totalUsers}
          icon={<Users className="w-5 h-5 text-primary" />}
        />
        <AnalyticsCard
          title="إجمالي الإجراءات"
          value={stats.totalActions}
          icon={<Activity className="w-5 h-5 text-success" />}
          color="success"
        />
        <AnalyticsCard
          title="الإجراءات اليوم"
          value={stats.actionsLast24h}
          icon={<Calendar className="w-5 h-5 text-warning" />}
          color="warning"
        />
      </div>

      {/* Action Distribution */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">توزيع الإجراءات</h4>
        <div className="space-y-2">
          {Object.entries(stats.actions).map(([action, count]) => {
            const percentage = (count / stats.totalActions) * 100;
            const actionLabels = {
              create: 'إنشاء',
              edit: 'تعديل',
              delete: 'حذف',
              comment: 'تعليق'
            };
            
            return (
              <div key={action} className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {actionLabels[action as keyof typeof actionLabels] || action}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{count}</span>
                  <div className="w-16">
                    <Progress value={percentage} className="h-2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// Main Advanced Analytics Component
const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  data,
  isVisible,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            التحليلات المتقدمة - نظرة شاملة على سير العمل
          </DialogTitle>
          <DialogDescription className="sr-only">
            عرض تحليلات مفصلة وإحصائيات الأداء لسير العمل
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="performance">الأداء</TabsTrigger>
            <TabsTrigger value="collaboration">التعاون</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <ComplexityAnalysis 
              nodes={data.nodes} 
              connections={data.connections} 
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-6">
            <PerformanceAnalytics 
              executionHistory={data.executionHistory} 
            />
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6 mt-6">
            <CollaborationAnalytics 
              collaborationData={data.collaborationData} 
            />
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-foreground-muted">
            آخر تحديث: {new Date().toLocaleTimeString('ar')}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              تصدير التقرير
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              مشاركة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AdvancedAnalytics };