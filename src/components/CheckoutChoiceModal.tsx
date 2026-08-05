type CheckoutChoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onGuestContinue: () => void;
  onLoginClick: () => void;
};

export function CheckoutChoiceModal({
  isOpen,
  onClose,
  onGuestContinue,
  onLoginClick,
}: CheckoutChoiceModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Fermer la modale"
        >
          <span className="text-xl leading-none">×</span>
        </button>

        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ocean">Réservation</p>
          <h2 className="mt-3 text-2xl font-semibold text-navy">
            Comment souhaitez-vous continuer ?
          </h2>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onGuestContinue}
            className="w-full rounded-full border border-sand bg-white px-5 py-3 text-sm font-semibold text-navy transition hover:border-ocean hover:text-ocean"
          >
            Continuer en invité
          </button>

          <button
            type="button"
            onClick={onLoginClick}
            className="btn-shimmer w-full rounded-full px-5 py-3 text-sm font-semibold text-white"
          >
            Se connecter / Créer un compte
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-600">
          Créez un compte pour retrouver vos réservations et suivre leur statut.
        </p>
      </div>
    </div>
  );
}
