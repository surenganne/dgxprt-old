import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    const { email, fullName, isAdmin, status } = await req.json();
    console.log("[create-user] Creating user:", { email, fullName, isAdmin, status });

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if user already exists
    console.log("[create-user] Checking if user exists...");
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error("[create-user] Error checking existing user:", userError);
      throw userError;
    }

    let userId;

    if (existingUser) {
      console.log("[create-user] User exists, updating profile...");
      userId = existingUser.id;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          is_admin: isAdmin,
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error("[create-user] Error updating profile:", updateError);
        throw updateError;
      }
    } else {
      // Generate magic link for new user
      console.log("[create-user] Generating magic link...");
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: `${req.headers.get('origin')}/auth`,
        }
      });

      if (linkError || !linkData) {
        console.error("[create-user] Error generating link:", linkError);
        throw linkError || new Error("Failed to generate magic link");
      }

      userId = linkData.user.id;
      if (!userId) {
        throw new Error("No user ID returned from auth");
      }

      // Create profile for new user
      console.log("[create-user] Creating profile for user:", userId);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          full_name: fullName,
          is_admin: isAdmin,
          status: status,
        });

      if (profileError) {
        console.error("[create-user] Error creating profile:", profileError);
        throw profileError;
      }
    }

    // Send welcome email
    console.log("[create-user] Sending welcome email...");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "no-reply@incepta.ai",
        to: [email],
        subject: "Welcome to DGXPRT - Set Up Your Account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #00005B; text-align: center;">Welcome to DGXPRT</h1>
            
            <p>Hello ${fullName},</p>
            
            <p>Your DGXPRT account has been created. To get started, please click the button below to set up your password and access your account:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${req.headers.get('origin')}/auth?email=${encodeURIComponent(email)}&temp=true" 
                 style="background-color: #895AB7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Set Up Your Account
              </a>
            </div>
            
            <p><strong>Important Security Notice:</strong></p>
            <ul>
              <li>This link will expire in 24 hours</li>
              <li>Keep your credentials confidential</li>
              <li>If you did not request this account, please contact your system administrator</li>
            </ul>
            
            <p>If you have any questions, please contact your system administrator.</p>
            
            <div style="text-align: center; margin-top: 30px; color: #666;">
              <p>This is an automated message from DGXPRT. Please do not reply.</p>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[create-user] Error sending email:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    console.log("[create-user] Process completed successfully");
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[create-user] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});