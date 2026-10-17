import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth';
import { pingIndexNow } from '@/lib/seo';

// GET: Full JSON Backup of all Hotel Website Data (Settings, Pages, Rooms, Enquiries, Redirects, Media)
export async function GET() {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [settings, pages, rooms, enquiries, redirects, media, testimonials] =
    await Promise.all([
      prisma.siteSetting.findFirst(),
      prisma.page.findMany(),
      prisma.room.findMany(),
      prisma.enquiry.findMany(),
      prisma.redirect.findMany(),
      prisma.media.findMany(),
      prisma.testimonial.findMany(),
    ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    settings,
    pages,
    rooms,
    enquiries,
    redirects,
    media,
    testimonials,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="vrindavan-hotel-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json"`,
    },
  });
}

// POST: Manual IndexNow Ping trigger from Admin ("Request Indexing")
export async function POST(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { urls = [] } = await request.json();
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    const domain = settings?.domain || 'https://vrindavanhotel.com';
    const result = await pingIndexNow(domain, urls, settings?.indexNowApiKey);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
