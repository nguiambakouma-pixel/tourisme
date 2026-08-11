/** Traduit les messages d'erreur Supabase / auth en français clair. */
export function translateAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
    return 'Email ou mot de passe incorrect.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Veuillez confirmer votre email avant de vous connecter.';
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'Un compte existe déjà avec cet email.';
  }
  if (lower.includes('password should be at least') || lower.includes('password is too short')) {
    return 'Le mot de passe doit contenir au moins 6 caractères.';
  }
  if (lower.includes('unable to validate email') || lower.includes('invalid email')) {
    return 'Adresse email invalide.';
  }
  if (lower.includes('signup is disabled')) {
    return 'Les inscriptions sont temporairement désactivées.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Problème de connexion. Vérifiez votre réseau et réessayez.';
  }

  return message;
}
