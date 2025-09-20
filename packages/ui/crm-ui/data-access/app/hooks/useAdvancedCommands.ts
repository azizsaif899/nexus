'use client';

import { useState, useEffect, useCallback } from 'react';
import { Command, CommandHistory } from '../types/commands';
import { commandRegistry } from '../lib/command-registry';

export function useAdvancedCommands() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [history, setHistory] = useState<CommandHistory[]>([]);

  // البحث في الأوامر
  useEffect(() => {
    if (query.trim()) {
      const results = commandRegistry.search(query);
      setFilteredCommands(results);
      setSelectedIndex(0);
    } else {
      // عرض الأوامر الأكثر استخداماً
      const recentCommands = getRecentCommands();
      setFilteredCommands(recentCommands);
    }
  }, [query]);

  // اختصارات لوحة المفاتيح
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

      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
        }
        
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
        }
        
        if (e.key === 'Enter') {
          e.preventDefault();
          executeSelectedCommand();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  const executeSelectedCommand = useCallback(() => {
    const command = filteredCommands[selectedIndex];
    if (command) {
      executeCommand(command);
    }
  }, [filteredCommands, selectedIndex]);

  const executeCommand = useCallback((command: Command) => {
    // تنفيذ الأمر
    commandRegistry.execute(command.id);
    
    // إضافة إلى التاريخ
    const historyEntry: CommandHistory = {
      commandId: command.id,
      timestamp: new Date()
    };
    setHistory(prev => [historyEntry, ...prev.slice(0, 49)]); // الاحتفاظ بآخر 50 أمر
    
    // إغلاق شريط الأوامر
    setIsOpen(false);
    setQuery('');
  }, []);

  const getRecentCommands = useCallback((): Command[] => {
    const recentIds = history.slice(0, 5).map(h => h.commandId);
    const recentCommands = recentIds
      .map(id => commandRegistry.getAll().find(cmd => cmd.id === id))
      .filter(Boolean) as Command[];
    
    // إضافة أوامر شائعة إذا لم يكن هناك تاريخ كافي
    const allCommands = commandRegistry.getAll();
    const popularCommands = allCommands
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);
    
    return [...recentCommands, ...popularCommands]
      .filter((cmd, index, arr) => arr.findIndex(c => c.id === cmd.id) === index)
      .slice(0, 8);
  }, [history]);

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    executeCommand,
    executeSelectedCommand,
    history
  };
}