/** Traductions des messages Supabase / API en français clair */
export function translateAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials') || normalized.includes('invalid credentials')) {
    return 'Email ou mot de passe incorrect.';
  }
  if (normalized.includes('email not confirmed')) {
    return 'Veuillez confirmer votre email avant de vous connecter.';
  }
  if (normalized.includes('user already registered') || normalized.includes('already been registered')) {
    return 'Un compte existe déjà avec cet email.';
  }
  if (normalized.includes('password should be at least') || normalized.includes('weak password')) {
    return 'Le mot de passe doit contenir au moins 6 caractères.';
  }
  if (normalized.includes('invalid email') || normalized.includes('unable to validate email')) {
    return 'Adresse email invalide.';
  }
  if (normalized.includes('signup is disabled')) {
    return 'Les inscriptions sont temporairement désactivées.';
  }
  if (normalized.includes('too many requests') || normalized.includes('rate limit')) {
    return 'Trop de tentatives. Veuillez réessayer dans quelques instants.';
  }
  if (normalized.includes('network') || normalized.includes('fetch')) {
    return 'Problème de connexion. Vérifiez votre réseau et réessayez.';
  }

  return message;
}
