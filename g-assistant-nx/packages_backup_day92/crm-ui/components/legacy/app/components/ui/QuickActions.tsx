'use client';

import { motion } from 'framer-motion';
import { Plus, Search, Mail, Phone, FileText, Calendar } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
  color?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'new-lead',
    label: 'عميل جديد',
    icon: <Plus className="w-4 h-4" />,
    action: () => console.log('Creating new lead'),
    shortcut: 'Ctrl+N',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'search',
    label: 'بحث سريع',
    icon: <Search className="w-4 h-4" />,
    action: () => console.log('Quick search'),
    shortcut: 'Ctrl+F',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'send-email',
    label: 'إرسال بريد',
    icon: <Mail className="w-4 h-4" />,
    action: () => console.log('Send email'),
    shortcut: 'Ctrl+E',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'make-call',
    label: 'مكالمة',
    icon: <Phone className="w-4 h-4" />,
    action: () => console.log('Make call'),
    shortcut: 'Ctrl+P',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    id: 'new-note',
    label: 'ملاحظة',
    icon: <FileText className="w-4 h-4" />,
    action: () => console.log('New note'),
    shortcut: 'Ctrl+T',
    color: 'bg-gray-500 hover:bg-gray-600'
  },
  {
    id: 'schedule',
    label: 'جدولة',
    icon: <Calendar className="w-4 h-4" />,
    action: () => console.log('Schedule meeting'),
    shortcut: 'Ctrl+M',
    color: 'bg-red-500 hover:bg-red-600'
  }
];

interface QuickActionsProps {
  className?: string;
  compact?: boolean;
}

export function QuickActions({ className = '', compact = false }: QuickActionsProps) {
  return (
    <div className={`${className}`}>
      <div className={`grid ${compact ? 'grid-cols-3 gap-2' : 'grid-cols-2 md:grid-cols-3 gap-3'}`}>
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className={`${action.color || 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg p-3 transition-all duration-200 shadow-sm hover:shadow-md`}
            title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
          >
            <div className="flex flex-col items-center space-y-2">
              {action.icon}
              <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
                {action.label}
              </span>
              {!compact && action.shortcut && (
                <kbd className="px-1.5 py-0.5 text-xs bg-white/20 rounded">
                  {action.shortcut}
                </kbd>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}