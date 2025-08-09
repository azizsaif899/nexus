/**
 * مدير إعدادات المستخدم
 * Status: 🟢 Stable
 */
defineModule('System.UserSettingsManager', function(injector) {
  
  const DEFAULT_SETTINGS = {
    theme: 'default',
    fontSize: 'medium',
    autoScroll: true,
    notifications: true,
    language: 'ar',
    agentPreference: 'General',
    shortcuts: {
      send: 'Alt+S',
      clear: 'Alt+C',
      export: 'Alt+E'
    }
  };

  return {
    /**
     * تحميل إعدادات المستخدم
     */
    loadUserSettings() {
      try {
        const userEmail = Session.getActiveUser().getEmail();
        const key = `user_settings_${userEmail}`;
        
        const savedSettings = PropertiesService.getUserProperties().getProperty(key);
        
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
        
        return DEFAULT_SETTINGS;
        
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
        return DEFAULT_SETTINGS;
      }
    },

    /**
     * حفظ إعدادات المستخدم
     */
    saveUserSettings(settings) {
      try {
        const userEmail = Session.getActiveUser().getEmail();
        const key = `user_settings_${userEmail}`;
        
        // دمج مع الإعدادات الافتراضية
        const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
        
        PropertiesService.getUserProperties().setProperty(
          key, 
          JSON.stringify({
            ...mergedSettings,
            lastUpdated: new Date().toISOString()
          })
        );
        
        return { success: true };
        
      } catch (error) {
        console.error('خطأ في حفظ الإعدادات:', error);
        throw new Error('فشل في حفظ الإعدادات');
      }
    },

    /**
     * إعادة تعيين الإعدادات للافتراضية
     */
    resetUserSettings() {
      try {
        const userEmail = Session.getActiveUser().getEmail();
        const key = `user_settings_${userEmail}`;
        
        PropertiesService.getUserProperties().deleteProperty(key);
        
        return DEFAULT_SETTINGS;
        
      } catch (error) {
        console.error('خطأ في إعادة التعيين:', error);
        throw new Error('فشل في إعادة تعيين الإعدادات');
      }
    },

    /**
     * تحديث إعداد واحد
     */
    updateSetting(key, value) {
      try {
        const currentSettings = this.loadUserSettings();
        currentSettings[key] = value;
        
        return this.saveUserSettings(currentSettings);
        
      } catch (error) {
        console.error('خطأ في تحديث الإعداد:', error);
        throw new Error('فشل في تحديث الإعداد');
      }
    },

    /**
     * الحصول على إعداد محدد
     */
    getSetting(key) {
      try {
        const settings = this.loadUserSettings();
        return settings[key];
        
      } catch (error) {
        console.error('خطأ في جلب الإعداد:', error);
        return DEFAULT_SETTINGS[key];
      }
    }
  };
});

/**
 * دوال عامة لإدارة الإعدادات
 */
function loadUserSettings() {
  try {
    const manager = GAssistant.Utils.Injector.get('System.UserSettingsManager');
    return manager.loadUserSettings();
  } catch (error) {
    console.error('خطأ في تحميل الإعدادات:', error);
    throw error;
  }
}

function saveUserSettings(settings) {
  try {
    const manager = GAssistant.Utils.Injector.get('System.UserSettingsManager');
    return manager.saveUserSettings(settings);
  } catch (error) {
    console.error('خطأ في حفظ الإعدادات:', error);
    throw error;
  }
}

function resetUserSettings() {
  try {
    const manager = GAssistant.Utils.Injector.get('System.UserSettingsManager');
    return manager.resetUserSettings();
  } catch (error) {
    console.error('خطأ في إعادة التعيين:', error);
    throw error;
  }
}