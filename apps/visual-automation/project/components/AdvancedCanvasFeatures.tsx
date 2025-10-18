import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ZoomIn, ZoomOut, Layers, Eye, EyeOff, Grid3X3, 
  MessageSquare, Users, Download, Code, Settings2, 
  Palette, Upload, Compass, Target, Move, RotateCcw,
  GitBranch, Filter, SortAsc, Group, Ungroup,
  PanelLeftOpen, PanelLeftClose,
  Link2, Mail, Share2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

interface AdvancedCanvasFeaturesProps {
  nodes: Node[];
  connections: Connection[];
  onNodesChange: (nodes: Node[]) => void;
  onConnectionsChange: (connections: Connection[]) => void;
  selectedNode: Node | null;
  onNodeSelect: (node: Node | null) => void;
}

// Search and Filter Component
const SearchAndFilter: React.FC<{
  nodes: Node[];
  onSearchResults: (results: Node[]) => void;
  onFilterChange: (filters: { nodeTypes: string[]; status: string[] }) => void;
}> = ({ nodes, onSearchResults, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<{ nodeTypes: string[]; status: string[] }>({
    nodeTypes: [],
    status: []
  });
  
  const nodeTypes = Array.from(new Set(nodes.map(n => n.type)));
  
  useEffect(() => {
    const filtered = nodes.filter(node => {
      const matchesSearch = searchTerm === '' || 
        node.data?.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTypeFilter = activeFilters.nodeTypes.length === 0 || 
        activeFilters.nodeTypes.includes(node.type);
      
      return matchesSearch && matchesTypeFilter;
    });
    
    onSearchResults(filtered);
  }, [searchTerm, activeFilters, nodes, onSearchResults]);
  
  const toggleTypeFilter = (type: string) => {
    const newTypes = activeFilters.nodeTypes.includes(type)
      ? activeFilters.nodeTypes.filter(t => t !== type)
      : [...activeFilters.nodeTypes, type];
    
    const newFilters = { ...activeFilters, nodeTypes: newTypes };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <Input
          type="text"
          placeholder="البحث في العقد والاتصالات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 text-right"
          dir="rtl"
        />
      </div>
      
      {/* Type Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-foreground-muted" />
          <span className="text-sm font-medium text-foreground">تصفية حسب النوع</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {nodeTypes.map(type => (
            <Button
              key={type}
              variant={activeFilters.nodeTypes.includes(type) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTypeFilter(type)}
              className="text-xs"
            >
              {type.replace('-', ' ')}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Search Results */}
      {searchTerm && (
        <div className="space-y-2">
          <div className="text-sm text-foreground-muted">
            {nodes.filter(n => 
              n.data?.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              n.type.toLowerCase().includes(searchTerm.toLowerCase())
            ).length} نتيجة بحث
          </div>
        </div>
      )}
    </div>
  );
};

// Auto Layout Component
const AutoLayout: React.FC<{
  nodes: Node[];
  connections: Connection[];
  onLayoutApply: (nodes: Node[]) => void;
}> = ({ nodes, connections, onLayoutApply }) => {
  const [layoutType, setLayoutType] = useState<'grid' | 'hierarchy' | 'force' | 'circular'>('hierarchy');
  const [isApplying, setIsApplying] = useState(false);
  
  const applyLayout = useCallback(async () => {
    setIsApplying(true);
    
    // Simulate layout calculation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let newNodes = [...nodes];
    
    switch (layoutType) {
      case 'grid':
        // Grid layout
        const cols = Math.ceil(Math.sqrt(nodes.length));
        newNodes = nodes.map((node, index) => ({
          ...node,
          position: {
            x: (index % cols) * 200 + 100,
            y: Math.floor(index / cols) * 150 + 100
          }
        }));
        break;
        
      case 'hierarchy':
        // Hierarchical layout
        const layers = new Map<string, number>();
        const visited = new Set<string>();
        
        // Find root nodes (no incoming connections)
        const rootNodes = nodes.filter(node => 
          !connections.some(conn => conn.target === node.id)
        );
        
        // BFS to assign layers
        const queue = rootNodes.map(node => ({ node, layer: 0 }));
        rootNodes.forEach(node => layers.set(node.id, 0));
        
        while (queue.length > 0) {
          const { node, layer } = queue.shift()!;
          if (visited.has(node.id)) continue;
          visited.add(node.id);
          
          const children = connections
            .filter(conn => conn.source === node.id)
            .map(conn => nodes.find(n => n.id === conn.target))
            .filter(Boolean) as Node[];
          
          children.forEach(child => {
            if (!layers.has(child.id) || layers.get(child.id)! < layer + 1) {
              layers.set(child.id, layer + 1);
              queue.push({ node: child, layer: layer + 1 });
            }
          });
        }
        
        // Position nodes by layer
        const layerCounts = new Map<number, number>();
        layers.forEach(layer => {
          layerCounts.set(layer, (layerCounts.get(layer) || 0) + 1);
        });
        
        const layerPositions = new Map<number, number>();
        
        newNodes = nodes.map(node => {
          const layer = layers.get(node.id) || 0;
          const currentPos = layerPositions.get(layer) || 0;
          layerPositions.set(layer, currentPos + 1);
          
          const layerCount = layerCounts.get(layer) || 1;
          const centerOffset = (layerCount - 1) * 150 / 2;
          
          return {
            ...node,
            position: {
              x: currentPos * 150 - centerOffset + 400,
              y: layer * 200 + 100
            }
          };
        });
        break;
        
      case 'circular':
        // Circular layout
        const centerX = 400;
        const centerY = 300;
        const radius = Math.max(150, nodes.length * 20);
        
        newNodes = nodes.map((node, index) => {
          const angle = (index / nodes.length) * 2 * Math.PI;
          return {
            ...node,
            position: {
              x: centerX + Math.cos(angle) * radius,
              y: centerY + Math.sin(angle) * radius
            }
          };
        });
        break;
        
      case 'force':
        // Simple force-directed layout simulation
        newNodes = nodes.map((node, index) => ({
          ...node,
          position: {
            x: Math.random() * 800 + 100,
            y: Math.random() * 600 + 100
          }
        }));
        
        // Apply simple force simulation
        for (let iteration = 0; iteration < 50; iteration++) {
          newNodes.forEach((node, i) => {
            let fx = 0, fy = 0;
            
            // Repulsion from other nodes
            newNodes.forEach((otherNode, j) => {
              if (i !== j) {
                const dx = node.position.x - otherNode.position.x;
                const dy = node.position.y - otherNode.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const force = 1000 / (distance * distance);
                fx += (dx / distance) * force;
                fy += (dy / distance) * force;
              }
            });
            
            // Attraction to connected nodes
            connections.forEach(conn => {
              let targetNode = null;
              if (conn.source === node.id) {
                targetNode = newNodes.find(n => n.id === conn.target);
              } else if (conn.target === node.id) {
                targetNode = newNodes.find(n => n.id === conn.source);
              }
              
              if (targetNode) {
                const dx = targetNode.position.x - node.position.x;
                const dy = targetNode.position.y - node.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const force = distance * 0.01;
                fx += (dx / distance) * force;
                fy += (dy / distance) * force;
              }
            });
            
            // Apply damping and update position
            node.position.x += fx * 0.1;
            node.position.y += fy * 0.1;
          });
        }
        break;
    }
    
    setIsApplying(false);
    onLayoutApply(newNodes);
  }, [nodes, connections, layoutType, onLayoutApply]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Grid3X3 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">التخطيط التلقائي</span>
      </div>
      
      <Select value={layoutType} onValueChange={(value: any) => setLayoutType(value)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hierarchy">تخطيط هرمي</SelectItem>
          <SelectItem value="grid">تخطيط شبكي</SelectItem>
          <SelectItem value="circular">تخطيط دائري</SelectItem>
          <SelectItem value="force">تخطيط قوى</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        onClick={applyLayout} 
        disabled={isApplying} 
        className="w-full btn-primary"
      >
        {isApplying ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            جاري التطبيق...
          </>
        ) : (
          <>
            <Move className="w-4 h-4 mr-2" />
            تطبيق التخطيط
          </>
        )}
      </Button>
      
      {isApplying && (
        <div className="space-y-2">
          <div className="text-xs text-foreground-muted">جاري حساب المواضع...</div>
          <Progress value={66} className="h-1" />
        </div>
      )}
    </div>
  );
};

// Advanced Canvas Features Main Component
const AdvancedCanvasFeatures: React.FC<AdvancedCanvasFeaturesProps> = ({
  nodes,
  connections,
  onNodesChange,
  onConnectionsChange,
  zoomLevel,
  onZoomChange,
  selectedNode,
  onNodeSelect
}) => {
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showLayoutPanel, setShowLayoutPanel] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [searchResults, setSearchResults] = useState<Node[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  
  const handleSearchResults = useCallback((results: Node[]) => {
    setSearchResults(results);
    // Highlight searched nodes
    const resultIds = new Set(results.map(n => n.id));
    setHighlightedNodes(resultIds);
  }, []);
  
  const handleFilterChange = useCallback((filters: { nodeTypes: string[]; status: string[] }) => {
    // Apply visual filters to canvas
    const filteredNodes = nodes.filter(node => {
      if (filters.nodeTypes.length > 0 && !filters.nodeTypes.includes(node.type)) {
        return false;
      }
      return true;
    });
    
    const filteredIds = new Set(filteredNodes.map(n => n.id));
    setHighlightedNodes(filteredIds);
  }, [nodes]);
  
  const handleLayoutApply = useCallback((newNodes: Node[]) => {
    onNodesChange(newNodes);
    // Add toast notification
    setTimeout(() => {
      const event = new CustomEvent('canvas-layout-applied', { detail: { nodeCount: newNodes.length } });
      window.dispatchEvent(event);
    }, 100);
  }, [onNodesChange]);
  
  // Clear highlighting when search is cleared
  useEffect(() => {
    if (searchResults.length === 0) {
      setHighlightedNodes(new Set());
    }
  }, [searchResults]);
  
  return (
    <div className="relative">
      {/* Advanced Canvas Controls - Moved to Toolbar */}
      
      {/* Search Panel */}
      <AnimatePresence>
        {showSearchPanel && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-32 left-4 z-40 w-80 glass-medium rounded-xl border border-border-strong p-4"
            style={{ backgroundColor: 'var(--background-elevated)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">البحث والتصفية</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearchPanel(false)}
                className="h-6 w-6 p-0"
              >
                <PanelLeftClose className="w-3 h-3" />
              </Button>
            </div>
            
            <SearchAndFilter
              nodes={nodes}
              onSearchResults={handleSearchResults}
              onFilterChange={handleFilterChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Layout Panel */}
      <AnimatePresence>
        {showLayoutPanel && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-64 left-4 z-40 w-80 glass-medium rounded-xl border border-border-strong p-4"
            style={{ backgroundColor: 'var(--background-elevated)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">التخطيط التلقائي</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLayoutPanel(false)}
                className="h-6 w-6 p-0"
              >
                <PanelLeftClose className="w-3 h-3" />
              </Button>
            </div>
            
            <AutoLayout
              nodes={nodes}
              connections={connections}
              onLayoutApply={handleLayoutApply}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Collaboration Panel */}
      <AnimatePresence>
        {showCollaborationPanel && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-96 left-4 z-40 w-80 glass-medium rounded-xl border border-border-strong p-4"
            style={{ backgroundColor: 'var(--background-elevated)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">التعاون والتعليقات</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCollaborationPanel(false)}
                className="h-6 w-6 p-0"
              >
                <PanelLeftClose className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Active Users */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">المتصلون الآن</span>
                </div>
                <div className="flex -space-x-2">
                  {[
                    { name: 'أحمد', color: 'bg-blue-500' },
                    { name: 'فاطمة', color: 'bg-green-500' },
                    { name: 'محمد', color: 'bg-purple-500' },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-medium border-2 border-background`}
                      title={user.name}
                    >
                      {user.name.charAt(0)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                    +2
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Recent Comments */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">التعليقات الأخيرة</span>
                </div>
                <div className="space-y-3 max-h-32 overflow-y-auto">
                  {[
                    { user: 'أحمد', comment: 'هذا التخطيط يحتاج تحسين', time: 'منذ 5 دقائق', nodeType: 'webhook-trigger' },
                    { user: 'فاطمة', comment: 'تم إضافة شرط جديد', time: 'منذ 12 دقيقة', nodeType: 'condition' },
                  ].map((comment, index) => (
                    <div key={index} className="p-2 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{comment.user}</span>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{comment.comment}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-xs text-muted-foreground">{comment.nodeType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Share Options */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">مشاركة سير العمل</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Link2 className="w-3 h-3 mr-1" />
                    نسخ الرابط
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Mail className="w-3 h-3 mr-1" />
                    إرسال بريد
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { AdvancedCanvasFeatures };