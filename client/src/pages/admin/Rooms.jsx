import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, Star } from 'lucide-react';
import { api } from '../../lib/api';

const empty = {
  slug: '', name: '', price: 2500, capacity: 2, size: '', beds: '',
  featured: false, shortDesc: '', description: '',
  amenities: 'Free Wi-Fi, AC, TV',
  images: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/rooms').then(setRooms);
  useEffect(() => { load(); }, []);

  const toEdit = r => setEditing({
    ...r,
    amenities: (r.amenities || []).join(', '),
    images:    (r.images || []).join(', '),
  });

  const save = async e => {
    e.preventDefault();
    const payload = {
      ...editing,
      price: Number(editing.price),
      capacity: Number(editing.capacity),
      amenities: String(editing.amenities).split(',').map(s => s.trim()).filter(Boolean),
      images:    String(editing.images).split(',').map(s => s.trim()).filter(Boolean),
    };
    if (editing.id) await api.put(`/rooms/${editing.id}`, payload);
    else            await api.post('/rooms', payload);
    setEditing(null); load();
  };

  const del = async id => { if (confirm('Delete this room?')) { await api.del(`/rooms/${id}`); load(); } };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold">Rooms</h1>
        <button onClick={() => setEditing(empty)} className="btn-primary text-sm"><Plus size={16}/> Add Room</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {rooms.map(r => (
          <div key={r.id} className="card p-5 flex gap-4">
            <img src={r.images?.[0]} className="w-24 h-24 rounded-xl object-cover" alt=""/>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-serif text-lg font-semibold">{r.name}</h3>
                {r.featured && <Star size={16} className="text-brand-500 fill-brand-500"/>}
              </div>
              <p className="text-xs text-ink/60 line-clamp-2">{r.shortDesc}</p>
              <div className="text-sm text-brand-700 font-medium mt-1">₹{r.price?.toLocaleString()} / night</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => toEdit(r)} className="text-xs px-3 py-1 rounded-full bg-brand-100 text-brand-700">Edit</button>
                <button onClick={() => del(r.id)} className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700"><Trash2 size={12} className="inline"/> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4 overflow-auto">
          <form onSubmit={save} className="bg-white rounded-2xl w-full max-w-2xl p-6 space-y-3 my-auto">
            <h2 className="text-xl font-serif font-bold">{editing.id ? 'Edit' : 'Add'} Room</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input required className="input" placeholder="Name" value={editing.name}
                     onChange={e => setEditing({ ...editing, name: e.target.value })}/>
              <input required className="input" placeholder="Slug (e.g. deluxe-room)" value={editing.slug}
                     onChange={e => setEditing({ ...editing, slug: e.target.value })}/>
              <input required type="number" className="input" placeholder="Price / night" value={editing.price}
                     onChange={e => setEditing({ ...editing, price: e.target.value })}/>
              <input required type="number" className="input" placeholder="Capacity" value={editing.capacity}
                     onChange={e => setEditing({ ...editing, capacity: e.target.value })}/>
              <input className="input" placeholder="Size (e.g. 280 sq ft)" value={editing.size}
                     onChange={e => setEditing({ ...editing, size: e.target.value })}/>
              <input className="input" placeholder="Beds" value={editing.beds}
                     onChange={e => setEditing({ ...editing, beds: e.target.value })}/>
            </div>
            <input className="input" placeholder="Short description" value={editing.shortDesc}
                   onChange={e => setEditing({ ...editing, shortDesc: e.target.value })}/>
            <textarea rows={4} className="input" placeholder="Full description" value={editing.description}
                      onChange={e => setEditing({ ...editing, description: e.target.value })}/>
            <input className="input" placeholder="Amenities (comma separated)" value={editing.amenities}
                   onChange={e => setEditing({ ...editing, amenities: e.target.value })}/>
            <textarea rows={2} className="input" placeholder="Image URLs (comma separated)" value={editing.images}
                      onChange={e => setEditing({ ...editing, images: e.target.value })}/>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editing.featured}
                     onChange={e => setEditing({ ...editing, featured: e.target.checked })}/> Featured on homepage
            </label>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="text-sm px-4 py-2">Cancel</button>
              <button className="btn-primary text-sm"><Save size={14}/> Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
