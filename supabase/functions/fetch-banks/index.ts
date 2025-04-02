
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Call Chapa API to get list of banks
    const chapaResponse = await fetch("https://api.chapa.co/v1/banks", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const chapaData = await chapaResponse.json();

    if (!chapaResponse.ok) {
      console.error("Chapa banks error:", chapaData);
      return new Response(
        JSON.stringify({ error: "Failed to fetch banks" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(chapaData),
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
