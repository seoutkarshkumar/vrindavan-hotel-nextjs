import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  Users,
  BedDouble,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { generateNextMetadata, buildJsonLdSchemas } from '@/lib/seo';
import { safeJsonParse } from '@/lib/sanitize';
import { Header, Footer, StickyContactBar } from '@/components/PublicLayout';
import BookingEnquiryForm from '@/components/BookingEnquiryForm';
import { JsonLdScript, FaqSection } from '@/components/SeoBlocks';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const [settings, homePage] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.page.findUnique({ where: { slug: 'home' } }),
  ]);

  return generateNextMetadata({
    settings,
    title: homePage?.title || settings?.defaultMetaTitle,
    seoTitle: homePage?.seoTitle || settings?.defaultMetaTitle,
    metaDescription: homePage?.metaDescription || settings?.defaultMetaDescription,
    excerpt: homePage?.excerpt,
    slugPath: '',
    canonicalUrl: homePage?.canonicalUrl,
    canonicalOverride: homePage?.canonicalOverride,
    featuredImage: homePage?.featuredImage || settings?.defaultOgImage,
    ogTitle: homePage?.ogTitle,
    ogDescription: homePage?.ogDescription,
    ogImage: homePage?.ogImage,
    isIndexed: homePage ? homePage.isIndexed : true,
  });
}

export default async function HomePage() {
  const [settings, homePage, rooms, locationPages, blogPosts, testimonials] =
    await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: 1 } }),
      prisma.page.findUnique({ where: { slug: 'home' } }),
      prisma.room.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      }),
      prisma.page.findMany({
        where: { type: 'location', status: 'published' },
        take: 3,
      }),
      prisma.page.findMany({
        where: { type: 'blog', status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      }),
      prisma.testimonial.findMany({
        where: { isPublished: true },
        take: 3,
      }),
    ]);

  const hotelName = settings?.hotelName || '[naam]';
  const amenities = safeJsonParse(settings?.amenitiesList, []);
  const homeFaqs = safeJsonParse(homePage?.faqs, []);

  const schemas = buildJsonLdSchemas({
    settings,
    pageType: 'page',
    slugPath: '',
    title: homePage?.title || hotelName,
    description: homePage?.metaDescription || settings?.defaultMetaDescription,
    featuredImage: homePage?.featuredImage || settings?.defaultOgImage,
    faqs: homeFaqs,
  });

  return (
    <>
      <JsonLdScript schemas={schemas} />
      <Header settings={settings} />

      <main className="flex-1">
        {/* Spiritual Saffron Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white py-12 md:py-20 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-amber-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Shri Dham Vrindavan •{' '}
                {settings?.distanceFromBankeBihari || '[e.g. 600 m]'} from Banke Bihari Temple
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight">
                {homePage?.title ||
                  `Welcome to ${hotelName} – Peaceful Family Hotel in Vrindavan`}
              </h1>

              <p className="text-brand-100 text-base md:text-lg leading-relaxed max-w-2xl">
                {homePage?.excerpt ||
                  `Experience warm Braj hospitality at ${hotelName} (${
                    settings?.address || '[full address]'
                  }), located just ${
                    settings?.distanceFromBankeBihari || '[e.g. 600 m]'
                  } from Shri Banke Bihari Temple.`}
              </p>

              {/* Key Facts Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-xs text-amber-200 font-semibold">
                    Temple Distance
                  </div>
                  <div className="font-bold text-sm mt-0.5">
                    {settings?.distanceFromBankeBihari || '[e.g. 600 m]'} to Banke Bihari Ji
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-xs text-amber-200 font-semibold">
                    Room Tariffs
                  </div>
                  <div className="font-bold text-sm mt-0.5">
                    {settings?.priceRange || 'Deluxe ₹__, Family ₹__, Suite ₹__'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-xs text-amber-200 font-semibold">
                    Check-in / Check-out
                  </div>
                  <div className="font-bold text-sm mt-0.5">
                    {settings?.checkInTime || '[time]'} / {settings?.checkOutTime || '[time]'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  href="/rooms/"
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm shadow-lg transition flex items-center gap-2"
                >
                  Explore Rooms &amp; Tariffs <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`tel:${settings?.phone || '[number]'}`}
                  className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm transition flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Call Direct: {settings?.phone || '[number]'}
                </a>
              </div>
            </div>

            {/* Hero Direct Booking Form */}
            <div className="lg:col-span-5 text-stone-900">
              <BookingEnquiryForm hotelName={hotelName} sourcePage="/" />
            </div>
          </div>
        </section>

        {/* Book Direct & Save 10% Strip */}
        <section className="bg-amber-100 border-y border-amber-300 py-4 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="font-serif font-bold text-brand-950 text-base md:text-lg">
              🎁 Special Devotee Offer: Book Direct on Website or WhatsApp &amp; Save 10% Instantly!
            </div>
            <Link
              href="/booking-enquiry/"
              className="px-5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider shrink-0"
            >
              Book Direct &amp; Save 10%
            </Link>
          </div>
        </section>

        {/* Rooms Section */}
        <section className="py-14 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
                Clean, Peaceful &amp; Spacious Stay
              </span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-stone-900 mt-1">
                Our Rooms &amp; Suites at {hotelName}
              </h2>
            </div>
            <Link
              href="/rooms/"
              className="text-sm font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              View All Room Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const roomAmenities = safeJsonParse(room.amenities, []);
              const imgUrl =
                room.featuredImage ||
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80';
              return (
                <article
                  key={room.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 w-full bg-stone-200">
                      <Image
                        src={imgUrl}
                        alt={room.featuredImageAlt || `${room.name} at ${hotelName}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-brand-700 text-white font-bold text-sm shadow">
                        {room.priceNumeric > 0
                          ? `₹${room.priceNumeric}`
                          : room.pricePlaceholder}{' '}
                        <span className="text-xs font-normal">/ night</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-stone-900">
                        <Link
                          href={`/rooms/${room.slug}/`}
                          className="hover:text-brand-700"
                        >
                          {room.name}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-stone-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-brand-700" /> Up to{' '}
                          {room.capacity} Guests
                        </span>
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-brand-700" />{' '}
                          {room.bedType}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 mt-3 line-clamp-2">
                        {room.shortDescription}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {roomAmenities.slice(0, 4).map((am, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                          >
                            ✓ {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center gap-2">
                    <Link
                      href={`/rooms/${room.slug}/`}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-brand-700 text-brand-700 hover:bg-brand-50 text-xs font-bold text-center transition"
                    >
                      Room Details
                    </Link>
                    <Link
                      href={`/booking-enquiry/?room=${encodeURIComponent(room.name)}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold text-center transition"
                    >
                      Book Direct
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Editable Home Rich Text Content & Hotel Amenities */}
        <section className="py-12 bg-white border-y border-stone-200 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <div
                className="prose-vrindavan"
                dangerouslySetInnerHTML={{
                  __html: homePage?.content || '',
                }}
              />
            </div>

            <div className="lg:col-span-5 bg-cream-50 p-6 md:p-8 rounded-2xl border border-brand-100 self-start">
              <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
                Hotel Amenities &amp; Guest Facilities
              </h2>
              <ul className="space-y-3">
                {amenities.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm md:text-base text-stone-800 font-medium"
                  >
                    <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-stone-200 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-700" />
                  <span>
                    <strong>Check-in / Check-out:</strong>{' '}
                    {settings?.checkInTime || '[time]'} /{' '}
                    {settings?.checkOutTime || '[time]'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-700" />
                  <span>
                    <strong>Location:</strong> {settings?.address || '[full address]'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Temple Proximity / Location SEO Guides */}
        {locationPages.length > 0 && (
          <section className="py-14 px-4 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
                Walk &amp; E-Rickshaw Access to Sacred Temples
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
                Stay Near Vrindavan&apos;s Major Temples
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {locationPages.map((lp) => (
                <Link
                  key={lp.id}
                  href={`/${lp.slug}/`}
                  className="group p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-brand-600 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-brand-700 uppercase">
                      {lp.landmarkName || 'Temple Guide'}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-brand-700 mt-1">
                      {lp.title}
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 line-clamp-3">
                      {lp.excerpt}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-brand-700 mt-4 flex items-center gap-1">
                    Read Temple Distance &amp; Stay Guide <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Guest Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-14 bg-brand-950 text-white px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  Devotee Reviews
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mt-1">
                  What Families Say About {hotelName}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-2xl bg-white/10 border border-white/15 space-y-3"
                  >
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-stone-100 leading-relaxed">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                    <div className="text-xs font-bold text-amber-200 pt-2">
                      — {t.guestName} ({t.guestCity}) • {t.stayDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Home Page FAQs (5 Pre-filled FAQs + Auto FAQPage JSON-LD) */}
        <FaqSection
          faqs={homeFaqs}
          title={`Frequently Asked Questions About ${hotelName}`}
        />

        {/* Google Map Embed & Direct Contact Section */}
        <section className="py-14 bg-white border-t border-stone-200 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
                Location &amp; Directions
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
                How to Reach {hotelName}, Vrindavan
              </h2>
              <p className="text-stone-700 text-sm md:text-base">
                We are conveniently located at <strong>{settings?.address || '[full address]'}</strong>, just{' '}
                <strong>{settings?.distanceFromBankeBihari || '[e.g. 600 m]'}</strong> from Shri Banke Bihari Temple.
              </p>
              <div className="space-y-2 text-sm text-stone-800">
                <div>
                  <strong>Address:</strong> {settings?.address || '[full address]'}
                </div>
                <div>
                  <strong>Phone / WhatsApp:</strong> {settings?.phone || '[number]'}
                </div>
                <div>
                  <strong>Email:</strong> {settings?.email || '[email]'}
                </div>
              </div>
              { blogPosts.length > 0 && (
                <div className="pt-4 border-t border-stone-200">
                  <div className="text-xs font-bold uppercase text-stone-500 mb-2">
                    Latest From Our Vrindavan Blog
                  </div>
                  {blogPosts.map((bp) => (
                    <Link
                      key={bp.id}
                      href={`/blog/${bp.slug}/`}
                      className="block text-sm font-semibold text-brand-700 hover:underline"
                    >
                      → {bp.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md h-80 bg-stone-100">
              <iframe
                title={`Google Map Location of ${hotelName}`}
                src={
                  settings?.mapEmbedUrl ||
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3538.8!2d77.69!3d27.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVrindavan!5e0!3m2!1sen!2sin!4v1700000000000'
                }
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
