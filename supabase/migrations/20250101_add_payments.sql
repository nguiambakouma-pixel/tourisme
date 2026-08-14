-- 1. On ajoute le suivi paiement directement sur reservations
ALTER TABLE public.reservations
  ADD COLUMN payment_status   text NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status = ANY (ARRAY['unpaid','pending','paid','failed'])),
  ADD COLUMN payment_method   text,                 -- 'whatsapp' | 'mobile_money' | 'card'
  ADD COLUMN payment_operator text,                 -- 'MTN' | 'ORANGE'
  ADD COLUMN payment_phone    text,
  ADD COLUMN campay_reference text,                 -- notre external_reference
  ADD COLUMN campay_ref       text,                 -- la "reference" renvoyée par CamPay
  ADD COLUMN paid_at          timestamp with time zone;

-- 2. Table de log des transactions (utile pour debug/tests, sans polluer reservations)
CREATE TABLE public.payments (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  reservation_id bigint NOT NULL REFERENCES public.reservations(id),
  amount numeric NOT NULL,
  operator text NOT NULL,
  phone text NOT NULL,
  campay_reference text,          -- external_reference qu'on envoie
  campay_ref text,                -- "reference" renvoyée par Campay
  status text NOT NULL DEFAULT 'pending', -- pending/successful/failed
  raw_response jsonb,
  raw_webhook jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id)
);

-- 3. RLS : le client ne doit lire QUE ses propres paiements
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user reads own payments"
  ON public.payments FOR SELECT
  USING (
    reservation_id IN (SELECT id FROM public.reservations WHERE user_id = auth.uid())
  );
-- Pas de policy INSERT/UPDATE pour les clients : seule l'Edge Function (service_role) écrit ici.