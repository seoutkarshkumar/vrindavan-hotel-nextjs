import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth';
import { sanitizeHtmlContent, sanitizePlainText, slugify } from '@/lib/sanitize';
import { buildCanonicalUrl, pingIndexNow } from '@/lib/seo';

export async function GET() {
  const rooms = await prisma.room.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
  return NextResponse.json({ rooms });
}

export async function POST(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    const domain = settings?.domain || 'https://vrindavanhotel.com';

    const name = sanitizePlainText(body.name || 'New Room');
    const slug = body.slug ? slugify(body.slug) : slugify(name);
    const slugPath = `rooms/${slug}`;
    const canonicalOverride = Boolean(body.canonicalOverride);
    const canonicalUrl = buildCanonicalUrl(
      domain,
      slugPath,
      body.canonicalUrl || '',
      canonicalOverride
    );

    const room = await prisma.room.create({
      data: {
        name,
        slug,
        pricePlaceholder: sanitizePlainText(body.pricePlaceholder || '₹__'),
        priceNumeric: Number(body.priceNumeric) || 0,
        capacity: Number(body.capacity) || 2,
        bedType: sanitizePlainText(body.bedType || '1 King Bed'),
        roomSize: sanitizePlainText(body.roomSize || '[Room Size sq ft]'),
        shortDescription: sanitizePlainText(body.shortDescription || ''),
        description: sanitizeHtmlContent(body.description || ''),
        amenities:
          typeof body.amenities === 'string'
            ? body.amenities
            : JSON.stringify(body.amenities || []),
        images:
          typeof body.images === 'string'
            ? body.images
            : JSON.stringify(body.images || []),
        featured: body.featured !== undefined ? Boolean(body.featured) : true,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        sortOrder: Number(body.sortOrder) || 0,
        seoTitle: sanitizePlainText(body.seoTitle || ''),
        metaDescription: sanitizePlainText(body.metaDescription || ''),
        focusKeyword: sanitizePlainText(body.focusKeyword || ''),
        canonicalUrl,
        canonicalOverride,
        featuredImage: body.featuredImage || '',
        featuredImageAlt: sanitizePlainText(body.featuredImageAlt || name),
        ogTitle: sanitizePlainText(body.ogTitle || ''),
        ogDescription: sanitizePlainText(body.ogDescription || ''),
        ogImage: body.ogImage || '',
        isIndexed: body.isIndexed !== undefined ? Boolean(body.isIndexed) : true,
        faqs: typeof body.faqs === 'string' ? body.faqs : JSON.stringify(body.faqs || []),
      },
    });

    await pingIndexNow(domain, [slugPath, 'rooms'], settings?.indexNowApiKey);

    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create room.' },
      { status: 500 }
    );
  }
}
