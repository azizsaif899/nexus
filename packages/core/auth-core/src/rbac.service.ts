import { Injectable } from '@nestjs/common';

export type Role = 'Admin' | 'Billing Manager' | 'User';

@Injectable()
export class RbacService {
  private userRoles = new Map<string, Role[]>();

  constructor() {
    // Mock data
    this.userRoles.set('user-123', ['Admin', 'User']);
    this.userRoles.set('user-456', ['User']);
    this.userRoles.set('user-789', ['Billing Manager']);
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    return this.userRoles.get(userId) || [];
  }
}
