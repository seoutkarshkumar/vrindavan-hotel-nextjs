import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Users, BedDouble, Maximize2, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { api } from '../lib/api';

export default function RoomDetail() {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => { api.get(`/rooms/${slug}`).then(setRoom).catch(() => setRoom(false)); }, [slug]);

  if (room === false) return <div className="container-x py-24 text-center">Room not found.</div>;
  if (!room) return <div className="container-x py-24 text-center">Loading…</div>;

  return (
    <>
      <SEO title={room.name} description={room.shortDesc} image={room.images?.[0]} path={`/rooms/${room.slug}`} />
      <section className="container-x py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <motion.img key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              src={room.images[active]} alt={room.name}
              className="w-full h-[420px] object-cover rounded-3xl shadow-soft" />
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {room.images.map((img, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 ${i === active ? 'border-brand-600' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow">Signature Room</div>
            <h1 className="text-4xl font-serif font-bold mt-2 mb-4">{room.name}</h1>
            <div className="flex gap-6 text-sm text-ink/70 mb-6">
              <span className="flex items-center gap-2"><Users size={16}/> {room.capacity} Guests</span>
              <span className="flex items-center gap-2"><BedDouble size={16}/> {room.beds}</span>
              <span className="flex items-center gap-2"><Maximize2 size={16}/> {room.size}</span>
            </div>
            <p className="text-ink/80 leading-relaxed mb-6">{room.description}</p>
            <h3 className="font-serif text-xl font-semibold mb-3">Amenities</h3>
            <ul className="grid grid-cols-2 gap-2 mb-8">
              {room.amenities.map(a => (
                <li key={a} className="flex items-center gap-2 text-sm text-ink/80">
                  <Check size={16} className="text-brand-600"/> {a}
                </li>
              ))}
            </ul>
            <div className="flex items-end justify-between border-t pt-6">
              <div>
                <div className="text-xs text-ink/60">Starting from</div>
                <div className="text-3xl font-serif font-bold text-brand-700">₹{room.price.toLocaleString()}<span className="text-sm text-ink/60"> / night</span></div>
              </div>
              <Link to={`/book?roomType=${encodeURIComponent(room.name)}`} className="btn-primary">
                Book Now <ArrowRight size={16}/>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
