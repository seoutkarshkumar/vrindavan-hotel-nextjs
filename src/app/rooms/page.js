import Link from 'next/link';
import Image from 'next/image';
import { Users, BedDouble, CheckCircle2 } from 'lucide-react';
import prisma from '@/lib/prisma';
import { generateNextMetadata, buildJsonLdSchemas } from '@/lib/seo';
import { safeJsonParse } from '@/lib/sanitize';
import { Header, Footer, StickyContactBar } from '@/components/PublicLayout';
import { JsonLdScript, Breadcrumbs } from '@/components/SeoBlocks';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const hotelName = settings?.hotelName || '[naam]';
  return generateNextMetadata({
    settings,
    title: `Rooms & Tariffs at ${hotelName}, Vrindavan`,
    seoTitle: `Rooms & Tariffs (${settings?.priceRange || 'Deluxe ₹__, Family ₹__, Suite ₹__'}) | ${hotelName}`,
    metaDescription: `Compare Deluxe (₹__), Family (₹__) and Suite (₹__) rooms at ${hotelName}, located ${settings?.distanceFromBankeBihari || '[e.g. 600 m]'} from Banke Bihari Temple, Vrindavan. Book direct & save 10%.`,
    slugPath: 'rooms',
  });
}

export default async function RoomsListingPage() {
  const [settings, rooms] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.room.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    }),
  ]);

  const hotelName = settings?.hotelName || '[naam]';
  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: 'Rooms & Tariffs', path: 'rooms' },
  ];

  const schemas = buildJsonLdSchemas({
    settings,
    slugPath: 'rooms',
    title: `Rooms & Tariffs at ${hotelName}`,
    breadcrumbs,
  });

  return (
    <>
      <JsonLdScript schemas={schemas} />
      <Header settings={settings} />
      <Breadcrumbs items={breadcrumbs} />

      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Book Direct &amp; Save 10%
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-1">
            Rooms &amp; Suites at {hotelName}, Vrindavan
          </h1>
          <p className="text-stone-600 mt-2 text-base">
            Located just <strong>{settings?.distanceFromBankeBihari || '[e.g. 600 m]'}</strong> from Shri Banke Bihari Temple at{' '}
            <strong>{settings?.address || '[full address]'}</strong>. Standard Check-in / Check-out:{' '}
            <strong>{settings?.checkInTime || '[time]'}</strong>.
          </p>
        </div>

        <div className="space-y-8">
          {rooms.map((room) => {
            const amenities = safeJsonParse(room.amenities, []);
            const imgUrl =
              room.featuredImage ||
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80';
            return (
              <article
                key={room.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="lg:col-span-5 relative min-h-[260px] bg-stone-200">
                  <Image
                    src={imgUrl}
                    alt={room.featuredImageAlt || `${room.name} at ${hotelName}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-2xl font-serif font-bold text-stone-900">
                        <Link
                          href={`/rooms/${room.slug}/`}
                          className="hover:text-brand-700"
                        >
                          {room.name}
                        </Link>
                      </h2>
                      <div className="px-4 py-1.5 rounded-xl bg-brand-700 text-white font-bold text-base">
                        {room.priceNumeric > 0
                          ? `₹${room.priceNumeric}`
                          : room.pricePlaceholder}{' '}
                        <span className="text-xs font-normal">/ night</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-stone-600 mt-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-brand-700" /> Up to{' '}
                        {room.capacity} Guests
                      </span>
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4 text-brand-700" /> {room.bedType}
                      </span>
                    </div>

                    <p className="text-stone-700 text-sm md:text-base mt-3">
                      {room.shortDescription}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                      {amenities.map((am, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-xs text-stone-700 font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                          <span>{am}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex flex-wrap gap-3">
                    <Link
                      href={`/rooms/${room.slug}/`}
                      className="px-5 py-2.5 rounded-xl border border-brand-700 text-brand-700 hover:bg-brand-50 text-xs font-bold"
                    >
                      View Full Details &amp; FAQs
                    </Link>
                    <Link
                      href={`/booking-enquiry/?room=${encodeURIComponent(room.name)}`}
                      className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow"
                    >
                      Book Direct &amp; Save 10%
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
