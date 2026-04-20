import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardPlus, FileBarChart, Car } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/peminjaman", label: "Input Peminjaman", icon: ClipboardPlus },
  { to: "/report", label: "Report", icon: FileBarChart },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar flex flex-col z-30">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
          <Car className="w-5 h-5 text-sidebar-primary" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-accent-foreground leading-tight">CLARA</h1>
          <p className="text-xs text-sidebar-muted">Car Log & Reservation App</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-muted text-center">© 2026 CLARA</p>
      </div>
    </aside>
  );
}
