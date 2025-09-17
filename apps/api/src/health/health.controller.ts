import { Controller, Get } from '@nestjs/common';
import { JsonRpcClient, CacheClient, logger } from '../mocks/core-logic.mock';

@Controller('health')
export class HealthController {
  private rpcClient = new JsonRpcClient({
    baseUrl: process.env.ODOO_URL || 'http://localhost:8070',
    database: process.env.ODOO_DB || 'azizsys_crm',
    username: process.env.ODOO_USER || 'admin',
    password: process.env.ODOO_PASSWORD || 'AzizSys2025!'
  });

  private cache = new CacheClient();

  @Get()
  async healthCheck() {
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        api: true,
        odoo: false,
        redis: false
      }
    };

    try {
      // Check Odoo connection
      await this.rpcClient.authenticate();
      checks.services.odoo = true;
      logger.info('Odoo connection: OK');
    } catch (error) {
      logger.error('Odoo connection failed:', error);
    }

    try {
      // Check Redis connection
      await this.cache.set('health:check', 'ok', 10);
      const result = await this.cache.get('health:check');
      checks.services.redis = result === 'ok';
      logger.info('Redis connection: OK');
    } catch (error) {
      logger.error('Redis connection failed:', error);
    }

    // Overall status
    const allHealthy = Object.values(checks.services).every(Boolean);
    checks.status = allHealthy ? 'healthy' : 'degraded';

    return checks;
  }

  @Get('ready')
  async readinessCheck() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString()
    };
  }
}
