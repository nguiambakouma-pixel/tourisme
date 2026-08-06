import { useEffect, useState } from 'react';
import { ClipboardList, Loader2, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useConfirm } from '@/lib/ConfirmContext';

interface ReservationRow {
  id: string | number;
  user_id: string;
  items: any[];
  total: number;
  created_at: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface ProfileMap {
  [userId: string]: { full_name: string | null; email: string | null };
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'confirmed')
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        Confirmée
      </span>
    );
  if (status === 'cancelled')
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
        Annulée
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700">
      En attente
    </span>
  );
}

function ItemsCell({ items }: { items: any[] }) {
  const [open, setOpen] = useState(false);
  if (!Array.isArray(items) || items.length === 0)
    return <span className="text-slate-400 text-sm">—</span>;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-sky hover:text-brand transition-colors"
      >
        {items.length} article{items.length > 1 ? 's' : ''}
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && (
        <ul className="mt-2 space-y-1">
          {items.map((item: any, idx: number) => (
            <li key={idx} className="text-xs text-slate-600 flex items-center justify-between gap-2">
              <span className="truncate">{item.title ?? '—'}</span>
              {item.price && (
                <span className="shrink-0 text-brand font-semibold">
                  {Number(item.price).toLocaleString('fr-FR')} FCFA
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ReservationsAdminPage() {
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileMap>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const { confirm } = useConfirm();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: resData, error: resError } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (resError) {
        console.error('Erreur réservations :', resError);
        setLoading(false);
        return;
      }

      const rows: ReservationRow[] = (resData ?? []).map((r) => ({
        id: r.id,
        user_id: String(r.user_id ?? ''),
        items: Array.isArray(r.items) ? r.items : [],
        total: Number(r.total ?? 0),
        created_at: r.created_at ?? null,
        status: r.status ?? 'pending',
      }));

      setReservations(rows);

      // Unique user IDs → single profiles query
      const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        const map: ProfileMap = {};
        for (const p of profilesData ?? []) {
          map[p.id] = { full_name: p.full_name ?? null, email: p.email ?? null };
        }
        setProfiles(map);
      }

      setLoading(false);
    };

    void load();
  }, []);

  const updateStatus = async (id: string | number, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    const key = String(id);
    setUpdating((s) => ({ ...s, [key]: true }));
    const { error } = await supabase.from('reservations').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    }
    setUpdating((s) => ({ ...s, [key]: false }));
  };

  const handleDelete = async (id: string | number) => {
    const ok = await confirm({
      message: 'Supprimer définitivement cette réservation ?',
      danger: true,
    });
    if (!ok) return;
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (!error) {
      setReservations((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const clientLabel = (userId: string) => {
    const p = profiles[userId];
    if (!p) return 'Client inconnu';
    return p.full_name?.trim() || p.email || 'Client inconnu';
  };

  const clientEmail = (userId: string) => profiles[userId]?.email ?? '—';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-sky flex items-center justify-center shadow-lg">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand">Réservations</h1>
        </div>
        <p className="text-sm text-slate-500">
          Toutes les réservations passées par les clients, avec gestion du statut.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white py-20 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-sky" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-500 shadow-sm">
          Aucune réservation enregistrée.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* Desktop header row */}
          <div className="hidden md:grid md:grid-cols-[1.6fr_1.4fr_1.2fr_0.9fr_0.9fr_1.6fr] border-b border-slate-100 bg-slate-50/80 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Client</span>
            <span>Email</span>
            <span>Articles</span>
            <span>Total</span>
            <span>Date</span>
            <span>Statut</span>
          </div>

          <div className="divide-y divide-slate-100">
            {reservations.map((res) => {
              const key = String(res.id);
              const busy = !!updating[key];
              return (
                <div
                  key={key}
                  className="grid gap-3 px-4 py-4 md:grid-cols-[1.6fr_1.4fr_1.2fr_0.9fr_0.9fr_1.6fr] md:items-start"
                >
                  {/* Client */}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800 text-sm">
                      {clientLabel(res.user_id)}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-500">{clientEmail(res.user_id)}</p>
                  </div>

                  {/* Articles dépliables */}
                  <div>
                    <ItemsCell items={res.items} />
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-sm font-semibold text-brand">
                      {res.total.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm text-slate-500">
                      {res.created_at
                        ? new Date(res.created_at).toLocaleDateString('fr-FR')
                        : '—'}
                    </p>
                  </div>

                  {/* Statut + boutons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={res.status} />
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateStatus(res.id, 'pending')}
                        disabled={busy || res.status === 'pending'}
                        className="text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        En attente
                      </button>
                      <button
                        onClick={() => updateStatus(res.id, 'confirmed')}
                        disabled={busy || res.status === 'confirmed'}
                        className="text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => updateStatus(res.id, 'cancelled')}
                        disabled={busy || res.status === 'cancelled'}
                        className="text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => void handleDelete(res.id)}
                        disabled={busy}
                        className="ml-1 p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Supprimer définitivement"
                        aria-label="Supprimer cette réservation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
