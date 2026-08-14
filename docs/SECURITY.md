# Security

- Passwords hashed with Argon2id. Hashes never returned in API responses.
- Sessions: HTTP-only cookies, `SameSite=Lax`, `Secure` in production.
- Authorization on the server (`JwtAuthGuard` + `RolesGuard`). Customers cannot hit professional/admin routes.
- Booking prices, professional IDs, and availability are re-read from the database. Clients cannot set the paid amount.
- Zod validation on mutating endpoints. Prisma parameterized queries.
- Helmet, CORS allowlist, throttling (100 req/min).
- Uploads: MIME allowlist (JPEG/PNG/WebP), size cap 5MB, generated storage keys, Cloudinary remote storage.
- Errors are sanitized. Stack traces stay in server logs.
- Secrets live in environment variables. `.env` is gitignored.
- Admin actions write `AuditLog` rows (actor, action, entity, id, timestamp).
