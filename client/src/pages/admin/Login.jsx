import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: 'admin', password: '' });
  const [err, setErr]   = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setErr(null);
    try { await login(form.username, form.password); nav('/admin'); }
    catch (ex) { setErr(ex.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-brand-700 to-brand-900 p-6">
      <form onSubmit={submit} className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white grid place-items-center mx-auto mb-4">
          <Lock size={26}/>
        </div>
        <h1 className="text-2xl font-serif font-bold text-center mb-1">Admin Login</h1>
        <p className="text-center text-ink/60 text-sm mb-6">Vrindavan Hotel CMS</p>
        <div className="space-y-4">
          <input required className="input" placeholder="Username" value={form.username}
                 onChange={e => setForm({ ...form, username: e.target.value })} />
          <input required type="password" className="input" placeholder="Password" value={form.password}
                 onChange={e => setForm({ ...form, password: e.target.value })} />
          <button disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          {err && <p className="text-red-600 text-sm text-center">{err}</p>}
        </div>
        <p className="mt-6 text-xs text-center text-ink/50">
          Default password: <code className="bg-brand-50 px-1">Vrindavan@123</code>
        </p>
      </form>
    </div>
  );
}
