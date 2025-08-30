'use client';

import { useState, useCallback, useEffect } from 'react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
  shortcut?: string;
  submenu?: ContextMenuItem[];
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export function useContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const [items, setItems] = useState<ContextMenuItem[]>([]);

  const showContextMenu = useCallback((
    event: React.MouseEvent,
    menuItems: ContextMenuItem[]
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setItems(menuItems);
    setPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
  }, []);

  const hideContextMenu = useCallback(() => {
    setIsOpen(false);
    setItems([]);
  }, []);

  const executeAction = useCallback((item: ContextMenuItem) => {
    if (!item.disabled && item.action) {
      item.action();
      hideContextMenu();
    }
  }, [hideContextMenu]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        hideContextMenu();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        hideContextMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, hideContextMenu]);

  return {
    isOpen,
    position,
    items,
    showContextMenu,
    hideContextMenu,
    executeAction
  };
}