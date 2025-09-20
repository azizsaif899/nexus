import * as Joi from '../mocks/joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  PORT: Joi.number()
    .port()
    .default(3333),
  
  DATABASE_URL: Joi.string()
    .uri()
    .required(),
  
  JWT_SECRET: Joi.string()
    .min(32)
    .required(),
  
  JWT_EXPIRES_IN: Joi.string()
    .default('24h'),
  
  GOOGLE_SHEETS_API_KEY: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  
  GOOGLE_AI_API_KEY: Joi.string()
    .when('NODE_ENV', {
      is: 'production', 
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  
  GOOGLE_CLOUD_PROJECT_ID: Joi.string()
    .optional(),
  
  CACHE_DURATION_SECONDS: Joi.number()
    .integer()
    .min(60)
    .default(300),
  
  REDIS_URL: Joi.string()
    .uri()
    .optional(),
  
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  
  LOG_FILE_PATH: Joi.string()
    .default('./logs/app.log'),
  
  CORS_ORIGINS: Joi.string()
    .default('http://localhost:3000,http://localhost:4200,http://localhost:4201')
});
