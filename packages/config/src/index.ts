import { z } from 'zod';

export const apiEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  API_HOST: z.string().default('0.0.0.0'),
  PUBLIC_API_URL: z.string().url().default('http://localhost:4000'),
  WEB_ORIGIN: z.string().url().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_ENABLED: z
    .string()
    .default('true')
    .transform((v) => v === 'true' || v === '1'),
  AUTH_SECRET: z.string().min(32),
  AUTH_COOKIE_NAME: z.string().default('bp_session'),
  AUTH_ACCESS_TTL: z.string().default('15m'),
  AUTH_REFRESH_TTL: z.string().default('7d'),
  AUTH_COOKIE_SECURE: z
    .string()
    .default('false')
    .transform((v) => v === 'true' || v === '1'),
  AUTH_COOKIE_DOMAIN: z.string().optional().default(''),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().default('Noir Atelier <noreply@example.com>'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  IMAGE_MAX_BYTES: z.coerce.number().int().default(5_242_880),
  IMAGE_MAX_WIDTH: z.coerce.number().int().default(4096),
  IMAGE_MAX_HEIGHT: z.coerce.number().int().default(4096),
  WHATSAPP_COUNTRY_CODE: z.string().default('233'),
  WHATSAPP_CLICK_TO_CHAT_BASE: z.string().url().default('https://wa.me'),
  SEED_ADMIN_EMAIL: z.string().email().default('admin@noir-atelier.dev'),
  SEED_ADMIN_PASSWORD: z.string().min(10).default('ChangeMe_Admin_123!'),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;
