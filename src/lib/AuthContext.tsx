import { createContext, useContext, useEffect, useState, useMemo, useCallback, ReactNode, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  role: string;
  full_name: string | null;
}

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  roleLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  triggerAuthSuccess: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const authSuccessCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const fetchProfile = async (currentSession: Session | null) => {
      if (!currentSession) {
        setProfile(null);
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, full_name')
        .eq('id', currentSession.user.id)
        .single();

      if (error) {
        setProfile(null);
        setRoleLoading(false);
        return;
      }

      setProfile((data as Profile | null) ?? null);
      setRoleLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      void fetchProfile(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      void fetchProfile(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const openAuthModal = useCallback((onSuccess?: () => void) => {
    authSuccessCallbackRef.current = onSuccess ?? null;
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    authSuccessCallbackRef.current = null;
  }, []);

  const triggerAuthSuccess = useCallback(() => {
    const onSuccess = authSuccessCallbackRef.current;
    authSuccessCallbackRef.current = null;
    onSuccess?.();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    loading,
    profile,
    roleLoading,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    triggerAuthSuccess,
    signIn,
    signOut,
  }), [session, loading, profile, roleLoading, isAuthModalOpen, openAuthModal, closeAuthModal, triggerAuthSuccess, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}