import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, password, loginLink } = await req.json();
    console.log("[send-welcome-email] Processing request for:", to);

    if (!to || !password || !loginLink) {
      console.error("[send-welcome-email] Missing required parameters");
      return new Response(
        JSON.stringify({ error: 'Required parameters missing' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("[send-welcome-email] RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("[send-welcome-email] Sending email via Resend...");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "no-reply@incepta.ai",
        to: [to],
        subject: "Welcome to DGXPRT - Your Account Details",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to DGXPRT</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background-color: #00005B;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 5px 5px 0 0;
                }
                .content {
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
                  border-radius: 0 0 5px 5px;
                }
                .credentials {
                  background-color: #f5f5f5;
                  padding: 15px;
                  margin: 15px 0;
                  border-radius: 5px;
                  border: 1px solid #e0e0e0;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #895AB7;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 15px 0;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 12px;
                  color: #666666;
                }
                .important-note {
                  color: #d32f2f;
                  font-weight: bold;
                  margin: 15px 0;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Welcome to DGXPRT</h1>
              </div>
              <div class="content">
                <p>Your DGXPRT account has been created successfully. Here are your login credentials:</p>
                
                <div class="credentials">
                  <p><strong>Email:</strong> ${to}</p>
                  <p><strong>Temporary Password:</strong> ${password}</p>
                </div>

                <p class="important-note">Please note: This is a temporary password. You will be required to change it upon your first login.</p>

                <p>To access your account, please follow these steps:</p>
                <ol>
                  <li>Click the button below to go to the login page</li>
                  <li>Enter your email address</li>
                  <li>Enter the temporary password provided above</li>
                  <li>You will be prompted to change your password upon first login</li>
                </ol>

                <a href="${loginLink}" class="button" style="color: white;">Login to DGXPRT</a>

                <p><strong>Important Security Notice:</strong></p>
                <ul>
                  <li>For security reasons, please change your password immediately after your first login.</li>
                  <li>Keep your credentials confidential and do not share them with anyone.</li>
                  <li>If you did not request this account, please contact your system administrator immediately.</li>
                </ul>
                
                <p>If you have any questions or need assistance, please contact your system administrator.</p>
              </div>
              
              <div class="footer">
                <p>This is an automated message from DGXPRT. Please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} DGXPRT. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[send-welcome-email] Error sending email:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("[send-welcome-email] Email sent successfully:", data);

    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error("[send-welcome-email] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});