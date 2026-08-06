import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, X } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminPageHeader, AdminModal, FormField, inputCls } from '@/components/admin/AdminUI';

interface PackageItem {
  type: 'experience' | 'accommodation';
  id: number;
  title: string;
  image: string;
}

interface Package {
  id: number;
  title: string;
  description: string;
  price: string;
  badge: string;
  image: string;
  items: PackageItem[];
}

interface SelectableItem {
  id: number;
  title: string;
  image: string;
}

const INITIAL_FORM = { title: '', description: '', price: '', badge: '', image: '', items: [] as PackageItem[] };

export function PackagesAdminPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [experiences, setExperiences] = useState<SelectableItem[]>([]);
  const [accommodations, setAccommodations] = useState<SelectableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('packages').select('*').order('id', { ascending: true });
    setPackages(data ?? []);
    setLoading(false);
  };

  const fetchSelectable = async () => {
    const [expRes, accRes] = await Promise.all([
      supabase.from('experiences').select('id, title, image').order('id', { ascending: true }),
      supabase.from('accommodations').select('id, title, image').order('id', { ascending: true }),
    ]);
    setExperiences(expRes.data ?? []);
    setAccommodations(accRes.data ?? []);
  };

  useEffect(() => { fetch(); fetchSelectable(); }, []);

  const openCreate = () => { setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); setModalOpen(true); };
  const openEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setForm({ title: pkg.title, description: pkg.description, price: pkg.price, badge: pkg.badge, image: pkg.image, items: pkg.items ?? [] });
    setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); };

  const toggleItem = (type: 'experience' | 'accommodation', item: SelectableItem) => {
    setForm((p) => {
      const exists = p.items.some((i) => i.type === type && i.id === item.id);
      if (exists) return { ...p, items: p.items.filter((i) => !(i.type === type && i.id === item.id)) };
      return { ...p, items: [...p.items, { type, id: item.id, title: item.title, image: item.image }] };
    });
  };

  const removeItem = (type: 'experience' | 'accommodation', id: number) => {
    setForm((p) => ({ ...p, items: p.items.filter((i) => !(i.type === type && i.id === id)) }));
  };

  const isSelected = (type: 'experience' | 'accommodation', id: number) =>
    form.items.some((i) => i.type === type && i.id === id);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setError(null);
    const path = `packages/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('site-images').upload(path, file);
    if (uploadError) { setError("Erreur lors de l'upload."); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
    setForm((p) => ({ ...p, image: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(null);
    const payload = { title: form.title, description: form.description, price: form.price, badge: form.badge, image: form.image, items: form.items };
    const { error: err } = editingId
      ? await supabase.from('packages').update(payload).eq('id', editingId)
      : await supabase.from('packages').insert(payload);
    if (err) { setError('Erreur lors de l\'enregistrement.'); setSubmitting(false); return; }
    setSubmitting(false); closeModal(); fetch();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce pack ?')) return;
    await supabase.from('packages').delete().eq('id', id);
    fetch();
  };

  const columns = [
    {
      key: 'image', label: 'Image',
      render: (pkg: Package) => <img src={pkg.image} alt={pkg.title} className="w-12 h-12 object-cover rounded-xl" />,
      mobileHide: true,
    },
    { key: 'title', label: 'Titre', grow: true, render: (pkg: Package) => <span className="font-semibold text-slate-800">{pkg.title}</span> },
    { key: 'price', label: 'Prix', render: (pkg: Package) => <span className="text-accent font-semibold">{pkg.price} FCFA</span> },
    {
      key: 'items', label: 'Éléments inclus',
      render: (pkg: Package) => (
        <span className="text-brand font-medium text-xs px-2 py-1 bg-brand-pale rounded-lg">
          {pkg.items?.length ?? 0} éléments
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Packs"
        subtitle="Gérez les packs combinés proposés sur le site."
        onAdd={openCreate}
        addLabel="Ajouter un pack"
        accentClass="bg-accent hover:bg-accent-dark"
      />

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-400 font-medium">Aucun pack pour le moment.</p>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          items={packages}
          onEdit={openEdit}
          onDelete={handleDelete}
          imageKey="image"
          labelKey="title"
          subLabelKey="price"
        />
      )}

      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Modifier le pack" : 'Ajouter un pack'}
        onSubmit={handleSubmit}
        submitting={submitting}
        uploading={uploading}
        editMode={!!editingId}
        error={error}
        accentClass="bg-accent"
      >
        <FormField label="Image">
          {form.image && <img src={form.image} alt="Aperçu" className="w-full h-36 object-cover rounded-xl mb-3" />}
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
            className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent-pale file:text-accent hover:file:bg-accent/10" />
          {uploading && <p className="text-xs text-accent mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Envoi…</p>}
        </FormField>

        <FormField label="Titre">
          <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required className={inputCls} />
        </FormField>

        <FormField label="Description">
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required rows={3} className={`${inputCls} resize-none`} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prix (FCFA)">
            <input type="text" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required className={inputCls} />
          </FormField>
          <FormField label="Badge (optionnel)">
            <input type="text" value={form.badge} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))} className={inputCls} />
          </FormField>
        </div>

        <FormField label="Éléments inclus">
          {/* Tags des éléments sélectionnés */}
          {form.items.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {form.items.map((item) => (
                <span
                  key={`${item.type}-${item.id}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-pale text-brand text-xs font-medium"
                >
                  {item.title}
                  <button
                    type="button"
                    onClick={() => removeItem(item.type, item.id)}
                    className="text-brand/60 hover:text-brand transition-colors"
                    aria-label={`Retirer ${item.title}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Expériences */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Expériences</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {experiences.length === 0 ? (
                <p className="text-xs text-slate-400">Aucune expérience disponible.</p>
              ) : experiences.map((exp) => (
                <label
                  key={exp.id}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                    isSelected('experience', exp.id)
                      ? 'bg-sky-pale border-sky text-sky'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-sky/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected('experience', exp.id)}
                    onChange={() => toggleItem('experience', exp)}
                    className="accent-sky"
                  />
                  <img src={exp.image} alt={exp.title} className="w-7 h-7 object-cover rounded-md" />
                  <span className="font-medium truncate">{exp.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hébergements */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Hébergements</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {accommodations.length === 0 ? (
                <p className="text-xs text-slate-400">Aucun hébergement disponible.</p>
              ) : accommodations.map((acc) => (
                <label
                  key={acc.id}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                    isSelected('accommodation', acc.id)
                      ? 'bg-brand-pale border-brand text-brand'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-brand/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected('accommodation', acc.id)}
                    onChange={() => toggleItem('accommodation', acc)}
                    className="accent-brand"
                  />
                  <img src={acc.image} alt={acc.title} className="w-7 h-7 object-cover rounded-md" />
                  <span className="font-medium truncate">{acc.title}</span>
                </label>
              ))}
            </div>
          </div>
        </FormField>
      </AdminModal>
    </div>
  );
}