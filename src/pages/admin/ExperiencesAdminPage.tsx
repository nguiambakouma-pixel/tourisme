import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';

interface Experience {
  id: number;
  title: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  badge: string;
  badge_color: string;
  image: string;
}

const CATEGORIES = ['Aventure', 'Nautique', 'Nature', 'Culture', 'Gastronomie', 'Romantique'];

const BADGE_COLORS = [
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-sky', label: 'Océan' },
  { value: 'bg-forest', label: 'Forêt' },
  { value: 'bg-gold', label: 'Or' },
  { value: 'bg-purple-600', label: 'Violet' },
  { value: 'bg-teal-600', label: 'Sarcelle' },
  { value: 'bg-cyan-600', label: 'Cyan' },
  { value: 'bg-green-700', label: 'Vert' },
  { value: 'bg-emerald-700', label: 'Émeraude' },
  { value: 'bg-amber-600', label: 'Ambre' },
  { value: 'bg-red-600', label: 'Rouge' },
];

const INITIAL_FORM = {
  title: '',
  description: '',
  price: '',
  duration: '',
  category: '',
  badge: '',
  badge_color: 'bg-orange-500',
  image: '',
};

export function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error(error);
    } else {
      setExperiences(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...INITIAL_FORM });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      title: exp.title,
      description: exp.description,
      price: exp.price,
      duration: exp.duration,
      category: exp.category,
      badge: exp.badge,
      badge_color: exp.badge_color,
      image: exp.image,
    });
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...INITIAL_FORM });
    setError(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const path = `experiences/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(path, file);

    if (uploadError) {
      setError("Erreur lors de l'upload de l'image.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('site-images')
      .getPublicUrl(path);

    setForm((prev) => ({ ...prev, image: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (editingId) {
      const { error: updateError } = await supabase
        .from('experiences')
        .update({
          title: form.title,
          description: form.description,
          price: form.price,
          duration: form.duration,
          category: form.category,
          badge: form.badge,
          badge_color: form.badge_color,
          image: form.image,
        })
        .eq('id', editingId);

      if (updateError) {
        setError("Erreur lors de la mise à jour.");
        setSubmitting(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('experiences')
        .insert({
          title: form.title,
          description: form.description,
          price: form.price,
          duration: form.duration,
          category: form.category,
          badge: form.badge,
          badge_color: form.badge_color,
          image: form.image,
        });

      if (insertError) {
        setError("Erreur lors de la création.");
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    closeModal();
    fetchExperiences();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette expérience ?')) return;

    const { error: deleteError } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(deleteError);
      return;
    }

    fetchExperiences();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand">Expériences</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les expériences proposées sur le site.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-light transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter une expérience
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-sky animate-spin" />
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <p className="text-slate-500 font-medium">Aucune expérience pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Image</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Titre</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Catégorie</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Prix</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{exp.title}</td>
                  <td className="px-6 py-4 text-slate-500">{exp.category}</td>
                  <td className="px-6 py-4 text-slate-500">{exp.price} FCFA</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(exp)}
                        className="p-2 rounded-lg text-slate-400 hover:text-sky hover:bg-sky-pale/50 transition-all"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand">
                {editingId ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100 transition-all">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image preview + upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Image</label>
                {form.image && (
                  <img
                    src={form.image}
                    alt="Aperçu"
                    className="w-full h-40 object-cover rounded-xl mb-3"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-sky-pale file:text-sky hover:file:bg-sky-pale/80"
                />
                {uploading && (
                  <p className="text-xs text-sky font-medium mt-1 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" /> Envoi de l'image...
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">Titre</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1.5">Prix (FCFA)</label>
                  <input
                    id="price"
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1.5">Durée</label>
                  <input
                    id="duration"
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">Catégorie</label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky bg-white"
                  >
                    <option value="" disabled>Sélectionner une catégorie</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="badge" className="block text-sm font-medium text-slate-700 mb-1.5">Badge</label>
                  <input
                    id="badge"
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="badge_color" className="block text-sm font-medium text-slate-700 mb-1.5">Couleur du badge</label>
                <select
                  id="badge_color"
                  value={form.badge_color}
                  onChange={(e) => setForm((p) => ({ ...p, badge_color: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
                >
                  {BADGE_COLORS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 bg-brand text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-light transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {editingId ? 'Enregistrement...' : 'Ajout...'}</>
                  ) : (
                    editingId ? 'Enregistrer' : 'Ajouter'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}