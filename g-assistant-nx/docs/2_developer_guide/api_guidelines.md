# 🔌 إرشادات تصميم API - دليل شامل

> **الهدف:** ضمان أن API الخاص بنا متسق، آمن، وسهل الاستخدام للمطورين

## 🏗️ مبادئ التصميم الأساسية

### RESTful Design
- استخدام HTTP methods بشكل صحيح
- URLs واضحة ومنطقية
- Status codes مناسبة
- Stateless communication

### API-First Approach
- تصميم API قبل التنفيذ
- توثيق شامل مع OpenAPI
- Contract testing
- Mock servers للتطوير

## 📋 تصميم Endpoints

### هيكل URL القياسي
```
https://api.g-assistant.com/v1/{resource}/{id?}/{sub-resource?}

أمثلة:
GET    /v1/users                    # قائمة المستخدمين
GET    /v1/users/123               # مستخدم محدد
POST   /v1/users                   # إنشاء مستخدم
PUT    /v1/users/123               # تحديث مستخدم
DELETE /v1/users/123               # حذف مستخدم
GET    /v1/users/123/projects      # مشاريع المستخدم
POST   /v1/users/123/projects      # إنشاء مشروع للمستخدم
```

### اصطلاحات التسمية
```typescript
// الموارد: جمع، kebab-case
/v1/user-profiles
/v1/financial-reports
/v1/ai-agents

// المعرفات: UUID أو أرقام
/v1/users/550e8400-e29b-41d4-a716-446655440000
/v1/projects/12345

// الإجراءات: أفعال واضحة
POST /v1/users/123/activate
POST /v1/reports/456/generate
POST /v1/ai-agents/789/train
```

## 📝 مواصفات OpenAPI

### ملف openapi.yaml الأساسي
```yaml
openapi: 3.0.3
info:
  title: G-Assistant API
  description: API للنظام الذكي G-Assistant
  version: 1.0.0
  contact:
    name: فريق التطوير
    email: dev@g-assistant.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.g-assistant.com/v1
    description: بيئة الإنتاج
  - url: https://staging-api.g-assistant.com/v1
    description: بيئة الاختبار
  - url: http://localhost:3000/v1
    description: بيئة التطوير

paths:
  /chat:
    post:
      summary: إرسال رسالة للذكاء الاصطناعي
      description: يرسل رسالة للذكاء الاصطناعي ويحصل على رد
      operationId: sendChatMessage
      tags:
        - Chat
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatRequest'
            examples:
              simple_question:
                summary: سؤال بسيط
                value:
                  message: "ما هو الطقس اليوم؟"
                  context:
                    userId: "user123"
                    sessionId: "session456"
              financial_query:
                summary: استفسار مالي
                value:
                  message: "أريد تحليل الأرباح للربع الأول"
                  context:
                    userId: "user123"
                    sessionId: "session456"
                    agentType: "cfo"
      responses:
        '200':
          description: رد ناجح من الذكاء الاصطناعي
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/RateLimited'
        '500':
          $ref: '#/components/responses/InternalError'

components:
  schemas:
    ChatRequest:
      type: object
      required:
        - message
        - context
      properties:
        message:
          type: string
          minLength: 1
          maxLength: 4000
          description: نص الرسالة
          example: "كيف يمكنني تحسين الأرباح؟"
        context:
          $ref: '#/components/schemas/ChatContext'
        options:
          $ref: '#/components/schemas/ChatOptions'

    ChatContext:
      type: object
      required:
        - userId
        - sessionId
      properties:
        userId:
          type: string
          format: uuid
          description: معرف المستخدم
        sessionId:
          type: string
          description: معرف الجلسة
        agentType:
          type: string
          enum: [general, cfo, developer, analyst]
          description: نوع الوكيل المطلوب
        language:
          type: string
          enum: [ar, en]
          default: ar
          description: لغة الرد

    ChatResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          type: object
          properties:
            response:
              type: string
              description: رد الذكاء الاصطناعي
            agent:
              type: string
              description: الوكيل الذي أجاب
            usage:
              $ref: '#/components/schemas/Usage'
            suggestions:
              type: array
              items:
                type: string
              description: اقتراحات للأسئلة التالية
        metadata:
          $ref: '#/components/schemas/ResponseMetadata'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## 🔐 الأمان والمصادقة

### JWT Authentication
```typescript
// middleware/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    
    try {
      const payload = this.jwtService.verify(token);
      req.user = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
```

### Rate Limiting
```typescript
// guards/rate-limit.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const endpoint = request.route.path;
    
    // الحصول على حدود المعدل من metadata
    const limit = this.reflector.get<number>('rateLimit', context.getHandler()) || 100;
    const window = this.reflector.get<number>('rateLimitWindow', context.getHandler()) || 3600;
    
    const key = `rate_limit:${userId}:${endpoint}`;
    const current = await this.redisService.incr(key);
    
    if (current === 1) {
      await this.redisService.expire(key, window);
    }
    
    if (current > limit) {
      throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }
    
    return true;
  }
}

// استخدام الـ decorator
@RateLimit(50, 3600) // 50 طلب في الساعة
@Post('chat')
async sendMessage(@Body() body: ChatRequest) {
  // ...
}
```

## 📊 إدارة الإصدارات (Versioning)

### استراتيجية الإصدارات
```typescript
// URL Versioning (الطريقة المفضلة)
/v1/users
/v2/users

// Header Versioning (بديل)
Accept: application/vnd.g-assistant.v1+json

// Query Parameter (للاختبار فقط)
/users?version=1
```

### تنفيذ الإصدارات في NestJS
```typescript
// main.ts
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1'
  });
  
  await app.listen(3000);
}

// controller
@Controller({
  path: 'users',
  version: '1'
})
export class UsersV1Controller {
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}

@Controller({
  path: 'users', 
  version: '2'
})
export class UsersV2Controller {
  @Get()
  findAll() {
    // تنفيذ محسن مع pagination
    return this.usersService.findAllPaginated();
  }
}
```

## ❌ معالجة الأخطاء الموحدة

### هيكل الاستجابة للأخطاء
```typescript
// interfaces/api-response.interface.ts
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
    requestId: string;
  };
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  metadata?: {
    timestamp: string;
    requestId: string;
    pagination?: PaginationMetadata;
  };
}
```

### Exception Filter
```typescript
// filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        code = (exceptionResponse as any).code || this.getErrorCode(status);
      }
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: request.headers['x-request-id'] || 'unknown'
      }
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const codes = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED', 
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMITED',
      500: 'INTERNAL_ERROR'
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }
}
```

### أخطاء مخصصة
```typescript
// exceptions/business.exceptions.ts
export class InsufficientCreditsException extends HttpException {
  constructor(required: number, available: number) {
    super({
      code: 'INSUFFICIENT_CREDITS',
      message: `Insufficient credits. Required: ${required}, Available: ${available}`,
      details: { required, available }
    }, HttpStatus.PAYMENT_REQUIRED);
  }
}

export class AgentNotAvailableException extends HttpException {
  constructor(agentType: string) {
    super({
      code: 'AGENT_NOT_AVAILABLE',
      message: `Agent of type '${agentType}' is not available`,
      details: { agentType }
    }, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
```

## 📄 التوثيق التلقائي

### إعداد Swagger
```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('G-Assistant API')
    .setDescription('API للنظام الذكي G-Assistant')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Chat', 'عمليات الدردشة مع الذكاء الاصطناعي')
    .addTag('Users', 'إدارة المستخدمين')
    .addTag('Projects', 'إدارة المشاريع')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'G-Assistant API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  });

  await app.listen(3000);
}
```

### تحسين التوثيق
```typescript
// controllers/chat.controller.ts
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  @Post()
  @ApiOperation({ 
    summary: 'إرسال رسالة للذكاء الاصطناعي',
    description: 'يرسل رسالة للذكاء الاصطناعي ويحصل على رد مناسب حسب نوع الوكيل المحدد'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'رد ناجح من الذكاء الاصطناعي',
    type: ChatResponse
  })
  @ApiResponse({ 
    status: 400, 
    description: 'طلب غير صحيح - رسالة فارغة أو معاملات مفقودة'
  })
  @ApiResponse({ 
    status: 429, 
    description: 'تم تجاوز حد المعدل المسموح'
  })
  async sendMessage(
    @Body() @ApiBody({ 
      description: 'بيانات الرسالة والسياق',
      examples: {
        simple: {
          summary: 'سؤال بسيط',
          value: {
            message: 'ما هو الطقس اليوم؟',
            context: { userId: 'user123', sessionId: 'session456' }
          }
        }
      }
    }) body: ChatRequest
  ): Promise<ChatResponse> {
    return this.chatService.processMessage(body);
  }
}
```

## 🔄 Pagination والتصفية

### معايير Pagination
```typescript
// dto/pagination.dto.ts
export class PaginationDto {
  @ApiProperty({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// استجابة مع pagination
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  metadata: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    timestamp: string;
    requestId: string;
  };
}
```

### تنفيذ التصفية
```typescript
// dto/filter.dto.ts
export class ProjectFilterDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ enum: ['active', 'completed', 'archived'], required: false })
  @IsOptional()
  @IsIn(['active', 'completed', 'archived'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAfter?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdBefore?: Date;
}

// في الـ controller
@Get()
async findAll(@Query() filters: ProjectFilterDto): Promise<PaginatedResponse<Project>> {
  return this.projectsService.findAll(filters);
}
```

## 🧪 اختبار API

### Contract Testing
```typescript
// tests/contracts/chat.contract.test.ts
import { pactWith } from 'jest-pact';
import { Matchers } from '@pact-foundation/pact';

pactWith({ consumer: 'WebApp', provider: 'ChatAPI' }, provider => {
  describe('Chat API Contract', () => {
    it('should return chat response for valid message', async () => {
      await provider
        .given('user is authenticated')
        .uponReceiving('a chat message request')
        .withRequest({
          method: 'POST',
          path: '/v1/chat',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Matchers.like('Bearer token123')
          },
          body: {
            message: Matchers.like('Hello'),
            context: {
              userId: Matchers.uuid(),
              sessionId: Matchers.like('session123')
            }
          }
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            success: true,
            data: {
              response: Matchers.like('Hello! How can I help you?'),
              agent: Matchers.like('general'),
              usage: {
                promptTokens: Matchers.integer(),
                completionTokens: Matchers.integer()
              }
            }
          }
        });

      const response = await fetch(`${provider.mockService.baseUrl}/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123'
        },
        body: JSON.stringify({
          message: 'Hello',
          context: {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            sessionId: 'session123'
          }
        })
      });

      expect(response.status).toBe(200);
    });
  });
});
```

## 📈 مراقبة الأداء

### Metrics والتسجيل
```typescript
// interceptors/logging.interceptor.ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(`${method} ${url} - ${duration}ms`);
        
        // إرسال metrics لـ monitoring system
        this.metricsService.recordApiCall({
          method,
          url,
          duration,
          status: 'success'
        });
      }),
      catchError(error => {
        const duration = Date.now() - startTime;
        this.logger.error(`${method} ${url} - ${duration}ms - Error: ${error.message}`);
        
        this.metricsService.recordApiCall({
          method,
          url,
          duration,
          status: 'error',
          error: error.message
        });
        
        throw error;
      })
    );
  }
}
```

## 🎯 أفضل الممارسات

### تصميم API
1. **البساطة:** URLs بسيطة ومفهومة
2. **الاتساق:** نفس الأنماط في جميع endpoints
3. **التوثيق:** كل endpoint موثق بالكامل
4. **الأمان:** مصادقة وتخويل في كل طلب

### الأداء
1. **Caching:** استخدم Redis للبيانات المتكررة
2. **Pagination:** لا ترجع كميات كبيرة من البيانات
3. **Compression:** فعل gzip compression
4. **Rate Limiting:** احم API من الإفراط في الاستخدام

### الصيانة
1. **Versioning:** خطط للإصدارات المستقبلية
2. **Monitoring:** راقب الأداء والأخطاء
3. **Testing:** اختبر كل endpoint
4. **Documentation:** حدث التوثيق مع كل تغيير