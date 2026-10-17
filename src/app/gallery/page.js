import Image from 'next/image';
import Link from 'next/link';
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
    title: `Photo Gallery – ${hotelName}, Vrindavan`,
    seoTitle: `Hotel & Room Photos Gallery | ${hotelName} Near Banke Bihari Temple`,
    metaDescription: `View real photos of Deluxe, Family, and Suite rooms at ${hotelName}, located ${settings?.distanceFromBankeBihari || '[e.g. 600 m]'} from Banke Bihari Temple in Vrindavan.`,
    slugPath: 'gallery',
  });
}

export default async function GalleryPage() {
  const [settings, rooms, media] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.room.findMany({ where: { isPublished: true } }),
    prisma.media.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  const hotelName = settings?.hotelName || '[naam]';
  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: 'Photo Gallery', path: 'gallery' },
  ];

  const photos = [];
  for (const m of media) {
    photos.push({ url: m.url, alt: m.altText || `${hotelName} Photo` });
  }
  for (const r of rooms) {
    const rImgs = safeJsonParse(r.images, []);
    for (const img of rImgs) {
      photos.push({
        url: img.url || img,
        alt: img.alt || `${r.name} at ${hotelName}`,
      });
    }
  }

  const schemas = buildJsonLdSchemas({
    settings,
    slugPath: 'gallery',
    title: `Photo Gallery – ${hotelName}`,
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
            Inside {hotelName}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-1">
            Hotel &amp; Rooms Photo Gallery
          </h1>
          <p className="text-stone-600 mt-2">
            Take a visual tour of our clean AC rooms, family suites, and peaceful ambiance in Shri Dham Vrindavan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, idx) => (
            <figure
              key={idx}
              className="rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm"
            >
              <div className="relative h-64 w-full bg-stone-200">
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-3.5 text-xs font-medium text-stone-700">
                {photo.alt}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-brand-900 text-white text-center space-y-3">
          <h2 className="text-2xl font-serif font-bold">
            Liked Our Rooms? Book Direct &amp; Save 10%!
          </h2>
          <p className="text-brand-100 text-sm">
            Call or WhatsApp {settings?.phone || '[number]'} or submit a quick booking enquiry.
          </p>
          <Link
            href="/booking-enquiry/"
            className="inline-block px-6 py-3 rounded-xl bg-amber-400 text-stone-950 font-bold text-sm"
          >
            Reserve Your Room Now
          </Link>
        </div>
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
