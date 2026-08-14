import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { inputCls, selectCls } from '@/components/admin/AdminUI';

type Operator = 'MTN' | 'ORANGE';

/**
 * Normalise un numéro de téléphone camerounais :
 *  - retire espaces, tirets, « + »
 *  - si 9 chiffres sans indicatif → préfixe 237
 *  - retourne null si le résultat n’est pas 237 + 9 chiffres
 */
function normalizePhone(raw: string): string | null {
  let n = raw.replace(/[\s\-+]/g, '');
  if (/^\d{9}$/.test(n)) n = '237' + n;
  return /^237\d{9}$/.test(n) ? n : null;
}

export function TestCampayPage() {
  const [amount, setAmount] = useState(100);
  const [operator, setOperator] = useState<Operator>('MTN');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    /* ── Normalisation côté client ── */
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      setError('Numéro invalide. Utilisez le format 237XXXXXXXXX ou tapez 9 chiffres (689543892).');
      setLoading(false);
      return;
    }

    try {
      const { data, error: fnErr } = await supabase.functions.invoke('campay-test', {
        body: { amount, phone: normalizedPhone, operator },
      });

      if (fnErr) {
        setError(fnErr.message ?? 'Erreur lors de l\'appel à la fonction.');
        setLoading(false);
        return;
      }

      setResult(data as object);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Page header (inline, no action button) ── */}
      <div className="mb-7">
        <h1 className="text-xl sm:text-2xl font-bold text-brand leading-tight">
          Test CamPay
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Page de test isolée — aucune écriture en base. Valide l'intégration CamPay en
          direct.
        </p>
      </div>

      <div className="max-w-lg">
        {/* Error banner */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            {/* Amount */}
            <div>
              <label
                htmlFor="test-amount"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Montant (XAF)
              </label>
              <input
                id="test-amount"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className={inputCls}
              />
            </div>

            {/* Operator */}
            <div>
              <label
                htmlFor="test-operator"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Opérateur
              </label>
              <select
                id="test-operator"
                value={operator}
                onChange={(e) => setOperator(e.target.value as Operator)}
                className={selectCls}
              >
                <option value="MTN">MTN Mobile Money</option>
                <option value="ORANGE">Orange Money</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="test-phone"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Numéro de téléphone
              </label>
              <input
                id="test-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="689543892 ou 237689543892"
                maxLength={15}
                required
                className={inputCls}
              />
              <p className="mt-1 text-xs text-slate-400">
                9 chiffres (ex : <code>689543892</code>) ou 12 avec indicatif
                (<code>237689543892</code>).
                {phone && normalizePhone(phone) && (
                  <span className="ml-1 font-semibold text-sky">
                    → sera envoyé comme : {normalizePhone(phone)}
                  </span>
                )}
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky text-white flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Paiement en cours…
                </>
              ) : (
                'Lancer le paiement test'
              )}
            </button>
          </form>
        </div>

        {/* Raw response */}
        {result !== null && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Réponse brute CamPay :
            </p>
            <pre className="bg-slate-50 rounded-xl p-4 text-xs overflow-auto border border-slate-200 text-slate-700 leading-relaxed max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
