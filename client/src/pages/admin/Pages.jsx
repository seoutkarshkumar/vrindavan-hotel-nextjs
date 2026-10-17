import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, ExternalLink } from 'lucide-react';
import { api } from '../../lib/api';

const empty = { slug: '', title: '', content: '# New Page\n\nWrite your content here…', published: true };

export default function AdminPages() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = () => api.get('/pages').then(setItems);
  useEffect(() => { load(); }, []);

  const save = async e => {
    e.preventDefault();
    if (editing.id) await api.put(`/pages/${editing.id}`, editing);
    else            await api.post('/pages', editing);
    setEditing(null); load();
  };
  const del = async id => { if (confirm('Delete this page?')) { await api.del(`/pages/${id}`); load(); } };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold">Custom Pages</h1>
        <button onClick={() => setEditing(empty)} className="btn-primary text-sm"><Plus size={16}/> Add Page</button>
      </div>
      <div className="grid gap-3">
        {items.map(p => (
          <div key={p.id} className="card p-5 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-semibold">{p.title}</h3>
              <div className="text-xs text-ink/60">/pages/{p.slug} {p.published ? '· 🟢 live' : '· ⚪ draft'}</div>
            </div>
            <div className="flex gap-2">
              <a href={`/pages/${p.slug}`} target="_blank" rel="noreferrer"
                 className="text-xs px-3 py-1 rounded-full bg-brand-50 text-brand-700 inline-flex items-center gap-1">
                View <ExternalLink size={12}/>
              </a>
              <button onClick={() => setEditing(p)} className="text-xs px-3 py-1 rounded-full bg-brand-100 text-brand-700">Edit</button>
              <button onClick={() => del(p.id)} className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700"><Trash2 size={12} className="inline"/> Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4 overflow-auto">
          <form onSubmit={save} className="bg-white rounded-2xl w-full max-w-3xl p-6 space-y-3 my-auto">
            <h2 className="text-xl font-serif font-bold">{editing.id ? 'Edit' : 'New'} Page</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input required className="input" placeholder="Title" value={editing.title}
                     onChange={e => setEditing({ ...editing, title: e.target.value })}/>
              <input required className="input" placeholder="Slug (e.g. terms)" value={editing.slug}
                     onChange={e => setEditing({ ...editing, slug: e.target.value })}/>
            </div>
            <textarea required rows={14} className="input font-mono text-sm" placeholder="Markdown content"
                      value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })}/>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editing.published}
                     onChange={e => setEditing({ ...editing, published: e.target.checked })}/> Published
            </label>
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
