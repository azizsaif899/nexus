'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail, Tag, Download, X, AlertTriangle } from 'lucide-react';
import { BulkAction, useBulkActions } from '../../hooks/useBulkActions';

const bulkActions: BulkAction[] = [
  {
    id: 'delete',
    label: 'حذف',
    icon: '🗑️',
    description: 'حذف العناصر المحددة',
    requiresConfirmation: true,
    confirmationMessage: 'هل أنت متأكد من حذف العناصر المحددة؟ لا يمكن التراجع عن هذا الإجراء.',
    execute: async (ids) => {
      // Removed console.log
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  },
  {
    id: 'email',
    label: 'إرسال بريد',
    icon: '📧',
    description: 'إرسال بريد إلكتروني للعناصر المحددة',
    execute: async (ids) => {
      // Removed console.log
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  },
  {
    id: 'tag',
    label: 'إضافة علامة',
    icon: '🏷️',
    description: 'إضافة علامة للعناصر المحددة',
    execute: async (ids) => {
      // Removed console.log
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
  {
    id: 'export',
    label: 'تصدير',
    icon: '📤',
    description: 'تصدير العناصر المحددة',
    execute: async (ids) => {
      // Removed console.log
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
];

interface BulkActionPanelProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export function BulkActionPanel({ selectedCount, onClearSelection }: BulkActionPanelProps) {
  const {
    isExecuting,
    showConfirmation,
    pendingAction,
    executeAction,
    confirmAction,
    cancelAction
  } = useBulkActions();

  if (selectedCount === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="bg-white rounded-lg shadow-2xl border p-4 min-w-96">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">{selectedCount}</span>
                </div>
                <span className="font-medium text-gray-900">
                  {selectedCount} عنصر محدد
                </span>
              </div>
              
              <button
                onClick={onClearSelection}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="إلغاء التحديد"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {bulkActions.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => executeAction(action)}
                  disabled={isExecuting}
                  className="flex items-center space-x-2 p-3 rounded-md border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={action.description}
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {isExecuting && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">جاري التنفيذ...</span>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* نافذة التأكيد */}
      <AnimatePresence>
        {showConfirmation && pendingAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl p-6 max-w-md mx-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  تأكيد الإجراء
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {pendingAction.confirmationMessage}
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={cancelAction}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmAction}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  تأكيد
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}