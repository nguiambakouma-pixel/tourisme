import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export function CustomerProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, profile, roleLoading } = useAuth();

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-light">
        <Loader2 className="w-8 h-8 text-ocean animate-spin" />
      </div>
    );
  }

  if (!session || profile?.role !== 'customer') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
