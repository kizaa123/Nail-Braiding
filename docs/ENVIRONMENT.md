# Environment

Copy `.env.example` to `apps/api/.env` and `apps/web/.env.example` to `apps/web/.env.local`. Never commit real secrets.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | API | PostgreSQL |
| `REDIS_URL` | API | Cache (memory fallback if Redis is down) |
| `AUTH_SECRET` | API | JWT signing (≥ 32 chars) |
| `CORS_ORIGINS` | API | Comma-separated browser origins |
| `CLOUDINARY_*` | API | Image storage |
| `SMTP_*` | API | Email (console logger if unset) |
| `WHATSAPP_CLICK_TO_CHAT_BASE` | API | Default `https://wa.me` |
| `NEXT_PUBLIC_API_URL` | Web | Browser/server API origin |
| `NEXT_PUBLIC_SITE_URL` | Web | Canonical site URL / sitemap |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Seed | Development admin only |
