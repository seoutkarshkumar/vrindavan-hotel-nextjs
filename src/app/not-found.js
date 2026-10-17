import Link from 'next/link';
import { Home, BedDouble, Phone, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found (404) | Return to Hotel Home',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-stone-200 shadow-xl p-8 text-center space-y-5">
        <div className="text-5xl font-serif font-bold text-brand-700">404</div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
          Radhe Radhe! Page Not Found
        </h1>
        <p className="text-stone-600 text-sm md:text-base">
          The page you are looking for might have been moved or renamed. Explore our main hotel pages below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/"
            className="p-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go to Home Page
          </Link>
          <Link
            href="/rooms/"
            className="p-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <BedDouble className="w-4 h-4" /> View Rooms &amp; Tariffs
          </Link>
          <Link
            href="/hotel-near-banke-bihari-temple/"
            className="p-3.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold text-sm flex items-center justify-center gap-2 border border-brand-200"
          >
            Near Banke Bihari Temple
          </Link>
          <Link
            href="/booking-enquiry/"
            className="p-3.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-sm flex items-center justify-center gap-2 border border-amber-300"
          >
            <Phone className="w-4 h-4" /> Book Direct (Save 10%)
          </Link>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-center gap-4 text-xs font-semibold text-stone-500">
          <Link href="/faq/" className="hover:text-brand-700 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Hotel FAQs
          </Link>
          <Link href="/blog/" className="hover:text-brand-700">
            Vrindavan Darshan Blog
          </Link>
          <Link href="/contact/" className="hover:text-brand-700">
            Contact &amp; Map
          </Link>
        </div>
      </div>
    </div>
  );
}
