import { ReactNode } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';

/* ── Page Header ──────────────────────────────────────────────── */
interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  onAdd: () => void;
  addLabel: string;
  accentClass?: string;
}

export function AdminPageHeader({ title, subtitle, onAdd, addLabel, accentClass = 'bg-sky' }: AdminPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-7">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand leading-tight">{title}</h1>
        <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
      </div>
      <button
        onClick={onAdd}
        className={`${accentClass} text-white flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 hover:-translate-y-0.5 shadow-lg transition-all duration-200 shrink-0`}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">{addLabel}</span>
        <span className="sm:hidden">Ajouter</span>
      </button>
    </div>
  );
}

/* ── Modal wrapper ────────────────────────────────────────────── */
interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  uploading?: boolean;
  editMode: boolean;
  error: string | null;
  accentClass?: string;
}

export function AdminModal({
  open, onClose, title, children, onSubmit,
  submitting, uploading = false, editMode, error,
  accentClass = 'bg-sky',
}: AdminModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-3xl">
          <h2 className="text-lg font-bold text-brand">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
          {children}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 font-medium">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className={`flex-1 ${accentClass} text-white px-4 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {editMode ? 'Enregistrement…' : 'Ajout…'}</>
              ) : (
                editMode ? 'Enregistrer' : 'Ajouter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Form field helpers ───────────────────────────────────────── */
export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/40 focus:border-sky bg-white transition-all';
export const selectCls = `${inputCls}`;
