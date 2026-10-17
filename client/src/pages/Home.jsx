import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, HandHeart, MapPin, ShieldCheck, Star, ArrowRight, ConciergeBell } from 'lucide-react';
import Hero from '../components/Hero';
import RoomCard from '../components/RoomCard';
import { api } from '../lib/api';

const testimonials = [
  { name: 'Anita Sharma', place: 'Delhi', text: 'The location is unbeatable — 5 minutes to Banke Bihari. Staff felt like family.', rating: 5 },
  { name: 'Ramesh Iyer',   place: 'Chennai', text: 'Loved the satvik meals. Rooms are clean, quiet and beautifully decorated.', rating: 5 },
  { name: 'Priya Nair',    place: 'Mumbai',  text: 'The rooftop yoga at sunrise made our pilgrimage unforgettable. Highly recommend!', rating: 5 },
];

const stats = [
  { n: '15+',   l: 'Years of Hospitality' },
  { n: '2,300+',l: 'Happy Pilgrims' },
  { n: '4.7★',  l: 'Guest Rating' },
  { n: '5 min', l: 'To Banke Bihari' },
];

export default function Home() {
  const [rooms, setRooms] = useState([]);
  useEffect(() => { api.get('/rooms').then(r => setRooms(r.filter(x => x.featured).slice(0, 3))); }, []);

  return (
    <>
      <Hero />

      {/* Why us */}
      <section className="section container-x mt-24 lg:mt-32">
        <div className="text-center mb-14">
          <div className="eyebrow">Why Choose Us</div>
          <h2 className="text-4xl font-bold mt-2">Experience Vraj Hospitality</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: MapPin,       t: 'Prime Location', d: '5-minute walk to Banke Bihari Temple' },
            { icon: HandHeart,    t: 'Warm Service',   d: 'Trained staff rooted in Vraj tradition' },
            { icon: Sparkles,     t: 'Satvik Cuisine', d: 'No onion, no garlic — pure & delicious' },
            { icon: ShieldCheck,  t: 'Safe & Secure',  d: 'CCTV, 24×7 security, verified stays' },
          ].map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-100 text-brand-700 grid place-items-center mb-4">
                <f.icon size={26} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.t}</h3>
              <p className="text-sm text-ink/70">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="eyebrow">Signature Stays</div>
              <h2 className="text-4xl font-bold mt-2">Rooms & Suites</h2>
            </div>
            <Link to="/rooms" className="text-brand-700 font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={16}/>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {rooms.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <div className="text-4xl md:text-5xl font-serif font-bold">{s.n}</div>
              <div className="text-sm opacity-80 mt-2">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section container-x">
        <div className="text-center mb-14">
          <div className="eyebrow">Guest Voices</div>
          <h2 className="text-4xl font-bold mt-2">Stories from our Pilgrims</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-brand-500 fill-brand-500"/>
                ))}
              </div>
              <p className="italic text-ink/80 mb-4">“{t.text}”</p>
              <div className="text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-ink/60">{t.place}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section container-x">
        <div className="rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white p-12 md:p-16 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-400/20 rounded-full blur-3xl animate-floaty"/>
          <div className="relative max-w-2xl">
            <ConciergeBell size={36} className="mb-4 text-brand-200"/>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Ready for a Divine Stay?</h2>
            <p className="text-brand-100 text-lg mb-8">
              Reserve your room today and receive complimentary temple darshan cab on arrival.
            </p>
            <Link to="/book" className="btn-primary bg-white text-brand-800 hover:bg-brand-50">
              Book Your Stay <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
