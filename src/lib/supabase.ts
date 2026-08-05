import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquantes. Vérifie ton fichier .env.local.');
}

// Client public (respecte le RLS) — utilisé pour les pages publiques et l'auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin (bypass le RLS) — utilisé UNIQUEMENT dans les pages admin
// Ne jamais exposer cette clé côté public
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : supabase; // fallback sur le client normal si la clé n'est pas définie
