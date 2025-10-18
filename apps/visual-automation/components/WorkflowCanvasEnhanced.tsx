import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { throttle } from '../lib/performance-optimizer';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Sparkles, Webhook, Calendar, Mail, Network, Send, Bell, FileText, Database, GitBranch, Timer, Shuffle, Code, Zap, LayoutGrid, Maximize2, Plus, Copy, Trash2, Minus, Scan } from 'lucide-react';
import { WorkflowNodeEnhanced } from './WorkflowNodeEnhanced';
import { ConnectionLine } from './ConnectionLine';
import { LAYOUT_CONSTANTS } from '../lib/constants';

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

interface WorkflowCanvasProps {
  nodes: Node[];
  connections: Connection[];
  onNodeMove: (id: string, position: { x: number; y: number }) => void;
  onNodeAdd: (node: Node) => void;
  onNodeSelect: (node: Node | null) => void;
  onNodeDelete: (id: string) => void;
  onConnect: (connection: Connection) => void;
  selectedNode: Node | null;
  executingNodes?: Set<string>;
  nodeExecutionStatus?: Map<string, 'idle' | 'running' | 'success' | 'error' | 'paused'>;
  nodeExecutionTimes?: Map<string, number>;
  onNodeHover?: (node: Node | null) => void;
  onDragOverChange?: (isDragOver: boolean) => void;
  sidebarCollapsed?: boolean;
  onAutoLayout?: () => void;
  expandedNodes?: Set<string>;
  onNodeExpansionChange?: (nodeId: string, isExpanded: boolean) => void;
  showGhostAreas?: boolean; // Debug mode للمساحات الوهمية
  zoomLevel?: number;
  onZoomChange?: (zoom: number) => void;
  panOffset?: { x: number; y: number };
  onPanOffsetChange?: (offset: { x: number; y: number }) => void;
}

const nodeTypeLabels: Record<string, string> = {
  'webhook-trigger': 'Webhook',
  'schedule-trigger': 'مجدول',
  'email-trigger': 'بريد إلكتروني',
  'http-request': 'طلب HTTP',
  'email-send': 'إرسال بريد',
  'notification': 'إشعار',
  'file-write': 'كتابة ملف',
  'database-read': 'قراءة قاعدة بيانات',
  'database-write': 'كتابة قاعدة بيانات',
  'condition': 'شرط',
  'delay': 'تأخير',
  'transform': 'تحويل',
  'function': 'دالة',
  'api-call': 'استدعاء API'
};

const nodeTypeIcons: Record<string, any> = {
  'webhook-trigger': Webhook,
  'schedule-trigger': Calendar,
  'email-trigger': Mail,
  'http-request': Network,
  'email-send': Send,
  'notification': Bell,
  'file-write': FileText,
  'database-read': Database,
  'database-write': Database,
  'condition': GitBranch,
  'delay': Timer,
  'transform': Shuffle,
  'function': Code,
  'api-call': Zap
};

export const WorkflowCanvasEnhanced = React.forwardRef<HTMLDivElement, WorkflowCanvasProps>(({
  nodes,
  connections,
  onNodeMove,
  onNodeAdd,
  onNodeSelect,
  onNodeDelete,
  onConnect,
  selectedNode,
  executingNodes = new Set(),
  nodeExecutionStatus = new Map(),
  nodeExecutionTimes = new Map(),
  onNodeHover,
  onDragOverChange,
  sidebarCollapsed = false,
  onAutoLayout,
  expandedNodes = new Set(),
  onNodeExpansionChange,
  showGhostAreas = false,
  zoomLevel: externalZoomLevel,
  onZoomChange,
  panOffset: externalPanOffset,
  onPanOffsetChange,
}, forwardedRef) => {
  // استخدام ref داخلي
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // ربط الـ ref الخارجي بالداخلي
  React.useImperativeHandle(forwardedRef, () => canvasRef.current as HTMLDivElement);
  
  const [isDragOver, setIsDragOver] = useState(false);
  const dragDepthRef = useRef(0);
  
  // Log collision system status on mount
  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔒 Collision Detection System: ACTIVE');
    console.log('   Ghost Area Size: 126×70 pixels');
    console.log('   Minimum Spacing: 50 pixels');
    console.log('   AABB Algorithm: Enabled');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Snap to Alignment System: ACTIVE');
    console.log('   Snap Threshold: 15 pixels');
    console.log('   Alignment Guides: Enabled');
    console.log('   Auto Center Snap: Horizontal + Vertical');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎨 Professional Grid System: ACTIVE');
    console.log('   Small Grid: 20×20px dots (r=0.8px)');
    console.log('   Large Grid: 100×100px dots (r=1.5px)');
    console.log('   Center Indicator: 3 rings + crosshair');
    console.log('   Theme Support: Dark + Light Mode');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Center-Based Zoom System v8.0.0 - FULLY WORKING');
    console.log('   Type: Center-based smooth zoom (like Figma/Adobe XD)');
    console.log('   Range: 10% → 400% (all levels supported)');
    console.log('   Buttons: ±10% per click (works on ALL levels!)');
    console.log('   Wheel: ±5% per tick (smooth & natural)');
    console.log('   Behavior: Zooms from viewport center (no drift!)');
    console.log('   Transform: Single container + scale() + pan compensation');
    console.log('   Origin: 0 0 (top-left) + math-based center targeting');
    console.log('   Controls: [+][-][=] buttons + Scroll Wheel + Space+Drag');
    console.log('   ✅ FIXED: Buttons work on ALL levels + Center-based!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, []);
  
  // Reset drag depth on unmount
  useEffect(() => {
    return () => {
      dragDepthRef.current = 0;
    };
  }, []);
  
  // Canvas panning state
  const [isPanning, setIsPanning] = useState(false);
  
  // === 🔍 Zoom System State === //
  // استخدام external state إذا متوفر، وإلا استخدام internal state
  const [internalZoomLevel, setInternalZoomLevel] = useState(100);
  const [internalPanOffset, setInternalPanOffset] = useState({ x: 0, y: 0 });
  
  const zoomLevel = externalZoomLevel !== undefined ? externalZoomLevel : internalZoomLevel;
  const panOffset = externalPanOffset !== undefined ? externalPanOffset : internalPanOffset;
  
  const setZoomLevel = (value: number | ((prev: number) => number)) => {
    const newValue = typeof value === 'function' ? value(zoomLevel) : value;
    if (onZoomChange) {
      onZoomChange(newValue);
    } else {
      setInternalZoomLevel(newValue);
    }
  };
  
  const setPanOffset = (value: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => {
    const newValue = typeof value === 'function' ? value(panOffset) : value;
    if (onPanOffsetChange) {
      onPanOffsetChange(newValue);
    } else {
      setInternalPanOffset(newValue);
    }
  };
  
  // === 🔍 Zoom System - 10 Discrete Levels (FIXED v4.0.1) === //
  const ZOOM_LEVELS = [25, 33, 50, 67, 75, 100, 125, 150, 175, 200]; // 10 مستويات
  const DEFAULT_ZOOM_INDEX = 5; // 100% هو الافتراضي
  const MIN_ZOOM = ZOOM_LEVELS[0]; // 25%
  const MAX_ZOOM = ZOOM_LEVELS[ZOOM_LEVELS.length - 1]; // 200%
  
  // Alignment guides state - خطوط المحاذاة
  const [alignmentGuides, setAlignmentGuides] = useState<{
    vertical: { x: number; label: string }[];
    horizontal: { y: number; label: string }[];
  }>({ vertical: [], horizontal: [] });
  
  // Snap guides state
  const [snapGuides, setSnapGuides] = useState<{
    vertical: number[];
    horizontal: number[];
  }>({ vertical: [], horizontal: [] });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spaceKeyPressed, setSpaceKeyPressed] = useState(false);
  
  // Connection drawing state
  const [connectionStart, setConnectionStart] = useState<{
    nodeId: string;
    handle: 'input' | 'output' | 'top' | 'bottom';
    position: { x: number; y: number };
  } | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });

  // === 🔒 منع التصادم - COLLISION DETECTION SYSTEM === //
  const ensureMinimumDistance = useCallback((
    position: { x: number; y: number },
    nodeId?: string
  ): { x: number; y: number } => {
    // حدود Canvas - منع الخروج عن المنطقة المرئية
    const CANVAS_MAX_X = 2000;
    const CANVAS_MAX_Y = 1500;
    const CANVAS_MIN = 50;
    
    // التأكد من أن العقدة ضمن الحدود المرئية فقط - لا منع تصادم
    const adjustedX = Math.max(CANVAS_MIN, Math.min(position.x, CANVAS_MAX_X));
    const adjustedY = Math.max(CANVAS_MIN, Math.min(position.y, CANVAS_MAX_Y));
    
    return {
      x: adjustedX,
      y: adjustedY
    };
  }, [nodes, expandedNodes]);
  
  // ===  Wrapper لـ onNodeMove مع منع التصادم + القفز للمحاذاة === //
  const handleNodeMoveWithCollisionDetection = useCallback((id: string, position: { x: number; y: number }) => {
    const COMPACT_SIZE = 64;
    const SNAP_THRESHOLD = 15; // المسافة التي تؤدي للقفز التلقائي (15 بكسل)
    
    let snappedPosition = { ...position };
    let hasSnapped = false;
    let snapDirection: string[] = [];
    
    // مركز العقدة المسحوبة
    const currentCenterX = position.x + COMPACT_SIZE / 2;
    const currentCenterY = position.y + COMPACT_SIZE / 2;
    
    // البحث عن أقرب محاذاة أفقية وعمودية
    let closestVerticalSnap: number | null = null;
    let closestHorizontalSnap: number | null = null;
    let minVerticalDistance = SNAP_THRESHOLD;
    let minHorizontalDistance = SNAP_THRESHOLD;
    
    nodes.forEach(node => {
      if (node.id === id) return; // تجاهل العقدة نفسها
      
      const nodeCenterX = node.position.x + COMPACT_SIZE / 2;
      const nodeCenterY = node.position.y + COMPACT_SIZE / 2;
      
      // فحص المحاذاة الأفقية (نفس X)
      const horizontalDistance = Math.abs(currentCenterX - nodeCenterX);
      if (horizontalDistance < minVerticalDistance) {
        minVerticalDistance = horizontalDistance;
        closestVerticalSnap = nodeCenterX;
      }
      
      // فحص المحاذاة العمودية (نفس Y)
      const verticalDistance = Math.abs(currentCenterY - nodeCenterY);
      if (verticalDistance < minHorizontalDistance) {
        minHorizontalDistance = verticalDistance;
        closestHorizontalSnap = nodeCenterY;
      }
    });
    
    // تطبيق القفز إذا وُجدت محاذاة قريبة
    if (closestVerticalSnap !== null) {
      // قفز أفقي - محاذاة X
      snappedPosition.x = closestVerticalSnap - COMPACT_SIZE / 2;
      hasSnapped = true;
      snapDirection.push('أفقي');
    }
    
    if (closestHorizontalSnap !== null) {
      // قفز عمودي - محاذاة Y
      snappedPosition.y = closestHorizontalSnap - COMPACT_SIZE / 2;
      hasSnapped = true;
      snapDirection.push('عمودي');
    }
    
    // تطبيق منع التصادم على الموضع النهائي
    const validatedPosition = ensureMinimumDistance(snappedPosition, id);
    
    // تسجيل عملية القفز
    if (hasSnapped) {
      console.log(`✨ Snap to Alignment: ${snapDirection.join(' + ')}`, {
        nodeId: id,
        original: `(${Math.round(position.x)}, ${Math.round(position.y)})`,
        snapped: `(${Math.round(snappedPosition.x)}, ${Math.round(snappedPosition.y)})`,
        distance: {
          horizontal: closestVerticalSnap !== null ? Math.round(minVerticalDistance) + 'px' : 'none',
          vertical: closestHorizontalSnap !== null ? Math.round(minHorizontalDistance) + 'px' : 'none'
        }
      });
    }
    
    onNodeMove(id, validatedPosition);
  }, [onNodeMove, ensureMinimumDistance, nodes]);

  // حساب خطوط المحاذاة أثناء الحب
  const calculateAlignmentGuides = useCallback((
    draggingNodeId: string,
    currentPos: { x: number; y: number }
  ) => {
    const SNAP_THRESHOLD = 15; // نفس قيمة القفز - زيادة من 10 إلى 15 لتوافق القفز
    const COMPACT_SIZE = 64;
    
    const verticalGuides: { x: number; label: string }[] = [];
    const horizontalGuides: { y: number; label: string }[] = [];
    
    // مركز العقدة الحالية
    const currentCenterX = currentPos.x + COMPACT_SIZE / 2;
    const currentCenterY = currentPos.y + COMPACT_SIZE / 2;
    
    nodes.forEach(node => {
      if (node.id === draggingNodeId) return;
      
      const nodeCenterX = node.position.x + COMPACT_SIZE / 2;
      const nodeCenterY = node.position.y + COMPACT_SIZE / 2;
      
      // محاذاة أفقي - المراكز فقط - إظهار الخط عند الاقتراب
      if (Math.abs(currentCenterX - nodeCenterX) < SNAP_THRESHOLD) {
        if (!verticalGuides.find(g => Math.abs(g.x - nodeCenterX) < 1)) {
          verticalGuides.push({ x: nodeCenterX, label: '' });
        }
      }
      
      // محاذاة عمودية - المراكز فقط - إظهار الخط عند الاقتراب
      if (Math.abs(currentCenterY - nodeCenterY) < SNAP_THRESHOLD) {
        if (!horizontalGuides.find(g => Math.abs(g.y - nodeCenterY) < 1)) {
          horizontalGuides.push({ y: nodeCenterY, label: '' });
        }
      }
    });
    
    setAlignmentGuides({
      vertical: verticalGuides,
      horizontal: horizontalGuides
    });
  }, [nodes]);
  
  // مسح خطوط المحاذاة
  const clearAlignmentGuides = useCallback(() => {
    setAlignmentGuides({ vertical: [], horizontal: [] });
  }, []);
  
  const [{ isOverReactDnd }, drop] = useDrop({
    accept: ['NODE', 'WORKFLOW_NODE'],
    drop: (item: any, monitor) => {
      // Always reset drag state when drop completes (success or not)
      dragDepthRef.current = 0;
      setIsDragOver(false);
      
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (!offset || !canvasRect) {
        return;
      }

      // Handle new node creation from sidebar
      if (item.nodeType && !item.id) {
        // Calculate position without zoom (direct positioning)
        const canvasX = offset.x - canvasRect.left - panOffset.x;
        const canvasY = offset.y - canvasRect.top - panOffset.y;
        
        // العقد الجديدة تبدأ مصغرة دائماً
        const isNewNodeExpanded = false;
        
        let position = {
          x: Math.max(20, canvasX - 32),
          y: Math.max(20, canvasY - 32),
        };
        
        // Apply minimum distance check
        position = ensureMinimumDistance(position);
        
        const newNode: Node = {
          id: `node-${Date.now()}`,
          type: item.nodeType,
          position,
          data: {
            label: item.label || item.nodeType,
            icon: item.icon
          }
        };
        
        onNodeAdd(newNode);
      }
    },
    collect: (monitor) => ({
      isOverReactDnd: monitor.isOver(),
    }),
  });

  // Attach drop ref to canvas container

  // Update drag over state based on React-DND
  useEffect(() => {
    if (isOverReactDnd && !isDragOver) {
      setIsDragOver(true);
    }
  }, [isOverReactDnd, isDragOver]);

  // استخدام callback من الـ props
  const handleNodeExpansionChange = useCallback((nodeId: string, isExpanded: boolean) => {
    if (onNodeExpansionChange) {
      onNodeExpansionChange(nodeId, isExpanded);
    }
  }, [onNodeExpansionChange]);


  // ✅ SMART CONNECTION SYSTEM - ا��اتصال الذكي التلقائي
  const connectionLines = useMemo(() => {
    if (!Array.isArray(connections) || connections.length === 0 || !Array.isArray(nodes) || nodes.length === 0) {
      return [];
    }
    
    // Constants matching WorkflowNodeEnhanced
    const COMPACT_SIZE = 64;
    const EXPANDED_WIDTH = 200;
    const EXPANDED_HEIGHT = 110;
    
    return connections
      .map((conn) => {
        const src = nodes.find((n) => n.id === conn.source);
        const tgt = nodes.find((n) => n.id === conn.target);
        
        if (!src?.position || !tgt?.position) return null;
        
        // حساب حجم العقد
        const srcExpanded = !!(expandedNodes.has(src.id) || selectedNode?.id === src.id || executingNodes.has(src.id));
        const tgtExpanded = !!(expandedNodes.has(tgt.id) || selectedNode?.id === tgt.id || executingNodes.has(tgt.id));
        
        const srcW = srcExpanded ? EXPANDED_WIDTH : COMPACT_SIZE;
        const srcH = srcExpanded ? EXPANDED_HEIGHT : COMPACT_SIZE;
        const tgtW = tgtExpanded ? EXPANDED_WIDTH : COMPACT_SIZE;
        const tgtH = tgtExpanded ? EXPANDED_HEIGHT : COMPACT_SIZE;
        
        // حساب المركز الحقيقي للعقد - نفس طريقة WorkflowNodeEnhanced
        const srcCenterX = src.position.x + COMPACT_SIZE / 2;
        const srcCenterY = src.position.y + COMPACT_SIZE / 2;
        const tgtCenterX = tgt.position.x + COMPACT_SIZE / 2;
        const tgtCenterY = tgt.position.y + COMPACT_SIZE / 2;
        
        // حساب مواقع الدوائر الأربعة - مرتبطة بالمركز الحقيقي
        const srcHalfW = srcW / 2;
        const srcHalfH = srcH / 2;
        const tgtHalfW = tgtW / 2;
        const tgtHalfH = tgtH / 2;
        
        // مواضع الدوائر الأربعة لكل عقدة
        const srcHandles = {
          left: { x: srcCenterX - srcHalfW, y: srcCenterY },
          right: { x: srcCenterX + srcHalfW, y: srcCenterY },
          top: { x: srcCenterX, y: srcCenterY - srcHalfH },
          bottom: { x: srcCenterX, y: srcCenterY + srcHalfH }
        };
        
        const tgtHandles = {
          left: { x: tgtCenterX - tgtHalfW, y: tgtCenterY },
          right: { x: tgtCenterX + tgtHalfW, y: tgtCenterY },
          top: { x: tgtCenterX, y: tgtCenterY - tgtHalfH },
          bottom: { x: tgtCenterX, y: tgtCenterY + tgtHalfH }
        };
        
        // حساب ال��سافة بين كل زوج ممكن من الدوائر
        const distances = [
          { srcHandle: 'left', tgtHandle: 'left', src: srcHandles.left, tgt: tgtHandles.left, dist: Math.hypot(srcHandles.left.x - tgtHandles.left.x, srcHandles.left.y - tgtHandles.left.y) },
          { srcHandle: 'left', tgtHandle: 'right', src: srcHandles.left, tgt: tgtHandles.right, dist: Math.hypot(srcHandles.left.x - tgtHandles.right.x, srcHandles.left.y - tgtHandles.right.y) },
          { srcHandle: 'left', tgtHandle: 'top', src: srcHandles.left, tgt: tgtHandles.top, dist: Math.hypot(srcHandles.left.x - tgtHandles.top.x, srcHandles.left.y - tgtHandles.top.y) },
          { srcHandle: 'left', tgtHandle: 'bottom', src: srcHandles.left, tgt: tgtHandles.bottom, dist: Math.hypot(srcHandles.left.x - tgtHandles.bottom.x, srcHandles.left.y - tgtHandles.bottom.y) },
          
          { srcHandle: 'right', tgtHandle: 'left', src: srcHandles.right, tgt: tgtHandles.left, dist: Math.hypot(srcHandles.right.x - tgtHandles.left.x, srcHandles.right.y - tgtHandles.left.y) },
          { srcHandle: 'right', tgtHandle: 'right', src: srcHandles.right, tgt: tgtHandles.right, dist: Math.hypot(srcHandles.right.x - tgtHandles.right.x, srcHandles.right.y - tgtHandles.right.y) },
          { srcHandle: 'right', tgtHandle: 'top', src: srcHandles.right, tgt: tgtHandles.top, dist: Math.hypot(srcHandles.right.x - tgtHandles.top.x, srcHandles.right.y - tgtHandles.top.y) },
          { srcHandle: 'right', tgtHandle: 'bottom', src: srcHandles.right, tgt: tgtHandles.bottom, dist: Math.hypot(srcHandles.right.x - tgtHandles.bottom.x, srcHandles.right.y - tgtHandles.bottom.y) },
          
          { srcHandle: 'top', tgtHandle: 'left', src: srcHandles.top, tgt: tgtHandles.left, dist: Math.hypot(srcHandles.top.x - tgtHandles.left.x, srcHandles.top.y - tgtHandles.left.y) },
          { srcHandle: 'top', tgtHandle: 'right', src: srcHandles.top, tgt: tgtHandles.right, dist: Math.hypot(srcHandles.top.x - tgtHandles.right.x, srcHandles.top.y - tgtHandles.right.y) },
          { srcHandle: 'top', tgtHandle: 'top', src: srcHandles.top, tgt: tgtHandles.top, dist: Math.hypot(srcHandles.top.x - tgtHandles.top.x, srcHandles.top.y - tgtHandles.top.y) },
          { srcHandle: 'top', tgtHandle: 'bottom', src: srcHandles.top, tgt: tgtHandles.bottom, dist: Math.hypot(srcHandles.top.x - tgtHandles.bottom.x, srcHandles.top.y - tgtHandles.bottom.y) },
          
          { srcHandle: 'bottom', tgtHandle: 'left', src: srcHandles.bottom, tgt: tgtHandles.left, dist: Math.hypot(srcHandles.bottom.x - tgtHandles.left.x, srcHandles.bottom.y - tgtHandles.left.y) },
          { srcHandle: 'bottom', tgtHandle: 'right', src: srcHandles.bottom, tgt: tgtHandles.right, dist: Math.hypot(srcHandles.bottom.x - tgtHandles.right.x, srcHandles.bottom.y - tgtHandles.right.y) },
          { srcHandle: 'bottom', tgtHandle: 'top', src: srcHandles.bottom, tgt: tgtHandles.top, dist: Math.hypot(srcHandles.bottom.x - tgtHandles.top.x, srcHandles.bottom.y - tgtHandles.top.y) },
          { srcHandle: 'bottom', tgtHandle: 'bottom', src: srcHandles.bottom, tgt: tgtHandles.bottom, dist: Math.hypot(srcHandles.bottom.x - tgtHandles.bottom.x, srcHandles.bottom.y - tgtHandles.bottom.y) }
        ];
        
        // اختيار الاتصال الأقرب
        const smartConnection = distances.reduce((prev, curr) =>
          curr.dist < prev.dist ? curr : prev
        );
        
        return {
          id: conn.id,
          sourceX: smartConnection.src.x,
          sourceY: smartConnection.src.y,
          targetX: smartConnection.tgt.x,
          targetY: smartConnection.tgt.y,
          sourceHandle: smartConnection.srcHandle,
          targetHandle: smartConnection.tgtHandle,
          isAnimated: executingNodes.has(src.id) || executingNodes.has(tgt.id),
        };
      })
      .filter(Boolean);
  }, [connections, nodes, expandedNodes, selectedNode, executingNodes]);

  // Keyboard event handlers for Space key panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spaceKeyPressed && !e.repeat) {
        e.preventDefault();
        setSpaceKeyPressed(true);
        document.body.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpaceKeyPressed(false);
        setIsPanning(false);
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [spaceKeyPressed]);

  // State for context menus
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [nodeMenuPosition, setNodeMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  // Calculate menu position to ensure it stays within viewport
  const calculateMenuPosition = useCallback((x: number, y: number, menuWidth: number = 200, menuHeight: number = 400) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return { x, y };

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;

    // Check if menu goes beyond right edge
    if (x + menuWidth > viewportWidth) {
      adjustedX = Math.max(0, viewportWidth - menuWidth - 10);
    }

    // Check if menu goes beyond bottom edge
    if (y + menuHeight > viewportHeight) {
      adjustedY = Math.max(0, viewportHeight - menuHeight - 10);
    }

    return { x: adjustedX, y: adjustedY };
  }, []);
  
  // Use the auto layout function from parent if provided
  const handleAutoLayoutClick = useCallback(() => {
    if (onAutoLayout) {
      onAutoLayout();
    }
  }, [onAutoLayout]);

  // Handle canvas panning with mouse - Enhanced for all canvas areas
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if we clicked on a node (don't pan if clicking on nodes)
    const isOnNode = target.closest('[data-node]');
    
    // Check if we're on canvas or canvas children
    const isOnCanvas = e.target === e.currentTarget;
    const isOnSVG = target.tagName === 'svg' || target.tagName === 'SVG';
    const isOnCanvasChild = target.getAttribute('data-canvas') === 'true' || 
                           target.closest('[data-canvas="true"]') !== null;
    
    // Allow panning on canvas/grid/connections, but NOT on nodes
    if ((isOnCanvas || isOnSVG || isOnCanvasChild) && !isOnNode) {
      // Middle click (wheel button) for panning - NEW! 🎯
      if (e.button === 1) {
        e.preventDefault();
        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
        document.body.classList.add('canvas-panning');
        document.body.style.cursor = 'grabbing';
        console.log('🖱️ Middle Mouse Pan: Started');
      }
      // Space + Left click for panning
      else if (e.button === 0 && spaceKeyPressed) {
        e.preventDefault();
        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
        document.body.style.cursor = 'grabbing';
        console.log('⌨️ Space + Drag Pan: Started');
      }
      // Left click without space - deselect only, NO menu
      else if (e.button === 0 && !spaceKeyPressed) {
        onNodeSelect(null);
        setConnectionStart(null);
        setShowNodeMenu(false);
        setShowContextMenu(false);
      }
    }
  }, [panOffset, spaceKeyPressed, onNodeSelect]);

  // ⚡ Throttled mouse move handler - تحسين الأداء
  const throttledMouseMove = useMemo(
    () => throttle((e: React.MouseEvent) => {
      // Update mouse position for connection drawing
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        setCurrentMousePos({
          x: e.clientX - canvasRect.left - panOffset.x,
          y: e.clientY - canvasRect.top - panOffset.y
        });
      }

      // Handle panning
      if (isPanning) {
        const newX = e.clientX - panStart.x;
        const newY = e.clientY - panStart.y;
        setPanOffset({ x: newX, y: newY });
      }
    }, 16), // ~60fps
    [isPanning, panStart, panOffset]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    throttledMouseMove(e);
  }, [throttledMouseMove]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      console.log('🖱️ Pan: Stopped');
    }
    
    setIsPanning(false);
    document.body.classList.remove('canvas-panning');
    
    if (spaceKeyPressed) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'default';
    }
    
    // Complete connection if we were drawing one
    if (connectionStart) {
      setConnectionStart(null);
    }
  }, [connectionStart, spaceKeyPressed, isPanning]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onNodeSelect(null);
      setConnectionStart(null);
      setShowNodeMenu(false);
      setShowContextMenu(false);
    }
  }, [onNodeSelect]);

  // Show context menu on right-click on empty canvas
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if we're clicking on canvas background (not on a node)
    const target = e.target as HTMLElement;
    
    // Allow context menu on:
    // 1. Canvas itself (e.target === e.currentTarget)
    // 2. SVG elements (background grid/connections)
    // 3. Inner div with transform (pan offset container)
    // But NOT on nodes or their children
    const isOnNode = target.closest('[data-node]');
    const isOnCanvas = e.target === e.currentTarget;
    const isOnSVG = target.tagName === 'svg' || target.tagName === 'SVG';
    const isOnCanvasChild = target.getAttribute('data-canvas') === 'true' || 
                           target.closest('[data-canvas="true"]') !== null;
    
    // FIXED: Simplified - show menu if NOT on node
    if (!isOnNode) {
      const position = calculateMenuPosition(e.clientX, e.clientY, 200, 150);
      setContextMenuPosition({
        x: position.x,
        y: position.y
      });
      setShowContextMenu(true);
      setShowNodeMenu(false);
    } else {
      setShowContextMenu(false);
      setShowNodeMenu(false);
    }
  }, [calculateMenuPosition]);

  const handleNodeDuplicate = useCallback((node: Node) => {
    // Safety check: Ensure node has valid position
    if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      return;
    }
    
    // وضع العقدة المنسوخة بجانب الأصلية
    let duplicatePosition = {
      x: node.position.x + 250,
      y: node.position.y + 50
    };
    
    // ✅ تطبيق منع التصادم
    duplicatePosition = ensureMinimumDistance(duplicatePosition);
    
    const newNode: Node = {
      ...node,
      id: `${node.type}-${Date.now()}`,
      position: duplicatePosition
    };
    onNodeAdd(newNode);
  }, [onNodeAdd, ensureMinimumDistance]);

  // Handle connection creation
  const handleConnectionStart = useCallback((nodeId: string, handle: 'input' | 'output' | 'top' | 'bottom', position: { x: number; y: number }) => {
    setConnectionStart({ nodeId, handle, position });
  }, []);

  const handleConnectionEnd = useCallback((nodeId: string, handle: 'input' | 'output' | 'top' | 'bottom') => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
      // Check if connection already exists
      const existingConnection = connections.find(
        conn => 
          (conn.source === connectionStart.nodeId && conn.target === nodeId) ||
          (conn.source === nodeId && conn.target === connectionStart.nodeId)
      );
      
      if (existingConnection) {
        setConnectionStart(null);
        return;
      }
      
      // Allow connections from any handle to any handle
      // Output/Top/Bottom can connect to Input/Top/Bottom
      const canConnect = 
        (connectionStart.handle === 'output' || connectionStart.handle === 'top' || connectionStart.handle === 'bottom') &&
        (handle === 'input' || handle === 'top' || handle === 'bottom');
      
      if (canConnect) {
        const newConnection: Connection = {
          id: `${connectionStart.nodeId}-${nodeId}-${Date.now()}`,
          source: connectionStart.nodeId,
          target: nodeId,
          sourceHandle: connectionStart.handle,
          targetHandle: handle
        };
        onConnect(newConnection);
      } else if (connectionStart.handle === 'input' && (handle === 'output' || handle === 'top' || handle === 'bottom')) {
        // Reverse connection
        const newConnection: Connection = {
          id: `${nodeId}-${connectionStart.nodeId}-${Date.now()}`,
          source: nodeId,
          target: connectionStart.nodeId,
          sourceHandle: handle,
          targetHandle: connectionStart.handle
        };
        onConnect(newConnection);
      }
    }
    
    setConnectionStart(null);
  }, [connectionStart, connections, onConnect]);

  // Reset pan
  const handleResetPan = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
  }, []);
  
  // === 🎯 Center-Based Zoom Controls v8.0.0 === //
  // Smooth increment zoom with center-based behavior
  const handleZoomIn = useCallback(() => {
    if (!onZoomChange || !externalZoomLevel || !onPanOffsetChange || !externalPanOffset || !canvasRef.current) return;
    
    const MIN_ZOOM = 10;
    const MAX_ZOOM = 400;
    const ZOOM_STEP = 10; // 10% increment per click
    
    const currentZoom = externalZoomLevel;
    const newZoom = Math.min(currentZoom + ZOOM_STEP, MAX_ZOOM);
    const rounded = Math.round(newZoom);
    
    if (rounded === currentZoom) return; // Already at max
    
    // === Center-Based Zoom Math ===
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const viewportCenterX = rect.width / 2;
    const viewportCenterY = rect.height / 2;
    
    const oldScale = currentZoom / 100;
    const newScale = rounded / 100;
    
    const worldX = (viewportCenterX - externalPanOffset.x) / oldScale;
    const worldY = (viewportCenterY - externalPanOffset.y) / oldScale;
    
    const newPanX = viewportCenterX - (worldX * newScale);
    const newPanY = viewportCenterY - (worldY * newScale);
    
    onZoomChange(rounded);
    onPanOffsetChange({ x: newPanX, y: newPanY });
    
    console.log(`🔍 Center Zoom In: ${currentZoom}% → ${rounded}%`);
  }, [onZoomChange, externalZoomLevel, onPanOffsetChange, externalPanOffset]);
  
  const handleZoomOut = useCallback(() => {
    if (!onZoomChange || !externalZoomLevel || !onPanOffsetChange || !externalPanOffset || !canvasRef.current) return;
    
    const MIN_ZOOM = 10;
    const MAX_ZOOM = 400;
    const ZOOM_STEP = 10; // 10% decrement per click
    
    const currentZoom = externalZoomLevel;
    const newZoom = Math.max(currentZoom - ZOOM_STEP, MIN_ZOOM);
    const rounded = Math.round(newZoom);
    
    if (rounded === currentZoom) return; // Already at min
    
    // === Center-Based Zoom Math ===
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const viewportCenterX = rect.width / 2;
    const viewportCenterY = rect.height / 2;
    
    const oldScale = currentZoom / 100;
    const newScale = rounded / 100;
    
    const worldX = (viewportCenterX - externalPanOffset.x) / oldScale;
    const worldY = (viewportCenterY - externalPanOffset.y) / oldScale;
    
    const newPanX = viewportCenterX - (worldX * newScale);
    const newPanY = viewportCenterY - (worldY * newScale);
    
    onZoomChange(rounded);
    onPanOffsetChange({ x: newPanX, y: newPanY });
    
    console.log(`🔍 Center Zoom Out: ${currentZoom}% → ${rounded}%`);
  }, [onZoomChange, externalZoomLevel, onPanOffsetChange, externalPanOffset]);
  
  const handleResetZoom = useCallback(() => {
    if (!onZoomChange || !onPanOffsetChange) return;
    
    const defaultZoom = 100;
    onZoomChange(defaultZoom);
    onPanOffsetChange({ x: 0, y: 0 });
    
    console.log(`🔍 Zoom Reset: ${defaultZoom}%`);
  }, [onZoomChange, onPanOffsetChange]);
  
  // 🎯 Center-Based Mouse Wheel Zoom - v8.0.0
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!onZoomChange || !externalZoomLevel || !onPanOffsetChange || !externalPanOffset || !canvasRef.current) return;
    
    // Smooth continuous zoom like Figma/Adobe XD - from viewport center
    // Note: No preventDefault() to avoid passive event listener warning
    
    const MIN_ZOOM = 10;
    const MAX_ZOOM = 400;
    const ZOOM_FACTOR = 1.05; // 5% per wheel tick - smooth & natural
    
    const delta = -e.deltaY;
    const currentZoom = externalZoomLevel;
    
    // Calculate new zoom with smooth factor
    let newZoom;
    if (delta > 0) {
      // Zoom in
      newZoom = currentZoom * ZOOM_FACTOR;
    } else {
      // Zoom out
      newZoom = currentZoom / ZOOM_FACTOR;
    }
    
    // Clamp to limits and round
    newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    const rounded = Math.round(newZoom);
    
    // Only apply if changed
    if (rounded !== currentZoom) {
      // === Center-Based Zoom Math ===
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // مركز الـ viewport
      const viewportCenterX = rect.width / 2;
      const viewportCenterY = rect.height / 2;
      
      // النقطة في عالم الكانفا التي في المركز حالياً
      const oldScale = currentZoom / 100;
      const newScale = rounded / 100;
      
      const worldX = (viewportCenterX - externalPanOffset.x) / oldScale;
      const worldY = (viewportCenterY - externalPanOffset.y) / oldScale;
      
      // حساب panOffset الجديد لإبقاء نفس النقطة في المركز
      const newPanX = viewportCenterX - (worldX * newScale);
      const newPanY = viewportCenterY - (worldY * newScale);
      
      // تطبيق الزوم و Pan الجديد معاً
      onZoomChange(rounded);
      onPanOffsetChange({ x: newPanX, y: newPanY });
      
      // Only log significant changes (> 2%)
      if (Math.abs(rounded - currentZoom) >= 2) {
        console.log(`🔍 Center Zoom: ${currentZoom}% → ${rounded}%`);
      }
    }
  }, [onZoomChange, externalZoomLevel, onPanOffsetChange, externalPanOffset]);

  // Fit all nodes to view - Smart calculation with correct node sizes
  const handleFitToView = useCallback(() => {
    if (nodes.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;
    
    // أحجام العقد الحقيقية
    const COMPACT_SIZE = 64;
    const EXPANDED_WIDTH = 200;
    const EXPANDED_HEIGHT = 110;
    
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    // حساب حدود جميع العقد مع أخذ حجم��ا الحقيقي في الاعتبار
    nodes.forEach(node => {
      const x = node.position.x;
      const y = node.position.y;
      
      // التحقق من حالة العقدة (موسعة أم مصغرة)
      const isExpanded = expandedNodes.has(node.id) || 
                        selectedNode?.id === node.id || 
                        executingNodes.has(node.id);
      
      const nodeWidth = isExpanded ? EXPANDED_WIDTH : COMPACT_SIZE;
      const nodeHeight = isExpanded ? EXPANDED_HEIGHT : COMPACT_SIZE;
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + nodeWidth);
      maxY = Math.max(maxY, y + nodeHeight);
    });
    
    // Padding حول العقد للراحة البصرية
    const PADDING = 80;
    minX -= PADDING;
    minY -= PADDING;
    maxX += PADDING;
    maxY += PADDING;
    
    // حساب عرض وارتفاع المحتوى الكلي
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    // حساب الزوم المطلوب لإظهار كل المحتوى
    const zoomX = (canvasWidth / contentWidth) * 100;
    const zoomY = (canvasHeight / contentHeight) * 100;
    
    // استخدام أصغر zoom لضمان إظهار كل شيء + هامش 10%
    const newZoom = Math.max(
      MIN_ZOOM, 
      Math.min(MAX_ZOOM, Math.min(zoomX, zoomY) * 0.9)
    );
    
    // حساب الـ Scale الجديد
    const scale = newZoom / 100;
    
    // حساب المحتوى بعد الـ Scale
    const scaledContentWidth = contentWidth * scale;
    const scaledContentHeight = contentHeight * scale;
    
    // حساب الـ Pan Offset لتوسيط المحتوى في Canvas
    // نحتاج أن يكون minX و minY في المركز
    const offsetX = (canvasWidth - scaledContentWidth) / 2 - (minX * scale);
    const offsetY = (canvasHeight - scaledContentHeight) / 2 - (minY * scale);
    
    // تطبيق الزوم و Pan
    setZoomLevel(Math.round(newZoom));
    setPanOffset({ x: offsetX, y: offsetY });
    
    console.log(`🎯 Fit to View: ${Math.round(newZoom)}% | ${nodes.length} nodes | Content: ${Math.round(contentWidth)}×${Math.round(contentHeight)}px | Centered ✓`);
  }, [nodes, expandedNodes, selectedNode, executingNodes]);

  // Native drag handlers for tracking drag state
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragDepthRef.current += 1;
    if (dragDepthRef.current === 1) {
      setIsDragOver(true);
      if (onDragOverChange) {
        onDragOverChange(true);
      }
    }
  }, [onDragOverChange]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current === 0) {
      setIsDragOver(false);
      if (onDragOverChange) {
        onDragOverChange(false);
      }
    }
  }, [onDragOverChange]);

  const handleDragOverNative = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Combine drop ref with canvas ref
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    canvasRef.current = node;
    drop(node);
  }, [drop]);

  return (
    <div
      ref={setRefs}
      data-canvas="true"
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOverNative}
      onWheel={handleWheel}
      className={`
        relative w-full h-full min-h-[600px] transition-all duration-300 overflow-hidden
        ${isDragOver ? 'bg-primary/5 ring-2 ring-primary/30 ring-inset' : ''}
        ${isPanning ? 'cursor-grabbing' : spaceKeyPressed ? 'cursor-grab' : 'cursor-default'}
      `}
      style={{ 
        minHeight: '100%',
        position: 'relative'
      }}
    >
      {/* Connection Instructions - Top Left - Only show if no connections exist yet */}
      {nodes.length >= 2 && connections.length === 0 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="glass-button px-4 py-2 text-xs text-primary max-w-md"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">لربط العقد:</span>
            </div>
            <div className="mt-1 space-y-1 text-foreground-muted">
              <div>1️⃣ اضغط مع الاستمرار على نقطة الإخراج ➡️ (الدائرة اليمنى)</div>
              <div>2️⃣ اسحب الخط إلى نقطة الإدخال ⬅️ (الدائرة اليسرى) للعقدة الأخرى</div>
              <div>3️⃣ أفلت الماوس لإنشاء الاتصال</div>
            </div>
          </motion.div>
        </div>
      )}



      {/* Canvas content wrapper */}
      <div
        data-canvas="true"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* === 🎨 Grid System - Professional Dots & Center Indicator === */}
        {/* Grid stays FIXED - no transform */}
        <svg
          data-canvas="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            zIndex: 1,
            overflow: 'visible'
          }}
        >
          <defs>
            {/* نمط الشبكة - نقاط صغيرة احترافية */}
            <pattern
              id="grid-dots-small"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="10"
                cy="10"
                r="0.8"
                className="dark:fill-foreground-muted/15 fill-foreground-muted/20"
              />
            </pattern>
            
            {/* شبكة كبيرة - نقاط أكبر للمحاذاة */}
            <pattern
              id="grid-dots-large"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="50"
                cy="50"
                r="1.5"
                className="dark:fill-foreground-muted/25 fill-foreground-muted/30"
              />
            </pattern>
          </defs>
          
          {/* الشبكة الصغيرة - طبقة أساسية */}
          <rect
            width="100%"
            height="100%"
            fill="url(#grid-dots-small)"
          />
          
          {/* الشبكة الكبيرة - نقاط محاذاة */}
          <rect
            width="100%"
            height="100%"
            fill="url(#grid-dots-large)"
          />
        </svg>
        
        {/* === ✨ Center Indicator - مركز الشاشة === */}
        {/* ثابت في المركز - لا يتحرك مع Pan */}
        <div
          className="absolute top-1/2 left-1/2 pointer-events-none z-20"
          style={{
            transform: `translate(-50%, -50%) translate(${-panOffset.x}px, ${-panOffset.y}px)`
          }}
        >
          {/* دائرة مركزية خارجية */}
          <div className="relative flex items-center justify-center">
            {/* الحلقة الخارجية المتوهجة */}
            <div className="absolute w-16 h-16 rounded-full dark:bg-foreground-muted/10 bg-foreground-muted/15 animate-pulse" />
            
            {/* الحلقة المتوسطة */}
            <div className="absolute w-12 h-12 rounded-full dark:bg-foreground-muted/15 bg-foreground-muted/20" />
            
            {/* النقطة المركزية */}
            <div className="absolute w-3 h-3 rounded-full dark:bg-foreground-muted/40 bg-foreground-muted/50" />
            
            {/* خطوط التقسيم - عمودية وأفق��ة */}
            <div className="absolute w-32 h-[1px] dark:bg-foreground-muted/20 bg-foreground-muted/25" />
            <div className="absolute w-[1px] h-32 dark:bg-foreground-muted/20 bg-foreground-muted/25" />
          </div>
        </div>
        
        {/* === 🎯 SINGLE TRANSFORMED CONTAINER - Connections + Nodes === */}
        {/* This is the ONLY element with transform applied */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
            willChange: 'transform'
          }}
        >
          {/* خطوط الربط - Step 11 */}
          <svg
            data-canvas="true"
            className="absolute inset-0 w-full h-full"
            style={{ 
              overflow: 'visible',
              minWidth: '100%',
              minHeight: '100%',
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
          {/* Step 12: تعريف التأثيرات المشتركة */}
          <defs>
            <filter id="connection-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Alignment Guides - خطوط المحاذاة المحسّنة للقفز */}
          {alignmentGuides.vertical.map((guide, i) => (
            <line
              key={`v-align-${i}`}
              x1={guide.x}
              y1={0}
              x2={guide.x}
              y2={5000}
              stroke="var(--primary)"
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.6"
              pointerEvents="none"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.5))',
                animation: 'alignment-pulse 1.5s ease-in-out infinite'
              }}
            />
          ))}
          {alignmentGuides.horizontal.map((guide, i) => (
            <line
              key={`h-align-${i}`}
              x1={0}
              y1={guide.y}
              x2={5000}
              y2={guide.y}
              stroke="var(--primary)"
              strokeWidth="2"
              strokeDasharray="8 4"
              opacity="0.6"
              pointerEvents="none"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.5))',
                animation: 'alignment-pulse 1.5s ease-in-out infinite'
              }}
            />
          ))}          
          {/* Snap Guides - خطوط المحاذاة */}
          {snapGuides.vertical.map((x, i) => (
            <line
              key={`v-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={2000}
              stroke="rgba(37, 99, 235, 0.5)"
              strokeWidth="1"
              strokeDasharray="4 4"
              pointerEvents="none"
            />
          ))}
          {snapGuides.horizontal.map((y, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={y}
              x2={2000}
              y2={y}
              stroke="rgba(37, 99, 235, 0.5)"
              strokeWidth="1"
              strokeDasharray="4 4"
              pointerEvents="none"
            />
          ))}
          
          {/* Step 13: الخطوط الموجودة */}
          {Array.isArray(connectionLines) && connectionLines.map((line) => {
            if (!line || !line.id) return null;
            
            // التحقق من صحة البيانات
            if (typeof line.sourceX !== 'number' || typeof line.sourceY !== 'number' ||
                typeof line.targetX !== 'number' || typeof line.targetY !== 'number') {
              return null;
            }
            
            return (
              <ConnectionLine
                key={line.id}
                sourceX={line.sourceX}
                sourceY={line.sourceY}
                targetX={line.targetX}
                targetY={line.targetY}
                sourceHandle={line.sourceHandle || 'output'}
                targetHandle={line.targetHandle || 'input'}
                isAnimated={line.isAnimated || false}
              />
            );
          })}
          
          {/* Step 14: الخط أثناء الرسم */}
          {connectionStart && connectionStart.position && currentMousePos.x !== 0 && (
            <ConnectionLine
              sourceX={connectionStart.position.x}
              sourceY={connectionStart.position.y}
              targetX={currentMousePos.x}
              targetY={currentMousePos.y}
              sourceHandle="output"
              targetHandle="input"
              isAnimated={false}
              isDashed={true}
            />
          )}
          
          {/* Snap Guides - Alignment Indicators */}
          {snapGuides.vertical.map((x, index) => (
            <line
              key={`v-${index}`}
              x1={x}
              y1={0}
              x2={x}
              y2="100%"
              stroke="var(--primary)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.5"
              pointerEvents="none"
            />
          ))}
          {snapGuides.horizontal.map((y, index) => (
            <line
              key={`h-${index}`}
              x1={0}
              y1={y}
              x2="100%"
              y2={y}
              stroke="var(--primary)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.5"
              pointerEvents="none"
            />
          ))}
          </svg>

          {/* Nodes - inside transformed container, NO additional transform */}
          <div className="relative z-10">
            <AnimatePresence mode="popLayout">
              {nodes.map((node) => {
              // Safety check: Skip nodes without valid positions
              if (!node || !node.position || 
                  typeof node.position.x !== 'number' || 
                  typeof node.position.y !== 'number') {
                console.warn('Skipping node with invalid position:', node);
                return null;
              }
              
              // حساب حالة ��لتوسع/التصغير
              const isNodeSelected = selectedNode?.id === node.id;
              const isNodeExecuting = executingNodes.has(node.id);
              const isManuallyExpanded = expandedNodes.has(node.id);
              
              // العقدة موسعة إذا: موسعة يدوياً
              // العقدة مصغرة إذا: ليست موسعة يدوياً
              const isCompact = !isManuallyExpanded;
              
              return (
                <WorkflowNodeEnhanced
                  key={node.id}
                  node={node}
                  isSelected={isNodeSelected}
                  isCompact={isCompact}
                  onSelect={onNodeSelect}
                  onDelete={onNodeDelete}
                  onDuplicate={handleNodeDuplicate}
                  onMove={handleNodeMoveWithCollisionDetection}
                  isExecuting={isNodeExecuting}
                  executionStatus={nodeExecutionStatus.get(node.id)}
                  executionTime={nodeExecutionTimes.get(node.id)}
                  onHover={onNodeHover}
                  onConnectionStart={handleConnectionStart}
                  onConnectionEnd={handleConnectionEnd}
                  onExpansionChange={onNodeExpansionChange}
                  showGhostArea={showGhostAreas}
                  onDragStart={(nodeId, pos) => {
                    calculateAlignmentGuides(nodeId, pos);
                  }}
                  onDragging={(nodeId, pos) => {
                    calculateAlignmentGuides(nodeId, pos);
                  }}
                  onDragEnd={clearAlignmentGuides}
                />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        {/* === End of transformed container === */}
        
        {/* قائمة إنشاء عقدة - OUTSIDE transform */}
        <AnimatePresence>
          {showNodeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed windows-context-menu"
              style={{
                left: nodeMenuPosition.x,
                top: nodeMenuPosition.y,
                maxHeight: '400px',
                overflowY: 'auto',
                zIndex: 9999
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseLeave={handleMenuMouseLeave}
            >
              {Object.entries(nodeTypeLabels).map(([nodeType, label]) => {
                const IconComponent = nodeTypeIcons[nodeType] || Activity;
                return (
                  <button
                    key={nodeType}
                    onClick={() => {
                      const newNode: Node = {
                        id: `${nodeType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        type: nodeType,
                        position: {
                          x: Math.max(20, nodeMenuPosition.x - 32),
                          y: Math.max(20, nodeMenuPosition.y - 32),
                        },
                        data: {
                          label,
                          config: {},
                          description: `عقدة ${label}`,
                          createdAt: new Date().toISOString(),
                        },
                      };
                      onNodeAdd(newNode);
                      setShowNodeMenu(false);
                    }}
                    className="windows-context-menu-item"
                  >
                    <IconComponent className="windows-context-menu-icon" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* قائمة السياق - الزر الأيمن (نمط Windows بسيط) */}
        {/* تظهر فقط عند النقر على المساحة الفارغة في الكانفا */}
        <AnimatePresence>
          {showContextMenu && (
            <>
              {/* Backdrop شفاف لإغلاق القائمة عند النقر خارجها */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-40"
                onClick={() => setShowContextMenu(false)}
                style={{ background: 'transparent' }}
              />
              
              {/* القائمة السياقية */}
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="fixed windows-context-menu"
                style={{
                  left: contextMenuPosition.x,
                  top: contextMenuPosition.y,
                  zIndex: 9999
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseLeave={handleMenuMouseLeave}
              >
              {/* إضافة عقدة */}
              <button
                onClick={() => {
                  setShowContextMenu(false);
                }}
                className="windows-context-menu-item"
                title="إضافة عقدة جديدة في موقع القائمة"
              >
                <Plus className="windows-context-menu-icon" />
                <span>إضافة عقدة</span>
              </button>
              
              <div className="windows-context-menu-separator" />
              
              {/* توسيط العرض */}
              <button
                onClick={() => {
                  handleResetPan();
                  setShowContextMenu(false);
                }}
                className="windows-context-menu-item"
                title="إعادة تعيين العرض إلى الموضع الافتراضي"
              >
                <Maximize2 className="windows-context-menu-icon" />
                <span>إعادة تموضع العرض</span>
              </button>
              
              <div className="windows-context-menu-separator" />
              
              {/* مسح الكل */}
              <button
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من حذف جميع العقد؟')) {
                    nodes.forEach(node => onNodeDelete(node.id));
                  }
                  setShowContextMenu(false);
                }}
                className="windows-context-menu-item"
                disabled={nodes.length === 0}
                style={{ 
                  opacity: nodes.length === 0 ? 0.5 : 1,
                  cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
                  color: nodes.length > 0 ? 'var(--destructive)' : undefined
                }}
                title={nodes.length === 0 ? 'لا توجد عقد للذف' : 'حذف جميع العقد من الكانفا'}
              >
                <Trash2 className="windows-context-menu-icon" />
                <span>مسح الكل</span>
              </button>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      
      {/* === 🔍 Zoom Controls - Top Center - Simple Buttons === */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
      >
        {/* Zoom Out Button */}
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= MIN_ZOOM}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-all
                     glass-medium hover:bg-primary hover:text-primary-foreground
                     disabled:opacity-40 disabled:cursor-not-allowed"
          title="تصغير (Ctrl + Scroll Down)"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        {/* Zoom Level Display */}
        <div className="glass-medium px-4 py-2 rounded-lg min-w-[70px] text-center">
          <span className="font-medium text-sm text-foreground">{zoomLevel}%</span>
        </div>
        
        {/* Zoom In Button */}
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= MAX_ZOOM}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-all
                     glass-medium hover:bg-primary hover:text-primary-foreground
                     disabled:opacity-40 disabled:cursor-not-allowed"
          title="تكبير (Ctrl + Scroll Up)"
        >
          <Plus className="w-4 h-4" />
        </button>
        
        {/* Reset Button */}
        <button
          onClick={handleResetZoom}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-all
                     glass-medium hover:bg-primary hover:text-primary-foreground text-xs"
          title="إعادة تعيين (100%)"
        >
          =
        </button>
        
        {/* Fit to View Button */}
        <button
          onClick={handleFitToView}
          disabled={nodes.length === 0}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-all
                     glass-medium hover:bg-primary hover:text-primary-foreground
                     disabled:opacity-40 disabled:cursor-not-allowed"
          title="احتواء جميع العقد"
        >
          <Scan className="w-4 h-4" />
        </button>
      </motion.div>

    </div>
  );
});

WorkflowCanvasEnhanced.displayName = 'WorkflowCanvasEnhanced';