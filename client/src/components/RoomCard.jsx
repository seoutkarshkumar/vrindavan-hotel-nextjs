import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Users, Maximize2, ArrowRight } from 'lucide-react';

export default function RoomCard({ room, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card group"
    >
      <div className="relative overflow-hidden h-64">
        <img src={room.images?.[0]} alt={room.name}
             className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-brand-700">
          From ₹{room.price.toLocaleString()}/night
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif font-semibold mb-2">{room.name}</h3>
        <p className="text-sm text-ink/70 mb-4 line-clamp-2">{room.shortDesc}</p>
        <div className="flex gap-4 text-xs text-ink/60 mb-5">
          <span className="flex items-center gap-1"><Users size={14}/> {room.capacity} Guests</span>
          <span className="flex items-center gap-1"><BedDouble size={14}/> {room.beds}</span>
          <span className="flex items-center gap-1"><Maximize2 size={14}/> {room.size}</span>
        </div>
        <Link to={`/rooms/${room.slug}`}
              className="inline-flex items-center gap-1 text-brand-700 font-medium text-sm hover:gap-2 transition-all">
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
