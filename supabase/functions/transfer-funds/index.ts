
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
    console.log("Starting transfer funds process");
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Authenticate the user
    const { data: authData, error: authError } = await supabase.auth.getUser(
      req.headers.get("Authorization")?.split("Bearer ")[1] || ""
    );

    if (authError || !authData.user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { eventId, account_name, account_number, bank_code } = body;
    console.log("Transfer request body:", { eventId, account_name, bank_code });

    if (!eventId || !account_name || !account_number || !bank_code) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user is the organizer of this event
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .eq("organizer_id", authData.user.id)
      .single();

    if (eventError || !eventData) {
      console.error("Event verification error:", eventError);
      return new Response(
        JSON.stringify({ error: "You are not authorized to transfer funds for this event" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate total pending transfers for this event
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("organizer_amount")
      .eq("event_id", eventId)
      .eq("payment_status", "completed")
      .eq("organizer_transfer_status", "pending");

    if (ordersError) {
      console.error("Orders fetch error:", ordersError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch pending transfers" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate total amount to transfer
    const totalAmount = ordersData.reduce(
      (sum, order) => sum + (parseFloat(order.organizer_amount) || 0), 
      0
    );

    console.log("Total amount to transfer:", totalAmount);

    if (totalAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "No funds available for transfer" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a unique reference for this transfer
    const transferReference = `TRX-${eventId.substring(0, 8)}-${Date.now()}`;
    console.log("Generated transfer reference:", transferReference);

    // Initiate transfer with Chapa
    const chapaPayload = {
      account_name: account_name,
      account_number: account_number,
      amount: totalAmount.toString(),
      currency: "ETB",
      reference: transferReference,
      bank_code: bank_code
    };

    console.log("Sending transfer request to Chapa");
    const chapaResponse = await fetch("https://api.chapa.co/v1/transfers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chapaPayload),
    });

    const chapaData = await chapaResponse.json();
    console.log("Chapa transfer response:", chapaData);

    if (chapaData.status !== "success") {
      console.error("Chapa transfer error:", chapaData);
      return new Response(
        JSON.stringify({ 
          error: chapaData.message || "Transfer failed", 
          details: chapaData 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a transfer record in our database
    const { data: transferData, error: transferError } = await supabase
      .from("transfers")
      .insert({
        event_id: eventId,
        organizer_id: authData.user.id,
        amount: totalAmount,
        reference: transferReference,
        status: "processing",
        account_details: {
          account_name,
          account_number,
          bank_code
        }
      })
      .select()
      .single();

    if (transferError) {
      console.error("Transfer record error:", transferError);
      return new Response(
        JSON.stringify({ error: "Failed to record transfer" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update orders to mark them as transferred
    const { error: updateError } = await supabase
      .from("orders")
      .update({ 
        organizer_transfer_status: "completed",
        transfer_reference: transferReference,
        transfer_date: new Date().toISOString()
      })
      .eq("event_id", eventId)
      .eq("payment_status", "completed")
      .eq("organizer_transfer_status", "pending");

    if (updateError) {
      console.error("Orders update error:", updateError);
    }

    console.log("Transfer process completed successfully");
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Transfer queued successfully",
        transfer: transferData,
        reference: transferReference
      }),
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
