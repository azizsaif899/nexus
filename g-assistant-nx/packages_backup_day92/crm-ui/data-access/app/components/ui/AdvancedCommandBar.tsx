'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Command, Search, Clock, Zap } from 'lucide-react';
import { useAdvancedCommands } from '../../hooks/useAdvancedCommands';

export function AdvancedCommandBar() {
  const {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    filteredCommands,
    selectedIndex,
    executeCommand,
    executeSelectedCommand
  } = useAdvancedCommands();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-32"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="command-bar w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg shadow-2xl border overflow-hidden">
            {/* شريط البحث */}
            <div className="flex items-center px-4 py-3 border-b">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="ابحث عن أمر أو اكتب للبحث..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-lg"
                autoFocus
              />
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <kbd className="px-2 py-1 bg-gray-100 rounded">↑↓</kbd>
                <span>للتنقل</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd>
                <span>للتنفيذ</span>
              </div>
            </div>

            {/* قائمة الأوامر */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Command className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد أوامر تطابق البحث "{query}"</p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredCommands.map((command, index) => (
                    <motion.div
                      key={command.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                        index === selectedIndex
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => executeCommand(command)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{command.icon || '⚡'}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {command.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {command.description}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {command.shortcut && (
                          <kbd className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-600">
                            {command.shortcut}
                          </kbd>
                        )}
                        <div className="text-xs text-gray-400 capitalize">
                          {getCategoryLabel(command.category)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* تلميحات سفلية */}
            <div className="px-4 py-2 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>التاريخ الأخير</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>الأكثر استخداماً</span>
                  </div>
                </div>
                <div>
                  {filteredCommands.length} أمر متاح
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getCategoryLabel(category: string): string {
  const labels = {
    navigation: 'تنقل',
    create: 'إنشاء',
    search: 'بحث',
    actions: 'إجراءات',
    settings: 'إعدادات',
    help: 'مساعدة'
  };
  return labels[category as keyof typeof labels] || category;
}