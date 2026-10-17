import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RoomCard from '../components/RoomCard';
import SEO from '../components/SEO';
import { api } from '../lib/api';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  useEffect(() => { api.get('/rooms').then(setRooms); }, []);
  return (
    <>
      <SEO title="Rooms & Suites" description="Explore our elegant rooms and suites at Vrindavan Hotel." path="/rooms" />
      <section className="bg-gradient-to-b from-brand-50 to-cream py-16">
        <div className="container-x text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                     className="text-5xl font-serif font-bold">Our Rooms & Suites</motion.h1>
          <p className="text-ink/70 mt-3 max-w-xl mx-auto">Curated for comfort. Designed for peace.</p>
        </div>
      </section>
      <section className="section container-x">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
        </div>
      </section>
    </>
  );
}
