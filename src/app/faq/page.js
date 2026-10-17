import Link from 'next/link';
import prisma from '@/lib/prisma';
import { generateNextMetadata, buildJsonLdSchemas } from '@/lib/seo';
import { safeJsonParse } from '@/lib/sanitize';
import { Header, Footer, StickyContactBar } from '@/components/PublicLayout';
import { JsonLdScript, Breadcrumbs, FaqSection } from '@/components/SeoBlocks';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const hotelName = settings?.hotelName || '[naam]';
  return generateNextMetadata({
    settings,
    title: `Frequently Asked Questions (FAQ) – ${hotelName}, Vrindavan`,
    seoTitle: `FAQs About Staying at ${hotelName} Near Banke Bihari Temple`,
    metaDescription: `Find answers about distance from Banke Bihari Temple (${settings?.distanceFromBankeBihari || '[e.g. 600 m]'}), room tariffs, check-in timings, car parking, and satvik food at ${hotelName}.`,
    slugPath: 'faq',
  });
}

export default async function FaqPage() {
  const [settings, homePage, rooms] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.page.findUnique({ where: { slug: 'home' } }),
    prisma.room.findMany({ where: { isPublished: true } }),
  ]);

  const hotelName = settings?.hotelName || '[naam]';
  const homeFaqs = safeJsonParse(homePage?.faqs, []);
  const roomFaqs = rooms.flatMap((r) => safeJsonParse(r.faqs, []));
  const allFaqs = [...homeFaqs, ...roomFaqs];

  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: 'Frequently Asked Questions', path: 'faq' },
  ];

  const schemas = buildJsonLdSchemas({
    settings,
    slugPath: 'faq',
    title: `Frequently Asked Questions – ${hotelName}`,
    faqs: allFaqs,
    breadcrumbs,
  });

  return (
    <>
      <JsonLdScript schemas={schemas} />
      <Header settings={settings} />
      <Breadcrumbs items={breadcrumbs} />

      <main className="flex-1 py-10 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Devotee Help Desk
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-1">
            Frequently Asked Questions – {hotelName}
          </h1>
          <p className="text-stone-600 mt-2 text-sm md:text-base">
            Everything you need to know about room tariffs, distance to Banke Bihari Temple ({settings?.distanceFromBankeBihari || '[e.g. 600 m]'}), check-in timings ({settings?.checkInTime || '[time]'}), and direct booking discounts.
          </p>
        </div>

        <FaqSection faqs={allFaqs} title="All Hotel & Booking Questions" />

        <div className="mt-8 p-6 rounded-2xl bg-brand-50 border border-brand-200 text-center space-y-3">
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Still Have a Question?
          </h2>
          <p className="text-sm text-stone-700">
            Call or WhatsApp us directly at <strong>{settings?.phone || '[number]'}</strong> or send a booking enquiry.
          </p>
          <Link
            href="/booking-enquiry/"
            className="inline-block px-6 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs"
          >
            Contact Reservation Desk →
          </Link>
        </div>
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
