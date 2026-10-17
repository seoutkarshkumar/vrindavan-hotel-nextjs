import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import { generateNextMetadata, buildJsonLdSchemas } from '@/lib/seo';
import { Header, Footer, StickyContactBar } from '@/components/PublicLayout';
import { JsonLdScript, Breadcrumbs } from '@/components/SeoBlocks';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const hotelName = settings?.hotelName || '[naam]';
  return generateNextMetadata({
    settings,
    title: `Vrindavan Temple Darshan & Travel Guide Blog | ${hotelName}`,
    seoTitle: `Vrindavan Darshan Blog, Aarti Timings & Travel Tips | ${hotelName}`,
    metaDescription: `Read helpful guides on Banke Bihari Temple darshan timings, Prem Mandir light show, parikrama tips, and family accommodation at ${hotelName}.`,
    slugPath: 'blog',
  });
}

export default async function BlogListingPage() {
  const [settings, posts] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.page.findMany({
      where: { type: 'blog', status: 'published' },
      orderBy: { publishedAt: 'desc' },
    }),
  ]);

  const hotelName = settings?.hotelName || '[naam]';
  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: 'Vrindavan Darshan Blog', path: 'blog' },
  ];

  const schemas = buildJsonLdSchemas({
    settings,
    slugPath: 'blog',
    title: `Vrindavan Travel & Temple Darshan Blog`,
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
            Shri Dham Vrindavan Yatra Guides
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-1">
            Vrindavan Darshan &amp; Travel Blog – {hotelName}
          </h1>
          <p className="text-stone-600 mt-2">
            Curated temple timings, festivals calendar, and travel tips for devotees visiting Vrindavan and Mathura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full bg-stone-200">
                  <Image
                    src={
                      post.featuredImage ||
                      'https://images.unsplash.com/photo-1609946860441-a51ffcf22208?w=1200&q=80'
                    }
                    alt={post.featuredImageAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-stone-500 mb-2">
                    <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-800 font-semibold">
                      {post.category || 'Guide'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-stone-900">
                    <Link
                      href={`/blog/${post.slug}/`}
                      className="hover:text-brand-700"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-stone-600 mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-brand-700">
                <span className="flex items-center gap-1 text-stone-500 font-normal">
                  <User className="w-3.5 h-3.5" /> {post.author}
                </span>
                <Link
                  href={`/blog/${post.slug}/`}
                  className="flex items-center gap-1 hover:underline"
                >
                  Read Full Guide <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
