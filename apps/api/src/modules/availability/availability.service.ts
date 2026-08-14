import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Errors } from '../../common/errors';
import {
  addMinutes,
  dayOfWeekFromDate,
  minutesFromMidnight,
} from '../../common/utils';

const ACTIVE_BOOKING = ['PENDING', 'CONFIRMED'] as const;

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async setWeekly(
    professionalId: string,
    slots: Array<{
      dayOfWeek:
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY'
        | 'SUNDAY';
      startMinutes: number;
      endMinutes: number;
      timezone?: string;
      isActive?: boolean;
    }>,
  ) {
    for (const slot of slots) {
      if (slot.endMinutes <= slot.startMinutes) {
        throw Errors.validation('Availability end must be after start.');
      }
    }
    await this.prisma.$transaction([
      this.prisma.availability.deleteMany({ where: { professionalId } }),
      this.prisma.availability.createMany({
        data: slots.map((s) => ({
          professionalId,
          dayOfWeek: s.dayOfWeek,
          startMinutes: s.startMinutes,
          endMinutes: s.endMinutes,
          timezone: s.timezone ?? 'Africa/Accra',
          isActive: s.isActive ?? true,
        })),
      }),
    ]);
    return this.prisma.availability.findMany({ where: { professionalId } });
  }

  async list(professionalId: string) {
    return this.prisma.availability.findMany({
      where: { professionalId, isActive: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startMinutes: 'asc' }],
    });
  }

  async slotsForDate(professionalId: string, isoDate: string, durationMinutes: number) {
    const professional = await this.prisma.professionalProfile.findUnique({
      where: { id: professionalId },
    });
    if (!professional) throw Errors.notFound('Professional');
    const timezone = professional.timezone;
    const date = new Date(`${isoDate}T00:00:00.000Z`);
    const day = dayOfWeekFromDate(date, timezone) as
      | 'MONDAY'
      | 'TUESDAY'
      | 'WEDNESDAY'
      | 'THURSDAY'
      | 'FRIDAY'
      | 'SATURDAY'
      | 'SUNDAY';

    const exception = await this.prisma.availabilityException.findFirst({
      where: { professionalId, date: new Date(isoDate) },
    });
    if (exception?.isBlocked && !exception.startMinutes) {
      return [];
    }

    const windows = await this.prisma.availability.findMany({
      where: { professionalId, dayOfWeek: day, isActive: true },
    });

    const dayStart = this.zonedDayStart(isoDate, timezone);
    const bookings = await this.prisma.booking.findMany({
      where: {
        professionalId,
        status: { in: [...ACTIVE_BOOKING] },
        scheduledAt: { gte: dayStart, lt: addMinutes(dayStart, 24 * 60) },
      },
    });

    const slots: string[] = [];
    for (const window of windows) {
      for (let start = window.startMinutes; start + durationMinutes <= window.endMinutes; start += 30) {
        if (exception?.isBlocked && exception.startMinutes != null && exception.endMinutes != null) {
          if (start < exception.endMinutes && start + durationMinutes > exception.startMinutes) {
            continue;
          }
        }
        const scheduledAt = addMinutes(dayStart, start);
        const endAt = addMinutes(scheduledAt, durationMinutes);
        const overlaps = bookings.some((b) => b.scheduledAt < endAt && b.endAt > scheduledAt);
        if (!overlaps && scheduledAt > new Date()) {
          slots.push(scheduledAt.toISOString());
        }
      }
    }
    return slots;
  }

  async assertAvailable(professionalId: string, scheduledAt: Date, endAt: Date, timezone: string) {
    if (scheduledAt <= new Date()) {
      throw Errors.validation('Bookings must be in the future.');
    }
    const isoDate = scheduledAt.toISOString().slice(0, 10);
    const day = dayOfWeekFromDate(scheduledAt, timezone) as
      | 'MONDAY'
      | 'TUESDAY'
      | 'WEDNESDAY'
      | 'THURSDAY'
      | 'FRIDAY'
      | 'SATURDAY'
      | 'SUNDAY';
    const startMinutes = minutesFromMidnight(scheduledAt, timezone);
    const endMinutes = minutesFromMidnight(endAt, timezone);
    const window = await this.prisma.availability.findFirst({
      where: {
        professionalId,
        dayOfWeek: day,
        isActive: true,
        startMinutes: { lte: startMinutes },
        endMinutes: { gte: endMinutes || 24 * 60 },
      },
    });
    if (!window) throw Errors.conflict('Selected time is outside the professional\'s availability.');

    const exception = await this.prisma.availabilityException.findFirst({
      where: { professionalId, date: new Date(isoDate) },
    });
    if (exception?.isBlocked) {
      throw Errors.conflict('The professional is unavailable on this date.');
    }
  }

  private zonedDayStart(isoDate: string, _timezone: string): Date {
    return new Date(`${isoDate}T00:00:00.000Z`);
  }
}
