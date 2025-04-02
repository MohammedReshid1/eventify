
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
    const { eventId, ticketId, quantity, userId, first_name, last_name, email, phone } = body;

    if (!eventId || !ticketId || !quantity || !email || !first_name || !last_name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing ticket purchase:", { eventId, ticketId, quantity, email });

    // Get ticket information
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('*, events(title, organizer_id)')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticketData) {
      console.error('Ticket fetch error:', ticketError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch ticket information" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if ticket is free
    const isFreeTicket = ticketData.price === 0 || ticketData.type === 'free';
    
    // Check if we have enough tickets left
    if (ticketData.remaining < quantity) {
      return new Response(
        JSON.stringify({ error: "Not enough tickets available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate total amount
    const unitPrice = parseFloat(ticketData.price);
    const totalAmount = unitPrice * quantity;
    
    // Platform fee (5%)
    const platformFeePercentage = 0.05;
    const platformFee = totalAmount * platformFeePercentage;
    const organizerAmount = totalAmount - platformFee;

    console.log("Payment details:", { 
      totalAmount: totalAmount.toFixed(2), 
      platformFee: platformFee.toFixed(2), 
      organizerAmount: organizerAmount.toFixed(2) 
    });

    // Create an order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        event_id: eventId,
        ticket_id: ticketId,
        user_id: userId,
        quantity: quantity,
        total_amount: totalAmount,
        commission_amount: platformFee,
        organizer_amount: organizerAmount,
        payment_status: isFreeTicket ? 'completed' : 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For free tickets, we can update the ticket count immediately
    if (isFreeTicket) {
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ remaining: ticketData.remaining - quantity })
        .eq('id', ticketId);

      if (updateError) {
        console.error('Ticket update error:', updateError);
        // We don't need to return an error here, the order is still valid
      }
      
      // Return success for free tickets
      return new Response(
        JSON.stringify({ 
          success: true, 
          order: orderData,
          isFree: true 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For paid tickets, we need to create a Chapa payment
    // Initialize Payment with Chapa
    const tx_ref = `ORD-${orderData.id}`;
    
    const paymentData = {
      amount: totalAmount.toString(),
      currency: "ETB",
      tx_ref: tx_ref,
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone || "",
      callback_url: `${req.headers.get('origin')}/payment-callback?order_id=${orderData.id}&tx_ref=${tx_ref}`,
      return_url: `${req.headers.get('origin')}/payment-callback?order_id=${orderData.id}&tx_ref=${tx_ref}`,
      "customization[title]": `Eventify - ${ticketData.events.title}`,
      "customization[description]": `${quantity} × ${ticketData.name || 'Ticket'}`,
    };

    console.log("Initializing Chapa payment:", { tx_ref });

    // Update order with transaction reference
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_reference: tx_ref })
      .eq('id', orderData.id);

    if (updateError) {
      console.error('Order update error:', updateError);
    }

    // Call Chapa API
    const chapaResponse = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const chapaData = await chapaResponse.json();
    console.log("Chapa API response:", chapaData);

    if (chapaData.status !== "success") {
      console.error("Chapa payment error:", chapaData);
      
      // Update order to failed
      await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', orderData.id);
        
      return new Response(
        JSON.stringify({ 
          error: chapaData.message || "Payment initialization failed", 
          details: chapaData 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checkout_url: chapaData.data.checkout_url,
        tx_ref: tx_ref,
        order_id: orderData.id
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
