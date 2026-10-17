import Link from 'next/link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { MapPin } from 'lucide-react';
import prisma from '@/lib/prisma';
import { generateNextMetadata, buildJsonLdSchemas } from '@/lib/seo';
import { safeJsonParse } from '@/lib/sanitize';
import { Header, Footer, StickyContactBar } from '@/components/PublicLayout';
import BookingEnquiryForm from '@/components/BookingEnquiryForm';
import { JsonLdScript, Breadcrumbs, FaqSection } from '@/components/SeoBlocks';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const [settings, page] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.page.findUnique({ where: { slug: params.slug } }),
  ]);

  if (!page) return {};

  return generateNextMetadata({
    settings,
    title: page.title,
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription,
    excerpt: page.excerpt,
    slugPath: page.slug,
    canonicalUrl: page.canonicalUrl,
    canonicalOverride: page.canonicalOverride,
    featuredImage: page.featuredImage,
    ogTitle: page.ogTitle,
    ogDescription: page.ogDescription,
    ogImage: page.ogImage,
    isIndexed: page.isIndexed,
  });
}

export default async function DynamicCmsPage({ params }) {
  const slug = params.slug;

  // Automatic 301 Redirect check if this page slug was renamed earlier
  const redirectRecord = await prisma.redirect.findUnique({
    where: { fromPath: `/${slug}/` },
  });
  if (redirectRecord) {
    permanentRedirect(redirectRecord.toPath);
  }

  const [settings, page, rooms, relatedLocationPages] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.page.findUnique({ where: { slug } }),
    prisma.room.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.page.findMany({
      where: { type: 'location', status: 'published', NOT: { slug } },
      take: 3,
    }),
  ]);

  if (!page || page.status !== 'published') {
    notFound();
  }

  const hotelName = settings?.hotelName || '[naam]';
  const faqs = safeJsonParse(page.faqs, []);
  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: page.title, path: page.slug },
  ];

  const schemas = buildJsonLdSchemas({
    settings,
    pageType: page.type,
    slugPath: page.slug,
    title: page.title,
    description: page.metaDescription || page.excerpt,
    featuredImage: page.featuredImage,
    faqs,
    breadcrumbs,
    publishedAt: page.publishedAt,
    updatedAt: page.updatedAt,
  });

  return (
    <>
      <JsonLdScript schemas={schemas} />
      <Header settings={settings} />
      <Breadcrumbs items={breadcrumbs} />

      <main className="flex-1 py-10 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8 space-y-6">
            <div>
              {page.landmarkName && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase">
                  <MapPin className="w-3.5 h-3.5" /> {page.landmarkName} •{' '}
                  {page.distanceFromHotel || settings?.distanceFromBankeBihari}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-2">
                {page.title}
              </h1>
              {page.excerpt && (
                <p className="text-stone-600 mt-2 text-base">{page.excerpt}</p>
              )}
            </div>

            {page.featuredImage && (
              <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden bg-stone-200">
                <Image
                  src={page.featuredImage}
                  alt={page.featuredImageAlt || page.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose-vrindavan bg-white p-6 md:p-8 rounded-2xl border border-stone-200"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />

            <FaqSection faqs={faqs} title={`FAQs – ${page.title}`} />
          </article>

          <aside className="lg:col-span-4 space-y-6">
            <BookingEnquiryForm
              hotelName={hotelName}
              sourcePage={`/${page.slug}/`}
            />

            {/* Auto Internal Links: Nearby Rooms */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Our Rooms at {hotelName}
              </h2>
              {rooms.map((r) => (
                <Link
                  key={r.id}
                  href={`/rooms/${r.slug}/`}
                  className="block p-3 rounded-xl bg-stone-50 hover:bg-brand-50 border border-stone-200 text-xs font-semibold text-stone-800"
                >
                  {r.name} —{' '}
                  <span className="text-brand-700 font-bold">
                    {r.priceNumeric > 0 ? `₹${r.priceNumeric}` : r.pricePlaceholder}
                  </span>
                </Link>
              ))}
            </div>

            {/* Auto Internal Links: Other Temple Guides */}
            {relatedLocationPages.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <h2 className="font-serif font-bold text-lg text-stone-900">
                  Other Vrindavan Temple Stay Guides
                </h2>
                {relatedLocationPages.map((lp) => (
                  <Link
                    key={lp.id}
                    href={`/${lp.slug}/`}
                    className="block text-sm font-semibold text-brand-700 hover:underline"
                  >
                    → {lp.title}
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
