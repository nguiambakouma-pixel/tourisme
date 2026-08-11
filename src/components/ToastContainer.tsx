import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToast, type ToastType } from '@/lib/ToastContext';

const styles: Record<ToastType, { wrap: string; icon: string; Icon: typeof CheckCircle2 }> = {
  success: {
    wrap: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: 'text-emerald-500',
    Icon: CheckCircle2,
  },
  error: {
    wrap: 'border-red-200 bg-red-50 text-red-900',
    icon: 'text-red-500',
    Icon: XCircle,
  },
  info: {
    wrap: 'border-sky-200 bg-sky-50 text-sky-900',
    icon: 'text-sky-500',
    Icon: Info,
  },
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-4 z-[300] flex w-[min(100vw-2rem,380px)] flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const { wrap, icon, Icon } = styles[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg animate-[fadeInUp_0.35s_ease] ${wrap}`}
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${icon}`} aria-hidden="true" />
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded-lg p-1 opacity-60 transition hover:opacity-100"
              aria-label="Fermer la notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
