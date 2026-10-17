import Link from 'next/link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { Calendar, User } from 'lucide-react';
import prisma from '@/lib/prisma';
import { generateNextMetadata, buildJsonLdSchemas } from '@/lib/seo';
import { safeJsonParse } from '@/lib/sanitize';
import { Header, Footer, StickyContactBar } from '@/components/PublicLayout';
import BookingEnquiryForm from '@/components/BookingEnquiryForm';
import { JsonLdScript, Breadcrumbs, FaqSection } from '@/components/SeoBlocks';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const [settings, post] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.page.findUnique({ where: { slug: params.slug } }),
  ]);

  if (!post) return {};

  return generateNextMetadata({
    settings,
    title: post.title,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    excerpt: post.excerpt,
    slugPath: `blog/${post.slug}`,
    canonicalUrl: post.canonicalUrl,
    canonicalOverride: post.canonicalOverride,
    featuredImage: post.featuredImage,
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
    ogImage: post.ogImage,
    isIndexed: post.isIndexed,
    type: 'blog',
  });
}

export default async function BlogPostDetailPage({ params }) {
  const slug = params.slug;

  const redirectRecord = await prisma.redirect.findUnique({
    where: { fromPath: `/blog/${slug}/` },
  });
  if (redirectRecord) {
    permanentRedirect(redirectRecord.toPath);
  }

  const [settings, post, relatedPosts, rooms] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.page.findUnique({ where: { slug } }),
    prisma.page.findMany({
      where: { type: 'blog', status: 'published', NOT: { slug } },
      take: 3,
    }),
    prisma.room.findMany({ where: { isPublished: true }, take: 3 }),
  ]);

  if (!post || post.status !== 'published') {
    notFound();
  }

  const hotelName = settings?.hotelName || '[naam]';
  const faqs = safeJsonParse(post.faqs, []);
  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: 'Vrindavan Darshan Blog', path: 'blog' },
    { name: post.title, path: `blog/${post.slug}` },
  ];

  const schemas = buildJsonLdSchemas({
    settings,
    pageType: 'blog',
    slugPath: `blog/${post.slug}`,
    title: post.title,
    description: post.metaDescription || post.excerpt,
    featuredImage: post.featuredImage,
    faqs,
    breadcrumbs,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
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
              <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase">
                {post.category || 'Vrindavan Guide'}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-3">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-3">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> By {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Published:{' '}
                  {new Date(post.publishedAt).toLocaleDateString('en-IN')}
                </span>
                <span>
                  Updated: {new Date(post.updatedAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            {post.featuredImage && (
              <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden bg-stone-200">
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose-vrindavan bg-white p-6 md:p-8 rounded-2xl border border-stone-200"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <FaqSection faqs={faqs} title="Frequently Asked Questions" />
          </article>

          <aside className="lg:col-span-4 space-y-6">
            <BookingEnquiryForm
              hotelName={hotelName}
              sourcePage={`/blog/${post.slug}/`}
            />

            {/* Auto Internal Links: Nearby Rooms */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Stay at {hotelName} ({settings?.distanceFromBankeBihari || '[e.g. 600 m]'} to Temple)
              </h3>
              {rooms.map((r) => (
                <Link
                  key={r.id}
                  href={`/rooms/${r.slug}/`}
                  className="block p-3 rounded-xl bg-stone-50 hover:bg-brand-50 border border-stone-200 text-xs font-semibold text-stone-800"
                >
                  {r.name} —{' '}
                  <span className="text-brand-700">
                    {r.priceNumeric > 0 ? `₹${r.priceNumeric}` : r.pricePlaceholder}
                  </span>
                </Link>
              ))}
            </div>

            {/* Auto Internal Links: Related Blog Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Related Vrindavan Guides
                </h3>
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/blog/${rp.slug}/`}
                    className="block text-sm font-semibold text-brand-700 hover:underline"
                  >
                    → {rp.title}
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
