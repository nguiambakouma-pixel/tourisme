import { useState } from 'react';
import { Calendar, Clock, ArrowRight, User, X, Loader2 } from 'lucide-react';
import { PageHero, SectionTitle } from '@/components/ui';
import { usePageMeta, useScrollReveal, useBlogPosts } from '@/hooks';

const CATEGORIES = ['Tous', 'Destinations', 'Activités', 'Gastronomie', 'Conseils', 'Nature', 'Culture'];

export function BlogPage() {
  usePageMeta('Blog | StayEatSee+', 'Conseils, destinations et récits pour préparer votre voyage à Kribi et découvrir le Cameroun authentique.');
  useScrollReveal();
  const { data: BLOG_POSTS, loading, error } = useBlogPosts();
  const [filter, setFilter] = useState('Tous');
  const [selected, setSelected] = useState<typeof BLOG_POSTS[0] | null>(null);

  const filtered = filter === 'Tous' ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === filter);

  return (
    <div className="page-enter">
      <PageHero
        badge="Le Blog"
        title="Inspirations & Récits"
        subtitle="Conseils, destinations et récits pour préparer votre voyage à Kribi et au Cameroun."
        image="https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=1600"
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

      {/* Loading state */}
      {loading && (
        <section className="py-22 bg-gradient-to-b from-white to-sky-pale/20">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-sky animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Chargement des articles...</p>
          </div>
        </section>
      )}

      {/* Error state */}
      {!loading && error && (
        <section className="py-22 bg-gradient-to-b from-white to-sky-pale/20">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="text-center py-20">
              <p className="text-slate-500 font-medium">Impossible de charger les articles pour le moment.</p>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      {!loading && !error && (
      <section className="py-22 bg-gradient-to-b from-white to-sky-pale/20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((post, i) => (
              <article
                key={post.id}
                className="reveal card-hover bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 group cursor-pointer"
                style={{ transitionDelay: `${i * 70}ms` }}
                onClick={() => setSelected(post)}
              >
                <div className="img-zoom relative h-56 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-brand to-sky text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand leading-tight group-hover:text-sky transition-colors">{post.title}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                    <span className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5" /> {post.author}
                    </span>
                    <span className="text-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lire <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Modal */}
      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <div
            className="bg-white rounded-3xl max-w-2xl w-[90vw] max-h-[85vh] overflow-y-auto relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-slate-100 transition-all z-10"
              onClick={() => setSelected(null)}
            >
              <X className="w-5 h-5 text-brand" />
            </button>
            <div className="h-64 overflow-hidden">
              <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span className="bg-gradient-to-r from-brand to-sky text-white font-bold px-3 py-1.5 rounded-full">{selected.category}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {selected.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {selected.readTime}</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-brand leading-tight">{selected.title}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-3 mb-6">
                <User className="w-4 h-4" /> Par {selected.author}
              </div>
              <p className="text-slate-600 leading-relaxed">{selected.excerpt}</p>
              <div className="mt-4 space-y-3 text-slate-600 leading-relaxed">
                {selected.content
                  ? selected.content.split('\n\n').map((paragraph: string, i: number) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  : <p>{selected.excerpt}</p>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
