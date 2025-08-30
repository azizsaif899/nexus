import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  findAll() {
    return [];
  }

  findOne(id: string) {
    return { id, status: 'mock' };
  }

  create(data: any) {
    return { id: Date.now().toString(), ...data };
  }

  update(id: string, data: any) {
    return { id, ...data };
  }

  remove(id: string) {
    return { deleted: true, id };
  }
}
