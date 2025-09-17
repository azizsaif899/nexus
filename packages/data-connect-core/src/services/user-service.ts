import { getDataConnectInstance } from '../client';

export class UserService {
  private dataConnect = getDataConnectInstance();

  async getUsers(filter?: any, limit?: number, offset?: number) {
    return [];
  }

  async getCurrentUser() {
    return { id: 'user-1', email: 'user@example.com', name: 'Mock User', role: 'admin', status: 'active' };
  }

  async createUser(input: any) {
    return { id: 'user-' + Date.now(), ...input, createdAt: new Date().toISOString() };
  }
}

let userService: UserService | null = null;

export function getUserService(): UserService {
  if (!userService) {
    userService = new UserService();
  }
  return userService;
}