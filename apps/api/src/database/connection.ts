import { Pool } from '../mocks/pg';
import * as dotenv from 'dotenv';

dotenv.config();

// إعداد اتصال PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'workflows_db',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// اختبار الاتصال
pool.on('connect', () => {
  // Removed console.log
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// دالة لاختبار الاتصال
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    // Removed console.log
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
};

export default pool;