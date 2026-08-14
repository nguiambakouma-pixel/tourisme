import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  /* ── CORS preflight ── */
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, phone: rawPhone, operator } = await req.json();

    if (!amount || !rawPhone || !operator) {
      return new Response(
        JSON.stringify({ error: "Paramètres manquants : amount, phone, operator requis." }),
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

    const base = Deno.env.get("CAMPAY_BASE_URL");
    const username = Deno.env.get("CAMPAY_APP_USERNAME");
    const password = Deno.env.get("CAMPAY_APP_PASSWORD");

    if (!base || !username || !password) {
      return new Response(
        JSON.stringify({ error: "Variables d'environnement CamPay manquantes côté serveur." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ── 1. Obtenir le token CamPay ── */
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

    /* ── 2. Lancer la collecte ── */
    const externalReference = `TEST-${Date.now()}`;

    const collectRes = await fetch(`${base}/collect/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        amount: String(amount),
        currency: "XAF",
        from: phone, // numéro normalisé 237XXXXXXXXX
        description: "Test StayEatSee+",
        external_reference: externalReference,
      }),
    });

    const collectData = await collectRes.json();

    /* Retourner le JSON brut + le statut HTTP de CamPay */
    return new Response(
      JSON.stringify({
        campay_status: collectRes.status,
        external_reference: externalReference,
        ...collectData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: `Erreur inattendue : ${message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
