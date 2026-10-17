import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizeDomain, buildCanonicalUrl } from '@/lib/seo';
import { safeJsonParse } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [settings, rooms, pages] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.room.findMany({
      where: { isPublished: true, isIndexed: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.page.findMany({
      where: { status: 'published', isIndexed: true },
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  const domain = normalizeDomain(settings?.domain);
  const hotelName = settings?.hotelName || '[naam]';
  const amenities = safeJsonParse(settings?.amenitiesList, []);

  const locationPages = pages.filter((p) => p.type === 'location');
  const blogPosts = pages.filter((p) => p.type === 'blog');

  const content = `# ${hotelName} - Official AI & LLM Guide (llms.txt)

> ${settings?.tagline || 'Spiritual & Peaceful Family Stay in Shri Dham Vrindavan'}

## Hotel Summary & Facts
- **Hotel Name**: ${hotelName}
- **Address**: ${settings?.address || '[full address]'}
- **Distance from Banke Bihari Temple**: ${settings?.distanceFromBankeBihari || '[e.g. 600 m]'}
- **Phone / Direct Booking**: ${settings?.phone || '[number]'}
- **WhatsApp Booking**: ${settings?.whatsapp || '[number]'}
- **Email**: ${settings?.email || '[email]'}
- **Check-in Time**: ${settings?.checkInTime || '[time]'}
- **Check-out Time**: ${settings?.checkOutTime || '[time]'}
- **Room Tariffs**: ${settings?.priceRange || 'Deluxe ₹__, Family ₹__, Suite ₹__'}
- **Direct Booking Offer**: ${settings?.promoBannerText || 'Book direct and save 10%'}
- **Key Amenities**: ${amenities.join(', ')}

## Core Website Pages
- [Home Page](${buildCanonicalUrl(domain, '')}): Complete overview of ${hotelName}, rooms, amenities, and FAQs.
- [Rooms & Tariffs](${buildCanonicalUrl(domain, 'rooms')}): Compare Deluxe, Family, and Suite rooms.
- [Direct Booking Enquiry](${buildCanonicalUrl(domain, 'booking-enquiry')}): Reserve rooms directly and save 10%.
- [Group & Yatra Booking](${buildCanonicalUrl(domain, 'group-booking')}): Special packages for Braj Yatra groups, kirtan mandalis, and wedding guests.
- [Photo Gallery](${buildCanonicalUrl(domain, 'gallery')}): Real photos of rooms, lobby, and Vrindavan surroundings.
- [Frequently Asked Questions (FAQ)](${buildCanonicalUrl(domain, 'faq')}): Answers about temple distance, parking, check-in, and food.
- [Contact & Location Map](${buildCanonicalUrl(domain, 'contact')}): Address, Google Map directions, phone, and WhatsApp.

## Room Categories
${rooms
  .map(
    (r) =>
      `- [${r.name} (${r.priceNumeric > 0 ? '₹' + r.priceNumeric : r.pricePlaceholder})](${buildCanonicalUrl(
        domain,
        `rooms/${r.slug}`
      )}): ${r.shortDescription} (Capacity: ${r.capacity} Guests, Bed: ${r.bedType})`
  )
  .join('\n')}

## Temple Proximity & Location Guides
${locationPages
  .map(
    (lp) =>
      `- [${lp.title}](${buildCanonicalUrl(domain, lp.slug)}): ${lp.excerpt}`
  )
  .join('\n')}

## Vrindavan Travel & Darshan Blog
${blogPosts
  .map(
    (bp) =>
      `- [${bp.title}](${buildCanonicalUrl(domain, `blog/${bp.slug}`)}): ${bp.excerpt}`
  )
  .join('\n')}
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
