import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';
import { useConfirm } from '@/lib/ConfirmContext';
import { supabase } from '@/lib/supabase';
import { PageHero } from '@/components/ui';
import { usePageMeta, useScrollReveal } from '@/hooks';

type ReservationItem = {
  title?: string;
  price?: string | number;
  type?: string;
};

type Reservation = {
  id: string;
  created_at: string;
  status: string;
  total: number | string;
  items: ReservationItem[];
};

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-ocean-pale text-ocean' },
  confirmed: { label: 'Confirmée', className: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
  completed: { label: 'Terminée', className: 'bg-slate-200 text-slate-700' },
};

export function MyReservationsPage() {
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();
  const { startEditing } = useCart();
  const { confirm } = useConfirm();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const greeting = profile?.full_name?.trim()
    ? `Bonjour ${profile.full_name.split(' ')[0]}`
    : 'Mon compte';

  usePageMeta('Mon compte | StayEatSee+', 'Gérez votre profil et consultez vos réservations.');
  useScrollReveal();

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile?.full_name]);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const loadReservations = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des réservations :', error);
        setReservations([]);
        setLoading(false);
        return;
      }

      setReservations((data ?? []) as Reservation[]);
      setLoading(false);
    };

    void loadReservations();
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (!(await confirm({ message: 'Annuler cette réservation ?', danger: true }))) return;
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId);
    if (error) {
      console.error('Erreur annulation réservation :', error);
      return;
    }
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );
  };

  const handleDeleteReservation = async (reservationId: string) => {
    if (!(await confirm({ message: 'Supprimer définitivement cette réservation ? Cette action est irréversible.', danger: true }))) return;
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', reservationId);
    if (error) {
      console.error('Erreur suppression réservation :', error);
      return;
    }
    setReservations((prev) => prev.filter((r) => r.id !== reservationId));
  };

  const handleProfileSubmit = async () => {
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() || null })
      .eq('id', session.user.id);

    if (error) {
      setProfileMessage(null);
      setSaveError("Impossible d'enregistrer votre nom, réessayez.");
      return;
    }

    setSaveError(null);
    setProfileMessage('Profil mis à jour avec succès.');
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (!newPassword || !confirmPassword) {
      setPasswordError('Veuillez remplir les deux champs du mot de passe.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPasswordMessage('Votre mot de passe a été mis à jour.');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordForm(false);
  };

  return (
    <div className="page-enter">
      {/* ── Hero ── */}
      <PageHero
        badge="Mon espace"
        title={greeting}
        subtitle="Gérez votre profil et retrouvez toutes vos réservations."
        image="https://images.pexels.com/photos/1591361/pexels-photo-1591361.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />

      {/* ── Content ── */}
      <section className="py-16 bg-gradient-to-b from-white to-sky-pale/20">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 space-y-8">

          {/* ── Header actions ── */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand">Mon espace client</h2>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Se déconnecter
            </button>
          </div>

          {/* ── Profil card ── */}
          <div className="reveal bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-navy mb-6">Mon profil</h3>

            <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
              {/* Nom */}
              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-semibold text-slate-700">
                  Nom complet
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="profile-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-navy outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                    placeholder="Votre nom"
                  />
                  <button
                    type="button"
                    onClick={handleProfileSubmit}
                    className="btn-shimmer rounded-full px-5 py-3 text-sm font-semibold text-white whitespace-nowrap"
                  >
                    Enregistrer
                  </button>
                </div>
                {saveError && <p className="text-sm text-red-500">{saveError}</p>}
                {profileMessage && <p className="text-sm text-emerald-600">{profileMessage}</p>}
              </div>

              {/* Email (readonly) */}
              <div className="space-y-2">
                <label htmlFor="profile-email" className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  id="profile-email"
                  value={session?.user.email ?? ''}
                  readOnly
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-base text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowPasswordForm((prev) => !prev)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                Changer mon mot de passe
              </button>

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-semibold text-slate-700">
                      Nouveau mot de passe
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-700">
                      Confirmer le mot de passe
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                      placeholder="••••••••"
                    />
                  </div>

                  {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                  {passwordMessage && <p className="text-sm text-emerald-600">{passwordMessage}</p>}

                  <button
                    type="submit"
                    className="btn-shimmer rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Enregistrer le mot de passe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Réservations ── */}
          <div className="reveal">
            <h3 className="text-xl font-bold text-navy mb-5">Mes réservations</h3>

            {loading ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10 text-center text-sm text-slate-500">
                Chargement de vos réservations...
              </div>
            ) : reservations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10 text-center">
                <p className="text-slate-600 font-medium mb-5">
                  Vous n&apos;avez pas encore de réservation. Découvrez nos expériences !
                </p>
                <Link
                  to="/experiences"
                  className="btn-shimmer inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white"
                >
                  Voir les expériences
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {reservations.map((reservation) => {
                  const status = statusMap[reservation.status] ?? {
                    label: reservation.status || 'En attente',
                    className: 'bg-ocean-pale text-ocean',
                  };

                  const items = Array.isArray(reservation.items) ? reservation.items : [];

                  return (
                    <article
                      key={reservation.id}
                      className="reveal bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg border border-slate-100"
                    >
                      {/* Header : date + statut */}
                      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Date</p>
                          <p className="text-base font-semibold text-navy">
                            {new Date(reservation.created_at).toLocaleString('fr-FR', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                        </div>
                        <span className={`inline-flex self-start sm:self-auto rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Articles */}
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                          Articles
                        </p>
                        <ul className="space-y-2">
                          {items.map((item, index) => (
                            <li
                              key={`${reservation.id}-${index}`}
                              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                            >
                              <span className="flex-1 text-slate-700">
                                {item.title ?? 'Article'}
                                {item.type ? ` · ${item.type}` : ''}
                              </span>
                              <span className="font-semibold text-brand shrink-0">
                                {typeof item.price === 'number'
                                  ? `${item.price.toLocaleString('fr-FR')} FCFA`
                                  : item.price ? `${item.price} FCFA` : '—'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Total */}
                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="text-sm font-semibold text-slate-500">Total</span>
                        <span className="text-xl font-bold text-brand">
                          {typeof reservation.total === 'number'
                            ? `${reservation.total.toLocaleString('fr-FR')} FCFA`
                            : `${reservation.total ?? 0} FCFA`}
                        </span>
                      </div>

                      {/* ── Actions pending : Modifier + Annuler ── */}
                      {reservation.status === 'pending' && (
                        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                          <button
                            type="button"
                            onClick={() => {
                              startEditing(
                                Number(reservation.id),
                                items.map((it) => ({
                                  key: `${it.type ?? 'item'}:${reservation.id}-${Math.random()}`,
                                  type: (it.type as 'experience' | 'accommodation' | 'package') ?? 'experience',
                                  id: Number(reservation.id),
                                  title: it.title ?? 'Article',
                                  price: String(it.price ?? '0'),
                                  image: '',
                                }))
                              );
                              navigate('/experiences');
                            }}
                            className="btn-shimmer inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleCancelReservation(reservation.id)}
                            className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
                          >
                            Annuler cette réservation
                          </button>
                        </div>
                      )}

                      {/* ── Supprimer (toujours visible) ── */}
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => void handleDeleteReservation(reservation.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Supprimer
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
