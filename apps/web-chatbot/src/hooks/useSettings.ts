import { useState, useEffect, useCallback } from 'react';

export interface ChatSettings {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoScroll: boolean;
  messagePreview: boolean;
  typingIndicators: boolean;
  readReceipts: boolean;
  messageHistory: number; // days to keep history
  maxFileSize: number; // MB
  supportedFileTypes: string[];
}

const DEFAULT_SETTINGS: ChatSettings = {
  theme: 'auto',
  soundEnabled: true,
  notificationsEnabled: true,
  autoScroll: true,
  messagePreview: true,
  typingIndicators: true,
  readReceipts: false,
  messageHistory: 30,
  maxFileSize: 10,
  supportedFileTypes: ['image/*', 'text/*', 'application/pdf'],
};

export interface UseSettingsReturn {
  settings: ChatSettings;
  updateSettings: (updates: Partial<ChatSettings>) => void;
  resetSettings: () => void;
  saveSettings: () => void;
  loadSettings: () => void;
}

const SETTINGS_KEY = 'nexus-chat-settings';

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);

  const loadSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<ChatSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      // Auto-save to localStorage
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
    saveSettings,
    loadSettings,
  };
};