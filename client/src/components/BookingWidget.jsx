import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Search } from 'lucide-react';

export default function BookingWidget({ compact = false }) {
  const nav = useNavigate();
  const [f, setF] = useState({ checkIn: '', checkOut: '', guests: 2, roomType: '' });
  const submit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams(f).toString();
    nav(`/book?${q}`);
  };
  return (
    <form onSubmit={submit}
      className={`bg-white rounded-2xl shadow-soft p-4 md:p-6 grid gap-4 ${compact ? 'md:grid-cols-4' : 'md:grid-cols-5'}`}>
      <div>
        <label className="text-xs text-ink/60 flex items-center gap-1"><Calendar size={12}/> Check-in</label>
        <input required type="date" className="input mt-1" value={f.checkIn}
               onChange={e => setF({ ...f, checkIn: e.target.value })} />
      </div>
      <div>
        <label className="text-xs text-ink/60 flex items-center gap-1"><Calendar size={12}/> Check-out</label>
        <input required type="date" className="input mt-1" value={f.checkOut}
               onChange={e => setF({ ...f, checkOut: e.target.value })} />
      </div>
      <div>
        <label className="text-xs text-ink/60 flex items-center gap-1"><Users size={12}/> Guests</label>
        <select className="input mt-1" value={f.guests}
                onChange={e => setF({ ...f, guests: e.target.value })}>
          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
        </select>
      </div>
      {!compact && (
        <div>
          <label className="text-xs text-ink/60">Room Type</label>
          <select className="input mt-1" value={f.roomType}
                  onChange={e => setF({ ...f, roomType: e.target.value })}>
            <option value="">Any</option>
            <option>Deluxe Room</option>
            <option>Premium Suite</option>
            <option>Family Room</option>
          </select>
        </div>
      )}
      <button className="btn-primary justify-center self-end h-[50px]">
        <Search size={16} /> Check Availability
      </button>
    </form>
  );
}
