import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import SEO from '../components/SEO';
import { api } from '../lib/api';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { api.get('/blog').then(setPosts); }, []);
  return (
    <>
      <SEO title="Blog" description="Travel tips, temple guides and stories from Vrindavan." path="/blog" />
      <section className="bg-gradient-to-b from-brand-50 to-cream py-16 text-center">
        <h1 className="text-5xl font-serif font-bold">Blog & Journal</h1>
        <p className="text-ink/70 mt-3">Stories, guides & devotional wisdom.</p>
      </section>
      <section className="section container-x grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p, i) => (
          <motion.article key={p.id}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="card">
            <Link to={`/blog/${p.slug}`}>
              <img src={p.cover} alt={p.title} className="w-full h-52 object-cover"/>
              <div className="p-6">
                <div className="flex gap-4 text-xs text-ink/60 mb-2">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {p.date}</span>
                  <span className="flex items-center gap-1"><User size={12}/> {p.author}</span>
                </div>
                <h3 className="text-lg font-serif font-semibold hover:text-brand-700">{p.title}</h3>
                <p className="text-sm text-ink/70 mt-2 line-clamp-2">{p.excerpt}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </section>
    </>
  );
}
