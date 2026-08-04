import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminPageHeader, AdminModal, FormField, inputCls, selectCls } from '@/components/admin/AdminUI';

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
  { value: 'bg-purple-600', label: 'Violet' },
  { value: 'bg-teal-600', label: 'Sarcelle' },
  { value: 'bg-cyan-600', label: 'Cyan' },
  { value: 'bg-green-700', label: 'Vert' },
  { value: 'bg-emerald-700', label: 'Émeraude' },
  { value: 'bg-amber-600', label: 'Ambre' },
  { value: 'bg-red-600', label: 'Rouge' },
];

const INITIAL_FORM = { title: '', description: '', price: '', duration: '', category: '', badge: '', badge_color: 'bg-orange-500', image: '' };

export function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('experiences').select('*').order('id', { ascending: true });
    setExperiences(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); setModalOpen(true); };
  const openEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({ title: exp.title, description: exp.description, price: exp.price, duration: exp.duration, category: exp.category, badge: exp.badge, badge_color: exp.badge_color, image: exp.image });
    setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setError(null);
    const path = `experiences/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('site-images').upload(path, file);
    if (uploadError) { setError("Erreur lors de l'upload."); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
    setForm((p) => ({ ...p, image: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(null);
    const payload = { title: form.title, description: form.description, price: form.price, duration: form.duration, category: form.category, badge: form.badge, badge_color: form.badge_color, image: form.image };
    const { error: err } = editingId
      ? await supabase.from('experiences').update(payload).eq('id', editingId)
      : await supabase.from('experiences').insert(payload);
    if (err) { setError('Erreur lors de l\'enregistrement.'); setSubmitting(false); return; }
    setSubmitting(false); closeModal(); fetch();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette expérience ?')) return;
    await supabase.from('experiences').delete().eq('id', id);
    fetch();
  };

  const columns = [
    {
      key: 'image', label: 'Image',
      render: (exp: Experience) => (
        <img src={exp.image} alt={exp.title} className="w-12 h-12 object-cover rounded-xl" />
      ),
      mobileHide: true,
    },
    { key: 'title', label: 'Titre', grow: true, render: (exp: Experience) => <span className="font-semibold text-slate-800">{exp.title}</span> },
    { key: 'category', label: 'Catégorie', render: (exp: Experience) => <span className="text-sky font-medium text-xs px-2 py-1 bg-sky-pale rounded-lg">{exp.category}</span> },
    { key: 'price', label: 'Prix', render: (exp: Experience) => <span className="text-accent font-semibold">{exp.price} FCFA</span> },
    { key: 'duration', label: 'Durée' },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Expériences"
        subtitle="Gérez les expériences proposées sur le site."
        onAdd={openCreate}
        addLabel="Ajouter une expérience"
        accentClass="bg-sky hover:bg-sky-dark"
      />

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-sky animate-spin" /></div>
      ) : experiences.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-400 font-medium">Aucune expérience pour le moment.</p>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          items={experiences}
          onEdit={openEdit}
          onDelete={handleDelete}
          imageKey="image"
          labelKey="title"
          subLabelKey="category"
        />
      )}

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Modifier l'expérience" : 'Ajouter une expérience'}
        onSubmit={handleSubmit}
        submitting={submitting}
        uploading={uploading}
        editMode={!!editingId}
        error={error}
        accentClass="bg-sky"
      >
        <FormField label="Image">
          {form.image && <img src={form.image} alt="Aperçu" className="w-full h-36 object-cover rounded-xl mb-3" />}
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
            className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-pale file:text-sky hover:file:bg-sky/10" />
          {uploading && <p className="text-xs text-sky mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Envoi…</p>}
        </FormField>

        <FormField label="Titre">
          <input id="title" type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required className={inputCls} />
        </FormField>

        <FormField label="Description">
          <textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required rows={3} className={`${inputCls} resize-none`} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prix (FCFA)">
            <input id="price" type="text" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required className={inputCls} />
          </FormField>
          <FormField label="Durée">
            <input id="duration" type="text" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} required className={inputCls} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Catégorie">
            <select id="category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required className={selectCls}>
              <option value="" disabled>Sélectionner</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Badge">
            <input id="badge" type="text" value={form.badge} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))} required className={inputCls} />
          </FormField>
        </div>

        <FormField label="Couleur du badge">
          <select id="badge_color" value={form.badge_color} onChange={(e) => setForm((p) => ({ ...p, badge_color: e.target.value }))} className={selectCls}>
            {BADGE_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </FormField>
      </AdminModal>
    </div>
  );
}