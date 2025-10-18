import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Shortcut {
  keys: string;
  description: string;
  category: string;
}

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const shortcuts: Shortcut[] = [
    // Canvas Controls
    { keys: 'Scroll', description: 'تكبير/تصغير', category: 'التحكم بالكانفا' },
    { keys: 'Ctrl + Scroll', description: 'تكبير/تصغير (بديل)', category: 'التحكم بالكانفا' },
    { keys: 'Middle Mouse + Drag', description: 'تحريك الكانفا', category: 'التحكم بالكانفا' },
    { keys: 'Space + Drag', description: 'تحريك الكانفا (بديل)', category: 'التحكم بالكانفا' },
    { keys: '=', description: 'إعادة تعيين الزوم', category: 'التحكم بالكانفا' },
    { keys: '+', description: 'تكبير', category: 'التحكم بالكانفا' },
    { keys: '-', description: 'تصغير', category: 'التحكم بالكانفا' },
    
    // File Operations
    { keys: 'Ctrl + S', description: 'حفظ سير العمل', category: 'العمليات' },
    { keys: 'Ctrl + O', description: 'فتح سير عمل', category: 'العمليات' },
    { keys: 'Ctrl + E', description: 'تصدير', category: 'العمليات' },
    
    // Editing
    { keys: 'Ctrl + Z', description: 'تراجع', category: 'التحرير' },
    { keys: 'Ctrl + Y', description: 'إعادة', category: 'التحرير' },
    { keys: 'Ctrl + D', description: 'نسخ العقدة', category: 'التحرير' },
    { keys: 'Delete', description: 'حذف العقدة المحددة', category: 'التحرير' },
    { keys: 'Ctrl + A', description: 'تحديد الكل', category: 'التحرير' },
    { keys: 'Esc', description: 'إلغاء التحديد', category: 'التحرير' },
    
    // Search & Navigation
    { keys: 'Ctrl + F', description: 'بحث في العقد', category: 'البحث والتنقل' },
    { keys: 'Ctrl + Shift + A', description: 'لوحة التحليلات', category: 'البحث والتنقل' },
    { keys: '?', description: 'عرض الاختصارات', category: 'البحث والتنقل' },
    
    // Workflow
    { keys: 'Ctrl + R', description: 'تشغيل سير العمل', category: 'سير العمل' },
    { keys: 'Ctrl + .', description: 'إيقاف سير العمل', category: 'سير العمل' },
    { keys: 'Ctrl + P', description: 'معاينة', category: 'سير العمل' },
    { keys: 'Ctrl + L', description: 'ترتيب تلقائي', category: 'سير العمل' },
  ];
  
  const categories = Array.from(new Set(shortcuts.map(s => s.category)));
  
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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9998] glass-intense rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg glass-medium flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-h2 font-semibold text-foreground">
                  اختصارات لوحة المفاتيح
                </h2>
                <p className="text-sm text-foreground-muted">
                  جميع الاختصارات المتاحة للوصول السريع
                </p>
              </div>
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
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-h3 font-semibold text-foreground mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {shortcuts
                      .filter(s => s.category === category)
                      .map((shortcut, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className="flex items-center justify-between p-3 rounded-lg glass-subtle hover:glass-medium transition-all"
                        >
                          <span className="text-sm text-foreground-secondary">
                            {shortcut.description}
                          </span>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs bg-background-muted"
                          >
                            {shortcut.keys}
                          </Badge>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-border bg-background-muted/50 rounded-b-2xl">
            <p className="text-xs text-foreground-muted text-center">
              اضغط <kbd className="px-2 py-1 rounded bg-background text-foreground font-mono text-xs">?</kbd> في أي وقت لعرض هذه القائمة
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
