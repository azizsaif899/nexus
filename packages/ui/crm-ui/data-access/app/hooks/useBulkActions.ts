'use client';

import { useState, useCallback } from 'react';

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  execute: (selectedIds: string[]) => Promise<void>;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export function useBulkActions() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isExecuting, setIsExecuting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedItems(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const executeAction = useCallback(async (action: BulkAction) => {
    if (selectedItems.size === 0) return;

    if (action.requiresConfirmation) {
      setPendingAction(action);
      setShowConfirmation(true);
      return;
    }

    setIsExecuting(true);
    try {
      await action.execute(Array.from(selectedItems));
      clearSelection();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [selectedItems, clearSelection]);

  const confirmAction = useCallback(async () => {
    if (!pendingAction) return;

    setShowConfirmation(false);
    setIsExecuting(true);
    
    try {
      await pendingAction.execute(Array.from(selectedItems));
      clearSelection();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsExecuting(false);
      setPendingAction(null);
    }
  }, [pendingAction, selectedItems, clearSelection]);

  const cancelAction = useCallback(() => {
    setShowConfirmation(false);
    setPendingAction(null);
  }, []);

  return {
    selectedItems,
    selectedCount: selectedItems.size,
    isExecuting,
    showConfirmation,
    pendingAction,
    toggleSelection,
    selectAll,
    clearSelection,
    executeAction,
    confirmAction,
    cancelAction,
    isSelected: (id: string) => selectedItems.has(id)
  };
}