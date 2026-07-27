import { useState } from 'react';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHero, SectionTitle } from '@/components/ui';
import { EXPERIENCES } from '@/data';
import { useScrollReveal } from '@/hooks';

interface ExperiencesProps { onNavigate: (page: string) => void }

const CATEGORIES = ['Tous', 'Aventure', 'Nautique', 'Nature', 'Culture', 'Gastronomie', 'Romantique'];

export function ExperiencesPage({ onNavigate }: ExperiencesProps) {
  useScrollReveal();
  const [filter, setFilter] = useState('Tous');
  const [booked, setBooked] = useState<number | null>(null);

  const filtered = filter === 'Tous' ? EXPERIENCES : EXPERIENCES.filter((e) => e.category === filter);

  const handleBook = (id: number) => {
    setBooked(id);
    setTimeout(() => setBooked(null), 3000);
  };

  return (
    <div className="page-enter">
      <PageHero
        badge="Nos expériences"
        title="Vivez l'extraordinaire"
        subtitle="Douze expériences uniques pour découvrir Kribi sous tous ses angles. Aventure, nature, culture et gastronomie."
        image="https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      {/* Filters */}
      <section className="py-12 bg-white sticky top-16 z-30 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-center justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === cat
                  ? 'btn-shimmer text-white shadow-ocean'
                  : 'bg-slate-100 text-slate-700 hover:bg-ocean-pale hover:text-ocean'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-22 bg-gradient-to-b from-white to-ocean-pale/30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((exp, i) => (
              <div
                key={exp.id}
                className="reveal card-hover bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="img-zoom relative h-64 overflow-hidden">
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
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{exp.description}</p>
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-ocean">{exp.price}</span>
                      <span className="text-slate-500 text-sm"> FCFA</span>
                    </div>
                    {booked === exp.id ? (
                      <span className="flex items-center gap-1.5 text-forest font-semibold text-sm animate-scale-in">
                        <CheckCircle2 className="w-4 h-4" /> Réservé !
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBook(exp.id)}
                        className="bg-ocean-pale text-ocean px-4 py-2 rounded-full text-sm font-semibold hover:bg-ocean hover:text-white transition-all flex items-center gap-1.5 group"
                      >
                        Réserver <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-ocean text-white text-center">
        <div className="max-w-3xl mx-auto px-5 reveal">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Une expérience sur mesure ?</h2>
          <p className="mt-4 text-white/85 text-lg">Contactez-nous et créons ensemble votre aventure idéale à Kribi.</p>
          <button
            onClick={() => onNavigate('contact')}
            className="mt-7 bg-white text-ocean px-8 py-4 rounded-full font-semibold hover:bg-gold-light hover:text-navy transition-all duration-300 inline-flex items-center gap-2 group"
          >
            Nous contacter <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
