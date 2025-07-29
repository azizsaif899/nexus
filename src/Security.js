
/**
 * @file Security.js
 * @description وحدة الأمان المحسنة
 */

class Security {
  static encrypt(text, key = 'default_key') {
    if (!text || typeof text !== 'string') return '';
    
    // تشفير بسيط باستخدام XOR
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result); // Base64 encoding
  }

  static decrypt(encryptedText, key = 'default_key') {
    if (!encryptedText) return '';
    
    try {
      const decoded = atob(encryptedText);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(
          decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return result;
    } catch (error) {
      console.error('فشل فك التشفير:', error);
      return '';
    }
  }

  static escapeHtml(text) {
    if (!text || typeof text !== 'string') return '';
    
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    
    return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
  }

  static validateInput(input, type = 'string') {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'number':
        return !isNaN(input) && isFinite(input);
      case 'string':
        return typeof input === 'string' && input.trim().length > 0;
      default:
        return false;
    }
  }
}

export default Security;
