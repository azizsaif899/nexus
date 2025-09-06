import { Injectable } from '@nestjs/common';
import { firestoreService } from '@azizsys/core/services/firestore.service';

@Injectable()
export class UsersService {
  private readonly collection = 'users';

  async create(userData: any) {
    // التحقق من صحة البيانات الأساسية
    if (!userData.email || !userData.name) {
      throw new Error('Email and name are required');
    }

    // إضافة timestamp للإنشاء
    const userWithTimestamp = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await firestoreService.addDoc(this.collection, userWithTimestamp);
  }

  async createUser(userData: any) {
    return await this.create(userData);
  }

  async findOne(id: string) {
    if (!id) {
      throw new Error('User ID is required');
    }

    const user = await firestoreService.getDoc(this.collection, id);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUserById(id: string) {
    return await this.findOne(id);
  }

  async getAllUsers() {
    return await firestoreService.getAllDocs(this.collection);
  }

  async updateUser(id: string, userData: any) {
    await firestoreService.updateDoc(this.collection, id, userData);
    return await this.getUserById(id);
  }

  async deleteUser(id: string) {
    await firestoreService.deleteDoc(this.collection, id);
  }

  async findUserByEmail(email: string) {
    return await firestoreService.queryDocs(this.collection, 'email', '===', email);
  }
}