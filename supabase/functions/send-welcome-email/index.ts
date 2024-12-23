import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  password: string;
  loginLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, password, loginLink } = await req.json() as EmailRequest;

    console.log("Sending welcome email to:", to);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev", // Using Resend's verified domain
        to: [to],
        subject: "Welcome to DGXPRT - Your Login Credentials",
        html: `
          <h2>Welcome to DGXPRT</h2>
          <p>Your account has been created. Here are your login credentials:</p>
          <p><strong>Email:</strong> ${to}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
          <p>Please click the link below to log in:</p>
          <p><a href="${loginLink}">Login to DGXPRT</a></p>
          <p>For security reasons, you will be prompted to change your password after your first login.</p>
          <p>If you didn't request this account, please ignore this email.</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(error);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);