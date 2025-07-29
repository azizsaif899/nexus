// *************************************************************************************************
// --- START OF FILE: 40_security/Security.gs ---
// *************************************************************************************************

/**
 * @file 40_security/Security.gs
 * @module System.Security
 * @version 20
 * @author عبدالعزيز
 * @description
 * وحدة مسؤولة عن تطبيق سياسات الأمان السياقي داخل المشروع.
 * تشمل التحقق من أذونات المستخدم، حماية تنفيذ الأدوات، وتشفير البيانات الحساسة.
 * مرتبطة بـ: Config, Telemetry, ProjectContextTracker, DeveloperWorkshop.
 */

defineModule('System.Security', ({ Config, Utils, Dialogue, ProjectContextTracker, Telemetry }) => {
  const ROLE_HIERARCHY = {
    viewer: 1,
    commenter: 2,
    editor: 3,
    owner: 4,
    admin: 5
  };

  function hasPermission(requiredRole) {
    if (!Config.get('SECURITY_MODE')) {
      Utils.warn('Security: Disabled by config.');
      return true;
    }

    try {
      const currentUserEmail = Session.getActiveUser().getEmail();
      const ownerEmail = SpreadsheetApp.getActiveSpreadsheet().getOwner()?.getEmail();
      if (currentUserEmail === ownerEmail) return true;

      const customRoles = Config.get('CUSTOM_USER_ROLES') || {};
      const userRole = customRoles[currentUserEmail] || getEffectiveRole(currentUserEmail);

      const userLevel = ROLE_HIERARCHY[userRole] || 0;
      const requiredLevel = ROLE_HIERARCHY[requiredRole] || 99;

      Telemetry?.logEvent({
        type: 'USER_ACTION',
        source: 'Security.hasPermission',
        payload: { user: currentUserEmail, role: userRole, required: requiredRole, granted: userLevel >= requiredLevel }
      });

      return userLevel >= requiredLevel;
    } catch (e) {
      Utils.error('Security.hasPermission: Failed to check permissions.', e);
      return false;
    }
  }

  function getEffectiveRole(email) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss.getEditors().find(u => u.getEmail() === email)) return 'editor';
    if (ss.getViewers().find(u => u.getEmail() === email)) return 'viewer';
    return 'viewer';
  }

  function withPermission(requiredRole, action, args = []) {
    if (hasPermission(requiredRole)) {
      return action(...args);
    } else {
      const errorMessage = `🚫 يتطلب هذا الإجراء دور '${requiredRole}'.`;
      Utils.warn('Security.withPermission: Access denied.', { role: requiredRole });
      return Dialogue.createError(errorMessage);
    }
  }

  function encrypt(data) {
    Utils.log('Security.encrypt: Encrypting data.');
    return Utilities.base64Encode(data, Utilities.Charset.UTF_8);
  }

  function decrypt(encryptedData) {
    Utils.log('Security.decrypt: Decrypting data.');
    return Utilities.newBlob(Utilities.base64Decode(encryptedData)).getDataAsString();
  }

  return {
    hasPermission,
    withPermission,
    encrypt,
    decrypt
  };
});

// *************************************************************************************************
// --- END OF FILE: 40_security/Security.gs ---
// *************************************************************************************************