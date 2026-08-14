import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async dashboard() {
    const cached = await this.redis.get<unknown>('analytics:dashboard');
    if (cached) return cached;

    const [
      totalCustomers,
      totalProfessionals,
      totalBookings,
      completedBookings,
      cancelledBookings,
      pendingProfessionals,
      popularStyles,
      topProfessionals,
      recentUsers,
    ] = await Promise.all([
      this.prisma.customerProfile.count(),
      this.prisma.professionalProfile.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
      this.prisma.professionalProfile.count({ where: { status: 'PENDING' } }),
      this.prisma.service.groupBy({
        by: ['styleId'],
        _count: { styleId: true },
        where: { styleId: { not: null } },
        orderBy: { _count: { styleId: 'desc' } },
        take: 8,
      }),
      this.prisma.professionalProfile.findMany({
        where: { status: 'APPROVED' },
        orderBy: [{ ratingAverage: 'desc' }, { ratingCount: 'desc' }],
        take: 8,
        select: { id: true, businessName: true, ratingAverage: true, ratingCount: true, slug: true },
      }),
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: { id: true, email: true, role: true, createdAt: true },
      }),
    ]);

    const styleIds = popularStyles.map((s) => s.styleId).filter(Boolean) as string[];
    const styles = await this.prisma.style.findMany({ where: { id: { in: styleIds } } });
    const payload = {
      totalCustomers,
      totalProfessionals,
      totalBookings,
      completedBookings,
      cancelledBookings,
      pendingProfessionals,
      popularStyles: popularStyles.map((row) => ({
        styleId: row.styleId,
        name: styles.find((s) => s.id === row.styleId)?.name ?? 'Unknown',
        count: row._count.styleId,
      })),
      topProfessionals,
      recentRegistrations: recentUsers,
    };
    await this.redis.set('analytics:dashboard', payload, 30);
    return payload;
  }

  async professionalOverview(professionalId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const [today, upcoming, completed, profile, popular] = await Promise.all([
      this.prisma.booking.count({
        where: { professionalId, scheduledAt: { gte: start, lt: end }, status: { in: ['PENDING', 'CONFIRMED'] } },
      }),
      this.prisma.booking.findMany({
        where: { professionalId, scheduledAt: { gte: new Date() }, status: { in: ['PENDING', 'CONFIRMED'] } },
        include: { service: true, customer: true },
        orderBy: { scheduledAt: 'asc' },
        take: 8,
      }),
      this.prisma.booking.count({ where: { professionalId, status: 'COMPLETED' } }),
      this.prisma.professionalProfile.findUnique({
        where: { id: professionalId },
        select: { ratingAverage: true, ratingCount: true, profileViews: true },
      }),
      this.prisma.booking.groupBy({
        by: ['serviceId'],
        where: { professionalId },
        _count: { serviceId: true },
        orderBy: { _count: { serviceId: 'desc' } },
        take: 5,
      }),
    ]);
    const services = await this.prisma.service.findMany({
      where: { id: { in: popular.map((p) => p.serviceId) } },
    });
    return {
      todayBookings: today,
      upcoming,
      completedBookings: completed,
      ratingAverage: Number(profile?.ratingAverage ?? 0),
      ratingCount: profile?.ratingCount ?? 0,
      profileViews: profile?.profileViews ?? 0,
      popularServices: popular.map((row) => ({
        serviceId: row.serviceId,
        name: services.find((s) => s.id === row.serviceId)?.name ?? 'Unknown',
        count: row._count.serviceId,
      })),
    };
  }
}
