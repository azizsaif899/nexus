import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimiter {
  private requests = new Map<string, number[]>();

  async isAllowed(clientId: string, limit = 100, window = 3600): Promise<boolean> {
    const now = Date.now();
    const clientRequests = this.requests.get(clientId) || [];
    
    // Remove old requests
    const validRequests = clientRequests.filter(time => now - time < window * 1000);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(clientId, validRequests);
    return true;
  }
}