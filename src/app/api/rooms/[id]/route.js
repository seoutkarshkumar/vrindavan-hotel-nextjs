import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth';
import { sanitizeHtmlContent, sanitizePlainText, slugify } from '@/lib/sanitize';
import { buildCanonicalUrl, pingIndexNow } from '@/lib/seo';

export async function PUT(request, { params }) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = Number(params.id);
    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const body = await request.json();
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    const domain = settings?.domain || 'https://vrindavanhotel.com';

    const name = sanitizePlainText(body.name ?? existing.name);
    const newSlug = body.slug ? slugify(body.slug) : existing.slug;
    const newSlugPath = `rooms/${newSlug}`;
    const canonicalOverride =
      body.canonicalOverride !== undefined
        ? Boolean(body.canonicalOverride)
        : existing.canonicalOverride;

    const canonicalUrl = buildCanonicalUrl(
      domain,
      newSlugPath,
      body.canonicalUrl || existing.canonicalUrl,
      canonicalOverride
    );

    // Auto 301 redirect if room slug changed
    if (existing.slug !== newSlug) {
      await prisma.redirect.upsert({
        where: { fromPath: `/rooms/${existing.slug}/` },
        update: { toPath: `/rooms/${newSlug}/`, statusCode: 301, isAuto: true },
        create: {
          fromPath: `/rooms/${existing.slug}/`,
          toPath: `/rooms/${newSlug}/`,
          statusCode: 301,
          isAuto: true,
        },
      });
    }

    const room = await prisma.room.update({
      where: { id },
      data: {
        name,
        slug: newSlug,
        pricePlaceholder: sanitizePlainText(
          body.pricePlaceholder ?? existing.pricePlaceholder
        ),
        priceNumeric:
          body.priceNumeric !== undefined
            ? Number(body.priceNumeric)
            : existing.priceNumeric,
        capacity:
          body.capacity !== undefined ? Number(body.capacity) : existing.capacity,
        bedType: sanitizePlainText(body.bedType ?? existing.bedType),
        roomSize: sanitizePlainText(body.roomSize ?? existing.roomSize),
        shortDescription: sanitizePlainText(
          body.shortDescription ?? existing.shortDescription
        ),
        description: sanitizeHtmlContent(body.description ?? existing.description),
        amenities:
          body.amenities !== undefined
            ? typeof body.amenities === 'string'
              ? body.amenities
              : JSON.stringify(body.amenities)
            : existing.amenities,
        images:
          body.images !== undefined
            ? typeof body.images === 'string'
              ? body.images
              : JSON.stringify(body.images)
            : existing.images,
        featured:
          body.featured !== undefined ? Boolean(body.featured) : existing.featured,
        isPublished:
          body.isPublished !== undefined
            ? Boolean(body.isPublished)
            : existing.isPublished,
        sortOrder:
          body.sortOrder !== undefined ? Number(body.sortOrder) : existing.sortOrder,
        seoTitle: sanitizePlainText(body.seoTitle ?? existing.seoTitle),
        metaDescription: sanitizePlainText(
          body.metaDescription ?? existing.metaDescription
        ),
        focusKeyword: sanitizePlainText(body.focusKeyword ?? existing.focusKeyword),
        canonicalUrl,
        canonicalOverride,
        featuredImage: body.featuredImage ?? existing.featuredImage,
        featuredImageAlt: sanitizePlainText(
          body.featuredImageAlt ?? existing.featuredImageAlt
        ),
        ogTitle: sanitizePlainText(body.ogTitle ?? existing.ogTitle),
        ogDescription: sanitizePlainText(
          body.ogDescription ?? existing.ogDescription
        ),
        ogImage: body.ogImage ?? existing.ogImage,
        isIndexed:
          body.isIndexed !== undefined ? Boolean(body.isIndexed) : existing.isIndexed,
        faqs:
          body.faqs !== undefined
            ? typeof body.faqs === 'string'
              ? body.faqs
              : JSON.stringify(body.faqs)
            : existing.faqs,
      },
    });

    await pingIndexNow(domain, [newSlugPath, 'rooms'], settings?.indexNowApiKey);

    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update room.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.room.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
