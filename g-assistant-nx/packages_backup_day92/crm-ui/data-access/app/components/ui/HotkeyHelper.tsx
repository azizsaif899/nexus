'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Keyboard } from 'lucide-react';
import { systemHotkeys, useHotkeys } from '../../hooks/useHotkeys';

export function HotkeyHelper() {
  const [isOpen, setIsOpen] = useState(false);
  
  const { formatHotkey } = useHotkeys([
    {
      key: '?',
      action: () => setIsOpen(true),
      description: 'عرض دليل الاختصارات'
    }
  ]);

  const groupedHotkeys = systemHotkeys.reduce((groups, hotkey) => {
    const category = hotkey.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(hotkey);
    return groups;
  }, {} as Record<string, typeof systemHotkeys>);

  const categoryLabels = {
    navigation: 'التنقل',
    create: 'الإنشاء',
    actions: 'الإجراءات',
    selection: 'التحديد',
    help: 'المساعدة',
    other: 'أخرى'
  };

  return (
    <>
      {/* زر المساعدة */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-30 flex items-center justify-center"
        title="دليل الاختصارات (?)"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {/* نافذة دليل الاختصارات */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* رأس النافذة */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Keyboard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      دليل اختصارات لوحة المفاتيح
                    </h2>
                    <p className="text-sm text-gray-600">
                      اختصارات لتسريع عملك وزيادة الإنتاجية
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* محتوى النافذة */}
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="grid gap-6">
                  {Object.entries(groupedHotkeys).map(([category, hotkeys]) => (
                    <div key={category}>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        {categoryLabels[category as keyof typeof categoryLabels] || category}
                      </h3>
                      
                      <div className="space-y-2">
                        {hotkeys.map((hotkey, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-gray-700">
                              {hotkey.description}
                            </span>
                            
                            <div className="flex items-center space-x-1">
                              {formatHotkey(hotkey).split(' + ').map((key, keyIndex) => (
                                <span key={keyIndex} className="flex items-center">
                                  <kbd className="px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm font-mono">
                                    {key}
                                  </kbd>
                                  {keyIndex < formatHotkey(hotkey).split(' + ').length - 1 && (
                                    <span className="mx-1 text-gray-400">+</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* تذييل النافذة */}
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>اضغط على ? في أي وقت لعرض هذا الدليل</span>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-white border rounded text-xs">Esc</kbd>
                    <span className="mr-2">للإغلاق</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}