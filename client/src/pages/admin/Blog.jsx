import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../../lib/api';

const empty = {
  slug: '', title: '', excerpt: '', cover: 'https://images.unsplash.com/photo-1609946860441-a51ffcf22208?w=1200',
  author: 'Vrindavan Hotel Team', tags: 'temples,travel', content: '# New Post\n\nWrite your blog content here…',
};

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = () => api.get('/blog').then(setItems);
  useEffect(() => { load(); }, []);

  const toEdit = p => setEditing({ ...p, tags: (p.tags || []).join(',') });

  const save = async e => {
    e.preventDefault();
    const payload = { ...editing, tags: String(editing.tags).split(',').map(t => t.trim()).filter(Boolean) };
    if (editing.id) await api.put(`/blog/${editing.id}`, payload);
    else            await api.post('/blog', payload);
    setEditing(null); load();
  };
  const del = async id => { if (confirm('Delete this post?')) { await api.del(`/blog/${id}`); load(); } };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold">Blog Posts</h1>
        <button onClick={() => setEditing(empty)} className="btn-primary text-sm"><Plus size={16}/> New Post</button>
      </div>
      <div className="grid gap-4">
        {items.map(p => (
          <div key={p.id} className="card p-4 flex gap-4">
            <img src={p.cover} className="w-32 h-20 object-cover rounded-lg" alt=""/>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold">{p.title}</h3>
              <div className="text-xs text-ink/60">{p.date} · {p.author}</div>
              <p className="text-sm text-ink/70 mt-1 line-clamp-1">{p.excerpt}</p>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <button onClick={() => toEdit(p)} className="text-xs px-3 py-1 rounded-full bg-brand-100 text-brand-700">Edit</button>
              <button onClick={() => del(p.id)} className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700"><Trash2 size={12} className="inline"/> Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4 overflow-auto">
          <form onSubmit={save} className="bg-white rounded-2xl w-full max-w-3xl p-6 space-y-3 my-auto">
            <h2 className="text-xl font-serif font-bold">{editing.id ? 'Edit' : 'New'} Post</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input required className="input" placeholder="Title" value={editing.title}
                     onChange={e => setEditing({ ...editing, title: e.target.value })}/>
              <input required className="input" placeholder="Slug" value={editing.slug}
                     onChange={e => setEditing({ ...editing, slug: e.target.value })}/>
            </div>
            <input className="input" placeholder="Cover image URL" value={editing.cover}
                   onChange={e => setEditing({ ...editing, cover: e.target.value })}/>
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input" placeholder="Author" value={editing.author}
                     onChange={e => setEditing({ ...editing, author: e.target.value })}/>
              <input className="input" placeholder="Tags (comma separated)" value={editing.tags}
                     onChange={e => setEditing({ ...editing, tags: e.target.value })}/>
            </div>
            <input className="input" placeholder="Excerpt" value={editing.excerpt}
                   onChange={e => setEditing({ ...editing, excerpt: e.target.value })}/>
            <textarea required rows={14} className="input font-mono text-sm" placeholder="Markdown content"
                      value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })}/>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setEditing(null)} className="text-sm px-4 py-2">Cancel</button>
              <button className="btn-primary text-sm"><Save size={14}/> Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
