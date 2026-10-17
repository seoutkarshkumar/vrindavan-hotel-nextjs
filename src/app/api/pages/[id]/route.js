import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi } from '@/lib/auth';
import { sanitizeHtmlContent, sanitizePlainText, slugify } from '@/lib/sanitize';
import { buildCanonicalUrl, pingIndexNow } from '@/lib/seo';

export async function GET(request, { params }) {
  const page = await prisma.page.findUnique({
    where: { id: Number(params.id) },
  });
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ page });
}

export async function PUT(request, { params }) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = Number(params.id);
    const existing = await prisma.page.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const body = await request.json();
    const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    const domain = settings?.domain || 'https://vrindavanhotel.com';

    const title = sanitizePlainText(body.title ?? existing.title);
    const type = body.type ?? existing.type;
    const newSlug =
      existing.slug === 'home'
        ? 'home'
        : body.slug
        ? slugify(body.slug)
        : existing.slug;

    const oldSlugPath =
      existing.type === 'blog'
        ? `/blog/${existing.slug}/`
        : existing.slug === 'home'
        ? '/'
        : `/${existing.slug}/`;

    const newSlugPath =
      type === 'blog'
        ? `blog/${newSlug}`
        : newSlug === 'home'
        ? ''
        : newSlug;

    const canonicalOverride =
      body.canonicalOverride !== undefined
        ? Boolean(body.canonicalOverride)
        : existing.canonicalOverride;

    // Automatically recalculate self-canonical URL when slug changes or override is off
    const canonicalUrl = buildCanonicalUrl(
      domain,
      newSlugPath,
      body.canonicalUrl || existing.canonicalUrl,
      canonicalOverride
    );

    // AUTOMATIC SEO RULE #2: If slug changed, create 301 redirect from old URL -> new URL
    let autoRedirectCreated = null;
    if (existing.slug !== newSlug) {
      const targetPath = `/${newSlugPath}/`.replace(/\/+/g, '/');
      autoRedirectCreated = await prisma.redirect.upsert({
        where: { fromPath: oldSlugPath },
        update: { toPath: targetPath, statusCode: 301, isAuto: true },
        create: {
          fromPath: oldSlugPath,
          toPath: targetPath,
          statusCode: 301,
          isAuto: true,
        },
      });
    }

    const updated = await prisma.page.update({
      where: { id },
      data: {
        type,
        slug: newSlug,
        title,
        excerpt: sanitizePlainText(body.excerpt ?? existing.excerpt),
        content: sanitizeHtmlContent(body.content ?? existing.content),
        category: sanitizePlainText(body.category ?? existing.category),
        tags:
          body.tags !== undefined
            ? typeof body.tags === 'string'
              ? body.tags
              : JSON.stringify(body.tags)
            : existing.tags,
        author: sanitizePlainText(body.author ?? existing.author),
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
        landmarkName: sanitizePlainText(body.landmarkName ?? existing.landmarkName),
        distanceFromHotel: sanitizePlainText(
          body.distanceFromHotel ?? existing.distanceFromHotel
        ),
        status: body.status ?? existing.status,
        publishedAt: body.publishedAt
          ? new Date(body.publishedAt)
          : existing.publishedAt,
      },
    });

    // Ping IndexNow on publish/update
    let indexNowResult = null;
    if (updated.status === 'published' && updated.isIndexed) {
      indexNowResult = await pingIndexNow(
        domain,
        [newSlugPath],
        settings?.indexNowApiKey
      );
    }

    return NextResponse.json({
      page: updated,
      autoRedirectCreated,
      indexNow: indexNowResult,
    });
  } catch (error) {
    console.error('Update page error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update page.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = Number(params.id);
    const existing = await prisma.page.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    if (existing.slug === 'home') {
      return NextResponse.json(
        { error: 'The Home page cannot be deleted.' },
        { status: 400 }
      );
    }

    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
