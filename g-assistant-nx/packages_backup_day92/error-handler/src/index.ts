import pino from 'pino';
import { ApplicationError } from '@azizsys/shared-types';

// Logger setup
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Application Error class
export class AppError extends Error implements ApplicationError {
  code: string;
  metadata?: Record<string, any>;
  timestamp: Date;

  constructor(
    code: string,
    message: string,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.metadata = metadata;
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      metadata: this.metadata,
      timestamp: this.timestamp
    };
  }
}

// Error codes
export const ErrorCodes = {
  ODOO_CONNECTION_FAILED: 'ODOO_CONNECTION_FAILED',
  WHATSAPP_API_ERROR: 'WHATSAPP_API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED'
} as const;

// Global error handler
export const handleError = (error: unknown, context?: string): AppError => {
  logger.error({ error, context }, 'Error occurred');

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      'UNKNOWN_ERROR',
      error.message,
      { originalError: error.name, context }
    );
  }

  return new AppError(
    'UNKNOWN_ERROR',
    'An unknown error occurred',
    { context }
  );
};

// Express error middleware
export const errorMiddleware = (
  error: unknown,
  req: any,
  res: any,
  next: any
) => {
  const appError = handleError(error, `${req.method} ${req.path}`);
  
  res.status(500).json({
    success: false,
    error: appError.toJSON()
  });
};