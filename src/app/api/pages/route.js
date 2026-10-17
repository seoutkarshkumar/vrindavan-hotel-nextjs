import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth';
import { sanitizeHtmlContent, sanitizePlainText, slugify } from '@/lib/sanitize';
import { buildCanonicalUrl, pingIndexNow } from '@/lib/seo';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');

  const where = {};
  if (type) where.type = type;
  if (status) where.status = status;

  const pages = await prisma.page.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ pages });
}

export async function POST(request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    const domain = settings?.domain || 'https://vrindavanhotel.com';

    const title = sanitizePlainText(body.title || 'Untitled Page');
    const type = body.type || 'page';
    const rawSlug = body.slug ? slugify(body.slug) : slugify(title);
    const slug = rawSlug || `page-${Date.now()}`;

    const slugPath = type === 'blog' ? `blog/${slug}` : slug === 'home' ? '' : slug;
    const canonicalOverride = Boolean(body.canonicalOverride);
    const canonicalUrl = buildCanonicalUrl(
      domain,
      slugPath,
      body.canonicalUrl || '',
      canonicalOverride
    );

    const created = await prisma.page.create({
      data: {
        type,
        slug,
        title,
        excerpt: sanitizePlainText(body.excerpt || ''),
        content: sanitizeHtmlContent(body.content || ''),
        category: sanitizePlainText(body.category || 'General'),
        tags: typeof body.tags === 'string' ? body.tags : JSON.stringify(body.tags || []),
        author: sanitizePlainText(body.author || settings?.hotelName || 'Hotel Team'),
        seoTitle: sanitizePlainText(body.seoTitle || ''),
        metaDescription: sanitizePlainText(body.metaDescription || ''),
        focusKeyword: sanitizePlainText(body.focusKeyword || ''),
        canonicalUrl,
        canonicalOverride,
        featuredImage: body.featuredImage || '',
        featuredImageAlt: sanitizePlainText(body.featuredImageAlt || title),
        ogTitle: sanitizePlainText(body.ogTitle || ''),
        ogDescription: sanitizePlainText(body.ogDescription || ''),
        ogImage: body.ogImage || '',
        isIndexed: body.isIndexed !== undefined ? Boolean(body.isIndexed) : true,
        faqs: typeof body.faqs === 'string' ? body.faqs : JSON.stringify(body.faqs || []),
        landmarkName: sanitizePlainText(body.landmarkName || ''),
        distanceFromHotel: sanitizePlainText(body.distanceFromHotel || ''),
        status: body.status || 'published',
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });

    // Ping IndexNow if published & indexed
    let indexNowResult = null;
    if (created.status === 'published' && created.isIndexed) {
      indexNowResult = await pingIndexNow(
        domain,
        [slugPath],
        settings?.indexNowApiKey
      );
    }

    return NextResponse.json({ page: created, indexNow: indexNowResult });
  } catch (error) {
    console.error('Create page error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create page.' },
      { status: 500 }
    );
  }
}
