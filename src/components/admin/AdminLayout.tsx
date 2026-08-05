import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, Compass, Home, FileText, Image, Users, LogOut, Menu, X, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin',                label: "Vue d'ensemble",  icon: LayoutDashboard, color: 'from-brand to-brand-light',  dot: '#1A3C7A' },
  { to: '/admin/customers',      label: 'Clients',         icon: Users,            color: 'from-accent to-sky',          dot: '#D4572A' },
  { to: '/admin/experiences',    label: 'Expériences',     icon: Compass,          color: 'from-sky to-sky-light',      dot: '#3EABD4' },
  { to: '/admin/accommodations', label: 'Hébergements',    icon: Home,             color: 'from-brand to-sky',          dot: '#254FA3' },
  { to: '/admin/blog',           label: 'Articles de blog',icon: FileText,         color: 'from-accent to-accent-light',dot: '#D4572A' },
  { to: '/admin/gallery',        label: 'Galerie',         icon: Image,            color: 'from-sky to-brand',          dot: '#3EABD4' },
];

export function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-sky flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xs">S+</span>
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight leading-none">
              <span style={{ color: '#6BA3FF' }}>Stay</span>
              <span className="text-[#E87A50]">Eat</span>
              <span className="text-[#6DC4E4]">See</span>
              <span className="text-[#E87A50]">+</span>
            </div>
            <span className="block text-[9px] tracking-[0.25em] text-white/40 font-medium mt-0.5 uppercase">Administration</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'text-white'
                    : 'text-white/55 hover:text-white/90 hover:bg-white/6'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 rounded-xl`}
                    />
                  )}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                      style={{ background: item.dot }}
                    />
                  )}
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? `bg-gradient-to-br ${item.color} shadow-lg`
                        : 'bg-white/8 group-hover:bg-white/12'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="relative z-10 flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 relative z-10 opacity-60" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-white/8" />

      {/* Sign out */}
      <div className="px-3 py-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/45 hover:text-red-400 hover:bg-red-500/10 transition-all w-full group"
        >
          <span className="w-8 h-8 rounded-lg bg-white/8 group-hover:bg-red-500/15 flex items-center justify-center transition-all">
            <LogOut className="w-4 h-4" />
          </span>
          Se déconnecter
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F0F4FA]">
      {/* ─── Mobile topbar ─── */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden flex items-center justify-between bg-[#0D1F3C] text-white px-4 py-3 shadow-lg border-b border-white/8">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/18 transition-all"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-sky flex items-center justify-center">
            <span className="text-white font-black text-[9px]">S+</span>
          </div>
          <span className="font-extrabold text-sm tracking-tight">
            <span style={{ color: '#4A7FD4' }}>Stay</span>
            <span className="text-[#E87A50]">Eat</span>
            <span className="text-[#6DC4E4]">See</span>
            <span className="text-[#E87A50]">+</span>
          </span>
          <span className="text-white/40 text-xs font-medium ml-1">Admin</span>
        </div>

        <div className="w-9" />
      </div>

      {/* ─── Overlay mobile ─── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`
          w-60 shrink-0
          fixed lg:sticky top-0 left-0 h-screen z-50
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        style={{
          background: 'linear-gradient(170deg, #0D1F3C 0%, #0F2547 60%, #0D1E3A 100%)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.35)',
        }}
      >
        {/* Fermeture mobile */}
        <div className="lg:hidden flex justify-end px-4 pt-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/18 text-white/70 hover:text-white transition-all"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-32 h-32 rounded-full bg-accent/8 blur-2xl pointer-events-none" />

        {sidebarContent}
      </aside>

      {/* ─── Main content ─── */}
      <main className="flex-1 min-w-0 overflow-x-hidden pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}