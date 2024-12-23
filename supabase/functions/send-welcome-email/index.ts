import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, password, loginLink } = await req.json();

    if (!to || !password || !loginLink) {
      return new Response(
        JSON.stringify({ error: 'Required parameters missing' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fromEmail = "noreply@dgxprt.incepta.ai";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: "Welcome to DGXPRT - Your Login Credentials",
        html: `
          <h1>Welcome to DGXPRT!</h1>
          <p>Your account has been created successfully. Here are your temporary login credentials:</p>
          <p><strong>Email:</strong> ${to}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
          <p>For security reasons, please follow these steps:</p>
          <ol>
            <li>Visit the login page at: ${loginLink}</li>
            <li>Sign in using your email and the temporary password provided above</li>
            <li>After signing in, you will be prompted to change your password</li>
            <li>Choose a strong, unique password that you'll remember</li>
          </ol>
          <p>This temporary password will expire once you set your new password.</p>
          <p>If you have any questions, please contact your administrator.</p>
          <p>Best regards,<br>The DGXPRT Team</p>
        `,
      }),
    });

    const data = await res.json();

    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});