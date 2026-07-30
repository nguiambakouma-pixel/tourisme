import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { PageHero } from '@/components/ui';
import { GALLERY_IMAGES } from '@/data';
import { usePageMeta, useScrollReveal } from '@/hooks';

const CATEGORIES = ['Tous', 'Plages', 'Aventure', 'Nautique', 'Nature', 'Culture', 'Gastronomie', 'Hébergements'];

export function GalleryPage() {
  usePageMeta('Galerie | StayEatSee+', 'Explorez Kribi en images : plages, aventures, nature et culture camerounaise à travers notre galerie photo.');
  useScrollReveal();
  const [filter, setFilter] = useState('Tous');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === 'Tous' ? GALLERY_IMAGES : GALLERY_IMAGES.filter((g) => g.cat === filter);

  const openLightbox = (id: number) => setLightbox(id);
  const closeLightbox = () => setLightbox(null);
  const next = () => {
    if (lightbox === null) return;
    const idx = filtered.findIndex((g) => g.id === lightbox);
    setLightbox(filtered[(idx + 1) % filtered.length].id);
  };
  const prev = () => {
    if (lightbox === null) return;
    const idx = filtered.findIndex((g) => g.id === lightbox);
    setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length].id);
  };

  const current = lightbox !== null ? GALLERY_IMAGES.find((g) => g.id === lightbox) : null;

  return (
    <div className="page-enter">
      <PageHero
        badge="Galerie"
        title="Kribi en images"
        subtitle="Plages, aventures, nature et culture : plongez dans l'univers visuel de StayEatSee+."
        image="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1600"
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
                  ? 'btn-shimmer text-white shadow-accent'
                  : 'bg-slate-100 text-slate-700 hover:bg-sky-pale hover:text-sky'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry */}
      <section className="py-22 bg-gradient-to-b from-white to-sand-light/40">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="masonry">
            {filtered.map((img, i) => (
              <div
                key={img.id}
                className="masonry-item reveal-scale group relative"
                style={{ transitionDelay: `${i * 40}ms` }}
                onClick={() => openLightbox(img.id)}
              >
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-auto block" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/80 via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-between p-5">
                  <div>
                    <span className="cat-label text-accent-light">{img.cat}</span>
                    <p className="text-white font-semibold mt-1">{img.alt}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {current && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="absolute top-5 right-5 w-12 h-12 rounded-full glass-dark flex items-center justify-center hover:bg-white/20 transition-all" onClick={closeLightbox}>
            <X className="w-6 h-6 text-white" />
          </button>
          <button
            className="absolute left-5 w-12 h-12 rounded-full glass-dark flex items-center justify-center hover:bg-white/20 transition-all"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <img src={current.src} alt={current.alt} className="max-w-[85vw] max-h-[80vh] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
          <button
            className="absolute right-5 w-12 h-12 rounded-full glass-dark flex items-center justify-center hover:bg-white/20 transition-all"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-dark rounded-full px-5 py-2.5">
            <span className="text-xs font-semibold text-accent-light tracking-wider uppercase mr-3">{current.cat}</span>
            <span className="text-white font-medium">{current.alt}</span>
          </div>
        </div>
      )}
    </div>
  );
}
