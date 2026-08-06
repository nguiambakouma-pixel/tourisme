import { useEffect, useState } from 'react';
import { Loader2, Users, Phone, CalendarDays, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CustomerRow {
  id: string;
  name: string;
  contact: string;
  email: string;
  reservationCount: number;
  totalSpent: number;
  lastReservation: string | null;
}

export function CustomersAdminPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, role, phone, email')
        .neq('role', 'admin')
        .order('created_at', { ascending: true });

      if (profilesError) {
        console.error('Erreur profils clients:', profilesError);
        setCustomers([]);
        setLoading(false);
        return;
      }

      const { data: reservationsData } = await supabase
        .from('reservations')
        .select('user_id, total, created_at');

      const byUser = new Map<string, Array<{ total: number; created_at: string | null }>>();
      for (const reservation of reservationsData ?? []) {
        const userId = String(reservation.user_id ?? '');
        if (!userId) continue;

        const current = byUser.get(userId) ?? [];
        current.push({
          total: Number(reservation.total ?? 0),
          created_at: reservation.created_at ?? null,
        });
        byUser.set(userId, current);
      }

      const rows: CustomerRow[] = (profilesData ?? [])
        .filter((profile) => profile.role === 'customer')
        .map((profile) => {
          const reservations = byUser.get(profile.id) ?? [];
          const totalSpent = reservations.reduce((sum, item) => sum + Number(item.total ?? 0), 0);
          const lastReservation = reservations
            .map((item) => item.created_at)
            .filter(Boolean)
            .sort()
            .at(-1) ?? null;

          return {
            id: profile.id,
            name: profile.full_name?.trim() || 'Client sans nom',
            contact: profile.phone?.trim() || '—',
            email: profile.email?.trim() || '—',
            reservationCount: reservations.length,
            totalSpent,
            lastReservation,
          };
        }).sort((a, b) => b.reservationCount - a.reservationCount || a.name.localeCompare(b.name));

      setCustomers(rows);
      setLoading(false);
    };

    void fetchCustomers();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-sky flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand">Clients</h1>
        </div>
        <p className="text-sm text-slate-500">Liste des utilisateurs clients enregistrés dans la base, même sans réservation.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white py-16 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-sky" />
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-500 shadow-sm">
          Aucun client trouvé dans la base de données.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="hidden md:grid md:grid-cols-[1.5fr_1.8fr_1fr_1.2fr_1.1fr] border-b border-slate-100 bg-slate-50/80 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Nom</span>
            <span>Contact (Tél.)</span>
            <span>Réservations</span>
            <span>Total</span>
            <span>Dernière</span>
          </div>

          <div className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <div key={customer.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.5fr_1.8fr_1fr_1.2fr_1.1fr] md:items-center">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">{customer.name}</p>
                </div>

                <div className="min-w-0 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{customer.contact}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 break-words">{customer.email}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="inline-flex rounded-full bg-sky-pale px-2.5 py-1 text-xs font-semibold text-sky">
                    {customer.reservationCount}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-brand">
                  <Wallet className="h-4 w-4 text-slate-400" />
                  <span>{customer.totalSpent.toLocaleString('fr-FR')} FCFA</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <span>{customer.lastReservation ? new Date(customer.lastReservation).toLocaleDateString('fr-FR') : '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
