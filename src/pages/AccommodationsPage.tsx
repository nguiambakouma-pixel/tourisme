import { useState } from 'react';
import { Star, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { PageHero, SectionTitle, StarRating } from '@/components/ui';
import { AccommodationFeatures } from '@/components/AccommodationFeatures';
import { usePageMeta, useScrollReveal, useAccommodations } from '@/hooks';
import { useCart } from '@/lib/CartContext';

interface AccommodationsProps { onNavigate: (page: string) => void }

const TYPES = ['Tous', 'Studio', 'Appartement', 'Villa', 'Résidence'];

export function AccommodationsPage({ onNavigate }: AccommodationsProps) {
  usePageMeta('Hébergements | StayEatSee+', 'Studios, appartements, villas et résidences premium à Kribi, avec vue mer, piscine et parking sécurisé.');
  useScrollReveal();
  const { data: ACCOMMODATIONS, loading, error } = useAccommodations();
  const [filter, setFilter] = useState('Tous');
  const { addItem, isInCart, removeItem } = useCart();

  const filtered = filter === 'Tous' ? ACCOMMODATIONS : ACCOMMODATIONS.filter((a) => a.type === filter);

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
                  ? 'btn-brand-shimmer text-white shadow-brand'
                  : 'bg-slate-100 text-slate-700 hover:bg-brand-pale hover:text-brand'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <section className="py-22 bg-gradient-to-b from-white to-sand-light/50">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-sky animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Chargement des hébergements...</p>
          </div>
        </section>
      )}

      {/* Error state */}
      {!loading && error && (
        <section className="py-22 bg-gradient-to-b from-white to-sand-light/50">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="text-center py-20">
              <p className="text-slate-500 font-medium">Impossible de charger les hébergements pour le moment.</p>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      {!loading && !error && (
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
                  <img src={acc.image} alt={acc.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-brand">
                    {acc.type}
                  </div>
                  <div className="absolute top-3 right-3 glass-dark rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 text-accent-light fill-accent-light" /> {acc.rating}
                    <span className="text-white/60 font-normal">({acc.reviews})</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-brand">{acc.title}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{acc.description}</p>
                  <AccommodationFeatures features={acc.features} />
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                    <div>
                      <span className="price-luxury">{acc.price}</span>
                      <span className="text-slate-500 text-sm"> FCFA/nuit</span>
                    </div>
                    {isInCart(`accommodation:${acc.id}`) ? (
                      <button
                        onClick={() => removeItem(`accommodation:${acc.id}`)}
                        className="bg-brand text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-dark transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> ✓ Dans le panier
                      </button>
                    ) : (
                      <button
                        onClick={() => addItem({ key: `accommodation:${acc.id}`, type: 'accommodation', id: acc.id, title: acc.title, price: acc.price, image: acc.image })}
                        className="bg-accent text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-accent-dark transition-all flex items-center gap-1.5 group"
                      >
                        <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Info section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="reveal grid md:grid-cols-3 gap-8 text-center">
            {[
              { num: '24h', label: 'Réception disponible' },
              { num: '100%', label: 'Logements visités' },
              { num: '0€', label: 'Frais de réservation' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-sky-pale to-accent-pale rounded-3xl p-8">
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
