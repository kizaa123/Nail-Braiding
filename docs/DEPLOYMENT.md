# Deployment

Deploy **web** and **api** separately.

## Frontend (Vercel)

- Root: `apps/web`
- Env: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`
- Framework preset: Next.js

## API (Render / Railway / AWS)

- Root: `apps/api`
- Start: `npm run start:prod` after `prisma migrate deploy` and `prisma generate`
- Env: see [ENVIRONMENT.md](ENVIRONMENT.md)
- Attach managed PostgreSQL and Redis
- Set `AUTH_COOKIE_SECURE=true` and a 64+ character `AUTH_SECRET`
- Set `CORS_ORIGINS` to the Vercel origin
- Configure Cloudinary for production uploads

## Images

Production: Cloudinary. If credentials are absent, the API uses a local-dev adapter suitable only for development.

## WhatsApp

Click-to-chat URLs are generated after the booking row exists. Swap `WhatsAppService` for the official Business API later without changing the booking engine.
