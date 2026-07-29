import { useState } from 'react';
import { Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHero, SectionTitle, StarRating } from '@/components/ui';
import { AccommodationFeatures } from '@/components/AccommodationFeatures';
import { ACCOMMODATIONS } from '@/data';
import { usePageMeta, useScrollReveal } from '@/hooks';

interface AccommodationsProps { onNavigate: (page: string) => void }

const TYPES = ['Tous', 'Studio', 'Appartement', 'Villa', 'Résidence'];

export function AccommodationsPage({ onNavigate }: AccommodationsProps) {
  usePageMeta('Hébergements | StayEatSee+', 'Studios, appartements, villas et résidences premium à Kribi, avec vue mer, piscine et parking sécurisé.');
  useScrollReveal();
  const [filter, setFilter] = useState('Tous');
  const [booked, setBooked] = useState<number | null>(null);

  const filtered = filter === 'Tous' ? ACCOMMODATIONS : ACCOMMODATIONS.filter((a) => a.type === filter);

  const handleBook = (id: number) => {
    setBooked(id);
    setTimeout(() => setBooked(null), 3000);
  };

  return (
    <div className="page-enter">
      <PageHero
        badge="Hébergements"
        title="Séjournez avec élégance"
        subtitle="Une sélection d'hébergements premium à Kribi : studios, appartements, villas et résidences avec vue mer."
        image="https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      {/* Filters */}
      <section className="py-12 bg-white sticky top-16 z-30 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-center justify-center gap-3">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === type
                  ? 'btn-green-shimmer text-white shadow-forest'
                  : 'bg-slate-100 text-slate-700 hover:bg-forest-pale hover:text-forest'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-22 bg-gradient-to-b from-white to-sand-light/50">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((acc, i) => (
              <div
                key={acc.id}
                className="reveal card-hover bg-white rounded-3xl overflow-hidden shadow-lg"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="img-zoom relative h-60 overflow-hidden">
                  <img src={acc.image} alt={acc.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-navy">
                    {acc.type}
                  </div>
                  <div className="absolute top-3 right-3 glass-dark rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 text-gold-light fill-gold-light" /> {acc.rating}
                    <span className="text-white/60 font-normal">({acc.reviews})</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-navy">{acc.title}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{acc.description}</p>
                  <AccommodationFeatures features={acc.features} />
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-ocean">{acc.price}</span>
                      <span className="text-slate-500 text-sm"> FCFA/nuit</span>
                    </div>
                    {booked === acc.id ? (
                      <span className="flex items-center gap-1.5 text-forest font-semibold text-sm animate-scale-in">
                        <CheckCircle2 className="w-4 h-4" /> Réservé !
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBook(acc.id)}
                        className="bg-forest text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-forest-dark transition-all flex items-center gap-1.5 group"
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

      {/* Info section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="reveal grid md:grid-cols-3 gap-8 text-center">
            {[
              { num: '24h', label: 'Réception disponible' },
              { num: '100%', label: 'Logements visités' },
              { num: '0€', label: 'Frais de réservation' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-ocean-pale to-forest-pale rounded-3xl p-8">
                <div className="font-serif text-5xl font-bold gradient-text">{item.num}</div>
                <p className="text-slate-600 mt-3 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
