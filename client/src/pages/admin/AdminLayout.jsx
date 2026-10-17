import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, BedDouble, Sparkles, FileText, Newspaper, Inbox, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const nav = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/rooms',    label: 'Rooms',      icon: BedDouble },
  { to: '/admin/services', label: 'Services',   icon: Sparkles },
  { to: '/admin/pages',    label: 'Pages',      icon: FileText },
  { to: '/admin/blog',     label: 'Blog',       icon: Newspaper },
  { to: '/admin/bookings', label: 'Bookings',   icon: Inbox },
  { to: '/admin/settings', label: 'Settings',   icon: Settings },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div className="min-h-screen grid place-items-center">Loading…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="w-64 bg-ink text-cream/90 fixed inset-y-0 left-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="font-serif text-xl font-bold text-white">Vrindavan CMS</div>
          <div className="text-xs text-cream/50 mt-1">Admin Panel</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive ? 'bg-brand-600 text-white' : 'text-cream/70 hover:bg-white/5'
              }`}>
              <n.icon size={16}/> {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={async () => { await logout(); navigate('/admin/login'); }}
          className="m-4 flex items-center gap-2 text-sm text-cream/70 hover:text-white">
          <LogOut size={16}/> Logout
        </button>
      </aside>
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
