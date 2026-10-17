import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
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
    title: `Contact & Location Map – ${hotelName}, Vrindavan`,
    seoTitle: `Contact ${hotelName} Vrindavan | Phone, WhatsApp & Directions`,
    metaDescription: `Contact ${hotelName} at ${settings?.address || '[full address]'} (${settings?.distanceFromBankeBihari || '[e.g. 600 m]'} from Banke Bihari Temple). Call or WhatsApp ${settings?.phone || '[number]'} to book direct.`,
    slugPath: 'contact',
  });
}

export default async function ContactPage() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  const hotelName = settings?.hotelName || '[naam]';

  const breadcrumbs = [
    { name: 'Home', path: '' },
    { name: 'Contact & Directions', path: 'contact' },
  ];

  const schemas = buildJsonLdSchemas({
    settings,
    slugPath: 'contact',
    title: `Contact ${hotelName}`,
    breadcrumbs,
  });

  return (
    <>
      <JsonLdScript schemas={schemas} />
      <Header settings={settings} />
      <Breadcrumbs items={breadcrumbs} />

      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
                24×7 Devotee Assistance
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mt-1">
                Contact {hotelName}, Vrindavan
              </h1>
              <p className="text-stone-600 mt-2">
                Reach out to our reservation desk via phone, WhatsApp, or the form to book directly and save 10%.
              </p>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-700 shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">
                    Hotel Address
                  </div>
                  <div className="font-semibold text-stone-900">
                    {settings?.address || '[full address]'}
                  </div>
                  <div className="text-xs text-brand-700 font-medium mt-0.5">
                    Distance from Banke Bihari Temple:{' '}
                    {settings?.distanceFromBankeBihari || '[e.g. 600 m]'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-700 shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">
                    Phone Number
                  </div>
                  <a
                    href={`tel:${settings?.phone || '[number]'}`}
                    className="font-bold text-lg text-brand-700 underline"
                  >
                    {settings?.phone || '[number]'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">
                    WhatsApp Booking
                  </div>
                  <div className="font-semibold text-stone-900">
                    {settings?.whatsapp || '[number]'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-700 shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">
                    Email Address
                  </div>
                  <div className="font-semibold text-stone-900">
                    {settings?.email || '[email]'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-700 shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-bold uppercase text-stone-400">
                    Check-in / Check-out Time
                  </div>
                  <div className="font-semibold text-stone-900">
                    Check-in: {settings?.checkInTime || '[time]'} | Check-out:{' '}
                    {settings?.checkOutTime || '[time]'}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm h-72 bg-stone-100">
              <iframe
                title={`Google Map of ${hotelName}`}
                src={
                  settings?.mapEmbedUrl ||
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3538.8!2d77.69!3d27.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVrindavan!5e0!3m2!1sen!2sin!4v1700000000000'
                }
                width="100%"
                height="100%"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <BookingEnquiryForm
              hotelName={hotelName}
              enquiryType="General / Room Booking"
              sourcePage="/contact/"
            />
          </div>
        </div>
      </main>

      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
