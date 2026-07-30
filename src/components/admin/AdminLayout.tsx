import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, Compass, Home, FileText, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin',           label: "Vue d'ensemble",  icon: LayoutDashboard },
  { to: '/admin/experiences',    label: 'Expériences',     icon: Compass },
  { to: '/admin/accommodations', label: 'Hébergements',    icon: Home },
  { to: '/admin/blog',           label: 'Articles de blog', icon: FileText },
];

export function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A2540] text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/10">
          <div className="text-lg font-extrabold tracking-tight">
            <span className="text-white">Stay</span><span className="text-accent">Eat</span><span className="text-sky">See</span><span className="text-accent">+</span>
            <span className="block text-[10px] tracking-[0.2em] text-white/50 font-medium mt-0.5">Administration</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 pb-6 border-t border-white/10 pt-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-50 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}