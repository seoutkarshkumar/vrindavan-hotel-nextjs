import { Users, CheckCircle2 } from 'lucide-react';
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
    title: `Group & Braj Yatra Booking in Vrindavan – ${hotelName}`,
    seoTitle: `Group Hotel Booking in Vrindavan for Yatra & Families | ${hotelName}`,
    metaDescription: `Planning a group pilgrimage, kirtan mandali, or family function in Vrindavan? Get special bulk room rates at ${hotelName}, near Banke Bihari Temple (${settings?.distanceFromBankeBihari || '[e.g. 600 m]'}).`,
    slugPath: 'group-booking',
  });
}

export default async function GroupBookingPage() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const hotelName = settings?.hotelName || '[naam]';

  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: 'Group & Yatra Booking', path: 'group-booking' },
  ];

  const schemas = buildJsonLdSchemas({
    settings,
    slugPath: 'group-booking',
    title: `Group Booking at ${hotelName}`,
    breadcrumbs,
  });

  return (
    <>
      <JsonLdScript schemas={schemas} />
      <Header settings={settings} />
      <Breadcrumbs items={breadcrumbs} />

      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase">
              <Users className="w-4 h-4" /> Special Bulk &amp; Yatra Rates
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
              Group &amp; Pilgrimage Booking at {hotelName}, Vrindavan
            </h1>
            <p className="text-stone-700 text-base leading-relaxed">
              Travelling to Shri Dham Vrindavan with a large joint family, Braj 84 Kos Yatra group, Bhagwat Katha gathering, or senior citizen mandali? At{' '}
              <strong>{hotelName}</strong> (<strong>{settings?.address || '[full address]'}</strong>), located just{' '}
              <strong>{settings?.distanceFromBankeBihari || '[e.g. 600 m]'}</strong> from Banke Bihari Temple, we offer customized group packages.
            </p>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Why Choose {hotelName} for Group Stays?
              </h2>
              <ul className="space-y-2.5 text-sm md:text-base text-stone-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
                  <span>
                    Multiple <strong>Deluxe (₹__)</strong>, <strong>Family (₹__)</strong>, and <strong>Suite (₹__)</strong> rooms on the same floor.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
                  <span>
                    Just <strong>{settings?.distanceFromBankeBihari || '[e.g. 600 m]'}</strong> from Shri Banke Bihari Temple — easy coordination for group darshan.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
                  <span>
                    Pure Satvik Vegetarian group meals (breakfast, lunch &amp; dinner) available on request.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
                  <span>
                    Assistance with Mathura-Vrindavan-Gokul-Govardhan local sightseeing cabs &amp; e-rickshaws.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <BookingEnquiryForm
              hotelName={hotelName}
              defaultRoomType="Group / Multiple Rooms"
              enquiryType="Group Booking"
              sourcePage="/group-booking/"
            />
          </div>
        </div>
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
