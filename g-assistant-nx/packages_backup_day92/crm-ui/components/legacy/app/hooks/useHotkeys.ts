'use client';

import { useEffect, useCallback } from 'react';

export interface Hotkey {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

export function useHotkeys(hotkeys: Hotkey[], enabled = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const matchingHotkey = hotkeys.find(hotkey => {
      return (
        hotkey.key.toLowerCase() === event.key.toLowerCase() &&
        !!hotkey.ctrlKey === event.ctrlKey &&
        !!hotkey.altKey === event.altKey &&
        !!hotkey.shiftKey === event.shiftKey &&
        !!hotkey.metaKey === event.metaKey
      );
    });

    if (matchingHotkey) {
      event.preventDefault();
      matchingHotkey.action();
    }
  }, [hotkeys, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  const formatHotkey = useCallback((hotkey: Hotkey): string => {
    const parts: string[] = [];
    
    if (hotkey.ctrlKey) parts.push('Ctrl');
    if (hotkey.altKey) parts.push('Alt');
    if (hotkey.shiftKey) parts.push('Shift');
    if (hotkey.metaKey) parts.push('Cmd');
    
    parts.push(hotkey.key.toUpperCase());
    
    return parts.join(' + ');
  }, []);

  return { formatHotkey };
}

// اختصارات النظام الأساسية
export const systemHotkeys: Hotkey[] = [
  {
    key: 'k',
    ctrlKey: true,
    action: () => console.log('Open command bar'),
    description: 'فتح شريط الأوامر',
    category: 'navigation'
  },
  {
    key: 'n',
    ctrlKey: true,
    action: () => console.log('Create new item'),
    description: 'إنشاء عنصر جديد',
    category: 'create'
  },
  {
    key: 'f',
    ctrlKey: true,
    action: () => console.log('Search'),
    description: 'البحث',
    category: 'navigation'
  },
  {
    key: 's',
    ctrlKey: true,
    action: () => console.log('Save'),
    description: 'حفظ',
    category: 'actions'
  },
  {
    key: 'z',
    ctrlKey: true,
    action: () => console.log('Undo'),
    description: 'تراجع',
    category: 'actions'
  },
  {
    key: 'y',
    ctrlKey: true,
    action: () => console.log('Redo'),
    description: 'إعادة',
    category: 'actions'
  },
  {
    key: 'a',
    ctrlKey: true,
    action: () => console.log('Select all'),
    description: 'تحديد الكل',
    category: 'selection'
  },
  {
    key: 'Escape',
    action: () => console.log('Cancel/Close'),
    description: 'إلغاء/إغلاق',
    category: 'navigation'
  },
  {
    key: '?',
    action: () => console.log('Show help'),
    description: 'عرض المساعدة',
    category: 'help'
  }
];