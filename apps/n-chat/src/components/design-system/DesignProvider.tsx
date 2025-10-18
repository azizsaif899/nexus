'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// أنواع البيانات للتخصيص
export interface ChatColors {
  // الخلفيات
  sidebarBg: string;
  headerBg: string;
  chatAreaBg: string;
  inputAreaBg: string;
  
  // فقاعات الرسائل
  incomingBubble: string;
  outgoingBubble: string;
  
  // النصوص
  primaryText: string;
  secondaryText: string;
  accentGreen: string;
  
  // الحدود والتفاصيل
  borderColor: string;
  shadowColor: string;
  hoverColor: string;
}

export interface ChatIcons {
  search: { size: number; color: string; style: string };
  send: { size: number; color: string; style: string };
  phone: { size: number; color: string; style: string };
  video: { size: number; color: string; style: string };
  menu: { size: number; color: string; style: string };
  attachment: { size: number; color: string; style: string };
  emoji: { size: number; color: string; style: string };
  microphone: { size: number; color: string; style: string };
}

export interface ChatLayout {
  sidebarWidth: number;
  headerHeight: number;
  inputHeight: number;
  bubbleRadius: number;
  avatarSize: number;
  fontSize: number;
  messageSpacing: number;
}

export interface ChatAnimations {
  messageEnter: string;
  typingSpeed: number;
  hoverEffects: boolean;
  pulseEffects: boolean;
  slideEffects: boolean;
  fadeEffects: boolean;
}

export interface DesignTheme {
  id: string;
  name: string;
  colors: ChatColors;
  icons: ChatIcons;
  layout: ChatLayout;
  animations: ChatAnimations;
  isCustom: boolean;
}

// القوالب الافتراضية
export const defaultThemes: DesignTheme[] = [
  {
    id: 'whatsapp-dark',
    name: 'واتساب الداكن (افتراضي)',
    colors: {
      sidebarBg: '#111B21',
      headerBg: '#202526',
      chatAreaBg: '#000000',
      inputAreaBg: '#202526',
      incomingBubble: '#262D31',
      outgoingBubble: '#005C4B',
      primaryText: '#EDEDED',
      secondaryText: '#AAAAAA',
      accentGreen: '#25D366',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      hoverColor: 'rgba(255, 255, 255, 0.05)'
    },
    icons: {
      search: { size: 24, color: '#AAAAAA', style: 'outline' },
      send: { size: 24, color: '#25D366', style: 'filled' },
      phone: { size: 24, color: '#AAAAAA', style: 'outline' },
      video: { size: 24, color: '#AAAAAA', style: 'outline' },
      menu: { size: 24, color: '#AAAAAA', style: 'outline' },
      attachment: { size: 24, color: '#AAAAAA', style: 'outline' },
      emoji: { size: 24, color: '#AAAAAA', style: 'outline' },
      microphone: { size: 24, color: '#25D366', style: 'filled' }
    },
    layout: {
      sidebarWidth: 300,
      headerHeight: 64,
      inputHeight: 64,
      bubbleRadius: 8,
      avatarSize: 40,
      fontSize: 14,
      messageSpacing: 8
    },
    animations: {
      messageEnter: 'slideIn',
      typingSpeed: 1000,
      hoverEffects: true,
      pulseEffects: true,
      slideEffects: true,
      fadeEffects: true
    },
    isCustom: false
  },
  {
    id: 'modern-blue',
    name: 'أزرق عصري',
    colors: {
      sidebarBg: '#1e293b',
      headerBg: '#334155',
      chatAreaBg: '#0f172a',
      inputAreaBg: '#334155',
      incomingBubble: '#475569',
      outgoingBubble: '#3b82f6',
      primaryText: '#f1f5f9',
      secondaryText: '#94a3b8',
      accentGreen: '#06b6d4',
      borderColor: 'rgba(59, 130, 246, 0.2)',
      shadowColor: 'rgba(59, 130, 246, 0.1)',
      hoverColor: 'rgba(59, 130, 246, 0.05)'
    },
    icons: {
      search: { size: 24, color: '#94a3b8', style: 'outline' },
      send: { size: 24, color: '#06b6d4', style: 'filled' },
      phone: { size: 24, color: '#94a3b8', style: 'outline' },
      video: { size: 24, color: '#94a3b8', style: 'outline' },
      menu: { size: 24, color: '#94a3b8', style: 'outline' },
      attachment: { size: 24, color: '#94a3b8', style: 'outline' },
      emoji: { size: 24, color: '#94a3b8', style: 'outline' },
      microphone: { size: 24, color: '#06b6d4', style: 'filled' }
    },
    layout: {
      sidebarWidth: 320,
      headerHeight: 70,
      inputHeight: 70,
      bubbleRadius: 12,
      avatarSize: 44,
      fontSize: 15,
      messageSpacing: 12
    },
    animations: {
      messageEnter: 'fadeIn',
      typingSpeed: 800,
      hoverEffects: true,
      pulseEffects: false,
      slideEffects: true,
      fadeEffects: true
    },
    isCustom: false
  },
  {
    id: 'purple-gradient',
    name: 'تدرج بنفسجي',
    colors: {
      sidebarBg: '#1a1625',
      headerBg: '#2d1b69',
      chatAreaBg: '#0f0d1a',
      inputAreaBg: '#2d1b69',
      incomingBubble: '#3730a3',
      outgoingBubble: '#7c3aed',
      primaryText: '#f3e8ff',
      secondaryText: '#c4b5fd',
      accentGreen: '#a855f7',
      borderColor: 'rgba(168, 85, 247, 0.3)',
      shadowColor: 'rgba(124, 58, 237, 0.2)',
      hoverColor: 'rgba(168, 85, 247, 0.1)'
    },
    icons: {
      search: { size: 24, color: '#c4b5fd', style: 'outline' },
      send: { size: 24, color: '#a855f7', style: 'filled' },
      phone: { size: 24, color: '#c4b5fd', style: 'outline' },
      video: { size: 24, color: '#c4b5fd', style: 'outline' },
      menu: { size: 24, color: '#c4b5fd', style: 'outline' },
      attachment: { size: 24, color: '#c4b5fd', style: 'outline' },
      emoji: { size: 24, color: '#c4b5fd', style: 'outline' },
      microphone: { size: 24, color: '#a855f7', style: 'filled' }
    },
    layout: {
      sidebarWidth: 280,
      headerHeight: 65,
      inputHeight: 65,
      bubbleRadius: 16,
      avatarSize: 38,
      fontSize: 14,
      messageSpacing: 10
    },
    animations: {
      messageEnter: 'bounceIn',
      typingSpeed: 1200,
      hoverEffects: true,
      pulseEffects: true,
      slideEffects: false,
      fadeEffects: true
    },
    isCustom: false
  },
  {
    id: 'emerald-professional',
    name: 'زمردي احترافي',
    colors: {
      sidebarBg: '#064e3b',
      headerBg: '#047857',
      chatAreaBg: '#022c22',
      inputAreaBg: '#047857',
      incomingBubble: '#059669',
      outgoingBubble: '#10b981',
      primaryText: '#ecfdf5',
      secondaryText: '#a7f3d0',
      accentGreen: '#34d399',
      borderColor: 'rgba(52, 211, 153, 0.2)',
      shadowColor: 'rgba(16, 185, 129, 0.15)',
      hoverColor: 'rgba(52, 211, 153, 0.08)'
    },
    icons: {
      search: { size: 24, color: '#a7f3d0', style: 'outline' },
      send: { size: 24, color: '#34d399', style: 'filled' },
      phone: { size: 24, color: '#a7f3d0', style: 'outline' },
      video: { size: 24, color: '#a7f3d0', style: 'outline' },
      menu: { size: 24, color: '#a7f3d0', style: 'outline' },
      attachment: { size: 24, color: '#a7f3d0', style: 'outline' },
      emoji: { size: 24, color: '#a7f3d0', style: 'outline' },
      microphone: { size: 24, color: '#34d399', style: 'filled' }
    },
    layout: {
      sidebarWidth: 310,
      headerHeight: 68,
      inputHeight: 68,
      bubbleRadius: 10,
      avatarSize: 42,
      fontSize: 15,
      messageSpacing: 9
    },
    animations: {
      messageEnter: 'slideUp',
      typingSpeed: 900,
      hoverEffects: true,
      pulseEffects: true,
      slideEffects: true,
      fadeEffects: false
    },
    isCustom: false
  }
];

interface DesignContextType {
  currentTheme: DesignTheme;
  customThemes: DesignTheme[];
  setCurrentTheme: (theme: DesignTheme) => void;
  updateTheme: (updates: Partial<DesignTheme>) => void;
  saveCustomTheme: (theme: DesignTheme) => void;
  deleteCustomTheme: (id: string) => void;
  resetToDefault: () => void;
  exportTheme: () => string;
  importTheme: (themeJson: string) => boolean;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export function DesignProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentThemeState] = useState<DesignTheme>(defaultThemes[0]);
  const [customThemes, setCustomThemes] = useState<DesignTheme[]>([]);

  // تحميل الإعدادات من التخزين المحلي عند البدء
  useEffect(() => {
    const savedTheme = localStorage.getItem('chat-current-theme');
    const savedCustomThemes = localStorage.getItem('chat-custom-themes');

    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setCurrentThemeState(theme);
      } catch (error) {
        console.error('خطأ في تحميل الثيم المحفوظ:', error);
      }
    }

    if (savedCustomThemes) {
      try {
        const themes = JSON.parse(savedCustomThemes);
        setCustomThemes(themes);
      } catch (error) {
        console.error('خطأ في تحميل الثيمات المخصصة:', error);
      }
    }
  }, []);

  // حفظ الإعدادات في التخزين المحلي
  useEffect(() => {
    localStorage.setItem('chat-current-theme', JSON.stringify(currentTheme));
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('chat-custom-themes', JSON.stringify(customThemes));
  }, [customThemes]);

  // تطبيق متغيرات CSS عند تغيير الثيم
  useEffect(() => {
    const root = document.documentElement;
    
    // تطبيق الألوان
    root.style.setProperty('--chat-sidebar-bg', currentTheme.colors.sidebarBg);
    root.style.setProperty('--chat-header-bg', currentTheme.colors.headerBg);
    root.style.setProperty('--chat-area-bg', currentTheme.colors.chatAreaBg);
    root.style.setProperty('--chat-input-bg', currentTheme.colors.inputAreaBg);
    root.style.setProperty('--chat-incoming-bubble', currentTheme.colors.incomingBubble);
    root.style.setProperty('--chat-outgoing-bubble', currentTheme.colors.outgoingBubble);
    root.style.setProperty('--chat-primary-text', currentTheme.colors.primaryText);
    root.style.setProperty('--chat-secondary-text', currentTheme.colors.secondaryText);
    root.style.setProperty('--chat-accent-green', currentTheme.colors.accentGreen);
    root.style.setProperty('--chat-border-color', currentTheme.colors.borderColor);
    root.style.setProperty('--chat-shadow-color', currentTheme.colors.shadowColor);
    root.style.setProperty('--chat-hover-color', currentTheme.colors.hoverColor);

    // تطبيق الأبعاد
    root.style.setProperty('--chat-sidebar-width', `${currentTheme.layout.sidebarWidth}px`);
    root.style.setProperty('--chat-header-height', `${currentTheme.layout.headerHeight}px`);
    root.style.setProperty('--chat-input-height', `${currentTheme.layout.inputHeight}px`);
    root.style.setProperty('--chat-bubble-radius', `${currentTheme.layout.bubbleRadius}px`);
    root.style.setProperty('--chat-avatar-size', `${currentTheme.layout.avatarSize}px`);
    root.style.setProperty('--chat-font-size', `${currentTheme.layout.fontSize}px`);
    root.style.setProperty('--chat-message-spacing', `${currentTheme.layout.messageSpacing}px`);

    // تطبيق أحجام الأيقونات
    root.style.setProperty('--chat-icon-search-size', `${currentTheme.icons.search.size}px`);
    root.style.setProperty('--chat-icon-send-size', `${currentTheme.icons.send.size}px`);
    root.style.setProperty('--chat-icon-search-color', currentTheme.icons.search.color);
    root.style.setProperty('--chat-icon-send-color', currentTheme.icons.send.color);

  }, [currentTheme]);

  const setCurrentTheme = (theme: DesignTheme) => {
    setCurrentThemeState(theme);
  };

  const updateTheme = (updates: Partial<DesignTheme>) => {
    const updatedTheme = {
      ...currentTheme,
      ...updates,
      isCustom: true,
      id: currentTheme.isCustom ? currentTheme.id : `custom-${Date.now()}`
    };
    setCurrentThemeState(updatedTheme);
  };

  const saveCustomTheme = (theme: DesignTheme) => {
    const newCustomTheme = {
      ...theme,
      id: `custom-${Date.now()}`,
      isCustom: true
    };
    
    setCustomThemes(prev => [...prev, newCustomTheme]);
    setCurrentThemeState(newCustomTheme);
  };

  const deleteCustomTheme = (id: string) => {
    setCustomThemes(prev => prev.filter(theme => theme.id !== id));
    
    // إذا كان الثيم المحذوف هو الحالي، العودة للافتراضي
    if (currentTheme.id === id) {
      setCurrentThemeState(defaultThemes[0]);
    }
  };

  const resetToDefault = () => {
    setCurrentThemeState(defaultThemes[0]);
  };

  const exportTheme = (): string => {
    return JSON.stringify(currentTheme, null, 2);
  };

  const importTheme = (themeJson: string): boolean => {
    try {
      const theme = JSON.parse(themeJson) as DesignTheme;
      
      // التحقق من صحة البيانات
      if (!theme.colors || !theme.icons || !theme.layout || !theme.animations) {
        throw new Error('تنسيق الثيم غير صحيح');
      }

      const importedTheme = {
        ...theme,
        id: `imported-${Date.now()}`,
        isCustom: true
      };

      setCustomThemes(prev => [...prev, importedTheme]);
      setCurrentThemeState(importedTheme);
      
      return true;
    } catch (error) {
      console.error('خطأ في استيراد الثيم:', error);
      return false;
    }
  };

  const value: DesignContextType = {
    currentTheme,
    customThemes,
    setCurrentTheme,
    updateTheme,
    saveCustomTheme,
    deleteCustomTheme,
    resetToDefault,
    exportTheme,
    importTheme
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}

export default DesignProvider;