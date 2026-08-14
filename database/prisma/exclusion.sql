-- Prevent overlapping active bookings for the same professional.
-- Applied after the Prisma initial migration.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
  ADD CONSTRAINT booking_no_overlap
  EXCLUDE USING gist (
    "professionalId" WITH =,
    tstzrange("scheduledAt", "endAt", '[)') WITH &&
  )
  WHERE (status IN ('PENDING', 'CONFIRMED'));
