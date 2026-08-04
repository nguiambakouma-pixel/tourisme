import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminPageHeader, AdminModal, FormField, inputCls, selectCls } from '@/components/admin/AdminUI';

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
const INITIAL_FORM = { title: '', type: '', price: '', rating: 5, reviews: 0, features: [] as string[], image: '', description: '' };

export function AccommodationsAdminPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('accommodations').select('*').order('id', { ascending: true });
    setAccommodations(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); setModalOpen(true); };
  const openEdit = (acc: Accommodation) => {
    setEditingId(acc.id);
    setForm({ title: acc.title, type: acc.type, price: acc.price, rating: acc.rating, reviews: acc.reviews, features: acc.features ?? [], image: acc.image, description: acc.description });
    setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); };

  const toggleFeature = (f: string) => setForm((p) => ({
    ...p, features: p.features.includes(f) ? p.features.filter((x) => x !== f) : [...p.features, f],
  }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setError(null);
    const path = `accommodations/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('site-images').upload(path, file);
    if (uploadError) { setError("Erreur lors de l'upload."); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
    setForm((p) => ({ ...p, image: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(null);
    const payload = { title: form.title, type: form.type, price: form.price, rating: form.rating, reviews: form.reviews, features: form.features, image: form.image, description: form.description };
    const { error: err } = editingId
      ? await supabase.from('accommodations').update(payload).eq('id', editingId)
      : await supabase.from('accommodations').insert(payload);
    if (err) { setError('Erreur lors de l\'enregistrement.'); setSubmitting(false); return; }
    setSubmitting(false); closeModal(); fetch();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cet hébergement ?')) return;
    await supabase.from('accommodations').delete().eq('id', id);
    fetch();
  };

  const columns = [
    {
      key: 'image', label: 'Image',
      render: (acc: Accommodation) => <img src={acc.image} alt={acc.title} className="w-12 h-12 object-cover rounded-xl" />,
      mobileHide: true,
    },
    { key: 'title', label: 'Titre', grow: true, render: (acc: Accommodation) => <span className="font-semibold text-slate-800">{acc.title}</span> },
    { key: 'type', label: 'Type', render: (acc: Accommodation) => <span className="text-brand font-medium text-xs px-2 py-1 bg-brand-pale rounded-lg">{acc.type}</span> },
    { key: 'price', label: 'Prix/nuit', render: (acc: Accommodation) => <span className="text-accent font-semibold">{acc.price} FCFA</span> },
    { key: 'rating', label: 'Note', render: (acc: Accommodation) => <span className="text-amber-500 font-semibold">★ {acc.rating}</span> },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Hébergements"
        subtitle="Gérez les hébergements proposés sur le site."
        onAdd={openCreate}
        addLabel="Ajouter un hébergement"
        accentClass="bg-brand hover:bg-brand-dark"
      />

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>
      ) : accommodations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-400 font-medium">Aucun hébergement pour le moment.</p>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          items={accommodations}
          onEdit={openEdit}
          onDelete={handleDelete}
          imageKey="image"
          labelKey="title"
          subLabelKey="type"
        />
      )}

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Modifier l'hébergement" : 'Ajouter un hébergement'}
        onSubmit={handleSubmit}
        submitting={submitting}
        uploading={uploading}
        editMode={!!editingId}
        error={error}
        accentClass="bg-brand"
      >
        <FormField label="Image">
          {form.image && <img src={form.image} alt="Aperçu" className="w-full h-36 object-cover rounded-xl mb-3" />}
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
            className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-pale file:text-brand hover:file:bg-brand-pale/80" />
          {uploading && <p className="text-xs text-brand mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Envoi…</p>}
        </FormField>

        <FormField label="Titre">
          <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required className={inputCls} />
        </FormField>

        <FormField label="Type">
          <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} required className={selectCls}>
            <option value="" disabled>Sélectionner un type</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>

        <FormField label="Prix (FCFA/nuit)">
          <input type="text" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required className={inputCls} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Note (0–5)">
            <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: parseFloat(e.target.value) || 0 }))} required className={inputCls} />
          </FormField>
          <FormField label="Nombre d'avis">
            <input type="number" min="0" value={form.reviews} onChange={(e) => setForm((p) => ({ ...p, reviews: parseInt(e.target.value) || 0 }))} required className={inputCls} />
          </FormField>
        </div>

        <FormField label="Équipements">
          <div className="flex flex-wrap gap-2 mt-1">
            {FEATURES_OPTIONS.map((feat) => (
              <label
                key={feat.value}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all font-medium ${
                  form.features.includes(feat.value)
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand/40'
                }`}
              >
                <input type="checkbox" checked={form.features.includes(feat.value)} onChange={() => toggleFeature(feat.value)} className="sr-only" />
                {feat.label}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Description">
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required rows={3} className={`${inputCls} resize-none`} />
        </FormField>
      </AdminModal>
    </div>
  );
}