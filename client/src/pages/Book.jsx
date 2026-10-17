import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { api } from '../lib/api';

export default function Book() {
  const [sp] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    checkIn: sp.get('checkIn') || '',
    checkOut: sp.get('checkOut') || '',
    guests: sp.get('guests') || 2,
    roomType: sp.get('roomType') || '',
    notes: '',
  });
  const [state, setState] = useState({ sending: false, sent: false, error: null });

  useEffect(() => {
    setForm(f => ({ ...f,
      checkIn:  sp.get('checkIn')  || f.checkIn,
      checkOut: sp.get('checkOut') || f.checkOut,
      guests:   sp.get('guests')   || f.guests,
      roomType: sp.get('roomType') || f.roomType,
    }));
  }, [sp]);

  const submit = async e => {
    e.preventDefault();
    setState({ sending: true, sent: false, error: null });
    try {
      await api.post('/bookings', { ...form, type: 'booking' });
      setState({ sending: false, sent: true, error: null });
    } catch (err) {
      setState({ sending: false, sent: false, error: err.message });
    }
  };

  if (state.sent) return (
    <section className="section container-x text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto card p-10">
        <CheckCircle2 size={64} className="mx-auto text-green-600 mb-4"/>
        <h1 className="text-3xl font-serif font-bold mb-2">Booking Received!</h1>
        <p className="text-ink/70">Our team will confirm your reservation shortly via email or phone.</p>
      </motion.div>
    </section>
  );

  return (
    <>
      <SEO title="Book Your Stay" description="Book your room at Vrindavan Hotel." path="/book" />
      <section className="section container-x">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="eyebrow">Reservation</div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">Book Your Stay</h1>
          </div>
          <form onSubmit={submit} className="card p-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input required className="input" placeholder="Full Name"
                     value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
              <input required type="email" className="input" placeholder="Email"
                     value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input required className="input" placeholder="Phone Number"
                     value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/>
              <select className="input" value={form.roomType}
                      onChange={e => setForm({ ...form, roomType: e.target.value })}>
                <option value="">Any Room Type</option>
                <option>Deluxe Room</option>
                <option>Premium Suite</option>
                <option>Family Room</option>
              </select>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-ink/60">Check-in</label>
                <input required type="date" className="input mt-1" value={form.checkIn}
                       onChange={e => setForm({ ...form, checkIn: e.target.value })}/>
              </div>
              <div>
                <label className="text-xs text-ink/60">Check-out</label>
                <input required type="date" className="input mt-1" value={form.checkOut}
                       onChange={e => setForm({ ...form, checkOut: e.target.value })}/>
              </div>
              <div>
                <label className="text-xs text-ink/60">Guests</label>
                <select className="input mt-1" value={form.guests}
                        onChange={e => setForm({ ...form, guests: e.target.value })}>
                  {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <p className="text-xs text-ink/60 -mt-1">
              Note: Check-in time is 12:00 PM and check-out time is 11:00 AM.
            </p>
            <textarea rows={4} className="input" placeholder="Special requests (optional)"
                      value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}/>
            <button disabled={state.sending} className="btn-primary w-full justify-center">
              {state.sending ? 'Sending…' : 'Request Booking'}
            </button>
            {state.error && <p className="text-red-600 text-sm text-center">Error: {state.error}</p>}
          </form>
        </div>
      </section>
    </>
  );
}
