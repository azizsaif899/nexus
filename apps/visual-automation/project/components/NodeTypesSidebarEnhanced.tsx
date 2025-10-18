import React, { useState, useEffect, useRef, useMemo } from 'react';
import { debounce } from '../lib/performance-optimizer';
import { useDrag } from 'react-dnd';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Play, 
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
  Search,
  Filter,
  Sparkles,
  Activity,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
  X,
  Plus,
  Code,
  Boxes,
  AlertTriangle,
  LayoutGrid,
  Shuffle
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface NodeType {
  type: string;
  label: string;
  icon: React.ComponentType<any>;
  gradient: string;
  accent: string;
  glow: string;
  description: string;
  category: string;
  tags: string[];
}

const nodeTypes: NodeType[] = [
  // Triggers
  { 
    type: 'webhook-trigger', 
    label: 'Webhook', 
    icon: Webhook, 
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    accent: 'emerald-500',
    glow: 'emerald-500/30',
    description: 'استقبال البيانات عبر HTTP', 
    category: 'محفزات',
    tags: ['http', 'api', 'webhook', 'trigger']
  },
  { 
    type: 'schedule-trigger', 
    label: 'مجدول', 
    icon: Clock, 
    gradient: 'from-green-400 via-emerald-500 to-teal-600',
    accent: 'green-500',
    glow: 'green-500/30',
    description: 'تشغيل تلقائي حسب الوقت', 
    category: 'محفزات',
    tags: ['schedule', 'cron', 'timer', 'automatic']
  },
  { 
    type: 'email-trigger', 
    label: 'بريد إلكتروني', 
    icon: Mail, 
    gradient: 'from-teal-400 via-cyan-500 to-blue-600',
    accent: 'teal-500',
    glow: 'teal-500/30',
    description: 'عند وصول رسائل جديدة', 
    category: 'محفزات',
    tags: ['email', 'mail', 'imap', 'smtp']
  },
  
  // Actions
  { 
    type: 'http-request', 
    label: 'طلب HTTP', 
    icon: Globe, 
    gradient: 'from-blue-400 via-indigo-500 to-purple-600',
    accent: 'blue-500',
    glow: 'blue-500/30',
    description: 'إرسال طلبات للخوادم', 
    category: 'إجراءات',
    tags: ['http', 'api', 'request', 'fetch']
  },
  { 
    type: 'email-send', 
    label: 'إرسال بريد', 
    icon: Mail, 
    gradient: 'from-indigo-400 via-blue-500 to-cyan-600',
    accent: 'indigo-500',
    glow: 'indigo-500/30',
    description: 'إرسال رسائل إلكترونية', 
    category: 'إجراءات',
    tags: ['email', 'send', 'notification', 'smtp']
  },
  { 
    type: 'notification', 
    label: 'إشعار', 
    icon: MessageSquare, 
    gradient: 'from-purple-400 via-violet-500 to-indigo-600',
    accent: 'purple-500',
    glow: 'purple-500/30',
    description: 'إرسال إشعارات للمستخدمين', 
    category: 'إجراءات',
    tags: ['notification', 'alert', 'message']
  },
  { 
    type: 'database-read', 
    label: 'قراءة من قاعدة بيانات', 
    icon: Database, 
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    accent: 'violet-500',
    glow: 'violet-500/30',
    description: 'استرجاع البيانات من قاعدة البيانات', 
    category: 'إجراءات',
    tags: ['database', 'read', 'query', 'sql']
  },
  { 
    type: 'database-write', 
    label: 'كتابة لقاعدة بيانات', 
    icon: Database, 
    gradient: 'from-fuchsia-400 via-pink-500 to-rose-600',
    accent: 'fuchsia-500',
    glow: 'fuchsia-500/30',
    description: 'حفظ البيانات في قاعدة البيانات', 
    category: 'إجراءات',
    tags: ['database', 'write', 'insert', 'update']
  },
  
  // Logic
  { 
    type: 'condition', 
    label: 'شرط', 
    icon: GitBranch, 
    gradient: 'from-amber-400 via-orange-500 to-red-600',
    accent: 'amber-500',
    glow: 'amber-500/30',
    description: 'تحقق من الشروط وتفرع', 
    category: 'منطق',
    tags: ['condition', 'if', 'branch', 'logic']
  },
  { 
    type: 'delay', 
    label: 'تأخير', 
    icon: Timer, 
    gradient: 'from-orange-400 via-amber-500 to-yellow-600',
    accent: 'orange-500',
    glow: 'orange-500/30',
    description: 'إيقاف مؤقت قبل المتابعة', 
    category: 'منطق',
    tags: ['delay', 'wait', 'pause', 'timeout']
  },
  { 
    type: 'transform', 
    label: 'تحويل', 
    icon: Zap, 
    gradient: 'from-yellow-400 via-lime-500 to-green-600',
    accent: 'yellow-500',
    glow: 'yellow-500/30',
    description: 'تحويل وتنسيق البيانات', 
    category: 'منطق',
    tags: ['transform', 'map', 'convert', 'format']
  },
  { 
    type: 'function', 
    label: 'دالة مخصصة', 
    icon: FileText, 
    gradient: 'from-rose-400 via-red-500 to-pink-600',
    accent: 'rose-500',
    glow: 'rose-500/30',
    description: 'تنفيذ كود JavaScript مخصص', 
    category: 'منطق',
    tags: ['function', 'code', 'javascript', 'custom']
  },
  { 
    type: 'filter', 
    label: 'تصفية', 
    icon: Filter, 
    gradient: 'from-pink-400 via-rose-500 to-red-600',
    accent: 'pink-500',
    glow: 'pink-500/30',
    description: 'تصفية البيانات حسب شروط محددة', 
    category: 'منطق',
    tags: ['filter', 'where', 'condition', 'select']
  },
];

interface NodeCardProps {
  node: NodeType;
  isCollapsed: boolean;
}

const NodeCard = React.memo(function NodeCard({ node, isCollapsed }: NodeCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'NODE',
    item: { 
      nodeType: node.type,
      label: node.label,
      icon: node.icon 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const Icon = node.icon;

  if (isCollapsed) {
    // Collapsed view - icon only
    return (
      <motion.div
        ref={drag}
        className={`
          relative flex items-center justify-center
          p-3 rounded-lg cursor-move
          transition-all duration-300
          ${isDragging ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}
          glass-light hover:glass-medium
          group
          mx-auto
        `}
        style={{ width: '100%', maxWidth: '100%' }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        title={`${node.label} - ${node.description}`}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${node.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
        
        {/* Icon */}
        <Icon className="w-5 h-5 relative z-10 text-foreground" />
      </motion.div>
    );
  }

  // Expanded view - full card
  return (
    <motion.div
      ref={drag}
      className={`
        relative flex items-center gap-3
        p-3 rounded-lg cursor-move
        transition-all duration-300
        ${isDragging ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}
        glass-light hover:glass-medium
        group
        mx-auto
      `}
      style={{ width: '100%', maxWidth: '100%' }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${node.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      {/* Icon container with gradient */}
      <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${node.gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 min-w-0">
        <h4 className="font-medium text-sm text-foreground truncate text-right">{node.label}</h4>
        <p className="text-xs text-foreground-muted truncate text-right">{node.description}</p>
      </div>

      {/* Drag indicator */}
      <motion.div 
        className="flex-shrink-0 w-6 h-6 rounded bg-background-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.1 }}
      >
        <div className="flex flex-col gap-0.5">
          <div className="w-3 h-0.5 bg-foreground-muted rounded" />
          <div className="w-3 h-0.5 bg-foreground-muted rounded" />
          <div className="w-3 h-0.5 bg-foreground-muted rounded" />
        </div>
      </motion.div>
    </motion.div>
  );
});

interface NodeTypesSidebarEnhancedProps {
  isCollapsed?: boolean;
  workflowName?: string;
  onWorkflowNameChange?: (name: string) => void;
}

export function NodeTypesSidebarEnhanced({ 
  isCollapsed = false,
  workflowName = 'عقد سير العمل',
  onWorkflowNameChange
}: NodeTypesSidebarEnhancedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(workflowName);
  const [isCreateNodeDialogOpen, setIsCreateNodeDialogOpen] = useState(false);
  const [newNodeData, setNewNodeData] = useState({
    type: 'action',
    label: '',
    description: '',
    category: 'إجراءات'
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingScroll, setIsDraggingScroll] = useState(false);
  const [scrollStartX, setScrollStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // ⚡ Debounced search handler - تحسين الأداء
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setDebouncedSearchQuery(query);
    }, 300),
    []
  );
  
  // تطبيق debounce على البحث
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);
  
  // تحديث editedName عندما يتغير workflowName من الخارج
  useEffect(() => {
    setEditedName(workflowName);
  }, [workflowName]);

  const categories = [...new Set(nodeTypes.map(node => node.category))];

  const filteredNodes = nodeTypes.filter(node => {
    const matchesSearch = debouncedSearchQuery === '' || 
      node.label.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      node.tags.some(tag => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || node.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const handleSaveName = () => {
    const trimmedName = editedName.trim();
    if (trimmedName && onWorkflowNameChange) {
      onWorkflowNameChange(trimmedName);
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditedName(workflowName);
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // معالج إنشاء عقدة جديدة
  const handleCreateNode = () => {
    if (!newNodeData.label.trim()) {
      return;
    }

    // هنا يمكن إضافة المنطق لإضافة العقدة الجديدة إلى الكانفا
    console.log('إنشاء عقدة جديدة:', newNodeData);
    
    // إغلاق المربع الحواري وإعادة تعيين البيانات
    setIsCreateNodeDialogOpen(false);
    setNewNodeData({
      type: 'action',
      label: '',
      description: '',
      category: 'إجراءات'
    });
  };

  // معالجات التمرير بالماوس (Horizontal Scroll)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    
    setIsDraggingScroll(true);
    setScrollStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingScroll || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - scrollStartX) * 2; // المضاعف يحدد سرعة التمرير
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDraggingScroll(false);
  };

  const handleMouseLeave = () => {
    setIsDraggingScroll(false);
  };

  return (
    <motion.div 
      className="h-full glass border-l border-border flex flex-col relative z-[200]"
      style={{ overflow: 'hidden', pointerEvents: 'auto' }}
      animate={{ 
        width: isCollapsed ? '80px' : '320px' 
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      <AnimatePresence mode="wait">
        {!isCollapsed ? (
          /* Expanded View */
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <motion.div 
              className="relative z-10 p-4 border-b border-border neomorph-subtle"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Activity className="w-5 h-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  {!isEditingName ? (
                    <div 
                      className="flex items-center gap-2 cursor-pointer group"
                      onClick={() => setIsEditingName(true)}
                    >
                      <h2 className="font-bold">{workflowName}</h2>
                      <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        id="workflow-name-input"
                        name="workflowName"
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-7 text-sm"
                        autoFocus
                        maxLength={50}
                        aria-label="تعديل اسم سير العمل"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={handleSaveName}
                      >
                        <Check className="w-3 h-3 text-success" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {filteredNodes.length} من أصل {nodeTypes.length} عقدة
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search-nodes-sidebar"
                  name="searchNodes"
                  type="search"
                  placeholder="بحث عن العقد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="البحث عن العقد"
                  className="pl-10 glass-input text-sm"
                />
              </div>

              {/* Category Filter + Create Node Button */}
              <div className="mb-2">
                <TooltipProvider delayDuration={200}>
                  <div 
                    ref={scrollContainerRef}
                    className="flex items-center gap-4 flex-1 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none px-3 py-2"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    style={{ 
                      scrollBehavior: isDraggingScroll ? 'auto' : 'smooth',
                      userSelect: 'none'
                    }}
                  >
                    {/* زر الكل */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`
                            flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200
                            ${selectedCategory === null 
                              ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                              : 'text-foreground-muted hover:text-foreground hover:bg-muted/50 hover:scale-105'
                            }
                          `}
                        >
                          <LayoutGrid className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>الكل</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* الفاصل الأول */}
                    <Separator orientation="vertical" className="h-6 w-px bg-border/40" />
                    
                    {/* أيقونات الفئات */}
                    {categories.map((category, index) => {
                      const categoryIcons: Record<string, React.ComponentType<any>> = {
                        'محفزات': Zap,
                        'إجراءات': Play,
                        'منطق': GitBranch,
                        'قواعد البيانات': Database,
                        'اتصالات': Globe,
                        'تحويل': Shuffle,
                        'تحكم': Timer,
                        'كود': Code,
                      };
                      
                      const Icon = categoryIcons[category] || Settings;
                      
                      return (
                        <React.Fragment key={category}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setSelectedCategory(category)}
                                className={`
                                  flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg transition-all duration-200
                                  ${selectedCategory === category 
                                    ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                                    : 'text-foreground-muted hover:text-foreground hover:bg-muted/50 hover:scale-105'
                                  }
                                `}
                              >
                                <Icon className="w-5 h-5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>{category}</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* فاصل بين الأيقونات */}
                          {index < categories.length - 1 && (
                            <Separator orientation="vertical" className="h-6 w-px bg-border/40" />
                          )}
                        </React.Fragment>
                      );
                    })}
                    
                    {/* فاصل قبل زر إنشاء */}
                    <Separator orientation="vertical" className="h-6 w-px bg-border/40" />
                    
                    {/* زر إنشاء عقدة جديدة */}
                    <Dialog open={isCreateNodeDialogOpen} onOpenChange={setIsCreateNodeDialogOpen}>
                      <DialogTrigger asChild>
                        <button
                          className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md hover:opacity-90 hover:scale-105 transition-all duration-200"
                          title="إنشاء عقدة جديدة"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </DialogTrigger>
                      
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Boxes className="w-5 h-5" />
                            إنشاء عقدة مخصصة جديدة
                          </DialogTitle>
                          <DialogDescription>
                            أنشئ عقدة مخصصة بمواصفات ActivePieces الكاملة
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          {/* نوع العقدة */}
                          <div className="grid gap-2">
                            <Label htmlFor="node-type">نوع العقدة</Label>
                            <Select
                              value={newNodeData.type}
                              onValueChange={(value) => setNewNodeData({ ...newNodeData, type: value })}
                            >
                              <SelectTrigger id="node-type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="trigger">
                                  <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-emerald-500" />
                                    <span>محفز (Trigger)</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="action">
                                  <div className="flex items-center gap-2">
                                    <Play className="w-4 h-4 text-blue-500" />
                                    <span>إجراء (Action)</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="logic">
                                  <div className="flex items-center gap-2">
                                    <GitBranch className="w-4 h-4 text-amber-500" />
                                    <span>منطق (Logic)</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="error-handler">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <span>معالج أخطاء (Error Handler)</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="custom">
                                  <div className="flex items-center gap-2">
                                    <Code className="w-4 h-4 text-purple-500" />
                                    <span>مخصص (Custom)</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* التصنيف */}
                          <div className="grid gap-2">
                            <Label htmlFor="node-category">التصنيف</Label>
                            <Select
                              value={newNodeData.category}
                              onValueChange={(value) => setNewNodeData({ ...newNodeData, category: value })}
                            >
                              <SelectTrigger id="node-category">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="محفزات">محفزات</SelectItem>
                                <SelectItem value="إجراءات">إجراءات</SelectItem>
                                <SelectItem value="منطق">منطق</SelectItem>
                                <SelectItem value="قواعد البيانات">قواعد البيانات</SelectItem>
                                <SelectItem value="اتصالات">اتصالات</SelectItem>
                                <SelectItem value="مخصص">مخصص</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* اسم العقدة */}
                          <div className="grid gap-2">
                            <Label htmlFor="node-label">اسم العقدة *</Label>
                            <Input
                              id="node-label"
                              value={newNodeData.label}
                              onChange={(e) => setNewNodeData({ ...newNodeData, label: e.target.value })}
                              placeholder="مثال: طلب HTTP مخصص"
                              required
                            />
                          </div>
                          
                          {/* الوصف */}
                          <div className="grid gap-2">
                            <Label htmlFor="node-description">الوصف</Label>
                            <Textarea
                              id="node-description"
                              value={newNodeData.description}
                              onChange={(e) => setNewNodeData({ ...newNodeData, description: e.target.value })}
                              placeholder="وصف مختصر لوظيفة العقدة..."
                              rows={3}
                            />
                          </div>
                          
                          {/* معلومات إضافية */}
                          <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              معلومات مفيدة
                            </h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              <li>• سيتم إنشاء العقدة بإعدادات افتراضية</li>
                              <li>• يمكنك تخصيص الإعدادات من لوحة الخصائص</li>
                              <li>• راجع دليل إنشاء العقد للمزيد من التفاصيل</li>
                            </ul>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsCreateNodeDialogOpen(false)}
                          >
                            إلغاء
                          </Button>
                          <Button
                            onClick={handleCreateNode}
                            disabled={!newNodeData.label.trim()}
                            className="bg-gradient-to-br from-primary to-accent"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            إنشاء العقدة
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TooltipProvider>
              </div>
            </motion.div>

            {/* Node List */}
            <ScrollArea className="flex-1" style={{ pointerEvents: 'auto' }}>
              <div className="p-4 space-y-4 relative z-10">
                {categories.map((category) => {
                  const categoryNodes = filteredNodes.filter(node => node.category === category);
                  if (categoryNodes.length === 0) return null;

                  const isCollapsedCategory = collapsedCategories.has(category);

                  return (
                    <div key={category} className="space-y-2">
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-background-muted/50 transition-colors group"
                      >
                        <span className="text-sm font-semibold text-foreground">{category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{categoryNodes.length}</span>
                          <motion.div
                            animate={{ rotate: isCollapsedCategory ? -90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Category Nodes */}
                      <AnimatePresence>
                        {!isCollapsedCategory && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2"
                          >
                            {categoryNodes.map((node) => (
                              <NodeCard key={node.type} node={node} isCollapsed={false} />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* No Results */}
                {filteredNodes.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <Sparkles className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">لا توجد عقد مطابقة</p>
                    <p className="text-xs text-muted-foreground mt-1">جرب بحثاً آخر</p>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        ) : (
          /* Collapsed View */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Collapsed Header */}
            <div className="relative z-10 p-2 border-b border-border">
              <motion.div
                className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent mx-auto"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ width: 'fit-content' }}
              >
                <Activity className="w-5 h-5 text-white" />
              </motion.div>
            </div>

            {/* Collapsed Node List */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {filteredNodes.map((node) => (
                  <NodeCard key={node.type} node={node} isCollapsed={true} />
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}