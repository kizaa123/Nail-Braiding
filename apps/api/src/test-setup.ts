process.env.NODE_ENV ??= 'test';
process.env.DATABASE_URL ??= 'postgresql://beauty:beauty@localhost:5432/beauty_platform_test';
process.env.AUTH_SECRET ??= 'test-auth-secret-must-be-at-least-32-chars';
process.env.REDIS_ENABLED ??= 'false';
process.env.WHATSAPP_CLICK_TO_CHAT_BASE ??= 'https://wa.me';
