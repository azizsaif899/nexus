import { Injectable } from '@nestjs/common';

@Injectable()
export class GDPRService {
  async exportUserData(userId: string): Promise<any> {
    return {
      user: { id: userId, username: 'user', email: 'user@example.com' },
      conversations: [],
      analytics: [],
      exportedAt: new Date()
    };
  }

  async deleteUserData(userId: string): Promise<void> {
    // Removed console.log
  }

  async getUserConsent(userId: string): Promise<any> {
    return {
      userId,
      dataProcessing: true,
      marketing: false,
      analytics: true,
      consentDate: new Date()
    };
  }
}
