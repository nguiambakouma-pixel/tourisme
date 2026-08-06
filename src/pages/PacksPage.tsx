
import { Compass, Home, ShoppingCart, Check, ArrowRight, Loader2 } from 'lucide-react';
import { PageHero, SectionTitle } from '@/components/ui';
import { usePageMeta, useScrollReveal, usePackages } from '@/hooks';
import { useCart } from '@/lib/CartContext';

export function PacksPage() {
  usePageMeta('Nos Packs | StayEatSee+', "Sélection de packs combinant hébergement et expériences pour un séjour clé en main.");
  useScrollReveal();
  const { data: PACKS, loading, error } = usePackages();
  const { addItem, isInCart, removeItem } = useCart();

  return (
    <div className="page-enter">
      <PageHero
        badge="Nos packs"
        title="Packs tout compris"
        subtitle="Combinez hébergement et activités pour un séjour sans tracas. Choisissez un pack adapté à vos envies."
        image="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      {/* Loading */}
      {loading && (
        <section className="py-22 bg-gradient-to-b from-white to-sky-pale/30">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-sky animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Chargement des packs...</p>
          </div>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="py-22 bg-gradient-to-b from-white to-sky-pale/30">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="text-center py-20">
              <p className="text-slate-500 font-medium">Impossible de charger les packs pour le moment.</p>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      {!loading && !error && (
        <section className="py-22 bg-gradient-to-b from-white to-sky-pale/30">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {PACKS.map((pkg, i) => (
                <div
                  key={pkg.id}
                  className="reveal card-hover bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="img-zoom relative h-64 overflow-hidden">
                    <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    {pkg.badge && (
                      <div className="absolute top-4 left-4">
                        <span className={`text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg bg-brand`}>
                          {pkg.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl text-brand mt-2">{pkg.title}</h3>
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">{pkg.description}</p>

                    <div className="mt-4">
                      <SectionTitle title="Inclus" />
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        {pkg.items.map((it: any) => (
                          <li key={it.id} className="flex items-center gap-2">
                            {it.type === 'experience' ? <Compass className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                            <span>{it.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                      <div>
                        <span className="price-luxury">{pkg.price}</span>
                        <span className="text-slate-500 text-sm"> FCFA</span>
                      </div>

                      {isInCart(`package:${pkg.id}`) ? (
                        <button
                          onClick={() => removeItem(`package:${pkg.id}`)}
                          className="bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-dark transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> ✓ Dans le panier
                        </button>
                      ) : (
                        <button
                          onClick={() => addItem({ key: `package:${pkg.id}`, type: 'package', id: pkg.id, title: pkg.title, price: pkg.price, image: pkg.image })}
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
          </div>
        </section>
      )}

      <section className="py-20 bg-gradient-brand text-white text-center">
        <div className="max-w-3xl mx-auto px-5 reveal">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Prêt à réserver ?</h2>
          <p className="mt-4 text-white/85 text-lg">Ajoutez un pack à votre panier et finalisez votre séjour en quelques clics.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-7 bg-white text-brand px-8 py-4 rounded-full font-semibold hover:bg-accent-light hover:text-white transition-all duration-300 inline-flex items-center gap-2 group"
          >
            Nous contacter <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
