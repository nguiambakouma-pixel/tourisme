import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const rawBody = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  // LOG TEMPORAIRE : on veut voir exactement ce que CamPay envoie
  console.log("Webhook headers:", JSON.stringify(headers));
  console.log("Webhook body:", rawBody);

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const externalRef = payload.external_reference;
  if (!externalRef) {
    return new Response("Missing external_reference", { status: 400 });
  }

  const status = payload.status === "SUCCESSFUL" ? "paid"
               : payload.status === "FAILED"     ? "failed"
               : "pending";

  await supabase
    .from("payments")
    .update({ status: payload.status, raw_webhook: payload, updated_at: new Date().toISOString() })
    .eq("campay_reference", externalRef);

  const { data: reservation } = await supabase
    .from("reservations")
    .select("id")
    .eq("campay_reference", externalRef)
    .single();

  if (reservation) {
    await supabase
      .from("reservations")
      .update({
        payment_status: status,
        paid_at: status === "paid" ? new Date().toISOString() : null,
        status: status === "paid" ? "confirmed" : "pending",
      })
      .eq("id", reservation.id);
  }

  return new Response("OK", { status: 200 });
});
