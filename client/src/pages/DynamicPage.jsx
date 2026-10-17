import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { api } from '../lib/api';

function md(src = '') {
  const lines = src.split('\n');
  let html = '', inList = false;
  const flush = () => { if (inList) { html += '</ul>'; inList = false; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('# '))       { flush(); html += `<h1>${line.slice(2)}</h1>`; }
    else if (line.startsWith('## ')) { flush(); html += `<h2>${line.slice(3)}</h2>`; }
    else if (line.startsWith('### ')){ flush(); html += `<h3>${line.slice(4)}</h3>`; }
    else if (line.startsWith('- '))  {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${line.slice(2)}</li>`;
    } else if (line === '')          { flush(); }
    else                             { flush(); html += `<p>${line}</p>`; }
  }
  flush();
  return html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export default function DynamicPage() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  useEffect(() => { api.get(`/pages/${slug}`).then(setP).catch(() => setP(false)); }, [slug]);
  if (p === false) return <div className="container-x py-24 text-center">Page not found.</div>;
  if (!p) return <div className="container-x py-24 text-center">Loading…</div>;
  return (
    <>
      <SEO title={p.title} description={p.title} path={`/pages/${p.slug}`} />
      <article className="container-x py-16 max-w-3xl mx-auto prose-like">
        <h1 className="text-4xl font-serif font-bold mb-6">{p.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: md(p.content) }} />
      </article>
    </>
  );
}
