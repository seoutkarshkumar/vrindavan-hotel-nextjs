import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import BookingWidget from './BookingWidget';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream to-cream pt-6 pb-20">
      {/* animated orbs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-300/40 rounded-full blur-3xl animate-floaty" />
      <div className="absolute top-40 -right-16 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-floaty" style={{ animationDelay: '2s' }} />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-soft mb-6">
              <Star size={14} className="text-brand-500 fill-brand-500" />
              <span className="text-xs font-medium">Rated 4.7 by 2,300+ pilgrims</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4">
              A Divine Stay in the <span className="text-brand-600">Land of Krishna</span>
            </h1>
            <p className="text-lg text-ink/70 mb-8 max-w-lg">
              Just steps from Banke Bihari Temple — enjoy heritage hospitality, satvik cuisine,
              and modern comforts crafted for pilgrims and travellers alike.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/rooms" className="btn-primary">Explore Rooms <ArrowRight size={16}/></Link>
              <Link to="/book"  className="btn-outline">Book Now</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
                alt="Vrindavan Hotel exterior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent"/>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-widest opacity-80">Signature Suite</div>
                <div className="text-2xl font-serif">Yamuna-view Rooms</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* booking widget overlaps hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 lg:-mb-24 relative z-10"
        >
          <BookingWidget />
        </motion.div>
      </div>
    </section>
  );
}
