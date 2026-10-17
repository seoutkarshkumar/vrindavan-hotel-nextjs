import { useEffect, useState } from 'react';
import { Save, KeyRound } from 'lucide-react';
import { api } from '../../lib/api';
import { useSettings } from '../../context/SettingsContext';

export default function AdminSettings() {
  const { refresh } = useSettings();
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState(null);
  const [pw, setPw] = useState({ password: '', hash: '' });

  useEffect(() => { api.get('/settings').then(setS); }, []);

  const save = async e => {
    e.preventDefault();
    setMsg(null);
    try { await api.put('/settings', s); await refresh(); setMsg('✅ Saved successfully.'); }
    catch (err) { setMsg('❌ ' + err.message); }
  };

  const gen = async () => {
    setPw(p => ({ ...p, hash: '…generating' }));
    try { const r = await api.post('/auth/hash', { password: pw.password }); setPw(p => ({ ...p, hash: r.hash })); }
    catch (err) { setPw(p => ({ ...p, hash: 'Error: ' + err.message })); }
  };

  if (!s) return <div>Loading…</div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-3xl font-serif font-bold">Settings</h1>

      <form onSubmit={save} className="card p-6 space-y-3">
        <h2 className="font-serif text-xl font-semibold">Site Information</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Site Name" value={s.siteName || ''}
                 onChange={e => setS({ ...s, siteName: e.target.value })}/>
          <input className="input" placeholder="Tagline" value={s.tagline || ''}
                 onChange={e => setS({ ...s, tagline: e.target.value })}/>
        </div>
        <textarea rows={3} className="input" placeholder="Meta description" value={s.description || ''}
                  onChange={e => setS({ ...s, description: e.target.value })}/>
        <input className="input" placeholder="Meta keywords" value={s.keywords || ''}
               onChange={e => setS({ ...s, keywords: e.target.value })}/>

        <h2 className="font-serif text-xl font-semibold pt-4">Contact</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="input" placeholder="Phone" value={s.phone || ''}
                 onChange={e => setS({ ...s, phone: e.target.value })}/>
          <input className="input" placeholder="WhatsApp (number w/o +)" value={s.whatsapp || ''}
                 onChange={e => setS({ ...s, whatsapp: e.target.value })}/>
          <input className="input md:col-span-2" placeholder="Email (bookings)" value={s.email || ''}
                 onChange={e => setS({ ...s, email: e.target.value })}/>
        </div>
        <textarea rows={2} className="input" placeholder="Address" value={s.address || ''}
                  onChange={e => setS({ ...s, address: e.target.value })}/>
        <textarea rows={2} className="input" placeholder="Google Maps embed URL" value={s.mapEmbed || ''}
                  onChange={e => setS({ ...s, mapEmbed: e.target.value })}/>

        <h2 className="font-serif text-xl font-semibold pt-4">Social Links</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {['facebook', 'instagram', 'twitter', 'youtube'].map(k => (
            <input key={k} className="input" placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                   value={s.social?.[k] || ''}
                   onChange={e => setS({ ...s, social: { ...s.social, [k]: e.target.value } })}/>
          ))}
        </div>

        <button className="btn-primary"><Save size={16}/> Save Settings</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>

      <div className="card p-6 space-y-3">
        <h2 className="font-serif text-xl font-semibold flex items-center gap-2"><KeyRound size={20}/> Change Admin Password</h2>
        <p className="text-sm text-ink/70">
          Generate a bcrypt hash below. Then paste it as <code>ADMIN_PASSWORD_HASH</code> in your <code>.env</code> file and restart the server.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <input type="password" className="input md:col-span-2" placeholder="New password (min 6 chars)"
                 value={pw.password} onChange={e => setPw({ ...pw, password: e.target.value })}/>
          <button type="button" onClick={gen} className="btn-outline">Generate Hash</button>
        </div>
        {pw.hash && (
          <textarea readOnly rows={2} className="input font-mono text-xs" value={pw.hash}/>
        )}
      </div>
    </div>
  );
}
