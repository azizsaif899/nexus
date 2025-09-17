import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AUDIT');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;
    
    const auditLog = {
      userId: user?.id || 'anonymous',
      userRole: user?.role || 'guest',
      action: `${method} ${url}`,
      ip: ip || request.connection.remoteAddress,
      timestamp: new Date().toISOString(),
      userAgent: request.headers['user-agent']
    };

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.log('Admin Action Completed', {
            ...auditLog,
            status: 'success',
            responseSize: JSON.stringify(data).length
          });
        },
        error: (error) => {
          this.logger.error('Admin Action Failed', {
            ...auditLog,
            status: 'error',
            error: error.message
          });
        }
      })
    );
  }
}
