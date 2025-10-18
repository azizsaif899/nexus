import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, TrendingUp, Clock, Users, Zap, Target,
  AlertCircle, CheckCircle, BarChart3, PieChart,
  Calendar, Settings, Download, Share2, Filter,
  ArrowUp, ArrowDown, Minus, MoreHorizontal,
  PlayCircle, PauseCircle, StopCircle, RefreshCw,
  Database, Server, Cpu, HardDrive, Network,
  Globe, Shield, Gauge, Eye, Heart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { enhancedToast as toast } from './ui/enhanced-toast';

interface WorkflowMetrics {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  executions: number;
  successRate: number;
  avgExecutionTime: number;
  lastRun: Date;
  errors: number;
  performance: {
    cpu: number;
    memory: number;
    network: number;
  };
}

interface SystemHealth {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  uptime: number;
  activeConnections: number;
  queueSize: number;
}

interface AnalyticsData {
  date: string;
  executions: number;
  successes: number;
  errors: number;
  avgTime: number;
  users: number;
}

interface AdvancedDashboardProps {
  workflowId?: string;
  timeRange: '1h' | '24h' | '7d' | '30d' | '90d';
  onTimeRangeChange: (range: '1h' | '24h' | '7d' | '30d' | '90d') => void;
}

export function AdvancedDashboard({
  workflowId,
  timeRange,
  onTimeRangeChange
}: AdvancedDashboardProps) {
  const [workflows, setWorkflows] = useState<WorkflowMetrics[]>([
    {
      id: 'wf1',
      name: 'معالجة البيانات الأساسية',
      status: 'running',
      executions: 1247,
      successRate: 98.5,
      avgExecutionTime: 2.3,
      lastRun: new Date(Date.now() - 5 * 60 * 1000),
      errors: 18,
      performance: { cpu: 45, memory: 62, network: 78 }
    },
    {
      id: 'wf2',
      name: 'تكامل API خارجي',
      status: 'running',
      executions: 892,
      successRate: 94.2,
      avgExecutionTime: 4.7,
      lastRun: new Date(Date.now() - 2 * 60 * 1000),
      errors: 52,
      performance: { cpu: 67, memory: 45, network: 89 }
    },
    {
      id: 'wf3',
      name: 'إرسال التقارير',
      status: 'paused',
      executions: 324,
      successRate: 99.1,
      avgExecutionTime: 1.8,
      lastRun: new Date(Date.now() - 30 * 60 * 1000),
      errors: 3,
      performance: { cpu: 12, memory: 28, network: 34 }
    },
    {
      id: 'wf4',
      name: 'نسخ احتياطي قواعد البيانات',
      status: 'error',
      executions: 156,
      successRate: 87.8,
      avgExecutionTime: 12.4,
      lastRun: new Date(Date.now() - 45 * 60 * 1000),
      errors: 19,
      performance: { cpu: 89, memory: 67, network: 23 }
    }
  ]);

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    cpu: 34,
    memory: 67,
    storage: 45,
    network: 89,
    uptime: 99.8,
    activeConnections: 127,
    queueSize: 23
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([
    { date: '2025-01-01', executions: 245, successes: 238, errors: 7, avgTime: 2.1, users: 12 },
    { date: '2025-01-02', executions: 289, successes: 282, errors: 7, avgTime: 2.3, users: 15 },
    { date: '2025-01-03', executions: 198, successes: 194, errors: 4, avgTime: 1.9, users: 9 },
    { date: '2025-01-04', executions: 367, successes: 358, errors: 9, avgTime: 2.7, users: 18 },
    { date: '2025-01-05', executions: 312, successes: 305, errors: 7, avgTime: 2.2, users: 14 },
    { date: '2025-01-06', executions: 424, successes: 412, errors: 12, avgTime: 2.8, users: 21 },
    { date: '2025-01-07', executions: 356, successes: 349, errors: 7, avgTime: 2.4, users: 16 }
  ]);

  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'executions' | 'performance' | 'errors'>('executions');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      // Update workflows metrics
      setWorkflows(prev => prev.map(wf => ({
        ...wf,
        executions: wf.status === 'running' ? wf.executions + Math.floor(Math.random() * 5) : wf.executions,
        performance: {
          cpu: Math.max(10, Math.min(90, wf.performance.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(10, Math.min(90, wf.performance.memory + (Math.random() - 0.5) * 8)),
          network: Math.max(10, Math.min(90, wf.performance.network + (Math.random() - 0.5) * 12))
        },
        lastRun: wf.status === 'running' ? new Date() : wf.lastRun
      })));

      // Update system health
      setSystemHealth(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 8)),
        memory: Math.max(10, Math.min(90, prev.memory + (Math.random() - 0.5) * 6)),
        network: Math.max(10, Math.min(90, prev.network + (Math.random() - 0.5) * 10)),
        activeConnections: Math.max(50, Math.min(200, prev.activeConnections + Math.floor((Math.random() - 0.5) * 10))),
        queueSize: Math.max(0, Math.min(50, prev.queueSize + Math.floor((Math.random() - 0.5) * 5)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalExecutions = workflows.reduce((sum, wf) => sum + wf.executions, 0);
    const avgSuccessRate = workflows.reduce((sum, wf) => sum + wf.successRate, 0) / workflows.length;
    const totalErrors = workflows.reduce((sum, wf) => sum + wf.errors, 0);
    const runningWorkflows = workflows.filter(wf => wf.status === 'running').length;
    const avgExecutionTime = workflows.reduce((sum, wf) => sum + wf.avgExecutionTime, 0) / workflows.length;

    return {
      totalExecutions,
      avgSuccessRate,
      totalErrors,
      runningWorkflows,
      avgExecutionTime,
      systemHealth: (systemHealth.cpu + systemHealth.memory + systemHealth.network) / 3
    };
  }, [workflows, systemHealth]);

  const handleWorkflowAction = (workflowId: string, action: 'start' | 'pause' | 'stop' | 'restart') => {
    setWorkflows(prev => prev.map(wf => {
      if (wf.id === workflowId) {
        let newStatus = wf.status;
        switch (action) {
          case 'start':
            newStatus = 'running';
            break;
          case 'pause':
            newStatus = 'paused';
            break;
          case 'stop':
            newStatus = 'stopped';
            break;
          case 'restart':
            newStatus = 'running';
            break;
        }
        return { ...wf, status: newStatus };
      }
      return wf;
    }));

    toast.success(`تم ${action === 'start' ? 'تشغيل' : action === 'pause' ? 'إيقاف مؤقت' : action === 'stop' ? 'إيقاف' : 'إعادة تشغيل'} سير العمل`);
  };

  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      timeRange,
      summary: summaryMetrics,
      workflows,
      systemHealth,
      analytics: analyticsData
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('تم تصدير التقرير بنجاح');
  };

  const getStatusColor = (status: WorkflowMetrics['status']) => {
    switch (status) {
      case 'running': return 'text-success';
      case 'paused': return 'text-warning';
      case 'stopped': return 'text-muted-foreground';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: WorkflowMetrics['status']) => {
    switch (status) {
      case 'running': return <PlayCircle className="w-4 h-4" />;
      case 'paused': return <PauseCircle className="w-4 h-4" />;
      case 'stopped': return <StopCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">لوحة المعلومات المتقدمة</h1>
          <p className="text-muted-foreground mt-1">مراقبة شاملة لأداء النظام وسير العمل</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={realTimeUpdates ? "default" : "outline"}
            size="sm"
            onClick={() => setRealTimeUpdates(!realTimeUpdates)}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${realTimeUpdates ? 'animate-spin' : ''}`} />
            {realTimeUpdates ? 'مباشر' : 'إيقاف'}
          </Button>

          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">آخر ساعة</SelectItem>
              <SelectItem value="24h">آخر يوم</SelectItem>
              <SelectItem value="7d">آخر أسبوع</SelectItem>
              <SelectItem value="30d">آخر شهر</SelectItem>
              <SelectItem value="90d">آخر 3 أشهر</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleExportReport} size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي التشغيلات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{summaryMetrics.totalExecutions.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <ArrowUp className="w-3 h-3" />
                    +12.5%
                  </div>
                </div>
                <Activity className="w-8 h-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">معدل النجاح</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{summaryMetrics.avgSuccessRate.toFixed(1)}%</div>
                  <Progress value={summaryMetrics.avgSuccessRate} className="w-20 h-2 mt-1" />
                </div>
                <CheckCircle className="w-8 h-8 text-success opacity-60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">متوسط وقت التنفيذ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{summaryMetrics.avgExecutionTime.toFixed(1)}ث</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <ArrowDown className="w-3 h-3" />
                    -8.2%
                  </div>
                </div>
                <Clock className="w-8 h-8 text-warning opacity-60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">صحة النظام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{summaryMetrics.systemHealth.toFixed(0)}%</div>
                  <Progress value={summaryMetrics.systemHealth} className="w-20 h-2 mt-1" />
                </div>
                <Heart className={`w-8 h-8 opacity-60 ${summaryMetrics.systemHealth > 70 ? 'text-success' : 'text-warning'}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">سير العمل</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="system">النظام</TabsTrigger>
          <TabsTrigger value="monitoring">المراقبة</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workflows List */}
            <div className="lg:col-span-2">
              <Card className="glass-medium">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>سير العمل النشط</span>
                    <Badge variant="secondary">{workflows.length} سير عمل</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {workflows.map(workflow => (
                        <motion.div
                          key={workflow.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 border border-border rounded-lg hover:bg-hover-bg transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={getStatusColor(workflow.status)}>
                                {getStatusIcon(workflow.status)}
                              </div>
                              <div>
                                <h4 className="font-medium">{workflow.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  آخر تشغيل: {workflow.lastRun.toLocaleTimeString('ar')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDetails(showDetails === workflow.id ? null : workflow.id)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleWorkflowAction(workflow.id, 
                                  workflow.status === 'running' ? 'pause' : 'start'
                                )}
                              >
                                {workflow.status === 'running' ? (
                                  <PauseCircle className="w-4 h-4" />
                                ) : (
                                  <PlayCircle className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-lg font-semibold">{workflow.executions}</div>
                              <div className="text-xs text-muted-foreground">تشغيلات</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{workflow.successRate}%</div>
                              <div className="text-xs text-muted-foreground">نجاح</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">{workflow.avgExecutionTime}ث</div>
                              <div className="text-xs text-muted-foreground">متوسط الوقت</div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {showDetails === workflow.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 pt-3 border-t border-border"
                              >
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">استخدام المعالج</span>
                                    <div className="flex items-center gap-2">
                                      <Progress value={workflow.performance.cpu} className="w-20 h-2" />
                                      <span className="text-xs">{workflow.performance.cpu}%</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">استخدام الذاكرة</span>
                                    <div className="flex items-center gap-2">
                                      <Progress value={workflow.performance.memory} className="w-20 h-2" />
                                      <span className="text-xs">{workflow.performance.memory}%</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">استخدام الشبكة</span>
                                    <div className="flex items-center gap-2">
                                      <Progress value={workflow.performance.network} className="w-20 h-2" />
                                      <span className="text-xs">{workflow.performance.network}%</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card className="glass-subtle">
                <CardHeader>
                  <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">سير عمل نشط</span>
                    <Badge variant="success">{summaryMetrics.runningWorkflows}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">إجمالي الأخطاء</span>
                    <Badge variant="destructive">{summaryMetrics.totalErrors}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">الاتصالات النشطة</span>
                    <Badge variant="secondary">{systemHealth.activeConnections}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">طابور المهام</span>
                    <Badge variant="outline">{systemHealth.queueSize}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-subtle">
                <CardHeader>
                  <CardTitle className="text-lg">حالة النظام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-primary" />
                      <span className="text-sm">المعالج</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={systemHealth.cpu} className="w-16 h-2" />
                      <span className="text-xs">{systemHealth.cpu}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-success" />
                      <span className="text-sm">الذاكرة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={systemHealth.memory} className="w-16 h-2" />
                      <span className="text-xs">{systemHealth.memory}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-warning" />
                      <span className="text-sm">التخزين</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={systemHealth.storage} className="w-16 h-2" />
                      <span className="text-xs">{systemHealth.storage}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-info" />
                      <span className="text-sm">الشبكة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={systemHealth.network} className="w-16 h-2" />
                      <span className="text-xs">{systemHealth.network}%</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">وقت التشغيل</span>
                    <Badge variant="success">{systemHealth.uptime}%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-medium">
              <CardHeader>
                <CardTitle>اتجاه التشغيلات</CardTitle>
                <CardDescription>عدد التشغيلات عبر الوقت</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="executions" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="successes" stroke="#059669" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-medium">
              <CardHeader>
                <CardTitle>معدل الأخطاء</CardTitle>
                <CardDescription>مقارنة النجاح والفشل</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="successes" fill="#10b981" />
                    <Bar dataKey="errors" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-medium">
            <CardHeader>
              <CardTitle>أداء متوسط وقت التنفيذ</CardTitle>
              <CardDescription>مراقبة تحسن الأداء عبر الوقت</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgTime" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-subtle">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" />
                  الخادم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">الحالة</span>
                    <Badge variant="success">متصل</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">وقت التشغيل</span>
                    <span className="text-sm">{systemHealth.uptime}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-subtle">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-success" />
                  قاعدة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">الاتصالات</span>
                    <span className="text-sm">{systemHealth.activeConnections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">الاستجابة</span>
                    <Badge variant="success">23ms</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-subtle">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-info" />
                  الشبكة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">النطاق الترددي</span>
                    <span className="text-sm">{systemHealth.network}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">الزمن</span>
                    <Badge variant="success">12ms</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-subtle">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-warning" />
                  الأمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">التشفير</span>
                    <Badge variant="success">SSL</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">المصادقة</span>
                    <Badge variant="success">نشط</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card className="glass-medium">
            <CardHeader>
              <CardTitle>مراقبة الأداء المباشر</CardTitle>
              <CardDescription>
                مراقبة حية لموارد النظام وأداء سير العمل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">موارد النظام</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">المعالج</span>
                        <span className="text-sm">{systemHealth.cpu}%</span>
                      </div>
                      <Progress value={systemHealth.cpu} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">الذاكرة</span>
                        <span className="text-sm">{systemHealth.memory}%</span>
                      </div>
                      <Progress value={systemHealth.memory} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">التخزين</span>
                        <span className="text-sm">{systemHealth.storage}%</span>
                      </div>
                      <Progress value={systemHealth.storage} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">الشبكة</span>
                        <span className="text-sm">{systemHealth.network}%</span>
                      </div>
                      <Progress value={systemHealth.network} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">إحصائيات التشغيل</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border border-border rounded-lg">
                      <div className="text-2xl font-bold text-success">{summaryMetrics.runningWorkflows}</div>
                      <div className="text-xs text-muted-foreground">نشط</div>
                    </div>
                    
                    <div className="text-center p-3 border border-border rounded-lg">
                      <div className="text-2xl font-bold text-warning">{workflows.filter(w => w.status === 'paused').length}</div>
                      <div className="text-xs text-muted-foreground">متوقف مؤقتاً</div>
                    </div>
                    
                    <div className="text-center p-3 border border-border rounded-lg">
                      <div className="text-2xl font-bold text-destructive">{workflows.filter(w => w.status === 'error').length}</div>
                      <div className="text-xs text-muted-foreground">خطأ</div>
                    </div>
                    
                    <div className="text-center p-3 border border-border rounded-lg">
                      <div className="text-2xl font-bold text-muted-foreground">{workflows.filter(w => w.status === 'stopped').length}</div>
                      <div className="text-xs text-muted-foreground">متوقف</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}