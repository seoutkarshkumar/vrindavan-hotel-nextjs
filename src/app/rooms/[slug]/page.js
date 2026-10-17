import Link from 'next/link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { Users, BedDouble, CheckCircle2, MapPin, Clock } from 'lucide-react';
import prisma from '@/lib/prisma';
import { generateNextMetadata, buildJsonLdSchemas } from '@/lib/seo';
import { safeJsonParse } from '@/lib/sanitize';
import { Header, Footer, StickyContactBar } from '@/components/PublicLayout';
import BookingEnquiryForm from '@/components/BookingEnquiryForm';
import { JsonLdScript, Breadcrumbs, FaqSection } from '@/components/SeoBlocks';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const [settings, room] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.room.findUnique({ where: { slug: params.slug } }),
  ]);

  if (!room) return {};

  return generateNextMetadata({
    settings,
    title: room.name,
    seoTitle: room.seoTitle,
    metaDescription: room.metaDescription,
    excerpt: room.shortDescription,
    slugPath: `rooms/${room.slug}`,
    canonicalUrl: room.canonicalUrl,
    canonicalOverride: room.canonicalOverride,
    featuredImage: room.featuredImage,
    ogTitle: room.ogTitle,
    ogDescription: room.ogDescription,
    ogImage: room.ogImage,
    isIndexed: room.isIndexed,
  });
}

export default async function RoomDetailPage({ params }) {
  const slug = params.slug;

  // Check if a 301 redirect exists for this room slug
  const redirectRecord = await prisma.redirect.findUnique({
    where: { fromPath: `/rooms/${slug}/` },
  });
  if (redirectRecord) {
    permanentRedirect(redirectRecord.toPath);
  }

  const [settings, room, allRooms] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.room.findUnique({ where: { slug } }),
    prisma.room.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  if (!room || !room.isPublished) {
    notFound();
  }

  const hotelName = settings?.hotelName || '[naam]';
  const amenities = safeJsonParse(room.amenities, []);
  const images = safeJsonParse(room.images, []);
  const faqs = safeJsonParse(room.faqs, []);
  const otherRooms = allRooms.filter((r) => r.id !== room.id);

  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: 'Rooms & Tariffs', path: 'rooms' },
    { name: room.name, path: `rooms/${room.slug}` },
  ];

  const schemas = buildJsonLdSchemas({
    settings,
    pageType: 'room',
    slugPath: `rooms/${room.slug}`,
    title: room.name,
    description: room.metaDescription || room.shortDescription,
    featuredImage: room.featuredImage,
    faqs,
    breadcrumbs,
    room,
  });

  const displayTariff =
    room.priceNumeric > 0 ? `₹${room.priceNumeric}` : room.pricePlaceholder;

  return (
    <>
      <JsonLdScript schemas={schemas} />
      <Header settings={settings} />
      <Breadcrumbs items={breadcrumbs} />

      <main className="flex-1 py-10 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Room Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
                {hotelName} • {settings?.distanceFromBankeBihari || '[e.g. 600 m]'} from Banke Bihari Temple
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-1">
                {room.name} ({displayTariff} / Night)
              </h1>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-stone-600 mt-3">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-brand-700" /> Max {room.capacity} Guests
                </span>
                <span className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4 text-brand-700" /> {room.bedType}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-brand-700" /> Check-in/out:{' '}
                  {settings?.checkInTime || '[time]'}
                </span>
              </div>
            </div>

            {/* Room Photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(images.length > 0
                ? images
                : [{ url: room.featuredImage, alt: room.featuredImageAlt || room.name }]
              ).map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-60 rounded-2xl overflow-hidden bg-stone-200 border border-stone-200"
                >
                  <Image
                    src={
                      img.url ||
                      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80'
                    }
                    alt={img.alt || `${room.name} Photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Room Description */}
            <div
              className="prose-vrindavan bg-white p-6 rounded-2xl border border-stone-200"
              dangerouslySetInnerHTML={{ __html: room.description }}
            />

            {/* Room Amenities */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">
                {room.name} Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((am, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-stone-800 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Booking Form Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <BookingEnquiryForm
                hotelName={hotelName}
                defaultRoomType={`${room.name} (${displayTariff})`}
                sourcePage={`/rooms/${room.slug}/`}
              />
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-stone-700 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Hotel Address:</strong> {settings?.address || '[full address]'} (
                  {settings?.distanceFromBankeBihari || '[e.g. 600 m]'} from Banke Bihari Ji)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room FAQs */}
        <FaqSection faqs={faqs} title={`FAQs About ${room.name}`} />

        {/* Auto Internal Linking: Other Nearby Rooms */}
        {otherRooms.length > 0 && (
          <section className="pt-10 border-t border-stone-200">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">
              Compare Other Rooms at {hotelName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherRooms.map((or) => (
                <Link
                  key={or.id}
                  href={`/rooms/${or.slug}/`}
                  className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-brand-600 transition flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      {or.name}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1">
                      Up to {or.capacity} Guests • {or.bedType}
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-brand-50 text-brand-800 font-bold text-sm">
                    {or.priceNumeric > 0 ? `₹${or.priceNumeric}` : or.pricePlaceholder} →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
