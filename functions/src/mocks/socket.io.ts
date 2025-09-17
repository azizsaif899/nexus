// Mock for socket.io library
export class Server {
  constructor(options?: any) {}
  
  emit(event: string, data: any) {}
  on(event: string, callback: Function) {}
  to(room: string) { return this; }
}

export interface Socket {
  id: string;
  emit(event: string, data: any): void;
  on(event: string, callback: Function): void;
  join(room: string): void;
  leave(room: string): void;
}