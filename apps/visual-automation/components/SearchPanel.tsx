import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  onNodeSelect: (nodeId: string) => void;
  onNodeHighlight: (nodeId: string | null) => void;
}

export function SearchPanel({
  isOpen,
  onClose,
  nodes,
  onNodeSelect,
  onNodeHighlight
}: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique node types
  const nodeTypes = useMemo(() => {
    const types = new Set(nodes.map(n => n.type));
    return Array.from(types);
  }, [nodes]);
  
  // Filter and search nodes
  const filteredNodes = useMemo(() => {
    let filtered = nodes;
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }
    
    // Search by name or type
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.type.toLowerCase().includes(query) ||
        n.data?.label?.toLowerCase().includes(query) ||
        n.id.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [nodes, filterType, searchQuery]);
  
  // Clear search on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setFilterType('all');
      onNodeHighlight(null);
    }
  }, [isOpen, onNodeHighlight]);
  
  const handleNodeClick = (nodeId: string) => {
    onNodeSelect(nodeId);
    onClose();
  };
  
  const handleNodeHover = (nodeId: string | null) => {
    onNodeHighlight(nodeId);
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9997] bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998] glass-intense rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-foreground-muted" />
            <Input
              id="search-nodes-input"
              name="search"
              type="search"
              placeholder="ابحث في العقد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
              aria-label="البحث في العقد"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              تصفية
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-border"
              >
                <div className="p-4 flex flex-wrap gap-2">
                  <Badge
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilterType('all')}
                  >
                    الكل ({nodes.length})
                  </Badge>
                  {nodeTypes.map(type => (
                    <Badge
                      key={type}
                      variant={filterType === type ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFilterType(type)}
                    >
                      {type} ({nodes.filter(n => n.type === type).length})
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNodes.length === 0 ? (
              <div className="text-center py-12 text-foreground-muted">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">لا توجد نتائج</p>
                {searchQuery && (
                  <p className="text-xs mt-1">جرب مصطلحات بحث أخرى</p>
                )}
              </div>
            ) : (
              <div className="p-2">
                {filteredNodes.map((node, idx) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-3 rounded-lg hover:bg-hover-bg cursor-pointer transition-colors mb-1"
                    onClick={() => handleNodeClick(node.id)}
                    onMouseEnter={() => handleNodeHover(node.id)}
                    onMouseLeave={() => handleNodeHover(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">
                            {node.data?.label || node.type}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {node.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-foreground-muted font-mono">
                          ID: {node.id}
                        </p>
                      </div>
                      <div className="text-xs text-foreground-muted">
                        ({node.position.x.toFixed(0)}, {node.position.y.toFixed(0)})
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {filteredNodes.length > 0 && (
            <div className="p-3 border-t border-border bg-background-muted/50 rounded-b-2xl">
              <div className="flex items-center justify-between text-xs text-foreground-muted">
                <span>عرض {filteredNodes.length} من {nodes.length} عقدة</span>
                <span className="font-mono">اضغط Enter للاختيار</span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
