import { createClient, RedisClientType } from 'redis';

export class CacheClient {
  private client: RedisClientType;
  private connected = false;

  constructor(url = 'redis://localhost:6379') {
    this.client = createClient({ url });
    this.client.on('error', (err) => console.error('Redis Error:', err));
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    await this.connect();
    await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    await this.connect();
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.connect();
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    await this.connect();
    return (await this.client.exists(key)) === 1;
  }

  // Cache wrapper for Odoo API calls
  async cacheOdooCall<T>(
    key: string,
    apiCall: () => Promise<T>,
    ttlSeconds = 300
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const result = await apiCall();
    await this.set(key, result, ttlSeconds);
    return result;
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.disconnect();
      this.connected = false;
    }
  }
}