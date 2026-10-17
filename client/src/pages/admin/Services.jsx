import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../../lib/api';

const empty = { icon: 'Sparkles', title: '', description: '' };

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = () => api.get('/services').then(setItems);
  useEffect(() => { load(); }, []);

  const save = async e => {
    e.preventDefault();
    if (editing.id) await api.put(`/services/${editing.id}`, editing);
    else            await api.post('/services', editing);
    setEditing(null); load();
  };
  const del = async id => { if (confirm('Delete this service?')) { await api.del(`/services/${id}`); load(); } };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold">Services</h1>
        <button onClick={() => setEditing(empty)} className="btn-primary text-sm"><Plus size={16}/> Add Service</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(s => (
          <div key={s.id} className="card p-5">
            <div className="text-xs text-brand-700 font-medium">{s.icon}</div>
            <h3 className="font-serif text-lg font-semibold mt-1">{s.title}</h3>
            <p className="text-sm text-ink/70 mt-1">{s.description}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEditing(s)} className="text-xs px-3 py-1 rounded-full bg-brand-100 text-brand-700">Edit</button>
              <button onClick={() => del(s.id)} className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700"><Trash2 size={12} className="inline"/> Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4">
          <form onSubmit={save} className="bg-white rounded-2xl w-full max-w-md p-6 space-y-3">
            <h2 className="text-xl font-serif font-bold">{editing.id ? 'Edit' : 'Add'} Service</h2>
            <input required className="input" placeholder="Title" value={editing.title}
                   onChange={e => setEditing({ ...editing, title: e.target.value })}/>
            <input required className="input" placeholder="Icon name (lucide-react e.g. Utensils, Car, Wifi)"
                   value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })}/>
            <textarea required rows={3} className="input" placeholder="Description" value={editing.description}
                      onChange={e => setEditing({ ...editing, description: e.target.value })}/>
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
