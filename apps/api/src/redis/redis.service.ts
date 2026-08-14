import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { loadEnv } from '../config/env';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private readonly memory = new Map<string, { value: string; expiresAt: number }>();
  private readonly enabled: boolean;

  constructor() {
    const env = loadEnv();
    this.enabled = env.REDIS_ENABLED && env.NODE_ENV !== 'test';
    if (this.enabled) {
      this.client = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 2,
        lazyConnect: true,
      });
      this.client.on('error', (err) => {
        this.logger.warn(`Redis unavailable, falling back to memory: ${err.message}`);
      });
      void this.client.connect().catch((err: Error) => {
        this.logger.warn(`Redis connect failed: ${err.message}`);
        this.client = null;
      });
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.client?.status === 'ready') {
        const raw = await this.client.get(key);
        return raw ? (JSON.parse(raw) as T) : null;
      }
    } catch {
      /* memory fallback */
    }
    const hit = this.memory.get(key);
    if (!hit || hit.expiresAt < Date.now()) {
      this.memory.delete(key);
      return null;
    }
    return JSON.parse(hit.value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    const serialized = JSON.stringify(value);
    try {
      if (this.client?.status === 'ready') {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
        return;
      }
    } catch {
      /* memory fallback */
    }
    this.memory.set(key, { value: serialized, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  async del(key: string): Promise<void> {
    try {
      if (this.client?.status === 'ready') {
        await this.client.del(key);
      }
    } catch {
      /* ignore */
    }
    this.memory.delete(key);
  }

  async delByPrefix(prefix: string): Promise<void> {
    for (const key of [...this.memory.keys()]) {
      if (key.startsWith(prefix)) this.memory.delete(key);
    }
    try {
      if (this.client?.status === 'ready') {
        const keys = await this.client.keys(`${prefix}*`);
        if (keys.length) await this.client.del(...keys);
      }
    } catch {
      /* ignore */
    }
  }
}
