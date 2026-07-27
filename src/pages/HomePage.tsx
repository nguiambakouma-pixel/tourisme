import { useEffect, useState } from 'react';
import {
  Search, MapPin, Star, ArrowRight, Compass, Clock, Shield, Headphones,
  BadgeCheck, Wallet, Sparkles, Quote, ChevronRight,
} from 'lucide-react';
import { EXPERIENCES, ACCOMMODATIONS } from '@/data';
import { SectionTitle, WaveDivider, StarRating } from '@/components/ui';
import { AccommodationFeatures } from '@/components/AccommodationFeatures';
import { Testimonials } from '@/components/Testimonials';
import { useCounter, useInView, useScrollReveal } from '@/hooks';

interface HomeProps { onNavigate: (page: string) => void }

const HERO_IMAGES = [
  'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/2559942/pexels-photo-2559942.jpeg?auto=compress&cs=tinysrgb&w=1600',
];

const COLLAGE_IMAGES = [
  { src: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Quad', span: 'col-span-2 row-span-2' },
  { src: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Jet Ski', span: 'col-span-1 row-span-1' },
  { src: 'https://images.pexels.com/photos/2559942/pexels-photo-2559942.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Chutes Lobé', span: 'col-span-1 row-span-1' },
  { src: 'https://images.pexels.com/photos/1148496/pexels-photo-1148496.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Fruits de mer', span: 'col-span-1 row-span-1' },
  { src: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400', label: 'Hébergements', span: 'col-span-1 row-span-1' },
  { src: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Plages', span: 'col-span-2 row-span-1' },
];

const STATS = [
  { value: 1500, suffix: '+', label: 'Voyageurs satisfaits' },
  { value: 40,   suffix: '+', label: 'Expériences uniques' },
  { value: 15,   suffix: '+', label: 'Guides locaux experts' },
  { value: 98,   suffix: '%', label: 'Clients satisfaits' },
];

const WHY_US = [
  { icon: Compass,   title: 'Guides locaux experts',   desc: 'Des guides nés à Kribi, passionnés et certifiés, qui connaissent chaque recoin de la région.' },
  { icon: Shield,    title: 'Sécurité garantie',        desc: 'Activités encadrées et matériel conforme. Votre sécurité est notre priorité absolue.' },
  { icon: Headphones,title: 'Assistance 24h/24',        desc: 'Une équipe disponible jour et nuit pour répondre à vos questions et besoins.' },
  { icon: BadgeCheck,title: 'Hébergements sélectionnés',desc: 'Chaque logement est visité et validé par nos soins pour une qualité irréprochable.' },
  { icon: Wallet,    title: 'Prix transparents',        desc: 'Aucun frais caché. Le prix annoncé est le prix payé, clair et honnête.' },
  { icon: Sparkles,  title: 'Expériences authentiques', desc: 'Des moments vrais, loin du tourisme de masse. Le Cameroun dans sa pureté.' },
];

export function HomePage({ onNavigate }: HomeProps) {
  useScrollReveal();
  const [searchValue, setSearchValue] = useState('');
  const [searchDone, setSearchDone] = useState(false);
  const { ref: statsRef, inView: statsInView } = useInView(0.3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchDone(true);
    setTimeout(() => setSearchDone(false), 3500);
  };

  return (
    <div className="page-enter">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Slideshow */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((src, i) => (
            <div
              key={i}
              className="hero-slide"
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
          <div className="absolute inset-0 hero-bg"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-5 lg:px-8 flex items-center pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left: text */}
            <div className="animate-fade-in-up">
              <span className="section-badge mb-6" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                Kribi · Cameroun
              </span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05]">
                Explorez Kribi<br /><span className="gradient-text-gold">autrement</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed max-w-xl">
                Vivez des expériences authentiques entre mer, forêt et culture locale. Le Cameroun comme vous ne l'avez jamais vu.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('experiences')}
                  className="btn-shimmer text-white px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 shadow-ocean group"
                >
                  Découvrir nos expériences
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="glass text-white px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 hover:bg-white/25 transition-all duration-300"
                >
                  Nous contacter
                </button>
              </div>
            </div>

            {/* Right: image collage */}
            <div className="hidden lg:grid grid-cols-3 grid-rows-3 gap-3 animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
              {COLLAGE_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className={`img-zoom relative rounded-2xl overflow-hidden shadow-2xl group ${img.span}`}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3">
                    <span className="text-white text-sm font-semibold">{img.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location pill */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 hidden md:block animate-float">
          <div className="glass-dark rounded-full px-5 py-2.5 flex items-center gap-2 text-white text-sm">
            <MapPin className="w-4 h-4 text-gold-light" />
            <span className="font-medium">Kribi, Cameroun</span>
            <span className="w-2 h-2 rounded-full bg-forest-light animate-pulse"></span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SEARCH BAR ═══════════════ */}
      <section className="relative -mt-12 z-30 px-5">
        <div className="max-w-4xl mx-auto">
          {searchDone ? (
            <div className="search-pill p-8 text-center animate-scale-in">
              <div className="w-14 h-14 rounded-full bg-forest-pale mx-auto mb-3 flex items-center justify-center">
                <BadgeCheck className="w-7 h-7 text-forest" />
              </div>
              <p className="text-navy font-semibold text-lg">Recherche terminée ! Découvrez nos meilleures offres ci-dessous.</p>
            </div>
          ) : (
            <form onSubmit={handleSearch} className="search-pill p-2.5 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 flex items-center gap-3 px-5 py-2 w-full">
                <Search className="w-5 h-5 text-ocean shrink-0" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Rechercher activités, logements, excursions..."
                  className="flex-1 bg-transparent text-navy placeholder-slate-400 focus:outline-none text-base py-2"
                />
              </div>
              <button type="submit" className="btn-shimmer text-white px-8 py-3.5 rounded-full font-semibold flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center">
                Rechercher <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-white/90 text-xs font-medium">Suggestions :</span>
            {['Chutes de la Lobé', 'Jet Ski', 'Fruits de mer', 'Camping plage'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setSearchValue(tag); setSearchDone(true); setTimeout(() => setSearchDone(false), 3500); }}
                className="text-xs px-3 py-1.5 rounded-full glass-dark text-white/90 hover:bg-white/25 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section ref={statsRef} className="py-22 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-pale via-white to-forest-pale"></div>
        <div className="max-w-6xl mx-auto px-5 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <StatCounter key={i} {...stat} start={statsInView} delay={i * 150} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ EXPERIENCES ═══════════════ */}
      <section className="py-22 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionTitle
              badge="Nos expériences"
              title="Des aventures inoubliables"
              subtitle="De l'adrénaline du quad à la sérénité des chutes, chaque expérience est une invitation au voyage."
            />
            <button
              onClick={() => onNavigate('experiences')}
              className="reveal-left flex items-center gap-2 text-ocean font-semibold hover:gap-3 transition-all whitespace-nowrap"
            >
              Voir tout <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {EXPERIENCES.slice(0, 6).map((exp, i) => (
              <div
                key={exp.id}
                className="reveal card-hover bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="img-zoom relative h-60 overflow-hidden">
                  <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
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
                  <span className="text-xs font-bold text-forest tracking-wider uppercase">{exp.category}</span>
                  <h3 className="font-serif text-xl font-bold text-navy mt-2">{exp.title}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-2">{exp.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-ocean">{exp.price}</span>
                      <span className="text-slate-500 text-sm"> FCFA</span>
                    </div>
                    <button
                      onClick={() => onNavigate('experiences')}
                      className="bg-ocean-pale text-ocean px-4 py-2 rounded-full text-sm font-semibold hover:bg-ocean hover:text-white transition-all flex items-center gap-1.5 group"
                    >
                      Réserver <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ACCOMMODATIONS ═══════════════ */}
      <section className="py-22 bg-sand-light relative overflow-hidden">
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-gold/10 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionTitle
              badge="Hébergements"
              title="Séjournez avec élégance"
              subtitle="Studios, appartements, villas et résidences sélectionnés pour leur confort et leur emplacement."
            />
            <button
              onClick={() => onNavigate('accommodations')}
              className="reveal-left flex items-center gap-2 text-ocean font-semibold hover:gap-3 transition-all whitespace-nowrap"
            >
              Voir tout <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACCOMMODATIONS.map((acc, i) => (
              <div
                key={acc.id}
                className="reveal card-hover bg-white rounded-3xl overflow-hidden shadow-lg"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="img-zoom relative h-52 overflow-hidden">
                  <img src={acc.image} alt={acc.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-navy">
                    {acc.type}
                  </div>
                  <div className="absolute top-3 right-3 glass-dark rounded-full px-2.5 py-1 flex items-center gap-1 text-white text-xs">
                    <Star className="w-3 h-3 text-gold-light fill-gold-light" /> {acc.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-navy">{acc.title}</h3>
                  <p className="text-slate-500 text-xs mt-1">{acc.reviews} avis</p>
                  <AccommodationFeatures features={acc.features} />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-bold text-ocean">{acc.price}</span>
                      <span className="text-slate-500 text-xs"> /nuit</span>
                    </div>
                    <button
                      onClick={() => onNavigate('accommodations')}
                      className="bg-forest text-white px-3.5 py-2 rounded-full text-xs font-semibold hover:bg-forest-dark transition-all"
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  className="reveal-scale group bg-gradient-to-br from-white to-ocean-pale/40 rounded-3xl p-8 border border-slate-100 hover:shadow-xl2 hover:border-ocean/20 transition-all duration-400"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean to-forest flex items-center justify-center shadow-ocean mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-400">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-navy mb-3">{item.title}</h3>
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
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-ocean/70"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center text-white">
          <div className="reveal">
            <Quote className="w-12 h-12 text-gold-light mx-auto mb-6 opacity-80" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
              Votre aventure à Kribi commence ici
            </h2>
            <p className="mt-5 text-lg text-white/85 max-w-2xl mx-auto">
              Réservez dès maintenant et laissez-nous créer le voyage dont vous rêvez.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="btn-shimmer text-white px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 shadow-ocean group"
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

function StatCounter({ value, suffix, label, start, delay }: { value: number; suffix: string; label: string; start: boolean; delay: number }) {
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
}
