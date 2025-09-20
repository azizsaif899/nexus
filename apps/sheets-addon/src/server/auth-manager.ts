/**
 * Authentication Manager for Google Sheets Add-on
 */

export class AuthManager {
  private readonly API_BASE_URL = 'http://localhost:3333/api';

  /**
   * Authenticate user with backend
   */
  authenticate(username: string, password: string): any {
    try {
      const response = UrlFetchApp.fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify({ username, password })
      });
      
      const data = JSON.parse(response.getContentText());
      
      if (data.success) {
        PropertiesService.getUserProperties().setProperty('auth_token', data.token);
        PropertiesService.getUserProperties().setProperty('user_id', data.userId);
      }
      
      return data;
    } catch (error) {
      Logger.log('Auth Error: ' + error.toString());
      return {
        success: false,
        message: 'خطأ في المصادقة',
        error: error.toString()
      };
    }
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return PropertiesService.getUserProperties().getProperty('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }

  /**
   * Logout user
   */
  logout(): void {
    PropertiesService.getUserProperties().deleteProperty('auth_token');
    PropertiesService.getUserProperties().deleteProperty('user_id');
  }

  /**
   * Validate current token
   */
  validateToken(): any {
    const token = this.getToken();
    if (!token) return { valid: false, message: 'لا يوجد رمز مصادقة' };

    try {
      const response = UrlFetchApp.fetch(`${this.API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      return JSON.parse(response.getContentText());
    } catch (error) {
      Logger.log('Token validation error: ' + error.toString());
      return { valid: false, message: 'خطأ في التحقق من الرمز' };
    }
  }
}