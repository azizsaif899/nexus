'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseInlineEditProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  validate?: (value: string) => string | null;
}

export function useInlineEdit({ initialValue, onSave, validate }: UseInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setError(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const saveEdit = useCallback(async () => {
    if (validate) {
      const validationError = validate(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(value);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  }, [value, validate, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  }, [saveEdit, cancelEdit]);

  return {
    isEditing,
    value,
    setValue,
    isSaving,
    error,
    inputRef,
    startEdit,
    cancelEdit,
    saveEdit,
    handleKeyDown
  };
}