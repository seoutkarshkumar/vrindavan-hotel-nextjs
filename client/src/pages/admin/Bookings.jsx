import { useEffect, useState } from 'react';
import { Trash2, Mail, Phone } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminBookings() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/bookings').then(setItems);
  useEffect(() => { load(); }, []);
  const del = async id => { if (confirm('Delete this entry?')) { await api.del(`/bookings/${id}`); load(); } };
  const status = async (id, s) => { await api.put(`/bookings/${id}`, { status: s }); load(); };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-6">Bookings & Enquiries</h1>
      <div className="grid gap-4">
        {items.length === 0 && <div className="card p-10 text-center text-ink/60">No bookings yet.</div>}
        {items.map(b => (
          <div key={b.id} className="card p-5">
            <div className="flex flex-wrap gap-2 justify-between items-start">
              <div>
                <div className="text-xs text-ink/50">{new Date(b.createdAt).toLocaleString()} · <span className="uppercase">{b.type || 'booking'}</span></div>
                <h3 className="font-serif text-lg font-semibold mt-1">{b.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-ink/70 mt-1">
                  {b.email && <a href={`mailto:${b.email}`} className="inline-flex gap-1 items-center"><Mail size={12}/> {b.email}</a>}
                  {b.phone && <a href={`tel:${b.phone}`} className="inline-flex gap-1 items-center"><Phone size={12}/> {b.phone}</a>}
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${
                b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                b.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-brand-100 text-brand-700'
              }`}>{b.status || 'new'}</span>
            </div>
            {(b.checkIn || b.roomType) && (
              <div className="grid md:grid-cols-4 gap-3 mt-4 text-sm">
                {b.checkIn  && <div><span className="text-ink/50">Check-in:</span> {b.checkIn}</div>}
                {b.checkOut && <div><span className="text-ink/50">Check-out:</span> {b.checkOut}</div>}
                {b.guests   && <div><span className="text-ink/50">Guests:</span> {b.guests}</div>}
                {b.roomType && <div><span className="text-ink/50">Room:</span> {b.roomType}</div>}
              </div>
            )}
            {(b.message || b.notes || b.subject) && (
              <div className="mt-3 bg-brand-50 p-3 rounded-xl text-sm">
                {b.subject && <div className="text-xs text-ink/60 mb-1">{b.subject}</div>}
                {b.message || b.notes}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => status(b.id, 'confirmed')} className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">Mark Confirmed</button>
              <button onClick={() => status(b.id, 'declined')} className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">Decline</button>
              <button onClick={() => del(b.id)} className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700"><Trash2 size={12} className="inline"/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
