import { useEffect, useRef } from 'react';
import { _useConfirmInternal } from '@/lib/ConfirmContext';
import { AlertTriangle, Info, X } from 'lucide-react';

export function ConfirmModal() {
  const { pending, resolve } = _useConfirmInternal();
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  /* Auto-focus the primary button when dialog opens */
  useEffect(() => {
    if (pending) {
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
    }
  }, [pending]);

  /* Close on Escape */
  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resolve(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [pending, resolve]);

  if (!pending) return null;

  const isDanger = pending.danger;
  const isAlert = pending.mode === 'alert';

  const confirmBtnClass = isDanger
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-sky hover:bg-sky-light text-white';

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
        onClick={() => resolve(false)}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={pending.title ? 'confirm-title' : undefined}
        aria-describedby="confirm-message"
        className="fixed inset-0 z-[201] flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 p-6 sm:p-7 animate-[fadeInScale_0.18s_ease-out]">
          {/* Close button */}
          <button
            onClick={() => resolve(false)}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon + Title */}
          <div className="flex items-start gap-3 mb-4">
            <div
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                isDanger ? 'bg-red-50' : 'bg-sky-pale'
              }`}
            >
              {isDanger ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <Info className="w-5 h-5 text-sky" />
              )}
            </div>

            <div className="min-w-0">
              {pending.title && (
                <h2
                  id="confirm-title"
                  className="text-base font-bold text-brand leading-snug"
                >
                  {pending.title}
                </h2>
              )}
              <p
                id="confirm-message"
                className={`text-sm text-slate-600 leading-relaxed ${pending.title ? 'mt-1' : 'mt-0.5'}`}
              >
                {pending.message}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className={`flex gap-3 ${isAlert ? 'justify-end' : 'justify-end flex-row-reverse sm:flex-row'}`}>
            {!isAlert && (
              <button
                onClick={() => resolve(false)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                {pending.cancelLabel}
              </button>
            )}
            <button
              ref={confirmBtnRef}
              onClick={() => resolve(true)}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${confirmBtnClass}`}
            >
              {pending.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
