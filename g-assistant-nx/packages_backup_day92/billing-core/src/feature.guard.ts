import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BillingService } from './billing.service';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private billingService: BillingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const feature = this.reflector.get<string>('feature', context.getHandler());
    if (!feature) {
      return true; // No feature specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; // Assuming user is available on the request

    return this.billingService.hasAccess(userId, feature);
  }
}
