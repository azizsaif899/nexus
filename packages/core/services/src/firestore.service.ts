export class FirestoreService {
  async create(collection: string, data: any) {
    return { id: 'mock-id', ...data };
  }
  
  async findAll(collection: string) {
    return [];
  }
  
  async findById(collection: string, id: string) {
    return null;
  }
  
  async update(collection: string, id: string, data: any) {
    return { id, ...data };
  }
  
  async delete(collection: string, id: string) {
    return true;
  }
}