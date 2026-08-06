import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, ArrowRight, Compass, Clock, Shield, Headphones,
  BadgeCheck, Wallet, Sparkles, Quote, ShoppingCart, Check, X, SlidersHorizontal,
} from 'lucide-react';
import { SectionTitle } from '@/components/ui';
import { AccommodationFeatures } from '@/components/AccommodationFeatures';
import { Testimonials } from '@/components/Testimonials';
import { useCounter, useInView, usePageMeta, useScrollReveal, useExperiences, useAccommodations } from '@/hooks';
import { useCart } from '@/lib/CartContext';

interface HomeProps { onNavigate: (page: string) => void }

// ── Typing animation hook ──────────────────────────────────────────
function useTypingAnimation(lines: string[], opts?: { charDelay?: number; lineDelay?: number; startDelay?: number }) {
  const { charDelay = 50, lineDelay = 600, startDelay = 200 } = opts ?? {};
  const [displayed, setDisplayed] = useState<string[]>(lines.map(() => ''));
  const [currentLine, setCurrentLine] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (currentLine >= lines.length) { setDone(true); return; }
    const line = lines[currentLine];
    let charIdx = 0;

    const typeChar = () => {
      charIdx++;
      setDisplayed(prev => {
        const next = [...prev];
        next[currentLine] = line.slice(0, charIdx);
        return next;
      });
      if (charIdx < line.length) {
        timeout = setTimeout(typeChar, charDelay);
      } else {
        timeout = setTimeout(() => setCurrentLine(l => l + 1), lineDelay);
      }
    };

    const initial = currentLine === 0 ? startDelay : 0;
    timeout = setTimeout(typeChar, initial);
    return () => clearTimeout(timeout);
  }, [currentLine]);

  return { displayed, done };
}

const HERO_POSTER = '/images/hero/kribi-hero-poster.jpg';
const HERO_VIDEO  = '/videos/kribi-hero.mp4';
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Detect slow connection
const isSlowConnection = typeof navigator !== 'undefined' && (
  'connection' in navigator && 
  (navigator as any).connection &&
  ((navigator as any).connection.effectiveType === 'slow-2g' || 
   (navigator as any).connection.effectiveType === '2g')
);

const usePosterInstead = prefersReducedMotion || isSlowConnection;

const STATS = [
  { value: 1500, suffix: '+', label: 'Voyageurs satisfaits' },
  { value: 40,   suffix: '+', label: 'Expériences uniques' },
  { value: 15,   suffix: '+', label: 'Guides locaux experts' },
  { value: 98,   suffix: '%', label: 'Clients satisfaits' },
];

const WHY_US = [
  { icon: Compass,    title: 'Guides locaux experts',    desc: 'Des guides nés à Kribi, passionnés et certifiés, qui connaissent chaque recoin de la région.' },
  { icon: Shield,     title: 'Sécurité garantie',         desc: 'Activités encadrées et matériel conforme. Votre sécurité est notre priorité absolue.' },
  { icon: Headphones, title: 'Assistance 24h/24',         desc: 'Une équipe disponible jour et nuit pour répondre à vos questions et besoins.' },
  { icon: BadgeCheck, title: 'Hébergements sélectionnés', desc: 'Chaque logement est visité et validé par nos soins pour une qualité irréprochable.' },
  { icon: Wallet,     title: 'Prix transparents',         desc: 'Aucun frais caché. Le prix annoncé est le prix payé, clair et honnête.' },
  { icon: Sparkles,   title: 'Expériences authentiques',  desc: 'Des moments vrais, loin du tourisme de masse. Le Cameroun dans sa pureté.' },
];

const SUGGESTIONS = ['Chutes de la Lobé', 'Jet Ski'];

const StatCounter = memo(function StatCounter({ value, suffix, label, start, delay }: { value: number; suffix: string; label: string; start: boolean; delay: number }) {
  const count = useCounter(value, 2000, start);
  return (
    <div
      className="reveal text-center bg-white/60 backdrop-blur rounded-3xl p-7 border border-white/80 shadow-lg"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="font-serif text-5xl md:text-6xl font-bold gradient-text">
        {count}{suffix}
      </div>
      <div className="text-slate-600 font-medium mt-3 text-sm md:text-base">{label}</div>
    </div>
  );
});

function HeroVideo() {
  if (usePosterInstead) {
    return (
      <img
        src={HERO_POSTER}
        alt="Plage de Kribi"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <video
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={HERO_POSTER}
    >
      <source src={HERO_VIDEO} type="video/mp4" />
    </video>
  );
}

// ── Hero Slogan with typing animation ─────────────────────────────
function HeroSloganAnimated({ onNavigate }: { onNavigate: (p: string) => void }) {
  const SLOGAN_LINES = [
    'Pour votre séjour à',
    'KRIBI,',
    'nous nous occupons de',
    'TOUT.',
  ];
  const { displayed, done } = useTypingAnimation(SLOGAN_LINES, {
    charDelay: 42,
    lineDelay: 380,
    startDelay: 250,
  });

  const lineClasses = (i: number) => {
    if (i === 1) {
      // KRIBI
      return 'font-slogan-bold text-[46px] sm:text-[58px] md:text-[68px] lg:text-[84px] xl:text-[92px] text-[#F8F8F5] leading-[1.0] tracking-[0.04em] mt-1 hero-text-shadow block';
    }
    if (i === 3) {
      // TOUT
      return 'font-slogan-bold text-[26px] sm:text-[32px] md:text-[38px] lg:text-[46px] xl:text-[52px] leading-[1.3] mt-2 hero-text-shadow block';
    }
    // subtitle lines — police fine sans-serif espacée (style image de référence)
    return 'font-sans font-light tracking-[0.18em] text-[17px] sm:text-[21px] md:text-[26px] lg:text-[32px] xl:text-[37px] text-[#F0EDE8] leading-[1.5] hero-text-shadow block';
  };

  return (
    <>
      <div className="flex flex-col gap-0.5">
        {SLOGAN_LINES.map((line, i) => {
          const isActive = displayed[i].length > 0 && displayed[i].length < line.length;
          const isTyped  = displayed[i].length === line.length;
          const isEmpty  = displayed[i].length === 0;
          if (isEmpty) return null;

          if (i === 3) {
            // TOUT. — special accent render
            return (
              <span key={i} className={lineClasses(i)}>
                <span className="text-accent hero-tout-glow relative inline-block">
                  {displayed[i]}
                  {isTyped && (
                    <span className="tout-shine-effect absolute inset-0">{displayed[i]}</span>
                  )}
                </span>
                {isActive && !done && (
                  <span className="inline-block ml-0.5 text-accent animate-[typing-cursor_1.1s_step-end_infinite]">|</span>
                )}
              </span>
            );
          }

          return (
            <span key={i} className={lineClasses(i)}>
              {i === 1 ? (
                // KRIBI — use motion for extra pop after typing
                <motion.span
                  initial={false}
                  animate={isTyped ? { letterSpacing: '0.06em' } : { letterSpacing: '0.04em' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {displayed[i]}
                </motion.span>
              ) : (
                displayed[i]
              )}
              {isActive && !done && (
                <span className="inline-block ml-0.5 text-accent/80 animate-[typing-cursor_1.1s_step-end_infinite]">|</span>
              )}
            </span>
          );
        })}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : 20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 md:mt-14"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onNavigate('experiences')}
            className="btn-shimmer text-white px-7 py-4 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-accent group hover:-translate-y-[5px] hover:shadow-lg hover:scale-[1.04] transition-all duration-300"
          >
            Découvrir nos expériences
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="glass text-white px-7 py-4 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-white/25 hover:-translate-y-[5px] hover:shadow-lg hover:scale-[1.04] transition-all duration-300"
          >
            Nous contacter
          </button>
        </div>
      </motion.div>
    </>
  );
}

export function HomePage({ onNavigate }: HomeProps) {
  usePageMeta('StayEatSee+ | Explorez Kribi Autrement', 'Vivez des expériences authentiques entre mer, forêt et culture locale à Kribi, Cameroun. Excursions, hébergements et gastronomie locale.');
  useScrollReveal();
  const { data: EXPERIENCES, loading: expLoading, error: expError } = useExperiences();
  const { data: ACCOMMODATIONS, loading: accLoading, error: accError } = useAccommodations();
  const { addItem, isInCart, removeItem } = useCart();
  const [searchValue, setSearchValue] = useState('');
  const [activeQuery, setActiveQuery] = useState(''); // query currently filtering results
  const { ref: statsRef, inView: statsInView } = useInView(0.3);

  // Derived: filtered data
  const filteredExperiences = useMemo(() => {
    if (!activeQuery) return EXPERIENCES.slice(0, 6);
    const q = activeQuery.toLowerCase();
    return EXPERIENCES.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.category && e.category.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q))
    );
  }, [activeQuery, EXPERIENCES]);

  const filteredAccommodations = useMemo(() => {
    if (!activeQuery) return ACCOMMODATIONS;
    const q = activeQuery.toLowerCase();
    return ACCOMMODATIONS.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.type && a.type.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q))
    );
  }, [activeQuery, ACCOMMODATIONS]);

  // Throttled scrollY for parallax
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = useMemo(() => Math.min(scrollY * 0.15, 20), [scrollY]);
  const videoParallax = useMemo(() => Math.min(scrollY * 0.05, 8), [scrollY]);
  const textOpacity = useMemo(() => 1 - Math.min(scrollY / 1200, 0.08), [scrollY]);

  const scrollToNext = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  const runSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    setActiveQuery(trimmed);
    // Scroll to results if there's a query
    if (trimmed) {
      setTimeout(() => {
        const el = document.getElementById('search-results');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchValue);
  }, [searchValue, runSearch]);

  const handleSuggestionClick = useCallback((tag: string) => {
    setSearchValue(tag);
    runSearch(tag);
  }, [runSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setActiveQuery('');
  }, []);

  return (
    <div className="page-enter">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Video / poster background */}
        <div
          className="absolute inset-0 gpu-layer"
          style={{ transform: prefersReducedMotion ? 'none' : `translateY(${videoParallax}px)` }}
        >
          <HeroVideo />
          <div className="absolute inset-0 hero-bg"></div>
          <div className="absolute inset-0 hero-vignette"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-5xl mx-auto px-5 lg:px-8 flex items-center pt-20">
          <div
            className="w-full gpu-layer"
            style={{
              opacity: textOpacity,
              transform: `translateY(${prefersReducedMotion ? 0 : parallaxOffset}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {prefersReducedMotion ? (
              <>
                <p className="font-slogan text-[22px] md:text-[28px] lg:text-[36px] xl:text-[40px] text-[#F8F8F5] leading-[1.2] hero-text-shadow">
                  Pour votre séjour à
                </p>
                <h1 className="font-slogan-bold text-[48px] md:text-[62px] lg:text-[78px] xl:text-[88px] text-[#F8F8F5] leading-[1] tracking-[0.04em] mt-2 hero-text-shadow">
                  KRIBI,
                </h1>
                <p className="font-slogan text-[22px] md:text-[28px] lg:text-[36px] xl:text-[40px] text-[#F8F8F5] leading-[1.2] mt-3 hero-text-shadow">
                  nous nous occupons de
                </p>
                <p className="font-slogan-bold text-[22px] md:text-[28px] lg:text-[36px] xl:text-[40px] text-[#F8F8F5] leading-[1.2] mt-3 hero-text-shadow">
                  <span className="text-accent hero-tout-glow">TOUT.</span>
                </p>
                <div className="mt-14 md:mt-16 flex flex-col sm:flex-row gap-5">
                  <button
                    onClick={() => onNavigate('experiences')}
                    className="btn-shimmer text-white px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 shadow-accent group hover:-translate-y-[5px] hover:shadow-lg hover:scale-[1.04] transition-all duration-300"
                  >
                    Découvrir nos expériences
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="glass text-white px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-white/25 hover:-translate-y-[5px] hover:shadow-lg hover:scale-[1.04] transition-all duration-300"
                  >
                    Nous contacter
                  </button>
                </div>
              </>
            ) : (
              <HeroSloganAnimated onNavigate={onNavigate} />
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 cursor-pointer" onClick={scrollToNext}>
          <span className="text-white/60 text-xs font-medium tracking-[0.2em] uppercase" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Découvrir
          </span>
          <div className="h-8 w-px bg-white/30 overflow-hidden">
            <div className="w-full h-full bg-white/80 scroll-indicator-line"></div>
          </div>
          <svg className="w-4 h-4 text-white/60 hero-arrow-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══════════════ SEARCH BAR ═══════════════ */}
      <section className="search-section relative -mt-16 z-30 px-4 sm:px-5">
        <div className="max-w-3xl mx-auto">
          {/* Search form — always visible */}
          <form
            onSubmit={handleSearch}
            className="search-pill p-2 flex items-center gap-2 overflow-hidden"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-2 min-w-0">
              <Search className="w-5 h-5 text-sky shrink-0" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Rechercher activités, logements, excursions..."
                className="w-full bg-transparent text-brand placeholder-slate-400 focus:outline-none text-sm py-2"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-slate-400 hover:text-brand transition-colors shrink-0"
                  title="Effacer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn-shimmer text-white px-5 sm:px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              Rechercher <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Active filter badge */}
          {activeQuery && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-center gap-2"
            >
              <span className="text-white/80 text-xs">Filtré par :</span>
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/25">
                <SlidersHorizontal className="w-3 h-3" />
                {activeQuery}
                <button onClick={handleClearSearch} className="ml-1 hover:text-accent transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            </motion.div>
          )}

          {/* Suggestions */}
          {!activeQuery && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
              <span className="text-white/70 text-xs font-medium shrink-0">Suggestions :</span>
              {SUGGESTIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSuggestionClick(tag)}
                  className="text-xs px-3 py-1.5 rounded-full glass-dark text-white/90 hover:bg-white hover:text-brand transition-all duration-200 whitespace-nowrap"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section ref={statsRef} className="py-22 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-pale via-white to-accent-pale"></div>
        <div className="max-w-6xl mx-auto px-5 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <StatCounter key={i} {...stat} start={statsInView} delay={i * 150} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ EXPERIENCES ═══════════════ */}
      <section id="search-results" className="py-22 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionTitle
              badge="Nos expériences"
              title={activeQuery ? `Expériences — "${activeQuery}"` : 'Des aventures inoubliables'}
              subtitle={activeQuery
                ? `${filteredExperiences.length} résultat${filteredExperiences.length !== 1 ? 's' : ''} trouvé${filteredExperiences.length !== 1 ? 's' : ''}`
                : "De l'adrénaline du quad à la sérénité des chutes, chaque expérience est une invitation au voyage."}
            />
            {!activeQuery && (
              <button
                onClick={() => onNavigate('experiences')}
                className="reveal-left flex items-center gap-2 text-sky font-semibold hover:gap-3 transition-all whitespace-nowrap"
              >
                Voir tout <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {expLoading && (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-sky/30 border-t-sky rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Chargement des expériences...</p>
            </div>
          )}
          {!expLoading && expError && (
            <div className="col-span-full text-center py-16">
              <p className="text-slate-500 font-medium">Impossible de charger les expériences pour le moment.</p>
            </div>
          )}
          {!expLoading && !expError && filteredExperiences.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 font-medium">Aucune expérience ne correspond à &laquo;&nbsp;{activeQuery}&nbsp;&raquo;.</p>
              <button onClick={handleClearSearch} className="mt-4 text-sky text-sm font-semibold hover:underline">
                Réinitialiser la recherche
              </button>
            </div>
          )}
          {!expLoading && !expError && filteredExperiences.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredExperiences.map((exp, i) => (
              <div
                key={exp.id}
                className="reveal card-hover bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="img-zoom relative h-60 overflow-hidden">
                  <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute top-4 left-4">
                    <span className={`${exp.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                      {exp.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 glass-dark rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-xs">
                    <Clock className="w-3.5 h-3.5" /> {exp.duration}
                  </div>
                </div>
                <div className="p-6">
                  <span className="cat-label">{exp.category}</span>
                  <h3 className="font-serif text-xl text-brand mt-2">{exp.title}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-2">{exp.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                    <div>
                      <span className="price-luxury">{exp.price}</span>
                      <span className="text-slate-500 text-sm"> FCFA</span>
                    </div>
                    {isInCart(`experience:${exp.id}`) ? (
                      <button
                        onClick={() => removeItem(`experience:${exp.id}`)}
                        className="bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-dark transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> ✓ Dans le panier
                      </button>
                    ) : (
                      <button
                        onClick={() => addItem({ key: `experience:${exp.id}`, type: 'experience', id: exp.id, title: exp.title, price: exp.price, image: exp.image })}
                        className="bg-accent-pale text-accent px-4 py-2 rounded-full text-sm font-semibold hover:bg-accent hover:text-white transition-all flex items-center gap-1.5 group"
                      >
                        <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ═══════════════ ACCOMMODATIONS ═══════════════ */}
      <section className="py-22 bg-sand-light relative overflow-hidden">
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionTitle
              badge="Hébergements"
              title={activeQuery ? `Hébergements — "${activeQuery}"` : 'Séjournez avec élégance'}
              subtitle={activeQuery
                ? `${filteredAccommodations.length} résultat${filteredAccommodations.length !== 1 ? 's' : ''} trouvé${filteredAccommodations.length !== 1 ? 's' : ''}`
                : 'Studios, appartements, villas et résidences sélectionnés pour leur confort et leur emplacement.'}
            />
            {!activeQuery && (
              <button
                onClick={() => onNavigate('accommodations')}
                className="reveal-left flex items-center gap-2 text-sky font-semibold hover:gap-3 transition-all whitespace-nowrap"
              >
                Voir tout <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {accLoading && (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-sky/30 border-t-sky rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Chargement des hébergements...</p>
            </div>
          )}
          {!accLoading && accError && (
            <div className="col-span-full text-center py-16">
              <p className="text-slate-500 font-medium">Impossible de charger les hébergements pour le moment.</p>
            </div>
          )}
          {!accLoading && !accError && filteredAccommodations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 font-medium">Aucun hébergement ne correspond à &laquo;&nbsp;{activeQuery}&nbsp;&raquo;.</p>
            </div>
          )}
          {!accLoading && !accError && filteredAccommodations.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAccommodations.map((acc, i) => (
              <div
                key={acc.id}
                className="reveal card-hover bg-white rounded-3xl overflow-hidden shadow-lg"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="img-zoom relative h-52 overflow-hidden">
                  <img src={acc.image} alt={acc.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-brand">
                    {acc.type}
                  </div>
                  <div className="absolute top-3 right-3 glass-dark rounded-full px-2.5 py-1 flex items-center gap-1 text-white text-xs">
                    <Star className="w-3 h-3 text-accent-light fill-accent-light" /> {acc.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-brand">{acc.title}</h3>
                  <p className="text-slate-500 text-xs mt-1">{acc.reviews} avis</p>
                  <AccommodationFeatures features={acc.features} />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-semibold text-accent">{acc.price}</span>
                      <span className="text-slate-500 text-xs"> /nuit</span>
                    </div>
                    {isInCart(`accommodation:${acc.id}`) ? (
                      <button
                        onClick={() => removeItem(`accommodation:${acc.id}`)}
                        className="bg-brand text-white px-3.5 py-2 rounded-full text-xs font-semibold hover:bg-brand-dark transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> ✓ Dans le panier
                      </button>
                    ) : (
                      <button
                        onClick={() => addItem({ key: `accommodation:${acc.id}`, type: 'accommodation', id: acc.id, title: acc.title, price: acc.price, image: acc.image })}
                        className="bg-brand text-white px-3.5 py-2 rounded-full text-xs font-semibold hover:bg-brand-light transition-all flex items-center gap-1.5"
                      >
                        <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ═══════════════ WHY US ═══════════════ */}
      <section className="py-22 bg-white relative">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle
            center
            badge="Pourquoi nous choisir"
            title="L'excellence à chaque étape"
            subtitle="Six raisons qui font de StayEatSee+ le partenaire idéal pour explorer Kribi."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="reveal-scale group bg-gradient-to-br from-white to-sky-pale/40 rounded-3xl p-8 border border-slate-100 hover:shadow-xl2 hover:border-sky/20 transition-all duration-400"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-sky flex items-center justify-center shadow-brand mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-400">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-serif text-xl text-brand mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <Testimonials />

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative py-22 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/95 via-brand/80 to-sky/70"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center text-white">
          <div className="reveal">
            <Quote className="w-12 h-12 text-accent-light mx-auto mb-6 opacity-80" />
            <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Votre aventure à Kribi commence ici
            </h2>
            <p className="mt-5 text-lg text-white/85 max-w-2xl mx-auto">
              Réservez dès maintenant et laissez-nous créer le voyage dont vous rêvez.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="btn-shimmer text-white px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 shadow-accent group"
              >
                Réserver maintenant <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('gallery')}
                className="glass text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/25 transition-all"
              >
                Voir la galerie
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}