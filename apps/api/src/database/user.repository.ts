import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = this.create({
      ...userData,
      password: hashedPassword,
      preferences: {
        language: 'ar',
        theme: 'light',
        defaultAgent: 'general',
        defaultMode: 'smart'
      }
    });

    return await this.save(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return await this.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.findOne({ where: { email } });
  }

  async validatePassword(user: UserEntity, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async updateLastLogin(userId: string, ip: string): Promise<void> {
    await this.update(userId, {
      lastLoginAt: new Date(),
      lastLoginIp: ip
    });
  }

  async updatePreferences(userId: string, preferences: Partial<UserEntity['preferences']>): Promise<void> {
    const user = await this.findOne({ where: { id: userId } });
    if (user) {
      user.preferences = { ...user.preferences, ...preferences };
      await this.save(user);
    }
  }

  async getActiveUsers(): Promise<UserEntity[]> {
    return await this.find({ where: { isActive: true } });
  }

  async getUserStats(): Promise<any> {
    const total = await this.count();
    const active = await this.count({ where: { isActive: true } });
    const recentLogins = await this.count({
      where: {
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    });

    return { total, active, recentLogins };
  }
}
