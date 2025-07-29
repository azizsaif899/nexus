defineModule('System.AI.Agents.RoleManager', ({ Utils, Config, DocsManager, AI }) => {
  const MODULE_VERSION = '1.0.0';
  
  const ROLES = {
    ADMIN: 'المساعد الإداري',
    PROGRAMMER: 'المبرمج', 
    DATABASE: 'مدير قاعدة البيانات',
    FINANCIAL: 'المحلل المالي',
    OPERATIONS: 'مدير العمليات'
  };

  const ROLE_PROMPTS = {
    [ROLES.ADMIN]: 'أنت مساعد إداري ذكي متخصص في إدارة المهام وتنسيق الاتصالات',
    [ROLES.PROGRAMMER]: 'أنت مبرمج خبير في Google Apps Script وتوليد الأكواد',
    [ROLES.DATABASE]: 'أنت مدير قاعدة بيانات متخصص في تنظيم وإدارة البيانات',
    [ROLES.FINANCIAL]: 'أنت محلل مالي خبير في التحليل المالي والتقارير',
    [ROLES.OPERATIONS]: 'أنت مدير عمليات متخصص في تنسيق المهام والأتمتة'
  };

  let currentRole = ROLES.FINANCIAL; // الدور الافتراضي

  function switchRole(newRole) {
    if (ROLES[newRole] || Object.values(ROLES).includes(newRole)) {
      currentRole = newRole;
      Utils.log(`Role switched to: ${currentRole}`);
      return { type: 'success', text: `تم التبديل إلى دور: ${currentRole}` };
    }
    return { type: 'error', text: 'دور غير صالح' };
  }

  function getCurrentRole() {
    return currentRole;
  }

  function getRolePrompt(role = currentRole) {
    return ROLE_PROMPTS[role] || ROLE_PROMPTS[ROLES.FINANCIAL];
  }

  function detectIntentRole(message) {
    const keywords = {
      [ROLES.ADMIN]: ['جدولة', 'مهام', 'تنسيق', 'اجتماع'],
      [ROLES.PROGRAMMER]: ['كود', 'برمجة', 'دالة', 'سكريبت'],
      [ROLES.DATABASE]: ['جدول', 'بيانات', 'عمود', 'صف'],
      [ROLES.FINANCIAL]: ['مالي', 'ربح', 'خسارة', 'تقرير', 'تحليل'],
      [ROLES.OPERATIONS]: ['أتمتة', 'عمليات', 'تنسيق', 'ربط']
    };

    for (const [role, words] of Object.entries(keywords)) {
      if (words.some(word => message.includes(word))) {
        return role;
      }
    }
    return currentRole;
  }

  return {
    ROLES,
    switchRole,
    getCurrentRole,
    getRolePrompt,
    detectIntentRole,
    MODULE_VERSION
  };
});