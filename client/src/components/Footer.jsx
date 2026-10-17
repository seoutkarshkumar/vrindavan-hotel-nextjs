import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  if (!settings) return null;
  const s = settings;

  return (
    <footer className="bg-ink text-cream/90 pt-16 pb-8 mt-16">
      <div className="container-x grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-11 h-11 rounded-xl bg-brand-600 grid place-items-center font-serif text-2xl text-white">V</div>
            <div className="font-serif text-xl">{s.siteName}</div>
          </div>
          <p className="text-sm text-cream/70 mb-4">{s.tagline}</p>
          <div className="flex gap-3">
            {s.social?.facebook && <a href={s.social.facebook} rel="nofollow noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-brand-600"><Facebook size={16} /></a>}
            {s.social?.instagram && <a href={s.social.instagram} rel="nofollow noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-brand-600"><Instagram size={16} /></a>}
            {s.social?.twitter && <a href={s.social.twitter} rel="nofollow noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-brand-600"><Twitter size={16} /></a>}
            {s.social?.youtube && <a href={s.social.youtube} rel="nofollow noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-brand-600"><Youtube size={16} /></a>}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link to="/rooms" className="hover:text-brand-400">Rooms & Suites</Link></li>
            <li><Link to="/services" className="hover:text-brand-400">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-brand-400">Gallery</Link></li>
            <li><Link to="/blog" className="hover:text-brand-400">Blog</Link></li>
            <li><Link to="/about" className="hover:text-brand-400">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-cream/80">
            <li className="flex gap-2"><MapPin size={16} className="mt-1 shrink-0" /> {s.address}</li>
            <li className="flex gap-2"><Phone size={16} className="mt-1 shrink-0" /> <a href={`tel:${s.phone}`}>{s.phone}</a></li>
            <li className="flex gap-2"><Mail size={16} className="mt-1 shrink-0" /> <a href={`mailto:${s.email}`}>{s.email}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-white">Newsletter</h4>
          <p className="text-sm text-cream/70 mb-3">Divine offers, straight to your inbox.</p>
          <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="you@email.com" className="input bg-white/10 border-white/20 text-white placeholder:text-cream/50" />
            <button className="btn-primary px-4 py-2">Join</button>
          </form>
        </div>
      </div>

      <div className="container-x mt-12 pt-6 border-t border-white/10 text-xs text-cream/50 flex flex-wrap gap-4 justify-between">
        <div>© {new Date().getFullYear()} {s.siteName}. All rights reserved.</div>
        <div className="flex gap-4">
          <Link to="/pages/privacy-policy" className="hover:text-brand-400">Privacy</Link>
          <Link to="/contact" className="hover:text-brand-400">Support</Link>
        </div>
      </div>
    </footer>
  );
}
