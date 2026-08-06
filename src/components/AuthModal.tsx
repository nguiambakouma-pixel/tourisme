import { FormEvent, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, triggerAuthSuccess } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) {
    return null;
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error: signInError } = await signIn(email.trim(), password);

    if (signInError) {
      setError(signInError);
      setIsSubmitting(false);
      return;
    }

    triggerAuthSuccess();
    closeAuthModal();
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
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
        setError(profileError.message);
      }
    }

    triggerAuthSuccess();
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Fermer la modale"
        >
          <span className="text-xl leading-none">×</span>
        </button>

        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ocean">Compte</p>
          <h2 className="mt-3 text-3xl font-bold text-navy">
            {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </h2>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="auth-email" className="text-sm font-medium text-navy">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                placeholder="bonjour@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="auth-password" className="text-sm font-medium text-navy">
                Mot de passe
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-shimmer w-full rounded-full px-4 py-3 text-sm font-semibold text-white"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="signup-name" className="text-sm font-medium text-navy">
                Nom complet
              </label>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                autoComplete="name"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                placeholder="Jean Dupont"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-medium text-navy">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                placeholder="bonjour@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-medium text-navy">
                Mot de passe
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-confirm" className="text-sm font-medium text-navy">
                Confirmer le mot de passe
              </label>
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/20"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-shimmer w-full rounded-full px-4 py-3 text-sm font-semibold text-white"
            >
              {isSubmitting ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          {mode === 'login' ? (
            <>
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode('signup');
                }}
                className="font-semibold text-ocean hover:text-ocean-dark"
              >
                Créer un compte
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode('login');
                }}
                className="font-semibold text-ocean hover:text-ocean-dark"
              >
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
