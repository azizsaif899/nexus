export class FirestoreService {
  async create(collection: string, data: any): Promise<any> {
    return { id: Date.now().toString(), ...data };
  }

  async findAll(collection: string): Promise<any[]> {
    return [];
  }

  async findById(collection: string, id: string): Promise<any> {
    return { id, data: 'mock' };
  }

  async update(collection: string, id: string, data: any): Promise<any> {
    return { id, ...data };
  }

  async delete(collection: string, id: string): Promise<boolean> {
    return true;
  }

  async query(collection: string, filters: any): Promise<any[]> {
    return [];
  }
}