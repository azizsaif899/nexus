import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

interface CacheEntry {
  key: string;
  response: string;
  timestamp: Date;
  hitCount: number;
  expiresAt: Date;
  metadata?: {
    queryType: string;
    responseTime: number;
    confidence: number;
  };
}

@Injectable()
export class ResponseCacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_CACHE_SIZE = 1000;
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.startCleanupTimer();
  }

  generateCacheKey(query: string, context?: string): string {
    const normalizedQuery = this.normalizeQuery(query);
    const contextHash = context ? createHash('md5').update(context).digest('hex').substring(0, 8) : '';
    return createHash('md5').update(normalizedQuery + contextHash).digest('hex');
  }

  async get(query: string, context?: string): Promise<string | null> {
    const key = this.generateCacheKey(query, context);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (new Date() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count and access time
    entry.hitCount++;
    entry.timestamp = new Date();
    this.cache.set(key, entry);

    console.log(`Cache HIT for query: ${query.substring(0, 50)}...`);
    return entry.response;
  }

  async set(
    query: string, 
    response: string, 
    context?: string, 
    ttl?: number,
    metadata?: CacheEntry['metadata']
  ): Promise<void> {
    const key = this.generateCacheKey(query, context);
    const expiresAt = new Date(Date.now() + (ttl || this.DEFAULT_TTL));

    const entry: CacheEntry = {
      key,
      response,
      timestamp: new Date(),
      hitCount: 0,
      expiresAt,
      metadata
    };

    // Check cache size limit
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictLeastUsed();
    }

    this.cache.set(key, entry);
    console.log(`Cache SET for query: ${query.substring(0, 50)}...`);
  }

  async invalidate(query: string, context?: string): Promise<boolean> {
    const key = this.generateCacheKey(query, context);
    return this.cache.delete(key);
  }

  async invalidatePattern(pattern: string): Promise<number> {
    let count = 0;
    const regex = new RegExp(pattern, 'i');

    for (const [key, entry] of this.cache.entries()) {
      if (regex.test(key) || regex.test(entry.response)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    console.log('Cache cleared');
  }

  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\u0600-\u06FF]/g, ''); // Keep Arabic and alphanumeric
  }

  private evictLeastUsed(): void {
    if (this.cache.size === 0) return;

    // Find entry with lowest hit count and oldest timestamp
    let leastUsedKey = '';
    let minScore = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Score based on hit count and age (lower is worse)
      const ageHours = (Date.now() - entry.timestamp.getTime()) / (1000 * 60 * 60);
      const score = entry.hitCount / (ageHours + 1);

      if (score < minScore) {
        minScore = score;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
      console.log(`Evicted least used cache entry: ${leastUsedKey}`);
    }
  }

  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  private cleanup(): void {
    const now = new Date();
    let expiredCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      console.log(`Cleaned up ${expiredCount} expired cache entries`);
    }
  }

  // Analytics and monitoring
  getStats(): any {
    const entries = Array.from(this.cache.values());
    const now = new Date();

    const totalHits = entries.reduce((sum, entry) => sum + entry.hitCount, 0);
    const avgHits = entries.length > 0 ? totalHits / entries.length : 0;
    
    const expiredCount = entries.filter(entry => now > entry.expiresAt).length;
    const activeCount = entries.length - expiredCount;

    const hitDistribution = entries.reduce((acc, entry) => {
      const bucket = entry.hitCount === 0 ? '0' : 
                    entry.hitCount <= 5 ? '1-5' :
                    entry.hitCount <= 20 ? '6-20' : '20+';
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEntries: this.cache.size,
      activeEntries: activeCount,
      expiredEntries: expiredCount,
      totalHits,
      averageHits: Math.round(avgHits * 100) / 100,
      hitDistribution,
      cacheUtilization: Math.round((this.cache.size / this.MAX_CACHE_SIZE) * 100),
      oldestEntry: entries.length > 0 ? 
        Math.min(...entries.map(e => e.timestamp.getTime())) : null,
      newestEntry: entries.length > 0 ? 
        Math.max(...entries.map(e => e.timestamp.getTime())) : null
    };
  }

  getTopQueries(limit: number = 10): Array<{query: string, hits: number}> {
    return Array.from(this.cache.values())
      .sort((a, b) => b.hitCount - a.hitCount)
      .slice(0, limit)
      .map(entry => ({
        query: entry.key.substring(0, 50) + '...',
        hits: entry.hitCount
      }));
  }

  // Cache warming - preload common queries
  async warmCache(commonQueries: Array<{query: string, response: string, context?: string}>): Promise<void> {
    console.log(`Warming cache with ${commonQueries.length} common queries...`);
    
    for (const item of commonQueries) {
      await this.set(item.query, item.response, item.context, this.DEFAULT_TTL * 7); // 7 days for common queries
    }
    
    console.log('Cache warming completed');
  }

  // Export/Import for persistence
  exportCache(): any {
    return {
      timestamp: new Date().toISOString(),
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        ...entry,
        timestamp: entry.timestamp.toISOString(),
        expiresAt: entry.expiresAt.toISOString()
      }))
    };
  }

  importCache(data: any): void {
    if (!data.entries || !Array.isArray(data.entries)) return;

    this.cache.clear();
    
    for (const item of data.entries) {
      const entry: CacheEntry = {
        ...item,
        timestamp: new Date(item.timestamp),
        expiresAt: new Date(item.expiresAt)
      };
      
      // Only import non-expired entries
      if (new Date() < entry.expiresAt) {
        this.cache.set(item.key, entry);
      }
    }
    
    console.log(`Imported ${this.cache.size} cache entries`);
  }
}