import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Compass, Home, FileText, Loader2 } from 'lucide-react';

interface Counts {
  experiences: number;
  accommodations: number;
  blogPosts: number;
}

export function AdminOverviewPage() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Counts>({ experiences: 0, accommodations: 0, blogPosts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const [expResult, accResult, blogResult] = await Promise.all([
        supabase.from('experiences').select('*', { count: 'exact', head: true }),
        supabase.from('accommodations').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      ]);

      setCounts({
        experiences: expResult.count ?? 0,
        accommodations: accResult.count ?? 0,
        blogPosts: blogResult.count ?? 0,
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
    },
    {
      label: 'Hébergements',
      count: counts.accommodations,
      icon: Home,
      path: '/admin/accommodations',
    },
    {
      label: 'Articles de blog',
      count: counts.blogPosts,
      icon: FileText,
      path: '/admin/blog',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand">Vue d'ensemble</h1>
      <p className="text-slate-500 mt-2">
        Bienvenue dans l'espace d'administration de StayEatSee+. Utilisez les liens dans la barre latérale pour gérer le contenu de votre site.
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-brand/30 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">{card.label}</span>
                <Icon className="w-5 h-5 text-brand" />
              </div>
              <div className="text-3xl font-bold text-brand">
                {loading ? '—' : card.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/admin/experiences')}
            className="bg-brand text-white rounded-xl px-5 py-3 text-sm font-semibold hover:bg-brand-dark transition-all"
          >
            + Nouvelle expérience
          </button>
          <button
            onClick={() => navigate('/admin/accommodations')}
            className="bg-brand text-white rounded-xl px-5 py-3 text-sm font-semibold hover:bg-brand-dark transition-all"
          >
            + Nouvel hébergement
          </button>
          <button
            onClick={() => navigate('/admin/blog')}
            className="bg-brand text-white rounded-xl px-5 py-3 text-sm font-semibold hover:bg-brand-dark transition-all"
          >
            + Nouvel article
          </button>
        </div>
      </div>
    </div>
  );
}