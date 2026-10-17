import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Sparkles } from 'lucide-react';

export function Header({ settings }) {
  const hotelName = settings?.hotelName || '[naam]';
  const phone = settings?.phone || '[number]';
  const whatsapp = (settings?.whatsapp || '').replace(/[^\d]/g, '');
  const promo =
    settings?.promoBannerText ||
    'Radhe Radhe! Book Direct on Website / WhatsApp & Save 10% Instantly!';

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      {/* Top Direct Booking 10% Off Promo Banner */}
      <div className="bg-brand-800 text-white text-xs md:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{promo}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hidden md:inline text-brand-100">
              Banke Bihari Temple: {settings?.distanceFromBankeBihari || '[e.g. 600 m]'}
            </span>
            <Link
              href="/booking-enquiry/"
              className="underline text-amber-200 hover:text-white"
            >
              Claim 10% Discount →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <Link href="/" className="flex flex-col">
            <span className="text-xl md:text-2xl font-serif font-bold text-brand-700 tracking-tight">
              {hotelName}
            </span>
            <span className="text-[11px] text-stone-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-700" /> Shri Dham Vrindavan
            </span>
          </Link>

          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-semibold text-stone-700"
          >
            <Link href="/" className="hover:text-brand-700 transition">
              Home
            </Link>
            <Link href="/rooms/" className="hover:text-brand-700 transition">
              Rooms &amp; Tariffs
            </Link>
            <Link
              href="/hotel-near-banke-bihari-temple/"
              className="hover:text-brand-700 transition"
            >
              Near Banke Bihari Ji
            </Link>
            <Link href="/gallery/" className="hover:text-brand-700 transition">
              Gallery
            </Link>
            <Link href="/group-booking/" className="hover:text-brand-700 transition">
              Group Booking
            </Link>
            <Link href="/blog/" className="hover:text-brand-700 transition">
              Vrindavan Guide
            </Link>
            <Link href="/faq/" className="hover:text-brand-700 transition">
              FAQ
            </Link>
            <Link href="/contact/" className="hover:text-brand-700 transition">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${phone}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-200 bg-brand-50 text-brand-800 text-xs font-bold hover:bg-brand-100 transition"
            >
              <Phone className="w-3.5 h-3.5" /> {phone}
            </a>
            <Link
              href="/booking-enquiry/"
              className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs md:text-sm font-bold shadow-sm transition"
            >
              Book Direct (Save 10%)
            </Link>
          </div>
        </div>

        {/* Mobile Scrollable Quick Nav (tested down to 360px) */}
        <div className="lg:hidden border-t border-stone-100 px-3 py-2 flex items-center gap-4 overflow-x-auto text-xs font-semibold text-stone-700 whitespace-nowrap">
          <Link href="/" className="hover:text-brand-700">
            Home
          </Link>
          <Link href="/rooms/" className="hover:text-brand-700">
            Rooms
          </Link>
          <Link href="/hotel-near-banke-bihari-temple/" className="hover:text-brand-700">
            Near Banke Bihari
          </Link>
          <Link href="/gallery/" className="hover:text-brand-700">
            Gallery
          </Link>
          <Link href="/group-booking/" className="hover:text-brand-700">
            Group Booking
          </Link>
          <Link href="/blog/" className="hover:text-brand-700">
            Blog
          </Link>
          <Link href="/faq/" className="hover:text-brand-700">
            FAQ
          </Link>
          <Link href="/contact/" className="hover:text-brand-700">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer({ settings }) {
  const hotelName = settings?.hotelName || '[naam]';
  const phone = settings?.phone || '[number]';
  const whatsapp = settings?.whatsapp || '[number]';
  const email = settings?.email || '[email]';
  const address = settings?.address || '[full address]';

  return (
    <footer className="bg-stone-950 text-stone-300 pt-14 pb-24 md:pb-12 border-t-4 border-brand-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-serif font-bold text-white mb-2">
            {hotelName}
          </h3>
          <p className="text-sm text-stone-400 leading-relaxed mb-4">
            {settings?.tagline ||
              'Peaceful family hotel in Shri Dham Vrindavan, just walking distance from Banke Bihari Temple.'}
          </p>
          <div className="text-xs text-amber-300 font-semibold">
            ✓ Check-in: {settings?.checkInTime || '[time]'} | Check-out:{' '}
            {settings?.checkOutTime || '[time]'}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
            Quick Links &amp; Rooms
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/rooms/" className="hover:text-amber-300">
                All Rooms &amp; Tariffs
              </Link>
            </li>
            <li>
              <Link href="/rooms/deluxe-room/" className="hover:text-amber-300">
                Deluxe Room (₹__)
              </Link>
            </li>
            <li>
              <Link href="/rooms/family-room/" className="hover:text-amber-300">
                Family Room (₹__)
              </Link>
            </li>
            <li>
              <Link href="/rooms/suite-room/" className="hover:text-amber-300">
                Royal Suite Room (₹__)
              </Link>
            </li>
            <li>
              <Link href="/group-booking/" className="hover:text-amber-300">
                Group &amp; Yatra Booking
              </Link>
            </li>
            <li>
              <Link href="/gallery/" className="hover:text-amber-300">
                Hotel Photo Gallery
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
            Vrindavan Temple Locations
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/hotel-near-banke-bihari-temple/"
                className="hover:text-amber-300"
              >
                Hotel Near Banke Bihari Temple ({settings?.distanceFromBankeBihari || '[e.g. 600 m]'})
              </Link>
            </li>
            <li>
              <Link
                href="/hotel-near-prem-mandir-vrindavan/"
                className="hover:text-amber-300"
              >
                Hotel Near Prem Mandir Vrindavan
              </Link>
            </li>
            <li>
              <Link
                href="/hotel-near-iskcon-temple-vrindavan/"
                className="hover:text-amber-300"
              >
                Hotel Near ISKCON Temple Vrindavan
              </Link>
            </li>
            <li>
              <Link href="/blog/" className="hover:text-amber-300">
                Vrindavan Darshan Travel Blog
              </Link>
            </li>
            <li>
              <Link href="/faq/" className="hover:text-amber-300">
                Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
            Direct Booking Contact
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <strong className="text-white">Address:</strong> {address}
            </li>
            <li>
              <strong className="text-white">Phone:</strong>{' '}
              <a href={`tel:${phone}`} className="text-amber-300 underline">
                {phone}
              </a>
            </li>
            <li>
              <strong className="text-white">WhatsApp:</strong> {whatsapp}
            </li>
            <li>
              <strong className="text-white">Email:</strong> {email}
            </li>
            {settings?.googleBusinessUrl && (
              <li className="pt-1">
                <a
                  href={settings.googleBusinessUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-3 py-1.5 rounded-lg bg-brand-700 text-white text-xs font-semibold"
                >
                  View on Google Maps &amp; Reviews →
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
        <div>
          © {new Date().getFullYear()} {hotelName}, Vrindavan. All rights reserved.
        </div>
        <div className="flex gap-4">
          <Link href="/sitemap.xml" className="hover:text-stone-300">
            Sitemap
          </Link>
          <Link href="/llms.txt" className="hover:text-stone-300">
            AI Guide (llms.txt)
          </Link>
          <Link href="/admin/" className="hover:text-stone-300">
            Owner Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function StickyContactBar({ settings }) {
  const phone = settings?.phone || '[number]';
  const rawWa = (settings?.whatsapp || '').replace(/[^\d]/g, '');
  const waMsg = encodeURIComponent(
    `Radhe Radhe! I want to enquire about room availability and the 10% direct booking discount at ${
      settings?.hotelName || 'your hotel in Vrindavan'
    }.`
  );
  const waHref = rawWa
    ? `https://wa.me/${rawWa}?text=${waMsg}`
    : `https://wa.me/?text=${waMsg}`;

  return (
    <>
      {/* Desktop Floating Sticky WhatsApp + Call Buttons */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col gap-3">
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xl transition"
          aria-label="Call Hotel Directly"
        >
          <Phone className="w-4 h-4" /> Call: {phone}
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl transition"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" /> WhatsApp Booking
        </a>
      </div>

      {/* Mobile Bottom Sticky Bar (Tested at 360px) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-stone-200 shadow-2xl grid grid-cols-2 gap-2 p-2">
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-brand-700 text-white font-bold text-xs shadow"
        >
          <Phone className="w-4 h-4" /> Call Hotel
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp (Save 10%)
        </a>
      </div>
    </>
  );
}
