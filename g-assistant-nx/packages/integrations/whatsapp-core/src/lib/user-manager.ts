export interface WhatsAppUser {
  whatsappId: string;
  systemUserId?: string;
  name?: string;
  isAuthenticated: boolean;
  lastActivity: Date;
  permissions: string[];
}

export class UserManager {
  private users = new Map<string, WhatsAppUser>();

  async authenticateUser(whatsappId: string): Promise<WhatsAppUser> {
    let user = this.users.get(whatsappId);
    
    if (!user) {
      user = {
        whatsappId,
        isAuthenticated: false,
        lastActivity: new Date(),
        permissions: ['basic']
      };
      this.users.set(whatsappId, user);
    }

    user.lastActivity = new Date();
    return user;
  }

  async linkSystemUser(whatsappId: string, systemUserId: string): Promise<boolean> {
    const user = this.users.get(whatsappId);
    if (user) {
      user.systemUserId = systemUserId;
      user.isAuthenticated = true;
      user.permissions.push('authenticated');
      return true;
    }
    return false;
  }

  hasPermission(whatsappId: string, permission: string): boolean {
    const user = this.users.get(whatsappId);
    return user?.permissions.includes(permission) || false;
  }

  isAuthenticated(whatsappId: string): boolean {
    const user = this.users.get(whatsappId);
    return user?.isAuthenticated || false;
  }
}