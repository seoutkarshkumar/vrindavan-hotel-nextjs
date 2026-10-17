import { motion } from 'framer-motion';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO title="About Us" description="About Vrindavan Hotel — heritage, hospitality and Vraj tradition." path="/about" />
      <section className="section container-x grid lg:grid-cols-2 gap-12 items-center">
        <motion.img initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
          alt="Vrindavan Hotel"
          className="rounded-3xl shadow-soft h-[420px] object-cover w-full"/>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}>
          <div className="eyebrow">Our Story</div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-6">Heritage. Hospitality. Harmony.</h1>
          <p className="text-ink/80 leading-relaxed mb-4">
            Nestled in the heart of the holy town of Vrindavan, our hotel has hosted pilgrims,
            saints, and travellers for over 15 years. What began as a small dharamshala for
            visiting devotees has grown into a full-service boutique hotel — while keeping its
            soul rooted in Vraj tradition.
          </p>
          <p className="text-ink/80 leading-relaxed mb-4">
            Every room, every meal, every gesture reflects the spirit of seva (service) and bhakti
            (devotion) that Vrindavan is celebrated for. From rooftop yoga at sunrise to satvik
            thalis at sunset, we craft experiences that leave you spiritually rejuvenated.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { n: '15+',    l: 'Years' },
              { n: '2,300+', l: 'Guests' },
              { n: '4.7★',   l: 'Rating' },
            ].map((s, i) => (
              <div key={i} className="bg-brand-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-serif font-bold text-brand-700">{s.n}</div>
                <div className="text-xs text-ink/70 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}
