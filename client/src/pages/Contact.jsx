import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';
import { api } from '../lib/api';

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
  const [state, setState] = useState({ sending: false, sent: false, error: null });

  const submit = async e => {
    e.preventDefault();
    setState({ sending: true, sent: false, error: null });
    try {
      await api.post('/bookings', { ...form, type: 'contact' });
      setState({ sending: false, sent: true, error: null });
      setForm({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
    } catch (err) {
      setState({ sending: false, sent: false, error: err.message });
    }
  };

  return (
    <>
      <SEO title="Contact Us" description="Contact Vrindavan Hotel for enquiries and bookings." path="/contact" />
      <section className="section container-x">
        <div className="text-center mb-12">
          <div className="eyebrow">Get in Touch</div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">We'd love to hear from you</h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.form initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} onSubmit={submit} className="card p-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input required className="input" placeholder="Your Name" value={form.name}
                     onChange={e => setForm({ ...form, name: e.target.value })} />
              <input required type="email" className="input" placeholder="Email" value={form.email}
                     onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input className="input" placeholder="Phone" value={form.phone}
                     onChange={e => setForm({ ...form, phone: e.target.value })} />
              <select className="input" value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}>
                <option>General Enquiry</option>
                <option>Booking</option>
                <option>Feedback</option>
                <option>Group Booking</option>
              </select>
            </div>
            <textarea required rows={5} className="input" placeholder="Your Message"
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            <button disabled={state.sending} className="btn-primary w-full justify-center">
              {state.sending ? 'Sending…' : <>Send Message <Send size={16} /></>}
            </button>
            {state.sent && <p className="text-green-700 text-sm text-center">Thank you! We'll reply within 24 hours.</p>}
            {state.error && <p className="text-red-600 text-sm text-center">Error: {state.error}</p>}
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} className="space-y-4">
            {[
              { icon: MapPin, t: 'Address', v: settings?.address },
              { icon: Phone,  t: 'Phone',   v: settings?.phone, href: `tel:${settings?.phone}` },
              { icon: Mail,   t: 'Email',   v: settings?.email, href: `mailto:${settings?.email}` },
            ].map((c, i) => (
              <div key={i} className="card p-6 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 grid place-items-center shrink-0">
                  <c.icon size={22}/>
                </div>
                <div>
                  <div className="text-xs uppercase text-ink/60 tracking-widest">{c.t}</div>
                  {c.href ? <a href={c.href} className="text-ink font-medium hover:text-brand-700">{c.v}</a>
                          : <div className="text-ink font-medium">{c.v}</div>}
                </div>
              </div>
            ))}
            {settings?.mapEmbed && (
              <div className="rounded-2xl overflow-hidden h-72 shadow-soft">
                <iframe src={settings.mapEmbed} className="w-full h-full border-0" loading="lazy" title="map"/>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
