import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityManager {
  private securityConfig = {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    passwordMinLength: 8
  };

  private loginAttempts = new Map<string, number>();
  private lockedAccounts = new Map<string, number>();

  validatePassword(password: string): boolean {
    return password.length >= this.securityConfig.passwordMinLength;
  }

  checkLoginAttempts(userId: string): boolean {
    const attempts = this.loginAttempts.get(userId) || 0;
    const lockTime = this.lockedAccounts.get(userId);
    
    if (lockTime && Date.now() < lockTime) {
      return false; // Account is locked
    }
    
    if (lockTime && Date.now() >= lockTime) {
      // Unlock account
      this.lockedAccounts.delete(userId);
      this.loginAttempts.delete(userId);
    }
    
    return attempts < this.securityConfig.maxLoginAttempts;
  }

  recordFailedLogin(userId: string): void {
    const attempts = (this.loginAttempts.get(userId) || 0) + 1;
    this.loginAttempts.set(userId, attempts);
    
    if (attempts >= this.securityConfig.maxLoginAttempts) {
      const lockUntil = Date.now() + this.securityConfig.lockoutDuration;
      this.lockedAccounts.set(userId, lockUntil);
    }
  }

  recordSuccessfulLogin(userId: string): void {
    this.loginAttempts.delete(userId);
    this.lockedAccounts.delete(userId);
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  validateApiKey(apiKey: string): boolean {
    // Basic API key validation
    return apiKey && apiKey.length >= 32 && /^[a-zA-Z0-9]+$/.test(apiKey);
  }
}