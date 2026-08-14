import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { reservationId, phone: rawPhone, operator } = await req.json();

    if (!reservationId || !rawPhone || !operator) {
      return new Response(
        JSON.stringify({ error: "Paramètres manquants : reservationId, phone, operator requis." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ── Normalisation du numéro de téléphone ── */
    // Retire espaces, tirets, et le préfixe « + » s'il existe
    let phone = String(rawPhone).replace(/[\s\-+]/g, "");
    // Si 9 chiffres sans indicatif, préfixe avec 237 (Cameroun)
    if (/^\d{9}$/.test(phone)) phone = "237" + phone;
    // Validation finale : exactement 12 chiffres commençant par 237
    if (!/^237\d{9}$/.test(phone)) {
      return new Response(
        JSON.stringify({ error: "Numéro invalide. Utilisez le format 237XXXXXXXXX (ex: 237689543892)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service_role: bypass RLS, jamais côté client
    );

    const { data: reservation, error: resErr } = await supabase
      .from("reservations")
      .select("id, total, user_id")
      .eq("id", reservationId)
      .single();

    if (resErr || !reservation) {
      return new Response(
        JSON.stringify({ error: "Réservation introuvable" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const base = Deno.env.get("CAMPAY_BASE_URL")!;
    const username = Deno.env.get("CAMPAY_APP_USERNAME");
    const password = Deno.env.get("CAMPAY_APP_PASSWORD");

    if (!base || !username || !password) {
      return new Response(
        JSON.stringify({ error: "Variables d'environnement CamPay manquantes côté serveur." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Auth CamPay
    const tokenRes = await fetch(`${base}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!tokenRes.ok) {
      const tokenErr = await tokenRes.text();
      return new Response(
        JSON.stringify({ error: `Échec auth CamPay (token) : ${tokenErr}` }),
        { status: tokenRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenData = await tokenRes.json();
    const token = tokenData.token;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Aucun token reçu de CamPay.", campay_response: tokenData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const externalRef = `SES-${reservation.id}-${Date.now()}`;

    // 2. Demande de collecte
    const collectRes = await fetch(`${base}/collect/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        amount: String(reservation.total),
        currency: "XAF",
        from: phone,             // format 2376xxxxxxxx
        description: `Reservation StayEatSee+ #${reservation.id}`,
        external_reference: externalRef,
      }),
    });

    if (!collectRes.ok) {
      const collectErr = await collectRes.text();
      return new Response(
        JSON.stringify({ error: `Échec collect CamPay : ${collectErr}` }),
        { status: collectRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const collectData = await collectRes.json();

    await supabase.from("payments").insert({
      reservation_id: reservation.id,
      amount: reservation.total,
      operator,
      phone,
      campay_reference: externalRef,
      campay_ref: collectData.reference ?? null,
      status: "pending",
      raw_response: collectData,
    });

    await supabase
      .from("reservations")
      .update({
        payment_status: "pending",
        payment_method: "mobile_money",
        payment_operator: operator,
        payment_phone: phone,
        campay_reference: externalRef,
      })
      .eq("id", reservation.id);

    return new Response(
      JSON.stringify({ ok: true, reference: externalRef, campayRef: collectData.reference ?? null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: `Erreur inattendue : ${message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});