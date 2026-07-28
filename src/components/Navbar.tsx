import { useEffect, useState } from 'react';
import { Menu, X, Compass } from 'lucide-react';
import { NAV_LINKS } from '@/data';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Fermeture par touche Échap ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* ── Blocage du scroll body quand menu ouvert ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'navbar-scrolled py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">

          {/* ── Logo ── */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/70 rounded-2xl"
            aria-label="Retour à l'accueil"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-ocean to-forest flex items-center justify-center shadow-ocean group-hover:scale-110 transition-transform duration-300">
              <Compass className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-6" />
            </div>
            <div className="text-left leading-none">
              <span className="text-xl font-extrabold text-white tracking-tight">StayEatSee<span className="text-gold-light">+</span></span>
              <span className="block text-[10px] tracking-[0.25em] text-white/70 font-medium mt-0.5">Kribi · Cameroun</span>
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/70 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {/* Indicateur actif : trait gold animé */}
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gold-light transition-all duration-300 ${
                      isActive ? 'w-5 opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* ── CTA desktop ── */}
          <div className="hidden lg:block">
            <button
              onClick={() => handleNav('contact')}
              className="btn-shimmer text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-ocean focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/70"
            >
              Réserver maintenant
            </button>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="lg:hidden text-white p-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/70 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
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
                  className={`px-4 py-3 rounded-2xl text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/70 ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/85 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-light shrink-0 animate-pulse" />
                    )}
                    {link.label}
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => handleNav('contact')}
              className="btn-shimmer text-white px-4 py-3 rounded-2xl font-semibold mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/70"
            >
              Réserver maintenant
            </button>
          </div>
        </div>
      </nav>

      {/* ── Overlay semi-transparent derrière le menu mobile ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm lg:hidden"
          style={{ top: '0' }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
