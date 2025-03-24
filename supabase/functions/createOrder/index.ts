import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  try {
    // Handle preflight requests (OPTIONS)
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Parse request body
    const { amount, currency, receipt, foodCourtId } = await req.json();

    // Razorpay credentials
    const razorpayKeyId = Deno.env.get("EXPO_PUBLIC_RZRPAY_KEY");
    const razorpayKeySecret = Deno.env.get("EXPO_PUBLIC_RZRPAY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials are missing");
    }

    // Call Razorpay API
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`, // Razorpay authorization
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: currency || "INR",
        receipt: receipt || `receipt_${Date.now()}`,
        notes: { foodCourtId },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify({ error }), {
        status: response.status,
        headers: corsHeaders,
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
