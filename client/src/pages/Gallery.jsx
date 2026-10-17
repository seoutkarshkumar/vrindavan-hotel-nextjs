import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const images = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
  'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800',
  'https://images.unsplash.com/photo-1609946860441-a51ffcf22208?w=800',
];

export default function Gallery() {
  return (
    <>
      <SEO title="Gallery" description="Photo gallery of Vrindavan Hotel." path="/gallery" />
      <section className="bg-gradient-to-b from-brand-50 to-cream py-16 text-center">
        <h1 className="text-5xl font-serif font-bold">Gallery</h1>
        <p className="text-ink/70 mt-3">Moments captured at Vrindavan Hotel.</p>
      </section>
      <section className="section container-x">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
          {images.map((img, i) => (
            <motion.img key={i} src={img} alt=""
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="w-full rounded-2xl shadow-soft hover:scale-[1.02] transition break-inside-avoid" />
          ))}
        </div>
      </section>
    </>
  );
}
