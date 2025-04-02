
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const CHAPA_SECRET_KEY = Deno.env.get("CHAPA_SECRET_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const body = await req.json();
    const { tx_ref, order_id } = body;

    if (!tx_ref && !order_id) {
      return new Response(
        JSON.stringify({ error: "Missing transaction reference or order ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get order details
    let orderQuery = supabase.from("orders").select("*, ticket:tickets(*)");
    
    if (order_id) {
      orderQuery = orderQuery.eq("id", order_id);
    } else if (tx_ref) {
      orderQuery = orderQuery.eq("payment_reference", tx_ref);
    }

    const { data: orderData, error: orderError } = await orderQuery.single();

    if (orderError || !orderData) {
      console.error("Order fetch error:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If order is already completed, return success
    if (orderData.payment_status === "completed") {
      return new Response(
        JSON.stringify({ success: true, order: orderData }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check with Chapa API to verify payment status
    const reference = tx_ref || orderData.payment_reference;
    const chapaResponse = await fetch(`https://api.chapa.co/v1/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const chapaData = await chapaResponse.json();

    if (!chapaResponse.ok || chapaData.status !== "success") {
      console.log("Payment verification failed:", chapaData);
      return new Response(
        JSON.stringify({ success: false, status: "pending", message: "Payment is still pending or failed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Payment is successful, update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "completed" })
      .eq("id", orderData.id);

    if (updateError) {
      console.error("Order update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update order status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update ticket remaining count
    const { data: ticketData, error: ticketError } = await supabase
      .from("tickets")
      .select("remaining")
      .eq("id", orderData.ticket_id)
      .single();

    if (!ticketError && ticketData) {
      const newRemaining = ticketData.remaining - orderData.quantity;
      await supabase
        .from("tickets")
        .update({ remaining: Math.max(0, newRemaining) })
        .eq("id", orderData.ticket_id);
    }

    return new Response(
      JSON.stringify({ success: true, status: "completed", order: orderData }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
