import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2, LogOut, User, Lock, ChevronDown, ChevronUp,
  Calendar, Package, CheckCircle2, Clock, XCircle, Pencil,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';
import { useConfirm } from '@/lib/ConfirmContext';
import { supabase } from '@/lib/supabase';
import { usePageMeta } from '@/hooks';

type ReservationItem = {
  key?: string;
  id?: string | number;
  title?: string;
  price?: string | number;
  type?: string;
  image?: string;
  img?: string;
};

type Reservation = {
  id: string | number;
  created_at: string;
  status: string;
  total: number | string;
  items: ReservationItem[];
};

const statusMap: Record<string, { label: string; icon: React.ReactNode; className: string; dot: string }> = {
  pending:   { label: 'En attente',  icon: <Clock className="w-3.5 h-3.5" />,        className: 'bg-amber-50 text-amber-700 border border-amber-200',    dot: 'bg-amber-400' },
  confirmed: { label: 'Confirmée',   icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Annulée',     icon: <XCircle className="w-3.5 h-3.5" />,      className: 'bg-red-50 text-red-600 border border-red-200',           dot: 'bg-red-500' },
  completed: { label: 'Terminée',    icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'bg-slate-100 text-slate-600 border border-slate-200',    dot: 'bg-slate-400' },
};

function getInitials(fullName?: string | null, email?: string) {
  const src = fullName?.trim() || email || '';
  const initials = src.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  return initials || (email?.slice(0, 2).toUpperCase() ?? '?');
}

export function MyReservationsPage() {
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();
  const { startEditing } = useCart();
  const { confirm } = useConfirm();

  const [reservations, setReservations]     = useState<Reservation[]>([]);
  const [loading, setLoading]               = useState(true);
  const [fullName, setFullName]             = useState(profile?.full_name ?? '');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [saveError, setSaveError]           = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError]   = useState<string | null>(null);
  const [activeTab, setActiveTab]           = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  usePageMeta('Mon compte | StayEatSee+', 'Gérez votre profil et consultez vos réservations.');

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile?.full_name]);

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (error) { console.error(error); setLoading(false); return; }
      setReservations((data ?? []) as Reservation[]);
      setLoading(false);
    };
    void load();
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    if (!(await confirm({ title: 'Se déconnecter', message: 'Êtes-vous sûr de vouloir vous déconnecter ?', confirmLabel: 'Oui, me déconnecter', cancelLabel: 'Annuler', danger: true }))) return;
    await signOut();
    navigate('/');
  };

  const handleCancelReservation = async (id: string | number) => {
    if (!(await confirm({ message: 'Annuler cette réservation ?', danger: true }))) return;
    const { error } = await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id);
    if (error) { console.error(error); return; }
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status: 'cancelled' } : r));
  };

  const handleDeleteReservation = async (id: string | number) => {
    if (!(await confirm({ message: 'Supprimer définitivement cette réservation ? Cette action est irréversible.', danger: true }))) return;
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const handleProfileSubmit = async () => {
    if (!session) return;
    const { error } = await supabase.from('profiles').update({ full_name: fullName.trim() || null }).eq('id', session.user.id);
    if (error) { setSaveError("Impossible d'enregistrer votre nom."); setProfileMessage(null); return; }
    setSaveError(null);
    setProfileMessage('Profil mis à jour !');
    setTimeout(() => setProfileMessage(null), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null); setPasswordMessage(null);
    if (!newPassword || !confirmPassword) { setPasswordError('Veuillez remplir les deux champs.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Les mots de passe ne correspondent pas.'); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setPasswordError(error.message); return; }
    setPasswordMessage('Mot de passe mis à jour.');
    setNewPassword(''); setConfirmPassword(''); setShowPasswordForm(false);
  };

  const initials   = getInitials(profile?.full_name, session?.user.email);
  const displayName = profile?.full_name?.trim() || session?.user.email?.split('@')[0] || 'Client';
  const email      = session?.user.email ?? '';

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'all',       label: 'Toutes' },
    { key: 'pending',   label: 'En attente' },
    { key: 'confirmed', label: 'Confirmées' },
    { key: 'completed', label: 'Terminées' },
    { key: 'cancelled', label: 'Annulées' },
  ];

  const filtered = activeTab === 'all' ? reservations : reservations.filter((r) => r.status === activeTab);
  const counts   = {
    all: reservations.length,
    pending:   reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    completed: reservations.filter((r) => r.status === 'completed').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#f4f7fb] page-enter">

      {/* ══════════════════════════════════════════
          HEADER DASHBOARD
      ══════════════════════════════════════════ */}
      <div
        className="w-full pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d2b46 0%, #1A3C7A 55%, #254FA3 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto w-full min-w-0">
          {/* Ligne 1 : Avatar + identité */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 min-w-0">
            <div className="relative shrink-0">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#f7d7a4] text-base sm:text-xl font-bold text-[#0d2b46] shadow-[0_0_0_3px_rgba(255,255,255,0.25),0_8px_24px_rgba(247,215,164,0.35)]">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-[#1A3C7A]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-white/50 uppercase mb-0.5">Mon espace client</p>
              <h1
                className="font-bold text-white leading-tight truncate"
                style={{ fontFamily: 'Manrope, system-ui, sans-serif', fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}
              >
                Bonjour, {displayName} 👋
              </h1>
              <p className="text-xs text-white/60 mt-0.5 truncate">{email}</p>
            </div>
          </div>

          {/* Ligne 2 : Stats + déconnexion */}
          <div className="flex flex-col xs:flex-row xs:flex-wrap xs:items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/15 px-3 py-2 backdrop-blur-sm">
                <ShoppingBag className="w-3.5 h-3.5 text-[#f7d7a4]" />
                <span className="text-sm font-semibold text-white">{reservations.length}</span>
                <span className="text-xs text-white/60">résa</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/15 px-3 py-2 backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-sm font-semibold text-white">{counts.pending}</span>
                <span className="text-xs text-white/60">attente</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="xs:ml-auto flex w-full xs:w-auto items-center justify-center gap-1.5 rounded-xl bg-red-500/20 border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/35 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CORPS DU DASHBOARD
      ══════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto w-full min-w-0 px-3 sm:px-4 lg:px-8 py-5 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 w-full min-w-0">

          {/* ─────────────────────────────────────
              COLONNE GAUCHE — Profil
          ───────────────────────────────────── */}
          <aside className="w-full min-w-0 lg:w-80 lg:shrink-0 space-y-4">

            {/* Card profil */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Bandeau top */}
              <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #1A3C7A, #3EABD4, #D4572A)' }} />
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f7fb] text-brand">
                    <User className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-[#0d2b46]" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                    Mon profil
                  </h2>
                </div>

                {/* Nom complet */}
                <div className="space-y-1.5 mb-4">
                  <label htmlFor="profile-name" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Nom complet
                  </label>
                  <input
                    id="profile-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0d2b46] outline-none transition focus:border-[#3EABD4] focus:ring-2 focus:ring-[#3EABD4]/20"
                    placeholder="Votre nom"
                  />
                </div>

                {/* Email readonly */}
                <div className="space-y-1.5 mb-5">
                  <label htmlFor="profile-email" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    value={email}
                    readOnly
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>

                {saveError    && <p className="mb-3 text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{saveError}</p>}
                {profileMessage && <p className="mb-3 text-xs text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2">✓ {profileMessage}</p>}

                <button
                  type="button"
                  onClick={handleProfileSubmit}
                  className="btn-shimmer w-full rounded-2xl py-2.5 text-sm font-semibold text-white"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>

            {/* Card mot de passe */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 sm:p-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm((p) => !p)}
                  className="flex w-full items-center justify-between gap-2 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f7fb] text-brand">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-[#0d2b46]" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                      Mot de passe
                    </span>
                  </div>
                  <span className="text-slate-400 group-hover:text-brand transition-colors">
                    {showPasswordForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {showPasswordForm && (
                  <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-3">
                    <div className="space-y-1.5">
                      <label htmlFor="new-password" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                        Nouveau mot de passe
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0d2b46] outline-none transition focus:border-[#3EABD4] focus:ring-2 focus:ring-[#3EABD4]/20"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="confirm-password" className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                        Confirmer
                      </label>
                      <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-[#0d2b46] outline-none transition focus:border-[#3EABD4] focus:ring-2 focus:ring-[#3EABD4]/20"
                        placeholder="••••••••"
                      />
                    </div>
                    {passwordError   && <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{passwordError}</p>}
                    {passwordMessage && <p className="text-xs text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2">✓ {passwordMessage}</p>}
                    <button type="submit" className="btn-shimmer w-full rounded-2xl py-2.5 text-sm font-semibold text-white">
                      Mettre à jour
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Raccourcis */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-5 space-y-2">
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-3">Navigation rapide</p>
              {[
                { label: 'Nos expériences', to: '/experiences', icon: '🌿' },
                { label: 'Hébergements',    to: '/hebergements', icon: '🏡' },
                { label: 'Nos packs',       to: '/packs', icon: '🎁' },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-[#f4f7fb] hover:text-[#1A3C7A] group"
                >
                  <span className="text-base">{l.icon}</span>
                  {l.label}
                  <ChevronDown className="w-3.5 h-3.5 ml-auto -rotate-90 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              ))}
            </div>
          </aside>

          {/* ─────────────────────────────────────
              COLONNE DROITE — Réservations
          ───────────────────────────────────── */}
          <div className="w-full min-w-0 flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden w-full min-w-0">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f7fb] text-brand">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-[#0d2b46]" style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}>
                    Mes réservations
                  </h2>
                  {!loading && (
                    <span className="rounded-full bg-[#f4f7fb] border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-[#1A3C7A]">
                      {reservations.length}
                    </span>
                  )}
                </div>
                <Link
                  to="/experiences"
                  className="btn-shimmer inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold text-white"
                >
                  <Package className="w-3.5 h-3.5" />
                  Nouvelle réservation
                </Link>
              </div>

              {/* Tabs filtre */}
              <div className="flex gap-1 px-3 sm:px-4 py-3 border-b border-slate-100 overflow-x-auto max-w-full">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === t.key
                        ? 'bg-[#1A3C7A] text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                    {counts[t.key] > 0 && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        activeTab === t.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {counts[t.key]}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Liste réservations */}
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#1A3C7A] border-t-transparent animate-spin" />
                    <p className="text-sm text-slate-500">Chargement de vos réservations…</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f4f7fb] text-3xl">
                      🏖️
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#0d2b46] mb-1">
                        {activeTab === 'all' ? 'Aucune réservation' : `Aucune réservation "${tabs.find(t => t.key === activeTab)?.label}"`}
                      </p>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        {activeTab === 'all' ? 'Découvrez nos expériences uniques à Kribi.' : 'Essayez un autre filtre.'}
                      </p>
                    </div>
                    {activeTab === 'all' && (
                      <Link to="/experiences" className="btn-shimmer inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white">
                        Voir les expériences
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filtered.map((reservation) => {
                      const status = statusMap[reservation.status] ?? statusMap.pending;
                      const items  = Array.isArray(reservation.items) ? reservation.items : [];

                      return (
                        <article
                          key={reservation.id}
                          className="rounded-2xl border border-slate-100 bg-[#fafbfd] overflow-hidden transition hover:border-[#3EABD4]/30 hover:shadow-md"
                        >
                          {/* Header réservation */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`flex h-2 w-2 rounded-full shrink-0 ${status.dot}`} />
                              <div className="min-w-0">
                                <p className="text-xs text-slate-400 font-medium truncate">
                                  {new Date(reservation.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">#{String(reservation.id).slice(0, 8).toUpperCase()}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                                {status.icon}
                                {status.label}
                              </span>
                              <span className="text-sm sm:text-base font-bold text-[#D4572A]">
                                {typeof reservation.total === 'number'
                                  ? `${reservation.total.toLocaleString('fr-FR')} FCFA`
                                  : `${reservation.total ?? 0} FCFA`}
                              </span>
                            </div>
                          </div>

                          {/* Articles */}
                          <div className="px-4 sm:px-5 py-4 space-y-2">
                            {items.map((item, i) => (
                              <div
                                key={`${reservation.id}-${i}`}
                                className="flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-100 px-4 py-2.5"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-xs font-semibold tracking-wider uppercase text-[#3EABD4] shrink-0">
                                    {item.type ?? 'item'}
                                  </span>
                                  <span className="text-sm text-[#0d2b46] font-medium truncate">{item.title ?? 'Article'}</span>
                                </div>
                                <span className="text-sm font-bold text-[#1A3C7A] shrink-0">
                                  {typeof item.price === 'number'
                                    ? `${item.price.toLocaleString('fr-FR')} FCFA`
                                    : item.price ? `${item.price} FCFA` : '—'}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-t border-slate-100 bg-white">
                            <div className="flex flex-wrap items-center gap-2">
                              {reservation.status === 'pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const itemsForCart = items.map((item: ReservationItem) => ({
                                        key: item.key ?? `${item.type}:${item.id}`,
                                        type: (item.type as 'experience' | 'accommodation' | 'package') ?? 'experience',
                                        id: Number(item.id),
                                        title: item.title ?? 'Article',
                                        price: String(item.price ?? '0'),
                                        image: item.image ?? item.img ?? '',
                                      }));
                                      startEditing(Number(reservation.id), itemsForCart);
                                      navigate('/experiences');
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-xl btn-shimmer px-4 py-2 text-xs font-semibold text-white"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Modifier
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void handleCancelReservation(reservation.id)}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 transition hover:border-red-200 hover:text-red-500"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Annuler
                                  </button>
                                </>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => void handleDeleteReservation(reservation.id)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-100 hover:text-red-600"
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
          </div>

        </div>
      </div>
    </div>
  );
}
