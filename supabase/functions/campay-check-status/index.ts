import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { reference } = await req.json(); // la "reference" CamPay, pas notre external_reference
  if (!reference) {
    return new Response(
      JSON.stringify({ error: "reference manquante" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const base = Deno.env.get("CAMPAY_BASE_URL")!;

  const tokenRes = await fetch(`${base}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: Deno.env.get("CAMPAY_APP_USERNAME"),
      password: Deno.env.get("CAMPAY_APP_PASSWORD"),
    }),
  });
  const { token } = await tokenRes.json();

  const statusRes = await fetch(`${base}/transaction/${reference}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  const statusData = await statusRes.json();

  if (statusData.status === "SUCCESSFUL" || statusData.status === "FAILED") {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const paymentStatus = statusData.status === "SUCCESSFUL" ? "paid" : "failed";

    await supabase.from("payments")
      .update({ status: statusData.status, raw_response: statusData, updated_at: new Date().toISOString() })
      .eq("campay_ref", reference);

    await supabase.from("reservations")
      .update({
        payment_status: paymentStatus,
        paid_at: paymentStatus === "paid" ? new Date().toISOString() : null,
        status: paymentStatus === "paid" ? "confirmed" : "pending",
      })
      .eq("campay_ref", reference);
  }

  return new Response(
    JSON.stringify(statusData),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
