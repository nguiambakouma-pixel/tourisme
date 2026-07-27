import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/data';

export function Testimonials() {
  return (
    <section className="py-22 bg-navy relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-ocean/30 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-forest/25 blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="reveal text-center mb-14">
          <span className="section-badge mb-4" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)', color: '#F5C842' }}>
            Témoignages
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-4">Ils ont vécu l'aventure</h2>
          <p className="mt-4 text-white/70 text-lg">Plus de 1500 voyageurs nous ont fait confiance.</p>
        </div>

        {/* Auto-scrolling marquee */}
        <div className="overflow-hidden">
          <div
            className="flex gap-6"
            style={{
              animation: 'wave 50s linear infinite',
              width: 'max-content',
            }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="glass-dark rounded-3xl p-7 w-[340px] shrink-0 flex flex-col"
              >
                <Quote className="w-9 h-9 text-gold-light mb-4 opacity-70" />
                <p className="text-white/85 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/10">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-gold-light/40" />
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.country} · {t.experience}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-gold-light fill-gold-light" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
