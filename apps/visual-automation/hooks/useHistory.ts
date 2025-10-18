import { useState, useCallback, useRef } from 'react';

export interface HistoryState {
  nodes: any[];
  connections: any[];
}

interface HistoryOptions {
  maxSize?: number;
}

export function useHistory(options: HistoryOptions = {}) {
  const { maxSize = 50 } = options;
  
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isUpdating = useRef(false);
  
  // Add state to history
  const pushState = useCallback((state: HistoryState) => {
    if (isUpdating.current) return;
    
    setHistory(prev => {
      // Remove all states after current index
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push({
        nodes: JSON.parse(JSON.stringify(state.nodes)),
        connections: JSON.parse(JSON.stringify(state.connections))
      });
      
      // Keep only last maxSize states
      if (newHistory.length > maxSize) {
        newHistory.shift();
        setCurrentIndex(maxSize - 1);
      } else {
        setCurrentIndex(newHistory.length - 1);
      }
      
      return newHistory;
    });
  }, [currentIndex, maxSize]);
  
  // Undo
  const undo = useCallback((): HistoryState | null => {
    if (currentIndex <= 0) return null;
    
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [currentIndex, history]);
  
  // Redo
  const redo = useCallback((): HistoryState | null => {
    if (currentIndex >= history.length - 1) return null;
    
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [currentIndex, history]);
  
  // Can undo/redo
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  
  // Clear history
  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);
  
  // Set updating flag
  const setUpdating = useCallback((value: boolean) => {
    isUpdating.current = value;
  }, []);
  
  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    setUpdating,
    historySize: history.length,
    currentIndex
  };
}
