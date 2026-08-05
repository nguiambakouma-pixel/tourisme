import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  const handleProfileSubmit = async () => {
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() || null })
      .eq('id', session.user.id);

    if (error) {
      setProfileMessage(`Erreur : ${error.message}`);
      return;
    }

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

  const greeting = profile?.full_name?.trim()
    ? `Bonjour ${profile.full_name.split(' ')[0]} `
    : 'Mon compte';

  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_25%),linear-gradient(135deg,#0f2b46_0%,#1b5d8c_35%,#3ca7b8_68%,#f2d3a2_100%)] px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
      <style>{`
        @keyframes drift-1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(26px, -18px, 0) scale(1.08); }
        }
        @keyframes drift-2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-24px, 16px, 0) scale(1.12); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-[#f5d7a1]/30 blur-3xl animate-[drift-1_14s_ease-in-out_infinite]" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[#79d4dd]/25 blur-3xl animate-[drift-2_18s_ease-in-out_infinite]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7d7a4]">Compte</p>
            <h1 className="mt-2 max-w-full text-3xl font-bold tracking-tight text-white sm:text-4xl">{greeting.trim() || 'Mon compte'}</h1>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/50 hover:bg-white/15 sm:w-auto"
          >
            Se déconnecter
          </button>
        </div>

        <section className="mb-8 rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-[0_30px_80px_rgba(7,23,38,0.28)] backdrop-blur-xl sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-white">Mon profil</h2>

          <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
            <div className="space-y-2">
              <label htmlFor="profile-name" className="text-sm font-medium text-slate-200">
                Nom complet
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="profile-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-base text-navy outline-none transition focus:border-[#8bd4de] focus:ring-4 focus:ring-[#8bd4de]/25"
                  placeholder="Votre nom"
                />
                <button
                  type="button"
                  onClick={handleProfileSubmit}
                  className="rounded-full bg-[#f7d7a4] px-4 py-3 text-sm font-semibold text-navy transition hover:bg-[#efd191]"
                >
                  Enregistrer
                </button>
              </div>
              {profileMessage ? (
                <p className="text-sm text-[#dff6f7]">{profileMessage}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-email" className="text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="profile-email"
                value={session?.user.email ?? ''}
                readOnly
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-slate-100 outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowPasswordForm((prev) => !prev)}
              className="rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/50 hover:bg-white/15"
            >
              Changer mon mot de passe
            </button>

            {showPasswordForm ? (
              <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 rounded-2xl border border-white/20 bg-white/5 p-4">
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium text-slate-200">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-base text-navy outline-none transition focus:border-[#8bd4de] focus:ring-4 focus:ring-[#8bd4de]/25"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium text-slate-200">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-base text-navy outline-none transition focus:border-[#8bd4de] focus:ring-4 focus:ring-[#8bd4de]/25"
                    placeholder="••••••••"
                  />
                </div>

                {passwordError ? (
                  <p className="text-sm text-red-200">{passwordError}</p>
                ) : null}
                {passwordMessage ? (
                  <p className="text-sm text-[#dff6f7]">{passwordMessage}</p>
                ) : null}

                <button
                  type="submit"
                  className="rounded-full bg-[#f7d7a4] px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-[#efd191]"
                >
                  Enregistrer le mot de passe
                </button>
              </form>
            ) : null}
          </div>
        </section>

        {loading ? (
          <div className="rounded-[28px] border border-white/20 bg-white/10 p-6 text-sm text-slate-100 shadow-[0_30px_80px_rgba(7,23,38,0.28)] backdrop-blur-xl">
            Chargement de vos réservations...
          </div>
        ) : reservations.length === 0 ? (
          <div className="rounded-[30px] border border-white/20 bg-white/10 p-8 text-center shadow-[0_30px_80px_rgba(7,23,38,0.28)] backdrop-blur-xl">
            <p className="text-lg font-medium text-white">
              Vous n&apos;avez pas encore de réservation. Découvrez nos expériences !
            </p>
            <Link
              to="/experiences"
              className="btn-shimmer mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white"
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
                  className="rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-[0_30px_80px_rgba(7,23,38,0.28)] backdrop-blur-xl sm:p-6"
                >
                  <div className="mb-4 flex flex-col gap-3 border-b border-white/20 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-200">Date</p>
                      <p className="text-base font-semibold text-white">
                        {new Date(reservation.created_at).toLocaleString('fr-FR', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>

                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-200">
                      Articles
                    </p>

                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li key={`${reservation.id}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white">
                          <span className="flex-1">
                            {item.title ?? 'Article'}
                            {item.type ? ` · ${item.type}` : ''}
                          </span>
                          <span className="font-semibold text-[#f8d7a6]">
                            {typeof item.price === 'number'
                              ? `${item.price} FCFA`
                              : item.price ? `${item.price} FCFA` : '—'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                    <span className="text-sm font-medium text-slate-200">Total</span>
                    <span className="text-xl font-bold text-white">
                      {typeof reservation.total === 'number'
                        ? `${reservation.total.toLocaleString('fr-FR')} FCFA`
                        : `${reservation.total ?? 0} FCFA`}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
