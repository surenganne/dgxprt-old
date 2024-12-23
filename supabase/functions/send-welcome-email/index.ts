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
          <p>Your account has been created successfully. Here are your login credentials:</p>
          <p><strong>Email:</strong> ${to}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
          <p>Please follow these steps to access your account:</p>
          <ol>
            <li>Click on this link to go to the login page: <a href="${loginLink}">Login to DGXPRT</a></li>
            <li>Your email will be pre-filled</li>
            <li>Enter the temporary password provided above</li>
            <li>After logging in, you'll be prompted to set a new password</li>
          </ol>
          <p>For security reasons, please change your password upon first login.</p>
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