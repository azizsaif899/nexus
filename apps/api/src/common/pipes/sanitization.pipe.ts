import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }
    
    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value);
    }
    
    return value;
  }

  private sanitizeString(input: string): string {
    const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi;
    if (sqlPatterns.test(input)) {
      throw new BadRequestException('Invalid input detected');
    }

    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
  }

  private sanitizeObject(obj: any): any {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = this.transform(obj[key]);
      }
    }
    return sanitized;
  }
}
