'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command } from 'lucide-react';

interface Command {
  id: string;
  title: string;
  description: string;
  action: () => void;
  shortcut?: string;
}

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const commands: Command[] = [
    {
      id: 'new-lead',
      title: 'إضافة عميل محتمل جديد',
      description: 'إنشاء فرصة بيع جديدة',
      action: () => // Removed console.log,
      shortcut: 'N'
    },
    {
      id: 'view-pipeline',
      title: 'عرض خط الأنابيب',
      description: 'فتح لوحة كانبان للمبيعات',
      action: () => // Removed console.log,
      shortcut: 'P'
    },
    {
      id: 'daily-report',
      title: 'التقرير اليومي',
      description: 'عرض ملخص أداء اليوم',
      action: () => // Removed console.log,
      shortcut: 'R'
    },
    {
      id: 'search-customer',
      title: 'البحث عن عميل',
      description: 'البحث في قاعدة بيانات العملاء',
      action: () => // Removed console.log,
      shortcut: 'S'
    }
  ];

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 command-bar"
          >
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Command className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن أمر أو اكتب للبحث..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                  autoFocus
                />
              </div>
              
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {filteredCommands.map((command, index) => (
                  <motion.div
                    key={command.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => {
                      command.action();
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {command.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {command.description}
                      </div>
                    </div>
                    {command.shortcut && (
                      <kbd className="px-2 py-1 text-xs bg-gray-200 rounded">
                        {command.shortcut}
                      </kbd>
                    )}
                  </motion.div>
                ))}
                
                {filteredCommands.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    لا توجد نتائج للبحث "{query}"
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}