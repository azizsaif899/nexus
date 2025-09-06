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
    action: () => // Removed console.log,
    description: 'فتح شريط الأوامر',
    category: 'navigation'
  },
  {
    key: 'n',
    ctrlKey: true,
    action: () => // Removed console.log,
    description: 'إنشاء عنصر جديد',
    category: 'create'
  },
  {
    key: 'f',
    ctrlKey: true,
    action: () => // Removed console.log,
    description: 'البحث',
    category: 'navigation'
  },
  {
    key: 's',
    ctrlKey: true,
    action: () => // Removed console.log,
    description: 'حفظ',
    category: 'actions'
  },
  {
    key: 'z',
    ctrlKey: true,
    action: () => // Removed console.log,
    description: 'تراجع',
    category: 'actions'
  },
  {
    key: 'y',
    ctrlKey: true,
    action: () => // Removed console.log,
    description: 'إعادة',
    category: 'actions'
  },
  {
    key: 'a',
    ctrlKey: true,
    action: () => // Removed console.log,
    description: 'تحديد الكل',
    category: 'selection'
  },
  {
    key: 'Escape',
    action: () => // Removed console.log,
    description: 'إلغاء/إغلاق',
    category: 'navigation'
  },
  {
    key: '?',
    action: () => // Removed console.log,
    description: 'عرض المساعدة',
    category: 'help'
  }
];