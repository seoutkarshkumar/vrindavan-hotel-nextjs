import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizeDomain } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const domain = normalizeDomain(settings?.domain);

  if (settings?.robotsTxtCustom && settings.robotsTxtCustom.trim() !== '') {
    return new NextResponse(settings.robotsTxtCustom.trim() + '\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const defaultRobots = `# robots.txt for ${settings?.hotelName || '[naam]'} (${domain})
# Explicitly welcoming Google, Bing, and AI Answer Engines

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: ClaudeBot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: PerplexityBot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Google-Extended
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${domain}/sitemap.xml
`;

  return new NextResponse(defaultRobots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
