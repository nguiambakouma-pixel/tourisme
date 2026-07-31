import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { LayoutDashboard, Compass, Home, FileText, Image, LogOut, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin',           label: "Vue d'ensemble",  icon: LayoutDashboard },
  { to: '/admin/experiences',    label: 'Expériences',     icon: Compass },
  { to: '/admin/accommodations', label: 'Hébergements',    icon: Home },
  { to: '/admin/blog',           label: 'Articles de blog', icon: FileText },
  { to: '/admin/gallery',        label: 'Galerie',          icon: Image },
];

export function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fermer le menu mobile à chaque navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Bloquer le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const sidebarContent = (
    <>
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
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Barre supérieure mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden flex items-center justify-between bg-[#0A2540] text-white px-4 py-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition-all"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-sm font-extrabold tracking-tight">
          <span className="text-white">Stay</span><span className="text-accent">Eat</span><span className="text-sky">See</span><span className="text-accent">+</span>
          <span className="text-white/60 font-medium ml-1.5">Admin</span>
        </span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar : desktop toujours visible, mobile en tiroir */}
      <aside
        className={`
          w-64 bg-[#0A2540] text-white flex flex-col shrink-0
          fixed lg:sticky top-0 left-0 h-full z-50
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Bouton fermeture mobile dans la sidebar */}
        <div className="lg:hidden flex justify-end px-4 pt-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-all text-white/70 hover:text-white"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sidebarContent}
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 bg-slate-50 p-8 overflow-y-auto pt-16 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
}