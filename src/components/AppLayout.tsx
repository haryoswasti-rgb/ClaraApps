import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, CalendarCheck, Car, ClipboardList, LogOut, Menu, X, BarChart3
} from 'lucide-react';

const adminLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/requests', icon: ClipboardList, label: 'Pengajuan' },
  { to: '/vehicles', icon: Car, label: 'Kendaraan' },
  { to: '/availability', icon: CalendarCheck, label: 'Ketersediaan' },
  { to: '/reports', icon: BarChart3, label: 'Laporan' },
];

const peminjamLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/new-request', icon: FileText, label: 'Ajukan' },
  { to: '/my-requests', icon: ClipboardList, label: 'Pengajuan Saya' },
  { to: '/availability', icon: CalendarCheck, label: 'Ketersediaan' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = user?.role === 'admin' ? adminLinks : peminjamLinks;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 gradient-sidebar text-sidebar-foreground">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-sidebar-primary-foreground text-sm">Kendaraan Dinas</h2>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-primary-foreground'
                }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-sidebar-primary-foreground truncate">{user?.name}</span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-destructive transition">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 gradient-sidebar h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-primary-foreground" />
          <span className="font-bold text-primary-foreground text-sm">Kendaraan Dinas</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-primary-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-foreground/50" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full gradient-sidebar p-4 pt-16 space-y-1" onClick={e => e.stopPropagation()}>
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  location.pathname === l.to
                    ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
                }`}
              >
                <l.icon className="w-4 h-4" />{l.label}
              </Link>
            ))}
            <button onClick={logout} className="flex items-center gap-2 px-3 py-2.5 text-sm text-sidebar-foreground/60 hover:text-destructive">
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 lg:overflow-y-auto pt-14 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
