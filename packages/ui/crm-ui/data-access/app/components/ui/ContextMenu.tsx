'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { ContextMenuItem, ContextMenuPosition } from '../../hooks/useContextMenu';

interface ContextMenuProps {
  isOpen: boolean;
  position: ContextMenuPosition;
  items: ContextMenuItem[];
  onItemClick: (item: ContextMenuItem) => void;
  onClose: () => void;
}

export function ContextMenu({ 
  isOpen, 
  position, 
  items, 
  onItemClick, 
  onClose 
}: ContextMenuProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed z-50 bg-white rounded-lg shadow-2xl border py-2 min-w-48"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(0, 0)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item, index) => (
          <div key={item.id || index}>
            {item.separator ? (
              <div className="h-px bg-gray-200 my-1 mx-2" />
            ) : (
              <motion.button
                whileHover={{ backgroundColor: '#f3f4f6' }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                  item.disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onItemClick(item)}
                disabled={item.disabled}
              >
                <div className="flex items-center space-x-2">
                  {item.icon && (
                    <span className="text-base">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.shortcut && (
                    <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded">
                      {item.shortcut}
                    </kbd>
                  )}
                  {item.submenu && (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </motion.button>
            )}
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}