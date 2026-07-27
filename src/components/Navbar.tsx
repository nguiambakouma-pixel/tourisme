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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'navbar-scrolled py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-ocean to-forest flex items-center justify-center shadow-ocean group-hover:scale-110 transition-transform duration-300">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div className="text-left leading-none">
            <span className="text-xl font-extrabold text-white tracking-tight">StayEatSee<span className="text-gold-light">+</span></span>
            <span className="block text-[10px] tracking-[0.25em] text-white/70 font-medium mt-0.5">Kribi · Cameroun</span>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                currentPage === link.page
                  ? 'text-white bg-white/15'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:block">
          <button
            onClick={() => handleNav('contact')}
            className="btn-shimmer text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-ocean"
          >
            Réserver maintenant
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? 'max-h-[500px] mt-3' : 'max-h-0'
        }`}
      >
        <div className="glass-dark mx-5 rounded-3xl p-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`px-4 py-3 rounded-2xl text-left font-medium transition-all ${
                currentPage === link.page ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('contact')}
            className="btn-shimmer text-white px-4 py-3 rounded-2xl font-semibold mt-2"
          >
            Réserver maintenant
          </button>
        </div>
      </div>
    </nav>
  );
}
