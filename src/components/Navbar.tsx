import { useEffect, useState, memo, useCallback } from 'react';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { NAV_LINKS } from '@/data';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar = memo(function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, toggleCart } = useCart();
  const { session, profile, openAuthModal } = useAuth();

  /* ── Throttled scroll listener ── */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Fermeture par touche Échap ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey, { passive: true });
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* ── Blocage du scroll body quand menu ouvert ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNav = useCallback((page: string) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigate]);

  const itemCount = items.length;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'navbar-scrolled py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 sm:px-5 lg:px-8">

          {/* ── Logo ── */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70 rounded-2xl"
            aria-label="Retour à l'accueil"
          >
            {/* ── Icon (désactivé en attendant le logo transparent final) ── */}
            {/*
            <img
              src="/web-app-manifest-512x512.png"
              alt=""
              className={`shrink-0 object-contain transition-all duration-[350ms] ease-in-out ${
                scrolled
                  ? 'opacity-100 w-8 h-8 scale-100 mr-2.5'
                  : 'opacity-0 w-0 h-0 scale-75 mr-0'
              }`}
              aria-hidden={!scrolled}
            />
            */}
            {/* ── Texte toujours visible ── */}
            <div className="text-left leading-none whitespace-nowrap">
              <span className="text-2xl font-extrabold tracking-tight leading-none">
                <span className="text-brand">Stay</span><span className="text-accent">Eat</span><span className="text-sky">See</span><span className="text-accent">+</span>
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-white/60 font-medium mt-0.5">Kribi · Cameroun</span>
            </div>
          </button>

          {/* ── Desktop links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nav-link px-4 py-2 rounded-full text-sm transition-all duration-300 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-accent-light transition-all duration-300 ${
                      isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>



          <div className="flex items-center gap-2 shrink-0">
            {/* ── Panier (gauche des initiales) ── */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-full text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-light text-navy text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold leading-none">
                  {itemCount}
                </span>
              )}
            </button>

            {/* ── Compte / initiales ── */}
            {session && profile?.role === 'customer' ? (
              <button
                onClick={() => {
                  window.location.href = '/compte';
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7d7a4] text-sm font-bold text-[#0d2b46] shadow-[0_0_0_3px_rgba(255,255,255,0.6),0_8px_20px_rgba(247,215,164,0.45)] ring-2 ring-[#fff4d6] transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
                aria-label="Mon compte"
                title="Mon compte"
              >
                {(() => {
                  const fullName = profile?.full_name?.trim();
                  const email = session.user.email ?? '';
                  const source = fullName || email;
                  const initials = source
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase();

                  return initials || email.slice(0, 2).toUpperCase();
                })()}
              </button>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="p-2.5 rounded-full text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
                aria-label="Connexion au compte"
                title="Connexion"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* ── Hamburger (droite des initiales, mobile only) ── */}
            <button
              className="lg:hidden text-white p-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu panel ── */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-400 ${
            mobileOpen ? 'max-h-[500px] mt-3' : 'max-h-0'
          }`}
        >
          <div className="glass-dark mx-5 rounded-3xl p-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nav-link px-4 py-3 rounded-2xl text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70 ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/85 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-light shrink-0 animate-pulse" />
                    )}
                    {link.label}
                  </span>
                </button>
              );
            })}

            {session && profile?.role === 'customer' ? (
              <button
                onClick={() => {
                  window.location.href = '/compte';
                  setMobileOpen(false);
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f7d7a4] text-[11px] font-bold text-[#0d2b46] ring-2 ring-[#fff4d6] shadow-[0_0_0_2px_rgba(255,255,255,0.4)]">
                  {(() => {
                    const fullName = profile?.full_name?.trim();
                    const email = session.user.email ?? '';
                    const source = fullName || email;
                    const initials = source
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')
                      .toUpperCase();

                    return initials || email.slice(0, 2).toUpperCase();
                  })()}
                </span>
                Mon compte
              </button>
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setMobileOpen(false);
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
              >
                <User className="w-4 h-4" />
                Se connecter
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Overlay semi-transparent derrière le menu mobile ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand/60 backdrop-blur-sm lg:hidden"
          style={{ top: '0' }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
});