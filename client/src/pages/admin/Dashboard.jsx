import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Sparkles, FileText, Newspaper, Inbox, ExternalLink } from 'lucide-react';
import { api } from '../../lib/api';

export default function Dashboard() {
  const [c, setC] = useState({ rooms: 0, services: 0, pages: 0, blog: 0, bookings: 0 });
  useEffect(() => {
    Promise.all([
      api.get('/rooms'), api.get('/services'), api.get('/pages'),
      api.get('/blog'),  api.get('/bookings'),
    ]).then(([r, s, p, b, bk]) => setC({
      rooms: r.length, services: s.length, pages: p.length, blog: b.length, bookings: bk.length,
    })).catch(() => {});
  }, []);

  const cards = [
    { to: '/admin/rooms',    label: 'Rooms',    icon: BedDouble, n: c.rooms },
    { to: '/admin/services', label: 'Services', icon: Sparkles,  n: c.services },
    { to: '/admin/pages',    label: 'Pages',    icon: FileText,  n: c.pages },
    { to: '/admin/blog',     label: 'Blog',     icon: Newspaper, n: c.blog },
    { to: '/admin/bookings', label: 'Bookings', icon: Inbox,     n: c.bookings },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
          <p className="text-ink/60 text-sm">Welcome back — here's what's happening today.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="btn-outline text-sm">
          View website <ExternalLink size={14}/>
        </a>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c, i) => (
          <Link key={i} to={c.to} className="card p-6 hover:border-brand-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 grid place-items-center">
                <c.icon size={20}/>
              </div>
              <div className="text-3xl font-serif font-bold">{c.n}</div>
            </div>
            <div className="text-sm text-ink/70">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="mt-8 card p-6">
        <h3 className="font-serif text-xl font-semibold mb-2">Quick Tips</h3>
        <ul className="text-sm text-ink/70 space-y-2 list-disc pl-6">
          <li>Change your password in <Link className="text-brand-700 underline" to="/admin/settings">Settings</Link> after first login.</li>
          <li>Site name, phone, email and social links are all editable from Settings.</li>
          <li>Create new pages under <Link className="text-brand-700 underline" to="/admin/pages">Pages</Link> — they appear at <code>/pages/&lt;slug&gt;</code>.</li>
        </ul>
      </div>
    </div>
  );
}
