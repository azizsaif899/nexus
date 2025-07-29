
/**
 * @file UI/Dialogue.js
 * @description مركز إنشاء واجهات المستخدم
 */

class UIDialogue {
  static createSuccess(message) {
    return {
      type: 'success',
      message: message,
      timestamp: new Date().toISOString()
    };
  }

  static createError(message) {
    return {
      type: 'error', 
      message: message,
      timestamp: new Date().toISOString()
    };
  }

  static createWarning(message) {
    return {
      type: 'warning',
      message: message,
      timestamp: new Date().toISOString()
    };
  }

  static createInfo(message) {
    return {
      type: 'info',
      message: message,
      timestamp: new Date().toISOString()
    };
  }
}

export default UIDialogue;
