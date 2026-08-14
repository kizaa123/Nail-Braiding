import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { HAIR_TREE, NAIL_TREE, slugifyName } from './catalog';

function loadEnvFile(file: string) {
  try {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] ??= value;
    }
  } catch {
    /* optional */
  }
}

loadEnvFile(resolve(import.meta.dirname, '../../apps/api/.env'));
loadEnvFile(resolve(import.meta.dirname, '../../.env'));

const prisma = new PrismaClient();

const ARGON: argon2.Options = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 };

const IMAGES = {
  braids: [
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595475878912-0e881b6273df?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80',
  ],
  nails: [
    'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1632345031435-8217dcdd2ee1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1200&q=80',
  ],
  portraits: [
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  ],
};

function variant(url: string, width: number) {
  return url.replace(/w=\d+/, `w=${width}`);
}

async function upsertStyleImage(kind: 'HAIR' | 'NAILS', index: number) {
  const pool = kind === 'HAIR' ? IMAGES.braids : IMAGES.nails;
  return pool[index % pool.length]!;
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@noir-atelier.dev';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe_Admin_123!';

  const adminHash = await argon2.hash(adminPassword, ARGON);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      role: 'ADMIN',
      emailVerifiedAt: new Date(),
      roles: { create: { role: 'ADMIN' } },
    },
  });

  for (const [i, group] of HAIR_TREE.entries()) {
    const category = await prisma.serviceCategory.upsert({
      where: { slug: group.slug },
      update: { name: group.name, kind: 'HAIR', sortOrder: i, isActive: true },
      create: { slug: group.slug, name: group.name, kind: 'HAIR', sortOrder: i },
    });
    for (const [j, name] of group.styles.entries()) {
      await prisma.style.upsert({
        where: { slug: slugifyName(name) },
        update: { name, categoryId: category.id, imageUrl: await upsertStyleImage('HAIR', j) },
        create: {
          slug: slugifyName(name),
          name,
          categoryId: category.id,
          imageUrl: await upsertStyleImage('HAIR', j),
          description: `DEMO catalog style: ${name}. Administrators can edit this without changing application code.`,
        },
      });
    }
  }

  for (const [i, group] of NAIL_TREE.entries()) {
    const category = await prisma.serviceCategory.upsert({
      where: { slug: group.slug },
      update: { name: group.name, kind: 'NAILS', sortOrder: 100 + i, isActive: true },
      create: { slug: group.slug, name: group.name, kind: 'NAILS', sortOrder: 100 + i },
    });
    for (const [j, name] of group.styles.entries()) {
      await prisma.style.upsert({
        where: { slug: slugifyName(name) },
        update: { name, categoryId: category.id, imageUrl: await upsertStyleImage('NAILS', j) },
        create: {
          slug: slugifyName(name),
          name,
          categoryId: category.id,
          imageUrl: await upsertStyleImage('NAILS', j),
          description: `DEMO catalog style: ${name}.`,
        },
      });
    }
  }

  const knotless = await prisma.style.findUniqueOrThrow({ where: { slug: 'knotless-braids' } });
  const boho = await prisma.style.findUniqueOrThrow({ where: { slug: 'boho-braids' } });
  const french = await prisma.style.findUniqueOrThrow({ where: { slug: 'french-tips' } });
  const chrome = await prisma.style.findUniqueOrThrow({ where: { slug: 'chrome' } });
  const acrylic = await prisma.style.findUniqueOrThrow({ where: { slug: 'acrylic' } });
  const braidsCat = await prisma.serviceCategory.findUniqueOrThrow({ where: { slug: 'braids' } });
  const nailTypes = await prisma.serviceCategory.findUniqueOrThrow({ where: { slug: 'nail-types' } });
  const nailStyles = await prisma.serviceCategory.findUniqueOrThrow({ where: { slug: 'nail-styles' } });

  const demoCustomerHash = await argon2.hash('DemoCustomer_123!', ARGON);
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer.demo@noir-atelier.dev' },
    update: {},
    create: {
      email: 'customer.demo@noir-atelier.dev',
      passwordHash: demoCustomerHash,
      role: 'CUSTOMER',
      emailVerifiedAt: new Date(),
      roles: { create: { role: 'CUSTOMER' } },
      customerProfile: {
        create: { firstName: 'Ama', lastName: 'Demo', phone: '+233200000001' },
      },
    },
    include: { customerProfile: true },
  });

  const proHash = await argon2.hash('DemoPro_123!', ARGON);

  const amaraUser = await prisma.user.upsert({
    where: { email: 'amara.demo@noir-atelier.dev' },
    update: {},
    create: {
      email: 'amara.demo@noir-atelier.dev',
      passwordHash: proHash,
      role: 'PROFESSIONAL',
      emailVerifiedAt: new Date(),
      roles: { create: { role: 'PROFESSIONAL' } },
    },
  });

  const amara = await prisma.professionalProfile.upsert({
    where: { userId: amaraUser.id },
    update: { status: 'APPROVED' },
    create: {
      userId: amaraUser.id,
      slug: 'demo-amara-beauty-studio',
      businessName: 'DEMO — Amara Beauty Studio',
      biography:
        'Development showcase studio for knotless braids and protective styles in Accra. This is labeled demo data and is not a real business.',
      locationCity: 'Accra',
      locationRegion: 'Greater Accra',
      locationCountry: 'Ghana',
      phoneNumber: '+233200000010',
      profilePhotoUrl: IMAGES.portraits[0],
      coverPhotoUrl: IMAGES.braids[0],
      status: 'APPROVED',
      ratingAverage: 4.9,
      ratingCount: 18,
      timezone: 'Africa/Accra',
    },
  });

  await prisma.whatsAppContact.upsert({
    where: { professionalId: amara.id },
    update: { phoneE164: '+233200000010', isActive: true, verifiedAt: new Date() },
    create: {
      professionalId: amara.id,
      phoneE164: '+233200000010',
      isActive: true,
      verifiedAt: new Date(),
    },
  });

  const niaUser = await prisma.user.upsert({
    where: { email: 'nia.demo@noir-atelier.dev' },
    update: {},
    create: {
      email: 'nia.demo@noir-atelier.dev',
      passwordHash: proHash,
      role: 'PROFESSIONAL',
      emailVerifiedAt: new Date(),
      roles: { create: { role: 'PROFESSIONAL' } },
    },
  });

  const nia = await prisma.professionalProfile.upsert({
    where: { userId: niaUser.id },
    update: { status: 'APPROVED' },
    create: {
      userId: niaUser.id,
      slug: 'demo-nia-nail-atelier',
      businessName: 'DEMO — Nia Nail Atelier',
      biography:
        'Development showcase nail studio specializing in chrome, French tips, and sculpted acrylic. Demo data only — not a real salon.',
      locationCity: 'Kumasi',
      locationRegion: 'Ashanti',
      locationCountry: 'Ghana',
      phoneNumber: '+233200000011',
      profilePhotoUrl: IMAGES.portraits[1],
      coverPhotoUrl: IMAGES.nails[0],
      status: 'APPROVED',
      ratingAverage: 4.8,
      ratingCount: 24,
      timezone: 'Africa/Accra',
    },
  });

  await prisma.whatsAppContact.upsert({
    where: { professionalId: nia.id },
    update: { phoneE164: '+233200000011', isActive: true, verifiedAt: new Date() },
    create: {
      professionalId: nia.id,
      phoneE164: '+233200000011',
      isActive: true,
      verifiedAt: new Date(),
    },
  });

  await prisma.service.deleteMany({ where: { professionalId: { in: [amara.id, nia.id] } } });
  await prisma.service.createMany({
    data: [
      {
        professionalId: amara.id,
        categoryId: braidsCat.id,
        styleId: knotless.id,
        name: 'Medium Knotless Braids',
        description: 'Shoulder-to-mid-back knotless braids. Demo service.',
        priceMinor: 35000,
        durationMinutes: 240,
      },
      {
        professionalId: amara.id,
        categoryId: braidsCat.id,
        styleId: boho.id,
        name: 'Boho Knotless Braids',
        description: 'Human-hair curl ends, editorial finish. Demo service.',
        priceMinor: 48000,
        durationMinutes: 300,
      },
      {
        professionalId: nia.id,
        categoryId: nailTypes.id,
        styleId: acrylic.id,
        name: 'French Tip Acrylic',
        description: 'Classic French on sculpted acrylic. Demo service.',
        priceMinor: 18000,
        durationMinutes: 120,
      },
      {
        professionalId: nia.id,
        categoryId: nailStyles.id,
        styleId: chrome.id,
        name: 'Chrome Gel Overlay',
        description: 'Mirror chrome finish. Demo service.',
        priceMinor: 22000,
        durationMinutes: 90,
      },
    ],
  });

  await prisma.availability.deleteMany({ where: { professionalId: { in: [amara.id, nia.id] } } });
  const days = ['TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
  await prisma.availability.createMany({
    data: [amara.id, nia.id].flatMap((professionalId) =>
      days.map((dayOfWeek) => ({
        professionalId,
        dayOfWeek,
        startMinutes: 9 * 60,
        endMinutes: 18 * 60,
        timezone: 'Africa/Accra',
      })),
    ),
  });

  await prisma.portfolioItem.deleteMany({ where: { professionalId: { in: [amara.id, nia.id] } } });
  const portfolio = [
    ...IMAGES.braids.map((url, i) => ({
      professionalId: amara.id,
      categoryId: braidsCat.id,
      styleId: i % 2 === 0 ? knotless.id : boho.id,
      url,
    })),
    ...IMAGES.nails.map((url, i) => ({
      professionalId: nia.id,
      categoryId: i % 2 === 0 ? nailTypes.id : nailStyles.id,
      styleId: i % 2 === 0 ? acrylic.id : chrome.id,
      url,
    })),
  ];

  for (const [index, item] of portfolio.entries()) {
    await prisma.portfolioItem.create({
      data: {
        professionalId: item.professionalId,
        categoryId: item.categoryId,
        styleId: item.styleId,
        storageKey: `seed/${index}`,
        url: item.url,
        thumbnailUrl: variant(item.url, 240),
        smallUrl: variant(item.url, 480),
        mediumUrl: variant(item.url, 960),
        largeUrl: variant(item.url, 1600),
        width: 1200,
        height: 1500,
        alt: 'DEMO portfolio image',
        caption: 'Development showcase image. Not a real client.',
        mimeType: 'image/jpeg',
        bytes: 180000,
        moderationStatus: 'APPROVED',
      },
    });
  }

  await prisma.platformSetting.upsert({
    where: { key: 'site.name' },
    update: { value: 'Noir Atelier' },
    create: { key: 'site.name', value: 'Noir Atelier' },
  });

  console.log('Seed complete.');
  console.log(`Admin: ${admin.email}`);
  console.log(`Customer demo: ${customerUser.email} / DemoCustomer_123!`);
  console.log('Professionals: amara.demo@noir-atelier.dev and nia.demo@noir-atelier.dev / DemoPro_123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
