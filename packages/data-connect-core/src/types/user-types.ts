export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  userId: string;
  resource: ResourceType;
  permission: PermissionType;
  granted: boolean;
  grantedBy?: string;
  grantedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SALES_REP = 'SALES_REP',
  MARKETING = 'MARKETING',
  VIEWER = 'VIEWER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export enum PermissionType {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  ADMIN = 'ADMIN'
}

export enum ResourceType {
  CUSTOMERS = 'CUSTOMERS',
  LEADS = 'LEADS',
  CAMPAIGNS = 'CAMPAIGNS',
  ANALYTICS = 'ANALYTICS',
  USERS = 'USERS',
  SETTINGS = 'SETTINGS'
}