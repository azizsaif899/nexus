import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Edit3, Copy, Trash2, Link2, 
  Eye, EyeOff, Lock, Unlock, Star, Settings,
  MoreHorizontal, Plus, Minus, RotateCcw,
  Zap, Clock, AlertCircle, CheckCircle,
  Users, Share2, Comments, History
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';

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

interface Comment {
  id: string;
  nodeId: string;
  author: string;
  content: string;
  timestamp: number;
  resolved: boolean;
  position?: { x: number; y: number };
}

interface EnhancedNodeInteractionsProps {
  nodes: Node[];
  connections: Connection[];
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, updates: any) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeDuplicate: (nodeId: string) => void;
  hoveredNode: Node | null;
  executingNodes: Set<string>;
  nodeExecutionStatus: Map<string, 'idle' | 'running' | 'success' | 'error' | 'paused'>;
  nodeExecutionTimes: Map<string, number>;
}

// Hover Preview Component - Compact & Static
const HoverPreview: React.FC<{
  node: Node;
  connections: Connection[];
  allNodes: Node[];
  position: { x: number; y: number };
}> = ({ node, connections, allNodes, position }) => {
  // Calculate static position based on node DOM element - with scroll support
  const [tooltipPos, setTooltipPos] = React.useState({ x: position.x, y: position.y });
  
  React.useEffect(() => {
    const updatePosition = () => {
      const nodeElement = document.querySelector(`[data-node-id="${node.id}"]`);
      if (nodeElement) {
        const rect = nodeElement.getBoundingClientRect();
        // Position tooltip below the node, centered
        setTooltipPos({
          x: rect.left + rect.width / 2 - 75, // 75 = half of tooltip width (150px)
          y: rect.bottom + 8 // Position below node with spacing
        });
      }
    };
    
    updatePosition();
    
    // Update position on scroll/resize
    const canvas = document.querySelector('.workflow-canvas-container');
    if (canvas) {
      canvas.addEventListener('scroll', updatePosition, true);
    }
    window.addEventListener('resize', updatePosition);
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('scroll', updatePosition, true);
      }
      window.removeEventListener('resize', updatePosition);
    };
  }, [node.id]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className="fixed z-50 pointer-events-none"
      style={{ 
        left: tooltipPos.x,
        top: tooltipPos.y,
        width: '150px'
      }}
    >
      <div className="glass-light border border-border rounded-lg shadow-md px-2.5 py-1.5 backdrop-blur-sm">
        {/* Compact Node Info Only */}
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            node.type.includes('trigger') ? 'bg-success' :
            node.type.includes('condition') ? 'bg-warning' :
            'bg-primary'
          }`} />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-foreground truncate leading-tight">
              {node.data?.label || node.type.replace('-', ' ')}
            </div>
          </div>
        </div>
      </div>
      
      {/* Small arrow pointing up to node */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full"
        style={{ 
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderBottom: '4px solid var(--border)',
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.05))'
        }}
      />
    </motion.div>
  );
};

// Inline Comment Component
const InlineComment: React.FC<{
  comment: Comment;
  onResolve: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
}> = ({ comment, onResolve, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  
  const handleSave = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute z-40"
      style={{ 
        left: comment.position?.x || 0, 
        top: comment.position?.y || 0 
      }}
    >
      <Card className={`w-80 glass-medium border-2 ${comment.resolved ? 'border-success' : 'border-warning'} shadow-lg`}>
        <div className="p-3 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {comment.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {comment.author}
                </div>
                <div className="text-xs text-foreground-muted">
                  منذ {Math.floor((Date.now() - comment.timestamp) / 60000)} دقيقة
                </div>
              </div>
            </div>
            <Badge variant={comment.resolved ? "default" : "secondary"} className="text-xs">
              {comment.resolved ? 'محلول' : 'مفتوح'}
            </Badge>
          </div>
          
          {/* Content */}
          <div>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-sm resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="text-xs">
                    حفظ
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="text-xs"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-foreground">
                {comment.content}
              </div>
            )}
          </div>
          
          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 p-0"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(comment.id)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <Button
                size="sm"
                variant={comment.resolved ? "outline" : "default"}
                onClick={() => onResolve(comment.id)}
                className="text-xs"
              >
                {comment.resolved ? 'إعادة فتح' : 'حل'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Node Context Menu Component
const NodeContextMenu: React.FC<{
  node: Node;
  position: { x: number; y: number };
  onClose: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddComment: () => void;
  onToggleLock: () => void;
  onToggleVisibility: () => void;
}> = ({ node, position, onClose, onDuplicate, onDelete, onAddComment, onToggleLock, onToggleVisibility }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 glass-medium rounded-lg border border-border-strong shadow-xl overflow-hidden"
      style={{ left: position.x, top: position.y }}
    >
      <div className="py-2 w-48">
        {/* Node Info */}
        <div className="px-3 py-2 border-b border-border">
          <div className="text-sm font-medium text-foreground">
            {node.data?.label || node.type.replace('-', ' ')}
          </div>
          <div className="text-xs text-foreground-muted">
            {node.type.replace('-', ' ')}
          </div>
        </div>
        
        {/* Actions */}
        <div className="py-1">
          <button
            onClick={() => { onDuplicate(); onClose(); }}
            className="w-full px-3 py-2 text-right text-sm text-foreground hover:bg-hover-bg flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            نسخ العقدة
          </button>
          
          <button
            onClick={() => { onAddComment(); onClose(); }}
            className="w-full px-3 py-2 text-right text-sm text-foreground hover:bg-hover-bg flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            إضافة تعليق
          </button>
          
          <button
            onClick={() => { onToggleLock(); onClose(); }}
            className="w-full px-3 py-2 text-right text-sm text-foreground hover:bg-hover-bg flex items-center gap-2"
          >
            {node.data?.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {node.data?.locked ? 'إلغاء القفل' : 'قفل العقدة'}
          </button>
          
          <button
            onClick={() => { onToggleVisibility(); onClose(); }}
            className="w-full px-3 py-2 text-right text-sm text-foreground hover:bg-hover-bg flex items-center gap-2"
          >
            {node.data?.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {node.data?.hidden ? 'إظهار العقدة' : 'إخفاء العقدة'}
          </button>
        </div>
        
        <Separator />
        
        <div className="py-1">
          <button
            onClick={() => { onDelete(); onClose(); }}
            className="w-full px-3 py-2 text-right text-sm text-destructive hover:bg-destructive-muted hover:text-destructive flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            حذف العقدة
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Click Effect Component
const ClickEffect: React.FC<{
  position: { x: number; y: number };
  onComplete: () => void;
}> = ({ position, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed pointer-events-none z-50"
      style={{ 
        left: position.x - 25, 
        top: position.y - 25,
        width: 50,
        height: 50
      }}
    >
      <div className="w-full h-full rounded-full border-2 border-primary bg-primary bg-opacity-20" />
    </motion.div>
  );
};

// Enhanced Node Interactions Main Component
const EnhancedNodeInteractions: React.FC<EnhancedNodeInteractionsProps> = ({
  nodes,
  connections,
  selectedNode,
  onNodeUpdate,
  onNodeDelete,
  onNodeDuplicate,
  hoveredNode,
  executingNodes,
  nodeExecutionStatus,
  nodeExecutionTimes
}) => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ node: Node; position: { x: number; y: number } } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [clickEffects, setClickEffects] = useState<{ id: string; position: { x: number; y: number } }[]>([]);
  const [showCommentDialog, setShowCommentDialog] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [nodeAnimations, setNodeAnimations] = useState<Map<string, string>>(new Map());
  const [collaborativeEditing, setCollaborativeEditing] = useState<Map<string, { user: string; timestamp: number }>>(new Map());
  
  // Delayed hover state - only show tooltip after 500ms of hovering
  const [delayedHoverNode, setDelayedHoverNode] = useState<Node | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle delayed hover with timeout
  useEffect(() => {
    // Clear existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    if (hoveredNode) {
      // Start new timeout - show after 400ms (quick but not instant)
      hoverTimeoutRef.current = setTimeout(() => {
        setDelayedHoverNode(hoveredNode);
      }, 400);
    } else {
      // Hide immediately when mouse leaves
      setDelayedHoverNode(null);
    }
    
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
    };
  }, [hoveredNode]);
  
  // Handle mouse position for hover preview
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setHoverPosition({ x: e.clientX, y: e.clientY });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Listen for canvas layout events
  useEffect(() => {
    const handleLayoutApplied = (event: CustomEvent) => {
      const { nodeCount } = event.detail;
      // Add celebration animation for nodes
      nodes.forEach(node => {
        setNodeAnimations(prev => new Map(prev).set(node.id, 'celebrate'));
        setTimeout(() => {
          setNodeAnimations(prev => {
            const newMap = new Map(prev);
            newMap.delete(node.id);
            return newMap;
          });
        }, 2000);
      });
    };
    
    window.addEventListener('canvas-layout-applied', handleLayoutApplied as EventListener);
    return () => window.removeEventListener('canvas-layout-applied', handleLayoutApplied as EventListener);
  }, [nodes]);
  
  // Simulate collaborative editing indicators
  useEffect(() => {
    if (selectedNode) {
      const editingInfo = {
        user: 'أنت',
        timestamp: Date.now()
      };
      setCollaborativeEditing(prev => new Map(prev).set(selectedNode.id, editingInfo));
      
      // Clear after 3 seconds of inactivity
      const timer = setTimeout(() => {
        setCollaborativeEditing(prev => {
          const newMap = new Map(prev);
          newMap.delete(selectedNode.id);
          return newMap;
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedNode]);
  
  // Handle click effects
  const handleNodeClick = useCallback((node: Node, event: React.MouseEvent) => {
    const clickId = `click-${Date.now()}`;
    const clickPosition = { x: event.clientX, y: event.clientY };
    
    setClickEffects(prev => [...prev, { id: clickId, position: clickPosition }]);
    
    // Remove click effect after animation
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== clickId));
    }, 700);
  }, []);
  
  // Handle context menu
  const handleContextMenu = useCallback((node: Node, event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      node,
      position: { x: event.clientX, y: event.clientY }
    });
  }, []);
  
  // Handle comment operations
  const handleAddComment = useCallback((nodeId: string) => {
    setShowCommentDialog(nodeId);
  }, []);
  
  const handleSaveComment = useCallback(() => {
    if (showCommentDialog && newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        nodeId: showCommentDialog,
        author: 'المستخدم الحالي',
        content: newComment.trim(),
        timestamp: Date.now(),
        resolved: false,
        position: { x: 100, y: 100 } // Default position, should be calculated based on node position
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
      setShowCommentDialog(null);
    }
  }, [showCommentDialog, newComment]);
  
  const handleResolveComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, resolved: !comment.resolved } : comment
    ));
  }, []);
  
  const handleDeleteComment = useCallback((commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  }, []);
  
  const handleEditComment = useCallback((commentId: string, content: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId ? { ...comment, content } : comment
    ));
  }, []);
  
  // Node operations
  const handleDuplicateNode = useCallback((nodeId: string) => {
    onNodeDuplicate(nodeId);
  }, [onNodeDuplicate]);
  
  const handleDeleteNode = useCallback((nodeId: string) => {
    onNodeDelete(nodeId);
    // Remove associated comments
    setComments(prev => prev.filter(comment => comment.nodeId !== nodeId));
  }, [onNodeDelete]);
  
  const handleToggleLock = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      onNodeUpdate(nodeId, { locked: !node.data?.locked });
    }
  }, [nodes, onNodeUpdate]);
  
  const handleToggleVisibility = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      onNodeUpdate(nodeId, { hidden: !node.data?.hidden });
    }
  }, [nodes, onNodeUpdate]);
  
  return (
    <>
      {/* Hover Preview - Delayed & Compact */}
      <AnimatePresence>
        {delayedHoverNode && (
          <HoverPreview
            node={delayedHoverNode}
            connections={connections}
            allNodes={nodes}
            position={hoverPosition}
          />
        )}
      </AnimatePresence>
      
      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <NodeContextMenu
            node={contextMenu.node}
            position={contextMenu.position}
            onClose={() => setContextMenu(null)}
            onDuplicate={() => handleDuplicateNode(contextMenu.node.id)}
            onDelete={() => handleDeleteNode(contextMenu.node.id)}
            onAddComment={() => handleAddComment(contextMenu.node.id)}
            onToggleLock={() => handleToggleLock(contextMenu.node.id)}
            onToggleVisibility={() => handleToggleVisibility(contextMenu.node.id)}
          />
        )}
      </AnimatePresence>
      
      {/* Click Effects */}
      <AnimatePresence>
        {clickEffects.map(effect => (
          <ClickEffect
            key={effect.id}
            position={effect.position}
            onComplete={() => setClickEffects(prev => prev.filter(e => e.id !== effect.id))}
          />
        ))}
      </AnimatePresence>
      
      {/* Inline Comments */}
      <AnimatePresence>
        {comments.map(comment => (
          <InlineComment
            key={comment.id}
            comment={comment}
            onResolve={handleResolveComment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        ))}
      </AnimatePresence>
      
      {/* Add Comment Dialog */}
      <Dialog open={!!showCommentDialog} onOpenChange={(open) => !open && setShowCommentDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة تعليق</DialogTitle>
            <DialogDescription className="sr-only">
              أضف تعليقاً على العقدة المحددة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="اكتب تعليقك هنا..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="resize-none"
              dir="rtl"
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowCommentDialog(null)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveComment} disabled={!newComment.trim()}>
                إضافة تعليق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Helper functions for components to use */}
      <div className="hidden">
        {/* This div provides context for other components to access these handlers */}
        <div data-handlers={JSON.stringify({
          onNodeClick: handleNodeClick,
          onContextMenu: handleContextMenu
        })} />
      </div>
    </>
  );
};

export { EnhancedNodeInteractions };