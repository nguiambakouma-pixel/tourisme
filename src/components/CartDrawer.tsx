import { useState } from 'react';
import { ShoppingBag, X, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/lib/ToastContext';
import { supabase } from '@/lib/supabase';
import { CheckoutChoiceModal } from '@/components/CheckoutChoiceModal';
import { PaymentModal } from '@/components/PaymentModal';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, clear, total, editingReservationId, stopEditing } = useCart();
  const { session, isCustomer, openAuthModal } = useAuth();
  const { success, error: toastError } = useToast();

  const [showChoiceModal, setShowChoiceModal]       = useState(false);
  const [localError, setLocalError]                 = useState<string | null>(null);
  const [saving, setSaving]                         = useState(false);
  const [paymentReservationId, setPaymentReservationId] = useState<number | null>(null);

  /* ──────────────────────────────────────────────── */
  /*  Helpers                                         */
  /* ──────────────────────────────────────────────── */

  const formatPrice = (price: string) => `${price} FCFA`;

  const sendWhatsAppMessage = () => {
    const lines = items.map((item) => `- ${item.title} (${item.price} FCFA)`);
    const totalFormatted = total.toLocaleString('fr-FR');
    const message = [
      'Bonjour StayEatSee+, je souhaite réserver :',
      '',
      ...lines,
      '',
      `Total : ${totalFormatted} FCFA`,
      'Merci de me confirmer la disponibilité.',
    ].join('\n');
    window.open(`https://wa.me/237688150361?text=${encodeURIComponent(message)}`, '_blank');
    clear(true);
    closeCart();
  };

  /* ──────────────────────────────────────────────── */
  /*  Checkout — inserts reservation then opens modal */
  /* ──────────────────────────────────────────────── */

  const handleCheckoutWithPayment = async () => {
    const { data: { session: freshSession } } = await supabase.auth.getSession();
    if (!freshSession) return;

    const { data: inserted, error } = await supabase
      .from('reservations')
      .insert({ user_id: freshSession.user.id, items, total })
      .select('id')
      .single();

    if (error || !inserted) {
      console.error('Erreur lors de l\'enregistrement de la réservation :', error);
      toastError('Impossible d\'enregistrer la réservation. Réessayez.');
      return;
    }

    setPaymentReservationId(inserted.id as number);
  };

  /* ──────────────────────────────────────────────── */
  /*  Checkout — WhatsApp only (behaviour unchanged)  */
  /* ──────────────────────────────────────────────── */

  const handleCheckoutWhatsApp = async () => {
    const { data: { session: freshSession } } = await supabase.auth.getSession();

    if (freshSession && session && isCustomer) {
      const { error } = await supabase
        .from('reservations')
        .insert({ user_id: freshSession.user.id, items, total });

      if (error) {
        console.error('Erreur lors de l\'enregistrement de la réservation :', error);
        toastError('Impossible d\'enregistrer la réservation. Réessayez.');
        return;
      }
      success('Réservation enregistrée ! Ouverture de WhatsApp…');
    }

    sendWhatsAppMessage();
  };

  /* ──────────────────────────────────────────────── */
  /*  Button handlers with auth guard                 */
  /* ──────────────────────────────────────────────── */

  const handlePaymentButton = () => {
    if (!session || !isCustomer) {
      setShowChoiceModal(true);
      return;
    }
    void handleCheckoutWithPayment();
  };

  const handleWhatsAppButton = () => {
    if (!session || !isCustomer) {
      setShowChoiceModal(true);
      return;
    }
    void handleCheckoutWhatsApp();
  };

  /* ──────────────────────────────────────────────── */
  /*  Edit mode save                                  */
  /* ──────────────────────────────────────────────── */

  const handleSaveEdit = async () => {
    if (editingReservationId === null) return;
    setLocalError(null);
    setSaving(true);

    const { error } = await supabase
      .from('reservations')
      .update({ items, total })
      .eq('id', editingReservationId);

    if (error) {
      console.error('Erreur mise à jour réservation :', error);
      const msg = 'Impossible de sauvegarder les modifications. Réessayez.';
      setLocalError(msg);
      toastError(msg);
      setSaving(false);
      return;
    }

    const lines = items.map((item) => `- ${item.title} (${item.price} FCFA)`);
    const totalFormatted = total.toLocaleString('fr-FR');
    const message = [
      `Bonjour StayEatSee+, j'ai modifié ma réservation en attente (ID : ${editingReservationId}) :`,
      '',
      ...lines,
      '',
      `Nouveau total : ${totalFormatted} FCFA`,
      'Merci de prendre en compte ces changements.',
    ].join('\n');
    window.open(`https://wa.me/237688150361?text=${encodeURIComponent(message)}`, '_blank');

    success('Modifications enregistrées ! Ouverture de WhatsApp…');
    setSaving(false);
    stopEditing();
    clear(true);
    closeCart();
  };

  /* ──────────────────────────────────────────────── */
  /*  Render                                          */
  /* ──────────────────────────────────────────────── */

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Auth choice modal (guest vs login) */}
      <CheckoutChoiceModal
        isOpen={showChoiceModal}
        onClose={() => setShowChoiceModal(false)}
        onGuestContinue={() => {
          setShowChoiceModal(false);
          sendWhatsAppMessage();
        }}
        onLoginClick={() => {
          setShowChoiceModal(false);
          closeCart();
          openAuthModal(() => {
            void handleCheckoutWhatsApp();
          });
        }}
      />

      {/* Payment modal — only for session + isCustomer */}
      <PaymentModal
        isOpen={paymentReservationId !== null}
        reservationId={paymentReservationId ?? 0}
        amount={total}
        onClose={() => setPaymentReservationId(null)}
        onSuccess={() => {
          clear(true);
          closeCart();
          success('Réservation payée et confirmée !');
        }}
      />

      {/* Sliding panel */}
      <div
        className={`fixed right-0 top-0 z-[70] h-full w-full sm:w-96 bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Panneau du panier"
        role="dialog"
        aria-modal={isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-brand">Votre panier</h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 px-5">
            <ShoppingBag className="w-16 h-16 mb-4" />
            <p className="text-base font-medium">Votre panier est vide</p>
          </div>
        ) : (
          <>
            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-accent font-medium mt-0.5">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/70"
                    aria-label={`Retirer ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="shrink-0 border-t border-gray-100 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total</span>
                <span className="text-lg font-bold text-brand">
                  {formatPrice(String(total))}
                </span>
              </div>

              {/* ── Edit mode ── */}
              {editingReservationId !== null ? (
                <>
                  {localError && (
                    <p className="text-xs text-red-500 text-center">{localError}</p>
                  )}
                  <button
                    onClick={() => { stopEditing(); clear(); }}
                    className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
                  >
                    Annuler l'édition
                  </button>
                  <button
                    onClick={() => void handleSaveEdit()}
                    disabled={saving}
                    className="btn-shimmer w-full text-white px-6 py-3 rounded-full text-sm font-semibold disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
                  >
                    {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
                  </button>
                </>
              ) : (
                /* ── Normal mode ── */
                <>
                  {/* Mobile Money — only for authenticated customers */}
                  {session && isCustomer && (
                    <button
                      onClick={handlePaymentButton}
                      className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-ocean bg-white px-6 py-3 text-sm font-semibold text-ocean transition hover:bg-ocean hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/40"
                    >
                      <CreditCard className="h-4 w-4" />
                      Payer maintenant (test Mobile Money)
                    </button>
                  )}

                  {/* WhatsApp — always visible, behaviour unchanged */}
                  <button
                    onClick={handleWhatsAppButton}
                    className="btn-shimmer w-full text-white px-6 py-3 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
                  >
                    Commander via WhatsApp
                  </button>

                  <button
                    onClick={() => clear()}
                    className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70 rounded-lg py-1"
                  >
                    Vider le panier
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}