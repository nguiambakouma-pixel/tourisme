import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminPageHeader, AdminModal, FormField, inputCls, selectCls } from '@/components/admin/AdminUI';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  cat: string;
}

const CATEGORIES = ['Plages', 'Aventure', 'Nautique', 'Nature', 'Gastronomie', 'Hébergements', 'Culture'];
const INITIAL_FORM = { src: '', alt: '', cat: '' };

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
    const { data } = await supabase.from('gallery_images').select('*').order('id', { ascending: true });
    setImages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const openCreate = () => { setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); setModalOpen(true); };
  const openEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setForm({ src: img.src, alt: img.alt, cat: img.cat });
    setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setError(null);
    const path = `gallery/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('site-images').upload(path, file);
    if (uploadError) { setError("Erreur lors de l'upload."); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
    setForm((p) => ({ ...p, src: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(null);
    const payload = { src: form.src, alt: form.alt, cat: form.cat };
    const { error: err } = editingId
      ? await supabase.from('gallery_images').update(payload).eq('id', editingId)
      : await supabase.from('gallery_images').insert(payload);
    if (err) { setError("Erreur lors de l'enregistrement."); setSubmitting(false); return; }
    setSubmitting(false); closeModal(); fetchImages();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette image ?')) return;
    await supabase.from('gallery_images').delete().eq('id', id);
    fetchImages();
  };

  const columns = [
    {
      key: 'src',
      label: 'Image',
      render: (img: GalleryImage) => (
        <img src={img.src} alt={img.alt} className="w-12 h-12 object-cover rounded-xl" />
      ),
      mobileHide: true,
    },
    {
      key: 'alt',
      label: 'Description',
      grow: true,
      render: (img: GalleryImage) => <span className="font-semibold text-slate-800">{img.alt}</span>,
    },
    {
      key: 'cat',
      label: 'Catégorie',
      render: (img: GalleryImage) => (
        <span className="text-sky font-medium text-xs px-2 py-1 bg-sky-pale rounded-lg">{img.cat}</span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Galerie"
        subtitle="Gérez les images de la galerie photo."
        onAdd={openCreate}
        addLabel="Ajouter une image"
        accentClass="bg-sky hover:bg-sky-dark"
      />

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-sky animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-400 font-medium">Aucune image pour le moment.</p>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          items={images}
          onEdit={openEdit}
          onDelete={handleDelete}
          imageKey="src"
          labelKey="alt"
          subLabelKey="cat"
        />
      )}

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Modifier l'image" : 'Ajouter une image'}
        onSubmit={handleSubmit}
        submitting={submitting}
        uploading={uploading}
        editMode={!!editingId}
        error={error}
        accentClass="bg-sky"
      >
        <FormField label="Image">
          {form.src && (
            <img src={form.src} alt="Aperçu" className="w-full h-36 object-cover rounded-xl mb-3" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-pale file:text-sky hover:file:bg-sky/10"
          />
          {uploading && (
            <p className="text-xs text-sky mt-1 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Envoi…
            </p>
          )}
        </FormField>

        <FormField label="Description (texte alternatif)">
          <input
            type="text"
            value={form.alt}
            onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))}
            required
            placeholder="Ex. Plage de Kribi au coucher du soleil"
            className={inputCls}
          />
        </FormField>

        <FormField label="Catégorie">
          <select
            value={form.cat}
            onChange={(e) => setForm((p) => ({ ...p, cat: e.target.value }))}
            required
            className={selectCls}
          >
            <option value="" disabled>Sélectionner une catégorie</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>
      </AdminModal>
    </div>
  );
}