import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Compass, Home, FileText, Loader2, TrendingUp, ArrowRight, Image } from 'lucide-react';

interface Counts {
  experiences: number;
  accommodations: number;
  blogPosts: number;
  gallery: number;
}

export function AdminOverviewPage() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Counts>({ experiences: 0, accommodations: 0, blogPosts: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const [expResult, accResult, blogResult, galResult] = await Promise.all([
        supabase.from('experiences').select('*', { count: 'exact', head: true }),
        supabase.from('accommodations').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
      ]);
      setCounts({
        experiences: expResult.count ?? 0,
        accommodations: accResult.count ?? 0,
        blogPosts: blogResult.count ?? 0,
        gallery: galResult.count ?? 0,
      });
      setLoading(false);
    };
    fetchCounts();
  }, []);

  const statCards = [
    {
      label: 'Expériences',
      count: counts.experiences,
      icon: Compass,
      path: '/admin/experiences',
      accent: '#3EABD4',
      pale: '#E8F5FB',
      gradient: 'from-sky to-sky-light',
      tag: 'See',
      tagColor: '#3EABD4',
    },
    {
      label: 'Hébergements',
      count: counts.accommodations,
      icon: Home,
      path: '/admin/accommodations',
      accent: '#1A3C7A',
      pale: '#EBF0FA',
      gradient: 'from-brand to-brand-light',
      tag: 'Stay',
      tagColor: '#1A3C7A',
    },
    {
      label: 'Articles de blog',
      count: counts.blogPosts,
      icon: FileText,
      path: '/admin/blog',
      accent: '#D4572A',
      pale: '#FCF0EB',
      gradient: 'from-accent to-accent-light',
      tag: 'Eat',
      tagColor: '#D4572A',
    },
    {
      label: 'Photos galerie',
      count: counts.gallery,
      icon: Image,
      path: '/admin/gallery',
      accent: '#254FA3',
      pale: '#EBF0FA',
      gradient: 'from-brand-light to-sky',
      tag: 'See',
      tagColor: '#3EABD4',
    },
  ];

  const quickActions = [
    { label: '+ Expérience', path: '/admin/experiences', bg: 'bg-sky', hover: 'hover:bg-sky-dark', shadow: 'shadow-sky/30' },
    { label: '+ Hébergement', path: '/admin/accommodations', bg: 'bg-brand', hover: 'hover:bg-brand-dark', shadow: 'shadow-brand/30' },
    { label: '+ Article', path: '/admin/blog', bg: 'bg-accent', hover: 'hover:bg-accent-dark', shadow: 'shadow-accent/30' },
    { label: '+ Image', path: '/admin/gallery', bg: 'bg-brand-light', hover: 'hover:bg-brand', shadow: 'shadow-brand/25' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-sky flex items-center justify-center shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand">Vue d'ensemble</h1>
        </div>
        <p className="text-slate-500 text-sm max-w-xl" style={{ maxWidth: '100%' }}>
          Bienvenue dans l'espace d'administration de{' '}
          <span className="font-semibold text-brand">Stay</span>
          <span className="font-semibold text-accent">Eat</span>
          <span className="font-semibold text-sky">See</span>
          <span className="font-semibold text-accent">+</span>. Gérez le contenu de votre site depuis ici.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={() => navigate(card.path)}
              className="group bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              {/* Background accent */}
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-15 pointer-events-none"
                style={{ background: card.accent, transform: 'translate(30%, -30%)' }}
              />

              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span
                  className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{ color: card.tagColor, background: card.pale }}
                >
                  {card.tag}
                </span>
              </div>

              <div
                className="text-3xl font-black mb-1"
                style={{ color: card.accent }}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: card.accent }} />
                ) : card.count}
              </div>
              <p className="text-slate-500 text-xs font-medium">{card.label}</p>

              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: card.accent }}>
                Gérer <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-brand to-sky inline-block" />
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`${action.bg} ${action.hover} text-white rounded-xl px-5 py-3 text-sm font-semibold shadow-lg ${action.shadow} hover:-translate-y-0.5 transition-all duration-200`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}