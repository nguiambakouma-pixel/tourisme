import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function CustomerSignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedFullName = fullName.trim();
    if (!trimmedFullName) {
      setError('Veuillez indiquer votre nom complet.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsSubmitting(false);
      return;
    }

    const userId = data?.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: userId,
          full_name: trimmedFullName,
          role: 'customer',
        },
        { onConflict: 'id' }
      );
      if (profileError) {
        console.error('Erreur lors de la création du profil :', profileError);
      }
    }

    navigate('/compte');
  };

  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_25%),linear-gradient(135deg,#0f2b46_0%,#1b5d8c_35%,#3ca7b8_68%,#f2d3a2_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <style>{`
        @keyframes drift-1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(30px, -20px, 0) scale(1.08); }
        }
        @keyframes drift-2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-28px, 18px, 0) scale(1.12); }
        }
        @keyframes drift-3 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(18px, 26px, 0) scale(1.08); }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-[#f5d7a1]/30 blur-3xl animate-[drift-1_14s_ease-in-out_infinite]" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[#79d4dd]/25 blur-3xl animate-[drift-2_18s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#0d2d49]/30 blur-3xl animate-[drift-3_16s_ease-in-out_infinite]" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-[0_30px_80px_rgba(7,23,38,0.35)] backdrop-blur-xl sm:p-8">
          <div className="mb-7 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f4d6a6]">Compte</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Créer un compte</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="signup-name" className="text-sm font-medium text-slate-100">
                Nom complet
              </label>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                autoComplete="name"
                className="w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3.5 text-base text-[#0f2b46] shadow-inner shadow-[#dbeaf6]/40 outline-none transition duration-200 placeholder:text-slate-500 focus:border-[#8bd4de] focus:bg-white focus:ring-4 focus:ring-[#8bd4de]/25"
                placeholder="Jean Dupont"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-slate-100">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3.5 text-base text-[#0f2b46] shadow-inner shadow-[#dbeaf6]/40 outline-none transition duration-200 placeholder:text-slate-500 focus:border-[#8bd4de] focus:bg-white focus:ring-4 focus:ring-[#8bd4de]/25"
                placeholder="bonjour@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-slate-100">
                Mot de passe
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3.5 text-base text-[#0f2b46] shadow-inner shadow-[#dbeaf6]/40 outline-none transition duration-200 placeholder:text-slate-500 focus:border-[#8bd4de] focus:bg-white focus:ring-4 focus:ring-[#8bd4de]/25"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-confirm-password" className="text-sm font-medium text-slate-100">
                Confirmer le mot de passe
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-3.5 text-base text-[#0f2b46] shadow-inner shadow-[#dbeaf6]/40 outline-none transition duration-200 placeholder:text-slate-500 focus:border-[#8bd4de] focus:bg-white focus:ring-4 focus:ring-[#8bd4de]/25"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <p className="rounded-2xl border border-red-200/80 bg-red-50/90 px-3 py-2.5 text-sm text-red-700 shadow-sm">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-shimmer w-full rounded-full px-4 py-3.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(31,125,169,0.4)] transition duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-100/90">
            Vous avez déjà un compte ?{' '}
            <Link to="/compte/connexion" className="font-semibold text-[#f8d7a6] transition hover:text-white">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
