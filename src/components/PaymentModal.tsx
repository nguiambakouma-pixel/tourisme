import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/* ─────────────────────────────────────────────────────────────────────── */
/*  Types                                                                  */
/* ─────────────────────────────────────────────────────────────────────── */

type Operator = 'MTN' | 'ORANGE';
type Screen = 'form' | 'pending' | 'success' | 'failed';

interface CampayInitiateData {
  ok?: boolean;
  reference?: string;   // notre external_reference SES-xxx
  campayRef?: string;   // la "reference" CamPay à passer à check-status
  ussd_code?: string;   // présent pour Orange
  error?: string;
}

interface CampayStatusData {
  status?: string;      // 'SUCCESSFUL' | 'FAILED' | 'PENDING' | ...
  reason?: string;
  [key: string]: unknown;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: number;
  amount: number;
  onSuccess: () => void;
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Phone normalisation (identique aux edge functions)                     */
/* ─────────────────────────────────────────────────────────────────────── */

function normalizePhone(raw: string): string | null {
  let n = raw.replace(/[\s\-+]/g, '');
  if (/^\d{9}$/.test(n)) n = '237' + n;
  return /^237\d{9}$/.test(n) ? n : null;
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  Component                                                              */
/* ─────────────────────────────────────────────────────────────────────── */

const POLL_INTERVAL_MS = 4_000;
const POLL_TIMEOUT_MS  = 90_000;

export function PaymentModal({
  isOpen,
  onClose,
  reservationId,
  amount,
  onSuccess,
}: PaymentModalProps) {
  /* ── form state ── */
  const [operator, setOperator] = useState<Operator>('MTN');
  const [phone,    setPhone]    = useState('');
  const [screen,   setScreen]   = useState<Screen>('form');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* ── pending / polling state ── */
  const [campayRef,  setCampayRef]  = useState<string | null>(null);
  const [ussdCode,   setUssdCode]   = useState<string | null>(null);
  const [failReason, setFailReason] = useState<string | null>(null);

  /* ── refs for cleanup ── */
  const intervalRef    = useRef<ReturnType<typeof setInterval>  | null>(null);
  const timeoutRef     = useRef<ReturnType<typeof setTimeout>   | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout>  | null>(null);

  /* ── helpers ── */
  const stopPolling = useCallback(() => {
    if (intervalRef.current)  { clearInterval(intervalRef.current);  intervalRef.current  = null; }
    if (timeoutRef.current)   { clearTimeout(timeoutRef.current);    timeoutRef.current   = null; }
  }, []);

  /* reset every time the modal opens */
  useEffect(() => {
    if (isOpen) {
      setOperator('MTN');
      setPhone('');
      setScreen('form');
      setErrorMsg(null);
      setSubmitting(false);
      setCampayRef(null);
      setUssdCode(null);
      setFailReason(null);
    }
    return () => {
      stopPolling();
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, [isOpen, stopPolling]);

  /* ── polling logic ── */
  const startPolling = useCallback((ref: string) => {
    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke<CampayStatusData>(
          'campay-check-status',
          { body: { reference: ref } }
        );

        if (error || !data) return; // keep polling on network error

        if (data.status === 'SUCCESSFUL') {
          stopPolling();
          setScreen('success');
          onSuccess();
          successTimerRef.current = setTimeout(onClose, 3_000);
        } else if (data.status === 'FAILED') {
          stopPolling();
          setFailReason(data.reason ?? null);
          setScreen('failed');
        }
        // PENDING / other → keep polling
      } catch {
        // network error — keep polling
      }
    };

    intervalRef.current = setInterval(() => { void poll(); }, POLL_INTERVAL_MS);

    // global timeout
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setFailReason("Délai dépassé. Votre paiement n'a pas été confirmé à temps. Réessayez.");
      setScreen('failed');
    }, POLL_TIMEOUT_MS);

    // fire immediately
    void poll();
  }, [onClose, onSuccess, stopPolling]);

  /* ── pay handler ── */
  const handlePay = async () => {
    setErrorMsg(null);

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      setErrorMsg('Numéro invalide. Tapez 9 chiffres (6XXXXXXXX) ou 12 avec indicatif (2376XXXXXXXX).');
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke<CampayInitiateData>(
        'campay-initiate',
        { body: { reservationId, phone: normalizedPhone, operator } }
      );

      if (error || !data) {
        setErrorMsg(error?.message ?? 'Erreur lors du lancement du paiement. Réessayez.');
        setSubmitting(false);
        return;
      }

      if (data.error) {
        setErrorMsg(data.error);
        setSubmitting(false);
        return;
      }

      /* success → switch to pending */
      setCampayRef(data.campayRef ?? null);
      setUssdCode(data.ussd_code ?? null);
      setScreen('pending');
      setSubmitting(false);

      if (data.campayRef) {
        startPolling(data.campayRef);
      }
    } catch {
      setErrorMsg('Erreur réseau. Vérifiez votre connexion et réessayez.');
      setSubmitting(false);
    }
  };

  /* ── retry ── */
  const handleRetry = () => {
    stopPolling();
    setCampayRef(null);
    setUssdCode(null);
    setFailReason(null);
    setErrorMsg(null);
    setScreen('form');
  };

  if (!isOpen) return null;

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

        {/* ── Close button (hidden during pending to avoid accidental dismiss) ── */}
        {screen !== 'pending' && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fermer"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/*  FORM                                          */}
        {/* ══════════════════════════════════════════════ */}
        {screen === 'form' && (
          <>
            {/* Header */}
            <div className="mb-6 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-ocean">
                Paiement Mobile Money
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-navy">
                Payer {amount.toLocaleString('fr-FR')} FCFA
              </h2>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {errorMsg}
              </div>
            )}

            {/* Operator toggle */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Opérateur
              </p>
              <div className="flex gap-3">
                {(['MTN', 'ORANGE'] as Operator[]).map((op) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setOperator(op)}
                    className={`flex-1 rounded-2xl py-3 text-sm font-bold transition-all duration-150 ${
                      operator === op
                        ? 'btn-shimmer text-white shadow-sm'
                        : 'border border-sand bg-white text-navy hover:border-ocean hover:text-ocean'
                    }`}
                  >
                    {op === 'MTN' ? '🟡 MTN MoMo' : '🟠 Orange Money'}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone input */}
            <div className="mb-6">
              <label
                htmlFor="payment-phone"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Numéro de téléphone
              </label>
              <input
                id="payment-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="237 6XX XXX XXX"
                maxLength={15}
                disabled={submitting}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                9 chiffres (6XXXXXXXX) ou 12 avec indicatif (2376XXXXXXXX).
                {phone && normalizePhone(phone) && (
                  <span className="ml-1 font-semibold text-ocean">
                    → {normalizePhone(phone)}
                  </span>
                )}
              </p>
            </div>

            {/* Pay button */}
            <button
              type="button"
              onClick={() => void handlePay()}
              disabled={submitting}
              className="btn-shimmer w-full rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Lancement…</>
              ) : (
                `Payer ${amount.toLocaleString('fr-FR')} FCFA`
              )}
            </button>
          </>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/*  PENDING                                       */}
        {/* ══════════════════════════════════════════════ */}
        {screen === 'pending' && (
          <div className="flex flex-col items-center py-2 text-center">
            {/* Spinner */}
            <div className="relative mb-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-ocean/20">
                <Loader2 className="h-10 w-10 animate-spin text-ocean" />
              </div>
              <span className="absolute -bottom-1 -right-1 text-2xl">
                {operator === 'MTN' ? '🟡' : '🟠'}
              </span>
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-ocean">
              En cours
            </p>
            <h2 className="mt-2 text-xl font-semibold text-navy">
              En attente de confirmation
            </h2>

            {operator === 'MTN' && (
              <p className="mt-3 max-w-xs text-sm text-slate-500">
                Vérifiez votre téléphone MTN MoMo et validez avec votre{' '}
                <span className="font-semibold text-navy">code secret</span>.
              </p>
            )}

            {operator === 'ORANGE' && ussdCode && (
              <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
                  Composez ce code sur votre téléphone
                </p>
                <p className="text-xl font-bold text-navy tracking-widest">{ussdCode}</p>
              </div>
            )}

            {operator === 'ORANGE' && !ussdCode && (
              <p className="mt-3 max-w-xs text-sm text-slate-500">
                Suivez les instructions Orange Money sur votre téléphone pour valider le paiement.
              </p>
            )}

            <p className="mt-5 text-xs text-slate-400">
              Cette fenêtre se met à jour automatiquement…
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Timeout dans ~90 secondes
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/*  SUCCESS                                       */}
        {/* ══════════════════════════════════════════════ */}
        {screen === 'success' && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
              Confirmé
            </p>
            <h2 className="mt-2 text-xl font-semibold text-navy">
              Paiement confirmé !
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Votre réservation est validée. Fermeture dans 3 secondes…
            </p>
            <Loader2 className="mt-5 h-5 w-5 animate-spin text-slate-300" />
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/*  FAILED                                        */}
        {/* ══════════════════════════════════════════════ */}
        {screen === 'failed' && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-500">
              Échec
            </p>
            <h2 className="mt-2 text-xl font-semibold text-navy">
              Le paiement n'a pas abouti
            </h2>
            {failReason && (
              <p className="mt-2 text-sm text-slate-500">{failReason}</p>
            )}
            <div className="mt-6 flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="btn-shimmer w-full rounded-full px-5 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full border border-sand px-5 py-3 text-sm font-semibold text-navy transition hover:border-ocean hover:text-ocean"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
