import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface ExecutionHistoryProps {
  executionHistory: any[];
}

export function ExecutionHistory({ executionHistory }: ExecutionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'time' | 'duration'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // التصفية والبحث
  const filteredHistory = useMemo(() => {
    let filtered = executionHistory;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.workflowName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.id?.includes(searchQuery)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const aValue = sortBy === 'time' ? new Date(a.startTime).getTime() : a.duration;
      const bValue = sortBy === 'time' ? new Date(b.startTime).getTime() : b.duration;
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return filtered;
  }, [executionHistory, searchQuery, filterStatus, sortBy, sortOrder]);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSort = (field: 'time' | 'duration') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <Input
            placeholder="ابحث في السجلات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            الكل ({executionHistory.length})
          </Button>
          <Button
            variant={filterStatus === 'success' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('success')}
            className="gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            نجح ({executionHistory.filter(e => e.status === 'success').length})
          </Button>
          <Button
            variant={filterStatus === 'failed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('failed')}
            className="gap-1"
          >
            <XCircle className="w-3 h-3" />
            فشل ({executionHistory.filter(e => e.status === 'failed').length})
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="glass-subtle">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-right p-4 text-sm font-medium text-foreground-muted">
                  الحالة
                </th>
                <th className="text-right p-4 text-sm font-medium text-foreground-muted">
                  سير العمل
                </th>
                <th 
                  className="text-right p-4 text-sm font-medium text-foreground-muted cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('time')}
                >
                  <div className="flex items-center gap-1">
                    الوقت
                    {sortBy === 'time' && (
                      sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-right p-4 text-sm font-medium text-foreground-muted cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort('duration')}
                >
                  <div className="flex items-center gap-1">
                    المدة
                    {sortBy === 'duration' && (
                      sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="text-right p-4 text-sm font-medium text-foreground-muted">
                  العقد
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-foreground-muted">
                    لا توجد سجلات تنفيذ
                  </td>
                </tr>
              ) : (
                filteredHistory.map((execution) => (
                  <React.Fragment key={execution.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border hover:bg-hover-bg transition-colors cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === execution.id ? null : execution.id)}
                    >
                      <td className="p-4">
                        {execution.status === 'success' ? (
                          <Badge className="bg-success/10 text-success border-success/20">
                            <CheckCircle2 className="w-3 h-3 ml-1" />
                            نجح
                          </Badge>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                            <XCircle className="w-3 h-3 ml-1" />
                            فشل
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 text-foreground">
                        {execution.workflowName || 'سير عمل بدون اسم'}
                      </td>
                      <td className="p-4 text-foreground-muted text-sm">
                        {formatDate(execution.startTime)}
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {formatDuration(execution.duration)}
                        </Badge>
                      </td>
                      <td className="p-4 text-foreground-muted text-sm">
                        {execution.nodeCount || 0} عقدة
                      </td>
                      <td className="p-4">
                        {expandedRow === execution.id ? (
                          <ChevronUp className="w-4 h-4 text-foreground-muted" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-foreground-muted" />
                        )}
                      </td>
                    </motion.tr>

                    {/* Expanded Details */}
                    {expandedRow === execution.id && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-background-muted/30 p-4 space-y-3"
                          >
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-foreground-muted">معرّف التنفيذ:</span>
                                <span className="text-foreground font-mono mr-2">{execution.id}</span>
                              </div>
                              <div>
                                <span className="text-foreground-muted">وقت البدء:</span>
                                <span className="text-foreground mr-2">{new Date(execution.startTime).toLocaleString('ar-SA')}</span>
                              </div>
                              <div>
                                <span className="text-foreground-muted">وقت الانتهاء:</span>
                                <span className="text-foreground mr-2">{new Date(execution.endTime).toLocaleString('ar-SA')}</span>
                              </div>
                            </div>

                            {execution.error && (
                              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                <p className="text-sm font-medium text-destructive mb-1">تفاصيل الخطأ:</p>
                                <p className="text-sm text-foreground-muted font-mono">{execution.error.message}</p>
                              </div>
                            )}

                            {execution.nodeExecutions && execution.nodeExecutions.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-foreground mb-2">تفاصيل العقد:</p>
                                <div className="space-y-2">
                                  {execution.nodeExecutions.map((node: any, idx: number) => (
                                    <div 
                                      key={idx}
                                      className="flex items-center justify-between p-2 rounded-lg bg-background/50"
                                    >
                                      <div className="flex items-center gap-2">
                                        {node.status === 'success' ? (
                                          <CheckCircle2 className="w-4 h-4 text-success" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-destructive" />
                                        )}
                                        <span className="text-sm text-foreground">{node.nodeName}</span>
                                        <Badge variant="outline" className="text-xs">{node.nodeType}</Badge>
                                      </div>
                                      <span className="text-xs text-foreground-muted">
                                        {formatDuration(node.duration)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary */}
      {filteredHistory.length > 0 && (
        <div className="flex items-center justify-between text-sm text-foreground-muted">
          <span>عرض {filteredHistory.length} من {executionHistory.length} سجل</span>
          <span>
            المجموع: {filteredHistory.reduce((sum, e) => sum + e.duration, 0).toFixed(0)}ms
          </span>
        </div>
      )}
    </div>
  );
}
