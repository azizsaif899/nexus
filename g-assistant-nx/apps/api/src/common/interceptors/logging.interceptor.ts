import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    
    const sanitizedBody = this.maskSensitiveData(body);
    const sanitizedHeaders = this.maskSensitiveHeaders(headers);
    
    this.logger.log(`Request: ${method} ${url}`, {
      body: sanitizedBody,
      headers: sanitizedHeaders,
      timestamp: new Date().toISOString()
    });

    return next.handle().pipe(
      tap(data => {
        const sanitizedResponse = this.maskSensitiveData(data);
        this.logger.log(`Response: ${method} ${url}`, {
          data: sanitizedResponse,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  private maskSensitiveData(data: any): any {
    if (!data) return data;
    
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'authorization'];
    const masked = { ...data };
    
    sensitiveFields.forEach(field => {
      if (masked[field]) {
        masked[field] = '***MASKED***';
      }
    });
    
    return masked;
  }

  private maskSensitiveHeaders(headers: any): any {
    const masked = { ...headers };
    if (masked.authorization) {
      masked.authorization = '***MASKED***';
    }
    return masked;
  }
}