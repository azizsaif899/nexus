// Mock for pg (PostgreSQL) library
export class Pool {
  constructor(config?: any) {}
  
  async query(text: string, params?: any[]) {
    return { rows: [], rowCount: 0 };
  }
  
  async connect() {
    return {
      query: this.query,
      release: () => {}
    };
  }
  
  on(event: string, callback: Function) {}
  
  async end() {}
}