import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { ConversationEntity } from './conversation.entity';
import { SessionEntity } from './session.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'azizsys',
  password: process.env.DB_PASSWORD || 'azizsys2025',
  database: process.env.DB_NAME || 'azizsys_db',
  entities: [UserEntity, ConversationEntity, SessionEntity],
  migrations: ['dist/apps/api/src/database/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    connectionLimit: 20,
    acquireTimeout: 60000,
    timeout: 60000,
  },
};

export const connectionPoolConfig = {
  max: 20,
  min: 5,
  acquire: 30000,
  idle: 10000,
  evict: 5000,
};