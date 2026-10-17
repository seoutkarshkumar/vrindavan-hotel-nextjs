import prisma from '@/lib/prisma';
import { generateNextMetadata, buildJsonLdSchemas } from '@/lib/seo';
import { Header, Footer, StickyContactBar } from '@/components/PublicLayout';
import BookingEnquiryForm from '@/components/BookingEnquiryForm';
import { JsonLdScript, Breadcrumbs } from '@/components/SeoBlocks';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const hotelName = settings?.hotelName || '[naam]';
  return generateNextMetadata({
    settings,
    title: `Book Direct & Save 10% – ${hotelName}, Vrindavan`,
    seoTitle: `Direct Room Booking Enquiry (Save 10%) | ${hotelName} Vrindavan`,
    metaDescription: `Book your Deluxe (₹__), Family (₹__) or Suite (₹__) room directly at ${hotelName} near Banke Bihari Temple (${settings?.distanceFromBankeBihari || '[e.g. 600 m]'}) and save 10% instantly.`,
    slugPath: 'booking-enquiry',
  });
}

export default async function BookingEnquiryPage() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const hotelName = settings?.hotelName || '[naam]';

  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: 'Direct Booking Enquiry', path: 'booking-enquiry' },
  ];

  const schemas = buildJsonLdSchemas({
    settings,
    slugPath: 'booking-enquiry',
    title: `Direct Booking Enquiry – ${hotelName}`,
    breadcrumbs,
  });

  return (
    <>
      <JsonLdScript schemas={schemas} />
      <Header settings={settings} />
      <Breadcrumbs items={breadcrumbs} />

      <main className="flex-1 py-12 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Zero Commission • Instant 10% Direct Discount
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-1">
            Book Direct at {hotelName}, Vrindavan
          </h1>
          <p className="text-stone-600 mt-2 text-sm md:text-base">
            Fill in your travel dates below. Your inquiry will be saved directly to our hotel desk and you can also send it on WhatsApp (<strong>{settings?.whatsapp || '[number]'}</strong>) in one tap!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <BookingEnquiryForm
            hotelName={hotelName}
            sourcePage="/booking-enquiry/"
          />
        </div>
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
