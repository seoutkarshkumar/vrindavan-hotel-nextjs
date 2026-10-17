import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-white/70 backdrop-blur'}`}>
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-xl bg-brand-600 text-white grid place-items-center font-serif text-2xl">V</div>
          <div className="leading-tight">
            <div className="font-serif text-xl font-bold text-ink">{settings?.siteName || 'Vrindavan Hotel'}</div>
            <div className="text-xs text-brand-700 tracking-widest uppercase">Divine Stays</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-brand-700' : 'text-ink/70 hover:text-brand-600'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {settings?.phone && (
            <a href={`tel:${settings.phone}`} className="hidden md:inline-flex items-center gap-2 text-sm text-ink/80 hover:text-brand-700">
              <Phone size={16} /> {settings.phone}
            </a>
          )}
          <Link to="/book" className="hidden md:inline-flex btn-primary py-2 px-4 text-sm">Book Now</Link>
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t">
          <div className="container-x py-4 flex flex-col gap-3">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) => `py-2 border-b border-brand-100 ${isActive ? 'text-brand-700 font-medium' : 'text-ink/80'}`}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/book" onClick={() => setOpen(false)} className="btn-primary justify-center mt-2">Book Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}
