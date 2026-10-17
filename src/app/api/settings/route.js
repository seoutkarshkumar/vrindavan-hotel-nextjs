export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth';
import { sanitizePlainText } from '@/lib/sanitize';
import { normalizeDomain } from '@/lib/seo';

export async function GET() {
  let settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.siteSetting.create({ data: { id: 1 } });
  }
  return NextResponse.json({ settings });
}

export async function PUT(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const domain = normalizeDomain(body.domain || 'https://vrindavanhotel.com');

    const updated = await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: {
        hotelName: sanitizePlainText(body.hotelName || '[naam]'),
        tagline: sanitizePlainText(body.tagline || ''),
        brandColor: sanitizePlainText(body.brandColor || '#c2410c'),
        domain,
        phone: sanitizePlainText(body.phone || '[number]'),
        whatsapp: sanitizePlainText(body.whatsapp || '[number]'),
        email: sanitizePlainText(body.email || '[email]'),
        address: sanitizePlainText(body.address || '[full address]'),
        distanceFromBankeBihari: sanitizePlainText(
          body.distanceFromBankeBihari || '[e.g. 600 m]'
        ),
        checkInTime: sanitizePlainText(body.checkInTime || '[time]'),
        checkOutTime: sanitizePlainText(body.checkOutTime || '[time]'),
        priceRange: sanitizePlainText(
          body.priceRange || 'Deluxe ₹__, Family ₹__, Suite ₹__'
        ),
        amenitiesList:
          typeof body.amenitiesList === 'string'
            ? body.amenitiesList
            : JSON.stringify(body.amenitiesList || []),
        logoUrl: body.logoUrl || '',
        mapEmbedUrl: body.mapEmbedUrl || '',
        geoLatitude: sanitizePlainText(body.geoLatitude || '27.5806'),
        geoLongitude: sanitizePlainText(body.geoLongitude || '77.6913'),
        googleBusinessUrl: body.googleBusinessUrl || '',
        facebookUrl: body.facebookUrl || '',
        instagramUrl: body.instagramUrl || '',
        youtubeUrl: body.youtubeUrl || '',
        googleAnalyticsId: sanitizePlainText(body.googleAnalyticsId || ''),
        searchConsoleCode: sanitizePlainText(body.searchConsoleCode || ''),
        indexNowApiKey: sanitizePlainText(
          body.indexNowApiKey || 'vrindavan-hotel-indexnow-key-2026'
        ),
        defaultMetaTitle: sanitizePlainText(body.defaultMetaTitle || ''),
        defaultMetaDescription: sanitizePlainText(body.defaultMetaDescription || ''),
        defaultOgImage: body.defaultOgImage || '',
        robotsTxtCustom: body.robotsTxtCustom || '',
        promoBannerText: sanitizePlainText(body.promoBannerText || ''),
      },
      create: {
        id: 1,
        hotelName: sanitizePlainText(body.hotelName || '[naam]'),
        domain,
      },
    });

    return NextResponse.json({ settings: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update site settings.' },
      { status: 500 }
    );
  }
}

