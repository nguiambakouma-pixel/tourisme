import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  cat: string;
}

const CATEGORIES = ['Plages', 'Aventure', 'Nautique', 'Nature', 'Gastronomie', 'Hébergements', 'Culture'];

const INITIAL_FORM = {
  src: '',
  alt: '',
  cat: '',
};

export function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error(error);
    } else {
      setImages(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...INITIAL_FORM });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setForm({
      src: img.src,
      alt: img.alt,
      cat: img.cat,
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

    const path = `gallery/${Date.now()}-${file.name}`;
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

    setForm((prev) => ({ ...prev, src: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (editingId) {
      const { error: updateError } = await supabase
        .from('gallery_images')
        .update({
          src: form.src,
          alt: form.alt,
          cat: form.cat,
        })
        .eq('id', editingId);

      if (updateError) {
        setError("Erreur lors de la mise à jour.");
        setSubmitting(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          src: form.src,
          alt: form.alt,
          cat: form.cat,
        });

      if (insertError) {
        setError("Erreur lors de la création.");
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    closeModal();
    fetchImages();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette image ?')) return;

    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error(deleteError);
      return;
    }

    fetchImages();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand">Galerie</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les images de la galerie photo.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-light transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter une image
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-sky animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <p className="text-slate-500 font-medium">Aucune image pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Image</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Description</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Catégorie</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{img.alt}</td>
                  <td className="px-6 py-4 text-slate-500">{img.cat}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(img)}
                        className="p-2 rounded-lg text-slate-400 hover:text-sky hover:bg-sky-pale/50 transition-all"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(img.id)}
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
                {editingId ? "Modifier l'image" : 'Ajouter une image'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100 transition-all">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image preview + upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Image</label>
                {form.src && (
                  <img
                    src={form.src}
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
                <label htmlFor="alt" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <input
                  id="alt"
                  type="text"
                  value={form.alt}
                  onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))}
                  required
                  placeholder="Ex. Plage de Kribi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky"
                />
              </div>

              <div>
                <label htmlFor="cat" className="block text-sm font-medium text-slate-700 mb-1.5">Catégorie</label>
                <select
                  id="cat"
                  value={form.cat}
                  onChange={(e) => setForm((p) => ({ ...p, cat: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/50 focus:border-sky bg-white"
                >
                  <option value="" disabled>Sélectionner une catégorie</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
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