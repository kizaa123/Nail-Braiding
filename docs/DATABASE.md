# Database

PostgreSQL + Prisma. Schema: `database/prisma/schema.prisma`.

## Entities

User, UserRoleAssignment, CustomerProfile, ProfessionalProfile, ServiceCategory, Style, Service, PortfolioItem, Availability, AvailabilityException, Booking, Favorite, Review, Notification, WhatsAppContact, AuditLog, Session, EmailVerificationToken, PasswordResetToken, PlatformSetting.

UUIDs on primary keys. `createdAt` / `updatedAt` on mutable records.

## Indexes

Email uniqueness, professional location and rating, category/style, booking status/date/professional/customer, favorite uniqueness `(customerId, targetType, targetId)`, one review per booking.

## Double booking

1. Serializable transaction
2. `SELECT … FOR UPDATE` on the professional row
3. Overlap query on `PENDING` and `CONFIRMED` bookings
4. Optional GiST exclusion constraint: `database/prisma/exclusion.sql`

Apply after the first Prisma migration:

```bash
psql $DATABASE_URL -f database/prisma/exclusion.sql
```

## Images

Portfolio stores Cloudinary (or CDN) URLs and variants only. No binary columns.

## Seed

`npm run db:seed` loads hair/nail catalogs from `database/prisma/catalog.ts` plus labeled DEMO professionals.
