import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ThrottleGuard implements CanActivate {
  private requests = new Map<string, number[]>();
  private readonly maxRequests = 100;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp = request.ip || request.connection.remoteAddress;
    
    const now = Date.now();
    const clientRequests = this.requests.get(clientIp) || [];
    
    // Remove old requests outside the window
    const validRequests = clientRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }
    
    validRequests.push(now);
    this.requests.set(clientIp, validRequests);
    
    return true;
  }
}
