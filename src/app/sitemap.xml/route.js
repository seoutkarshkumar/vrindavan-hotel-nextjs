import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizeDomain, buildCanonicalUrl } from '@/lib/seo';
import { safeJsonParse } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageChunk = Number(searchParams.get('chunk') || 0);

  const [settings, pages, rooms] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.page.findMany({
      where: { status: 'published', isIndexed: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.room.findMany({
      where: { isPublished: true, isIndexed: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  const domain = normalizeDomain(settings?.domain);
  const nowIso = new Date().toISOString();

  // Static core routes (always indexed)
  const staticRoutes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'rooms', priority: '0.9', changefreq: 'weekly' },
    { path: 'gallery', priority: '0.8', changefreq: 'weekly' },
    { path: 'blog', priority: '0.8', changefreq: 'daily' },
    { path: 'faq', priority: '0.8', changefreq: 'weekly' },
    { path: 'contact', priority: '0.8', changefreq: 'monthly' },
    { path: 'group-booking', priority: '0.8', changefreq: 'monthly' },
    { path: 'booking-enquiry', priority: '0.9', changefreq: 'monthly' },
  ];

  const entries = [];

  for (const sr of staticRoutes) {
    entries.push({
      loc: buildCanonicalUrl(domain, sr.path),
      lastmod: settings?.updatedAt ? new Date(settings.updatedAt).toISOString() : nowIso,
      changefreq: sr.changefreq,
      priority: sr.priority,
      image: sr.path === '' ? settings?.defaultOgImage : null,
      imageTitle: settings?.hotelName || '[naam]',
    });
  }

  // Dynamic rooms
  for (const r of rooms) {
    const imgs = safeJsonParse(r.images, []);
    const firstImg = r.featuredImage || (imgs[0] && (imgs[0].url || imgs[0])) || '';
    entries.push({
      loc: buildCanonicalUrl(domain, `rooms/${r.slug}`, r.canonicalUrl, r.canonicalOverride),
      lastmod: new Date(r.updatedAt).toISOString(),
      changefreq: 'weekly',
      priority: '0.9',
      image: firstImg.startsWith('/') ? `${domain}${firstImg}` : firstImg,
      imageTitle: r.featuredImageAlt || r.name,
    });
  }

  // Dynamic published & indexed pages, location pages, and blog posts
  for (const p of pages) {
    if (p.slug === 'home') continue; // Already included in static root
    const slugPath = p.type === 'blog' ? `blog/${p.slug}` : p.slug;
    const imgUrl = p.featuredImage
      ? p.featuredImage.startsWith('/')
        ? `${domain}${p.featuredImage}`
        : p.featuredImage
      : '';
    entries.push({
      loc: buildCanonicalUrl(domain, slugPath, p.canonicalUrl, p.canonicalOverride),
      lastmod: new Date(p.updatedAt).toISOString(),
      changefreq: p.type === 'blog' ? 'weekly' : 'monthly',
      priority: p.type === 'location' ? '0.9' : '0.8',
      image: imgUrl,
      imageTitle: p.featuredImageAlt || p.title,
    });
  }

  // Automatic Sitemap Index splitting if > 500 URLs
  const MAX_URLS_PER_SITEMAP = 500;
  if (entries.length > MAX_URLS_PER_SITEMAP && !pageChunk) {
    const totalChunks = Math.ceil(entries.length / MAX_URLS_PER_SITEMAP);
    const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from({ length: totalChunks })
  .map(
    (_, idx) => `  <sitemap>
    <loc>${domain}/sitemap.xml?chunk=${idx + 1}</loc>
    <lastmod>${nowIso}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

    return new NextResponse(sitemapIndexXml, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }

  const sliceStart = pageChunk > 0 ? (pageChunk - 1) * MAX_URLS_PER_SITEMAP : 0;
  const activeEntries =
    pageChunk > 0
      ? entries.slice(sliceStart, sliceStart + MAX_URLS_PER_SITEMAP)
      : entries;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${activeEntries
  .map(
    (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>${
      item.image
        ? `
    <image:image>
      <image:loc>${escapeXml(item.image)}</image:loc>
      <image:title>${escapeXml(item.imageTitle || '')}</image:title>
    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600',
    },
  });
}
