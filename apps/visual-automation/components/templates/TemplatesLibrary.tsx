import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Filter, 
  TrendingUp, 
  Star,
  Grid3x3,
  List,
  Download,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { TemplateCard } from './TemplateCard';
import { TemplatePreview } from './TemplatePreview';
import { 
  allTemplates, 
  getPopularTemplates, 
  getTopRatedTemplates, 
  searchTemplates,
  WorkflowTemplate 
} from '../../data/templates';

interface TemplatesLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: (template: WorkflowTemplate) => void;
}

export function TemplatesLibrary({ isOpen, onClose, onInstall }: TemplatesLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent'>('popular');
  const [previewTemplate, setPreviewTemplate] = useState<WorkflowTemplate | null>(null);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let templates = searchQuery 
      ? searchTemplates(searchQuery)
      : allTemplates;

    // Filter by category
    if (selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      templates = templates.filter(t => t.difficulty === selectedDifficulty);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        templates = [...templates].sort((a, b) => b.usageCount - a.usageCount);
        break;
      case 'rating':
        templates = [...templates].sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
        templates = [...templates].sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
    }

    return templates;
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const categories = [
    { value: 'all', label: 'الكل', count: allTemplates.length },
    { value: 'business', label: 'أعمال', count: allTemplates.filter(t => t.category === 'business').length },
    { value: 'marketing', label: 'تسويق', count: allTemplates.filter(t => t.category === 'marketing').length },
    { value: 'development', label: 'تطوير', count: allTemplates.filter(t => t.category === 'development').length },
    { value: 'automation', label: 'أتمتة', count: allTemplates.filter(t => t.category === 'automation').length },
    { value: 'data', label: 'بيانات', count: allTemplates.filter(t => t.category === 'data').length },
    { value: 'integration', label: 'تكامل', count: allTemplates.filter(t => t.category === 'integration').length }
  ];

  const difficulties = [
    { value: 'all', label: 'جميع المستويات' },
    { value: 'beginner', label: 'مبتدئ' },
    { value: 'intermediate', label: 'متوسط' },
    { value: 'advanced', label: 'متقدم' }
  ];

  const popularTemplates = getPopularTemplates(3);
  const topRatedTemplates = getTopRatedTemplates(3);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9997] bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 z-[9998] glass-intense rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg glass-medium flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-h2 font-semibold text-foreground">
                    مكتبة القوالب
                  </h2>
                  <p className="text-sm text-foreground-muted">
                    قوالب جاهزة لتسريع عملك
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 glass-subtle rounded-lg p-1">
                  <Button
                    variant={viewLayout === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setViewLayout('grid')}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewLayout === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setViewLayout('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="p-6 border-b border-border space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  id="search-templates-input"
                  name="searchTemplates"
                  type="search"
                  placeholder="ابحث عن قالب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  aria-label="البحث عن القوالب"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.label} ({cat.count})
                  </Button>
                ))}
              </div>

              {/* Difficulty & Sort */}
              <div className="flex items-center gap-3">
                <div className="flex-1 flex gap-2">
                  {difficulties.map(diff => (
                    <Button
                      key={diff.value}
                      variant={selectedDifficulty === diff.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(diff.value)}
                    >
                      {diff.label}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'popular' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('popular')}
                    className="gap-1"
                  >
                    <TrendingUp className="w-3 h-3" />
                    شائع
                  </Button>
                  <Button
                    variant={sortBy === 'rating' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('rating')}
                    className="gap-1"
                  >
                    <Star className="w-3 h-3" />
                    الأعلى تقييماً
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Quick Picks */}
              {!searchQuery && selectedCategory === 'all' && selectedDifficulty === 'all' && (
                <div className="mb-8">
                  <h3 className="text-h3 font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    الأكثر شعبية
                  </h3>
                  <div className={`grid ${viewLayout === 'grid' ? 'grid-cols-3' : 'grid-cols-1'} gap-4 mb-6`}>
                    {popularTemplates.map(template => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onPreview={setPreviewTemplate}
                        onInstall={onInstall}
                      />
                    ))}
                  </div>

                  <h3 className="text-h3 font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning" />
                    الأعلى تقييماً
                  </h3>
                  <div className={`grid ${viewLayout === 'grid' ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}>
                    {topRatedTemplates.map(template => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onPreview={setPreviewTemplate}
                        onInstall={onInstall}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Filtered Results */}
              {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-h3 font-semibold text-foreground">
                      النتائج ({filteredTemplates.length})
                    </h3>
                    {filteredTemplates.length === 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSelectedDifficulty('all');
                        }}
                      >
                        إعادة تعيين الفلاتر
                      </Button>
                    )}
                  </div>

                  {filteredTemplates.length === 0 ? (
                    <div className="text-center py-12">
                      <Filter className="w-12 h-12 mx-auto mb-3 text-foreground-muted opacity-50" />
                      <p className="text-foreground-muted">لا توجد قوالب مطابقة</p>
                      <p className="text-sm text-foreground-muted mt-1">جرب تغيير معايير البحث</p>
                    </div>
                  ) : (
                    <div className={`grid ${viewLayout === 'grid' ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}>
                      {filteredTemplates.map(template => (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          onPreview={setPreviewTemplate}
                          onInstall={onInstall}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-background-muted/50">
              <div className="flex items-center gap-4 text-sm text-foreground-muted">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span>{allTemplates.length} قالب</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{allTemplates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString()} تثبيت</span>
                </div>
              </div>
              <p className="text-xs text-foreground-muted">
                تم التحديث اليوم
              </p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Preview Modal */}
      <TemplatePreview
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onInstall={onInstall}
      />
    </>
  );
}
