import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    console.log("[send-password-reset] Received request for email:", email);

    if (!email) {
      throw new Error("Email is required");
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Generate a sign-in link
    const { data: { user }, error: signInError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (signInError) {
      console.error("[send-password-reset] Error generating link:", signInError);
      throw signInError;
    }

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "DGXPRT <no-reply@dgxprt.ai>",
        to: [email],
        subject: "Reset Your Password - DGXPRT",
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <p><a href="${user?.confirmation_sent_at}">Reset Password</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Best regards,<br>DGXPRT Team</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[send-password-reset] Error sending email:", error);
      throw new Error("Failed to send password reset email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[send-password-reset] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});