import { Injectable } from '@nestjs/common';

@Injectable()
export class LoadBalancer {
  private servers = ['server1', 'server2', 'server3'];
  private currentIndex = 0;

  getNextServer(): string {
    const server = this.servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;
    return server;
  }

  async checkHealth(): Promise<boolean> {
    // Health check logic
    return true;
  }
}