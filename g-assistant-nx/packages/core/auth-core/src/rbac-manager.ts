import { Injectable } from '@nestjs/common';

@Injectable()
export class RBACManager {
  private roles = new Map<string, string[]>();
  private permissions = new Map<string, string[]>();

  async assignRole(userId: string, role: string): Promise<void> {
    const userRoles = this.roles.get(userId) || [];
    userRoles.push(role);
    this.roles.set(userId, userRoles);
  }

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    const userRoles = this.roles.get(userId) || [];
    return userRoles.some(role => {
      const rolePermissions = this.permissions.get(role) || [];
      return rolePermissions.includes(permission);
    });
  }

  async createRole(roleName: string, permissions: string[]): Promise<void> {
    this.permissions.set(roleName, permissions);
  }
}