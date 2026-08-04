import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminPageHeader, AdminModal, FormField, inputCls, selectCls } from '@/components/admin/AdminUI';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  created_at: string;
  read_time: string;
  author: string;
  image: string;
}

const CATEGORIES = ['Destinations', 'Activités', 'Gastronomie', 'Conseils', 'Nature', 'Culture'];
const INITIAL_FORM = { title: '', excerpt: '', content: '', category: '', author: '', image: '' };

export function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('blog_posts').select('*').order('id', { ascending: true });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); setModalOpen(true); };
  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({ title: post.title ?? '', excerpt: post.excerpt ?? '', content: post.content ?? '', category: post.category ?? '', author: post.author ?? '', image: post.image });
    setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm({ ...INITIAL_FORM }); setError(null); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setError(null);
    const path = `blog/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('site-images').upload(path, file);
    if (uploadError) { setError("Erreur lors de l'upload."); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
    setForm((p) => ({ ...p, image: urlData.publicUrl }));
    setUploading(false);
  };

  const computeReadTime = (content: string) => `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(null);
    const payload = { title: form.title, excerpt: form.excerpt, content: form.content, category: form.category, read_time: computeReadTime(form.content), author: form.author, image: form.image };
    const { error: err } = editingId
      ? await supabase.from('blog_posts').update(payload).eq('id', editingId)
      : await supabase.from('blog_posts').insert(payload);
    if (err) { setError('Erreur lors de l\'enregistrement.'); setSubmitting(false); return; }
    setSubmitting(false); closeModal(); fetch();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetch();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const columns = [
    {
      key: 'image', label: 'Image',
      render: (post: BlogPost) => <img src={post.image} alt={post.title} className="w-12 h-12 object-cover rounded-xl" />,
      mobileHide: true,
    },
    { key: 'title', label: 'Titre', grow: true, render: (post: BlogPost) => <span className="font-semibold text-slate-800 line-clamp-1">{post.title}</span> },
    { key: 'category', label: 'Catégorie', render: (post: BlogPost) => <span className="text-accent font-medium text-xs px-2 py-1 bg-accent-pale rounded-lg">{post.category}</span> },
    { key: 'author', label: 'Auteur', mobileHide: true },
    { key: 'created_at', label: 'Date', render: (post: BlogPost) => <span className="text-slate-400 text-xs">{formatDate(post.created_at)}</span> },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Articles de blog"
        subtitle="Gérez les articles de blog du site."
        onAdd={openCreate}
        addLabel="Ajouter un article"
        accentClass="bg-accent hover:bg-accent-dark"
      />

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-400 font-medium">Aucun article pour le moment.</p>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          items={posts}
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
        title={editingId ? "Modifier l'article" : 'Ajouter un article'}
        onSubmit={handleSubmit}
        submitting={submitting}
        uploading={uploading}
        editMode={!!editingId}
        error={error}
        accentClass="bg-accent"
      >
        <FormField label="Image à la une">
          {form.image && <img src={form.image} alt="Aperçu" className="w-full h-36 object-cover rounded-xl mb-3" />}
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
            className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent-pale file:text-accent hover:file:bg-accent-pale/80" />
          {uploading && <p className="text-xs text-accent mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Envoi…</p>}
        </FormField>

        <FormField label="Titre">
          <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required className={inputCls} />
        </FormField>

        <FormField label="Extrait">
          <textarea value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} required rows={2} className={`${inputCls} resize-none`} />
        </FormField>

        <FormField label="Contenu">
          <p className="text-xs text-slate-400 mb-2">Séparez les paragraphes par une ligne vide.</p>
          <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} required rows={8} className={`${inputCls} resize-none`} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Catégorie">
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required className={selectCls}>
              <option value="" disabled>Sélectionner</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Auteur">
            <input type="text" value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} required className={inputCls} />
          </FormField>
        </div>
      </AdminModal>
    </div>
  );
}