import { useState } from 'react';
import { ShoppingBag, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { CheckoutChoiceModal } from '@/components/CheckoutChoiceModal';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, clear, total } = useCart();
  const navigate = useNavigate();
  const { session, openAuthModal } = useAuth();
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const formatPrice = (price: string) => `${price} FCFA`;

  const sendWhatsAppMessage = () => {
    const lines = items.map(
      (item) => `- ${item.title} (${item.price} FCFA)`
    );
    const totalFormatted = total.toLocaleString('fr-FR');
    const message = [
      'Bonjour StayEatSee+, je souhaite réserver :',
      '',
      ...lines,
      '',
      `Total : ${totalFormatted} FCFA`,
      'Merci de me confirmer la disponibilité.',
    ].join('\n');
    const url = `https://wa.me/237688150361?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    clear();
    closeCart();
  };

  const handleCheckout = async () => {
    if (session) {
      try {
        await supabase.from('reservations').insert({
          user_id: session.user.id,
          items: items,
          total: total,
        });
      } catch (error) {
        console.error('Erreur lors de l’enregistrement de la réservation :', error);
      }
    }

    sendWhatsAppMessage();
  };

  const handleCheckoutButton = () => {
    if (!session) {
      setShowChoiceModal(true);
      return;
    }

    void handleCheckout();
  };

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
            void handleCheckout();
          });
        }}
      />

      {/* Panel */}
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
              <button
                onClick={handleCheckoutButton}
                className="btn-shimmer w-full text-white px-6 py-3 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70"
              >
                Commander via WhatsApp
              </button>
              <button
                onClick={clear}
                className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light/70 rounded-lg py-1"
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}