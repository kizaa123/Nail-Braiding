# Noir Atelier — Hair braiding & nail booking platform

Premium marketplace connecting customers with braiders and nail technicians. Bookings are created on the server, then confirmed on WhatsApp.

## Architecture

```
apps/web   Next.js 15 App Router (Vercel)
apps/api   NestJS REST API (Render / Railway / AWS)
packages/  shared types, validation, config, design tokens
database/  Prisma schema, seeds, exclusion constraint
```

Frontend and API deploy independently. PostgreSQL holds relational data. Redis caches public catalogs. Images live in Cloudinary (or local-dev object URLs) — never in Postgres.

## Local setup

1. Copy environment files:

```bash
copy .env.example apps\api\.env
copy apps\web\.env.example apps\web\.env.local
```

2. Start Postgres and Redis:

```bash
docker compose up -d
```

3. Install, migrate, seed:

```bash
npm install
npm run db:generate
npm run db:migrate:dev
npm run db:seed
```

4. Run the apps:

```bash
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:4000/api/health

## Demo accounts (development only)

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@noir-atelier.dev | ChangeMe_Admin_123! |
| Customer | customer.demo@noir-atelier.dev | DemoCustomer_123! |
| Professional | amara.demo@noir-atelier.dev | DemoPro_123! |
| Professional | nia.demo@noir-atelier.dev | DemoPro_123! |

Demo studios are labeled **DEMO** and are not real businesses.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | API + web |
| `npm run lint` | Lint workspaces |
| `npm run typecheck` | TypeScript |
| `npm run test` | Unit tests |
| `npm run db:seed` | Catalog + demo data |

## Docs

- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [API.md](docs/API.md)
- [DATABASE.md](docs/DATABASE.md)
- [SECURITY.md](docs/SECURITY.md)
- [DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [ENVIRONMENT.md](docs/ENVIRONMENT.md)
