import React, { useRef, useState, useCallback, useEffect, forwardRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Database, 
  Webhook, 
  Mail, 
  MessageSquare, 
  Settings, 
  GitBranch,
  Timer,
  FileText,
  Globe,
  Zap,
  X,
  Copy,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2
} from 'lucide-react';

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface WorkflowNodeProps {
  node: Node;
  isSelected: boolean;
  isExecuting?: boolean;
  executionStatus?: 'idle' | 'running' | 'success' | 'error' | 'paused';
  executionTime?: number;
  isCompact?: boolean;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onSelect: (node: Node | null) => void;
  onDelete: (id: string) => void;
  onDuplicate: (node: Node) => void;
  onHover?: (node: Node | null) => void;
  onConnectionStart?: (nodeId: string, handle: 'input' | 'output' | 'top' | 'bottom', position: { x: number; y: number }) => void;
  onConnectionEnd?: (nodeId: string, handle: 'input' | 'output' | 'top' | 'bottom') => void;
  onExpansionChange?: (nodeId: string, isExpanded: boolean) => void;
  onDragStart?: (nodeId: string, position: { x: number; y: number }) => void;
  onDragging?: (nodeId: string, position: { x: number; y: number }) => void;
  onDragEnd?: () => void;
}

const nodeIcons: Record<string, React.ComponentType<any>> = {
  'webhook-trigger': Webhook,
  'schedule-trigger': Clock,
  'email-trigger': Mail,
  'http-request': Globe,
  'email-send': Mail,
  'notification': MessageSquare,
  'file-write': FileText,
  'database-read': Database,
  'database-write': Database,
  'condition': GitBranch,
  'delay': Timer,
  'transform': Zap,
  'function': Settings,
};

const nodeStyles: Record<string, { 
  gradient: string; 
  accent: string; 
  glow: string; 
  category: string;
  description: string;
}> = {
  'webhook-trigger': { 
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600', 
    accent: 'emerald-500',
    glow: 'emerald-500/30',
    category: 'محفز',
    description: 'استقبال HTTP'
  },
  'schedule-trigger': { 
    gradient: 'from-green-400 via-emerald-500 to-teal-600', 
    accent: 'green-500',
    glow: 'green-500/30',
    category: 'محفز',
    description: 'جدولة مهام'
  },
  'email-trigger': { 
    gradient: 'from-teal-400 via-cyan-500 to-blue-600', 
    accent: 'teal-500',
    glow: 'teal-500/30',
    category: 'محفز',
    description: 'مراقبة بريد'
  },
  'http-request': { 
    gradient: 'from-blue-400 via-indigo-500 to-purple-600', 
    accent: 'blue-500',
    glow: 'blue-500/30',
    category: 'إجراء',
    description: 'طلب HTTP'
  },
  'email-send': { 
    gradient: 'from-indigo-400 via-blue-500 to-cyan-600', 
    accent: 'indigo-500',
    glow: 'indigo-500/30',
    category: 'إجراء',
    description: 'إرسال بريد'
  },
  'notification': { 
    gradient: 'from-purple-400 via-pink-500 to-rose-600', 
    accent: 'purple-500',
    glow: 'purple-500/30',
    category: 'إجراء',
    description: 'إرسال إشعار'
  },
  'file-write': { 
    gradient: 'from-pink-400 via-red-500 to-orange-600', 
    accent: 'pink-500',
    glow: 'pink-500/30',
    category: 'إجراء',
    description: 'كتابة ملف'
  },
  'database-read': { 
    gradient: 'from-yellow-400 via-orange-500 to-red-600', 
    accent: 'yellow-500',
    glow: 'yellow-500/30',
    category: 'بيانات',
    description: 'قراءة DB'
  },
  'database-write': { 
    gradient: 'from-orange-400 via-red-500 to-pink-600', 
    accent: 'orange-500',
    glow: 'orange-500/30',
    category: 'بيانات',
    description: 'كتابة DB'
  },
  'condition': { 
    gradient: 'from-lime-400 via-green-500 to-emerald-600', 
    accent: 'lime-500',
    glow: 'lime-500/30',
    category: 'منطق',
    description: 'شرط'
  },
  'delay': { 
    gradient: 'from-cyan-400 via-sky-500 to-blue-600', 
    accent: 'cyan-500',
    glow: 'cyan-500/30',
    category: 'تحكم',
    description: 'تأخير'
  },
  'transform': { 
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600', 
    accent: 'violet-500',
    glow: 'violet-500/30',
    category: 'تحويل',
    description: 'تحويل بيانات'
  },
  'function': { 
    gradient: 'from-slate-400 via-gray-500 to-zinc-600', 
    accent: 'slate-500',
    glow: 'slate-500/30',
    category: 'كود',
    description: 'كود مخصص'
  }
};

// Constants for node dimensions - Compact & Professional
const COMPACT_SIZE = 64;
const EXPANDED_WIDTH = 200;
const EXPANDED_HEIGHT = 110;
const HANDLE_SIZE = 20; // حجم الدائرة الصغيرة

const WorkflowNodeEnhancedComponent = forwardRef<HTMLDivElement, WorkflowNodeProps>(({
  node,
  isSelected,
  isExecuting,
  executionStatus = 'idle',
  executionTime,
  isCompact = false,
  onMove,
  onSelect,
  onDelete,
  onDuplicate,
  onHover,
  onConnectionStart,
  onConnectionEnd,
  onExpansionChange,
  onDragStart,
  onDragging,
  onDragEnd,
}, ref) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; nodeX: number; nodeY: number } | null>(null);
  
  // State للتحكم بإظهار الحدود الوهمية
  const [showBounds, setShowBounds] = useState(false);
  const boundsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isExpanded = !isCompact;
  
  // حساب جميع المواضع مرة واحدة باستخدام useMemo
  const positions = useMemo(() => {
    const currentWidth = isExpanded ? EXPANDED_WIDTH : COMPACT_SIZE;
    const currentHeight = isExpanded ? EXPANDED_HEIGHT : COMPACT_SIZE;
    
    // ⚡ المركز الحقيقي للعقدة - ثابت دائماً بناءً على COMPACT_SIZE
    // المركز لا يتغير بالتوسع - العقدة تتوسع من المركز الثابت
    const centerX = node.position.x + COMPACT_SIZE / 2;
    const centerY = node.position.y + COMPACT_SIZE / 2;
    
    // موقع العقدة نفسها (expanded تتوسع من المركز الثابت)
    const nodeLeft = isExpanded ? centerX - EXPANDED_WIDTH / 2 : node.position.x;
    const nodeTop = isExpanded ? centerY - EXPANDED_HEIGHT / 2 : node.position.y;
    
    // مواضع الدوائر الأربع - بالنسبة للمركز
    // الدوائر ثابتة المواضع سواء العقدة صغيرة أو كبيرة
    const halfWidth = currentWidth / 2;
    const halfHeight = currentHeight / 2;
    
    return {
      // موضع العقدة
      nodeLeft,
      nodeTop,
      currentWidth,
      currentHeight,
      
      // المركز الحقيقي - ثابت دائماً
      centerX,
      centerY,
      
      // مواضع الدوائر - absolute بالنسبة للـ canvas
      handles: {
        left: {
          x: centerX - halfWidth,
          y: centerY,
        },
        right: {
          x: centerX + halfWidth,
          y: centerY,
        },
        top: {
          x: centerX,
          y: centerY - halfHeight,
        },
        bottom: {
          x: centerX,
          y: centerY + halfHeight,
        },
      }
    };
  }, [node.position.x, node.position.y, isExpanded]);

  // 🚀 SIMPLE DRAG SYSTEM - Mouse Events Only
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Ignore if clicking on buttons or handles
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-handle]')) {
      return;
    }

    setIsDragging(true);
    setShowBounds(true); // إظهار الحدود عند السحب
    
    // إلغاء timeout السابق
    if (boundsTimeoutRef.current) {
      clearTimeout(boundsTimeoutRef.current);
      boundsTimeoutRef.current = null;
    }
    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      nodeX: node.position.x,
      nodeY: node.position.y
    };
    
    if (onDragStart) {
      onDragStart(node.id, node.position);
    }
  }, [node.position, node.id, onDragStart]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const newX = dragStartRef.current.nodeX + deltaX;
      const newY = dragStartRef.current.nodeY + deltaY;

      onMove(node.id, { x: newX, y: newY });
      
      if (onDragging) {
        onDragging(node.id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      
      // إخفاء الحدود بعد ثانيتين من التوقف عن السحب
      if (boundsTimeoutRef.current) {
        clearTimeout(boundsTimeoutRef.current);
      }
      boundsTimeoutRef.current = setTimeout(() => {
        setShowBounds(false);
      }, 2000);
      
      if (onDragEnd) {
        onDragEnd();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, node.id, onMove, onDragging, onDragEnd]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (boundsTimeoutRef.current) {
        clearTimeout(boundsTimeoutRef.current);
      }
    };
  }, []);

  const Icon = nodeIcons[node.type] || Settings;
  const style = nodeStyles[node.type] || nodeStyles['function'];

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
    setShowBounds(true); // إظهار الحدود عند المرور بالماوس
    
    // إلغاء timeout الحدود السابق
    if (boundsTimeoutRef.current) {
      clearTimeout(boundsTimeoutRef.current);
      boundsTimeoutRef.current = null;
    }
    
    if (onHover) onHover(node);
  }, [node, onHover]);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      if (onHover) onHover(null);
    }, 2000);
    
    // إخفاء الحدود بعد ثانيتين من مغادرة الماوس
    if (boundsTimeoutRef.current) {
      clearTimeout(boundsTimeoutRef.current);
    }
    boundsTimeoutRef.current = setTimeout(() => {
      setShowBounds(false);
    }, 2000);
  }, [onHover]);

  const handleButtonsMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleButtonsMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      if (onHover) onHover(null);
    }, 2000);
  }, [onHover]);

  const getStatusIcon = () => {
    switch (executionStatus) {
      case 'running':
        return <Loader2 className="w-3 h-3 animate-spin text-white" />;
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-200" />;
      case 'error':
        return <XCircle className="w-3 h-3 text-red-200" />;
      default:
        return null;
    }
  };

  const getStatusGlow = () => {
    switch (executionStatus) {
      case 'running':
        return 'shadow-lg shadow-blue-500/50 animate-pulse';
      case 'success':
        return 'shadow-lg shadow-green-500/50';
      case 'error':
        return 'shadow-lg shadow-red-500/50';
      default:
        return '';
    }
  };

  // Connection handle callbacks - تعطي مركز الدائرة مباشرة
  const createHandleCallbacks = (handleType: 'input' | 'output' | 'top' | 'bottom') => {
    const handleKey = handleType === 'input' ? 'left' : 
                       handleType === 'output' ? 'right' : 
                       handleType;
    
    return {
      onMouseDown: (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (onConnectionStart) {
          // نعطي مركز الدائرة مباشرة
          onConnectionStart(node.id, handleType, {
            x: positions.handles[handleKey as keyof typeof positions.handles].x,
            y: positions.handles[handleKey as keyof typeof positions.handles].y
          });
        }
      },
      onMouseUp: (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onConnectionEnd) {
          onConnectionEnd(node.id, handleType);
        }
      }
    };
  };

  const leftHandleCallbacks = createHandleCallbacks('input');
  const rightHandleCallbacks = createHandleCallbacks('output');
  const topHandleCallbacks = createHandleCallbacks('top');
  const bottomHandleCallbacks = createHandleCallbacks('bottom');

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleOpenSettings = useCallback(() => {
    onSelect(node);
    closeContextMenu();
  }, [node, onSelect, closeContextMenu]);

  const handleToggleExpand = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (onExpansionChange) {
      onExpansionChange(node.id, !isExpanded);
    }
    closeContextMenu();
  }, [node.id, isExpanded, onExpansionChange, closeContextMenu]);

  const handleDuplicateNode = useCallback(() => {
    onDuplicate(node);
    closeContextMenu();
  }, [node, onDuplicate, closeContextMenu]);

  const handleDeleteNode = useCallback(() => {
    onDelete(node.id);
    closeContextMenu();
  }, [node.id, onDelete, closeContextMenu]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('[data-handle]')) {
      if (onExpansionChange) {
        onExpansionChange(node.id, !isExpanded);
      }
    }
  }, [node.id, isExpanded, onExpansionChange]);

  // مكون الدائرة القابلة لإعادة الاستخدام
  const ConnectionHandle = ({ type, style: nodeStyle }: { type: 'left' | 'right' | 'top' | 'bottom', style: typeof style }) => {
    const handleType = type === 'left' ? 'input' : type === 'right' ? 'output' : type;
    const callbacks = type === 'left' ? leftHandleCallbacks : 
                     type === 'right' ? rightHandleCallbacks :
                     type === 'top' ? topHandleCallbacks : bottomHandleCallbacks;
    
    const pos = positions.handles[type];
    const rotation = type === 'left' ? 90 : type === 'right' ? -90 : type === 'top' ? 180 : -180;
    
    return (
      <motion.div 
        data-handle={handleType}
        data-node-id={node.id}
        style={{ 
          position: 'absolute',
          left: `${pos.x - positions.nodeLeft - HANDLE_SIZE/2}px`,
          top: `${pos.y - positions.nodeTop - HANDLE_SIZE/2}px`,
          width: `${HANDLE_SIZE}px`,
          height: `${HANDLE_SIZE}px`,
          pointerEvents: 'auto',
          zIndex: 100,
        }}
        className={`
          rounded-full border-2 border-white shadow-xl 
          cursor-pointer
          bg-gradient-to-br ${nodeStyle.gradient}
          transition-all duration-200
        `}
        whileHover={{ scale: 1.4, rotate: rotation }}
        whileTap={{ scale: 1.2 }}
        animate={{
          scale: isSelected || isHovered ? 1.1 : 1
        }}
        {...callbacks}
        title={type === 'left' ? 'إدخال' : type === 'right' ? 'إخراج' : type === 'top' ? 'ربط - أعلى' : 'ربط - أسفل'}
      >
        <div className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
          <motion.div 
            className="w-2 h-2 bg-white rounded-full shadow-inner"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: type === 'left' ? 0 : type === 'right' ? 0.5 : type === 'top' ? 1 : 1.5
            }}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* ===== MAIN NODE CONTAINER ===== */}
      <div
        ref={nodeRef}
        data-node="true"
        data-node-id={node.id}
        data-expanded={isExpanded ? "true" : "false"}
        data-selected={isSelected ? "true" : "false"}
        data-show-bounds={showBounds ? "true" : "false"}
        style={{
          position: 'absolute',
          left: `${positions.nodeLeft}px`,
          top: `${positions.nodeTop}px`,
          width: `${positions.currentWidth}px`,
          height: `${positions.currentHeight}px`,
          transformOrigin: 'center center',
        }}
        className={`
          relative select-none group
          ${isDragging ? 'cursor-grabbing opacity-50 z-50' : 'cursor-grab z-20'}
          ${isSelected ? 'z-40' : ''}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
      >
        {/* ===== COMPACT VIEW ===== */}
        {!isExpanded && (
          <>
            <motion.div
              className={`absolute inset-0 rounded-xl bg-gradient-to-br ${style.gradient} blur-md`}
              animate={{
                opacity: isHovered ? 0.4 : 0.2,
                scale: isHovered ? 1.2 : 1
              }}
              transition={{ duration: 0.2 }}
            />

            <motion.div
              className={`
                relative w-16 h-16 rounded-xl
                glass border-2
                ${isHovered ? `border-${style.accent}` : 'border-white/20'}
                ${getStatusGlow()}
                flex items-center justify-center
              `}
              style={{ overflow: 'visible', transformOrigin: 'center center' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-90`} />
              </div>
              
              <motion.div
                className="relative z-20 pointer-events-none"
                animate={{
                  scale: isExecuting ? [1, 1.2, 1] : 1,
                  rotate: isExecuting ? [0, 360] : 0
                }}
                transition={{
                  duration: isExecuting ? 2 : 0.3,
                  repeat: isExecuting ? Infinity : 0,
                }}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>

              <AnimatePresence>
                {executionStatus !== 'idle' && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg z-30"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    {getStatusIcon()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* ===== EXPANDED VIEW ===== */}
        {isExpanded && (
          <motion.div
            className={`
              w-full h-full rounded-2xl
              glass-medium border-2
              ${isHovered || isSelected ? `border-${style.accent}` : 'border-white/20'}
              ${isSelected ? 'ring-2 ring-' + style.accent + ' ring-offset-2' : ''}
              backdrop-blur-xl
              overflow-hidden
              transition-all duration-300
              flex flex-col
            `}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              boxShadow: isHovered || isSelected 
                ? `0 20px 60px ${style.glow}, 0 0 0 1px ${style.accent}` 
                : `0 10px 40px ${style.glow}`
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ transformOrigin: 'center center' }}
          >
            {/* Header Compact */}
            <div className={`h-9 bg-gradient-to-br ${style.gradient} flex items-center px-3 gap-2 relative shrink-0`}>
              <div className="w-5 h-5 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-white truncate">
                  {node.data?.label || node.type}
                </h3>
              </div>
              
              <AnimatePresence>
                {executionStatus !== 'idle' && (
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg shrink-0"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    {getStatusIcon()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content Compact */}
            <div className="flex-1 px-3 py-2 flex flex-col gap-1.5 overflow-hidden">
              <p className="text-xs text-foreground-muted leading-tight">
                {style.description}
              </p>
              
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20 border border-white/20 self-start">
                <div className={`w-1 h-1 rounded-full bg-${style.accent}`} />
                <span className="text-xs font-medium text-foreground-muted">
                  {style.category}
                </span>
              </div>

              {executionTime !== undefined && (
                <div className="mt-auto text-xs text-foreground-muted flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/30 dark:bg-black/10 self-start">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{executionTime}ms</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== CONNECTION HANDLES - داخل العقدة لكن بمواضع absolute ===== */}
        <ConnectionHandle type="left" style={style} />
        <ConnectionHandle type="right" style={style} />
        <ConnectionHandle type="top" style={style} />
        <ConnectionHandle type="bottom" style={style} />

        {/* Floating Action Buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onMouseEnter={handleButtonsMouseEnter}
              onMouseLeave={handleButtonsMouseLeave}
            >
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(node);
                }}
                className="w-6 h-6 rounded-lg bg-white/95 hover:bg-white backdrop-blur-md text-blue-600 hover:text-blue-700 flex items-center justify-center shadow-lg border border-blue-200/50 hover:border-blue-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title="الإعدادات"
              >
                <Settings className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleExpand(e);
                }}
                className="w-6 h-6 rounded-lg bg-white/95 hover:bg-white backdrop-blur-md text-purple-600 hover:text-purple-700 flex items-center justify-center shadow-lg border border-purple-200/50 hover:border-purple-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={isExpanded ? "تصغير" : "توسيع"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(node);
                }}
                className="w-6 h-6 rounded-lg bg-white/95 hover:bg-white backdrop-blur-md text-green-600 hover:text-green-700 flex items-center justify-center shadow-lg border border-green-200/50 hover:border-green-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title="نسخ"
              >
                <Copy className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
                className="w-6 h-6 rounded-lg bg-white/95 hover:bg-red-500 backdrop-blur-md text-red-600 hover:text-white flex items-center justify-center shadow-lg border border-red-200/50 hover:border-red-500"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title="حذف"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Context Menu */}
        <AnimatePresence>
          {contextMenu && (
            <>
              <div
                className="context-menu-backdrop"
                style={{ zIndex: 9990 }}
                onClick={closeContextMenu}
              />
              <motion.div
                className="windows-context-menu"
                style={{
                  position: 'fixed',
                  top: contextMenu.y,
                  left: contextMenu.x,
                  zIndex: 9999,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleOpenSettings}
                  className="windows-context-menu-item"
                >
                  <Settings className="windows-context-menu-icon" />
                  <span>الإعدادات</span>
                </button>
                <button
                  onClick={handleToggleExpand}
                  className="windows-context-menu-item"
                >
                  {isExpanded ? (
                    <>
                      <Minimize2 className="windows-context-menu-icon" />
                      <span>تصغير</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="windows-context-menu-icon" />
                      <span>توسيع</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDuplicateNode}
                  className="windows-context-menu-item"
                >
                  <Copy className="windows-context-menu-icon" />
                  <span>نسخ</span>
                </button>
                <div className="windows-context-menu-separator" />
                <button
                  onClick={handleDeleteNode}
                  className="windows-context-menu-item"
                >
                  <Trash2 className="windows-context-menu-icon" />
                  <span>حذف</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

// تطبيق React.memo لتحسين الأداء
const MemoizedWorkflowNodeEnhanced = memo(WorkflowNodeEnhancedComponent, (prevProps, nextProps) => {
  // مقارنة Props لتحديد إذا كان يجب إعادة الرسم
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.type === nextProps.node.type &&
    prevProps.node.position.x === nextProps.node.position.x &&
    prevProps.node.position.y === nextProps.node.position.y &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isExecuting === nextProps.isExecuting &&
    prevProps.executionStatus === nextProps.executionStatus &&
    prevProps.executionTime === nextProps.executionTime &&
    prevProps.isCompact === nextProps.isCompact &&
    JSON.stringify(prevProps.node.data) === JSON.stringify(nextProps.node.data)
  );
});

MemoizedWorkflowNodeEnhanced.displayName = 'WorkflowNodeEnhanced';

export { MemoizedWorkflowNodeEnhanced as WorkflowNodeEnhanced };