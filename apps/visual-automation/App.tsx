import React, { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { Activity, ChevronRight, Settings } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'motion/react';
import { enhancedToast as toast } from './components/ui/enhanced-toast';

// === Utilities ===
import { logger } from './lib/logger';
import { 
  ANIMATION_DELAYS, 
  LAYOUT_CONSTANTS, 
  HISTORY_CONFIG,
  EXECUTION_CONFIG,
  NOTIFICATION_CONFIG,
  NODE_TYPE_LABELS,
} from './lib/constants';
import { findNearestValidPosition, findValidPositionForNewNode } from './lib/utils';

// === ActivePieces Integration ===
import { activePiecesAPI } from './services/activepieces-api';
import { ActivePiecesSetup } from './components/ActivePiecesSetup';

// === Core Components (Critical - Load Immediately) ===
import { WorkflowCanvasEnhanced } from './components/WorkflowCanvasEnhanced';
import { NodeTypesSidebarEnhanced } from './components/NodeTypesSidebarEnhanced';
import { AIChatSidebar } from './components/AIChatSidebar';
import { PropertyPanel } from './components/PropertyPanel';
import { WorkflowToolbarEnhanced } from './components/WorkflowToolbarEnhanced';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Button } from './components/ui/button';
import { AppHead } from './components/AppHead';
import { EnhancedNodeInteractions } from './components/EnhancedNodeInteractions';
import { useHistory } from './hooks/useHistory';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import type { WorkflowTemplate } from './data/templates';

// === Heavy Components - Lazy Load for Performance ===
// These components are loaded on-demand to reduce initial bundle size
const AnalyticsDashboard = lazy(() => import('./components/analytics/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const SearchPanel = lazy(() => import('./components/SearchPanel').then(m => ({ default: m.SearchPanel })));
const KeyboardShortcutsHelp = lazy(() => import('./components/KeyboardShortcutsHelp').then(m => ({ default: m.KeyboardShortcutsHelp })));
const TemplatesLibrary = lazy(() => import('./components/templates/TemplatesLibrary').then(m => ({ default: m.TemplatesLibrary })));

// Loading fallback component for lazy-loaded modules
const LazyLoadFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-foreground-muted">جاري التحميل...</p>
    </div>
  </div>
);

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

function AppContent() {
  const { resolvedTheme } = useTheme();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(3);
  const [notificationUrgentCount, setNotificationUrgentCount] = useState(0);
  const [hasShownToastHint, setHasShownToastHint] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hasStartedWorkflow, setHasStartedWorkflow] = useState(false);
  const [workflowName, setWorkflowName] = useState<string>('سير العمل الجديد');
  
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>();
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executingNodes, setExecutingNodes] = useState<Set<string>>(new Set());
  const [nodeExecutionStatus, setNodeExecutionStatus] = useState<Map<string, 'idle' | 'running' | 'success' | 'error' | 'paused'>>(new Map());
  const [nodeExecutionTimes, setNodeExecutionTimes] = useState<Map<string, number>>(new Map());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiChatCollapsed, setAiChatCollapsed] = useState(true); // AI Chat starts collapsed
  
  // Canvas Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement | null>(null);
  
  // ActivePieces state
  const [showActivePiecesSetup, setShowActivePiecesSetup] = useState(false);
  const [isActivePiecesConnected, setIsActivePiecesConnected] = useState(false);
  const [activePiecesFlowId, setActivePiecesFlowId] = useState<string | null>(null);

  // Analytics Dashboard state
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<any[]>([]);

  // Search & Keyboard Shortcuts state
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  // Templates Library state
  const [showTemplatesLibrary, setShowTemplatesLibrary] = useState(false);

  // History Management
  const history = useHistory({ maxSize: 50 });

  // Check ActivePieces connection on mount
  useEffect(() => {
    setIsActivePiecesConnected(activePiecesAPI.isConnected());
  }, []);

  // Push to history when nodes/connections change
  useEffect(() => {
    if (nodes.length > 0 || connections.length > 0) {
      history.pushState({ nodes, connections });
    }
  }, [nodes, connections]);

  const handleNodeAdd = (node: Node) => {
    // Smart Spacing: إيجاد موضع صالح للعقدة الجديدة
    const validPosition = findValidPositionForNewNode(
      node,
      nodes,
      expandedNodes
    );
    
    const nodeWithValidPosition = {
      ...node,
      position: validPosition
    };
    
    setNodes(prev => [...prev, nodeWithValidPosition]);
    setHasStartedWorkflow(true);
    // العقد الجديدة تبدأ مصغرة (لا نضيفها إلى expandedNodes)
    if (nodes.length === 0 && !hasShownToastHint) {
      toast.success('تمت الإضافة');
      setHasShownToastHint(true);
    }
  };

  const handleNodeMove = useCallback((id: string, position: { x: number; y: number }) => {
    setNodes(prev => {
      // Smart Spacing: التحقق من صلاحية الموضع الجديد
      const currentNode = prev.find(n => n.id === id);
      if (!currentNode) return prev;
      
      // استبعاد العقدة الحالية من قائمة العقد للتحقق
      const otherNodes = prev.filter(n => n.id !== id);
      
      const validPosition = findNearestValidPosition(
        { ...currentNode, position },
        position,
        otherNodes,
        expandedNodes
      );
      
      return prev.map(node => 
        node.id === id ? { ...node, position: validPosition } : node
      );
    });
  }, [expandedNodes]);

  const handleNodeSelect = (node: Node | null) => {
    setSelectedNode(node);
  };

  const handleNodeHover = (node: Node | null) => {
    setHoveredNode(node);
  };

  const handleDragOverChange = (isDragging: boolean) => {
    setIsDragOver(isDragging);
  };

  const handleNodeDelete = (id: string) => {
    setNodes(prev => prev.filter(node => node.id !== id));
    setConnections(prev => prev.filter(conn => conn.source !== id && conn.target !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
    if (hoveredNode?.id === id) setHoveredNode(null);
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    toast.success('تم حذف العقدة');
  };

  const handleNodeExpansionChange = (nodeId: string, isExpanded: boolean) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (isExpanded) {
        newSet.add(nodeId);
      } else {
        newSet.delete(nodeId);
      }
      return newSet;
    });
    
    // Smart Spacing: التحقق من التداخل بعد التوسع
    if (isExpanded) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;
      
      // تحديث expandedNodes مؤقتاً للاختبار
      const testExpandedNodes = new Set(expandedNodes);
      testExpandedNodes.add(nodeId);
      
      // التحقق من صلاحية الموضع الحالي
      const validPosition = findNearestValidPosition(
        node,
        node.position,
        nodes,
        testExpandedNodes
      );
      
      // إذا تغير الموضع، نحرك العقدة
      if (validPosition.x !== node.position.x || validPosition.y !== node.position.y) {
        setNodes(prev => prev.map(n =>
          n.id === nodeId ? { ...n, position: validPosition } : n
        ));
      }
    }
  };

  const handleConnect = (connection: Connection) => {
    setConnections(prev => [...prev, connection]);
    toast.connectionEstablished();
  };

  const handleUpdateNode = (nodeId: string, data: any) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    ));
    toast.success('تم التحديث');
  };

  const handleRun = async () => {
    if (nodes.length === 0) {
      toast.error('لا توجد عقد للتشغيل', {
        description: 'أضف عقد إلى سير العمل قبل التشغيل'
      });
      return;
    }

    setIsRunning(true);
    setExecutionProgress(0);
    const startTime = Date.now();
    const executionId = `exec-${Date.now()}`;
    
    toast.executionStarted();
    
    // Check if ActivePieces is connected
    const useActivePieces = activePiecesAPI.isConnected();
    
    try {
      if (useActivePieces) {
        // === ActivePieces Real Execution ===
        logger.info('🚀 Running workflow with ActivePieces');
        
        let flowId = activePiecesFlowId;
        
        // Create or update flow in ActivePieces
        if (!flowId) {
          logger.info('Creating new flow in ActivePieces...');
          toast.info('إنشاء سير العمل في ActivePieces...');
          
          const flow = await activePiecesAPI.createFlow(nodes, connections, 'Workflow from UI');
          flowId = flow.id;
          setActivePiecesFlowId(flowId);
          
          toast.success('تم إنشاء سير العمل في ActivePieces');
        } else {
          logger.info('Updating existing flow in ActivePieces...');
          toast.info('تحديث سير العمل في ActivePieces...');
          
          await activePiecesAPI.updateFlow(flowId, nodes, connections);
          toast.success('تم تحديث سير العمل');
        }
        
        // Execute flow
        logger.info('Executing flow in ActivePieces...', { flowId });
        toast.info('تشغيل سير العمل على ActivePieces...');
        
        const run = await activePiecesAPI.executeFlow(flowId);
        
        // Poll for status updates - SIMPLIFIED
        for (let i = 0; i < 30; i++) { // Max 30 seconds
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const status = await activePiecesAPI.getFlowRunStatus(run.id);
          setExecutionProgress(Math.min((i + 1) * 3, 95));
          
          if (status.status === 'SUCCEEDED') {
            setExecutionProgress(100);
            setExecutionTime(Date.now() - startTime);
            toast.executionCompleted(Date.now() - startTime);
            break;
          } else if (status.status === 'FAILED') {
            throw new Error('Flow execution failed');
          } else if (i === 29) {
            throw new Error('Execution timeout');
          }
        }
        
      } else {
        // === Local Simulation Mode - FAST ===
        logger.info('🎮 Running workflow in simulation mode');
        
        const nodeIds = nodes.map(n => n.id);
        const progressStep = 100 / nodeIds.length;
        
        for (let i = 0; i < nodeIds.length; i++) {
          const nodeId = nodeIds[i];
          
          setExecutingNodes(new Set([nodeId]));
          setNodeExecutionStatus(new Map([[nodeId, 'running']]));
          
          await new Promise(resolve => setTimeout(resolve, 150)); // Faster
          
          setExecutingNodes(new Set());
          setNodeExecutionStatus(new Map([[nodeId, 'success']]));
          setExecutionProgress((i + 1) * progressStep);
        }
        
        const duration = Date.now() - startTime;
        setExecutionTime(duration);
        toast.executionCompleted(duration);
        
        // حفظ سجل التنفيذ للتحليلات
        const executionRecord = {
          id: executionId,
          workflowId: activePiecesFlowId || 'local',
          workflowName,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date().toISOString(),
          duration,
          status: 'success',
          nodeCount: nodes.length,
          nodeExecutions: nodes.map((node, idx) => ({
            nodeId: node.id,
            nodeName: node.data?.label || `عقدة ${idx + 1}`,
            nodeType: node.type,
            startTime: new Date(startTime + idx * 150).toISOString(),
            endTime: new Date(startTime + (idx + 1) * 150).toISOString(),
            duration: 150,
            status: 'success'
          }))
        };
        setExecutionHistory(prev => [executionRecord, ...prev].slice(0, 100));
      }
    } catch (error: any) {
      logger.error('Execution error:', error);
      toast.error('خطأ في التشغيل', {
        description: error.message || 'حدث خطأ أثناء تشغيل سير العمل'
      });
      setExecutingNodes(new Set());
      setNodeExecutionStatus(new Map());
      
      // حفظ سجل الفشل
      const failedRecord = {
        id: executionId,
        workflowId: activePiecesFlowId || 'local',
        workflowName,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: Date.now() - startTime,
        status: 'failed',
        nodeCount: nodes.length,
        error: {
          type: error.name || 'Error',
          message: error.message,
          severity: 'high'
        }
      };
      setExecutionHistory(prev => [failedRecord, ...prev].slice(0, 100));
    } finally {
      setIsRunning(false);
      setExecutionProgress(0);
      
      // Clear states
      setTimeout(() => {
        setNodeExecutionStatus(new Map());
        setNodeExecutionTimes(new Map());
      }, 3000);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setExecutionProgress(0);
    setExecutingNodes(new Set());
    setNodeExecutionStatus(new Map());
    setNodeExecutionTimes(new Map());
    toast.info('تم إيقاف سير العمل');
  };

  const handleSave = () => {
    try {
      const workflowData = { 
        nodes, 
        connections,
        workflowName,
        metadata: {
          version: '2.0.0',
          createdAt: new Date().toISOString(),
          nodeCount: nodes.length,
          connectionCount: connections.length
        }
      };
      
      const dataStr = JSON.stringify(workflowData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      const fileName = workflowName.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '-') || 'workflow';
      link.download = `${fileName}-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.workflowSaved();
    } catch (error) {
      logger.error('Save error:', error);
      toast.error('فشل الحفظ');
    }
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.nodes && data.connections) {
            setNodes(data.nodes);
            setConnections(data.connections);
            setHasStartedWorkflow(data.nodes.length > 0);
            
            // تحميل اسم سير العمل إذا كان موجوداً
            if (data.workflowName) {
              setWorkflowName(data.workflowName);
              localStorage.setItem('workflow-name', data.workflowName);
            }
            
            toast.success('تم التحميل نجاح');
          }
        } catch (error) {
          toast.error('خطأ في التحميل');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = async (format: string, settings: any) => {
    try {
      const content = JSON.stringify({ nodes, connections }, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workflow-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('تم التصدير');
    } catch (error) {
      toast.error('خطأ في التصدير');
    }
  };

  const handleUndo = () => {
    const state = history.undo();
    if (state) {
      history.setUpdating(true);
      setNodes(state.nodes);
      setConnections(state.connections);
      setTimeout(() => history.setUpdating(false), 100);
      toast.success('تم التراجع');
    } else {
      toast.info('لا يوجد المزيد للتراجع');
    }
  };

  const handleRedo = () => {
    const state = history.redo();
    if (state) {
      history.setUpdating(true);
      setNodes(state.nodes);
      setConnections(state.connections);
      setTimeout(() => history.setUpdating(false), 100);
      toast.success('تم الإعادة');
    } else {
      toast.info('لا يوجد المزيد للإعادة');
    }
  };

  const handleTogglePreview = () => {
    if (nodes.length === 0) {
      toast.error('لا توجد عقد للمعاينة');
      return;
    }
    toast.info('معاينة سير العمل', {
      description: `${nodes.length} عقدة، ${connections.length} اتصال`
    });
  };

  const handleShowDashboard = () => {
    setShowAnalyticsDashboard(true);
  };

  const handleShowTemplates = () => {
    setShowTemplatesLibrary(true);
  };

  const handleInstallTemplate = (template: WorkflowTemplate) => {
    // Install template by loading its nodes and connections
    setNodes(template.nodes);
    setConnections(template.connections);
    setHasStartedWorkflow(true);
    
    // Update workflow name
    if (template.nameAr) {
      setWorkflowName(template.nameAr);
      localStorage.setItem('workflow-name', template.nameAr);
    }
    
    toast.success('تم تثبيت القالب بنجاح', {
      description: `${template.nodes.length} عقدة، ${template.connections.length} اتصال`
    });
  };

  // ActivePieces Handlers
  const handleActivePiecesSetup = () => {
    setShowActivePiecesSetup(true);
  };

  const handleActivePiecesConnected = () => {
    setIsActivePiecesConnected(true);
    toast.success('🔌 تم الاتصال بـ ActivePieces', {
      description: 'يمكنك الآن تشغيل سير العمل بشكل فعلي على ActivePieces'
    });
  };

  const handleSyncToActivePieces = async () => {
    if (!activePiecesAPI.isConnected()) {
      toast.error('غير متصل بـ ActivePieces', {
        description: 'قم بالاتصال أولاً من شريط الأوات'
      });
      return;
    }

    if (nodes.length === 0) {
      toast.error('لا توجد عقد للمزامنة');
      return;
    }

    try {
      toast.info('مزامنة سير العمل مع ActivePieces...');
      
      if (activePiecesFlowId) {
        // Update existing flow
        await activePiecesAPI.updateFlow(activePiecesFlowId, nodes, connections);
        toast.success('✅ تم تحديث سير العمل في ActivePieces');
      } else {
        // Create new flow
        const flow = await activePiecesAPI.createFlow(nodes, connections, 'Workflow from UI');
        setActivePiecesFlowId(flow.id);
        toast.success('✅ تم إنشاء سي العمل في ActivePieces');
      }
    } catch (error: any) {
      logger.error('Sync error:', error);
      toast.error('فشل المزامنة', {
        description: error.message
      });
    }
  };

  // === 🎯 Fixed Center Zoom System v9.0.0 ===
  // الزوم دائماً من مركز الكانفا الثابت - المركز لا يتحرك أبداً
  
  // Zoom Constants - Professional Standards
  const MIN_ZOOM = 10;      // 10% minimum
  const MAX_ZOOM = 400;     // 400% maximum
  const ZOOM_STEP = 10;     // 10% increment for buttons
  const ZOOM_WHEEL_FACTOR = 1.05; // 5% per wheel tick - smooth & natural
  
  // Fixed Center Zoom - المركز يبقى دائماً في منتصف الشاشة
  const applyCenterBasedZoom = useCallback((newZoomLevel: number) => {
    // فقط تحديث الزوم - Pan offset يبقى 0,0 دائماً
    // هذا يضمن أن مركز الكانفا (center indicator) يبقى في منتصف الشاشة
    setZoomLevel(newZoomLevel);
    setPanOffset({ x: 0, y: 0 }); // المركز دائماً ثابت
  }, []);
  
  // Smooth Zoom In - المركز يبقى ثابتاً دائماً
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoomLevel + ZOOM_STEP, MAX_ZOOM);
    const rounded = Math.round(newZoom);
    
    if (rounded >= MAX_ZOOM) {
      toast.info('🔍 أقصى تكبير', {
        description: `${MAX_ZOOM}% - الحد الأقصى`
      });
    }
    
    applyCenterBasedZoom(rounded);
  }, [zoomLevel, applyCenterBasedZoom]);

  // Smooth Zoom Out - المركز يبقى ثابتاً دائماً
  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoomLevel - ZOOM_STEP, MIN_ZOOM);
    const rounded = Math.round(newZoom);
    
    if (rounded <= MIN_ZOOM) {
      toast.info('🔍 أقصى تصغير', {
        description: `${MIN_ZOOM}% - الحد الأدنى`
      });
    }
    
    applyCenterBasedZoom(rounded);
  }, [zoomLevel, applyCenterBasedZoom]);

  // Reset View - Back to 100% center (المركز يبقى ثابتاً)
  const handleResetView = useCallback(() => {
    setZoomLevel(100);
    setPanOffset({ x: 0, y: 0 }); // المركز دائماً في 0,0
    
    toast.success('إعادة تعيين العرض', {
      description: 'تم إعادة التكبير إلى 100%'
    });
  }, []);

  // New Canvas Control Handlers
  const handleSearch = () => {
    setShowSearchPanel(true);
  };

  const handleShare = () => {
    if (nodes.length === 0) {
      toast.error('لا يوجد محتوى للمشاركة', {
        description: 'أضف عقد إلى سير العمل أولاً'
      });
      return;
    }

    // Create share data
    const shareData = {
      title: 'سير العمل - نظام الأتمتة المرئية',
      text: `سير عمل يحتوي على ${nodes.length} عقدة و ${connections.length} اتصال`,
      url: window.location.href
    };

    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => {
          toast.success('✅ تمت المشاركة بنجاح');
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            logger.error('Share error:', error);
            fallbackShare();
          }
        });
    } else {
      fallbackShare();
    }

    function fallbackShare() {
      // Copy link to clipboard as fallback
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast.success(' تم نسخ الرابط', {
            description: 'تم نسخ رابط سير العمل إلى الحافظة'
          });
        })
        .catch(() => {
          toast.info('📋 مشاركة سير العمل', {
            description: `${nodes.length} عقدة، ${connections.length} اتصال`
          });
        });
    }
  };

  const handleCollaboration = () => {
    toast.info('👥 وضع العاون', {
      description: 'ميزة قيد التطوير'
    });
  };

  const handleShowAll = () => {
    if (nodes.length === 0) {
      toast.error('لا توجد عقد لعرضها');
      return;
    }
    
    toast.success('عرض جميع العقد', {
      description: `${nodes.length} عقدة في المساحة`
    });
  };

  const handleAutoLayout = () => {
    if (nodes.length === 0) {
      toast.error('لا توجد عقد لترتيبها');
      return;
    }

    // نظام إعادة هيكلة ذكي يحترم المساحات الوهمية 280×190
    const VIRTUAL_SPACING_X = 300; // 280 + 20px مسافة أمان
    const VIRTUAL_SPACING_Y = 210; // 190 + 20px مسافة أمان
    const START_X = 400;
    const START_Y = 300;
    
    // حساب عدد الأعمدة بناءً على عدد العقد
    const cols = Math.ceil(Math.sqrt(nodes.length));
    
    // ترتيب العقد في شبكة منظمة مع احترام المساحات الوهمية
    const layoutedNodes = nodes.map((node, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      return {
        ...node,
        position: {
          x: START_X + (col * VIRTUAL_SPACING_X),
          y: START_Y + (row * VIRTUAL_SPACING_Y)
        }
      };
    });
    
    setNodes(layoutedNodes);
    
    toast.success('✨ تم إعادة الهيكلة بنجاح', {
      description: `${nodes.length} عقدة في ${Math.ceil(nodes.length / cols)} صف و ${cols} عمود`
    });
  };

  // Reset function for troubleshooting
  const handleReset = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
    setExecutionTime(undefined);
    setExecutionProgress(0);
    setExecutingNodes(new Set());
    setNodeExecutionStatus(new Map());
    setNodeExecutionTimes(new Map());
    setHasStartedWorkflow(false);
    setExpandedNodes(new Set());
    
    // إعادة تعيين اسم سير العمل
    const defaultName = 'ير العمل الجديد';
    setWorkflowName(defaultName);
    localStorage.setItem('workflow-name', defaultName);
    
    toast.info('تم إعادة تعيين سير العمل', {
      description: 'تم مسح جميع العقد والإعدادات'
    });
  };

  // Handle workflow name change with localStorage persistence
  const handleWorkflowNameChange = (name: string) => {
    setWorkflowName(name);
    localStorage.setItem('workflow-name', name);
    toast.success('تم حفظ اسم سير العمل', {
      description: name
    });
  };

  // Keyboard Shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      // Canvas Controls
      { key: '=', action: handleResetView, description: 'إعادة تعيين الزوم', category: 'الكانفا' },
      { key: '+', action: handleZoomIn, description: 'تكبير', category: 'الكانفا' },
      { key: '-', action: handleZoomOut, description: 'تصغير', category: 'الكانفا' },
      
      // File Operations
      { key: 's', ctrl: true, action: handleSave, description: 'حفظ', category: 'الملف' },
      { key: 'o', ctrl: true, action: handleLoad, description: 'فتح', category: 'الملف' },
      { key: 'e', ctrl: true, action: () => handleExport('json', {}), description: 'تصدير', category: 'الملف' },
      
      // Editing
      { key: 'z', ctrl: true, action: handleUndo, description: 'تراجع', category: 'التحرير' },
      { key: 'y', ctrl: true, action: handleRedo, description: 'إعادة', category: 'التحرير' },
      { key: 'Delete', action: () => {
        if (selectedNode) handleNodeDelete(selectedNode.id);
      }, description: 'حذف', category: 'التحرير' },
      { key: 'Escape', action: () => setSelectedNode(null), description: 'إلغاء التحديد', category: 'التحرير' },
      
      // Search & Navigation
      { key: 'f', ctrl: true, action: handleSearch, description: 'بحث', category: 'البحث' },
      { key: 'a', ctrl: true, shift: true, action: handleShowDashboard, description: 'التحليلات', category: 'البحث' },
      { key: 't', ctrl: true, shift: true, action: handleShowTemplates, description: 'القوالب', category: 'البحث' },
      { key: '?', action: () => setShowKeyboardHelp(true), description: 'المساعدة', category: 'البحث' },
      
      // Workflow
      { key: 'r', ctrl: true, action: handleRun, description: 'تشغيل', category: 'سير العمل' },
      { key: '.', ctrl: true, action: handleStop, description: 'إيقاف', category: 'سير العمل' },
      { key: 'p', ctrl: true, action: handleTogglePreview, description: 'معاينة', category: 'سير العمل' },
      { key: 'l', ctrl: true, action: handleAutoLayout, description: 'ترتيب تلقائي', category: 'سير العمل' },
    ],
    enabled: true
  });
  
  return (
      <>
        {/* SEO & Meta Tags - Lighthouse Optimization */}
        <AppHead />
        
        <TooltipProvider>
          <ErrorBoundary
            onError={(error, errorInfo) => {
              logger.error('Application error:', error, errorInfo);
              toast.error('حدث خطأ في التطبيق', {
                description: 'سيتم إعادة تشغيل المكون تلقائياً'
              });
            }}
          >
            <DndProvider backend={HTML5Backend}>
            <div className="h-screen flex flex-col bg-background text-foreground text-right" dir="rtl">
            {/* Toolbar */}
            <WorkflowToolbarEnhanced
          isRunning={isRunning}
          onRun={handleRun}
          onStop={handleStop}
          onSave={handleSave}
          onLoad={handleLoad}
          onExport={handleExport}
          nodes={nodes}
          connections={connections}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onTogglePreview={handleTogglePreview}
          onSearch={handleSearch}
          onShare={handleShare}
          onCollaboration={handleCollaboration}
          onShowAll={handleShowAll}
          onAutoLayout={handleAutoLayout}
          onShowDashboard={handleShowDashboard}
          onShowTemplates={handleShowTemplates}
          onReset={handleReset}
          onActivePiecesSetup={handleActivePiecesSetup}
          isActivePiecesConnected={isActivePiecesConnected}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          zoomLevel={zoomLevel}
          nodeCount={nodes.length}
          executionTime={executionTime}
          executionProgress={executionProgress}
          notificationUnreadCount={notificationUnreadCount}
          notificationUrgentCount={notificationUrgentCount}
          onNotificationClick={() => {
            // Notification action callback - update count when read
            setNotificationUnreadCount(prev => Math.max(0, prev - 1));
          }}
        />

        {/* Main content - Full width, NO scroll bars */}
        <div className="flex-1 flex overflow-hidden">
            {/* Canvas - Full width, NO scroll */}
            <div className="flex-1 relative bg-background overflow-hidden" style={{ 
              overflowX: 'hidden',
              overflowY: 'hidden'
            }}>

                  <ErrorBoundary fallback={
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8 card-elevated">
                        <p className="text-sm text-foreground-muted mb-4">خطأ في منطقة العمل</p>
                        <Button onClick={handleReset} size="sm" className="btn-primary">
                          إعادة تعيين سير العمل
                        </Button>
                      </div>
                    </div>
                  }>
                    <WorkflowCanvasEnhanced
                      ref={canvasRef}
                      nodes={nodes}
                      connections={connections}
                      onNodeMove={handleNodeMove}
                      onNodeAdd={handleNodeAdd}
                      onNodeSelect={handleNodeSelect}
                      onNodeDelete={handleNodeDelete}
                      onConnect={handleConnect}
                      selectedNode={selectedNode}
                      executingNodes={executingNodes}
                      nodeExecutionStatus={nodeExecutionStatus}
                      nodeExecutionTimes={nodeExecutionTimes}
                      onNodeHover={handleNodeHover}
                      onDragOverChange={handleDragOverChange}
                      sidebarCollapsed={sidebarCollapsed}
                      onAutoLayout={handleAutoLayout}
                      expandedNodes={expandedNodes}
                      onNodeExpansionChange={handleNodeExpansionChange}
                      zoomLevel={zoomLevel}
                      onZoomChange={setZoomLevel}
                      panOffset={panOffset}
                      onPanOffsetChange={setPanOffset}
                    />
                  </ErrorBoundary>


              {/* Empty state cards - Fixed position - Same location for both */}
              <AnimatePresence mode="wait">
                {/* Card 1: Start Workflow - Only show before any workflow started */}
                {nodes.length === 0 && !isDragOver && !hasStartedWorkflow && (
                  <motion.div
                    key="start-card"
                    initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                  <div className="text-center p-8 card-elevated pointer-events-auto">
                    <h3 className="text-xl mb-2 text-foreground">ادأ إنشاء سير العمل</h3>
                    <p className="text-foreground-muted mb-4">اسحب العقد من الشريط ا��جانبي لبدء إنشاء سير العمل</p>
                    <div className="text-6xl mb-4">🚀</div>
                    <p className="text-sm text-foreground-muted mb-4">استخدم الأدوات في الأعلى لحفظ وتشغيل سير العمل</p>
                    
                    {/* Instructions */}
                    <div className="mt-4 p-4 border-2 border-dashed border-primary rounded-lg bg-primary-muted">
                      <div className="text-sm text-primary font-medium">
                        📥 اسحب أي عقدة من الشريط الجانبي وأفلتها هنا
                      </div>
                      <div className="text-xs text-foreground-muted mt-1">
                        جميع العقد الـ 13 متاحة للاستخدام
                      </div>
                    </div>
                  </div>
                  </motion.div>
                )}
                
                {/* Card 2: Drop Node Here - Only shows when dragging AND canvas is empty */}
                {isDragOver && nodes.length === 0 && (
                  <motion.div
                    key="drop-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="glass-medium p-8 rounded-2xl border-2 border-primary/50 border-dashed pointer-events-none"
                      transition={{
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    >
                      <div className="text-center pointer-events-none">
                        <Activity className="w-12 h-12 text-primary mx-auto mb-3 pointer-events-none" />
                        <p className="text-lg font-semibold text-primary pointer-events-none">أفلت العقدة هنا</p>
                        <p className="text-sm text-foreground-muted mt-1 pointer-events-none">لإضافتها إلى سير العمل</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Advanced features disabled for performance */}

            {/* Enhanced Node Interactions */}
            <EnhancedNodeInteractions
              nodes={nodes}
              connections={connections}
              selectedNode={selectedNode}
              onNodeUpdate={handleUpdateNode}
              onNodeDelete={handleNodeDelete}
              onNodeDuplicate={(nodeId) => {
                const node = nodes.find(n => n.id === nodeId);
                if (node && node.position) {
                  const newNode = {
                    ...node,
                    id: `${node.id}-copy-${Date.now()}`,
                    position: { x: node.position.x + 50, y: node.position.y + 50 }
                  };
                  handleNodeAdd(newNode);
                }
              }}
              hoveredNode={hoveredNode}
              executingNodes={executingNodes}
              nodeExecutionStatus={nodeExecutionStatus}
              nodeExecutionTimes={nodeExecutionTimes}
            />

            {/* Collaboration disabled for performance */}

            {/* Property Panel */}
            <PropertyPanel
              selectedNode={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdateNode={handleUpdateNode}
            />

            {/* Collapse/Expand Toggle Button - INDEPENDENT - Above Everything */}
            <motion.button
              className="sidebar-collapse-btn
                         fixed top-1/2 -translate-y-1/2 z-[10002]
                         w-10 h-10 rounded-full
                         flex items-center justify-center
                         transition-all duration-300
                         group cursor-pointer
                         glass-medium border border-border-strong shadow-xl
                         hover:shadow-2xl"
              style={{
                left: sidebarCollapsed ? 'calc(80px - 20px)' : 'calc(320px - 20px)'
              }}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              whileHover={{ 
                scale: 1.15,
                x: 4
              }}
              whileTap={{ scale: 0.9 }}
              title={sidebarCollapsed ? "توسيع الشريط الجانبي" : "طي الشريط الجانبي"}
            >
              <motion.div
                animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <ChevronRight className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </motion.button>

            {/* Sidebar - Moved to Left - Collapsible - Fixed Top Layer */}
            <div className="fixed left-0 top-0 bottom-0 z-[200]">
              <ErrorBoundary fallback={
                <div className="min-w-[80px] bg-background-elevated border-l border-border flex items-center justify-center h-full">
                  <div className="text-center p-4">
                    <p className="text-sm text-foreground-muted">خطأ</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      size="sm" 
                      className="mt-2 btn-primary"
                    >
                      ↻
                    </Button>
                  </div>
                </div>
              }>
                <NodeTypesSidebarEnhanced 
                  isCollapsed={sidebarCollapsed}
                  workflowName={workflowName}
                  onWorkflowNameChange={handleWorkflowNameChange}
                />
              </ErrorBoundary>
            </div>
          </div>

            {/* Toast notifications - Top Center below Toolbar */}
            <Toaster 
              position="top-center" 
              toastOptions={{
                style: {
                  marginTop: '0px',
                },
              }}
            />

            {/* ActivePieces Setup Modal */}
            <ActivePiecesSetup
              isOpen={showActivePiecesSetup}
              onClose={() => setShowActivePiecesSetup(false)}
              onConnected={handleActivePiecesConnected}
            />

            {/* ActivePieces Status Indicator - Fixed bottom right */}
            {isActivePiecesConnected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 left-6 z-50 glass-medium px-4 py-3 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-foreground">
                    متصل بـ ActivePieces
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleActivePiecesSetup}
                    className="h-7 px-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Analytics Dashboard - Lazy Loaded */}
            <Suspense fallback={<LazyLoadFallback />}>
              {showAnalyticsDashboard && (
                <AnalyticsDashboard
                  isOpen={showAnalyticsDashboard}
                  onClose={() => setShowAnalyticsDashboard(false)}
                  executionHistory={executionHistory}
                  onRefresh={() => {
                    // Refresh logic if needed
                    logger.info('Analytics dashboard refreshed');
                  }}
                />
              )}
            </Suspense>

            {/* Search Panel - Lazy Loaded */}
            <Suspense fallback={<LazyLoadFallback />}>
              {showSearchPanel && (
                <SearchPanel
                  isOpen={showSearchPanel}
                  onClose={() => {
                    setShowSearchPanel(false);
                    setHighlightedNodeId(null);
                  }}
                  nodes={nodes}
                  onNodeSelect={(nodeId) => {
                    const node = nodes.find(n => n.id === nodeId);
                    if (node) {
                      setSelectedNode(node);
                      // Center on node (optional)
                      // setPanOffset({ x: -node.position.x, y: -node.position.y });
                    }
                  }}
                  onNodeHighlight={setHighlightedNodeId}
                />
              )}
            </Suspense>

            {/* Keyboard Shortcuts Help - Lazy Loaded */}
            <Suspense fallback={<LazyLoadFallback />}>
              {showKeyboardHelp && (
                <KeyboardShortcutsHelp
                  isOpen={showKeyboardHelp}
                  onClose={() => setShowKeyboardHelp(false)}
                />
              )}
            </Suspense>

            {/* Templates Library - Lazy Loaded */}
            <Suspense fallback={<LazyLoadFallback />}>
              {showTemplatesLibrary && (
                <TemplatesLibrary
                  isOpen={showTemplatesLibrary}
                  onClose={() => setShowTemplatesLibrary(false)}
                  onInstall={handleInstallTemplate}
                />
              )}
            </Suspense>

            {/* === AI Chat Sidebar - Right Side === */}
            <AIChatSidebar
              isCollapsed={aiChatCollapsed}
              onToggleCollapse={() => setAiChatCollapsed(!aiChatCollapsed)}
            />

          </div>
        
        </DndProvider>
      </ErrorBoundary>
    </TooltipProvider>
      </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AppContent />
    </ThemeProvider>
  );
}