import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';

interface Accommodation {
  id: number;
  title: string;
  type: string;
  price: string;
  rating: number;
  reviews: number;
  features: string[];
  image: string;
  description: string;
}

const TYPES = ['Studio', 'Appartement', 'Villa', 'Résidence'];

const FEATURES_OPTIONS = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'clim', label: 'Climatisation' },
  { value: 'vue_mer', label: 'Vue mer' },
  { value: 'parking', label: 'Parking' },
  { value: 'piscine', label: 'Piscine' },
];

const INITIAL_FORM = {
  title: '',
  type: '',
  price: '',
  rating: 5,
  reviews: 0,
  features: [] as string[],
  image: '',
  description: '',
};

export function AccommodationsAdminPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccommodations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error(error);
    } else {
      setAccommodations(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...INITIAL_FORM });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (acc: Accommodation) => {
    setEditingId(acc.id);
    setForm({
      title: acc.title,
      type: acc.type,
      price: acc.price,
      rating: acc.rating,
      reviews: acc.reviews,
      features: acc.features ?? [],
      image: acc.image,
      description: acc.description,
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

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const path = `accommodations/${Date.now()}-${file.name}`;
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

    const payload = {
      title: form.title,
      type: form.type,
      price: form.price,
      rating: form.rating,
      reviews: form.reviews,
      features: form.features,
      image: form.image,
      description: form.description,
    };

    if (editingId) {
      const { error: updateError } = await supabase
        .from('accommodations')
        .update(payload)
        .eq('id', editingId);

      if (updateError) {
        setError("Erreur lors de la mise à jour.");
        setSubmitting(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('accommodations')
        .insert(payload);

      if (insertError) {
        setError("Erreur lors de la création.");
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    closeModal();
    fetchAccommodations();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cet hébergement ?')) return;

    const { error: deleteError } = await supabase
      .from('accommodations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(deleteError);
      return;
    }

    fetchAccommodations();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand">Hébergements</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les hébergements proposés sur le site.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-light transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter un hébergement
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-sky animate-spin" />
        </div>
      ) : accommodations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <p className="text-slate-500 font-medium">Aucun hébergement pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Image</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Titre</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Type</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Prix</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Note</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accommodations.map((acc) => (
                <tr key={acc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={acc.image}
                      alt={acc.title}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{acc.title}</td>
                  <td className="px-6 py-4 text-slate-500">{acc.type}</td>
                  <td className="px-6 py-4 text-slate-500">{acc.price} FCFA</td>
                  <td className="px-6 py-4 text-slate-500">{acc.rating} ({acc.reviews})</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(acc)}
                        className="p-2 rounded-lg text-slate-400 hover:text-sky hover:bg-sky-pale/50 transition-all"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(acc.id)}
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
                {editingId ? "Modifier l'hébergement" : "Ajouter un hébergement"}
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
                <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky bg-white"
                >
                  <option value="" disabled>Sélectionner un type</option>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1.5">Prix (FCFA/nuit)</label>
                <input
                  id="price"
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-slate-700 mb-1.5">Note</label>
                  <input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm((p) => ({ ...p, rating: parseFloat(e.target.value) || 0 }))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
                  />
                </div>
                <div>
                  <label htmlFor="reviews" className="block text-sm font-medium text-slate-700 mb-1.5">Nombre d'avis</label>
                  <input
                    id="reviews"
                    type="number"
                    step="1"
                    min="0"
                    value={form.reviews}
                    onChange={(e) => setForm((p) => ({ ...p, reviews: parseInt(e.target.value) || 0 }))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Équipements</label>
                <div className="flex flex-wrap gap-3">
                  {FEATURES_OPTIONS.map((feat) => (
                    <label
                      key={feat.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm cursor-pointer transition-all ${
                        form.features.includes(feat.value)
                          ? 'bg-brand text-white border-brand'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-sky/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.features.includes(feat.value)}
                        onChange={() => toggleFeature(feat.value)}
                        className="sr-only"
                      />
                      {feat.label}
                    </label>
                  ))}
                </div>
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