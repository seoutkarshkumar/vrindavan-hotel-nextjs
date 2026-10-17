import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import SEO from '../components/SEO';
import { api } from '../lib/api';

export default function Services() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/services').then(setItems); }, []);
  return (
    <>
      <SEO title="Services & Amenities" description="Enjoy premium services at Vrindavan Hotel." path="/services" />
      <section className="bg-gradient-to-b from-brand-50 to-cream py-16 text-center">
        <h1 className="text-5xl font-serif font-bold">Services & Amenities</h1>
        <p className="text-ink/70 mt-3">Everything you need for a divine stay.</p>
      </section>
      <section className="section container-x">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => {
            const Icon = Icons[s.icon] || Icons.Sparkles;
            return (
              <motion.div key={s.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="card p-8">
                <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 grid place-items-center mb-4">
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-ink/70 text-sm">{s.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
