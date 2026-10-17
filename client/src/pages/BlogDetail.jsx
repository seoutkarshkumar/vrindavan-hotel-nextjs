import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { api } from '../lib/api';

// Very lightweight markdown → HTML (headings, bold, italic, lists, paragraphs)
function md(src = '') {
  const lines = src.split('\n');
  let html = '', inList = false;
  const flushList = () => { if (inList) { html += '</ul>'; inList = false; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('# '))       { flushList(); html += `<h1>${line.slice(2)}</h1>`; }
    else if (line.startsWith('## ')) { flushList(); html += `<h2>${line.slice(3)}</h2>`; }
    else if (line.startsWith('### ')){ flushList(); html += `<h3>${line.slice(4)}</h3>`; }
    else if (line.startsWith('- '))  {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${line.slice(2)}</li>`;
    } else if (line === '')          { flushList(); }
    else                             { flushList(); html += `<p>${line}</p>`; }
  }
  flushList();
  return html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => { api.get(`/blog/${slug}`).then(setPost).catch(() => setPost(false)); }, [slug]);

  if (post === false) return <div className="container-x py-24 text-center">Post not found.</div>;
  if (!post) return <div className="container-x py-24 text-center">Loading…</div>;

  return (
    <>
      <SEO title={post.title} description={post.excerpt} image={post.cover} path={`/blog/${post.slug}`} />
      <article className="container-x py-12 max-w-3xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-1 text-brand-700 mb-6 hover:gap-2 transition-all">
          <ArrowLeft size={14}/> Back to blog
        </Link>
        <img src={post.cover} alt={post.title} className="w-full h-80 object-cover rounded-3xl shadow-soft mb-8"/>
        <div className="flex gap-4 text-sm text-ink/60 mb-4">
          <span className="flex items-center gap-1"><Calendar size={14}/> {post.date}</span>
          <span className="flex items-center gap-1"><User size={14}/> {post.author}</span>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-6">{post.title}</h1>
        <div className="prose-like" dangerouslySetInnerHTML={{ __html: md(post.content) }} />
      </article>
    </>
  );
}
