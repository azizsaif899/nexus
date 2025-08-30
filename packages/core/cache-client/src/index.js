"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheClient = void 0;
const redis_1 = require("redis");
class CacheClient {
    constructor(url = 'redis://localhost:6379') {
        this.connected = false;
        this.client = (0, redis_1.createClient)({ url });
        this.client.on('error', (err) => console.error('Redis Error:', err));
    }
    async connect() {
        if (!this.connected) {
            await this.client.connect();
            this.connected = true;
        }
    }
    async set(key, value, ttlSeconds = 300) {
        await this.connect();
        await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
    }
    async get(key) {
        await this.connect();
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }
    async del(key) {
        await this.connect();
        await this.client.del(key);
    }
    async exists(key) {
        await this.connect();
        return (await this.client.exists(key)) === 1;
    }
    // Cache wrapper for Odoo API calls
    async cacheOdooCall(key, apiCall, ttlSeconds = 300) {
        const cached = await this.get(key);
        if (cached)
            return cached;
        const result = await apiCall();
        await this.set(key, result, ttlSeconds);
        return result;
    }
    async disconnect() {
        if (this.connected) {
            await this.client.disconnect();
            this.connected = false;
        }
    }
}
exports.CacheClient = CacheClient;
//# sourceMappingURL=index.js.map