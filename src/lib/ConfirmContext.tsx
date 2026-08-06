import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';

/* ── Types ─────────────────────────────────────────────────────────── */

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export interface AlertOptions {
  title?: string;
  message: string;
}

/** Internal state stored while a dialog is pending */
interface PendingDialog {
  mode: 'confirm' | 'alert';
  title?: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger: boolean;
}

interface ConfirmContextValue {
  confirm(options: ConfirmOptions): Promise<boolean>;
  alertUser(options: AlertOptions): Promise<void>;
  /** Internal – consumed by ConfirmModal only */
  _pending: PendingDialog | null;
  _resolve: (value: boolean) => void;
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

/* ── Provider ───────────────────────────────────────────────────────── */

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingDialog | null>(null);
  const resolveRef = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setPending({
        mode: 'confirm',
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel ?? 'Confirmer',
        cancelLabel: options.cancelLabel ?? 'Annuler',
        danger: options.danger ?? false,
      });
    });
  }, []);

  const alertUser = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise<void>((resolve) => {
      // We reuse the boolean resolver; alert always resolves void on close
      resolveRef.current = () => resolve();
      setPending({
        mode: 'alert',
        title: options.title,
        message: options.message,
        confirmLabel: 'OK',
        cancelLabel: '',
        danger: false,
      });
    });
  }, []);

  const handleResolve = useCallback((value: boolean) => {
    resolveRef.current?.(value);
    resolveRef.current = null;
    setPending(null);
  }, []);

  return (
    <ConfirmContext.Provider
      value={{
        confirm,
        alertUser,
        _pending: pending,
        _resolve: handleResolve,
      }}
    >
      {children}
    </ConfirmContext.Provider>
  );
}

/* ── Hook ───────────────────────────────────────────────────────────── */

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm doit être utilisé dans un ConfirmProvider');
  return { confirm: ctx.confirm, alertUser: ctx.alertUser };
}

/** Internal hook for ConfirmModal only */
export function _useConfirmInternal() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('_useConfirmInternal doit être utilisé dans un ConfirmProvider');
  return { pending: ctx._pending, resolve: ctx._resolve };
}
