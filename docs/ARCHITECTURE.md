# Architecture

Noir Atelier is a modular monolith split into two deployable apps.

```
USER → CDN / Next.js (apps/web) → NestJS REST (apps/api)
  → Auth / validation / domain services
  → PostgreSQL + Redis + Cloudinary
  → WhatsApp click-to-chat (replaceable with Business API)
```

## Apps

- **web**: discovery, booking UI, dashboards. Server Components for public catalogs; client components for authenticated mutations.
- **api**: source of truth for prices, availability, bookings, roles, and WhatsApp URL generation.

## Packages

- `@beauty/types` — shared enums and DTO shapes
- `@beauty/validation` — Zod contracts used by the API (and available to the web)
- `@beauty/config` — API environment schema
- `@beauty/ui` — design tokens (ivory, espresso, champagne; Cormorant + Outfit)

## Domain modules (API)

Auth, Users, Customers, Professionals, Services, Categories, Styles, Portfolio, Bookings, Availability, Favorites, Reviews, Notifications, WhatsApp, Admin, Analytics, Audit.

Authorization is enforced with JWT HTTP-only cookies + `RolesGuard`. Frontend route hiding is not trusted.

## Extension points (not built yet)

Payments/deposits, subscriptions, promotions, maps/nearby, staff/branches, WhatsApp Business API, SMS/email marketing, commissions.
