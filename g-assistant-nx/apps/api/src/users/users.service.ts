import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  username: string;
  role: string;
  email?: string;
  createdAt: string;
  lastLogin?: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      role: 'admin',
      email: 'admin@azizsys.com',
      createdAt: '2025-01-01T00:00:00.000Z',
      lastLogin: new Date().toISOString()
    },
    {
      id: 2,
      username: 'user',
      role: 'user',
      email: 'user@azizsys.com',
      createdAt: '2025-01-02T00:00:00.000Z',
      lastLogin: '2025-01-08T10:30:00.000Z'
    }
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  create(userData: Partial<User>): User {
    const newUser: User = {
      id: Math.max(...this.users.map(u => u.id)) + 1,
      username: userData.username!,
      role: userData.role || 'user',
      email: userData.email,
      createdAt: new Date().toISOString(),
    };
    
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, userData: Partial<User>): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    return this.users[userIndex];
  }

  remove(id: number): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}